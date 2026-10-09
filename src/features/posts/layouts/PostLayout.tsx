"use client";
import { Suspense, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { getAccessToken } from "@/helpers/apiHelper";
import { asyncLoadProfile, isAuthLogout } from "@/features/auth/states/reducer";
import { showConfirmDialog } from "@/helpers/toolsHelper";
import NavbarComponent from "../components/NavbarComponent";
import SidebarComponent from "../components/SidebarComponent";

export default function PostLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const { profile, isProfile } = useAppSelector((s) => s.auth);
  const [open, setOpen] = useState(false);
  // Token ada -> tampilkan shell + konten segera; profil dimuat paralel dengan data halaman
  // (sebelumnya halaman menunggu profil selesai dulu, sehingga request berurutan / waterfall).
  useEffect(() => {
    if (!getAccessToken()) {
      router.replace("/auth/login");
      return;
    }

    // The profile is not required to render the first viewport on most pages.
    // Loading it immediately competed with the page's primary API request
    // (posts/users), which made Lighthouse's network critical path longer.
    // Profile itself still loads immediately because that page needs the data.
    if (pathname === "/profile") {
      dispatch(asyncLoadProfile());
      return;
    }

    const load = () => dispatch(asyncLoadProfile());
    // requestIdleCallback tidak ada di semua browser (mis. Safari): tipe aslinya selalu ada, jadi dibuat opsional.
    const idleApi: Partial<Pick<typeof globalThis, "requestIdleCallback" | "cancelIdleCallback">> = globalThis;
    const idle = idleApi.requestIdleCallback?.(load, { timeout: 2000 });
    const timer = idle === undefined ? globalThis.setTimeout(load, 1200) : undefined;

    return () => {
      if (idle !== undefined) idleApi.cancelIdleCallback?.(idle);
      if (timer !== undefined) globalThis.clearTimeout(timer);
    };
  }, [dispatch, pathname, router]);

  useEffect(() => {
    if (isProfile && !profile) router.replace("/auth/login");
  }, [isProfile, profile, router]);

  const logout = async () => {
    if (await showConfirmDialog("Keluar dari akun?")) {
      dispatch(isAuthLogout());
      router.replace("/auth/login");
    }
  };

  // localStorage is unavailable during SSR, so `hasToken` is false on the
  // server even for an already-authenticated browser. Do not replace the
  // whole page with a loading screen: rendering the shell immediately gives
  // Lighthouse a real LCP candidate while the client validates the session.
  return (
    <div className="min-h-screen">
      <NavbarComponent onMenu={() => setOpen(true)} onLogout={logout} />
      <Suspense><SidebarComponent open={open} onClose={() => setOpen(false)} /></Suspense>
      <main className="p-4 lg:ml-64 lg:p-8">{children}</main>
    </div>
  );
}