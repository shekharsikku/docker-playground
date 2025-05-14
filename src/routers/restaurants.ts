import { Router, Request, Response, NextFunction } from "express";
import { HttpError, ApiError, ApiSuccess } from "../utils/response.js";
import {
  RestaurantSchema,
  ReviewSchema,
  Restaurant,
  Review,
} from "../utils/schema.js";
import {
  restaurantKeyById,
  reviewDetailsKeyById,
  reviewKeyById,
  restaurantsByRatingKey,
} from "../utils/keys.js";
import { checkRestaurantExists } from "../middlewares/restaurant.js";
import { initializeRedisClient } from "../utils/client.js";
import { validate } from "../middlewares/validate.js";
import { nanoid } from "nanoid";

const router = Router();

router.post(
  "/",
  validate(RestaurantSchema),
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const data = (await req.body) as Restaurant;

    try {
      const client = await initializeRedisClient();

      const id = nanoid();
      const restaurantKey = restaurantKeyById(id);
      const hashData = { id, name: data.name, location: data.location };

      const addResult = await client.hSet(restaurantKey, hashData);

      console.log(`Added ${addResult} fields!`);

      return ApiSuccess(res, 200, "Restaurant added successfully!", hashData);
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "/:restaurantId/reviews",
  checkRestaurantExists,
  validate(ReviewSchema),
  async (req: Request<{ restaurantId: string }>, res, next) => {
    const { restaurantId } = req.params;
    const data = req.body as Review;
    try {
      const client = await initializeRedisClient();
      const reviewId = nanoid();
      const reviewKey = reviewKeyById(restaurantId);
      const reviewDetailsKey = reviewDetailsKeyById(reviewId);
      const restaurantKey = restaurantKeyById(restaurantId);
      const reviewData = {
        id: reviewId,
        ...data,
        timestamp: Date.now(),
        restaurantId,
      };
      const [reviewCount, setResult, totalStars] = await Promise.all([
        client.lPush(reviewKey, reviewId),
        client.hSet(reviewDetailsKey, reviewData),
        client.hIncrByFloat(restaurantKey, "totalStars", data.rating),
      ]);

      const averageRating = Number(
        (parseInt(totalStars) / reviewCount).toFixed(1)
      );
      await Promise.all([
        client.zAdd(restaurantsByRatingKey, {
          score: averageRating,
          value: restaurantId,
        }),
        client.hSet(restaurantKey, "avgStars", averageRating),
      ]);

      return ApiSuccess(res, 200, "Restaurant review added!", reviewData);
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/:restaurantId/reviews",
  checkRestaurantExists,
  async (req: Request<{ restaurantId: string }>, res, next) => {
    const { restaurantId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const start = (Number(page) - 1) * Number(limit);
    const end = start + Number(limit) - 1;

    try {
      const client = await initializeRedisClient();
      const reviewKey = reviewKeyById(restaurantId);
      const reviewIds = await client.lRange(reviewKey, start, end);
      const reviews = await Promise.all(
        reviewIds.map((id) => client.hGetAll(reviewDetailsKeyById(id)))
      );
      return ApiSuccess(res, 200, "Restaurant review fetched!", reviews);
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/:restaurantId",
  checkRestaurantExists,
  async (
    req: Request<{ restaurantId: string }>,
    res: Response,
    next: NextFunction
  ) => {
    const { restaurantId } = req.params;

    try {
      const client = await initializeRedisClient();

      const restaurantKey = restaurantKeyById(restaurantId);

      const [viewCount, restaurant] = await Promise.all([
        client.hIncrBy(restaurantKey, "viewCount", 1),
        client.hGetAll(restaurantKey),
      ]);

      return ApiSuccess(res, 200, "Restaurant details fetched!", restaurant);
    } catch (error) {
      next(error);
    }
  }
);

export default router;
