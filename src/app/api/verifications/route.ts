import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Verification } from "@/models/Verification";
import { getInMemoryStore, type InMemoryVerification } from "@/lib/store";

// ─── Response shape ──────────────────────────────────────────────────────────

interface VerificationResponse {
  _id?: string;
  creditId: string;
  riskScore: number;
  status: "High Risk" | "Medium Risk" | "Low Risk";
  flags: string[];
  metadata: {
    projectName: string;
    registry: string;
    location: string;
    issuedCredits: number;
  };
  txHash: string;
  timestamp: string;
}

// ─── GET /api/verifications ───────────────────────────────────────────────────

export async function GET() {
  try {
    const results: VerificationResponse[] = [];

    // 1. Try fetching from MongoDB
    try {
      await connectDB();
      const dbRecords = await Verification.find({})
        .sort({ timestamp: -1 })
        .lean();

      for (const doc of dbRecords) {
        results.push({
          _id: doc._id?.toString(),
          creditId: doc.creditId,
          riskScore: doc.riskScore,
          status: doc.status,
          flags: doc.flags,
          metadata: {
            projectName: doc.metadata.projectName,
            registry: doc.metadata.registry,
            location: doc.metadata.location,
            issuedCredits: doc.metadata.issuedCredits,
          },
          txHash: doc.txHash,
          timestamp: doc.timestamp instanceof Date
            ? doc.timestamp.toISOString()
            : String(doc.timestamp),
        });
      }
    } catch {
      console.warn("[/api/verifications] MongoDB unavailable, using memory store only");
    }

    // 2. Add in-memory records (deduplicated by txHash)
    const existingHashes = new Set(results.map((r) => r.txHash));
    const memoryRecords = getInMemoryStore();

    for (const mem of memoryRecords) {
      if (!existingHashes.has(mem.txHash)) {
        results.push({
          creditId: mem.creditId,
          riskScore: mem.riskScore,
          status: mem.status,
          flags: mem.flags,
          metadata: mem.metadata,
          txHash: mem.txHash,
          timestamp: mem.timestamp instanceof Date
            ? mem.timestamp.toISOString()
            : String(mem.timestamp),
        });
      }
    }

    // 3. Sort all results by timestamp descending
    results.sort((a, b) =>
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    console.error("[/api/verifications] Unhandled error:", error);
    return NextResponse.json(
      { error: "Failed to fetch verifications" },
      { status: 500 }
    );
  }
}
