import Image from "next/image";
import React from "react";

interface ProfileProps {
  profile_image: string;
  username: string;
  firstName: string;
  lastName: string;
  total_likes: number;
  total_posts: number;
}

export const UserProfile = ({
  profile_image,
  username,
  firstName,
  lastName,
  total_likes,
  total_posts,
}: ProfileProps) => {
  return (
    <div className="w-full flex flex-col justify-center items-center gap-4">
      <Image
        src={profile_image}
        width={300}
        height={300}
        alt="profile image"
        className="w-12 h-12 rounded-full"
      />
      <p className="text-sm text-primary/70">@{username}</p>
      <p className="text-lg">
        {firstName} {lastName}
      </p>
      <div className="flex">
        <p>{total_likes}</p>
        <p>{total_posts}</p>
      </div>
    </div>
  );
};
