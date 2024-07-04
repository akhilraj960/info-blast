import { Blog } from "@/types/types";
import React from "react";
import { BlogIntraction } from "./BlogIntraction";
import dayjs from "dayjs";
import Image from "next/image";
import { BlogContent } from "./BlogContent";

export const BlogView = ({ blogData }: { blogData: Blog }) => {
  const {
    title,
    banner,
    description,
    content,
    tags,
    author: {
      personal_info: { username, profile_img },
    },
    activity: { total_likes, total_comments },
    publishedAt,
  } = blogData;


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
      <p className="text-[12px] text-primary/60 mt-4">
        {dayjs(publishedAt).format("ddd, MMMM D,YYYY")}
      </p>
      <BlogIntraction
        profile={profile_img}
        username={username}
        likes={total_likes}
        comments={total_comments}
      />
      <BlogContent block={content}/>
    </div>
  );
};
