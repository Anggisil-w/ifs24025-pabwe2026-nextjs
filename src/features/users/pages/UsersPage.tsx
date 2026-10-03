"use client";
import { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import Avatar from "@/components/Avatar";
import { asyncLoadUsers } from "../states/reducer";

export default function UsersPage() {
  const dispatch = useAppDispatch();
  const users = useAppSelector((s) => s.users.users);
  const [q, setQ] = useState("");

  useEffect(() => {
    // Muat awal (q kosong) langsung tanpa jeda; debounce 300ms hanya saat mengetik pencarian.
    const t = setTimeout(() => dispatch(asyncLoadUsers(q || undefined)), q ? 300 : 0);
    return () => clearTimeout(t);
  }, [q, dispatch]);

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-extrabold">Daftar Pengguna</h1>
      <div className="relative max-w-md">
        <FiSearch aria-hidden="true" className="absolute left-3 top-3.5 text-slate-600" />
        <input
          id="search-user-input"
          name="search"
          aria-label="Cari pengguna"
          className="input pl-10"
          placeholder="Cari pengguna..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {users.map((u) => {
          return (
            <div key={u.id} className="card flex items-center gap-4 p-4">
              <Avatar photo={u.photo} name={u.name} size={48} />
              <div className="min-w-0">
                <p className="truncate font-semibold">{u.name}</p>
                <p className="truncate text-sm text-slate-600">{u.email}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}