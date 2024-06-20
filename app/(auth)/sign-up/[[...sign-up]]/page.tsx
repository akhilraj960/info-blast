"use client";
import { AnimationWrapper } from "@/components/AnimationWrapper";
import { Wrapper } from "@/components/Wrapper";
import { SignUp } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";

export default function Page() {
  const { theme } = useTheme();

  return (
    <AnimationWrapper className="flex items-center justify-center">
      <Wrapper className="flex items-center justify-center">
        {theme == "dark" ? (
          <SignUp appearance={{ baseTheme: dark }} />
        ) : (
          <SignUp />
        )}
      </Wrapper>
    </AnimationWrapper>
  );
}
