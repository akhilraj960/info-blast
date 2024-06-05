import React from "react";

interface WrapperProps {
    children: React.ReactNode;
    className?: string;
}

export const Wrapper: React.FC<WrapperProps> = ({ children, className }) => {
    return (
        <div
            className={`min-h-[calc(100vh-80px)] w-screen container ${className}`}
        >
            {children}
        </div>
    );
};
