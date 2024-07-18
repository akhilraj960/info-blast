import { Blog } from "@/types/types";
import React from "react";
import { BlogIntraction } from "./BlogIntraction";
import dayjs from "dayjs";
import Image from "next/image";
import { BlogContent } from "./BlogContent";
import { Button } from "./ui/button";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";

export const BlogView = ({ blogData }: { blogData: Blog }) => {
  const {
    _id,
    title,
    banner,
    description,
    content,
    tags,
    author,
    author: {
      personal_info: { username, profile_img },
    },
    activity: { total_likes, total_comments },
    publishedAt,
  } = blogData;

  const { user } = useUser();

  const userId = user?.publicMetadata.userId;

  return (
    <div>
      <Image
        src={banner}
        height={800}
        width={800}
        alt="banner"
        className="mt-4 w-full aspect-video object-cover"
      />
      <h2 className="max-sm:text-xl max-md:text-2xl mt-2">{title}</h2>
      <div className="w-full flex justify-between items-center">
        <p className="text-[12px] text-primary/60 mt-4">
          {dayjs(publishedAt).format("ddd, MMMM D,YYYY")}
        </p>
        {author._id === userId && (
          <Link
            href={`/update/${_id}`}
            className="text-sm px-4 py-1 rounded-full bg-primary/10"
          >
            Edit
          </Link>
        )}
      </div>
      <BlogIntraction
        profile={profile_img}
        username={username}
        likes={total_likes}
        comments={total_comments}
        blogId={_id}
      />

      <p className="p-1 px-2 mt-6 rounded-full bg-primary/20 text-sm max-w-max capitalize">
        #{tags[0]}
      </p>

      <BlogContent block={content} />

      <BlogIntraction
        profile={profile_img}
        username={username}
        likes={total_likes}
        comments={total_comments}
        blogId={_id}
      />
    </div>
  );
};
