"use client";
import { Suspense, useEffect, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { getAccessToken } from "@/helpers/apiHelper";
import { asyncLoadProfile, isAuthLogout } from "@/features/auth/states/reducer";
import { showConfirmDialog } from "@/helpers/toolsHelper";
import NavbarComponent from "../components/NavbarComponent";
import SidebarComponent from "../components/SidebarComponent";

const subscribeToken = (cb: () => void) => {
  window.addEventListener("storage", cb);
  return () => window.removeEventListener("storage", cb);
};

export default function PostLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { profile, isProfile } = useAppSelector((s) => s.auth);
  const [open, setOpen] = useState(false);
  // Baca token dari localStorage tanpa setState di dalam effect (server snapshot = false, aman untuk hydration).
  const hasToken = useSyncExternalStore(subscribeToken, () => !!getAccessToken(), () => false);

  // Token ada -> tampilkan shell + konten segera; profil dimuat paralel dengan data halaman
  // (sebelumnya halaman menunggu profil selesai dulu, sehingga request berurutan / waterfall).
  useEffect(() => {
    if (!getAccessToken()) router.replace("/auth/login");
    else dispatch(asyncLoadProfile());
  }, [dispatch, router]);

  useEffect(() => {
    if (isProfile && !profile) router.replace("/auth/login");
  }, [isProfile, profile, router]);

  const logout = async () => {
    if (await showConfirmDialog("Keluar dari akun?")) {
      dispatch(isAuthLogout());
      router.replace("/auth/login");
    }
  };

  if (!profile && !hasToken) {
    return (
      <main className="grid min-h-screen place-items-center text-slate-600">
        <h1 className="sr-only">Memuat</h1>
        Memuat...
      </main>
    );
  }

  return (
    <div className="min-h-screen">
      <NavbarComponent onMenu={() => setOpen(true)} onLogout={logout} />
      <Suspense><SidebarComponent open={open} onClose={() => setOpen(false)} /></Suspense>
      <main className="p-4 lg:ml-64 lg:p-8">{children}</main>
    </div>
  );
}