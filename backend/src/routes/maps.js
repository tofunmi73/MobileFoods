import { Router } from "express";
import { z } from "zod";
import {
  geocodeQuery,
  nearbySearch,
  placeDetails,
} from "../services/google.js";
import { cacheMiddleware } from "../utils/cache.js";

const router = Router();

router.get("/geocode", cacheMiddleware(60), async (req, res, next) => {
  try {
    const schema = z.object({ query: z.string().min(2) });
    const { query } = schema.parse(req.query);
    const result = await geocodeQuery(query);
    res.json(result);
  } catch (e) {
    next(e);
  }
});

router.get("/places/nearby", cacheMiddleware(120), async (req, res, next) => {
  try {
    const schema = z.object({
      lat: z.coerce.number(),
      lng: z.coerce.number(),
      radius: z.coerce.number().default(1500),
      keyword: z.string().optional(),
    });
    const { lat, lng, radius, keyword } = schema.parse(req.query);
    const result = await nearbySearch({ lat, lng, radius, keyword });
    res.json(result);
  } catch (e) {
    next(e);
  }
});

router.get("/places/details", cacheMiddleware(120), async (req, res, next) => {
  try {
    const schema = z.object({ id: z.string().min(1) });
    const { id } = schema.parse(req.query);
    const result = await placeDetails(id);
    res.json(result);
  } catch (e) {
    next(e);
  }
});

export default router;
