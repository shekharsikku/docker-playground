import { Request, Response, NextFunction } from "express";
import { initializeRedisClient } from "../utils/client.js";
import { restaurantKeyById } from "../utils/keys.js";
import { ApiError } from "../utils/response.js";

export const checkRestaurantExists = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { restaurantId } = req.params;
  if (!restaurantId) {
    return ApiError(res, 400, "Restaurant Id not found!");
  }
  const client = await initializeRedisClient();
  const restaurantKey = restaurantKeyById(restaurantId);
  const exists = await client.exists(restaurantKey);
  if (!exists) {
    return ApiError(res, 404, "Restaurant not found!");
  }
  next();
};
