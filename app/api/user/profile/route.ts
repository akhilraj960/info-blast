import User from "@/lib/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { username } = body;
    const userData = await User.findOne({
      "personal_info.username": username,
    }).select("account_info personal_info");

    if (!userData) {
      return NextResponse.json({ message: "User Not Found" }, { status: 404 });
    }

    return NextResponse.json({ user: userData });
  } catch (error) {
    console.log(error);
  }
}
