import Blog from "@/lib/models/Blog";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const result = await Blog.aggregate([
      { $match: { draft: false } },
      {
        $lookup: {
          from: "users",
          localField: "author",
          foreignField: "_id",
          as: "author",
        },
      },
      { $unwind: "$author" },
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
        },
      },
      {
        $sort: {
          "activity.total_reads": -1,
          "activity.total_likes": -1,
          publishedAt: -1,
        },
      },
      { $limit: 5 },
    ]);

    return NextResponse.json({ blog: result }, { status: 200 });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return NextResponse.json(
      { error: "Failed to fetch blogs" },
      { status: 500 }
    );
  }
}
