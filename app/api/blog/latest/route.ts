import Blog from "@/lib/models/Blog";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();

  const { page } = body;

  const maxLimit = 5;

  Blog.find({ draft: false })
    .populate(
      "personal_info.profile_image personal_info.username personal_info.fullname -_id"
    )
    .sort({ publishedAt: -1 })
    .select("blog_id title description banner activity tags publishedAt -_id")
    .skip((page - 1) * maxLimit)
    .limit(maxLimit)
    .then((blogs) => {
      return NextResponse.json({ blogs }, { status: 200 });
    })
    .catch((error) => {
      return NextResponse.json({ message: error.message }, { status: 500 });
    });
}
