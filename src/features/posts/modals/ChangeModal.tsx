"use client";
import { useState } from "react";
import { changePost } from "../api/postApi";
import { showErrorDialog, showSuccessDialog } from "@/helpers/toolsHelper";
export default function ChangeModal({ id, initial, onClose, onDone }: Readonly<{ id: string; initial: string; onClose: () => void; onDone: () => void }>) {
  const [text, setText] = useState(initial);
  const submit = async (e: React.SyntheticEvent<HTMLFormElement>) => { e.preventDefault();
    try { await changePost(id, text); await showSuccessDialog("Postingan diperbarui"); onDone(); onClose(); } catch (err) { showErrorDialog((err as Error).message); } };
  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4">
      <button type="button" tabIndex={-1} aria-label="Tutup" className="absolute inset-0 cursor-default bg-black/40" onClick={onClose} />
      <dialog open aria-modal="true" aria-label="Postingan" className="card relative m-0 w-full max-w-lg p-6 text-inherit">
        <form onSubmit={submit} className="space-y-4">
          <h2 className="text-lg font-extrabold">Ubah postingan</h2>
          <textarea className="input min-h-32" value={text} onChange={(e) => setText(e.target.value)} required />
          <div className="flex justify-end gap-2"><button type="button" className="btn btn-ghost" onClick={onClose}>Batal</button><button className="btn btn-primary">Simpan</button></div>
        </form>
      </dialog>
    </div>
  );
}