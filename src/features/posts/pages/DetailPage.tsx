"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { FiHeart, FiTrash2, FiEdit2, FiImage, FiSend } from "react-icons/fi";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { asyncLoadPost } from "../states/reducer";
import { addComment, changeCover, deleteComment, deletePost, toggleLike } from "../api/postApi";
import { formatDate, showConfirmDialog, showErrorDialog } from "@/helpers/toolsHelper";
import ChangeModal from "../modals/ChangeModal";
export default function DetailPage() {
  const { postId } = useParams<{ postId: string }>(); const router = useRouter(); const dispatch = useAppDispatch();
  const { post } = useAppSelector((s) => s.posts); const me = useAppSelector((s) => s.auth.profile);
  const [comment, setComment] = useState(""); const [edit, setEdit] = useState(false);
  const load = () => dispatch(asyncLoadPost(postId));
  useEffect(() => { dispatch(asyncLoadPost(postId)); }, [postId, dispatch]);
  const act = async (fn: () => Promise<unknown>) => { try { await fn(); await load(); } catch (e) { showErrorDialog((e as Error).message); } };
  if (!post || post.id !== postId) return <p className="text-slate-400">Memuat...</p>;
  const mine = me?.id === post.user_id; const liked = post.likes?.some((l) => l.user_id === me?.id);
  return (
    <article className="card mx-auto max-w-3xl overflow-hidden">
      {post.cover ? <img src={post.cover} alt="" className="max-h-96 w-full object-cover" /> : <div className="h-48 bg-gradient-to-br from-indigo-200 via-violet-200 to-fuchsia-200" />}
      <div className="space-y-5 p-6">
        <div className="flex items-center gap-3"><img src={post.author?.photo || `https://ui-avatars.com/api/?background=6366f1&color=fff&name=${encodeURIComponent(post.author?.name || "U")}`} alt="" className="size-10 rounded-full object-cover" /><div><p className="font-semibold">{post.author?.name}</p><p className="text-xs text-slate-400">{formatDate(post.created_at)}</p></div></div>
        <p className="whitespace-pre-wrap text-lg leading-relaxed">{post.description}</p>
        <div className="flex flex-wrap gap-2">
          <button className={`btn ${liked ? "btn-primary" : "btn-ghost"}`} onClick={() => act(() => toggleLike(post.id))}><FiHeart />{post.likes?.length ?? 0}</button>
          {mine && <>
            <label className="btn btn-ghost cursor-pointer"><FiImage />Cover<input type="file" accept="image/*" hidden onChange={(e) => e.target.files?.[0] && act(() => changeCover(post.id, e.target.files![0]))} /></label>
            <button className="btn btn-ghost" onClick={() => setEdit(true)}><FiEdit2 />Ubah</button>
            <button className="btn btn-ghost !text-red-600" onClick={async () => { if (await showConfirmDialog("Hapus postingan ini?")) { await deletePost(post.id); router.replace("/"); } }}><FiTrash2 />Hapus</button></>}
        </div>
        <hr className="border-slate-100" />
        <h3 className="font-bold">Komentar ({post.comments?.length ?? 0})</h3>
        <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); act(async () => { await addComment(post.id, comment); setComment(""); }); }}>
          <input className="input" placeholder="Tulis komentar..." value={comment} onChange={(e) => setComment(e.target.value)} required /><button className="btn btn-primary"><FiSend /></button>
        </form>
        <ul className="space-y-3">
          {post.comments?.map((c) => (
            <li key={c.id} className="flex items-start justify-between gap-3 rounded-xl bg-slate-50 p-3">
              <div><p className="text-sm font-semibold">{c.author?.name ?? "Pengguna"}</p><p className="text-sm text-slate-600">{c.comment}</p></div>
              {c.user_id === me?.id && <button className="text-slate-400 hover:text-red-600" onClick={() => act(() => deleteComment(post.id, c.id))} aria-label="hapus"><FiTrash2 /></button>}
            </li>))}
        </ul>
      </div>
      {edit && <ChangeModal id={post.id} initial={post.description} onClose={() => setEdit(false)} onDone={load} />}
    </article>
  );
}
