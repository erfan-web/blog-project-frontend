"use client";
import Link from "next/link";
import { Button, buttonVariants } from "../ui/button";
import { ThemeToggle } from "./theme-toggle";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import SearchInput from "./SearchInput";
import { ApiResponse, User } from "@/types/api";
import { useEffect, useState } from "react";

export function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const getMe = async () => {
      setIsLoading(true);
      const res = await fetch(`/api/auth/me`, {
        method: "GET",
      });
      const result: ApiResponse<User, undefined> = await res.json();
      if (result.success) {
        setUser(result.data!);
      }
      setIsLoading(false);
    };

    getMe();
  }, []);

  const logoutHandle = async () => {
    try {
      const res = await fetch(`/api/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const result: ApiResponse<undefined, string> = await res.json();
      if (!result.success) {
        toast.error(result.error || "Failed to logout");
        return;
      }
      toast.success(result.message || "Logged out successfully");
      setUser(null);
      router.push("/login");
    } catch (err) {
      toast.error("Something went wrong");
      return;
    }
  };

  return (
    <div className="w-full py-5 flex items-center justify-between ">
      <div className="flex items-center gap-8 ">
        <Link href="/">
          <h1 className="text-3xl font-bold">
            Next<span className="text-primary">Pro</span>
          </h1>
        </Link>
        <div className="flex items-center gap-2.5">
          <Link className={buttonVariants({ variant: "ghost" })} href={"/"}>
            Home
          </Link>
          <Link className={buttonVariants({ variant: "ghost" })} href={"/blog"}>
            Blog
          </Link>
          {isLoading
            ? null
            : user?.role === "ADMIN" && (
                <Link
                  className={buttonVariants({ variant: "ghost" })}
                  href={"/create"}
                >
                  Create
                </Link>
              )}
        </div>
      </div>
      <div className="flex items-center gap-2.5">
        <div className="hidden md:block mr-2">
          <SearchInput />
        </div>
        {isLoading ? null : user ? (
          <Button onClick={logoutHandle}>Logout</Button>
        ) : (
          <>
            <Link className={buttonVariants()} href={"/sign-up"}>
              Sign up
            </Link>
            <Link
              className={buttonVariants({ variant: "outline" })}
              href={"/login"}
            >
              Login
            </Link>
          </>
        )}

        <ThemeToggle />
      </div>
    </div>
  );
}
