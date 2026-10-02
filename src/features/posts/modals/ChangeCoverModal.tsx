"use client";

import { useState } from "react";
import { useAppDispatch } from "@/hooks/redux";
import { uploadPostCover } from "../states/action";
import { showErrorDialog, showSuccessDialog } from "@/helpers/toolsHelper";
import { Modal } from "./AddModal";
import type { Post } from "@/types";

export default function ChangeCoverModal({
  post,
  onClose,
}: {
  post: Post;
  onClose: () => void;
}) {
  const dispatch = useAppDispatch();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>(
    post.cover || post.cover_url || ""
  );
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!file) {
      showErrorDialog("Pilih gambar terlebih dahulu.");
      return;
    }

    setLoading(true);

    const result = await dispatch(
      uploadPostCover({ id: post.id, cover: file, file })
    );

    if (uploadPostCover.fulfilled.match(result)) {
      await showSuccessDialog("Cover berhasil diperbarui.");
      onClose();
    } else {
      showErrorDialog(result.error.message || "Upload gagal");
    }

    setLoading(false);
  };

  return (
    <Modal title="Ganti cover" onClose={onClose}>
      <div className="space-y-4">
        <label className="block cursor-pointer rounded-2xl border-2 border-dashed border-slate-200 p-6 text-center hover:bg-slate-50">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const selectedFile = e.target.files?.[0] || null;
              setFile(selectedFile);
              if (selectedFile) {
                setPreview(URL.createObjectURL(selectedFile));
              }
            }}
          />
          <span className="font-semibold text-slate-700">Pilih gambar cover</span>
          <span className="mt-1 block text-sm text-slate-400">
            PNG, JPG, WEBP
          </span>
        </label>

        {preview && (
          <img
            src={preview}
            alt="Preview cover"
            className="max-h-56 w-full rounded-2xl object-cover"
          />
        )}

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl px-4 py-2.5 font-semibold text-slate-600 hover:bg-slate-100"
          >
            Batal
          </button>
          <button
            onClick={submit}
            disabled={loading}
            className="rounded-xl bg-slate-950 px-5 py-2.5 font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
          >
            {loading ? "Mengunggah…" : "Unggah"}
          </button>
        </div>
      </div>
    </Modal>
  );
}