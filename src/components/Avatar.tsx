import Image from "next/image";
import { assetUrl } from "@/helpers/avatarHelper";

const initials = (name?: string | null) => {
  const parts = (name || "").trim().split(/\s+/).filter(Boolean);
  return ((parts[0]?.[0] ?? "U") + (parts.length > 1 ? (parts.at(-1)?.[0] ?? "") : "")).toUpperCase();
};

type Props = { photo?: string | null; name?: string | null; size: number; className?: string };

// Foto asli lewat next/image (di-resize & dikonversi WebP sesuai ukuran avatar),
// atau inisial yang digambar dengan CSS tanpa request jaringan.
export default function Avatar({ photo, name, size, className = "" }: Readonly<Props>) {
  const url = photo && !photo.includes("/default/") ? assetUrl(photo) : null;
  if (url) {
    return (
      <Image
        src={url}
        alt=""
        width={size}
        height={size}
        quality={60}
        className={`shrink-0 rounded-full object-cover ${className}`}
        style={{ width: size, height: size }}
      />
    );
  }
  return (
    <span
      aria-hidden="true"
      className={`inline-flex shrink-0 select-none items-center justify-center rounded-full bg-ink font-bold text-signal ${className}`}
      style={{ width: size, height: size, fontSize: Math.round(size * 0.38) }}
    >
      {initials(name)}
    </span>
  );
}