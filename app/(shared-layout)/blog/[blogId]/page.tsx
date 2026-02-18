import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import CommentSection from "@/components/web/CommentSection";
import { API_URL } from "@/lib/constants";
import { ApiResponse, Comment, Post } from "@/types/api";
import { ArrowLeft } from "lucide-react";
import { Metadata } from "next";
import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ blogId: number }>;
};

const fetchPost = async (id: number, cookieHeader: string) => {
  try {
    const res = await fetch(`${API_URL}posts/single/${id}`, {
      method: "GET",
      headers: {
        Cookie: cookieHeader,
      },
    });
    const result: ApiResponse<Post, undefined> = await res.json();
    if (!result.success) {
      return null;
    }
    return result.data;
  } catch (err) {
    console.error("Error fetching post:", err);
    return null;
  }
};
const fetchCommentsByPostId = async (id: number, cookieHeader: string) => {
  try {
    const res = await fetch(`${API_URL}comments/post/${id}`, {
      method: "GET",
      headers: {
        Cookie: cookieHeader,
      },
    });
    const result: ApiResponse<Comment[], undefined> = await res.json();
    if (!result.success) {
      return null;
    }
    return result.data && result.data;
  } catch (err) {
    console.error("Error fetching post:", err);
    return null;
  }
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { blogId } = await params;
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();
  const post = await fetchPost(blogId, cookieHeader);

  if (!post) {
    return {
      title: "Post not found",
    };
  } else {
    return {
      title: post.title,
      description: post.content,
    };
  }
}
const BlogDetail = async ({ params }: Props) => {
  const { blogId } = await params;
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();
  const token = cookieStore.get("token")?.value;
  if (!token) {
    return redirect("/login");
  }

  const [post, comments] = await Promise.all([
    fetchPost(blogId, cookieHeader),
    fetchCommentsByPostId(blogId, cookieHeader),
  ]);
  
  if (!post) {
    return (
      <div>
        <h1 className="text-6xl font-extrabold text-red-500 py-20">
          Post not found!
        </h1>
      </div>
    );
  }
  const { author, likes, views, title, content, imageUrl, createdAt } = post;

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 animate-in fade-in duration-500 relative">
      <Link
        href={"/blog"}
        className={buttonVariants({
          variant: "outline",
          className: "mb-4",
        })}
      >
        <ArrowLeft className="size-4" />
        Back to blog
      </Link>

      <div className="relative w-full h-100 mb-8 rounded-xl overflow-hidden shadow-sm">
        <Image
          src={imageUrl ?? `https://picsum.photos/500/500?random=${blogId}`}
          alt={title}
          fill
          className="object-cover hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="space-y-4 flex flex-col">
        <h1 className="text-4xl font-bold tracking-tight  text-foreground">
          {title}
        </h1>

        <div className="flex items-center gap-2">
          <p className="text-sm text-muted-foreground">
            Posted on: {new Date(createdAt).toLocaleDateString("en-US")}
          </p>
        </div>
      </div>
      <Separator className="my-8" />
      <p className="text-lg leading-relaxed text-foreground/90 whitespace-pre-wrap">
        {content}
      </p>
      <Separator className="my-8" />
      <CommentSection comments={comments} />
    </div>
  );
};
export default BlogDetail;
