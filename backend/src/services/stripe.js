import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  console.warn("WARNING: STRIPE_SECRET_KEY is not set. Payment methods will fail.");
}

const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;

export const createPaymentMethod = async (cardData) => {
  const { number, exp_month, exp_year, cvc, name } = cardData;

  if (!stripe) {
    return { error: "Stripe is not configured. Missing STRIPE_SECRET_KEY." };
  }

  try {
    // PaymentMethod API (modern Stripe approach - replaces deprecated tokens)
    const paymentMethod = await stripe.paymentMethods.create({
      type: "card",
      card: {
        number: number.replace(/\s+/g, ""),
        exp_month: parseInt(exp_month, 10),
        exp_year: parseInt(exp_year, 10),
        cvc: cvc,
      },
      billing_details: {
        name: name,
      },
    });

    return { paymentMethodId: paymentMethod.id };
  } catch (error) {
    return { error: error.message || "Failed to create payment method" };
  }
};
