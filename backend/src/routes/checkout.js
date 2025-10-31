import { Router } from "express";
import { z } from "zod";
import { confirmPaymentMethod } from "../services/stripe.js";

const router = Router();

// Receives payment_method_id from client (created via Stripe SDK)
// No raw card data - secure approach
router.post("/confirm-payment-method", async (req, res, next) => {
  try {
    const schema = z.object({
      paymentMethodId: z.string().min(1).startsWith("pm_"),
    });

    const { paymentMethodId } = schema.parse(req.body);
    
    // Verify and retrieve payment method details from Stripe
    const result = await confirmPaymentMethod(paymentMethodId);

    if (result.error) {
      return res.status(400).json(result);
    }

    res.json({ 
      success: true, 
      paymentMethodId: result.paymentMethodId,
      ...result 
    });
  } catch (e) {
    if (e.name === "ZodError") {
      return res.status(400).json({ error: "Invalid payment method ID", details: e.errors });
    }
    next(e);
  }
});

export default router;
