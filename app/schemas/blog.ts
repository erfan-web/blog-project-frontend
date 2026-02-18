import z from "zod";

export const postSchema = z.object({
  title: z.string("Title is required").max(100, "Title is so long"),
  description: z
    .string("Description is required")
    .max(255, "Description is so long"),
  content: z.string("Content is required").max(2000, "Content is so long"),
  image: z.instanceof(File).optional(),
  imageUrl: z.string().optional(),
});
