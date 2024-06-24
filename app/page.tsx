'use client'
import { AnimationWrapper } from "@/components/AnimationWrapper";
import { InPageNavigation } from "@/components/InPageNavigation";
import { Loader } from "@/components/Loader";
import { Wrapper } from "@/components/Wrapper";
// import axios from "axios";
// import React, { useEffect, useState } from "react";

const page = () => {

  // const [blogs, setBlogs] = useState(null)


  // const fetchLatestBlogs = ({ page = 1, maxLimit = 5 }: { page: number, maxLimit: number }) => {
  //   axios.post('/api/blog/latest', { page, maxLimit }).then(async ({ data }) => {
  //     console.log(data)
  //   })
  // }

  // useEffect(() => {
  //   fetchLatestBlogs({ page: 1, maxLimit: 5 })
  // }, [fetchLatestBlogs])

  return (
    <AnimationWrapper>
      <Wrapper>

        <InPageNavigation routes={['Home', 'Trending blog']} className="mt-6">
          <>
            <h1>Home Page</h1>
          </>
          <h1>Trending Blog</h1>
        </InPageNavigation>
      </Wrapper>
    </AnimationWrapper>
  );
};

export default page;

// re_7kLTS4Yh_PQbhcYkW2XZn8Dfh96j5vg2U
