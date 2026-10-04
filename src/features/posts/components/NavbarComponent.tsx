"use client";

import Link from "next/link";
import { useAppSelector } from "@/hooks/redux";
import Avatar from "@/components/Avatar";

function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="h-[22px] w-[22px]">
      <path d="M3 6h18M3 12h18M3 18h18" />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="h-4 w-4">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <path d="M16 17l5-5-5-5" />
      <path d="M21 12H9" />
    </svg>
  );
}

export default function NavbarComponent({ onMenu, onLogout }: { onMenu: () => void; onLogout: () => void }) {
  const me = useAppSelector((s) => s.auth.profile);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b-2 border-ink bg-paper/90 px-4 backdrop-blur lg:px-8">
      <div className="flex items-center gap-3">
        <button
          className="inline-flex size-10 items-center justify-center rounded-lg border-2 border-ink bg-white lg:hidden"
          onClick={onMenu}
          aria-label="Buka menu"
        >
          <MenuIcon />
        </button>
        <span className="flex items-center gap-2.5 text-xl font-extrabold tracking-tight">
          <span aria-hidden="true" className="grid size-9 place-items-center rounded-lg border-2 border-ink bg-signal" style={{ boxShadow: "2px 2px 0 var(--color-ink)" }}>
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor"><path d="M5 4h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-6l-5 4v-4H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" /></svg>
          </span>
          Postingan
        </span>
      </div>
      <div className="flex items-center gap-3">
        <Link href="/profile" aria-label={me?.name ? `Profil ${me.name}` : "Profil saya"} className="flex items-center gap-2">
          <Avatar photo={me?.photo} name={me?.name} size={36} className="border-2 border-ink" />
          <span className="hidden text-sm font-semibold sm:block">{me?.name}</span>
        </Link>
        <button onClick={onLogout} className="btn btn-ghost !px-3" aria-label="Keluar">
          <LogoutIcon />
        </button>
      </div>
    </header>
  );
}