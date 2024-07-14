import React from "react";
import { Skeleton } from "../ui/skeleton";

export const BlogCardSkeleton = () => {
  return (
    <>
      <div className="flex flex-col gap-4 mt-2">
        <div className="flex items-center gap-5">
          <Skeleton className="rounded-full w-6 h-6" />
          <Skeleton className="py-1 px-10" />
        </div>
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <Skeleton className="py-4 px-20" />
            <Skeleton className="py-2 px-20" />
          </div>
          <div>
            <Skeleton className="min-w-32 aspect-video max-sm:min-w-28" />
          </div>
        </div>
        <div className="flex items-center gap-8">
          <Skeleton className="w-full py-2" />
        </div>
      </div>
      <hr className="mt-4" />
    </>
  );
};
