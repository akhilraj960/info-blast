import Like from "@/lib/models/Like";
import { connectDb } from "@/lib/mongoose";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId } = auth();
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
      return NextResponse.json({ Liked: false });
    }

    return NextResponse.json({ Liked: true });
  } catch (error: any) {
    console.error("Error handling hasliked:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
