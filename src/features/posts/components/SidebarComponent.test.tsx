import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";

const nav = vi.hoisted(() => ({ pathname: "/", search: new URLSearchParams() }));
vi.mock("next/navigation", () => ({ usePathname: () => nav.pathname, useSearchParams: () => nav.search }));

import SidebarComponent from "./SidebarComponent";

const active = () => screen.getAllByRole("link").filter((l) => l.getAttribute("aria-current") === "page").map((l) => l.textContent);

describe("SidebarComponent", () => {
  beforeEach(() => { nav.pathname = "/"; nav.search = new URLSearchParams(); });

  it("menandai Semua Postingan aktif di beranda", () => {
    render(<SidebarComponent open={false} onClose={vi.fn()} />);
    expect(active()).toEqual(["Semua Postingan"]);
    expect(screen.queryByLabelText("Tutup menu")).toBeNull();
  });
  it("menandai Postingan Saya aktif saat ?me=1", () => {
    nav.search = new URLSearchParams("me=1");
    render(<SidebarComponent open={false} onClose={vi.fn()} />);
    expect(active()).toEqual(["Postingan Saya"]);
  });
  it("menandai menu sesuai path lain", () => {
    nav.pathname = "/users";
    const { unmount } = render(<SidebarComponent open={false} onClose={vi.fn()} />);
    expect(active()).toEqual(["Daftar Pengguna"]);
    unmount();
    nav.pathname = "/profile";
    render(<SidebarComponent open={false} onClose={vi.fn()} />);
    expect(active()).toEqual(["Profil Saya"]);
  });
  it("menutup sidebar saat backdrop atau link diklik", () => {
    const onClose = vi.fn();
    render(<SidebarComponent open onClose={onClose} />);
    fireEvent.click(screen.getByLabelText("Tutup menu"));
    const link = screen.getByRole("link", { name: "Daftar Pengguna" });
    link.addEventListener("click", (e) => e.preventDefault()); // jsdom tidak mengimplementasi navigasi
    fireEvent.click(link);
    expect(onClose).toHaveBeenCalledTimes(2);
  });
});
