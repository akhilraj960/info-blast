"use client";
import { AnimationWrapper } from "@/components/AnimationWrapper";
import { Wrapper } from "@/components/Wrapper";
import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <AnimationWrapper className="flex items-center justify-center">
      <Wrapper className="flex items-center justify-center">
        <SignUp />
      </Wrapper>
    </AnimationWrapper>
  );
}
