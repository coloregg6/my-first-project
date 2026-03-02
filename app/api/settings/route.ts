import { NextResponse } from "next/server";
import { initDatabase, getSetting } from "@/lib/database";

function calculateDaysTogether(startDate: string) {
  const start = new Date(startDate);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

export async function GET() {
  initDatabase();
  const startDate = getSetting("start_date") || "2022-03-01";
  const resolvedCount = getSetting("resolved_count");
  const daysTogether = calculateDaysTogether(startDate);

  return NextResponse.json({
    start_date: startDate,
    days_together: daysTogether,
    resolved_count: resolvedCount || 0,
  });
}
