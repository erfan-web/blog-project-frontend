import z from "zod";

export const commentSchema = z.object({
  content: z.string("Content is requierd.").min(3),
  postId: z.coerce.number(),
});
