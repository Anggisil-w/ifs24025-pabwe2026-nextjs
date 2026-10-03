import { createAction } from "@reduxjs/toolkit";

export const PostActionType = {
  LOAD_POSTS: "posts/loadPosts",
  LOAD_POST: "posts/loadPost",
  ADD: "posts/add",
  CHANGE: "posts/change",
  CHANGE_COVER: "posts/changeCover",
  DELETE: "posts/delete",
  LIKE: "posts/like",
  ADD_COMMENT: "posts/addComment",
  DELETE_COMMENT: "posts/deleteComment",
  DELETE_ALL: "posts/deleteAll",
  RESET_STATUS: "posts/resetStatus",
} as const;

export const resetPostStatus = createAction(PostActionType.RESET_STATUS);
