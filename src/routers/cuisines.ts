import { Router, Request, Response, NextFunction } from "express";
import { HttpError } from "../utils/response.js";

const router = Router();

router.get("/", (_req: Request, _res: Response, next: NextFunction) => {
  try {
    throw new HttpError(405, "Throwing custom error!");
  } catch (error) {
    next(error);
  }
});

export default router;
