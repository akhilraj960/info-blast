import { NextApiRequest, NextApiResponse } from "next";
import Blog from "@/lib/models/Blog";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();

  const { page, maxLimit } = body;

  const result = await Blog.aggregate([
    {
      $match: { draft: false },
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
        _id: 0,
      },
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
  ]);

  return NextResponse.json({ blogs: result }, { status: 200 });
}
