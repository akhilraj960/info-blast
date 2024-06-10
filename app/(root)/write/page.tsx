"use client";
import { AnimationWrapper } from "@/components/AnimationWrapper";
import { Wrapper } from "@/components/Wrapper";
import { Input } from "@/components/ui/input";
import { useAuth } from "@clerk/nextjs";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { ChangeEvent, useEffect, useState } from "react";
import defaultBanner from "@/public/blog banner.png";
import { Button } from "@/components/ui/button";
import toast, { Toast, Toaster } from "react-hot-toast";

import EditorJS, { EditorConfig, OutputData } from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import Marker from "@editorjs/marker";
import editorImage from "@editorjs/image";
import Embed from "@editorjs/embed";
import Quote from "@editorjs/quote";
import { text } from "stream/consumers";

interface UploadResponse {
  success: number;
  file: {
    url: string;
  };
}

interface Author {
  personal_info: Record<string, any>; // Adjust the type of personal_info if more specific structure is known
}

interface Blog {
  title: string;
  banner: string;
  content: OutputData; // EditorJS OutputData type
  tags: any[]; // Adjust the type if the tags array has a specific structure
  description: string;
  author: Author;
}

// Cloudinary image upload function
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
      console.log(response);
      throw new Error("Failed to upload image");
    }

    const data = await response.json();
    return { success: 1, file: { url: data.secure_url } };
  } catch (error) {
    console.error("Image upload error:", error);
    throw new Error("Failed to upload image");
  }
};

const WritePage: React.FC = () => {
  const [blog, setBlog] = useState<Blog>({
    title: "",
    banner: "",
    content: { blocks: [] },
    tags: [],
    description: "",
    author: { personal_info: {} },
  });
  const [textEditor, setTextEditor] = useState<EditorJS | null>(null);

  const { sessionId } = useAuth();
  const router = useRouter();

  const { title, banner, content, tags, description } = blog;

  const mainBanner = banner || defaultBanner;

  useEffect(() => {
    if (!sessionId) {
      router.replace("/sign-in");
    }
  }, [sessionId, router]);

  useEffect(() => {
    setTextEditor(
      new EditorJS({
        holder: "editorjs",
        data: content,
        placeholder: "Write your blog here.",
        tools: {
          header: {
            class: Header,
            config: {
              placeholder: "Type Heading...",
              levels: [2, 3],
              defaultLevel: 2,
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
            class: editorImage,
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
      })
    );
  }, [content]);

  const handleBannerUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const loadingToast = toast.loading("Uploading...");

    try {
      const {
        file: { url },
      }: UploadResponse = await uploadImage(file);
      console.log(file, url);
      setBlog({ ...blog, banner: url });
      toast.dismiss(loadingToast);
      toast.success("Uploaded");
    } catch (error) {
      console.error(error);
      toast.dismiss(loadingToast);
      toast.error("Failed to upload image");
    }
  };

  const handlePublish = async () => {
    console.log(textEditor);
    if (textEditor?.isReady) {
      textEditor.save().then((data) => {
        if (data.blocks.length) {
          setBlog({ ...blog, content: data });
          textEditor.destroy();
        } else {
          toast.error("Write something in your blog to publish it.");
        }
      });
    }
    console.log(blog)
  };

  return (
    <Wrapper className="max-w-[1000px]">
      <Toaster />

      <AnimationWrapper className="mt-4">
        <div
          className={`relative aspect-video bg-white border-4 ${
            banner && "border-none"
          }`}
        >
          <label htmlFor="uploadBanner" className="flex items-center">
            <Image
              src={mainBanner}
              alt="banner"
              fill
              className="z-20 items-center object-cover"
            />
            <Input
              type="file"
              id="uploadBanner"
              accept=".png,.jpeg,.jpg"
              hidden
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
        <hr className="my-10" />
        <div
          id="editorjs"
          className="dark:text-black bg-white rounded-md p-2"
        />

        <Button
          onClick={handlePublish}
          className="rounded-full w-full mt-8 capitalize"
        >
          publish
        </Button>
        <div className="my-10"></div>
      </AnimationWrapper>
    </Wrapper>
  );
};

export default WritePage;
