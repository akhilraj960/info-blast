"use client";

import React, { ChangeEvent, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { AnimationWrapper } from "@/components/AnimationWrapper";
import { Wrapper } from "@/components/Wrapper";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@clerk/nextjs";
import Image from "next/image";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import defaultBanner from "@/public/blog-banner.png";
import EditorJS from "@editorjs/editorjs";

interface UploadResponse {
  success: number;
  file: {
    url: string;
  };
}

interface Blog {
  title: string;
  banner: string;
  content: EditorJS.OutputData;
  tags: any[];
  description: string;
  author: string;
}

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

const WritePage: React.FC = () => {
  const [blog, setBlog] = useState<Blog>({
    title: "",
    banner: "",
    content: { blocks: [] },
    tags: [],
    description: "",
    author: "",
  });
  const [textEditor, setTextEditor] = useState<EditorJS | null>(null);
  const [loading, setLoading] = useState(true);

  const { sessionId } = useAuth();
  const router = useRouter();

  const { title, banner, content } = blog;

  const mainBanner = banner || defaultBanner.src;

  useEffect(() => {
    if (!sessionId) {
      router.replace("/sign-in");
    }
  }, [sessionId, router]);

  useEffect(() => {
    const initEditor = async () => {
      const { default: EditorJS } = await import("@editorjs/editorjs");
      const { default: Header } = await import("@editorjs/header");
      const { default: List } = await import("@editorjs/list");
      const { default: Marker } = await import("@editorjs/marker");
      const { default: ImageTool } = await import("@editorjs/image");
      const { default: Embed } = await import("@editorjs/embed");
      const { default: Quote } = await import("@editorjs/quote");

      const editor = new EditorJS({
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

      setTextEditor(editor);
    };

    initEditor();

    return () => {
      if (textEditor?.isReady) {
        textEditor.destroy();
      }
    };
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
      console.error(error);
      toast.dismiss(loadingToast);
      toast.error("Failed to upload image");
    }
  };

  const handlePublish = async () => {
    console.log(blog);

    if (!banner) {
      return toast.error("Upload an banner for your blog.");
    }

    if (!title) {
      return toast.error("Write a title for your blog.");
    }

    if (textEditor) {
      try {
        const data = await textEditor.save();
        if (data.blocks.length) {
          setBlog({ ...blog, content: data });
          textEditor.destroy();
          toast.success("Blog saved successfully!");
        } else {
          toast.error("Write something in your blog to publish it.");
        }
      } catch (error) {
        console.error("Failed to save blog:", error);
        toast.error("Failed to save blog");
      }
    }
  };

  return (
    <Wrapper className="max-w-[1000px]">
      <Toaster />
      <AnimationWrapper className="mt-4 min-h-96">
        <div
          className={`relative aspect-video bg-white border-2 ${
            banner && "border-none rounded-md"
          }`}
        >
          <label htmlFor="uploadBanner" className="absolute inset-0">
            <Image
              src={mainBanner}
              alt="banner"
              fill
              priority
              className={banner ? "rounded-md" : "" + "z-20 object-cover"}
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
          Publish
        </Button>
        <div className="my-10"></div>
      </AnimationWrapper>
    </Wrapper>
  );
};

export default WritePage;
