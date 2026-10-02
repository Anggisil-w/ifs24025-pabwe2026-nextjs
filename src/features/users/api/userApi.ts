import { fetchWithAuth } from "@/helpers/apiHelper";

export const getUsersApi = async (search?: string) => {
  const query = search ? `?search=${encodeURIComponent(search)}` : "";
  return fetchWithAuth(`/users${query}`, { method: "GET" });
};

export const getProfileApi = async () => {
  return fetchWithAuth("/users/me", { method: "GET" });
};

// Ekspor alias getMeApi agar kecocokan import di reducer.ts terpenuhi
export const getMeApi = getProfileApi;

export const updateProfileApi = async (data: { name?: string; bio?: string }) => {
  return fetchWithAuth("/users/me", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
};

export const uploadProfilePhotoApi = async (photo: File) => {
  const formData = new FormData();
  formData.append("photo", photo);

  return fetchWithAuth("/users/me/photo", {
    method: "POST",
    body: formData,
  });
};

export const updatePasswordApi = async (data: { current_password?: string; password?: string }) => {
  return fetchWithAuth("/users/me/password", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
};