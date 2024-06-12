"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import logo from "../public/logo.png";
import logoSecondary from "../public/logosecondary.png";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "./ui/button";
import { TfiWrite } from "react-icons/tfi";
import { ThemeMode } from "./ThemeMode";
import { AnimationWrapper } from "./AnimationWrapper";
import { useTheme } from "next-themes";
import { SignOutButton, useAuth } from "@clerk/nextjs";

export const Navbar = () => {
  const { theme } = useTheme();

  const { sessionId } = useAuth();

  return (
    <AnimationWrapper wrapperKey={theme} className="sticky z-50  w-full top-0 left-0">
      <header className="h-20 backdrop-blur-xl drop-shadow-sm flex items-center justify-center">
        <div className="container flex justify-between items-center">
          <Link href={"/"}>
            <Image src={logo} alt="logo" className="w-12 h-12 dark:hidden" />
            <Image
              src={logoSecondary}
              alt="logo"
              className="w-12 h-12 hidden dark:flex"
            />
          </Link>
          <nav className="hidden md:flex items-center gap-10">
            <ThemeMode />
            <Link
              href={"/write"}
              className={cn(
                buttonVariants({
                  variant: "secondary",
                  className: "rounded-full flex gap-1",
                })
              )}
            >
              <TfiWrite />
              create
            </Link>
            {!sessionId ? (
              <Link
                href={"/sign-in"}
                className={cn(buttonVariants({ className: "rounded-full" }))}
              >
                Sign In
              </Link>
            ) : (
              <div
                className={cn(buttonVariants({ className: "rounded-full" }))}
              >
                <SignOutButton />
              </div>
            )}
          </nav>
        </div>
      </header>
    </AnimationWrapper>
  );
};
