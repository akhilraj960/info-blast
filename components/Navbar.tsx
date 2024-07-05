"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import logo from "../public/logo.png";
import logoSecondary from "../public/logosecondary.png";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "./ui/button";
import { TfiWrite } from "react-icons/tfi";
import { ThemeMode } from "./ThemeMode";
import { AnimationWrapper } from "./AnimationWrapper";
import { useTheme } from "next-themes";
import { SignInButton, SignOutButton, useAuth, useUser } from "@clerk/nextjs";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "./ui/sheet";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import { CiLogout } from "react-icons/ci";
import { useRouter } from "next/navigation";

export const Navbar = () => {
  const { theme } = useTheme();
  const { sessionId } = useAuth();
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();

  // State to track when the component has mounted
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // If not mounted, return null to prevent hydration errors
  if (!mounted) {
    return null;
  }

  return (
    <AnimationWrapper
      wrapperKey={theme}
      className="sticky z-50 w-full top-0 left-0"
    >
      <Sheet>
        <header className="h-20 backdrop-blur-xl drop-shadow-sm shadow-md sticky flex items-center justify-center">
          <div className="container flex justify-between items-center">
            <Link href="/" aria-label="Home">
              <Image
                src={logo}
                alt="logo"
                className="w-12 h-12 dark:hidden"
                priority
              />
              <Image
                src={logoSecondary}
                alt="logo"
                className="w-12 h-12 hidden dark:flex"
                priority
              />
            </Link>

            {/* SIDE MENU  */}
            <div className="hidden max-md:flex">
              <SheetTrigger>
                <HamburgerMenuIcon width={25} height={25} aria-label="Menu" />
              </SheetTrigger>
              <SheetContent className="p-0 dark:shadow-white/20 backdrop-blur-md border-none shadow-xl">
                <div className="mt-4 ml-4">
                  <ThemeMode />
                </div>
                {isLoaded && isSignedIn ? (
                  <>
                    <div className="w-full mt-4 flex flex-col items-center justify-center">
                      <a
                        href={user?.imageUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Image
                          width={200}
                          height={200}
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
                    <div className="mt-5 flex flex-col gap-2">
                      <SheetClose asChild>
                        <Button className="w-full" variant="outline">
                          Profile
                        </Button>
                      </SheetClose>
                      <SheetClose asChild>
                        <Button
                          className="w-full"
                          variant="outline"
                          onClick={() => router.push("/write")}
                        >
                          Write
                        </Button>
                      </SheetClose>
                      <SheetClose asChild>
                        <Button className="w-full" variant="outline">
                          Blogs
                        </Button>
                      </SheetClose>
                      <SheetClose asChild>
                        <Button className="w-full" variant="outline">
                          Draft
                        </Button>
                      </SheetClose>
                      <SheetClose asChild>
                        <div
                          className={cn(
                            buttonVariants({
                              variant: "outline",
                              className: "flex gap-5",
                            })
                          )}
                        >
                          <CiLogout size={22} className="text-red-600" />
                          <div className="text-red-600">
                            <SignOutButton />
                          </div>
                        </div>
                      </SheetClose>
                    </div>
                  </>
                ) : (
                  <SheetClose asChild>
                    <Link href={'/sign-in'}
                      className={cn(
                        buttonVariants({
                          variant: "outline",
                          className: "w-full mt-10",
                        })
                      )}
                    >
                      Sign In
                    </Link>
                  </SheetClose>
                )}
              </SheetContent>
            </div>

            <nav className="hidden md:flex items-center gap-10">
              <ThemeMode />
              <Link
                href="/write"
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
                  href="/sign-in"
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
