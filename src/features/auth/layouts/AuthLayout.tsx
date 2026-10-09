"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAccessToken } from "@/helpers/apiHelper";
export default function AuthLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const router = useRouter();
  useEffect(() => { if (getAccessToken()) router.replace("/"); }, [router]);
return (
  <div className="grid min-h-screen lg:grid-cols-[1.1fr_1fr]">
    <aside
      className="relative hidden flex-col justify-between overflow-hidden border-r-2 border-ink bg-ink p-12 text-white lg:flex"
      style={{ backgroundImage: "radial-gradient(rgb(255 255 255 / 0.12) 1.5px, transparent 1.5px)", backgroundSize: "24px 24px" }}
    >
      <p className="flex items-center gap-3 text-2xl font-extrabold tracking-tight">
        <span aria-hidden="true" className="grid size-11 place-items-center rounded-lg border-2 border-white bg-signal text-ink">
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor"><path d="M5 4h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-6l-5 4v-4H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" /></svg>
        </span>
        <span>Postingan</span>
      </p>
      <div>
        <p className="text-6xl font-extrabold leading-[1.02] tracking-tight">Bagikan cerita,<br />temukan inspirasi.</p>
        <p className="mt-5 max-w-md text-lg text-white">Terhubung dengan komunitas lewat postingan, suka, dan komentar.</p>
        <div aria-hidden="true" className="mt-10 max-w-xs -rotate-2 rounded-xl border-2 border-ink bg-signal p-5 text-ink" style={{ boxShadow: "6px 6px 0 rgb(255 255 255 / 0.9)" }}>
          <p className="font-bold leading-snug">Ada yang punya catatan Pemrograman Web minggu ini?</p>
          <p className="mt-3 text-sm font-semibold">♥ 12 &nbsp; 💬 4</p>
        </div>
      </div>
      <p className="text-sm text-white">© 2026 Delcom</p>
    </aside>
    <main className="flex items-center justify-center p-6"><div className="w-full max-w-md">{children}</div></main>
  </div>
);
}
