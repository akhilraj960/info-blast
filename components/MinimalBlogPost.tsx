import dayjs from "dayjs";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Divider } from "./Divider";

export const MinimalBlogPost = ({
  content,
  index,
}: {
  content: any;
  index: number;
}) => {
  const {_id,
    title,
    blog_id,
    publishedAt,
    author: {
      personal_info: { username, profile_img },
    },
  } = content;

  return (
    <>
      <Link href={`/blog/${encodeURIComponent(_id)}`} className="flex gap-3">
        <h1>{index < 10 ? "0" + (index + 1) : index}</h1>
        <div>
          <div className="flex flex-col md:flex-row gap-2">
            <div className="flex items-center gap-4">
              <Image
                src={profile_img}
                alt="profile image"
                width={20}
                height={20}
                className="rounded-full w-6 h-6"
              />
              <p className="text-sm">@{username}</p>
            <p className="text-sm">{dayjs(publishedAt).format("dddd,MMMM D")}</p>
            </div>
          </div>
          <h6 className="mt-2 line-clamp-2 text-sm">{title}</h6>
        </div>
      </Link>
      <Divider className="my-6"/>
    </>
  );
};
