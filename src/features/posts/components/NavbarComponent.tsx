"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useAppSelector } from "@/hooks/redux";
import { removeAccessToken } from "@/helpers/apiHelper";
import { IconLogout, IconUser, IconMenu2 } from "@tabler/icons-react";

export interface NavbarComponentProps {
  onToggleSidebar?: () => void;
  onMenu?: () => void; // Ditambahkan agar tidak error di PostLayout.tsx
}

export const NavbarComponent = ({ onToggleSidebar, onMenu }: NavbarComponentProps) => {
  const { profile } = useAppSelector((state) => state.users);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleToggle = onToggleSidebar || onMenu;

  const handleLogout = () => {
    removeAccessToken();
    window.location.href = "/auth/login";
  };

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 px-4 py-3 shadow-sm">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <button
            onClick={handleToggle}
            className="p-2 text-slate-600 hover:text-slate-900 md:hidden focus:outline-none"
            aria-label="Toggle Sidebar"
          >
            <IconMenu2 className="w-6 h-6" />
          </button>

          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-indigo-600">
            <Image src="/logo.svg" alt="Delcom Logo" width={32} height={32} />
            <span>Delcom Posts</span>
          </Link>
        </div>

        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 focus:outline-none p-1 rounded-full hover:bg-slate-100 transition"
          >
            <div className="w-9 h-9 rounded-full bg-indigo-500 text-white font-semibold flex items-center justify-center overflow-hidden border border-slate-200">
              {profile?.photo_url ? (
                <img src={profile.photo_url} alt={profile.name || "User"} className="w-full h-full object-cover" />
              ) : (
                <span>{profile?.name ? profile.name.charAt(0).toUpperCase() : "U"}</span>
              )}
            </div>
            <span className="hidden sm:inline font-medium text-slate-700 text-sm">
              {profile?.name || "Pengguna"}
            </span>
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-lg shadow-lg py-1 z-50">
              <div className="px-4 py-2 border-b border-slate-100">
                <p className="text-sm font-semibold text-slate-800">{profile?.name}</p>
                <p className="text-xs text-slate-500 truncate">{profile?.email}</p>
              </div>

              <Link
                href="/profile"
                onClick={() => setDropdownOpen(false)}
                className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition"
              >
                <IconUser className="w-4 h-4" />
                <span>Profil Saya</span>
              </Link>

              <button
                onClick={handleLogout}
                className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
              >
                <IconLogout className="w-4 h-4" />
                <span>Keluar</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default NavbarComponent;