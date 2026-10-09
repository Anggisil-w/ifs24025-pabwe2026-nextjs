import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

const nav = vi.hoisted(() => ({ router: { replace: vi.fn(), push: vi.fn() } }));
vi.mock("next/navigation", () => ({ useRouter: () => nav.router }));
vi.mock("../api/authApi", () => ({ login: vi.fn(), register: vi.fn() }));
vi.mock("@/helpers/apiHelper", () => ({ putAccessToken: vi.fn() }));
vi.mock("@/helpers/toolsHelper", async (orig) => (await import("@/test-utils")).toolsHelperMock(orig as never));

import { login } from "../api/authApi";
import { putAccessToken } from "@/helpers/apiHelper";
import { showErrorDialog } from "@/helpers/toolsHelper";
import LoginPage from "./LoginPage";

const fill = () => {
  fireEvent.change(screen.getByLabelText("Email"), { target: { value: "a@b.c" } });
  fireEvent.change(screen.getByLabelText("Kata sandi"), { target: { value: "rahasia" } });
};

describe("LoginPage", () => {
  beforeEach(() => vi.clearAllMocks());

  it("login berhasil menyimpan token dan pindah ke beranda", async () => {
    vi.mocked(login).mockResolvedValue({ token: "tkn" });
    render(<LoginPage />);
    fill();
    fireEvent.click(screen.getByRole("button", { name: "Masuk" }));
    await waitFor(() => expect(nav.router.replace).toHaveBeenCalledWith("/"));
    expect(login).toHaveBeenCalledWith("a@b.c", "rahasia");
    expect(putAccessToken).toHaveBeenCalledWith("tkn");
  });
  it("menampilkan dialog error bila login gagal dan tombol aktif kembali", async () => {
    vi.mocked(login).mockRejectedValue(new Error("Salah"));
    render(<LoginPage />);
    fill();
    fireEvent.click(screen.getByRole("button", { name: "Masuk" }));
    await waitFor(() => expect(showErrorDialog).toHaveBeenCalledWith("Salah"));
    await waitFor(() => expect(screen.getByRole("button", { name: "Masuk" })).toBeEnabled());
    expect(nav.router.replace).not.toHaveBeenCalled();
  });
  it("menampilkan teks memproses selama request berjalan", async () => {
    let done: (v: { token: string }) => void = () => {};
    vi.mocked(login).mockReturnValue(new Promise((r) => { done = r; }));
    render(<LoginPage />);
    fill();
    fireEvent.click(screen.getByRole("button", { name: "Masuk" }));
    expect(await screen.findByRole("button", { name: "Memproses..." })).toBeDisabled();
    done({ token: "x" });
    await waitFor(() => expect(nav.router.replace).toHaveBeenCalled());
  });
});
