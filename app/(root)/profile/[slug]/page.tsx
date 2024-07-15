"use client";

import { AnimationWrapper } from "@/components/AnimationWrapper";
import { BlogCard } from "@/components/BlogCard";
import { InPageNavigation } from "@/components/InPageNavigation";
import { Loader } from "@/components/Loader";
import { LoadMoreData } from "@/components/LoadMoreData";
import { ProfileCard } from "@/components/ProfileCard";
import { BlogCardSkeleton } from "@/components/SkeletonLoaders/BlogCardSkeleton";
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
  const [profile, setProfile] = useState<any>(null);
  const { slug } = useParams();

  useEffect(() => {
    userBlogs({ page: 1, maxLimit: 5 });
    userProfile();
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

  const userProfile = async () => {
    const result = await axios.post("/api/user/profile", { username: slug });
    console.log(result);
    setProfile(result.data);
    console.log(profile);
  };

  useEffect(() => {
    console.log(profile);
  }, [profile]);

  return (
    <>
      <AnimationWrapper>
        <Wrapper className="flex gap-4 max-w-[1200px]">
          <div className="flex w-[60%] max-md:w-full">
            <div className="w-full flex flex-col">
              <div className="visible md:hidden">
                <InPageNavigation
                  routes={["Profile", "Blogs"]}
                  defaultHidden={["Profile"]}
                  className="mt-6 sticky top-20 bg-white dark:bg-background"
                >
                  {/* Profile  */}

                  <>
                    {!profile ? (
                      <Loader />
                    ) : (
                      <ProfileCard
                        username={profile.user.personal_info.username}
                        image_url={profile.user.personal_info.profile_img}
                        firstName={profile.user.personal_info.firstName}
                        lastName={profile.user.personal_info.lastName}
                      />
                    )}
                  </>

                  {/* Blogs  */}
                  <>
                    {!blogs ? (
                      <>
                        {[...Array(5)].map((_, i) => (
                          <BlogCardSkeleton key={i} />
                        ))}
                      </>
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
              <div className="visible max-md:hidden">
                <InPageNavigation
                  routes={["Profile", "Blogs"]}
                  defaultActiveIndex={1}
                  defaultHidden={["Profile"]}
                  className="mt-6 sticky top-20 bg-white dark:bg-background"
                >
                  {/* Profile  */}

                  <>
                    {!profile ? (
                      <Loader />
                    ) : (
                      <ProfileCard
                        username={profile.user.personal_info.username}
                        image_url={profile.user.personal_info.profile_img}
                        firstName={profile.user.personal_info.firstName}
                        lastName={profile.user.personal_info.lastName}
                      />
                    )}
                  </>

                  {/* Blogs  */}
                  <>
                    {!blogs ? (
                      <>
                        {[...Array(5)].map((_, i) => (
                          <BlogCardSkeleton key={i} />
                        ))}
                      </>
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
          </div>

          {/* Profile section  */}

          <div className="max-md:hidden w-[400px] border-l overflow-auto">
            <div className="fixed w-[400px] h-full p-4">
              <div className="w-[400px] h-full overflow-y-scroll no-scrollbar mb-10">
                <div className="mt-10 flex justify-center items-center">
                  {!profile ? (
                    <Loader />
                  ) : (
                    <ProfileCard
                      username={profile.user.personal_info.username}
                      image_url={profile.user.personal_info.profile_img}
                      firstName={profile.user.personal_info.firstName}
                      lastName={profile.user.personal_info.lastName}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </Wrapper>
      </AnimationWrapper>
    </>
  );
}
