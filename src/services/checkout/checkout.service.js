import { BACKEND_URL } from "../api/config";

export const createPaymentMethod = async (cardData) => {
  const { number, exp_month, exp_year, cvc, name } = cardData;

  try {
    const response = await fetch(`${BACKEND_URL}/api/checkout/payment-method`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        number,
        exp_month,
        exp_year,
        cvc,
        name,
      }),
    });

    // Check if response is JSON before parsing
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const text = await response.text();
      console.error("Non-JSON response from backend:", text.substring(0, 200));
      return { error: `Server error: Expected JSON but got ${contentType}` };
    }

    const data = await response.json();

    if (!response.ok || data.error) {
      return { error: data.error || "Failed to create payment method" };
    }

    return { paymentMethodId: data.paymentMethodId };
  } catch (error) {
    console.error("Payment method creation error:", error);
    return { error: error.message || "Network error" };
  }
};

// Keep createPaymentToken as alias for backward compatibility
export const createPaymentToken = createPaymentMethod;

export const validateCardData = (cardData) => {
  const { number, exp_month, exp_year, cvc, name } = cardData;

  const errors = {};

  // Luhn validation
  const isLuhnValid = (num) => {
    const s = num.replace(/\s+/g, "");
    if (!s) return false;
    let sum = 0,
      dbl = false;
    for (let i = s.length - 1; i >= 0; i--) {
      let d = parseInt(s[i], 10);
      if (dbl) {
        d *= 2;
        if (d > 9) d -= 9;
      }
      sum += d;
      dbl = !dbl;
    }
    return sum % 10 === 0;
  };

  const digits = number?.replace(/\s+/g, "") || "";
  if (digits.length >= 13 && digits.length <= 19 && !isLuhnValid(number)) {
    errors.number = "Invalid card number";
  }

  if (exp_month && (exp_month < 1 || exp_month > 12)) {
    errors.exp_month = "Invalid month";
  }

  if (exp_year && exp_year < new Date().getFullYear()) {
    errors.exp_year = "Card expired";
  }

  if (cvc && !/^\d{3,4}$/.test(cvc)) {
    errors.cvc = "3–4 digits required";
  }

  if (!name || name.trim().length < 2) {
    errors.name = "Name required";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
