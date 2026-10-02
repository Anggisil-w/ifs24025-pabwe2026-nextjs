"use client";

import { FormEvent, useState } from "react";
import { useAppDispatch } from "@/hooks/redux";
import { changePost } from "../states/action";
import { showErrorDialog, showSuccessDialog } from "@/helpers/toolsHelper";
import { Modal } from "./AddModal";
import type { Post } from "@/types";

export default function ChangeModal({
  post,
  onClose,
}: {
  post: Post;
  onClose: () => void;
}) {
  const dispatch = useAppDispatch();
  const [text, setText] = useState(post.description);
  const [loading, setLoading] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();

    if (text.trim().length < 3) {
      showErrorDialog("Isi postingan minimal 3 karakter.");
      return;
    }

    setLoading(true);

    const result = await dispatch(
      changePost({ id: post.id, description: text.trim() })
    );

    if (changePost.fulfilled.match(result)) {
      await showSuccessDialog("Postingan berhasil diperbarui.");
      onClose();
    } else {
      showErrorDialog(result.error.message || "Gagal memperbarui postingan");
    }

    setLoading(false);
  };

  return (
    <Modal title="Ubah postingan" onClose={onClose}>
      <form onSubmit={submit}>
        <textarea
          required
          autoFocus
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={6}
          placeholder="Tuliskan perubahan postingan..."
          className="w-full resize-none rounded-2xl border border-slate-200 p-4 text-sm outline-none focus:border-slate-500"
        />

        <div className="mt-4 flex justify-end gap-2">
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
            {loading ? "Menyimpan…" : "Simpan"}
          </button>
        </div>
      </form>
    </Modal>
  );
}