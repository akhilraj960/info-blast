"use client";
import { Wrapper } from "@/components/Wrapper";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { FC, useEffect } from "react";

const WritePage: FC = () => {
  const { sessionId } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!sessionId) {
      router.push("/sign-in", { scroll: false });
    }
  }, [sessionId, router]);

  return <Wrapper>hello there</Wrapper>;
};

export default WritePage;
