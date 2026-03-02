import { NextRequest, NextResponse } from "next/server";
import { initDatabase, addPoke } from "@/lib/database";

export async function POST(request: NextRequest) {
  initDatabase();
  const { from_role, poke_type } = await request.json();
  addPoke(from_role, poke_type);
  return NextResponse.json({ success: true });
}
