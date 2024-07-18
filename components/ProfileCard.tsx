import React from "react";
import { AnimationWrapper } from "./AnimationWrapper";
import Image from "next/image";
import { formatToK } from "@/utils/formatTok";

interface ProfileCardProps {
  image_url: string;
  username: string;
  firstName: string;
  lastName: string;
  total_posts: number;
  total_reads: number;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({
  image_url,
  username,
  firstName,
  lastName,
  total_posts,
  total_reads,
}) => {
  return (
    <AnimationWrapper className="shadow-lg rounded-md p-8 w-full">
      <div className="flex flex-col justify-center items-center gap-3">
        <p className="text-lg font-semibold">
          {firstName} {lastName}
        </p>
        <Image
          src={image_url}
          width={60}
          height={60}
          alt="profile image"
          className="w-20 h-20 rounded-full"
        />
        <p className="text-sm">@{username}</p>
      </div>
      <div className="mt-10 flex justify-between">
        <p>Posts: {formatToK(total_posts)}</p>
        <p>Reads: {formatToK(total_reads)}</p>
      </div>
    </AnimationWrapper>
  );
};
