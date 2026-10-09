import "@testing-library/jest-dom/vitest";

import { vi } from "vitest";
import { createElement } from "react";

// next/image memakai loader & optimasi Next yang tidak relevan di jsdom: ganti dengan <img> biasa.
vi.mock("next/image", () => ({
  default: ({ priority: _p, quality: _q, sizes: _s, ...props }: Record<string, unknown>) => createElement("img", { alt: "", ...props }),
}));
