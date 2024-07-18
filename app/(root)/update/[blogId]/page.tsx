"use client";

import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { SignedIn, useAuth } from "@clerk/nextjs";
import Image from "next/image";
import toast, { Toaster } from "react-hot-toast";
import { AnimationWrapper } from "@/components/AnimationWrapper";
import { Wrapper } from "@/components/Wrapper";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import defaultBanner from "@/public/blog-banner.png";
import EditorJS from "@editorjs/editorjs";
import { Textarea } from "@/components/ui/textarea";
import { Cross2Icon } from "@radix-ui/react-icons";
import axios from "axios";
import { Loader } from "@/components/Loader";
import { useParams, useRouter } from "next/navigation";

interface UploadResponse {
  success: number;
  file: {
    url: string;
  };
}

interface Blog {
  title: string;
  banner: string;
  content: any;
  tags: string[];
  description: string;
  draft: boolean;
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

export default function WritePage() {
  const [blog, setBlog] = useState<Blog>({
    title: "",
    banner: "",
    content: { blocks: [] },
    tags: [],
    description: "",
    draft: false,
  });
  const [textEditor, setTextEditor] = useState<EditorJS | null>(null);
  const [editorState, setEditorState] = useState("editor");
  const [loading, setLoading] = useState(false); // Corrected initial state for loading

  const editorRef = useRef<HTMLDivElement | null>(null);

  const { sessionId } = useAuth(); // Renamed to sessionId
  const router = useRouter();
  const { blogId } = useParams<{ blogId: string }>(); // Corrected type for blogId

  const { title, banner, content, description, tags } = blog;

  const characterLimit = 200;
  const tagLimit = 10;

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await axios.post("/api/blog/one", { blogId });
        const blogData: Blog = response.data.blog;
        if (response.data.blog) {
          setBlog({
            ...blogData,
            content: blogData.content[0], // Adjusted to correct content assignment
            tags: [...blogData.tags],
          });
          setLoading(false);
        }
      } catch (error) {
        console.log(error);
      }
    };

    if (!sessionId) {
      router.replace("/sign-in");
    } else {
      fetchBlog();
    }
  }, [sessionId, router, blogId]);

  useEffect(() => {
    if (!sessionId) {
      return;
    }
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

    if (editorState === "editor" && !loading) {
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    // Corrected type for e
    e.preventDefault();
    try {
      const response = await axios.post("/api/blog/update", { blog, blogId });

      console.log(response);

      if (response.data.success) {
        toast.success("Success");
        router.push(`/blog/${response.data.blogId}`);
      }
    } catch (error) {
      console.error("Failed to Update blog:", error);
      toast.error("Failed to Update blog");
    }
  };

  const mainBanner = banner || defaultBanner.src;

  return (
    <SignedIn>
      {loading ? (
        <Loader />
      ) : (
        <Wrapper className="max-w-[1000px]">
          <Toaster />
          {editorState === "editor" ? (
            <AnimationWrapper className="mt-4 min-h-96">
              <div className="relative aspect-video bg-white border-2">
                <label htmlFor="uploadBanner" className="absolute inset-0">
                  <Image
                    src={mainBanner}
                    alt="banner"
                    fill
                    priority
                    className={banner ? "rounded-md" : ""}
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
                Update
              </Button>
              <div className="my-10"></div>
            </AnimationWrapper>
          ) : (
            <AnimationWrapper>
              <div>
                <Image
                  src={banner}
                  width={600}
                  height={600}
                  alt="banner image"
                  className="w-full aspect-video rounded-lg overflow-hidden mt-4"
                />
              </div>
              <h1 className="text-4xl font-medium mt-2 leading-tight line-clamp-2">
                {title}
              </h1>

              <p className="line-clamp-2 text-xl leading-7 mt-4">
                {description}
              </p>

              <form onSubmit={handleSubmit}>
                <div className="mt-6">
                  <p className="text-gray-700 mb-2">Blog Title</p>
                  <Input
                    type="text"
                    value={title}
                    onChange={(e) =>
                      setBlog({ ...blog, title: e.target.value })
                    }
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
                      className="sticky top-0 left-0 pl-4 py-2 w-full mb-3"
                      onKeyDown={handleKeyDown}
                    />
                    <div className="flex flex-wrap w-full">
                      {tags.map((value, index) => (
                        <div
                          key={index}
                          className="relative w-full flex p-2 mt-2 mr-2 pr-8 rounded-full gap-1 items-center px-5"
                        >
                          <p className="outline-none">#{value}</p>
                          <button onClick={() => handleTagDelete(value)}>
                            <Cross2Icon />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                  <Button type="submit" className="w-full mb-8">
                    Update
                  </Button>
                </div>
              </form>
            </AnimationWrapper>
          )}
        </Wrapper>
      )}
    </SignedIn>
  );
}
