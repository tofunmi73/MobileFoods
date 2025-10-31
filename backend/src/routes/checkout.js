import { Router } from "express";
import { z } from "zod";
import { createPaymentMethod } from "../services/stripe.js";

const router = Router();

router.post("/payment-method", async (req, res, next) => {
  try {
    const schema = z.object({
      number: z.string().min(13).max(19),
      exp_month: z.coerce.number().min(1).max(12),
      exp_year: z.coerce.number().min(new Date().getFullYear()),
      cvc: z.string().regex(/^\d{3,4}$/),
      name: z.string().min(2),
    });

    const cardData = schema.parse(req.body);
    const result = await createPaymentMethod(cardData);

    if (result.error) {
      return res.status(400).json(result);
    }

    res.json(result);
  } catch (e) {
    if (e.name === "ZodError") {
      return res.status(400).json({ error: "Invalid card data", details: e.errors });
    }
    next(e);
  }
});

export default router;
