import next from "next";
import { createServer } from "node:http";
import { APP_PORT } from "./lib/config";
const dev=process.argv.includes("dev");
const app=next({dev});
const handle=app.getRequestHandler();
app.prepare().then(()=>createServer((req,res)=>handle(req,res)).listen(APP_PORT,()=>console.log(`➜ http://localhost:${APP_PORT}`)));
