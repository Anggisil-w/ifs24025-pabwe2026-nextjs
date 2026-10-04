// Server tempat file foto dan cover disimpan.
const ASSET_ORIGIN = "https://open-api.delcom.org";

// Ubah path relatif atau URL dengan host salah (mis. domain Vercel) menjadi URL server API.
export const assetUrl = (path: string | null | undefined) => {
  if (!path) return null;
  try {
    const u = new URL(path, ASSET_ORIGIN);
    return /^\/(img|default)\//.test(u.pathname) ? ASSET_ORIGIN + u.pathname + u.search : u.href;
  } catch {
    return null;
  }
};

export const avatarUrl = (photo: string | null | undefined, name = "U", size = 72) => {
  const url = photo && !photo.includes("/default/") ? assetUrl(photo) : null;
  return url ?? `https://ui-avatars.com/api/?background=6366f1&color=fff&size=${size}&name=${encodeURIComponent(name || "U")}`;
};

// Hanya gambar dari server API yang lewat pengoptimal gambar Next.js; sisanya dimuat apa adanya.
export const skipOptimizer = (src: string) => !src.startsWith(`${ASSET_ORIGIN}/`);
