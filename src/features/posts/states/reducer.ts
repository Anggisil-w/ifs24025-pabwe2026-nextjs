import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  addComment, addPost, changeCover, changePost, deleteAllPosts, deleteComment,
  deletePost, getPost, getPosts, toggleLike,
} from "../api/postApi";
import type { Post } from "@/types";
import { PostActionType as T, resetPostStatus } from "./action";

export const asyncLoadPosts = createAsyncThunk(T.LOAD_POSTS, (isMe: boolean) => getPosts(isMe).then((d) => d.posts));
export const asyncLoadPost = createAsyncThunk(T.LOAD_POST, (id: string) => getPost(id).then((d) => d.post));
export const asyncAddPost = createAsyncThunk(T.ADD, (description: string) => addPost(description));
export const asyncChangePost = createAsyncThunk(T.CHANGE, (a: { id: string; description: string }) => changePost(a.id, a.description));
export const asyncChangeCover = createAsyncThunk(T.CHANGE_COVER, (a: { id: string; file: File }) => changeCover(a.id, a.file));
export const asyncDeletePost = createAsyncThunk(T.DELETE, (id: string) => deletePost(id));
export const asyncToggleLike = createAsyncThunk(T.LIKE, (id: string) => toggleLike(id));
export const asyncAddComment = createAsyncThunk(T.ADD_COMMENT, (a: { id: string; comment: string }) => addComment(a.id, a.comment));
export const asyncDeleteComment = createAsyncThunk(T.DELETE_COMMENT, (a: { id: string; commentId: string }) => deleteComment(a.id, a.commentId));
export const asyncDeleteAllPosts = createAsyncThunk(T.DELETE_ALL, () => deleteAllPosts());

const initialState = {
  posts: [] as Post[],
  post: null as Post | null,
  isPost: false,
  isPostAdd: false, isPostAdded: false,
  isPostChange: false, isPostChanged: false,
  isPostChangeCover: false, isPostChangedCover: false,
  isPostDelete: false, isPostDeleted: false,
  isPostLike: false, isPostLiked: false,
  isPostAddComment: false, isPostAddedComment: false,
  isPostDeleteComment: false, isPostDeletedComment: false,
  isPostDeleteAll: false, isPostDeletedAll: false,
};

type State = typeof initialState;
type Busy = "isPostAdd" | "isPostChange" | "isPostChangeCover" | "isPostDelete" | "isPostLike" | "isPostAddComment" | "isPostDeleteComment" | "isPostDeleteAll";
type Done = "isPostAdded" | "isPostChanged" | "isPostChangedCover" | "isPostDeleted" | "isPostLiked" | "isPostAddedComment" | "isPostDeletedComment" | "isPostDeletedAll";

// Setiap aksi mutasi punya sepasang flag: sedang berjalan (busy) dan berhasil (done).
const flags: Record<string, [Busy, Done]> = {
  [T.ADD]: ["isPostAdd", "isPostAdded"],
  [T.CHANGE]: ["isPostChange", "isPostChanged"],
  [T.CHANGE_COVER]: ["isPostChangeCover", "isPostChangedCover"],
  [T.DELETE]: ["isPostDelete", "isPostDeleted"],
  [T.LIKE]: ["isPostLike", "isPostLiked"],
  [T.ADD_COMMENT]: ["isPostAddComment", "isPostAddedComment"],
  [T.DELETE_COMMENT]: ["isPostDeleteComment", "isPostDeletedComment"],
  [T.DELETE_ALL]: ["isPostDeleteAll", "isPostDeletedAll"],
};

const prefixOf = (type: string) => type.slice(0, type.lastIndexOf("/"));
const isMutation = (suffix: string) => (a: { type: string }) => a.type.endsWith(suffix) && prefixOf(a.type) in flags;

export default createSlice({
  name: "posts",
  initialState,
  reducers: {},
  extraReducers: (b) => {
    b.addCase(asyncLoadPosts.pending, (s) => { s.isPost = true; });
    b.addCase(asyncLoadPosts.fulfilled, (s, a) => { s.posts = a.payload; s.isPost = false; });
    b.addCase(asyncLoadPosts.rejected, (s) => { s.isPost = false; });
    b.addCase(asyncLoadPost.fulfilled, (s, a) => { s.post = a.payload; });
    b.addCase(resetPostStatus, (s: State) => {
      for (const [busy, done] of Object.values(flags)) { s[busy] = false; s[done] = false; }
    });
    b.addMatcher(isMutation("/pending"), (s, a) => {
      const [busy, done] = flags[prefixOf(a.type)];
      s[busy] = true; s[done] = false;
    });
    b.addMatcher(isMutation("/fulfilled"), (s, a) => {
      const [busy, done] = flags[prefixOf(a.type)];
      s[busy] = false; s[done] = true;
    });
    b.addMatcher(isMutation("/rejected"), (s, a) => {
      const [busy, done] = flags[prefixOf(a.type)];
      s[busy] = false; s[done] = false;
    });
  },
}).reducer;
