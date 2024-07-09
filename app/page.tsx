"use client";
import dynamic from 'next/dynamic';
import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { MdAutoGraph } from "react-icons/md";
import { AnimationWrapper } from "@/components/AnimationWrapper";
import { BlogCard } from "@/components/BlogCard";
import { InPageNavigation } from "@/components/InPageNavigation";
import { LoadMoreData } from "@/components/LoadMoreData";
import { Loader } from "@/components/Loader";
import { MinimalBlogPost } from "@/components/MinimalBlogPost";
import { Wrapper } from "@/components/Wrapper";
import { Button } from "@/components/ui/button";
import { Blog } from "@/types/types";
import { filterPaginationData } from "@/utils/filterPaginationData";

const categories = ["programming", "tech", "finance", "cooking", "social", "travel"];

interface Blogs {
  results: Blog[];
}

interface FetchParams {
  page?: number;
  maxLimit?: number;
}

export default function Home() {
  const [blogs, setBlogs] = useState<Blogs | null>(null);
  const [pageState, setPageState] = useState<string>("home");
  const [trendingBlogs, setTrendingBlogs] = useState<any>(null);

  const fetchLatestBlogs = useCallback(async ({ page = 1, maxLimit = 5 }: FetchParams) => {
    try {
      const { data } = await axios.post<{ blogs: Blog[] }>("/api/blog/latest", { page, maxLimit });
      const formattedData = await filterPaginationData({
        state: blogs,
        data: data.blogs,
        page,
        count: "/api/blog/count",
        data_to_send: { tag: pageState },
      });
      setBlogs(formattedData);
    } catch (error) {
      console.error("Error fetching latest blogs:", error);
    }
  }, [blogs, pageState]);

  const fetchTrendingBlogs = useCallback(async () => {
    try {
      const { data } = await axios.get("/api/blog/trending");
      setTrendingBlogs(data.blog);
    } catch (error) {
      console.error("Error fetching trending blogs:", error);
    }
  }, []);

  useEffect(() => {
    fetchLatestBlogs({ page: 1 });
    fetchTrendingBlogs();
  }, []);

  return (
    <AnimationWrapper>
      <Wrapper className="flex gap-4 max-w-[1200px]">
        {/* Blog section */}
        <div className="flex w-[60%] max-md:w-full">
          <div className="w-full flex flex-col">
            <InPageNavigation
              routes={["Home", "Trending blog"]}
              className="mt-6 sticky top-20 bg-white dark:bg-background"
            >
              <>
                {!blogs ? (
                  <Loader />
                ) : blogs.results.length ? (
                  blogs.results.map((blog, i) => (
                    <AnimationWrapper key={i} transition={{ duration: 1, delay: i * 0.1 }}>
                      <BlogCard content={blog} />
                    </AnimationWrapper>
                  ))
                ) : null}
                <LoadMoreData
                  state={blogs}
                  fetchDataFn={pageState === "home" ? fetchLatestBlogs : undefined}
                />
              </>
              <>
                <div>
                  {!trendingBlogs ? (
                    <Loader />
                  ) : (
                    trendingBlogs.map((blog: any, index: number) => (
                      <BlogCard key={index} content={blog} />
                    ))
                  )}
                </div>
              </>
            </InPageNavigation>
          </div>
        </div>
        {/* Trending section */}
        <div className="max-md:hidden w-[400px] border-l overflow-auto">
          <div className="fixed w-[400px] h-full p-4">
            <div className="w-[400px] h-full overflow-y-scroll no-scrollbar mb-10">
              <div className="mt-4">
                <h4>Stories from all interests</h4>
                <div className="flex gap-6 flex-wrap mt-4">
                  {categories.map((cat, index) => (
                    <Button key={index} className="rounded-full text-sm capitalize" variant="outline">
                      {cat}
                    </Button>
                  ))}
                </div>
                <div className="mt-4 flex items-center gap-4">
                  <h4>Trending</h4>
                  <MdAutoGraph size={24} className="text-primary/40 text-center" />
                </div>
                <div className="mt-8 pb-10">
                  {!trendingBlogs ? (
                    <Loader />
                  ) : (
                    trendingBlogs.map((blog: any, index: number) => (
                      <MinimalBlogPost key={index} index={index} content={blog} />
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Wrapper>
    </AnimationWrapper>
  );
}
