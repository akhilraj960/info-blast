import { NextRequest, NextResponse } from "next/server";
import { Types } from "mongoose"; // Import Types from mongoose for ObjectId
import Blog from "@/lib/models/Blog";
import { connectDb } from "@/lib/mongoose";
import User from "@/lib/models/User";

export async function POST(request: NextRequest) {
  try {
    await connectDb();

    const { blogId } = await request.json();

    if (!Types.ObjectId.isValid(blogId)) {
      return NextResponse.json(
        {
          message: "Invalid Blog ID",
        },
        { status: 400 }
      );
    }

    console.log("Fetching blog with ID:", blogId);

    await connectDb();

    const result = await Blog.aggregate([
      {
        $match: { _id: new Types.ObjectId(blogId) }, // Convert blogId to ObjectId
      },
      {
        $lookup: {
          from: "users",
          localField: "author",
          foreignField: "_id",
          as: "author",
        },
      },
      {
        $unwind: "$author",
      },
      {
        $project: {
          blog_id: 1,
          title: 1,
          description: 1,
          banner: 1,
          tags: 1,
          publishedAt: 1,
          content: 1,
          activity: 1,
          "author._id": 1,
          "author.personal_info.profile_img": 1,
          "author.personal_info.username": 1,
          "author.personal_info.firstName": 1,
          "author.personal_info.lastName": 1,
        },
      },
    ]);

    if (!result || result.length === 0) {
      return NextResponse.json(
        {
          message: "Blog not found",
        },
        { status: 404 }
      );
    }

    await User.findOneAndUpdate(
      { "personal_info.username": result[0].author.personal_info.username },
      { $inc: { "account_info.total_reads": 1 } }
    );

    return NextResponse.json({ blog: result[0] }, { status: 200 });
  } catch (error: any) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      {
        message: "Error on Fetching One Blog",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
