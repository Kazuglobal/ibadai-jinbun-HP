// Vercel serverless entry point.
// The Express app (all /api/* and /admin/* routes) is defined in ../server.ts and
// exported without binding a port. Vercel's @vercel/node runtime invokes this default
// export as the request handler. vercel.json rewrites /api/* and /admin/* here.
import app from "../server";

export default app;
