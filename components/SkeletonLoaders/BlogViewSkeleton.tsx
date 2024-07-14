import React from "react";
import { Skeleton } from "../ui/skeleton";
import { BlogInteractionSkeleton } from "./BlogInteractionSkeleton";

export const BlogViewSkeleton = () => {
  return (
    <>
      <Skeleton className="mt-4 w-full aspect-video" />
      <Skeleton className="w-full py-10 mt-3" />
      <Skeleton className="w-40 py-2 mt-4" />
      <BlogInteractionSkeleton />
      <Skeleton className="mt-6 w-20 py-3 rounded-full"/>
      <Skeleton className="mt-6 w-full py-6"/>
      <Skeleton className="mt-4 w-full py-2"/>
      <Skeleton className="mt-4 w-full py-2"/>
    </>
  );
};
