import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const m = vi.hoisted(() => ({
  next: vi.fn(),
  prepare: vi.fn(),
  handle: vi.fn(),
  createServer: vi.fn(),
  listen: vi.fn(),
}));

vi.mock("next", () => ({ default: m.next }));
vi.mock("node:http", () => ({ createServer: m.createServer }));

describe("server", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    m.prepare.mockResolvedValue(undefined);
    m.next.mockReturnValue({ prepare: m.prepare, getRequestHandler: () => m.handle });
    m.createServer.mockReturnValue({ listen: m.listen });
    m.listen.mockImplementation((_port: number, onReady: () => void) => onReady());
    vi.spyOn(console, "log").mockImplementation(() => undefined);
  });
  afterEach(() => vi.unstubAllEnvs());

  it("memakai port 3000 dan mode dev bila env tidak diatur", async () => {
    vi.stubEnv("APP_PORT", "");
    vi.stubEnv("NODE_ENV", "development");
    await import("./server");

    expect(m.next).toHaveBeenCalledWith({ dev: true, turbopack: true });
    expect(m.prepare).toHaveBeenCalledTimes(1);
    expect(m.listen).toHaveBeenCalledWith(3000, expect.any(Function));
    expect(console.log).toHaveBeenCalledWith("> Ready on http://localhost:3000");
  });

  it("memakai APP_PORT dan mode produksi bila diatur", async () => {
    vi.stubEnv("APP_PORT", "4000");
    vi.stubEnv("NODE_ENV", "production");
    await import("./server");

    expect(m.next).toHaveBeenCalledWith({ dev: false, turbopack: true });
    expect(m.listen).toHaveBeenCalledWith(4000, expect.any(Function));
    expect(console.log).toHaveBeenCalledWith("> Ready on http://localhost:4000");
  });

  it("meneruskan request ke handler Next", async () => {
    await import("./server");
    const onRequest = m.createServer.mock.calls[0][0];
    const req = {}; const res = {};
    onRequest(req, res);

    expect(m.handle).toHaveBeenCalledWith(req, res);
  });
});
