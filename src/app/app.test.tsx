import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";

vi.mock("next/font/google", () => ({ Inter: () => ({ className: "inter" }) }));
vi.mock("@/features/posts/pages/HomePage", () => ({ default: () => <p>halaman-home</p> }));
vi.mock("@/features/posts/pages/DetailPage", () => ({ default: () => <p>halaman-detail</p> }));
vi.mock("@/features/users/pages/ProfilePage", () => ({ default: () => <p>halaman-profil</p> }));
vi.mock("@/features/users/pages/UsersPage", () => ({ default: () => <p>halaman-users</p> }));
vi.mock("@/features/auth/pages/LoginPage", () => ({ default: () => <p>halaman-login</p> }));
vi.mock("@/features/auth/pages/RegisterPage", () => ({ default: () => <p>halaman-register</p> }));
vi.mock("@/features/auth/layouts/AuthLayout", () => ({ default: ({ children }: { children: React.ReactNode }) => <div>auth:{children}</div> }));
vi.mock("@/features/posts/layouts/PostLayout", () => ({ default: ({ children }: { children: React.ReactNode }) => <div>post:{children}</div> }));

import RootLayout, { metadata } from "./layout";
import DashboardLayout from "./(dashboard)/layout";
import AuthRouteLayout from "./auth/layout";
import HomeRoute from "./(dashboard)/page";
import ProfileRoute from "./(dashboard)/profile/page";
import UsersRoute from "./(dashboard)/users/page";
import DetailRoute from "./(dashboard)/posts/[postId]/page";
import LoginRoute from "./auth/login/page";
import RegisterRoute from "./auth/register/page";

describe("route app", () => {
  it.each([
    ["beranda", HomeRoute, "halaman-home"],
    ["profil", ProfileRoute, "halaman-profil"],
    ["pengguna", UsersRoute, "halaman-users"],
    ["detail", DetailRoute, "halaman-detail"],
    ["login", LoginRoute, "halaman-login"],
    ["register", RegisterRoute, "halaman-register"],
  ])("route %s merender halaman fitur", (_n, Page, text) => {
    render(<Page />);
    expect(screen.getByText(text)).toBeInTheDocument();
  });

  it("layout dashboard membungkus children dengan Providers dan PostLayout", () => {
    render(<DashboardLayout><span>konten</span></DashboardLayout>);
    expect(screen.getByText(/post:/)).toHaveTextContent("konten");
  });
  it("layout auth memakai AuthLayout", () => {
    render(<AuthRouteLayout><span>form</span></AuthRouteLayout>);
    expect(screen.getByText(/auth:/)).toHaveTextContent("form");
  });
  it("root layout memasang html berbahasa Indonesia dan font", () => {
    const html = renderToStaticMarkup(<RootLayout><p>isi</p></RootLayout>);
    expect(html).toContain('lang="id"');
    expect(html).toContain("inter");
    expect(html).toContain("<p>isi</p>");
    expect(metadata.title).toBe("Postingan");
  });
});
