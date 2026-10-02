import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Post } from "@/types";
import { fetchPosts, fetchPost } from "./action";

export interface PostState {
  posts: Post[];
  post: Post | null;
  loading: boolean;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: PostState = {
  posts: [],
  post: null,
  loading: false,
  status: "idle",
  error: null,
};

const postSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    setPosts: (state, action: PayloadAction<Post[]>) => {
      state.posts = action.payload;
    },
    setPostDetail: (state, action: PayloadAction<Post | null>) => {
      state.post = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
        state.status = "loading";
      })
      .addCase(fetchPosts.fulfilled, (state, action: PayloadAction<Post[]>) => {
        state.loading = false;
        state.status = "succeeded";
        state.posts = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch posts";
      })
      .addCase(fetchPost.fulfilled, (state, action: PayloadAction<Post>) => {
        state.post = action.payload;
      });
  },
});

export const { setPosts, setPostDetail } = postSlice.actions;
export default postSlice.reducer;