import Like from "@/lib/models/Like";
import { Types } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

interface PostType extends Document {
  title: string;
  content: string;
  likes: { userId: Types.ObjectId }[];
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, blogId } = body;

    const existingLike = await Like.findOne({
      blogId: blogId,
      "likes.userId": userId,
    });

    if (!existingLike) {
      return NextResponse.json({ Liked: false });
    }

    return NextResponse.json({ Liked: true });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "An error occurred" }, { status: 500 });
  }
}
