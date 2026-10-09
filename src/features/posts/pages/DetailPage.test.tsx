import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import type { Post } from "@/types";

const nav = vi.hoisted(() => ({ router: { replace: vi.fn(), push: vi.fn() }, params: { postId: "p1" } }));
vi.mock("next/navigation", () => ({ useRouter: () => nav.router, useParams: () => nav.params }));
vi.mock("../api/postApi", () => ({
  getPost: vi.fn(), toggleLike: vi.fn(), addComment: vi.fn(), deleteComment: vi.fn(),
  deletePost: vi.fn(), changeCover: vi.fn(), changePost: vi.fn(),
}));
vi.mock("@/helpers/toolsHelper", async (orig) => (await import("@/test-utils")).toolsHelperMock(orig as never));

import { addComment, changeCover, deleteComment, deletePost, getPost, toggleLike } from "../api/postApi";
import { showConfirmDialog, showErrorDialog } from "@/helpers/toolsHelper";
import { makeStore, renderWithProviders } from "@/test-utils";
import DetailPage from "./DetailPage";

const me = { id: "u1", name: "Ani", email: "a@b.c" };
const basePost: Post = {
  id: "p1", user_id: "u1", description: "Isi postingan", created_at: "2026-01-01T10:00:00Z",
  author: { id: "u1", name: "Ani" }, likes: [], comments: [],
};
const setup = (post: Post = basePost, profile: typeof me | null = me) => {
  vi.mocked(getPost).mockResolvedValue({ post });
  return renderWithProviders(<DetailPage />, { preloadedState: { auth: { profile, isProfile: true } } });
};

