import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  next: vi.fn(),
  prepare: vi.fn(),
  handle: vi.fn(),
  createServer: vi.fn(),
  listen: vi.fn(),
}));

vi.mock("next", () => ({ default: mocks.next }));
vi.mock("node:http", () => ({
  default: { createServer: mocks.createServer },
  createServer: mocks.createServer,
}));

describe("server", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    mocks.prepare.mockResolvedValue(undefined);
    mocks.next.mockReturnValue({ prepare: mocks.prepare, getRequestHandler: () => mocks.handle });
    mocks.createServer.mockReturnValue({ listen: mocks.listen });
    mocks.listen.mockImplementation((...args: [number, () => void]) => args[1]());
    vi.spyOn(console, "log").mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it("berjalan dalam mode dev di port 3000 secara bawaan", async () => {
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv("APP_PORT", "");
    await import("./server");

    expect(mocks.next).toHaveBeenCalledWith({ dev: true, turbopack: true });
    expect(mocks.prepare).toHaveBeenCalledTimes(1);
    expect(mocks.listen).toHaveBeenCalledWith(3000, expect.any(Function));
    expect(console.log).toHaveBeenCalledWith("> Ready on http://localhost:3000");
  });

  it("berjalan dalam mode produksi di port dari APP_PORT dan meneruskan request", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("APP_PORT", "4000");
    await import("./server");

    expect(mocks.next).toHaveBeenCalledWith({ dev: false, turbopack: true });
    expect(mocks.listen).toHaveBeenCalledWith(4000, expect.any(Function));

    const requestListener = mocks.createServer.mock.calls[0][0];
    requestListener("req", "res");
    expect(mocks.handle).toHaveBeenCalledWith("req", "res");
  });
});