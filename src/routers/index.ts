import { NextFunction, Request, Response, Router } from "express";
import { delay } from "../middlewares/test/index.js";
import cuisines from "./cuisines.js";
import restaurants from "./restaurants.js";
import { ApiSuccess } from "../utils/response.js";
import { initializeRedisClient } from "../utils/client.js";

const router = Router();

router.use(delay(100));

router.post(
  "/test",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await req.body;
      const client = await initializeRedisClient();

      const result = await client.json.set("user:sikku", ".", {
        name: "Sikku",
        age: 23,
        eligible: true,
        hobbies: ["Gaming", "Coding"],
      });

      return ApiSuccess(res, 201, "Data stored!", { ...data, result });
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/test",
  async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const client = await initializeRedisClient();

      const details = await client.json.get("user:sikku");

      // console.log(JSON.parse(details));

      return ApiSuccess(res, 200, "Details retrieved!", details);
    } catch (error) {
      next(error);
    }
  }
);

router.use("/cuisines", cuisines);
router.use("/restaurants", restaurants);

export default router;
