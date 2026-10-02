import { createAsyncThunk } from "@reduxjs/toolkit";
import * as postApi from "../api/postApi";

export const fetchPosts = createAsyncThunk(
  "posts/fetchPosts",
  async (isMe?: boolean) => {
    const res = await postApi.getPostsApi(isMe ?? false);
    return res.data || res;
  }
);

export const fetchPost = createAsyncThunk(
  "posts/fetchPost",
  async (id: string) => {
    const res = await postApi.getPostApi(id);
    return res.data || res;
  }
);

export const addPost = createAsyncThunk(
  "posts/addPost",
  async (payload?: { cover?: File; description?: string } | File | string) => {
    let cover: File = new File([], "");
    let description: string = "";

    if (payload && typeof payload === "object") {
      if ("cover" in payload && payload.cover) cover = payload.cover;
      if ("description" in payload && payload.description) description = payload.description;
      if (payload instanceof File) cover = payload;
    } else if (typeof payload === "string") {
      description = payload;
    }

    const res = await postApi.addPostApi(cover, description);
    return res.data || res;
  }
);

export const changePost = createAsyncThunk(
  "posts/changePost",
  async ({ id, description }: { id: string; description: string }) => {
    const res = await postApi.changePostApi(id, description);
    return res.data || res;
  }
);

export const uploadPostCover = createAsyncThunk(
  "posts/uploadPostCover",
  async (payload: { id: string; cover?: File; file?: File }) => {
    const coverFile = payload.cover || payload.file;
    if (!coverFile) throw new Error("File cover is required");

    const res = await postApi.uploadPostCoverApi(payload.id, coverFile);
    return res.data || res;
  }
);

export const deletePost = createAsyncThunk(
  "posts/deletePost",
  async (id: string) => {
    await postApi.deletePostApi(id);
    return id;
  }
);

export const likePost = createAsyncThunk(
  "posts/likePost",
  async (id: string) => {
    const res = await postApi.likePostApi(id);
    return res.data || res;
  }
);

export const addComment = createAsyncThunk(
  "posts/addComment",
  async ({ id, comment }: { id: string; comment: string }) => {
    const res = await postApi.addCommentApi(id, comment);
    return res.data || res;
  }
);

export const deleteComment = createAsyncThunk(
  "posts/deleteComment",
  async (payload: { postId?: string; id?: string; commentId?: string }) => {
    const targetPostId = payload.postId || payload.id;
    const targetCommentId = payload.commentId;

    if (!targetPostId || !targetCommentId) {
      throw new Error("postId and commentId are required");
    }

    await postApi.deleteCommentApi(targetPostId, targetCommentId);
    return targetCommentId;
  }
);