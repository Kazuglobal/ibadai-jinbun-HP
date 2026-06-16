// Vercel serverless entry point.
// The Express app (all /api/* and /admin/* routes) is defined in ../server.ts and
// exported without binding a port. Vercel's @vercel/node runtime invokes this default
// export as the request handler. vercel.json rewrites /api/* and /admin/* here.
// NOTE: the ".js" extension is required. The compiled function runs as ESM
// ("type":"module"), and Node's ESM resolver rejects extensionless relative
// imports — an extensionless specifier here yields ERR_MODULE_NOT_FOUND at
// runtime (the function crashes with 500 FUNCTION_INVOCATION_FAILED).
import app from "../server.js";

export default app;
