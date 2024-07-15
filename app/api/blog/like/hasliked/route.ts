import Like from "@/lib/models/Like";
import { connectDb } from "@/lib/mongoose";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { Types } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

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

    const user = await clerkClient.users.getUser(userId);

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const collectionId = user.publicMetadata.userId;

    await connectDb();

    const body = await req.json();
    const { blogId } = body;

    const existingLike = await Like.findOne({
      blogId: blogId,
      "likes.userId": collectionId,
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
