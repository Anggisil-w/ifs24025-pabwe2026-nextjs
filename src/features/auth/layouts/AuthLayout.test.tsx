import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

const nav = vi.hoisted(() => ({ router: { replace: vi.fn(), push: vi.fn() } }));
vi.mock("next/navigation", () => ({ useRouter: () => nav.router }));
vi.mock("@/helpers/apiHelper", () => ({ getAccessToken: vi.fn() }));

import { getAccessToken } from "@/helpers/apiHelper";
import AuthLayout from "./AuthLayout";

describe("AuthLayout", () => {
  beforeEach(() => vi.clearAllMocks());

  it("menampilkan children dan tidak redirect bila belum login", () => {
    vi.mocked(getAccessToken).mockReturnValue(null);
    render(<AuthLayout><p>form</p></AuthLayout>);
    expect(screen.getByText("form")).toBeInTheDocument();
    expect(nav.router.replace).not.toHaveBeenCalled();
  });
  it("redirect ke beranda bila sudah login", () => {
    vi.mocked(getAccessToken).mockReturnValue("token");
    render(<AuthLayout><p>form</p></AuthLayout>);
    expect(nav.router.replace).toHaveBeenCalledWith("/");
  });
});
