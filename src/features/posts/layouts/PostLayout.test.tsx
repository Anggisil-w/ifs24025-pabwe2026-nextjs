import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, fireEvent, screen, waitFor } from "@testing-library/react";

const nav = vi.hoisted(() => ({ router: { replace: vi.fn(), push: vi.fn() }, pathname: "/" }));
vi.mock("next/navigation", () => ({
  useRouter: () => nav.router,
  usePathname: () => nav.pathname,
  useSearchParams: () => new URLSearchParams(),
}));
vi.mock("@/helpers/apiHelper", () => ({
  getAccessToken: vi.fn(), api: vi.fn(), removeAccessToken: vi.fn(), putAccessToken: vi.fn(),
}));
vi.mock("@/helpers/toolsHelper", async (orig) => (await import("@/test-utils")).toolsHelperMock(orig as never));

import { api, getAccessToken } from "@/helpers/apiHelper";
import { showConfirmDialog } from "@/helpers/toolsHelper";
import { renderWithProviders } from "@/test-utils";
import PostLayout from "./PostLayout";

const user = { id: "u1", name: "Ani", email: "a@b.c" };
const g = globalThis as Record<string, unknown>;

describe("PostLayout", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    nav.pathname = "/";
    vi.mocked(getAccessToken).mockReturnValue("token");
    vi.mocked(api).mockResolvedValue({ user });
  });
  afterEach(() => {
    vi.useRealTimers();
    delete g.requestIdleCallback;
    delete g.cancelIdleCallback;
  });

  it("redirect ke login bila tidak ada token", () => {
    vi.mocked(getAccessToken).mockReturnValue(null);
    renderWithProviders(<PostLayout><p>isi</p></PostLayout>);
    expect(nav.router.replace).toHaveBeenCalledWith("/auth/login");
    expect(api).not.toHaveBeenCalled();
  });
  it("memuat profil langsung di halaman profil", async () => {
    nav.pathname = "/profile";
    renderWithProviders(<PostLayout><p>isi</p></PostLayout>);
    await waitFor(() => expect(api).toHaveBeenCalledWith("/users/me"));
    expect(screen.getByText("isi")).toBeInTheDocument();
  });
  it("menunda pemuatan profil dengan setTimeout bila requestIdleCallback tidak ada", async () => {
    vi.useFakeTimers();
    const { unmount } = renderWithProviders(<PostLayout><p>isi</p></PostLayout>);
    expect(api).not.toHaveBeenCalled();
    await act(async () => { await vi.advanceTimersByTimeAsync(1200); });
    expect(api).toHaveBeenCalledWith("/users/me");
    unmount();
  });
  it("memakai requestIdleCallback bila tersedia dan membatalkannya saat unmount", () => {
    g.requestIdleCallback = vi.fn(() => 7);
    g.cancelIdleCallback = vi.fn();
    const { unmount } = renderWithProviders(<PostLayout><p>isi</p></PostLayout>);
    expect(g.requestIdleCallback).toHaveBeenCalled();
    unmount();
    expect(g.cancelIdleCallback).toHaveBeenCalledWith(7);
  });
  it("membatalkan timeout saat unmount sebelum profil dimuat", () => {
    vi.useFakeTimers();
    const { unmount } = renderWithProviders(<PostLayout><p>isi</p></PostLayout>);
    unmount();
    vi.advanceTimersByTime(2000);
    expect(api).not.toHaveBeenCalled();
  });
  it("redirect ke login bila profil selesai dimuat tapi kosong", () => {
    renderWithProviders(<PostLayout><p>isi</p></PostLayout>, { preloadedState: { auth: { profile: null, isProfile: true } } });
    expect(nav.router.replace).toHaveBeenCalledWith("/auth/login");
  });
  it("membuka dan menutup sidebar dari navbar", () => {
    renderWithProviders(<PostLayout><p>isi</p></PostLayout>);
    fireEvent.click(screen.getByRole("button", { name: "Buka menu" }));
    fireEvent.click(screen.getByLabelText("Tutup menu"));
    expect(screen.queryByLabelText("Tutup menu")).toBeNull();
  });
  it("logout setelah konfirmasi", async () => {
    vi.mocked(showConfirmDialog).mockResolvedValue(true);
    const { store } = renderWithProviders(<PostLayout><p>isi</p></PostLayout>, {
      preloadedState: { auth: { profile: user, isProfile: true } },
    });
    fireEvent.click(screen.getByRole("button", { name: "Keluar" }));
    await waitFor(() => expect(store.getState().auth.profile).toBeNull());
    expect(nav.router.replace).toHaveBeenCalledWith("/auth/login");
  });
  it("tidak logout bila konfirmasi dibatalkan", async () => {
    vi.mocked(showConfirmDialog).mockResolvedValue(false);
    const { store } = renderWithProviders(<PostLayout><p>isi</p></PostLayout>, {
      preloadedState: { auth: { profile: user, isProfile: true } },
    });
    fireEvent.click(screen.getByRole("button", { name: "Keluar" }));
    await waitFor(() => expect(showConfirmDialog).toHaveBeenCalled());
    expect(store.getState().auth.profile).toEqual(user);
  });
});
