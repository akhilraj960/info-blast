import Blog from "@/lib/models/Blog";
import Like from "@/lib/models/Like";
import { NextRequest, NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { connectDb } from "@/lib/mongoose";

export async function POST(req: NextRequest) {
  try {
    if (req.method !== "POST") {
      return NextResponse.json(
        { message: "Method Not Allowed" },
        { status: 405 }
      );
    }

    const { userId } = auth();

    if (!userId) {
      return NextResponse.json(
        { message: "You are not authenticated" },
        { status: 401 }
      );
    }

    await connectDb();

    const { blogId } = await req.json();

    const user = await clerkClient.users.getUser(userId);

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const collectionId = user.publicMetadata.userId;

    const existingLike = await Like.findOne({
      blogId,
      "likes.userId": collectionId,
    });

    if (existingLike) {
      await Promise.all([
        Like.updateOne({ blogId }, { $pull: { likes: { collectionId } } }),
        Blog.findByIdAndUpdate(
          blogId,
          {
            $inc: { "activity.total_likes": -1 },
          },
          { new: true }
        ), // Ensure you get the updated document
      ]);

      return NextResponse.json({ Liked: false });
    }

    await Promise.all([
      Like.findOneAndUpdate(
        { blogId },
        { $push: { likes: { collectionId } } },
        { new: true, upsert: true }
      ),
      Blog.findByIdAndUpdate(
        blogId,
        {
          $inc: { "activity.total_likes": 1 },
        },
        { new: true }
      ), // Ensure you get the updated document
    ]);

    return NextResponse.json({ Liked: true });
  } catch (error) {
    console.error("Error in POST request:", error);
    return NextResponse.json({ message: "An error occurred" }, { status: 500 });
  }
}
