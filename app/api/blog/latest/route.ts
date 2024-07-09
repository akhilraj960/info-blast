import { NextApiRequest, NextApiResponse } from "next";
import Blog from "@/lib/models/Blog";
import { NextResponse } from "next/server";
import { connectDb } from "@/lib/mongoose";

export async function POST(request: Request) {
  try {
    await connectDb();

    const { page, maxLimit } = await request.json();

    const result = await Blog.aggregate([
      {
        $match: { draft: false },
      },
      {
        $sort: { publishedAt: -1 },
      },
      {
        $skip: (page - 1) * maxLimit,
      },
      {
        $limit: maxLimit,
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
          activity: 1,
          tags: 1,
          publishedAt: 1,
          "author.personal_info.profile_img": 1,
          "author.personal_info.username": 1,
          "author.personal_info.firstName": 1,
          "author.personal_info.lastName": 1,
          _id: 1,
        },
      },
    ]);

    return NextResponse.json({ blogs: result }, { status: 200 });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
