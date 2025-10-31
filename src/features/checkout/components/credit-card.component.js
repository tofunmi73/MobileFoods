// STRIPE DISABLED - Commented out for Expo Go compatibility
// Uncomment when ready to use native build with Stripe React Native SDK

import React, { useImperativeHandle, forwardRef } from "react";
import { View, StyleSheet } from "react-native";
import { HelperText } from "react-native-paper";

// STRIPE IMPORTS - DISABLED
// import {
//   useStripe,
//   CardField,
// } from "@stripe/stripe-react-native";
// import Constants from "expo-constants";
// import { createPaymentMethod as sendPaymentMethodToBackend } from "../../../services/checkout/checkout.service";

// const stripePublishableKey =
//   Constants.expoConfig?.extra?.stripePublishableKey ||
//   Constants.manifest?.extra?.stripePublishableKey;

export const CreditCardInput = forwardRef(({ onChange, onTokenCreated }, ref) => {
  // Expose empty functions for backward compatibility
  useImperativeHandle(ref, () => ({
    createToken: () => {
      console.warn("Stripe is disabled. Payment features unavailable in Expo Go.");
      onTokenCreated?.({ error: "Payment features require a native build" });
    },
    isValid: false,
  }));

  // Placeholder UI - Stripe disabled for Expo Go
  return (
    <View style={styles.container}>
      <HelperText type="info" style={styles.errorText}>
        Checkout feature is disabled. Stripe requires a native build (not Expo Go).
        {"\n\n"}
        To enable: Run `npx expo prebuild` then `npm run android` or `npm run ios`
      </HelperText>
    </View>
  );

  /* ORIGINAL STRIPE CODE - Commented out, uncomment when ready
  const stripe = useStripe();
  const { createPaymentMethod } = stripe || {};
  const [name, setName] = useState("");
  const [isCreatingPaymentMethod, setIsCreatingPaymentMethod] = useState(false);
  const [cardDetails, setCardDetails] = useState(null);
  const [errors, setErrors] = useState({});

  if (!stripePublishableKey || !createPaymentMethod) {
    return (
      <View style={styles.container}>
        <HelperText type="error" style={styles.errorText}>
          {!stripePublishableKey 
            ? "Stripe is not configured. Please set stripePublishableKey in app.json"
            : "Stripe SDK not available. Please rebuild the app with native modules (npx expo prebuild)"}
        </HelperText>
      </View>
    );
  }

  const createStripePaymentMethod = async () => {
    if (!name.trim()) {
      setErrors({ name: "Name is required" });
      return;
    }

    if (!cardDetails?.complete) {
      setErrors({ card: "Please complete all card fields" });
      return;
    }

    setIsCreatingPaymentMethod(true);
    setErrors({});

    try {
      const { paymentMethod, error: stripeError } = await createPaymentMethod({
        paymentMethodType: "Card",
        billingDetails: {
          name: name.trim(),
        },
      });

      if (stripeError) {
        console.error("Stripe error:", stripeError);
        onTokenCreated?.({ error: stripeError.message });
        setErrors({ card: stripeError.message });
        return;
      }

      if (paymentMethod) {
        const result = await sendPaymentMethodToBackend({
          paymentMethodId: paymentMethod.id,
        });

        if (result.error) {
          onTokenCreated?.({ error: result.error });
        } else {
          onTokenCreated?.({
            paymentMethodId: paymentMethod.id,
            ...result,
          });
        }
      }
    } catch (error) {
      console.error("Payment method creation failed:", error);
      onTokenCreated?.({ error: error.message });
      setErrors({ card: error.message });
    } finally {
      setIsCreatingPaymentMethod(false);
    }
  };

  useImperativeHandle(ref, () => ({
    createToken: createStripePaymentMethod,
    isValid: cardDetails?.complete && !!name.trim(),
  }));

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <TextInput
        label="Name on card"
        value={name}
        onChangeText={(v) => {
          setName(v);
          setErrors((prev) => ({ ...prev, name: null }));
          onChange?.({ name: v });
        }}
        error={!!errors.name}
        style={styles.input}
      />
      {errors.name && <HelperText type="error">{errors.name}</HelperText>}

      <View style={styles.cardFieldContainer}>
        <CardField
          postalCodeEnabled={false}
          placeholders={{
            number: "4242 4242 4242 4242",
          }}
          cardStyle={{
            backgroundColor: "#FFFFFF",
            textColor: "#000000",
            borderWidth: 1,
            borderColor: "#CCCCCC",
            borderRadius: 8,
          }}
          style={styles.cardField}
          onCardChange={(details) => {
            setCardDetails(details);
            setErrors((prev) => ({ ...prev, card: null }));
            onChange?.({
              complete: details.complete,
              valid: details.complete && !!name.trim(),
            });
          }}
        />
        {errors.card && <HelperText type="error">{errors.card}</HelperText>}
      </View>

      <Button
        mode="contained"
        onPress={createStripePaymentMethod}
        loading={isCreatingPaymentMethod}
        disabled={!cardDetails?.complete || !name.trim() || isCreatingPaymentMethod}
        style={styles.button}
      >
        {isCreatingPaymentMethod
          ? "Creating Payment Method..."
          : "Create Payment Method"}
      </Button>
    </ScrollView>
  );
  */
});

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 8,
    flex: 1,
  },
  errorText: {
    textAlign: "center",
    padding: 16,
  },
});