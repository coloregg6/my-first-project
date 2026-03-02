import { NextRequest, NextResponse } from "next/server";
import { initDatabase, verifyUser } from "@/lib/database";

export async function GET(request: NextRequest) {
  initDatabase();
  const { searchParams } = request.nextUrl;
  const role = searchParams.get("role") || "";
  const pin = searchParams.get("pin") || "";

  const user = verifyUser(role, pin);

  if (user) {
    return NextResponse.json({
      success: true,
      user: { role: user.role, name: user.name, avatar: user.avatar },
    });
  } else {
    return NextResponse.json({ success: false, message: "暗号错误" });
  }
}
