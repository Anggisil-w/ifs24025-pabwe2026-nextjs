import { createServer } from "http";
import parseArgs from "minimist";
import next from "next";

const args = parseArgs(process.argv.slice(2));
const dev = args._[0] !== "start";
const hostname = "localhost";
const port = parseInt(process.env.APP_PORT || "3000", 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      await handle(req, res);
    } catch (err) {
      console.error("Error occurred handling", req.url, err);
      res.statusCode = 500;
      res.end("internal server error");
    }
  }).listen(port, () => {
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});