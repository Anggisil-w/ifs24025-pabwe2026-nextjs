import { fetchWithAuth } from "@/helpers/apiHelper";

// 1. Mengambil daftar postingan (dukungan filter is_me)
export const getPosts = async (isMe: boolean = false) => {
  const endpoint = isMe ? "/posts?is_me=1" : "/posts";
  return fetchWithAuth(endpoint, {
    method: "GET",
  });
};

// 2. Mengambil rincian detail postingan berdasarkan ID
export const getPostDetail = async (id: string) => {
  return fetchWithAuth(`/posts/${id}`, {
    method: "GET",
  });
};

// 3. Menambahkan postingan baru (dengan berkas cover dan deskripsi)
export const addPost = async (cover: File, description: string) => {
  const formData = new FormData();
  formData.append("cover", cover);
  formData.append("description", description);

  return fetchWithAuth("/posts", {
    method: "POST",
    body: formData,
  });
};

// 4. Memperbarui deskripsi postingan
export const updatePost = async (id: string, description: string) => {
  return fetchWithAuth(`/posts/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ description }),
  });
};

// 5. Mengunggah / mengganti foto cover postingan
export const updatePostCover = async (id: string, cover: File) => {
  const formData = new FormData();
  formData.append("cover", cover);

  return fetchWithAuth(`/posts/${id}/cover`, {
    method: "POST",
    body: formData,
  });
};

// 6. Menghapus postingan tertentu
export const deletePost = async (id: string) => {
  return fetchWithAuth(`/posts/${id}`, {
    method: "DELETE",
  });
};

// 7. Memberikan atau membatalkan suka (Like / Unlike)
export const toggleLikePost = async (id: string) => {
  return fetchWithAuth(`/posts/${id}/likes`, {
    method: "POST",
  });
};

// 8. Menambahkan komentar pada postingan
export const addComment = async (id: string, comment: string) => {
  return fetchWithAuth(`/posts/${id}/comments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ comment }),
  });
};

// 9. Menghapus komentar pada postingan
export const deleteComment = async (postId: string, commentId: string) => {
  return fetchWithAuth(`/posts/${postId}/comments/${commentId}`, {
    method: "DELETE",
  });
};

// 10. Menghapus seluruh postingan milik pengguna
export const deleteAllPosts = async () => {
  return fetchWithAuth("/posts", {
    method: "DELETE",
  });
};