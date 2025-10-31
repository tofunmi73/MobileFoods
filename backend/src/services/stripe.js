import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  console.warn("WARNING: STRIPE_SECRET_KEY is not set. Payment methods will fail.");
}

const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;

// Confirm/verify payment method created client-side (no raw card data)
export const confirmPaymentMethod = async (paymentMethodId) => {
  if (!stripe) {
    return { error: "Stripe is not configured. Missing STRIPE_SECRET_KEY." };
  }

  try {
    // Retrieve payment method to verify it exists and get details
    const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId);

    return {
      paymentMethodId: paymentMethod.id,
      type: paymentMethod.type,
      card: {
        brand: paymentMethod.card?.brand,
        last4: paymentMethod.card?.last4,
        expMonth: paymentMethod.card?.exp_month,
        expYear: paymentMethod.card?.exp_year,
      },
      billingDetails: paymentMethod.billing_details,
    };
  } catch (error) {
    return { error: error.message || "Failed to confirm payment method" };
  }
};
