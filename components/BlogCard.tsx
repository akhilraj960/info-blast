"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import dayjs from "dayjs";
import { CiHeart, CiChat1 } from "react-icons/ci";

export const BlogCard = ({ content }: { content: any }) => {
  const {
    _id,
    blog_id,
    author: {
      personal_info: { firstName, lastName, username, profile_img },
    },
    title,
    banner,
    description,
    publishedAt,
    activity: { total_likes, total_comments },
  } = content;

  return (
    <>
      <div className="flex flex-col gap-4 mt-2">
        {/* author info  */}
        <Link href={"/"} className="flex items-center gap-5">
          <Image
            src={profile_img}
            width={20}
            height={20}
            alt="profile image"
            className="rounded-full w-6 h-6"
          />
          <p className="text-sm text-primary/80">@{username}</p>
        </Link>

        <Link
          href={`/blog/${encodeURIComponent(_id)}`}
          className="flex flex-col gap-4"
        >
          {/* blog content  */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-col gap-1">
              <h1 className="text-xl text-primary/90 line-clamp-2 max-sm:text-sm">
                {title}
              </h1>
              <p className="text-sm text-primary/80 line-clamp-2">
                {description}
              </p>
            </div>
            <div>
              <Image
                src={banner}
                alt="banner"
                width={125}
                height={125}
                className="min-w-40 aspect-video max-sm:min-w-28 object-cover"
              />
            </div>
          </div>
          {/* blog activity  */}
          <div className="flex items-center gap-8">
            <p className="text-sm text-primary/60">
              {dayjs(publishedAt).format("ddd, MMMM D,YYYY")}
            </p>
            <p className="flex items-center text-sm text-primary/60">
              <CiHeart size={25} />
              {total_likes}
            </p>
            <p className="flex items-center text-sm text-primary/60">
              <CiChat1 size={25} />
              {total_comments}
            </p>
          </div>
        </Link>
      </div>
      <hr className="mt-4" />
    </>
  );
};
