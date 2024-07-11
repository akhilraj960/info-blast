"use client";

import { AnimationWrapper } from "@/components/AnimationWrapper";
import { BlogCard } from "@/components/BlogCard";
import { InPageNavigation } from "@/components/InPageNavigation";
import { Loader } from "@/components/Loader";
import { LoadMoreData } from "@/components/LoadMoreData";
import { Wrapper } from "@/components/Wrapper";
import { Blog } from "@/types/types";
import { filterPaginationData } from "@/utils/filterPaginationData";
import axios from "axios";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";

interface Blogs {
  results: Blog[];
}

interface FetchParams {
  page?: number;
  maxLimit?: number;
}

export default function ProfilePage() {
  const [blogs, setBlogs] = useState<Blogs | null>(null);
  const [pageState, setPageState] = useState<string>("blog");
  const { slug } = useParams();

  useEffect(() => {
    userBlogs({ page: 1, maxLimit: 5 });
  }, [slug]);

  const userBlogs = async ({ page = 1, maxLimit = 5 }: FetchParams) => {
    try {
      const { data } = await axios.post("/api/user/blogs", {
        username: slug,
        page,
        maxLimit,
      });

      const formattedData = await filterPaginationData({
        state: blogs,
        data: data.blogs,
        page,
        count: "/api/user/blogs/count",
        data_to_send: { username: slug },
      });

      setBlogs(formattedData);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <AnimationWrapper>
        <Wrapper className="flex gap-4 max-w-[900px]">
          <div className="flex w-[60%] max-md:w-full">
            <div className="w-full flex flex-col">
              <InPageNavigation
                routes={["Profile", "Blogs"]}
                defaultHidden={["Profile"]}
                className="mt-6 sticky top-20 bg-white dark:bg-background"
              >
                {/* Profile  */}

                <></>

                {/* Blogs  */}
                <>
                  {!blogs ? (
                    <Loader />
                  ) : blogs.results.length ? (
                    blogs.results.map((blog, i) => (
                      <AnimationWrapper
                        key={i}
                        transition={{ duration: 1, delay: i * 0.1 }}
                      >
                        <BlogCard content={blog} />
                      </AnimationWrapper>
                    ))
                  ) : null}
                  <LoadMoreData
                    state={blogs}
                    fetchDataFn={pageState === "blog" ? userBlogs : undefined}
                  />
                </>
              </InPageNavigation>
            </div>
          </div>
        </Wrapper>
      </AnimationWrapper>
    </>
  );
}
