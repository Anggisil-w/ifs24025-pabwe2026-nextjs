import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, screen, waitFor } from "@testing-library/react";

vi.mock("../api/userApi", () => ({ getUsers: vi.fn() }));

import { getUsers } from "../api/userApi";
import { renderWithProviders } from "@/test-utils";
import UsersPage from "./UsersPage";

describe("UsersPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getUsers).mockResolvedValue({ users: [
      { id: "1", name: "Ani Budi", email: "ani@x.id" },
      { id: "2", name: "Cici", email: "cici@x.id", photo: "/img/c.png" },
    ] });
  });

  it("memuat dan menampilkan daftar pengguna", async () => {
    renderWithProviders(<UsersPage />);
    expect(await screen.findByText("ani@x.id")).toBeInTheDocument();
    expect(screen.getByText("Cici")).toBeInTheDocument();
    expect(getUsers).toHaveBeenCalledWith(undefined);
  });
  it("mencari pengguna dengan jeda debounce", async () => {
    renderWithProviders(<UsersPage />);
    await screen.findByText("ani@x.id");
    fireEvent.change(screen.getByLabelText("Cari pengguna"), { target: { value: "ani" } });
    await waitFor(() => expect(getUsers).toHaveBeenLastCalledWith("ani"));
  });
});
