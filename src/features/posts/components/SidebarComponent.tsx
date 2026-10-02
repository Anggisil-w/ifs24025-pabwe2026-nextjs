"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconArticle, IconUserCheck, IconUsers, IconUser, IconX } from "@tabler/icons-react";

export interface SidebarComponentProps {
  isOpen?: boolean;
  open?: boolean; // Added to support open prop from PostLayout
  onClose?: () => void;
}

export const SidebarComponent = ({ isOpen, open, onClose }: SidebarComponentProps) => {
  const pathname = usePathname();
  const isSidebarOpen = open ?? isOpen ?? false;

  const navItems = [
    { label: "Semua Postingan", href: "/", icon: IconArticle },
    { label: "Postingan Saya", href: "/?is_me=1", icon: IconUserCheck },
    { label: "Daftar Pengguna", href: "/users", icon: IconUsers },
    { label: "Profil Saya", href: "/profile", icon: IconUser },
  ];

  return (
    <>
      {isSidebarOpen && (
        <div onClick={onClose} className="fixed inset-0 bg-slate-900/40 z-30 md:hidden" />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-slate-200 transform transition-transform duration-200 ease-in-out md:translate-x-0 md:static md:z-auto ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full py-4 px-3">
          <div className="flex items-center justify-between px-3 mb-4 md:hidden">
            <span className="font-semibold text-slate-500 text-sm">Navigasi Menu</span>
            <button onClick={onClose} className="p-1 text-slate-500 hover:text-slate-800 rounded-md">
              <IconX className="w-5 h-5" />
            </button>
          </div>
          <nav className="flex-1 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href.split("?")[0]) && item.href !== "/";

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                    isActive
                      ? "bg-indigo-50 text-indigo-600 font-semibold"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? "text-indigo-600" : "text-slate-500"}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
};

export default SidebarComponent;