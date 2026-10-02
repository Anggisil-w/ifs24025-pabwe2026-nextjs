"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FiHeart, FiMessageCircle, FiPlus, FiSearch } from "react-icons/fi";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { asyncLoadPosts } from "../states/reducer";
import { formatDate } from "@/helpers/toolsHelper";
import AddModal from "../modals/AddModal";
export default function HomePage() {
  const dispatch = useAppDispatch(); const isMe = useSearchParams().get("me") === "1";
  const { posts, isPost } = useAppSelector((s) => s.posts); const [q, setQ] = useState(""); const [add, setAdd] = useState(false);
  const load = () => dispatch(asyncLoadPosts(isMe));
  useEffect(() => { dispatch(asyncLoadPosts(isMe)); }, [isMe, dispatch]);
  const list = posts.filter((p) => p.description.toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-extrabold">{isMe ? "Postingan Saya" : "Linimasa"}</h1>
        <button className="btn btn-primary" onClick={() => setAdd(true)}><FiPlus />Tambah</button>
      </div>
      <div className="relative max-w-md"><FiSearch className="absolute left-3 top-3.5 text-slate-400" /><input className="input pl-10" placeholder="Cari postingan..." value={q} onChange={(e) => setQ(e.target.value)} /></div>
      {isPost && <p className="text-slate-400">Memuat...</p>}
      {!isPost && list.length === 0 && <div className="card p-10 text-center text-slate-400">Belum ada postingan.</div>}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {list.map((p) => (
          <Link key={p.id} href={`/posts/${p.id}`} className="card group overflow-hidden transition hover:-translate-y-1 hover:shadow-xl">
            {p.cover ? <img src={p.cover} alt="" className="h-44 w-full object-cover" /> : <div className="h-44 bg-gradient-to-br from-indigo-200 via-violet-200 to-fuchsia-200" />}
            <div className="space-y-2 p-4">
              <p className="text-sm font-semibold text-indigo-600">{p.author?.name}</p>
              <p className="line-clamp-3 text-slate-700">{p.description}</p>
              <div className="flex items-center justify-between pt-2 text-xs text-slate-400">
                <span>{formatDate(p.created_at)}</span>
                <span className="flex gap-3"><span className="flex items-center gap-1"><FiHeart />{p.likes?.length ?? p.total_likes ?? 0}</span><span className="flex items-center gap-1"><FiMessageCircle />{p.comments?.length ?? p.total_comments ?? 0}</span></span>
              </div>
            </div>
          </Link>))}
      </div>
      {add && <AddModal onClose={() => setAdd(false)} onDone={load} />}
    </div>
  );
}
