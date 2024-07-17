import Blog from "@/lib/models/Blog";
import Like from "@/lib/models/Like";
import { connectDb } from "@/lib/mongoose";
import { auth } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { blogId } = body;

    if (!userId) {
      return NextResponse.json(
        { message: "Not authenticated!" },
        { status: 401 }
      );
    }

    if (!blogId) {
      return NextResponse.json({ message: "Missing data!" }, { status: 404 });
    }

    const user = await clerkClient.users.getUser(userId);

    if (!user) {
      return NextResponse.json({ message: "User not found!" }, { status: 404 });
    }

    const collectionId = user.publicMetadata.userId;

    if (!collectionId) {
      return NextResponse.json(
        { message: "User information is incomplete" },
        { status: 400 }
      );
    }

    await connectDb();

    const isExist = await Like.findOne({ blog: blogId, user: collectionId });

    if (!isExist) {
      const newLike = new Like({
        user: collectionId,
        blog: blogId,
      });

      await newLike.save().then(async () => {
        await Blog.findByIdAndUpdate(blogId, {
          $inc: { "activity.total_likes": 1 },
        });
      });

      return NextResponse.json(
        { message: "Like added successfully", Liked: true },
        { status: 201 }
      );
    }

    await Like.findOneAndDelete({ blog: blogId, user: collectionId }).then(
      async () => {
        await Blog.findByIdAndUpdate(blogId, {
          $inc: { "activity.total_likes": -1 },
        });
      }
    );

    return NextResponse.json(
      { message: "Like removed successfully", Liked: false },
      { status: 202 }
    );
  } catch (error: any) {
    console.error("Error handling like:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
