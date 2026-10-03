import { DELCOM_BASEURL } from "@/lib/config";

const API_ORIGIN = new URL(DELCOM_BASEURL).origin;

export const assetUrl = (path: string | null | undefined) => {
  if (!path) return null;
  if (/^https?:\/\//.test(path)) return path;
  return API_ORIGIN + (path.startsWith("/") ? path : `/${path}`);
};

export const avatarUrl = (photo: string | null | undefined, name = "U", size = 72) => {
  const url = photo && !photo.includes("/default/") ? assetUrl(photo) : null;
  return url ?? `https://ui-avatars.com/api/?background=6366f1&color=fff&size=${size}&name=${encodeURIComponent(name || "U")}`;
};