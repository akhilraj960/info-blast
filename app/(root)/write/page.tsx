"use client";

import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import Image from "next/image";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { AnimationWrapper } from "@/components/AnimationWrapper";
import { Wrapper } from "@/components/Wrapper";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import defaultBanner from "@/public/blog-banner.png";
import EditorJS from "@editorjs/editorjs";
import { Textarea } from "@/components/ui/textarea";
import { Cross2Icon } from "@radix-ui/react-icons";

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
  const [editorState, setEditorState] = useState("editor");

  const editorRef = useRef<HTMLDivElement | null>(null);

  const { sessionId } = useAuth();
  const router = useRouter();

  const { title, banner, content, description, tags } = blog;

  const characterLimit = 200;
  const tagLimit = 10;

  const mainBanner = banner || defaultBanner.src;

  useEffect(() => {
    if (!sessionId) {
      router.replace("/sign-in");
    }
  }, [sessionId, router]);

  useEffect(() => {
    const initEditor = async () => {
      if (!editorRef.current) {
        console.error('Element with ID "editorjs" is missing.');
        return;
      }

      const { default: EditorJS } = await import("@editorjs/editorjs");
      const { default: Header } = await import("@editorjs/header");
      const { default: List } = await import("@editorjs/list");
      const { default: Marker } = await import("@editorjs/marker");
      const { default: ImageTool } = await import("@editorjs/image");
      const { default: Embed } = await import("@editorjs/embed");
      const { default: Quote } = await import("@editorjs/quote");

      const editor = new EditorJS({
        holder: editorRef.current,
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

    if (editorState === "editor") {
      initEditor();
    }

    return () => {
      if (textEditor?.isReady) {
        textEditor.destroy();
      }
    };
  }, [content, editorState]);

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
    if (textEditor) {
      try {
        const data = await textEditor.save();
        if (data.blocks.length) {
          setBlog({ ...blog, content: data });
          textEditor.destroy();
          setEditorState("publish");
        } else {
          toast.error("Write something in your blog to publish it.");
        }
      } catch (error) {
        console.error("Failed to save blog:", error);
        toast.error("Failed to save blog");
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === "Comma") {
      e.preventDefault();
      let tag = (e.target as HTMLInputElement).value.trim();

      if (tags.length < tagLimit) {
        if (!tags.includes(tag) && tag.length) {
          setBlog({ ...blog, tags: [...tags, tag] });
        }
      } else {
        toast.error(`You can add a maximum of ${tagLimit} tags`);
      }
      (e.target as HTMLInputElement).value = "";
    }
  };

  const handleTagDelete = (tagToDelete: string) => {
    const updatedTags = tags.filter((tag) => tag !== tagToDelete);
    setBlog({ ...blog, tags: updatedTags });
  };

  return (
    <Wrapper className="max-w-[1000px]">
      <Toaster />
      {editorState === "editor" ? (
        <AnimationWrapper className="mt-4 min-h-96">
          <div
            className={`relative aspect-video bg-white border-2 ${banner && "border-none rounded-md"
              }`}
          >
            <label htmlFor="uploadBanner" className="absolute inset-0">
              <Image
                src={mainBanner}
                alt="banner"
                fill
                priority
                className={`${banner ? "rounded-md" : ""} z-20 object-cover`}
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
            ref={editorRef}
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
      ) : (
        <AnimationWrapper>
          <div>
            <img
              src={banner}
              alt="banner image"
              className="w-full aspect-video rounded-lg overflow-hidden mt-4"
            />
          </div>
          <h1 className="text-4xl font-medium mt-2 leading-tight line-clamp-2">
            {title}
          </h1>

          <p className="line-clamp-2 text-xl leading-7 mt-4">{description}</p>

          <div className="mt-6">
            <p className="text-gray-700 mb-2">Blog Title</p>
            <Input
              type="text"
              value={title}
              onChange={(e) => setBlog({ ...blog, title: e.target.value })}
              placeholder="Blog Title"
              className="w-full bg-transparent p-2 rounded outline-none"
            />
            <p className="text-gray-700 mb-2 mt-9">
              Short description about your blog.
            </p>
            <Textarea
              placeholder="write a short description"
              value={description}
              maxLength={characterLimit}
              onChange={(e) => {
                setBlog({ ...blog, description: e.target.value });
              }}
              className="h-48 sm:h-40"
            />
            <p className="text-sm text-right text-gray-700">
              {characterLimit - description.length} Characters left
            </p>

            <p className="text-gray-700 mt-9 mb-2 text-sm">
              Tags - (Helps searching and ranking your blog post.)
            </p>

            <div className="relative p-2 pb-4 bg-transparent">
              <Input
                type="text"
                placeholder="Tags"
                className="sticky top-0 left-0 pl-4 py-2 w-full mb-3 "
                onKeyDown={handleKeyDown}
              />
              <div className="flex flex-wrap w-full">

                {tags.map((value, index) => {
                  return (
                    <div
                      key={index}
                      className="relative w-full flex p-2 mt-2 mr-2 pr-8 rounded-full gap-1 items-center px-5 "
                    >
                      <p className="outline-none">#{value}</p>

                      <button onClick={() => handleTagDelete(value)} >
                        <Cross2Icon />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </AnimationWrapper>
      )}
    </Wrapper>
  );
};

export default WritePage;
