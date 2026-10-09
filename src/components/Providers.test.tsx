import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Providers from "./Providers";

describe("Providers", () => {
  it("merender children di dalam Redux Provider", () => {
    render(<Providers><p>isi</p></Providers>);
    expect(screen.getByText("isi")).toBeInTheDocument();
  });
});
