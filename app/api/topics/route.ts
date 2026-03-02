import { NextRequest, NextResponse } from "next/server";
import { initDatabase, addTopic, getTopics } from "@/lib/database";

export async function GET() {
  initDatabase();
  const topics = getTopics();
  return NextResponse.json(topics);
}

export async function POST(request: NextRequest) {
  initDatabase();
  const { content, priority } = await request.json();
  addTopic(content, priority);
  return NextResponse.json({ success: true });
}
