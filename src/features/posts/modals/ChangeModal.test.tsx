import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

vi.mock("../api/postApi", () => ({ changePost: vi.fn() }));
vi.mock("@/helpers/toolsHelper", async (orig) => (await import("@/test-utils")).toolsHelperMock(orig as never));

import { changePost } from "../api/postApi";
import { showErrorDialog, showSuccessDialog } from "@/helpers/toolsHelper";
import ChangeModal from "./ChangeModal";

describe("ChangeModal", () => {
  beforeEach(() => vi.clearAllMocks());

  it("menggunakan elemen <dialog> berisi form", () => {
    render(<ChangeModal id="p1" initial="lama" onClose={vi.fn()} onDone={vi.fn()} />);
    const dialog = screen.getByRole("dialog", { name: "Postingan" });
    expect(dialog.tagName).toBe("DIALOG");
    expect(dialog.querySelector("form")).not.toBeNull();
  });
  it("menyimpan perubahan lalu menutup modal", async () => {
    vi.mocked(changePost).mockResolvedValue(undefined);
    const onClose = vi.fn(); const onDone = vi.fn();
    render(<ChangeModal id="p1" initial="lama" onClose={onClose} onDone={onDone} />);
    const area = screen.getByDisplayValue("lama");
    fireEvent.change(area, { target: { value: "baru" } });
    fireEvent.click(screen.getByRole("button", { name: "Simpan" }));
    await waitFor(() => expect(onClose).toHaveBeenCalled());
    expect(changePost).toHaveBeenCalledWith("p1", "baru");
    expect(showSuccessDialog).toHaveBeenCalled();
    expect(onDone).toHaveBeenCalled();
  });
  it("menampilkan error bila gagal", async () => {
    vi.mocked(changePost).mockRejectedValue(new Error("Gagal ubah"));
    const onClose = vi.fn();
    render(<ChangeModal id="p1" initial="lama" onClose={onClose} onDone={vi.fn()} />);
    fireEvent.click(screen.getByRole("button", { name: "Simpan" }));
    await waitFor(() => expect(showErrorDialog).toHaveBeenCalledWith("Gagal ubah"));
    expect(onClose).not.toHaveBeenCalled();
  });
  it("menutup lewat Batal dan backdrop", () => {
    const onClose = vi.fn();
    render(<ChangeModal id="p1" initial="x" onClose={onClose} onDone={vi.fn()} />);
    fireEvent.click(screen.getByRole("button", { name: "Batal" }));
    fireEvent.click(screen.getByLabelText("Tutup"));
    expect(onClose).toHaveBeenCalledTimes(2);
  });
});