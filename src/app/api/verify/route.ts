import { NextResponse } from "next/server";
import { analyzeCredit } from "@/lib/risk-engine";
import { createHash } from "crypto";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

// ─── POST /api/verify ─────────────────────────────────────────────────────────
// Tries the Python AI backend first. If unavailable (e.g. on Vercel),
// falls back to the built-in risk engine.

export async function POST(request: Request) {
  try {
    let body: Record<string, unknown>;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      );
    }

    if (!body.creditId || typeof body.creditId !== "string" || !body.creditId.trim()) {
      return NextResponse.json(
        { error: "Credit ID is required and must be a non-empty string" },
        { status: 400 }
      );
    }

    const creditId = body.creditId.trim().toUpperCase();
    let result: Record<string, unknown>;

    // ── Strategy 1: Try the Python AI backend ──
    try {
      const backendRes = await fetch(`${BACKEND_URL}/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ creditId }),
        signal: AbortSignal.timeout(15000), // 15s timeout
      });

      if (backendRes.ok) {
        result = await backendRes.json();
      } else {
        throw new Error(`Backend returned ${backendRes.status}`);
      }
    } catch (backendErr) {
      // ── Strategy 2: Fall back to built-in risk engine ──
      console.warn("[/api/verify] Python backend unavailable, using local engine:", backendErr);

      const analysis = analyzeCredit(creditId);
      const resultString = JSON.stringify(analysis, Object.keys(analysis).sort());
      const sha256 = createHash("sha256").update(resultString).digest("hex");

      result = {
        creditId,
        riskScore: analysis.riskScore,
        status: analysis.status.toUpperCase(),
        flags: analysis.flags.map((f: string) => {
          if (analysis.riskScore > 65) return `❌ ${f}`;
          if (analysis.riskScore > 30) return `⚠️ ${f}`;
          return `✅ ${f}`;
        }),
        summary: `Local risk engine analysis: Credit ${creditId} scored ${analysis.riskScore}/100 (${analysis.status}). ${analysis.flags.length} risk indicator(s) detected.`,
        resultHash: `0x${sha256}`,
        project: analysis.metadata.projectName,
        location: analysis.metadata.location,
        issuer: analysis.metadata.registry,
        creditsIssued: analysis.metadata.issuedCredits,
      };
    }

    // Save to Neon DB (best-effort)
    try {
      await fetch(new URL("/api/verifications", request.url).toString(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result),
      });
    } catch (saveErr) {
      console.warn("[/api/verify] Failed to save to MongoDB:", saveErr);
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("[/api/verify] Unhandled error:", error);
    return NextResponse.json(
      { error: "Internal server error. Please try again." },
      { status: 500 }
    );
  }
}
