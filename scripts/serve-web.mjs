import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, resolve, sep } from "node:path";

const root = resolve("dist");
const types = {
  ".html": "text/html",
  ".js": "application/javascript",
  ".css": "text/css",
  ".png": "image/png",
  ".ttf": "font/ttf",
  ".ico": "image/x-icon",
};
createServer(async (req, res) => {
  const path = resolve(
    root,
    `.${decodeURIComponent(new URL(req.url, "http://localhost").pathname)}`,
  );
  if (path !== root && !path.startsWith(root + sep)) {
    res.writeHead(403).end();
    return;
  }
  try {
    const content = await readFile(path);
    res.setHeader(
      "Content-Type",
      types[extname(path)] || "application/octet-stream",
    );
    res.end(content);
  } catch {
    res.setHeader("Content-Type", "text/html");
    res.end(await readFile(resolve(root, "index.html")));
  }
}).listen(4173, "127.0.0.1", () =>
  console.log("Preview: http://127.0.0.1:4173"),
);
