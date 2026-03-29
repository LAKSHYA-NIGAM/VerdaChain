import { NextRequest, NextResponse } from "next/server";
import { insertVerification, getVerifications } from "@/lib/db";

// ─── POST /api/verifications — Save a new verification ────────────────────────

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const record = await insertVerification(body);
    return NextResponse.json(record, { status: 201 });
  } catch (error) {
    console.error("[/api/verifications] POST error:", error);
    return NextResponse.json(
      { error: "Failed to save verification" },
      { status: 500 }
    );
  }
}

// ─── GET /api/verifications — Fetch all verifications ─────────────────────────

export async function GET() {
  try {
    const records = await getVerifications();
    return NextResponse.json(records);
  } catch (error) {
    console.error("[/api/verifications] GET error:", error);
    return NextResponse.json([], { status: 200 });
  }
}
