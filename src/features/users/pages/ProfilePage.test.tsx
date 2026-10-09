import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, screen, waitFor } from "@testing-library/react";

vi.mock("../api/userApi", () => ({ updateMe: vi.fn(), uploadPhoto: vi.fn(), changePassword: vi.fn() }));
vi.mock("@/helpers/apiHelper", () => ({ getAccessToken: vi.fn(() => "t"), api: vi.fn(), removeAccessToken: vi.fn() }));
vi.mock("@/helpers/toolsHelper", async (orig) => (await import("@/test-utils")).toolsHelperMock(orig as never));

import { changePassword, updateMe, uploadPhoto } from "../api/userApi";
import { api } from "@/helpers/apiHelper";
import { showErrorDialog, showSuccessDialog } from "@/helpers/toolsHelper";
import { renderWithProviders } from "@/test-utils";
import ProfilePage from "./ProfilePage";

const me = { id: "u1", name: "Ani", email: "ani@x.id", photo: "/img/a.png" };
const setup = () => renderWithProviders(<ProfilePage />, { preloadedState: { auth: { profile: me, isProfile: true } } });

describe("ProfilePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(api).mockResolvedValue({ user: me });
  });

  it("tidak merender apa pun sebelum profil tersedia", () => {
    const { container } = renderWithProviders(<ProfilePage />);
    expect(container).toBeEmptyDOMElement();
  });
  it("mengisi form dengan data profil dan menyimpan perubahan", async () => {
    vi.mocked(updateMe).mockResolvedValue(undefined);
    setup();
    expect(screen.getByLabelText("Nama")).toHaveValue("Ani");
    fireEvent.change(screen.getByLabelText("Nama"), { target: { value: "Ani Baru" } });
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "baru@x.id" } });
    fireEvent.click(screen.getByRole("button", { name: "Simpan" }));
    await waitFor(() => expect(showSuccessDialog).toHaveBeenCalledWith("Profil diperbarui"));
    expect(updateMe).toHaveBeenCalledWith("Ani Baru", "baru@x.id");
  });
  it("mengubah kata sandi lalu mengosongkan kolom", async () => {
    vi.mocked(changePassword).mockResolvedValue(undefined);
    setup();
    fireEvent.change(screen.getByLabelText("Kata sandi lama"), { target: { value: "lama" } });
    fireEvent.change(screen.getByLabelText("Kata sandi baru"), { target: { value: "baru123" } });
    fireEvent.click(screen.getByRole("button", { name: "Ubah" }));
    await waitFor(() => expect(showSuccessDialog).toHaveBeenCalledWith("Kata sandi diubah"));
    expect(changePassword).toHaveBeenCalledWith("lama", "baru123");
    expect(screen.getByLabelText("Kata sandi lama")).toHaveValue("");
    expect(screen.getByLabelText("Kata sandi baru")).toHaveValue("");
  });
  it("mengunggah foto yang dipilih dan mengabaikan pilihan kosong", async () => {
    vi.mocked(uploadPhoto).mockResolvedValue(undefined);
    const { container } = setup();
    const input = container.querySelector<HTMLInputElement>("#profile-photo-input")!;
    fireEvent.change(input, { target: { files: [] } });
    expect(uploadPhoto).not.toHaveBeenCalled();
    const file = new File(["x"], "f.png", { type: "image/png" });
    fireEvent.change(input, { target: { files: [file] } });
    await waitFor(() => expect(showSuccessDialog).toHaveBeenCalledWith("Foto diperbarui"));
    expect(uploadPhoto).toHaveBeenCalledWith(file);
  });
  it("menampilkan dialog error bila request gagal", async () => {
    vi.mocked(updateMe).mockRejectedValue(new Error("Gagal simpan"));
    setup();
    fireEvent.click(screen.getByRole("button", { name: "Simpan" }));
    await waitFor(() => expect(showErrorDialog).toHaveBeenCalledWith("Gagal simpan"));
  });
});
