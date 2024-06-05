"use client";
import { Wrapper } from "@/components/Wrapper";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

const writePage = () => {
  const { sessionId } = useAuth();
  const router = useRouter();

  if (!sessionId) {
    router.push("/sign-in", { scroll: false });
  }

  return <Wrapper>hello there</Wrapper>;
};

export default writePage;
