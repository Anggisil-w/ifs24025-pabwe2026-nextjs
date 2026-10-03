import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../api/postApi", () => ({
  getPosts: vi.fn(), getPost: vi.fn(), addPost: vi.fn(), changePost: vi.fn(), changeCover: vi.fn(),
  deletePost: vi.fn(), toggleLike: vi.fn(), addComment: vi.fn(), deleteComment: vi.fn(), deleteAllPosts: vi.fn(),
}));

import { makeStore } from "@/test-utils";
import type { Post } from "@/types";
import * as api from "../api/postApi";
import { resetPostStatus } from "./action";
import reducer, {
  asyncAddComment, asyncAddPost, asyncChangeCover, asyncChangePost, asyncDeleteAllPosts,
  asyncDeleteComment, asyncDeletePost, asyncLoadPost, asyncLoadPosts, asyncToggleLike,
} from "./reducer";

const post = { id: "1", description: "isi" } as unknown as Post;
const initial = reducer(undefined, { type: "init" });
const file = new File(["x"], "c.png", { type: "image/png" });

type Store = ReturnType<typeof makeStore>;
const cases: [string, keyof typeof api, (s: Store) => Promise<unknown>, string, string][] = [
  ["tambah", "addPost", (s) => s.dispatch(asyncAddPost("x")), "isPostAdd", "isPostAdded"],
  ["ubah", "changePost", (s) => s.dispatch(asyncChangePost({ id: "1", description: "x" })), "isPostChange", "isPostChanged"],
  ["ganti cover", "changeCover", (s) => s.dispatch(asyncChangeCover({ id: "1", file })), "isPostChangeCover", "isPostChangedCover"],
  ["hapus", "deletePost", (s) => s.dispatch(asyncDeletePost("1")), "isPostDelete", "isPostDeleted"],
  ["suka", "toggleLike", (s) => s.dispatch(asyncToggleLike("1")), "isPostLike", "isPostLiked"],
  ["tambah komentar", "addComment", (s) => s.dispatch(asyncAddComment({ id: "1", comment: "x" })), "isPostAddComment", "isPostAddedComment"],
  ["hapus komentar", "deleteComment", (s) => s.dispatch(asyncDeleteComment({ id: "1", commentId: "c" })), "isPostDeleteComment", "isPostDeletedComment"],
  ["hapus semua", "deleteAllPosts", (s) => s.dispatch(asyncDeleteAllPosts()), "isPostDeleteAll", "isPostDeletedAll"],
];

describe("posts reducer: pemuatan data", () => {
  beforeEach(() => vi.mocked(api.getPosts).mockReset());

  it("state awal kosong dan semua flag false", () => {
    expect(initial.posts).toEqual([]);
    expect(initial.post).toBeNull();
    expect(Object.entries(initial).filter(([k]) => k.startsWith("isPost")).every(([, v]) => v === false)).toBe(true);
  });
  it("pending mengaktifkan isPost", () => {
    expect(reducer(initial, asyncLoadPosts.pending("r", false)).isPost).toBe(true);
  });
  it("fulfilled mengisi daftar dan mematikan isPost", () => {
    const s = reducer({ ...initial, isPost: true }, asyncLoadPosts.fulfilled([post], "r", false));
    expect(s.posts).toEqual([post]);
    expect(s.isPost).toBe(false);
  });
  it("rejected mematikan isPost", () => {
    expect(reducer({ ...initial, isPost: true }, asyncLoadPosts.rejected(new Error("x"), "r", false)).isPost).toBe(false);
  });
  it("asyncLoadPost.fulfilled mengisi post", () => {
    expect(reducer(initial, asyncLoadPost.fulfilled(post, "r", "1")).post).toEqual(post);
  });
  it("thunk asyncLoadPosts memanggil API dan mengisi store", async () => {
    vi.mocked(api.getPosts).mockResolvedValue({ posts: [post] });
    const store = makeStore();
    await store.dispatch(asyncLoadPosts(true));
    expect(api.getPosts).toHaveBeenCalledWith(true);
    expect(store.getState().posts.posts).toEqual([post]);
  });
  it("thunk asyncLoadPost memanggil API dan mengisi store", async () => {
    vi.mocked(api.getPost).mockResolvedValue({ post });
    const store = makeStore();
    await store.dispatch(asyncLoadPost("1"));
    expect(api.getPost).toHaveBeenCalledWith("1");
    expect(store.getState().posts.post).toEqual(post);
  });
});

describe.each(cases)("posts reducer: aksi %s", (_name, fn, run, busy, done) => {
  const flagsOf = (s: Store) => s.getState().posts as unknown as Record<string, boolean>;

  it("pending menyalakan busy dan mematikan done", async () => {
    vi.mocked(api[fn] as () => Promise<unknown>).mockResolvedValue(undefined);
    const store = makeStore();
    const p = run(store);
    expect(flagsOf(store)[busy]).toBe(true);
    expect(flagsOf(store)[done]).toBe(false);
    await p;
  });
  it("fulfilled mematikan busy dan menyalakan done", async () => {
    vi.mocked(api[fn] as () => Promise<unknown>).mockResolvedValue(undefined);
    const store = makeStore();
    await run(store);
    expect(flagsOf(store)[busy]).toBe(false);
    expect(flagsOf(store)[done]).toBe(true);
  });
  it("rejected mematikan busy dan done", async () => {
    vi.mocked(api[fn] as () => Promise<unknown>).mockRejectedValue(new Error("gagal"));
    const store = makeStore();
    await run(store);
    expect(flagsOf(store)[busy]).toBe(false);
    expect(flagsOf(store)[done]).toBe(false);
  });
  it("resetPostStatus mengembalikan flag ke false", async () => {
    vi.mocked(api[fn] as () => Promise<unknown>).mockResolvedValue(undefined);
    const store = makeStore();
    await run(store);
    store.dispatch(resetPostStatus());
    expect(flagsOf(store)[done]).toBe(false);
  });
});
