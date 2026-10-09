import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import type { Post } from "@/types";

vi.mock("../api/postApi", () => ({ changeCover: vi.fn() }));
vi.mock("@/helpers/toolsHelper", async (orig) => (await import("@/test-utils")).toolsHelperMock(orig as never));

import { changeCover } from "../api/postApi";
import { showErrorDialog, showSuccessDialog } from "@/helpers/toolsHelper";
import ChangeCoverModal from "./ChangeCoverModal";

const post: Post = { id: "p1", user_id: "u1", description: "d", created_at: "2026-01-01" };
const file = new File(["x"], "c.png", { type: "image/png" });
const pick = (container: HTMLElement, files: File[]) =>
  fireEvent.change(container.querySelector("input[type=file]")!, { target: { files } });

describe("ChangeCoverModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    URL.createObjectURL = vi.fn(() => "blob:preview");
  });

  it("meminta memilih gambar bila belum ada file", () => {
    render(<ChangeCoverModal post={post} onClose={vi.fn()} onDone={vi.fn()} />);
    fireEvent.click(screen.getByRole("button", { name: "Unggah" }));
    expect(showErrorDialog).toHaveBeenCalledWith("Pilih gambar terlebih dahulu.");
    expect(changeCover).not.toHaveBeenCalled();
  });
  it("menampilkan cover yang sudah ada sebagai preview", () => {
    render(<ChangeCoverModal post={{ ...post, cover: "https://x/c.png" }} onClose={vi.fn()} onDone={vi.fn()} />);
    expect(screen.getByAltText("Preview cover")).toHaveAttribute("src", "https://x/c.png");
  });
  it("mengunggah file yang dipilih lalu menutup modal", async () => {
    vi.mocked(changeCover).mockResolvedValue(undefined);
    const onClose = vi.fn(); const onDone = vi.fn();
    const { container } = render(<ChangeCoverModal post={post} onClose={onClose} onDone={onDone} />);
    pick(container, [file]);
    expect(screen.getByAltText("Preview cover")).toHaveAttribute("src", "blob:preview");
    fireEvent.click(screen.getByRole("button", { name: "Unggah" }));
    await waitFor(() => expect(onClose).toHaveBeenCalled());
    expect(changeCover).toHaveBeenCalledWith("p1", file);
    expect(showSuccessDialog).toHaveBeenCalled();
    expect(onDone).toHaveBeenCalled();
  });
  it("mengabaikan pemilihan file kosong", () => {
    const { container } = render(<ChangeCoverModal post={post} onClose={vi.fn()} onDone={vi.fn()} />);
    pick(container, []);
    expect(screen.queryByAltText("Preview cover")).toBeNull();
  });
  it("menampilkan pesan error dari server atau pesan bawaan", async () => {
    vi.mocked(changeCover).mockRejectedValueOnce(new Error("Terlalu besar")).mockRejectedValueOnce(new Error(""));
    const { container } = render(<ChangeCoverModal post={post} onClose={vi.fn()} onDone={vi.fn()} />);
    pick(container, [file]);
    fireEvent.click(screen.getByRole("button", { name: "Unggah" }));
    await waitFor(() => expect(showErrorDialog).toHaveBeenCalledWith("Terlalu besar"));
    await waitFor(() => expect(screen.getByRole("button", { name: "Unggah" })).toBeEnabled());
    fireEvent.click(screen.getByRole("button", { name: "Unggah" }));
    await waitFor(() => expect(showErrorDialog).toHaveBeenCalledWith("Upload gagal"));
  });
  it("menutup lewat tombol Batal", () => {
    const onClose = vi.fn();
    render(<ChangeCoverModal post={post} onClose={onClose} onDone={vi.fn()} />);
    fireEvent.click(screen.getByRole("button", { name: "Batal" }));
    expect(onClose).toHaveBeenCalled();
  });
});
