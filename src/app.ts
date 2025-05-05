import express, {
  Request,
  Response,
  NextFunction,
  ErrorRequestHandler,
} from "express";
import { ApiResponse, ApiError, HttpError } from "./utils/response.js";
import { ApiRouter } from "./routes/index.js";
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

app.use("/api", ApiRouter);

app.get(["/", "/hello"], (req: Request, res: Response) => {
  return ApiResponse(res, 200, `Welcome, ${req.query.name || "User"}!`);
});

app.use((req: Request, res: Response) => {
  const message = `Requested url '${req.url}' not found on the server!`;
  return ApiError(res, 404, message);
});

app.use(((err: Error, _req: Request, res: Response, next: NextFunction) => {
  if (res.headersSent) return next(err);
  if (err instanceof HttpError) return ApiError(res, err.code, err.message);

  const message =
    err.message ||
    (env.NODE_ENV === "production"
      ? "Something went wrong!"
      : "Unknown error occurred!");

  console.log(`Error: ${message}`);

  return ApiError(res, 500, message);
}) as ErrorRequestHandler);

export default app;
