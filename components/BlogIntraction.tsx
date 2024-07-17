"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Divider } from "./Divider";
import { CiChat1, CiHeart } from "react-icons/ci";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export const BlogIntraction = ({
  profile,
  username,
  comments,
  likes,
  blogId,
}: {
  profile: string;
  username: string;
  comments: number;
  likes: number;
  blogId: string;
}) => {
  const [liked, setLiked] = useState<boolean | null>(null);
  const [likeCount, setLikeCount] = useState<number>(likes);
  const router = useRouter();
  const { isSignedIn } = useUser();

  const likeFn = async () => {
    if (!isSignedIn) {
      return router.push("/sign-in");
    }
    const response = await axios.post("/api/blog/like/like", { blogId });

    if (response) {
      hasLiked();
    }

    if (response.data.Liked) {
      setLikeCount((prev) => prev + 1);
    } else {
      setLikeCount((prev) => prev - 1);
    }
  };

  const hasLiked = async () => {
    try {
      const response = await axios.post("/api/blog/like/hasliked", { blogId });

      if (response.data?.Liked !== undefined) {
        setLiked(response.data.Liked);
      }
    } catch (error) {
      console.error("Error checking if liked:", error);
    }
  };

  useEffect(() => {
    hasLiked();
  }, [blogId]);

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
          {/* <Button
            variant={"outline"}
            className="border-none shadow-none hover:bg-transparent"
          >
            Follow
          </Button> */}
        </Link>
        <div>
          <div className="flex items-center gap-8">
            <p className="flex items-center text-sm text-primary/60">
              <CiHeart
                size={25}
                onClick={likeFn}
                style={{ color: liked ? "red" : "" }}
                className="cursor-pointer"
              />
              {likeCount}
            </p>
            {/* <p className="flex items-center text-sm text-primary/60">
              <CiChat1 size={25} />
              {comments}
            </p> */}
          </div>
        </div>
      </div>
      <Divider />
    </>
  );
};
