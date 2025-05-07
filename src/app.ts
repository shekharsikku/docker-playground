import { ApiSuccess, ApiError, HttpError } from "./utils/response.js";
import express, {
  Request,
  Response,
  NextFunction,
  ErrorRequestHandler,
} from "express";
import routers from "./routers/index.js";
import env from "./utils/env.js";

const app = express();

app.use(
  express.json({
    limit: env.PAYLOAD_LIMIT,
    strict: true,
  })
);

app.use(
  express.urlencoded({
    limit: env.PAYLOAD_LIMIT,
    extended: true,
  })
);

app.use("/api", routers);

app.get(["/", "/hello"], (req: Request, res: Response) => {
  return ApiSuccess(res, 200, `Welcome, ${req.query.name || "User"}!`);
});

app.use((req: Request, res: Response) => {
  const message = `Requested url '${req.url}' not found on the server!`;
  return ApiError(res, 404, message);
});

app.use(((err: Error, _req: Request, res: Response, next: NextFunction) => {
  if (res.headersSent) return next(err);

  if (err instanceof HttpError) {
    return ApiError(
      res,
      err.code || 500,
      err.message || "Internal server error!"
    );
  }

  const fallback = env.isProd
    ? "Something went wrong!"
    : "Unknown error occurred!";

  const message = err.message || fallback;

  console.error(`Error: ${message}`);

  return ApiError(res, 500, message);
}) as ErrorRequestHandler);

export default app;
