import { describe, expect, it } from "vitest";
import { assetUrl, avatarUrl } from "./avatarHelper";

const ORIGIN = "https://open-api.delcom.org";

describe("avatarHelper", () => {
  describe("assetUrl", () => {
    it("mengembalikan null untuk path kosong", () => {
      expect(assetUrl(null)).toBeNull();
      expect(assetUrl(undefined)).toBeNull();
      expect(assetUrl("")).toBeNull();
    });

    it("mengarahkan path /img dan /default ke origin Delcom", () => {
      expect(assetUrl("/img/a.png?v=1")).toBe(`${ORIGIN}/img/a.png?v=1`);
      expect(assetUrl("https://other.test/default/b.png")).toBe(`${ORIGIN}/default/b.png`);
    });

    it("mempertahankan URL lain apa adanya", () => {
      expect(assetUrl("https://cdn.test/x.png")).toBe("https://cdn.test/x.png");
    });

    it("mengembalikan null untuk URL tidak valid", () => {
      expect(assetUrl("http://")).toBeNull();
    });
  });

  describe("avatarUrl", () => {
    it("memakai foto jika valid", () => {
      expect(avatarUrl("/img/me.png")).toBe(`${ORIGIN}/img/me.png`);
    });

    it("fallback ke ui-avatars untuk foto default atau kosong", () => {
      expect(avatarUrl("/default/u.png", "Budi", 40)).toBe(
        "https://ui-avatars.com/api/?background=6366f1&color=fff&size=40&name=Budi",
      );
      expect(avatarUrl(null)).toContain("name=U");
      expect(avatarUrl(null, "")).toContain("name=U");
    });
  });
});