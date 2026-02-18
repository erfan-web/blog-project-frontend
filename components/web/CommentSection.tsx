"use client";
import { Loader2, MessageSquare } from "lucide-react";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Field, FieldError } from "../ui/field";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { commentSchema } from "@/app/schemas/comment";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { useParams } from "next/navigation";
import z from "zod";
import { toast } from "sonner";
import { useTransition } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ApiResponse, Comment, ValidationError } from "@/types/api";
import { createComment } from "@/app/actions";

type Props = {
  comments: Comment[] | null | undefined;
};

const CommentSection = ({ comments }: Props) => {
  const [isPending, startTransition] = useTransition();
  const params = useParams<{ blogId: string }>();

  const form = useForm({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      content: "",
      postId: params.blogId,
    },
  });
  async function onSubmit(data: z.infer<typeof commentSchema>) {
    startTransition(async () => {
      try {
        const response = await createComment(data);
        if (!response.success) {
          if (Array.isArray(response.error)) {
            // error from backend validation
            response.error.forEach((err) => toast.error(err.message));
            return;
          }
          toast.error(response.error ?? "Failed to create comment");
          return;
        }
        form.reset();
        toast.success(response.message ?? "Comment posted");
      } catch (err) {
        toast.error("Failed to create post!");
        return;
      }
    });
  }
  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2.5 border-b">
        <MessageSquare className="size-5" />
        <h2 className="text-xl font-bold">{comments?.length} Comments</h2>
      </CardHeader>
      <CardContent className="space-y-8">
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <Controller
            name="content"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <Textarea
                  aria-invalid={fieldState.invalid}
                  placeholder="Share your thoughts"
                  {...field}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Button>
            {isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                <span>Loading...</span>
              </>
            ) : (
              "Submit"
            )}
          </Button>
        </form>
        {comments && comments.length > 0 && <Separator />}
        <section className="space-y-6">
          {comments?.map((comment) => (
            <div className="flex gap-4" key={comment.id}>
              <Avatar className="size-10 shrink-0">
                <AvatarImage
                  src={`https://avatar.vercel.sh/${comment.user.name}`}
                  alt={comment.user.name}
                />
                <AvatarFallback>
                  {comment.user.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="w-full flex items-center justify-between space-y-1">
                <div className="flex flex-col">
                  <p className="font-semibold text-sm">{comment.user.name}</p>

                  <p className="text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed">
                    {comment.content}
                  </p>
                </div>
                <p className="text-muted-foreground text-xs">
                  {new Date(comment.createdAt).toLocaleDateString("en-US")}
                </p>
              </div>
            </div>
          ))}
        </section>
      </CardContent>
    </Card>
  );
};
export default CommentSection;
