"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  IconHeart,
  IconMessageCircle,
  IconPlus,
  IconSearch,
  IconArrowUpRight,
} from "@tabler/icons-react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { fetchPosts } from "../states/action";
import { formatDate } from "@/helpers/toolsHelper";
import AddModal from "../modals/AddModal";
import { Post, User } from "@/types";

export default function HomePage() {
  const dispatch = useAppDispatch();
  const { posts, status } = useAppSelector((state) => state.posts);

  const [add, setAdd] = useState(false);
  const [q, setQ] = useState("");

  const params = useSearchParams();
  const mine = params.get("mine") === "1" || params.get("is_me") === "1";

  useEffect(() => {
    dispatch(fetchPosts(mine));
  }, [dispatch, mine]);

  const filtered = useMemo(() => {
    return posts.filter((p: Post) => {
      const authorName = (p.user || p.author)?.name || "";
      const matchesDescription = p.description
        .toLowerCase()
        .includes(q.toLowerCase());
      const matchesAuthor = authorName.toLowerCase().includes(q.toLowerCase());

      return matchesDescription || matchesAuthor;
    });
  }, [posts, q]);

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-500">LINIMASA</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950">
            {mine ? "Postingan Saya" : "Semua Postingan"}
          </h1>
          <p className="mt-2 text-slate-500">
            Temukan ide, cerita, dan percakapan dari komunitas.
          </p>
        </div>

        <button
          onClick={() => setAdd(true)}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 font-semibold text-white shadow-lg shadow-slate-950/10 hover:bg-slate-800 transition"
        >
          <IconPlus size={19} /> Buat Postingan
        </button>
      </div>

      <div className="mb-6 flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3">
        <IconSearch className="text-slate-400" size={20} />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Cari postingan atau nama pengguna..."
          className="w-full bg-transparent text-sm outline-none"
        />
      </div>

      {status === "loading" ? (
        <div className="grid gap-5 md:grid-cols-2">
          <Skeleton />
          <Skeleton />
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-14 text-center">
          <p className="text-lg font-bold">Belum ada postingan</p>
          <p className="mt-2 text-slate-500">
            Coba ubah kata kunci atau buat postingan baru.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {filtered.map((p: Post) => (
            <PostCard key={p.id} post={p} />
          ))}
        </div>
      )}

      {add && <AddModal onClose={() => setAdd(false)} />}
    </div>
  );
}

function PostCard({ post }: { post: Post }) {
  const author = post.user || post.author;
  const coverImage = post.cover || post.cover_url;

  return (
    <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar user={author} />
            <div>
              <p className="font-bold text-slate-900">
                {author?.name || "Pengguna"}
              </p>
              <p className="text-xs text-slate-400">
                {formatDate(post.created_at)}
              </p>
            </div>
          </div>
          <Link
            href={`/posts/${post.id}`}
            className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-900"
          >
            <IconArrowUpRight />
          </Link>
        </div>

        {coverImage && (
          <img
            src={coverImage}
            alt="Cover postingan"
            className="mt-5 aspect-video w-full rounded-2xl object-cover"
          />
        )}

        <p className="mt-5 whitespace-pre-wrap text-[15px] leading-7 text-slate-700">
          {post.description}
        </p>

        <div className="mt-6 flex items-center gap-5 border-t border-slate-100 pt-4 text-sm text-slate-400">
          <span className="inline-flex items-center gap-1.5">
            <IconHeart size={18} />
            {post.likes_count ?? 0} suka
          </span>
          <span className="inline-flex items-center gap-1.5">
            <IconMessageCircle size={18} />
            {post.comments_count ?? post.comments?.length ?? 0} komentar
          </span>
        </div>
      </div>
    </article>
  );
}

function Avatar({ user }: { user?: User }) {
  const avatarUrl = user?.photo || user?.avatar || user?.photo_url;

  return avatarUrl ? (
    <img
      src={avatarUrl}
      alt={user?.name || "Avatar"}
      className="h-10 w-10 rounded-full object-cover"
    />
  ) : (
    <div className="grid h-10 w-10 place-items-center rounded-full bg-slate-100 font-bold text-slate-600">
      {(user?.name || "U").slice(0, 1).toUpperCase()}
    </div>
  );
}

function Skeleton() {
  return <div className="h-64 animate-pulse rounded-3xl bg-slate-200" />;
}