describe("DetailPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    nav.params = { postId: "p1" };
  });

  it("menampilkan teks memuat lalu isi postingan", async () => {
    setup();
    expect(screen.getByText("Memuat...")).toBeInTheDocument();
    expect(await screen.findByText("Isi postingan")).toBeInTheDocument();
    expect(screen.getByText("Komentar (0)")).toBeInTheDocument();
  });
  it("menampilkan cover bila ada", async () => {
    const { container } = setup({ ...basePost, cover: "/img/c.png" });
    await screen.findByText("Isi postingan");
    expect(container.querySelector("img[src='https://open-api.delcom.org/img/c.png']")).not.toBeNull();
  });
  it("menampilkan halaman tidak ditemukan dan kembali ke linimasa", async () => {
    vi.mocked(getPost).mockRejectedValue(new Error("404"));
    renderWithProviders(<DetailPage />);
    expect(await screen.findByText("Postingan tidak ditemukan")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Kembali ke linimasa" }));
    expect(nav.router.replace).toHaveBeenCalledWith("/");
  });
  it("menampilkan tidak ditemukan bila yang tersimpan adalah postingan lain dan pemuatan gagal", async () => {
    vi.mocked(getPost).mockRejectedValue(new Error("404"));
    renderWithProviders(<DetailPage />, { preloadedState: { posts: { ...makeStore().getState().posts, post: { ...basePost, id: "lain" } } } });
    expect(await screen.findByText("Postingan tidak ditemukan")).toBeInTheDocument();
  });
  it("tetap menampilkan postingan yang sudah tersimpan walau pemuatan ulang gagal", async () => {
    vi.mocked(getPost).mockRejectedValue(new Error("offline"));
    renderWithProviders(<DetailPage />, { preloadedState: { posts: { ...makeStore().getState().posts, post: basePost } } });
    expect(await screen.findByText("Isi postingan")).toBeInTheDocument();
    await waitFor(() => expect(getPost).toHaveBeenCalled());
    expect(screen.queryByText("Postingan tidak ditemukan")).toBeNull();
  });
  it("menganggap suka dan komentar nol bila datanya tidak ada", async () => {
    setup({ ...basePost, likes: undefined, comments: undefined });
    expect(await screen.findByText("Komentar (0)")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Suka" })).toHaveTextContent("0");
  });
  it("menyembunyikan aksi pemilik bagi pengguna lain", async () => {
    setup({ ...basePost, user_id: "other" });
    await screen.findByText("Isi postingan");
    expect(screen.queryByRole("button", { name: "Ubah" })).toBeNull();
    expect(screen.queryByRole("button", { name: "Hapus" })).toBeNull();
  });

  describe("suka", () => {
    it("menyukai postingan lalu memuat ulang", async () => {
      vi.mocked(toggleLike).mockResolvedValue(undefined);
      setup();
      fireEvent.click(await screen.findByRole("button", { name: "Suka" }));
      await waitFor(() => expect(toggleLike).toHaveBeenCalledWith("p1"));
      await waitFor(() => expect(getPost).toHaveBeenCalledTimes(2));
    });
    it("menampilkan status sudah disukai", async () => {
      setup({ ...basePost, likes: [{ user_id: "u1" }] });
      expect(await screen.findByRole("button", { name: "Batal suka" })).toBeInTheDocument();
    });
    it("menampilkan error bila gagal", async () => {
      vi.mocked(toggleLike).mockRejectedValue(new Error("Gagal suka"));
      setup();
      fireEvent.click(await screen.findByRole("button", { name: "Suka" }));
      await waitFor(() => expect(showErrorDialog).toHaveBeenCalledWith("Gagal suka"));
    });
  });

  describe("komentar", () => {
    const withComments: Post = { ...basePost, comments: [
      { id: "c1", comment: "milikku", user_id: "u1", author: { id: "u1", name: "Ani" } },
      { id: "c2", comment: "orang lain", user_id: "u2" },
    ] };

    it("menambah komentar dan mengosongkan input", async () => {
      vi.mocked(addComment).mockResolvedValue(undefined);
      setup();
      const input = await screen.findByLabelText("Komentar");
      fireEvent.change(input, { target: { value: "halo" } });
      fireEvent.click(screen.getByRole("button", { name: "Kirim komentar" }));
      await waitFor(() => expect(addComment).toHaveBeenCalledWith("p1", "halo"));
      await waitFor(() => expect(input).toHaveValue(""));
    });
    it("hanya pemilik komentar yang bisa menghapus dan nama bawaan dipakai bila author kosong", async () => {
      vi.mocked(deleteComment).mockResolvedValue(undefined);
      setup(withComments);
      expect(await screen.findByText("Pengguna")).toBeInTheDocument();
      const buttons = screen.getAllByRole("button", { name: "Hapus komentar" });
      expect(buttons).toHaveLength(1);
      fireEvent.click(buttons[0]);
      await waitFor(() => expect(deleteComment).toHaveBeenCalledWith("p1", "c1"));
    });
  });

  describe("aksi pemilik", () => {
    it("mengganti cover dan mengabaikan pilihan kosong", async () => {
      vi.mocked(changeCover).mockResolvedValue(undefined);
      const { container } = setup();
      await screen.findByText("Isi postingan");
      const input = container.querySelector<HTMLInputElement>("#post-cover-input")!;
      fireEvent.change(input, { target: { files: [] } });
      expect(changeCover).not.toHaveBeenCalled();
      const file = new File(["x"], "c.png", { type: "image/png" });
      fireEvent.change(input, { target: { files: [file] } });
      await waitFor(() => expect(changeCover).toHaveBeenCalledWith("p1", file));
    });
    it("membuka modal ubah postingan dan menutupnya", async () => {
      setup();
      fireEvent.click(await screen.findByRole("button", { name: "Ubah" }));
      expect(screen.getByText("Ubah postingan")).toBeInTheDocument();
      fireEvent.click(screen.getByRole("button", { name: "Batal" }));
      expect(screen.queryByText("Ubah postingan")).toBeNull();
    });
    it("menghapus postingan setelah konfirmasi", async () => {
      vi.mocked(showConfirmDialog).mockResolvedValue(true);
      vi.mocked(deletePost).mockResolvedValue(undefined);
      setup();
      fireEvent.click(await screen.findByRole("button", { name: "Hapus" }));
      await waitFor(() => expect(nav.router.replace).toHaveBeenCalledWith("/"));
      expect(deletePost).toHaveBeenCalledWith("p1");
    });
    it("tidak menghapus bila dibatalkan", async () => {
      vi.mocked(showConfirmDialog).mockResolvedValue(false);
      setup();
      fireEvent.click(await screen.findByRole("button", { name: "Hapus" }));
      await waitFor(() => expect(showConfirmDialog).toHaveBeenCalled());
      expect(deletePost).not.toHaveBeenCalled();
    });
    it("menampilkan error bila penghapusan gagal", async () => {
      vi.mocked(showConfirmDialog).mockResolvedValue(true);
      vi.mocked(deletePost).mockRejectedValue(new Error("Gagal hapus"));
      setup();
      fireEvent.click(await screen.findByRole("button", { name: "Hapus" }));
      await waitFor(() => expect(showErrorDialog).toHaveBeenCalledWith("Gagal hapus"));
      expect(nav.router.replace).not.toHaveBeenCalled();
    });
  });
});
