import Blog from "@/lib/models/Blog";
import { connectDb } from "@/lib/mongoose";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    await connectDb()
    const count = await Blog.countDocuments({ draft: false });
    return NextResponse.json({ totalDocs: count });
  } catch (error: any) {
    return NextResponse.json({ error: error.message });
  }
}
