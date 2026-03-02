import { NextRequest, NextResponse } from "next/server";
import { initDatabase, addAchievement, getAchievements } from "@/lib/database";

export async function GET() {
  initDatabase();
  const achievements = getAchievements();
  return NextResponse.json(achievements);
}

export async function POST(request: NextRequest) {
  initDatabase();
  const { title, original_issue, resolution } = await request.json();
  addAchievement(title, original_issue, resolution);
  return NextResponse.json({ success: true });
}
