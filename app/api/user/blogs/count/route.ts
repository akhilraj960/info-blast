import User from "@/lib/models/User"; // Adjust the path as per your project structure
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username } = body;

    // Find user by username and retrieve blogs length
    const result = await User.findOne(
      { "personal_info.username": username },
      { blogs: 1 }
    );

    // Check if user exists
    if (!result) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const blogsLength = result.blogs.length;

    return NextResponse.json({ totalDocs: blogsLength-1 });
  } catch (error: any) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
