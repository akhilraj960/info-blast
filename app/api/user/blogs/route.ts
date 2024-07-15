import Blog from "@/lib/models/Blog";
import { connectDb } from "@/lib/mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, page = 1, maxLimit = 10 } = body;

    if (!username) {
      return NextResponse.json(
        { message: "Username not specified" },
        { status: 400 }
      );
    }

    await connectDb();

    // Set a longer timeout
    await Blog.db.db.command({ ping: 1 }); // Ensure the connection is established

    const result = await Blog.aggregate([
      { $match: { draft: false } },
      {
        $lookup: {
          from: "users",
          let: { authorId: "$author" },
          pipeline: [
            { $match: { $expr: { $eq: ["$_id", "$$authorId"] } } },
            { $project: { personal_info: 1 } }
          ],
          as: "author",
        },
      },
      { $unwind: "$author" },
      { $match: { "author.personal_info.username": username } },
      { $sort: { publishedAt: -1 } },
      { $skip: (page - 1) * maxLimit },
      { $limit: maxLimit },
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
        },
      },
    ]).option({ maxTimeMS: 20000 }); // Increase the max time allowed for the query

    if (result.length === 0) {
      return NextResponse.json({ message: "Data not found" }, { status: 404 });
    }

    return NextResponse.json({ blogs: result }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
