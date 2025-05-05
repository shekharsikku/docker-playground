import type { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";
import { ApiError } from "../utils/response.js";

export const validate =
  <T>(schema: ZodSchema<T>) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error: any) {
      return ApiError(res, 400, "Validation error occurred!", error.errors);
    }
  };
