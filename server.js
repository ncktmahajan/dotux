/**
 * nchikt.ux — Local Domain Server
 * Serves HTTP on port 80 (or PORT env var)
 * Run: node server.js
 * Requires: nchikt.ux → 127.0.0.1 in /etc/hosts
 */

const http = require("http");
const https = require("https");
const fs = require("fs");
const path = require("path");
const url = require("url");

const PORT = process.env.PORT || 80;
const HTTPS_PORT = process.env.HTTPS_PORT || 443;
const PUBLIC_DIR = path.join(__dirname, "public");

// ─── MIME Types ───────────────────────────────────────────────
const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".txt": "text/plain",
};

// ─── Request Handler ──────────────────────────────────────────
function requestHandler(req, res) {
  const parsedUrl = url.parse(req.url);
  let pathname = parsedUrl.pathname;

  // Default to index.html
  if (pathname === "/") pathname = "/index.html";

  const filePath = path.join(PUBLIC_DIR, pathname);
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || "application/octet-stream";

  // Security: prevent directory traversal
  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403, { "Content-Type": "text/plain" });
    res.end("403 Forbidden");
    return;
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      if (err.code === "ENOENT") {
        // Try serving index.html for SPA-style routing
        fs.readFile(path.join(PUBLIC_DIR, "index.html"), (err2, indexData) => {
          if (err2) {
            res.writeHead(404, { "Content-Type": "text/html" });
            res.end(get404Page());
          } else {
            res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
            res.end(indexData);
          }
        });
      } else {
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("500 Internal Server Error");
      }
      return;
    }

    res.writeHead(200, {
      "Content-Type": contentType,
      "Cache-Control": "no-cache",
      "X-Powered-By": "nchikt.ux",
    });
    res.end(data);
  });

  // Log request
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
}

// ─── 404 Page ─────────────────────────────────────────────────
function get404Page() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>404 — nchikt.ux</title>
  <style>
    body { margin: 0; background: #0a0a0a; color: #fff;
           font-family: monospace; display: flex; align-items: center;
           justify-content: center; height: 100vh; text-align: center; }
    h1 { font-size: 6rem; margin: 0; color: #ff4d4d; }
    p { color: #888; }
    a { color: #00ff88; text-decoration: none; }
  </style>
</head>
<body>
  <div>
    <h1>404</h1>
    <p>Page not found on <strong>nchikt.ux</strong></p>
    <a href="/">← Go Home</a>
  </div>
</body>
</html>`;
}

// ─── Start HTTP Server ────────────────────────────────────────
const httpServer = http.createServer(requestHandler);

httpServer.listen(PORT, () => {
  console.log("");
 console.log("  ███╗   ██╗ ██████╗██╗  ██╗██╗██╗  ██╗████████╗");
 console.log("  ████╗  ██║██╔════╝██║  ██║██║██║ ██╔╝╚══██╔══╝");
 console.log("  ██╔██╗ ██║██║     ███████║██║█████╔╝    ██║   ");
 console.log("  ██║╚██╗██║██║     ██╔══██║██║██╔═██╗    ██║   ");
 console.log("  ██║ ╚████║╚██████╗██║  ██║██║██║  ██╗   ██║   ");
 console.log("  ╚═╝  ╚═══╝ ╚═════╝╚═╝  ╚═╝╚═╝╚═╝  ╚═╝  ╚═╝  .ux");
  console.log("");
  console.log(`  🚀 HTTP  → http://nchikt.ux  (port ${PORT})`);
  console.log("");
  console.log("  Press Ctrl+C to stop");
  console.log("─".repeat(60));
});

// ─── Optional HTTPS ───────────────────────────────────────────
const SSL_KEY = path.join(__dirname, "ssl", "nchikt.ux-key.pem");
const SSL_CERT = path.join(__dirname, "ssl", "nchikt.ux.pem");

if (fs.existsSync(SSL_KEY) && fs.existsSync(SSL_CERT)) {
  const httpsOptions = {
    key: fs.readFileSync(SSL_KEY),
    cert: fs.readFileSync(SSL_CERT),
  };
  const httpsServer = https.createServer(httpsOptions, requestHandler);
  httpsServer.listen(HTTPS_PORT, () => {
    console.log(`  🔒 HTTPS → https://nchikt.ux  (port ${HTTPS_PORT})`);
  });
} else {
  console.log("  ℹ️  No SSL certs found — run scripts/setup-ssl.sh to enable HTTPS");
}

// ─── Graceful Shutdown ────────────────────────────────────────
process.on("SIGINT", () => {
  console.log("\n\n  👋 nchikt.ux server stopped.\n");
  process.exit(0);
});
