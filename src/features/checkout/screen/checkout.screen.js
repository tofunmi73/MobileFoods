import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CreditCardInput } from "../components/credit-card.component";
import React, { useRef } from "react";

export const CheckoutScreen = () => {
  const creditCardRef = useRef();

  const handleTokenCreated = (result) => {
    if (result.token) {
      console.log("Payment token:", result.token);
      // Send token to your backend for payment processing
    } else if (result.error) {
      console.error("Token creation failed:", result.error);
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
