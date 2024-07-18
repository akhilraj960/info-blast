import Blog from "@/lib/models/Blog";
import { connectDb } from "@/lib/mongoose";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json(
        {
          message: "You are not authenticated",
        },
        { status: 401 }
      );
    }

    const { title, banner, content, tags, description, draft } =
      body.blog;

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

    await connectDb();

    const result = await Blog.findByIdAndUpdate(
      body.blogId,
      { title, banner, content, tags, description, draft },
      { new: true } // Return the updated document
    );

    if (!result) {
      return NextResponse.json(
        { message: "Error in updating blog" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Update successful", success: true, blogId: result._id },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "An error occurred while processing your request" },
      { status: 500 }
    );
  }
}
