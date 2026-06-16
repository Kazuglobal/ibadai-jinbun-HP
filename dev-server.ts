// Local/dev and self-hosted (Node) entry point.
// Imports the configured Express app from server.ts and adds the host concerns
// that must NOT exist in the Vercel serverless function: Vite dev middleware
// (development) or static file serving (production), plus binding a port.
//
// Vercel does not use this file — it invokes api/index.ts, which imports only the
// app from server.ts. Keeping Vite/listen here keeps them out of the lambda graph.
import express from "express";
import path from "path";
import { app } from "./server";

const PORT = Number(process.env.PORT) || 3000;

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
