import { assetUrl } from "@/helpers/avatarHelper";

const initials = (name?: string | null) => {
  const parts = (name || "").trim().split(/\s+/).filter(Boolean);
  return ((parts[0]?.[0] ?? "U") + (parts.length > 1 ? parts[parts.length - 1][0] : "")).toUpperCase();
};

type Props = { photo?: string | null; name?: string | null; size: number; className?: string };

// Avatar tanpa request jaringan pihak ketiga: foto asli dari API, atau inisial yang digambar dengan CSS.
export default function Avatar({ photo, name, size, className = "" }: Props) {
  const url = photo && !photo.includes("/default/") ? assetUrl(photo) : null;
  if (url) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={url} alt="" width={size} height={size} loading="lazy" decoding="async" className={`rounded-full object-cover ${className}`} style={{ width: size, height: size }} />
    );
  }
  return (
    <span
      aria-hidden="true"
      className={`inline-flex shrink-0 select-none items-center justify-center rounded-full bg-indigo-600 font-bold text-white ${className}`}
      style={{ width: size, height: size, fontSize: Math.round(size * 0.38) }}
    >
      {initials(name)}
    </span>
  );
}
