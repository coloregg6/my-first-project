import { NextRequest, NextResponse } from "next/server";
import { initDatabase, resolveTopic } from "@/lib/database";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  initDatabase();
  const { id } = await params;
  const { resolution } = await request.json();
  resolveTopic(parseInt(id), resolution);
  return NextResponse.json({ success: true });
}
