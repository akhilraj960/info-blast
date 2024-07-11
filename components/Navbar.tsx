"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import logo from "../public/logo.png";
import logoSecondary from "../public/logosecondary.png";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "./ui/button";
import { TfiWrite } from "react-icons/tfi";
import { ThemeMode } from "./ThemeMode";
import { AnimationWrapper } from "./AnimationWrapper";
import { useTheme } from "next-themes";
import { SignedIn, SignedOut, SignOutButton, useUser } from "@clerk/nextjs";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "./ui/sheet";
import { CiLogout } from "react-icons/ci";

export const Navbar = () => {
  const { theme } = useTheme();
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
            <Link href="/" className="flex items-center gap-1">
              <Image
                src={logo}
                alt="logo"
                className="w-8 h-8 dark:hidden"
                priority
              />
              <Image
                src={logoSecondary}
                alt="logo"
                className="w-8 h-8 hidden dark:flex"
                priority
              />
              <h2 className="text-2xl font-sans max-md:hidden">InfoBlast</h2>
            </Link>

            <nav className="hidden md:flex items-center gap-10">
              <ThemeMode />
              <Link
                href="/write"
                className={cn(
                  buttonVariants({
                    variant: "secondary",
                    className: "rounded-full flex gap-1 min-w-30",
                  })
                )}
              >
                <TfiWrite />
                create
              </Link>

              <SignedOut>
                <Link
                  href="/sign-in"
                  className={cn(
                    buttonVariants({ className: "rounded-full min-w-30" })
                  )}
                >
                  Sign In
                </Link>
              </SignedOut>

              <SignedIn>
                {user && (
                  <SheetTrigger>
                    <Image
                      src={user.imageUrl}
                      width={200}
                      height={200}
                      alt="profile"
                      className="rounded-full w-12 h-12 object-cover border"
                    />
                  </SheetTrigger>
                )}
              </SignedIn>
            </nav>

            <div className="hidden max-md:flex">
              <SheetTrigger>
                {isLoaded && user && (
                  <Image
                    width={100}
                    height={100}
                    src={user.imageUrl}
                    alt="profile image"
                    className="rounded-full w-10 border h-10 object-cover"
                  />
                )}
              </SheetTrigger>
              <SheetContent className="p-0 dark:shadow-white/20 backdrop-blur-md border-none shadow-xl">
                <div className="mt-4 ml-4">
                  <ThemeMode />
                </div>
                {isLoaded && isSignedIn ? (
                  <>
                    <div className="w-full mt-4 flex flex-col items-center justify-center">
                      <a
                        href={user.imageUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Image
                          width={200}
                          height={200}
                          src={user.imageUrl}
                          alt="profile image"
                          className="rounded-full w-20 border h-20 object-cover"
                        />
                      </a>
                      <h4 className="capitalize mt-4">
                        {user.firstName} {user.lastName}
                      </h4>
                      <p className="text-sm font-semibold">@{user.username}</p>
                    </div>
                    <div className="mt-5 flex flex-col gap-2">
                      <SheetClose asChild>
                        <Link
                          href={`/profile/${user?.username}`}
                          className={cn(
                            buttonVariants({
                              className: "w-full",
                              variant: "outline",
                            })
                          )}
                        >
                          Profile
                        </Link>
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
                      {/* <SheetClose asChild>
                        <Link
                          href={`/${user?.username}/blogs`}
                          className={cn(
                            buttonVariants({
                              className: "w-full",
                              variant: "outline",
                            })
                          )}
                        >
                          Blogs
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Button className="w-full" variant="outline">
                          Draft
                        </Button>
                      </SheetClose> */}
                      <SheetClose asChild>
                        <Link
                          href={"/manage-account"}
                          className={cn(
                            buttonVariants({
                              variant: "outline",
                              className: "w-full",
                            })
                          )}
                        >
                          Manage Account
                        </Link>
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
                    <Link
                      href="/sign-in"
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
            <SignedOut>
              <div className="hidden max-md:flex">
                <Link
                  href="/sign-in"
                  className={cn(
                    buttonVariants({ className: "rounded-full min-w-30" })
                  )}
                >
                  Sign In
                </Link>
              </div>
            </SignedOut>
          </div>
        </header>
      </Sheet>
    </AnimationWrapper>
  );
};
