"use client";

import { FormEvent, useState } from "react";
import { useAppDispatch } from "@/hooks/redux";
import { addPost, fetchPosts } from "../states/action";
import { showErrorDialog, showSuccessDialog } from "@/helpers/toolsHelper";
import { IconPhoto } from "@tabler/icons-react";

export default function AddModal({ onClose }: { onClose: () => void }) {
  const dispatch = useAppDispatch();
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();

    if (text.trim().length < 3) {
      showErrorDialog("Isi postingan minimal 3 karakter.");
      return;
    }

    setLoading(true);

    const coverFile = file || new File([], "");
    const result = await dispatch(
      addPost({ cover: coverFile, description: text.trim() })
    );

    if (addPost.fulfilled.match(result)) {
      await dispatch(fetchPosts());
      await showSuccessDialog("Postingan berhasil dibuat.");
      onClose();
    } else {
      showErrorDialog(result.error.message || "Gagal membuat postingan");
    }

    setLoading(false);
  };

  return (
    <Modal title="Buat postingan" onClose={onClose}>
      <form onSubmit={submit}>
        <textarea
          autoFocus
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={5}
          placeholder="Apa yang sedang Anda pikirkan?"
          className="w-full resize-none rounded-2xl border border-slate-200 p-4 text-sm outline-none focus:border-slate-500"
        />

        <div className="mt-3">
          <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 p-3 text-sm font-semibold text-slate-600 hover:bg-slate-50">
            <IconPhoto size={20} />
            <span>{file ? file.name : "Unggah Gambar Cover (Opsional)"}</span>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="hidden"
            />
          </label>
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl px-4 py-2.5 font-semibold text-slate-600 hover:bg-slate-100"
          >
            Batal
          </button>
          <button
            disabled={loading}
            className="rounded-xl bg-slate-950 px-5 py-2.5 font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
          >
            {loading ? "Memproses…" : "Publikasikan"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export function Modal({
  children,
  title,
  onClose,
}: {
  children: React.ReactNode;
  title: string;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[60] grid place-items-center bg-slate-950/50 p-4">
      <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-bold">{title}</h2>
          <button
            onClick={onClose}
            className="rounded-xl px-3 py-2 text-slate-500 hover:bg-slate-100"
          >
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}