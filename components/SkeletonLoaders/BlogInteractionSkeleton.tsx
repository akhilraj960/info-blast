import React from "react";
import { Divider } from "../Divider";
import { Skeleton } from "../ui/skeleton";

export const BlogInteractionSkeleton = () => {
  return (
    <>
      <Divider className="mt-6" />
      <div className="flex items-center justify-between px-4 my-4">
        <div className="flex gap-4 items-center">
          <div className="flex gap-1">
            <Skeleton className="rounded-full w-6 h-6" />
            <Skeleton className="px-10 py-1" />
          </div>
          <Skeleton className="px-8 py-3 max-md:hidden" />
        </div>
        <div>
          <div className="flex items-center gap-8">
            <Skeleton className="px-14 py-3" />
          </div>
        </div>
      </div>
      <Divider />
    </>
  );
};
