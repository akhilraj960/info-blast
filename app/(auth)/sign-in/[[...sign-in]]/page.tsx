"use client";
import { AnimationWrapper } from "@/components/AnimationWrapper";
import { Wrapper } from "@/components/Wrapper";
import { SignIn } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import { dark } from "@clerk/themes";

export default function Page() {
  const { theme } = useTheme();

  return (
    <AnimationWrapper className="flex items-center justify-center">
      <Wrapper className="flex items-center justify-center">
        {theme == "dark" ? (
          <SignIn appearance={{ baseTheme: dark }} />
        ) : (
          <SignIn />
        )}
      </Wrapper>
    </AnimationWrapper>
  );
}
