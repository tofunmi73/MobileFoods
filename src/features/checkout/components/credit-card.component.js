import React, { useState, useImperativeHandle, forwardRef } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { TextInput, HelperText, Button } from "react-native-paper";
import {
  useStripe,
  CardField,
} from "@stripe/stripe-react-native";
import Constants from "expo-constants";
import { createPaymentMethod as sendPaymentMethodToBackend } from "../../../services/checkout/checkout.service";

const stripePublishableKey =
  Constants.expoConfig?.extra?.stripePublishableKey ||
  Constants.manifest?.extra?.stripePublishableKey;

export const CreditCardInput = forwardRef(
  ({ onChange, onTokenCreated }, ref) => {
    const { createPaymentMethod } = useStripe();
    const [name, setName] = useState("");
    const [isCreatingPaymentMethod, setIsCreatingPaymentMethod] = useState(false);
    const [cardDetails, setCardDetails] = useState(null);
    const [errors, setErrors] = useState({});

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
        // Create PaymentMethod using Stripe SDK (client-side - no raw card data sent to backend)
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
          // Send payment_method_id to backend (secure - no raw card data)
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

    // Expose createToken function for backward compatibility
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
  }
);

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 8,
    flex: 1,
  },
  input: {
    marginBottom: 12,
  },
  cardFieldContainer: {
    marginBottom: 12,
    height: 50,
  },
  cardField: {
    width: "100%",
    height: 50,
    marginVertical: 30,
  },
  button: {
    marginTop: 16,
    marginBottom: 24,
  },
});