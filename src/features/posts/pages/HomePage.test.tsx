import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import type { Post } from "@/types";

const nav = vi.hoisted(() => ({ search: new URLSearchParams() }));
vi.mock("next/navigation", () => ({ useSearchParams: () => nav.search }));
vi.mock("../api/postApi", () => ({ getPosts: vi.fn(), deleteAllPosts: vi.fn(), addPost: vi.fn() }));
vi.mock("@/helpers/toolsHelper", async (orig) => (await import("@/test-utils")).toolsHelperMock(orig as never));

import { deleteAllPosts, getPosts } from "../api/postApi";
import { showConfirmDialog, showErrorDialog, showSuccessDialog } from "@/helpers/toolsHelper";
import { renderWithProviders } from "@/test-utils";
import HomePage from "./HomePage";

const posts: Post[] = [
  { id: "p1", user_id: "u1", description: "Catatan Web", created_at: "2026-01-01T10:00:00Z", cover: "/img/c.png",
    author: { id: "u1", name: "Ani" }, likes: [{ user_id: "a" }, { user_id: "b" }], comments: [{ id: "c", comment: "x", user_id: "a" }] },
  { id: "p2", user_id: "u2", description: "Resep nasi", created_at: "2026-01-02T10:00:00Z", cover: "/img/d.png", total_likes: 5, total_comments: 3 },
  { id: "p3", user_id: "u3", description: "Kosong", created_at: "2026-01-03T10:00:00Z" },
];

describe("HomePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    nav.search = new URLSearchParams();
    vi.mocked(getPosts).mockResolvedValue({ posts });
  });

  it("menampilkan linimasa lengkap dengan jumlah suka dan komentar", async () => {
    renderWithProviders(<HomePage />);
    expect(screen.getByRole("heading", { name: "Linimasa" })).toBeInTheDocument();
    expect(await screen.findByText("Catatan Web")).toBeInTheDocument();
    expect(screen.getByText("Ani")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(getPosts).toHaveBeenCalledWith(false);
    expect(screen.queryByRole("button", { name: /Hapus semua/ })).toBeNull();
  });
  it("menyaring postingan lewat pencarian dan menampilkan pesan kosong", async () => {
    renderWithProviders(<HomePage />);
    await screen.findByText("Catatan Web");
    fireEvent.change(screen.getByLabelText("Cari postingan"), { target: { value: "RESEP" } });
    expect(screen.queryByText("Catatan Web")).toBeNull();
    expect(screen.getByText("Resep nasi")).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("Cari postingan"), { target: { value: "zzz" } });
    expect(screen.getByText("Belum ada postingan.")).toBeInTheDocument();
  });
  it("menampilkan teks memuat selama request berjalan", async () => {
    let done: (v: { posts: Post[] }) => void = () => {};
    vi.mocked(getPosts).mockReturnValue(new Promise((r) => { done = r; }));
    renderWithProviders(<HomePage />);
    expect(await screen.findByText("Memuat...")).toBeInTheDocument();
    done({ posts: [] });
    await waitFor(() => expect(screen.queryByText("Memuat...")).toBeNull());
  });
  it("membuka dan menutup modal tambah postingan", async () => {
    renderWithProviders(<HomePage />);
    fireEvent.click(screen.getByRole("button", { name: "Tambah" }));
    expect(await screen.findByText("Postingan baru")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Batal" }));
    await waitFor(() => expect(screen.queryByText("Postingan baru")).toBeNull());
  });

  describe("mode Postingan Saya", () => {
    beforeEach(() => { nav.search = new URLSearchParams("me=1"); });

    it("memuat postingan milik sendiri dan menampilkan tombol hapus semua", async () => {
      renderWithProviders(<HomePage />);
      expect(screen.getByRole("heading", { name: "Postingan Saya" })).toBeInTheDocument();
      expect(await screen.findByRole("button", { name: /Hapus semua/ })).toBeInTheDocument();
      expect(getPosts).toHaveBeenCalledWith(true);
    });
    it("menghapus semua postingan setelah konfirmasi", async () => {
      vi.mocked(showConfirmDialog).mockResolvedValue(true);
      vi.mocked(deleteAllPosts).mockResolvedValue(undefined);
      renderWithProviders(<HomePage />);
      fireEvent.click(await screen.findByRole("button", { name: /Hapus semua/ }));
      await waitFor(() => expect(showSuccessDialog).toHaveBeenCalledWith("Semua postingan berhasil dihapus"));
      expect(deleteAllPosts).toHaveBeenCalled();
      expect(getPosts).toHaveBeenCalledTimes(2);
    });
    it("tidak menghapus bila konfirmasi dibatalkan", async () => {
      vi.mocked(showConfirmDialog).mockResolvedValue(false);
      renderWithProviders(<HomePage />);
      fireEvent.click(await screen.findByRole("button", { name: /Hapus semua/ }));
      await waitFor(() => expect(showConfirmDialog).toHaveBeenCalled());
      expect(deleteAllPosts).not.toHaveBeenCalled();
    });
    it("menampilkan error bila penghapusan gagal", async () => {
      vi.mocked(showConfirmDialog).mockResolvedValue(true);
      vi.mocked(deleteAllPosts).mockRejectedValue(new Error("Gagal hapus"));
      renderWithProviders(<HomePage />);
      fireEvent.click(await screen.findByRole("button", { name: /Hapus semua/ }));
      await waitFor(() => expect(showErrorDialog).toHaveBeenCalledWith("Gagal hapus"));
    });
    it("menampilkan teks menghapus saat proses berjalan", async () => {
      vi.mocked(showConfirmDialog).mockResolvedValue(true);
      vi.mocked(deleteAllPosts).mockReturnValue(new Promise(() => {}));
      renderWithProviders(<HomePage />);
      fireEvent.click(await screen.findByRole("button", { name: /Hapus semua/ }));
      expect(await screen.findByRole("button", { name: /Menghapus/ })).toBeDisabled();
    });
  });
});
