export interface User {
  id: string;
  name: string;
  email: string;
  bio?: string;
  photo?: string;
  avatar?: string;
  photo_url?: string;
  created_at?: string;
}

export interface PostComment {
  id: string;
  user_id: string;
  comment: string;
  created_at: string;
  user?: User;
  author?: User;
}

export interface Post {
  id: string;
  user_id: string;
  description: string;
  cover_url?: string;
  cover?: string; // Alias untuk cover_url
  likes_count: number;
  comments_count: number;
  is_liked?: boolean;
  created_at: string;
  user?: User;
  author?: User; // Alias untuk user
  comments?: PostComment[];
}