import { fetchWithAuth } from "@/helpers/apiHelper";

export const getPostsApi = async (isMe: boolean = false) => {
  const endpoint = isMe ? "/posts?is_me=1" : "/posts";
  return fetchWithAuth(endpoint, { method: "GET" });
};

export const getPostApi = async (id: string) => {
  return fetchWithAuth(`/posts/${id}`, { method: "GET" });
};

export const addPostApi = async (cover: File, description: string) => {
  const formData = new FormData();
  formData.append("cover", cover);
  formData.append("description", description);

  return fetchWithAuth("/posts", {
    method: "POST",
    body: formData,
  });
};

export const changePostApi = async (id: string, description: string) => {
  return fetchWithAuth(`/posts/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ description }),
  });
};

export const uploadPostCoverApi = async (id: string, cover: File) => {
  const formData = new FormData();
  formData.append("cover", cover);

  return fetchWithAuth(`/posts/${id}/cover`, {
    method: "POST",
    body: formData,
  });
};

export const deletePostApi = async (id: string) => {
  return fetchWithAuth(`/posts/${id}`, { method: "DELETE" });
};

export const likePostApi = async (id: string) => {
  return fetchWithAuth(`/posts/${id}/likes`, { method: "POST" });
};

export const addCommentApi = async (id: string, comment: string) => {
  return fetchWithAuth(`/posts/${id}/comments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ comment }),
  });
};

export const deleteCommentApi = async (postId: string, commentId: string) => {
  return fetchWithAuth(`/posts/${postId}/comments/${commentId}`, {
    method: "DELETE",
  });
};

export const deleteAllPostsApi = async () => {
  return fetchWithAuth("/posts", { method: "DELETE" });
};