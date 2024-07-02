"use client";

import { AnimationWrapper } from "@/components/AnimationWrapper";
import { BlogView } from "@/components/BlogView";
import { Loader } from "@/components/Loader";
import { Wrapper } from "@/components/Wrapper";
import { Blog } from "@/types/types"; // Ensure Blog type is correctly defined in this path
import axios from "axios";
import Head from "next/head";
import React, { useEffect, useState } from "react";

export default function BlogDetails({
  params,
}: {
  params: { blogId: string };
}) {
  const [blog, setBlog] = useState<Blog | null>(null);
  const { blogId } = params;

  const fetchBlog = async (blogId: string) => {
    try {
      const response = await axios.post("/api/blog/one", { blogId });
      setBlog(response.data.blog);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchBlog(blogId);
  }, [blogId]);

  return (
    <>
      <AnimationWrapper>
        <Wrapper className="max-w-[1000px]">
          {blog === null ? (
            <Loader />
          ) : (
            <div className="mt-8">
              <BlogView blogData={blog} />
            </div>
          )}
        </Wrapper>
      </AnimationWrapper>
    </>
  );
}
