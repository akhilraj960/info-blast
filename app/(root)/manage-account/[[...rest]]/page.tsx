"use client";
import { AnimationWrapper } from "@/components/AnimationWrapper";
import { UserProfile } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";

export default function Profile() {
  const { theme } = useTheme();

  return (
    <div className="flex justify-center items-center no-scrollbar">
      <AnimationWrapper>
        {theme === "dark" ? (
          <UserProfile appearance={{ baseTheme: dark }} />
        ) : (
          <UserProfile />
        )}
      </AnimationWrapper>
    </div>
  );
}
