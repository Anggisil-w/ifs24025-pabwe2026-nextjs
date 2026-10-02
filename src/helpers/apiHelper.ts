import { DELCOM_BASEURL } from "@/lib/config";

export const getAccessToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("accessToken");
  }
  return null;
};

export const putAccessToken = (token: string): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem("accessToken", token);
  }
};

export const removeAccessToken = (): void => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("accessToken");
  }
};

export const fetchWithAuth = async (endpoint: string, options: RequestInit = {}) => {
  const token = getAccessToken();
  const headers = {
    ...options.headers,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const response = await fetch(`${DELCOM_BASEURL}${endpoint}`, {
    ...options,
    headers,
  });

  return response.json();
};