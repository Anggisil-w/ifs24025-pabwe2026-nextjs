import { describe, expect, it } from "vitest";
import empty from "./empty";

describe("empty", () => {
  it("mengekspor objek kosong sebagai pengganti polyfill", () => {
    expect(empty).toEqual({});
  });
});
