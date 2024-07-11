"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import { Divider } from "./Divider";
import dayjs from "dayjs";
import { CiChat1, CiHeart } from "react-icons/ci";

export const BlogIntraction = ({
  profile,
  username,
  comments,
  likes,
}: {
  profile: string;
  username: string;
  comments: number;
  likes: number;
}) => {
  return (
    <>
      <Divider className="mt-6" />
      <div className="flex items-center justify-between px-4 my-4">
        <Link
          href={`/profile/${encodeURIComponent(username)}`}
          className="flex gap-4 items-center"
        >
          <div className="flex gap-1">
            <Image
              src={profile}
              height={20}
              width={20}
              alt="profile image"
              className="rounded-full"
            />
            <p className="text-sm">@{username}</p>
          </div>
          <Button
            variant={"outline"}
            className="border-none shadow-none hover:bg-transparent"
          >
            Follow
          </Button>
        </Link>
        <div>
          <div className="flex items-center gap-8">
            <p className="flex items-center text-sm text-primary/60">
              <CiHeart size={25} />
              {likes}
            </p>
            <p className="flex items-center text-sm text-primary/60">
              <CiChat1 size={25} />
              {comments}
            </p>
          </div>
        </div>
      </div>
      <Divider />
    </>
  );
};
