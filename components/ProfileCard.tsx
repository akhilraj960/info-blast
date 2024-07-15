import React from "react";
import { AnimationWrapper } from "./AnimationWrapper";
import Image from "next/image";

export const ProfileCard = ({
  image_url,
  username,
  firstName,
  lastName,
}: {
  image_url: string;
  username: string;
  firstName: string;
  lastName: string;
}) => {
  return (
    <AnimationWrapper>
      <div className="flex flex-col justify-center items-center gap-6">
        <Image
          src={image_url}
          width={60}
          height={60}
          alt="profile image"
          className="w-20 h-20 rounded-full"
        />
        <p className="text-sm">@{username}</p>

        <p>
          {firstName} {lastName}
        </p>
      </div>
    </AnimationWrapper>
  );
};
