import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import Modal from "./Modal";

describe("Modal", () => {
  it("menampilkan judul dan isi sebagai dialog", () => {
    render(<Modal title="Judul" onClose={vi.fn()}><p>isi</p></Modal>);
    expect(screen.getByRole("dialog", { name: "Judul" })).toBeInTheDocument();
    expect(screen.getByText("isi")).toBeInTheDocument();
  });
  it("menutup saat backdrop diklik", () => {
    const onClose = vi.fn();
    render(<Modal title="Judul" onClose={onClose}><p>isi</p></Modal>);
    fireEvent.click(screen.getByLabelText("Tutup"));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
