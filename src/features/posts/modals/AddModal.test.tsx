import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

vi.mock("../api/postApi", () => ({ addPost: vi.fn() }));
vi.mock("@/helpers/toolsHelper", async (orig) => (await import("@/test-utils")).toolsHelperMock(orig as never));

import { addPost } from "../api/postApi";
import { showErrorDialog, showSuccessDialog } from "@/helpers/toolsHelper";
import AddModal from "./AddModal";

const submit = () => {
  fireEvent.change(screen.getByPlaceholderText("Apa yang kamu pikirkan?"), { target: { value: "halo" } });
  fireEvent.click(screen.getByRole("button", { name: "Publikasikan" }));
};

describe("AddModal", () => {
  beforeEach(() => vi.clearAllMocks());

  it("menggunakan elemen <dialog> berisi form", () => {
    render(<AddModal onClose={vi.fn()} onDone={vi.fn()} />);
    const dialog = screen.getByRole("dialog", { name: "Postingan" });
    expect(dialog.tagName).toBe("DIALOG");
    expect(dialog.querySelector("form")).not.toBeNull();
  });
  it("mempublikasikan postingan lalu menutup modal", async () => {
    vi.mocked(addPost).mockResolvedValue(undefined);
    const onClose = vi.fn(); const onDone = vi.fn();
    render(<AddModal onClose={onClose} onDone={onDone} />);
    submit();
    await waitFor(() => expect(onClose).toHaveBeenCalled());
    expect(addPost).toHaveBeenCalledWith("halo");
    expect(showSuccessDialog).toHaveBeenCalled();
    expect(onDone).toHaveBeenCalled();
  });
  it("menampilkan error dan mengaktifkan tombol lagi bila gagal", async () => {
    vi.mocked(addPost).mockRejectedValue(new Error("Gagal"));
    const onClose = vi.fn();
    render(<AddModal onClose={onClose} onDone={vi.fn()} />);
    submit();
    await waitFor(() => expect(showErrorDialog).toHaveBeenCalledWith("Gagal"));
    expect(screen.getByRole("button", { name: "Publikasikan" })).toBeEnabled();
    expect(onClose).not.toHaveBeenCalled();
  });
  it("menutup lewat tombol Batal dan backdrop", () => {
    const onClose = vi.fn();
    render(<AddModal onClose={onClose} onDone={vi.fn()} />);
    fireEvent.click(screen.getByRole("button", { name: "Batal" }));
    fireEvent.click(screen.getByLabelText("Tutup"));
    expect(onClose).toHaveBeenCalledTimes(2);
  });
});