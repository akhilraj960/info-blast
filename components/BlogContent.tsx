import Image from "next/image";
import React from "react";

const Img = ({ url, caption }: { url: string; caption: string }) => {
  return (
    <div className="mt-4">
      <Image
        src={url}
        alt="image"
        width={900}
        height={900}
        className="w-full object-cover"
      />
      {caption && (
        <p className="w-full text-center text-primary/60 italic my-3 md:mb-12 text-sm">{caption}</p>
      )}
    </div>
  );
};

const List = ({ items, type }: { items: string[]; type: string }) => {
  if (type === "unordered") {
    return (
      <ul className="list-disc ml-5 mt-4">
        {items.map((item, index) => (
          <li key={index} className="text-md text-primary/70 leading-9">
            {item}
          </li>
        ))}
      </ul>
    );
  }

  return (
    <ol className="list-decimal ml-5 mt-4">
      {items.map((item, index) => (
        <li key={index} className="text-md text-primary/70 leading-9">
          {item}
        </li>
      ))}
    </ol>
  );
};

const Quote = ({ quote, caption }: { quote: string; caption: string }) => {
  return (
    <div className="bg-primary-foreground p-3 pl-5 border-l-4 border-purple-600 ">
      <p className="text-sm text-primary/70 leading-10 md:text-[18px]">
        {quote}
      </p>
      {caption.length ? (
        <p className="w-full mt-4 text-primary/60 text-sm italic">{caption}</p>
      ) : (
        ""
      )}
    </div>
  );
};

export const BlogContent = ({ block }: { block: any }) => {
  return (
    <div>
      {block[0].blocks.map((value: any, index: number) => {
        console.log(value);

        if (value.type === "header") {
          const Tag = value.data.level === 2 ? "h2" : "h3";
          return (
            <Tag
              key={index}
              dangerouslySetInnerHTML={{ __html: value.data.text }}
              className="mt-4"
            />
          );
        }

        if (value.type === "paragraph") {
          return (
            <p
              key={index}
              dangerouslySetInnerHTML={{ __html: value.data.text }}
              className="text-md mt-4 text-primary/70 leading-9"
            />
          );
        }

        if (value.type === "image") {
          return (
            <Img
              key={index}
              url={value.data.file.url}
              caption={value.data.caption}
            />
          );
        }

        if (value.type === "list") {
          return (
            <List
              key={index}
              items={value.data.items}
              type={value.data.style}
            />
          );
        }

        if (value.type === "quote") {
          return (
            <Quote
              key={index}
              quote={value.data.text}
              caption={value.data.caption}
            />
          );
        }

        return null;
      })}
    </div>
  );
};
