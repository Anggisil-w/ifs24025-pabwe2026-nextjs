import { fetchWithAuth } from "@/helpers/apiHelper";

export const loginApi = async (email?: string, password?: string) => {
  return fetchWithAuth("/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
};

export const registerApi = async (name?: string, email?: string, password?: string) => {
  return fetchWithAuth("/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });
};