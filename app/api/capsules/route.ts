import { NextRequest, NextResponse } from "next/server";
import { initDatabase, addCapsule, getUnlockedCapsules } from "@/lib/database";

export async function GET() {
  initDatabase();
  const capsules = getUnlockedCapsules();
  return NextResponse.json(capsules);
}

export async function POST(request: NextRequest) {
  initDatabase();
  const { content, image_url, unlock_time } = await request.json();
  addCapsule(content, image_url || "", unlock_time);
  return NextResponse.json({ success: true });
}
