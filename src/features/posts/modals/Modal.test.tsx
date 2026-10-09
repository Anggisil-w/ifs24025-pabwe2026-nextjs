import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import Modal from "./Modal";

describe("Modal", () => {
  it("menampilkan judul dan isi sebagai dialog", () => {
    render(<Modal title="Judul" onClose={vi.fn()}><p>isi</p></Modal>);
    const dialog = screen.getByRole("dialog", { name: "Judul" });
    expect(dialog).toBeInTheDocument();
    expect(dialog.tagName).toBe("DIALOG");
    expect(dialog).toHaveAttribute("open");
    expect(screen.getByText("isi")).toBeInTheDocument();
  });
  it("menutup saat backdrop diklik", () => {
    const onClose = vi.fn();
    render(<Modal title="Judul" onClose={onClose}><p>isi</p></Modal>);
    fireEvent.click(screen.getByLabelText("Tutup"));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});