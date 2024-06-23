import Blog from "@/lib/models/Blog";
import User from "@/lib/models/User";
import { connectDb } from "@/lib/mongoose";
import { generateUrl } from "@/utils/urlGenerator";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json(
      { message: "You are not authenticated" },
      { status: 401 }
    );
  }

  const body = await request.json();

  let { title, banner, content, tags, description, draft } = body.blog;

  console.log(body.blog);

  console.log("########################");

  console.log(content);

  if (!title) {
    return NextResponse.json({ message: "Title is required" }, { status: 400 });
  }

  if (!banner) {
    return NextResponse.json(
      { message: "You must provide blog banner to publish it" },
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
      { message: "Provide tags in order to publish the blog,Maximum 10" },
      { status: 400 }
    );
  }

  tags = tags.map((tag: string) => tag.toLowerCase());

  const blog_id = generateUrl(title);

  connectDb();

  const newblog = new Blog({
    blog_id,
    title,
    banner,
    description,
    content: content.blocks[0].data,
    author: userId,
    tags,
    draft,
  });

  newblog.save().then((blog) => {
    let incrementVal = draft ? 0 : 1;

    User.findOneAndUpdate(
      { clerkId: userId },
      {
        $inc: { "account_info.total_posts": incrementVal },
        $push: { blogs: blog._id },
      }
    )
      .then((user) => {
        console.log(user);
      })
      .catch((error) => {
        return NextResponse.json(
          { message: "Failed to update total posts number" + error },
          { status: 500 }
        );
      })
      .catch((error) => {
        return NextResponse.json({ message: error.message }, { status: 500 });
      });
  });

  // Handle successful response
  return NextResponse.json({
    blog: { title, banner, content, tags, description },
  });
}
