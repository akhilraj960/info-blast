import React from "react";

export const Divider = ({
  label,
  children,
  className,
}: {
  label?: string;
  children?: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={`${
        label && "gap-2"
      } w-full flex items-center  text-gray-300 uppercase ${className}`}
    >
      <hr className="w-1/2 border-gray-300 dark:border-gray-600" />
      {label}
      {children}
      <hr className="w-1/2 border-gray-300 dark:border-gray-600" />
    </div>
  );
};
