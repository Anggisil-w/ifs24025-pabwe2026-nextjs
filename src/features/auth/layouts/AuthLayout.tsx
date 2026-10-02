"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAccessToken } from "@/helpers/apiHelper";
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  useEffect(() => { if (getAccessToken()) router.replace("/"); }, [router]);
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="hidden flex-col justify-between bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 p-12 text-white lg:flex">
        <h1 className="text-2xl font-extrabold">✦ Postingan</h1>
        <div><p className="text-5xl font-extrabold leading-tight">Bagikan cerita,<br />temukan inspirasi.</p><p className="mt-4 max-w-md text-indigo-100">Terhubung dengan komunitas lewat postingan, suka, dan komentar.</p></div>
        <p className="text-sm text-indigo-200">© 2026 Delcom</p>
      </div>
      <div className="flex items-center justify-center p-6"><div className="w-full max-w-md">{children}</div></div>
    </div>
  );
}
