import React, { useState } from "react";
import { Button } from "./ui/button";

interface Props {
  routes: string[];
  defaultHidden?: string[];
  defaultActiveIndex?: number;
  className?: string;
  children?: React.ReactNode;
}

export const InPageNavigation = ({
  routes,
  defaultActiveIndex = 0,
  defaultHidden,
  className,
  children,
}: Props) => {
  const [pageNavIndex, setPageNavIndex] = useState(defaultActiveIndex);

  const changePageState = (e: any, i: number) => {
    setPageNavIndex(i);
  };

  return (
    <>
      <div
        className={`mb-8 border-b border-t border-gray-300 dark:border-gray-800 flex flex-nowrap gap-2 overflow-x-auto  ${className}`}
      >
        {routes.map((route, i) => (
          <Button
            key={i}
            onClick={(e) => changePageState(e.target, i)}
            className={`bg-transparent py-2 hover:bg-transparent hover:text-gray-400 rounded-none
                         ${pageNavIndex === i ? "bg-secondary" : ""} ${
              defaultHidden?.includes(route) ? "md:hidden" : ""
            }`}
            variant={"secondary"}
          >
            {route}
          </Button>
        ))}
      </div>
      {Array.isArray(children) ? children[pageNavIndex] : children}
    </>
  );
};
