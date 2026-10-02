"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  IconArrowLeft,
  IconHeart,
  IconMessageCircle,
  IconEdit,
  IconTrash,
  IconPhoto,
} from "@tabler/icons-react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import {
  addComment,
  deleteComment,
  deletePost,
  fetchPost,
  likePost,
} from "../states/action";
import {
  showConfirmDialog,
  showErrorDialog,
  showSuccessDialog,
  formatDate,
} from "@/helpers/toolsHelper";
import ChangeModal from "../modals/ChangeModal";
import ChangeCoverModal from "../modals/ChangeCoverModal";
import { PostComment } from "@/types";

export default function DetailPage({ id }: { id: string }) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const post = useAppSelector((state) => state.posts.post);

  const [text, setText] = useState("");
  const [edit, setEdit] = useState(false);
  const [cover, setCover] = useState(false);

  useEffect(() => {
    dispatch(fetchPost(id));
  }, [dispatch, id]);

  if (!post) {
    return (
      <div className="mx-auto max-w-4xl rounded-3xl bg-white p-12 text-center shadow-sm">
        Memuat postingan…
      </div>
    );
  }

  const author = post.user || post.author;
  const coverImage = post.cover || post.cover_url;

  const remove = async () => {
    if (await showConfirmDialog("Hapus postingan ini?")) {
      const result = await dispatch(deletePost(post.id));
      if (deletePost.fulfilled.match(result)) {
        await showSuccessDialog("Postingan dihapus.");
        router.replace("/");
      } else {
        showErrorDialog(result.error.message || "Gagal menghapus");
      }
    }
  };

  const handleLike = () => {
    dispatch(likePost(post.id));
  };

  const handleComment = async () => {
    if (!text.trim()) return;

    const result = await dispatch(
      addComment({ id: post.id, comment: text.trim() })
    );

    if (addComment.fulfilled.match(result)) {
      setText("");
    } else {
      showErrorDialog(result.error.message || "Gagal mengirim komentar");
    }
  };

  const handleDeleteComment = (commentId: string) => {
    dispatch(
      deleteComment({ postId: post.id, id: post.id, commentId })
    );
  };

  return (
    <div className="mx-auto max-w-4xl">
      <button
        onClick={() => router.back()}
        className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900"
      >
        <IconArrowLeft size={18} /> Kembali
      </button>

      <article className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
        {coverImage ? (
          <img
            src={coverImage}
            alt="Cover postingan"
            className="max-h-[520px] w-full object-cover"
          />
        ) : (
          <div className="grid h-44 place-items-center bg-slate-100 text-slate-300">
            <IconPhoto size={50} />
          </div>
        )}

        <div className="p-6 sm:p-9">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold">
                {author?.name || "Pengguna"}
              </h1>
              <p className="mt-1 text-sm text-slate-400">
                {formatDate(post.created_at)}
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setCover(true)}
                className="rounded-xl border border-slate-200 p-2.5 hover:bg-slate-50"
                title="Ubah Cover"
              >
                <IconPhoto size={18} />
              </button>
              <button
                onClick={() => setEdit(true)}
                className="rounded-xl border border-slate-200 p-2.5 hover:bg-slate-50"
                title="Edit Deskripsi"
              >
                <IconEdit size={18} />
              </button>
              <button
                onClick={remove}
                className="rounded-xl border border-red-100 p-2.5 text-red-500 hover:bg-red-50"
                title="Hapus Postingan"
              >
                <IconTrash size={18} />
              </button>
            </div>
          </div>

          <p className="mt-8 whitespace-pre-wrap text-[16px] leading-8 text-slate-700">
            {post.description}
          </p>

          <div className="mt-7 flex gap-3 border-y border-slate-100 py-4">
            <button
              onClick={handleLike}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                post.is_liked
                  ? "bg-red-50 text-red-600"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              <IconHeart size={18} /> {post.likes_count ?? 0} suka
            </button>
            <span className="inline-flex items-center gap-2 rounded-xl bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-600">
              <IconMessageCircle size={18} />{" "}
              {post.comments?.length ?? post.comments_count ?? 0}
            </span>
          </div>

          <section className="mt-7">
            <h2 className="text-lg font-bold">Komentar</h2>

            <div className="mt-4 flex gap-2">
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleComment();
                }}
                placeholder="Tulis komentar…"
                className="min-w-0 flex-1 rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-500"
              />
              <button
                onClick={handleComment}
                className="rounded-xl bg-slate-950 px-5 font-semibold text-white hover:bg-slate-800 transition"
              >
                Kirim
              </button>
            </div>

            <div className="mt-5 space-y-3">
              {(post.comments || []).map((c: PostComment) => (
                <div key={c.id} className="rounded-2xl bg-slate-50 p-4">
                  <div className="flex items-center justify-between">
                    <b>{(c.user || c.author)?.name || "Pengguna"}</b>
                    <button
                      onClick={() => handleDeleteComment(c.id)}
                      className="text-xs font-semibold text-red-500 hover:underline"
                    >
                      Hapus
                    </button>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {c.comment}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </article>

      {edit && <ChangeModal post={post} onClose={() => setEdit(false)} />}
      {cover && (
        <ChangeCoverModal post={post} onClose={() => setCover(false)} />
      )}
    </div>
  );
}