import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { API_URL } from "@/lib/constants";
import { ApiResponse, Post } from "@/types/api";
import { Metadata } from "next";
import { cookies } from "next/headers";
// import { cacheLife, cacheTag } from "next/cache";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Blog | Next.js 16 Tutorial",
  description: "Read our latest articles and insights",
  category: "Web Development",
  authors: [{ name: "Erfan Ahmadi" }],
};

export const fetchPosts = async () => {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();
  try {
    const res = await fetch(`${API_URL}posts`, {
      method: "GET",
      headers: {
        Cookie: cookieHeader,
      },
    });
    const result: ApiResponse<Post[], undefined> = await res.json();
    if (!result.success) {
      return null;
    }
    return result.data;
  } catch (err) {
    console.error("Error fetching posts:", err);
    return null;
  }
};

const BlogPage = () => {
  
  return (
    <div className="py-12">
      <div className="text-center pb-12">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          Our Blog
        </h1>
        <p className="text-xl pt-4 max-w-2xl mx-auto text-muted-foreground ">
          Insigts, thoughs and trends from our team!
        </p>
      </div>
      <Suspense fallback={<SkeletonLoadingUi />}>
        <BlogList />
      </Suspense>
    </div>
  );
};
export default BlogPage;

async function BlogList() {
  const data = await fetchPosts();
  return (
    <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-3">
      {data?.map((post, i) => (
        <Card key={post.id} className="pt-0 overflow-hidden">
          <div className="relative w-full h-62 overflow-hidden">
            <Image
              className="object-cover"
              src={
                post.imageUrl ?? `https://picsum.photos/500/500?random=${i + 2}`
              }
              unoptimized={post.imageUrl ? false : true}
              alt={`image ${i}`}
              fill
            />
          </div>
          <CardContent className="px-4 mb-2.5">
            <Link href={`/blog/${post.id}`}>
              <h2 className="text-2xl font-bold hover:text-primary transition-colors duration-300 mb-4 line-clamp-1">
                {post.title}
              </h2>
            </Link>
            <p className="text-muted-foreground line-clamp-3 h-18">
              {post.content}
            </p>
          </CardContent>
          <CardFooter className="px-4">
            <Link
              href={`/blog/${post.id}`}
              className={buttonVariants({
                className: "w-full",
              })}
            >
              Read More
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

function SkeletonLoadingUi() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {[...Array(3)].map((_, i) => (
        <div className="flex flex-col space-y-3" key={i}>
          <Skeleton className="h-48 w-full rounded-xl" />
          <div className="space-y-2 flex flex-col">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
}
