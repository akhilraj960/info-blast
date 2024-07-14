import Blog from "@/lib/models/Blog";
import Like from "@/lib/models/Like";
import { NextRequest, NextResponse } from "next/server";
import { Types } from "mongoose";

interface PostType extends Document {
  title: string;
  content: string;
  likes: { userId: Types.ObjectId }[];
}

export async function POST(req: NextRequest) {
  try {
    const { userId, blogId } = await req.json();

    const existingLike = await Like.findOne({ blogId, "likes.userId": userId });

    if (existingLike) {
      await Promise.all([
        Like.updateOne({ blogId }, { $pull: { likes: { userId } } }),
        Blog.findByIdAndUpdate(blogId, {
          $inc: { "activity.total_likes": -1 },
        }),
      ]);

      return NextResponse.json({ Liked: false });
    }

    await Promise.all([
      Like.findOneAndUpdate(
        { blogId },
        { $push: { likes: { userId } } },
        { new: true, upsert: true }
      ),
      Blog.findByIdAndUpdate(blogId, { $inc: { "activity.total_likes": 1 } }),
    ]);

    return NextResponse.json({ Liked: true });
  } catch (error) {
    console.error("Error in POST request:", error);
    return NextResponse.json({ message: "An error occurred" }, { status: 500 });
  }
}
