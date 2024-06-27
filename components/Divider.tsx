import React from "react";

export const Divider = ({
  label,
  children,
}: {
  label?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={`${
        label && "gap-2"
      } w-full flex items-center  text-gray-300 uppercase my-6`}
    >
      <hr className="w-1/2 border-gray-300" />
      {label}
      {children}
      <hr className="w-1/2 border-gray-300" />
    </div>
  );
};
