import next from "next";
import { createServer } from "node:http";
const port = Number(process.env.APP_PORT || 3000);
const app = next({ dev: process.env.NODE_ENV !== "production", turbopack: true });
await app.prepare();
const handle = app.getRequestHandler();
createServer((req, res) => handle(req, res)).listen(port, () => console.log(`> Ready on http://localhost:${port}`));