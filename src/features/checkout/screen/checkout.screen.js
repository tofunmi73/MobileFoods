import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CreditCardInput } from "../components/credit-card.component";
import React, { useRef } from "react";

export const CheckoutScreen = () => {
  const creditCardRef = useRef();

  const handleTokenCreated = (result) => {
    if (result.paymentMethodId) {
      console.log("Payment Method ID:", result.paymentMethodId);
      // Use paymentMethodId to process payment via PaymentIntent API
    } else if (result.token) {
      // Legacy token support (if needed)
      console.log("Payment token:", result.token);
    } else if (result.error) {
      console.error("Payment method creation failed:", result.error);
    }
  };

  return (
    <SafeAreaView>
      <Text>Checkout</Text>
      <CreditCardInput
        ref={creditCardRef}
        onTokenCreated={handleTokenCreated}
      />
    </SafeAreaView>
  );
};
