"use client";

import { postSchema } from "@/app/schemas/blog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import z from "zod";
import { useEffect, useState, useTransition } from "react";
import { Loader2 } from "lucide-react";
import { ApiResponse, User, ValidationError } from "@/types/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import upload from "@/lib/upload";

const CreatePage = () => {
  const [isPending, startTransition] = useTransition();
  const [authorized, setAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: "",
      content: "",
      description: "",
      image: undefined,
    },
  });
  const onSubmit = (data: z.infer<typeof postSchema>) => {
    startTransition(async () => {
      const url = await upload(data.image);
      try {
        const res = await fetch(`/api/posts`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: data.title,
            content: data.content,
            description: data.description,
            ...(url && { imageUrl: url }),
          }),
        });
        const result: ApiResponse<null, string | ValidationError[]> =
          await res.json();
        if (!result.success) {
          if (Array.isArray(result.error)) {
            // error from backend validation
            result.error.forEach((err) => toast.error(err.message));
            return;
          }
          toast.error(result.error || "Failed to create post");
          return;
        }
        toast.success(result.message || "Post created successfully");
        form.reset();
        router.push("/blog");
      } catch (error) {
        toast.error("Failed to upload image");
        return;
      }
    });
  };

  useEffect(() => {
    const getMe = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/auth/me`, {
          method: "GET",
        });
        const result: ApiResponse<User, undefined> = await response.json();
        if (result.success && result.data?.role === "ADMIN") {
          setAuthorized(true);
        } else {
          toast.error("Not authorized as an admin");
          router.push("/");
        }
      } catch (err) {
        router.push("/");
      } finally {
        setIsLoading(false);
      }
    };

    getMe();
  }, []);

  if (isLoading || !authorized) {
    return null;
  }

  return (
    <div className="py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          Create Post
        </h1>
        <p className="text-xl text-muted-foreground pt-4">
          Share your thoughts with the big world
        </p>
      </div>
      <Card className="w-full max-w-xl mx-auto">
        <CardHeader>
          <CardTitle>Create Blog Article</CardTitle>
          <CardDescription>Create a new blog article</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup className="gap-y-4">
              <Controller
                name="title"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>Title</FieldLabel>
                    <Input
                      aria-invalid={fieldState.invalid}
                      placeholder="super cool title"
                      {...field}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="image"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>Image</FieldLabel>
                    <Input
                      aria-invalid={fieldState.invalid}
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        field.onChange(file);
                      }}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="description"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>Description</FieldLabel>
                    <Textarea
                      className="min-h-16"
                      aria-invalid={fieldState.invalid}
                      placeholder="write description for your seo"
                      {...field}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="content"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>Content</FieldLabel>
                    <Textarea
                      className="min-h-25"
                      aria-invalid={fieldState.invalid}
                      placeholder="super cool content"
                      {...field}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Button className="cursor-pointer" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    <span>Loading...</span>
                  </>
                ) : (
                  "Create Post"
                )}
              </Button>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
export default CreatePage;
