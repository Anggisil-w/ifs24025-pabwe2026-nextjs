import { describe, expect, it, vi } from "vitest";
import { fireEvent, screen } from "@testing-library/react";
import { renderWithProviders } from "@/test-utils";
import NavbarComponent from "./NavbarComponent";

describe("NavbarComponent", () => {
  it("menampilkan nama pengguna dan memicu menu serta logout", () => {
    const onMenu = vi.fn(); const onLogout = vi.fn();
    renderWithProviders(<NavbarComponent onMenu={onMenu} onLogout={onLogout} />, {
      preloadedState: { auth: { profile: { id: "u1", name: "Ani Budi", email: "a@b.c" }, isProfile: true } },
    });
    expect(screen.getByRole("link", { name: "Profil Ani Budi" })).toHaveAttribute("href", "/profile");
    expect(screen.getByText("Ani Budi")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Buka menu" }));
    fireEvent.click(screen.getByRole("button", { name: "Keluar" }));
    expect(onMenu).toHaveBeenCalled();
    expect(onLogout).toHaveBeenCalled();
  });
  it("memakai label bawaan bila profil belum dimuat", () => {
    renderWithProviders(<NavbarComponent onMenu={vi.fn()} onLogout={vi.fn()} />);
    expect(screen.getByRole("link", { name: "Profil saya" })).toBeInTheDocument();
  });
});
