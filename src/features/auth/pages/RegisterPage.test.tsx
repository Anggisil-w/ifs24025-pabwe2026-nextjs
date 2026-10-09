import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

const nav = vi.hoisted(() => ({ router: { replace: vi.fn(), push: vi.fn() } }));
vi.mock("next/navigation", () => ({ useRouter: () => nav.router }));
vi.mock("../api/authApi", () => ({ login: vi.fn(), register: vi.fn() }));
vi.mock("@/helpers/toolsHelper", async (orig) => (await import("@/test-utils")).toolsHelperMock(orig as never));

import { register } from "../api/authApi";
import { showErrorDialog, showSuccessDialog, showWarningDialog } from "@/helpers/toolsHelper";
import RegisterPage from "./RegisterPage";

const fill = (password: string) => {
  fireEvent.change(screen.getByLabelText("Nama lengkap"), { target: { value: "Ani" } });
  fireEvent.change(screen.getByLabelText("Email"), { target: { value: "a@b.c" } });
  fireEvent.change(screen.getByLabelText("Kata sandi"), { target: { value: password } });
  fireEvent.click(screen.getByRole("button", { name: "Daftar" }));
};

describe("RegisterPage", () => {
  beforeEach(() => vi.clearAllMocks());

  it("menolak kata sandi kurang dari 6 karakter", async () => {
    render(<RegisterPage />);
    fill("123");
    await waitFor(() => expect(showWarningDialog).toHaveBeenCalledWith("Kata sandi minimal 6 karakter"));
    expect(register).not.toHaveBeenCalled();
  });
  it("mendaftar lalu mengarahkan ke halaman login", async () => {
    vi.mocked(register).mockResolvedValue(undefined);
    render(<RegisterPage />);
    fill("123456");
    await waitFor(() => expect(nav.router.replace).toHaveBeenCalledWith("/auth/login"));
    expect(register).toHaveBeenCalledWith("Ani", "a@b.c", "123456");
    expect(showSuccessDialog).toHaveBeenCalled();
  });
  it("menampilkan dialog error bila pendaftaran gagal", async () => {
    vi.mocked(register).mockRejectedValue(new Error("Email dipakai"));
    render(<RegisterPage />);
    fill("123456");
    await waitFor(() => expect(showErrorDialog).toHaveBeenCalledWith("Email dipakai"));
    expect(nav.router.replace).not.toHaveBeenCalled();
  });
});
