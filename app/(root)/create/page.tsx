"use client";
import { useAuth } from "@clerk/nextjs";
import EditorJS, { OutputData } from "@editorjs/editorjs";
import { useRouter } from "next/navigation";
import React, { ChangeEvent, useEffect, useState } from "react";
import defaultBanner from "@/public/blog-banner.png";
import { Wrapper } from "@/components/Wrapper";
import toast, { Toaster } from "react-hot-toast";
import { AnimationWrapper } from "@/components/AnimationWrapper";
import Image from "next/image";
import { Input } from "@/components/ui/input";

import Header from "@editorjs/header";
import ImageTool from "@editorjs/image";
import List from "@editorjs/list";
import Marker from "@editorjs/marker";
import Embed from "@editorjs/embed";
import Quote from "@editorjs/quote";

interface UploadResponse {
  success: number;
  file: {
    url: string;
  };
}

interface Author {
  personal_info: Record<string, any>;
}

interface Blog {
  title: string;
  banner: string;
  content: OutputData;
  tags: any[];
  description: string;
  author: Author;
}

// Cloudinar image upload function

const uploadImage = async (file: File): Promise<UploadResponse> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("cloud_name", "dofiazzxn");
  formData.append("upload_preset", "tx4z2doe");

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/dofiazzxn/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error("Failed to upload image");
    }

    const data = await response.json();
    return { success: 1, file: { url: data.secure_url } };
  } catch (error) {
    console.error("Image upload error:", error);
    throw new Error("Failed to upload image");
  }
};

const CreatePage = () => {
  const [blog, setBlog] = useState<Blog>({
    title: "",
    banner: "",
    content: { blocks: [] },
    tags: [],
    description: "",
    author: { personal_info: {} },
  });
  const [textEditor, setTextEditor] = useState<EditorJS | null>(null);

  const { title, banner, content, tags, description } = blog;

  const mainBanner = banner || defaultBanner;

  const { sessionId } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!sessionId) {
      router.replace("/sign-in");
    }
  }, [sessionId, router]);

  useEffect(() => {
    if (sessionId) {
      const editor = new EditorJS({
        holder: "editorjs",
        data: content,
        tools: {
          header: {
            class: Header,
            config: {
              placeholder: "Type Heading...",
              levels: [2, 3],
              defaultLevel: 3,
            },
          },
          list: {
            class: List,
            inlineToolbar: true,
          },
          marker: {
            class: Marker,
          },
          image: {
            class: ImageTool,
            config: {
              uploader: {
                uploadByUrl: async (url: string) => ({
                  success: 1,
                  file: { url },
                }),
                uploadByFile: uploadImage,
              },
            },
          },
          embed: {
            class: Embed,
          },
          quote: {
            class: Quote,
          },
        },
      });
    }
  }, [content]);

  const handleBannerUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const loadingToast = toast.loading("Uploading...");

    try {
      const {
        file: { url },
      }: UploadResponse = await uploadImage(file);
      setBlog({ ...blog, banner: url });
      toast.dismiss(loadingToast);
      toast.success("Uploaded");
    } catch (error) {
      console.log(error);
      toast.dismiss(loadingToast);
      toast.error("Failed to upload image");
    }
  };

  return (
    <Wrapper className="max-w-[1000px]">
      <Toaster />
      <AnimationWrapper className="mt-6">
        <div
          className={`relative aspect-video bg-white max-w-6xl border-2 rounded-md ${
            banner ? "border-none" : ""
          }`}
        >
          <label htmlFor="uploadBanner" className="">
            <Image
              src={(banner as string) || defaultBanner}
              alt="banner"
              width={1000}
              height={950}
              priority
              className="z-20 object-cover"
            />
            <Input
              type="file"
              id="uploadBanner"
              accept=".png,.jpeg,.jpg"
              hidden
              className="hidden absolute"
              onChange={handleBannerUpload}
            />
          </label>
        </div>
        <textarea
          value={title}
          placeholder="Blog Title"
          onChange={(e) => setBlog({ ...blog, title: e.target.value })}
          className="mt-10 text-4xl resize-none font-medium h-20 bg-transparent outline-none leading-tight placeholder-opacity-40 w-full overflow-y-hidden"
        />
        <div id="editorjs" className="bg-white text-black p-2 rounded-md" />
      </AnimationWrapper>
    </Wrapper>
  );
};

export default CreatePage;
