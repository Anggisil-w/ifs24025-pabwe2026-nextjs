"use client";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { FiGlobe, FiUser, FiUsers, FiFileText } from "react-icons/fi";
const items = [{ href: "/", label: "Semua Postingan", icon: FiGlobe }, { href: "/?me=1", label: "Postingan Saya", icon: FiFileText }, { href: "/users", label: "Daftar Pengguna", icon: FiUsers }, { href: "/profile", label: "Profil Saya", icon: FiUser }];
export default function SidebarComponent({ open, onClose }: { open: boolean; onClose: () => void }) {
  const path = usePathname(); const isMe = useSearchParams().get("me") === "1";
  return (
    <>
      {open && <div className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={onClose} />}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white p-4 pt-20 shadow-xl transition-transform lg:z-20 lg:translate-x-0 lg:shadow-none lg:ring-1 lg:ring-slate-100 ${open ? "translate-x-0" : "-translate-x-full"}`}>
        <nav className="space-y-1">
          {items.map(({ href, label, icon: I }) => {
            const active = href === "/" ? path === "/" && !isMe : href === "/?me=1" ? path === "/" && isMe : path === href;
            return <Link key={href} href={href} onClick={onClose} className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${active ? "bg-indigo-50 text-indigo-700" : "text-slate-600 hover:bg-slate-50"}`}><I size={18} />{label}</Link>;
          })}
        </nav>
      </aside>
    </>
  );
}
