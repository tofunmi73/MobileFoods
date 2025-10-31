import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createPaymentToken = async (cardData) => {
  const { number, exp_month, exp_year, cvc, name } = cardData;

  try {
    const token = await stripe.tokens.create({
      card: {
        number: number.replace(/\s+/g, ""),
        exp_month: parseInt(exp_month, 10),
        exp_year: parseInt(exp_year, 10),
        cvc: cvc,
        name: name,
      },
    });

    return { token: token.id };
  } catch (error) {
    return { error: error.message || "Failed to create payment token" };
  }
};
