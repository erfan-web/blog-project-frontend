export type ApiSuccess<T> = {
  success: true;
  message: string;
  data?: T;
};

export type ApiError<K> = {
  success: false;
  error: K;
};

export type ValidationError = {
  field: string;
  message: string;
};

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface Comment {
  id: number;
  content: string;
  postId: number;
  userId: number;
  user: {
    name: string;
  };
  createdAt: string;
}

export interface Post {
  id: string | number;
  title: string;
  content: string;
  imageUrl?: string;
  likes: number;
  views: number;
  author: Omit<User, "email" | "role">;
  createdAt: string;
}

export type SearchPost = Pick<Post, "id" | "title" | "content">;

export type ApiResponse<T, K> = ApiSuccess<T> | ApiError<K>;
