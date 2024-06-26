"use client";
import { AnimationWrapper } from "@/components/AnimationWrapper";
import { BlogCard } from "@/components/BlogCard";
import { InPageNavigation } from "@/components/InPageNavigation";
import { Loader } from "@/components/Loader";
import { Wrapper } from "@/components/Wrapper";
import { Button } from "@/components/ui/button";
import { Blog } from "@/types/types";
import { filterPaginationData } from "@/utils/filterPaginationData";
import axios from "axios";
import { useEffect, useState } from "react";

interface Blogs {
  results: Blog[];
}

const page = () => {
  const [blogs, setBlogs] = useState<Blogs | null>(null);
  const [pageState, setPageState] = useState<string>("home");

  const categories = ["programming", "tech", "finance", "cooking", "social", "travel"
  ]


  const fetchLatestBlogs = ({ page = 1, maxLimit = 5 }) => {
    axios
      .post("/api/blog/latest", { page, maxLimit })
      .then(async ({ data }) => {
        let formateData = await filterPaginationData({
          state: blogs,
          data: data.blogs,
          page,
          count: "/api/blog/count",
          data_to_send: { tag: pageState },
        });
        console.log(formateData);
        setBlogs(formateData);
      })
      .catch((error: any) => {
        console.log(error);
      });
  };

  useEffect(() => {
    fetchLatestBlogs({ page: 1 });
  }, []);

  return (

    <AnimationWrapper>

      <Wrapper className="flex gap-4 max-w-[1200px]">
        {/* blog section  */}
        <div className="flex w-[60%] max-md:w-full">
          <div className="w-full flex flex-col">

            <InPageNavigation routes={["Home", "Trending blog"]} className="mt-6 sticky top-20 bg-white dark:bg-background">
              <>
                {blogs === null ? (
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
              </>
              <>

              </>
            </InPageNavigation>
          </div>

        </div>
        {/* trending section  */}
        <div className="max-md:hidden w-[400px] border-l overflow-auto">
          <div className="fixed w-[400px] h-full p-4">

            <div className="w-[400px]">
              <div className="">

                <h4>Trending </h4>

                {/* categories  */}
                <div className="flex gap-6 flex-wrap mt-2">
                  {categories.map((cat, index) => (
                    <Button className={`rounded-full text-sm capitalize ${pageState === cat ? "" : ""}`} variant={'outline'}>
                      {cat}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Wrapper>
    </AnimationWrapper>

  );
};

export default page;

// re_7kLTS4Yh_PQbhcYkW2XZn8Dfh96j5vg2U
