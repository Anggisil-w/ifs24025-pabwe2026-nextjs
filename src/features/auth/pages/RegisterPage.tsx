"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useInput from "@/hooks/useInput";
import { register } from "../api/authApi";
import { showErrorDialog, showSuccessDialog, showWarningDialog } from "@/helpers/toolsHelper";
export default function RegisterPage() {
  const router = useRouter();
  const [name, onName] = useInput(); const [email, onEmail] = useInput(); const [password, onPass] = useInput(); const [busy, setBusy] = useState(false);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) return void showWarningDialog("Kata sandi minimal 6 karakter");
    setBusy(true);
    try { await register(name, email, password); await showSuccessDialog("Akun dibuat, silakan masuk"); router.replace("/auth/login"); }
    catch (err) { showErrorDialog((err as Error).message); } finally { setBusy(false); }
  };
  return (
    <form onSubmit={submit} className="card space-y-4 p-8">
      <h2 className="text-2xl font-extrabold">Buat akun baru</h2><p className="text-sm text-slate-500">Hanya butuh semenit</p>
      <input className="input" placeholder="Nama lengkap" value={name} onChange={onName} required />
      <input className="input" type="email" placeholder="Email" value={email} onChange={onEmail} required />
      <input className="input" type="password" placeholder="Kata sandi" value={password} onChange={onPass} required />
      <button className="btn btn-primary w-full" disabled={busy}>{busy ? "Memproses..." : "Daftar"}</button>
      <p className="text-center text-sm text-slate-500">Sudah punya akun? <Link className="font-semibold text-indigo-600" href="/auth/login">Masuk</Link></p>
    </form>
  );
}
