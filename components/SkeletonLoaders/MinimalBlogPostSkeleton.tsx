import React from "react";
import { Skeleton } from "../ui/skeleton";
import { Divider } from "../Divider";

export const MinimalBlogPostSkeleton = () => {
  return (
    <>
      <div className="flex gap-3">
        <Skeleton className="p-8" />
        <div>
          <div className="flex flex-col md:flex-row gap-2">
            <div className="flex items-center gap-4">
              <Skeleton className="rounded-full w-6 h-6" />
              <Skeleton className="py-2 px-14" />
              <Skeleton className="py-2 px-14" />
            </div>
          </div>
          <Skeleton className="mt-2 py-4 px-14" />
        </div>
      </div>
      <Divider className="my-6" />
    </>
  );
};
