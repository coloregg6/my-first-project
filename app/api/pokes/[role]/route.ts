import { NextResponse } from "next/server";
import { initDatabase, getUnreadPokes } from "@/lib/database";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ role: string }> }
) {
  initDatabase();
  const { role } = await params;
  const pokes = getUnreadPokes(role);
  return NextResponse.json(pokes);
}
