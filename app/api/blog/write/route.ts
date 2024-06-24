import Blog from "@/lib/models/Blog";
import User from "@/lib/models/User";
import { connectDb } from "@/lib/mongoose";
import { generateUrl } from "@/utils/urlGenerator";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json(
      { message: "You are not authenticated" },
      { status: 401 }
    );
  }

  try {
    const user = await clerkClient.users.getUser(userId);

    const collectionId = user.publicMetadata.userId;
    
    const body = await request.json();
    const { title, banner, content, tags, description, draft } = body.blog;

    if (!title) {
      return NextResponse.json(
        { message: "Title is required" },
        { status: 400 }
      );
    }

    if (!banner) {
      return NextResponse.json(
        { message: "You must provide a blog banner to publish it" },
        { status: 400 }
      );
    }

    if (!content || !content.blocks.length) {
      return NextResponse.json(
        { message: "There must be some blog content to publish it" },
        { status: 400 }
      );
    }

    if (!tags.length || tags.length > 10) {
      return NextResponse.json(
        { message: "Provide tags to publish the blog, maximum 10" },
        { status: 400 }
      );
    }

    const normalizedTags = tags.map((tag: string) => tag.toLowerCase());
    const blog_id = generateUrl(title);

    await connectDb();

    const newBlog = new Blog({
      blog_id,
      title,
      banner,
      description,
      content,
      author: collectionId,
      tags: normalizedTags,
      draft,
    });

    const savedBlog = await newBlog.save();

    const incrementVal = draft ? 0 : 1;

    await User.findOneAndUpdate(
      { clerkId: userId },
      {
        $inc: { "account_info.total_posts": incrementVal },
        $push: { blogs: savedBlog._id },
      }
    );

    return NextResponse.json(
      { message: "Blog created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { message: "An error occurred while processing your request" },
      { status: 500 }
    );
  }
}
