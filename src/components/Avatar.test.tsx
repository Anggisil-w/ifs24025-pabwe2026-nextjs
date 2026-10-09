import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import Avatar from "./Avatar";

describe("Avatar", () => {
  it("menampilkan inisial nama depan dan belakang", () => {
    const { container } = render(<Avatar name="Budi Santoso" size={40} />);
    expect(container).toHaveTextContent("BS");
  });
  it("menampilkan satu huruf untuk nama satu kata", () => {
    const { container } = render(<Avatar name="budi" size={40} />);
    expect(container).toHaveTextContent("B");
    expect(container.textContent).toBe("B");
  });
  it("memakai U bila nama kosong", () => {
    const { container } = render(<Avatar name={null} size={40} />);
    expect(container.textContent).toBe("U");
  });
  it("memakai inisial bila foto adalah gambar default", () => {
    const { container } = render(<Avatar photo="/default/avatar.png" name="Ani" size={32} />);
    expect(container.querySelector("img")).toBeNull();
    expect(container.textContent).toBe("A");
  });
  it("menampilkan foto asli beserta className tambahan", () => {
    const { container } = render(<Avatar photo="/img/ani.png" name="Ani" size={32} className="extra" />);
    const img = container.querySelector("img");
    expect(img).toHaveAttribute("src", "https://open-api.delcom.org/img/ani.png");
    expect(img).toHaveClass("extra");
  });
});
