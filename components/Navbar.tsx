"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import logo from "../public/logo.png";
import logoSecondary from "../public/logosecondary.png";
import { cn } from "@/lib/utils";
import { buttonVariants } from "./ui/button";
import { TfiWrite } from "react-icons/tfi";
import { ThemeMode } from "./ThemeMode";
import { AnimationWrapper } from "./AnimationWrapper";
import { useTheme } from "next-themes";
import { SignOutButton, useAuth } from "@clerk/nextjs";
import { Sheet, SheetContent, SheetHeader, SheetTrigger } from "./ui/sheet";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import { useUser } from "@clerk/nextjs";

export const Navbar = () => {
  const { theme } = useTheme();

  const { sessionId } = useAuth();
  const { isLoaded, isSignedIn, user } = useUser();

  return (
    <AnimationWrapper
      wrapperKey={theme}
      className="sticky z-50  w-full top-0 left-0"
    >
      <Sheet>
        <header className="h-20 backdrop-blur-xl drop-shadow-sm shadow-md sticky flex items-center justify-center">
          <div className="container flex justify-between items-center">
            <Link href={"/"}>
              <Image src={logo} alt="logo" className="w-12 h-12 dark:hidden" />
              <Image
                src={logoSecondary}
                alt="logo"
                className="w-12 h-12 hidden dark:flex"
              />
            </Link>

            {/* SIDE MENU  */}
            <div className="hidden max-md:flex">
              <SheetTrigger>
                <HamburgerMenuIcon width={25} height={25} />
              </SheetTrigger>
              <SheetContent className="bg-white dark:bg-black/90 dark:shadow-white/20 backdrop-blur-md border-none shadow-xl">
                <ThemeMode />
                <div className="w-full mt-4 flex flex-col items-center justify-center">
                  <a href={user?.imageUrl} target="_blank">
                    <img
                      src={user?.imageUrl}
                      alt="profile image"
                      className="rounded-full w-20 border"
                    />
                  </a>
                  <h4 className="capitalize mt-4">
                    {user?.firstName} {user?.lastName}
                  </h4>
                  <p className="text-sm font-semibold">@{user?.username}</p>
                </div>
              </SheetContent>
            </div>

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
      </Sheet>
    </AnimationWrapper>
  );
};
