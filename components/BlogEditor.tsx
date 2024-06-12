'use client'
import EditorJS, { OutputData } from "@editorjs/editorjs";
import React, { useEffect, useState } from "react";

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

export const BlogEditor = () => {
  const [blog, setBlog] = useState<Blog>({
    title: "",
    banner: "",
    content: { blocks: [] },
    tags: [],
    description: "",
    author: { personal_info: {} },
  });

  const [textEditor, setTextEditor] = useState<EditorJS | null>(null);

  const { content } = blog;
  useEffect(() => {
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
    setTextEditor(editor);
  }, [content]);

  return <div id="editorjs"></div>;
};
