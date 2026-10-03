const isCustomPhoto = (photo: string | null | undefined): photo is string =>
  !!photo && /^https?:\/\//.test(photo) && !photo.includes("/default/");

export const avatarUrl = (photo: string | null | undefined, name = "U", size = 72) =>
  isCustomPhoto(photo)
    ? photo
    : `https://ui-avatars.com/api/?background=6366f1&color=fff&size=${size}&name=${encodeURIComponent(name || "U")}`;