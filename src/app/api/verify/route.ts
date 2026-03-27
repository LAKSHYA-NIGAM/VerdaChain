import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Credit } from "@/models/Credit";
import { Verification } from "@/models/Verification";
import { generateTxHash } from "@/lib/blockchain";
import { analyzeCredit, getKnownMetadata } from "@/lib/risk-engine";
import type { VerifyResponse } from "@/lib/types";
import { getInMemoryStore } from "@/lib/store";

// ─── POST /api/verify ─────────────────────────────────────────────────────────

export async function POST(request: Request) {
  try {
    // Parse and validate request body
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

    // Run risk analysis
    const analysis = analyzeCredit(creditId);

    // Check if DB has better metadata for this credit
    let dbConnected = false;
    try {
      await connectDB();
      dbConnected = true;

      const dbCredit = await Credit.findOne({ creditId }).lean();
      if (dbCredit) {
        // Override with DB metadata if available
        analysis.metadata = {
          projectName: dbCredit.projectName,
          registry: dbCredit.registry,
          location: dbCredit.location,
          issuedCredits: dbCredit.issuedCredits,
        };
      }
    } catch {
      // MongoDB unavailable — analysis.metadata from risk engine is used
      console.warn("[/api/verify] MongoDB unavailable, using in-memory fallback");
    }

    // Generate blockchain transaction hash
    const txHash = generateTxHash(creditId);
    const timestamp = new Date();

    // Build verification record
    const record = {
      creditId,
      riskScore: analysis.riskScore,
      status: analysis.status,
      flags: analysis.flags,
      metadata: analysis.metadata,
      txHash,
      timestamp,
    };

    // Persist: MongoDB first, fallback to memory
    if (dbConnected) {
      try {
        await Verification.create(record);
      } catch (saveErr) {
        console.warn("[/api/verify] MongoDB save failed, using memory:", saveErr);
        getInMemoryStore().push({ ...record });
      }
    } else {
      getInMemoryStore().push({ ...record });
    }

    // Build response
    const response: VerifyResponse = {
      creditId: record.creditId,
      riskScore: record.riskScore,
      status: record.status,
      flags: record.flags,
      metadata: record.metadata,
      txHash: record.txHash,
      timestamp: record.timestamp.toISOString(),
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("[/api/verify] Unhandled error:", error);
    return NextResponse.json(
      { error: "Internal server error. Please try again." },
      { status: 500 }
    );
  }
}
