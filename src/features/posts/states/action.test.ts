import { describe, expect, it } from "vitest";
import { PostActionType, resetPostStatus } from "./action";

describe("posts action", () => {
  it("setiap tipe aksi unik", () => {
    const values = Object.values(PostActionType);
    expect(new Set(values).size).toBe(values.length);
  });
  it("resetPostStatus membuat aksi dengan tipe yang benar", () => {
    expect(resetPostStatus()).toEqual({ type: PostActionType.RESET_STATUS });
  });
});
