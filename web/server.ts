import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { createProxyMiddleware } from "http-proxy-middleware";



async function startServer() {
  const app = express();
  const PORT = 3000;

  // Proxy /api and /media requests to the live Python FastAPI backend without stripping prefix
  app.use(createProxyMiddleware({
    target: "http://localhost:8000",
    changeOrigin: true,
    pathFilter: (pathname) => pathname.startsWith("/api") || pathname.startsWith("/media")
  }));

  // Setup basic middlewares
  app.use(express.json());



  // Vite middleware setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*all", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[StreamHome Server] Running at http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start StreamHome full-stack server:", err);
});
