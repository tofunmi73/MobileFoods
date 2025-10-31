import React, {
  useMemo,
  useState,
  useImperativeHandle,
  forwardRef,
} from "react";
import { View, StyleSheet } from "react-native";
import { TextInput, HelperText, Button } from "react-native-paper";
import {
  createPaymentToken,
  validateCardData,
} from "../../../services/checkout/checkout.service";

const formatCardNumber = (value) =>
  value
    .replace(/\D/g, "")
    .slice(0, 19)
    .replace(/(.{4})/g, "$1 ")
    .trim();

const formatExpiry = (value) => {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
};

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

export const CreditCardInput = forwardRef(
  ({ onChange, onTokenCreated }, ref) => {
    const [cardNumber, setCardNumber] = useState("");
    const [name, setName] = useState("");
    const [expiry, setExpiry] = useState("");
    const [cvc, setCvc] = useState("");
    const [isCreatingToken, setIsCreatingToken] = useState(false);

    const errors = useMemo(() => {
      const errs = {};
      const digits = cardNumber.replace(/\s+/g, "");
      if (
        digits.length >= 13 &&
        digits.length <= 19 &&
        !isLuhnValid(cardNumber)
      ) {
        errs.cardNumber = "Invalid card number";
      }
      if (expiry && !/^\d{2}\/\d{2}$/.test(expiry)) {
        errs.expiry = "Use MM/YY";
      }
      if (cvc && !/^\d{3,4}$/.test(cvc)) {
        errs.cvc = "3–4 digits";
      }
      return errs;
    }, [cardNumber, expiry, cvc]);

    const emit = () => {
      onChange?.({
        valid:
          isLuhnValid(cardNumber) &&
          /^\d{2}\/\d{2}$/.test(expiry) &&
          /^\d{3,4}$/.test(cvc) &&
          !!name,
        values: {
          number: cardNumber.replace(/\s+/g, ""),
          name,
          expiry,
          cvc,
        },
        errors,
      });
    };

    const createStripeToken = async () => {
      if (
        !isLuhnValid(cardNumber) ||
        !/^\d{2}\/\d{2}$/.test(expiry) ||
        !/^\d{3,4}$/.test(cvc) ||
        !name
      ) {
        return;
      }

      setIsCreatingToken(true);
      try {
        const [month, year] = expiry.split("/");
        const cardData = {
          number: cardNumber,
          exp_month: month,
          exp_year: `20${year}`,
          cvc: cvc,
          name: name,
        };

        const result = await createPaymentToken(cardData);
        onTokenCreated?.(result);
      } catch (error) {
        console.error("Stripe token creation failed:", error);
        onTokenCreated?.({ error: error.message });
      } finally {
        setIsCreatingToken(false);
      }
    };

    // Expose createStripeToken function to parent component
    useImperativeHandle(ref, () => ({
      createToken: createStripeToken,
      isValid:
        isLuhnValid(cardNumber) &&
        /^\d{2}\/\d{2}$/.test(expiry) &&
        /^\d{3,4}$/.test(cvc) &&
        !!name,
    }));

    return (
      <View style={styles.container}>
        <TextInput
          label="Card number"
          keyboardType="number-pad"
          value={cardNumber}
          onChangeText={(v) => {
            const formatted = formatCardNumber(v);
            setCardNumber(formatted);
            emit();
          }}
          error={!!errors.cardNumber}
          left={<TextInput.Icon icon="credit-card" />}
          style={styles.input}
        />
        {!!errors.cardNumber && (
          <HelperText type="error">{errors.cardNumber}</HelperText>
        )}

        <TextInput
          label="Name on card"
          value={name}
          onChangeText={(v) => {
            setName(v);
            emit();
          }}
          style={styles.input}
        />

        <View style={styles.row}>
          <TextInput
            style={[styles.input, styles.half]}
            label="MM/YY"
            keyboardType="number-pad"
            value={expiry}
            onChangeText={(v) => {
              const formatted = formatExpiry(v);
              setExpiry(formatted);
              emit();
            }}
            error={!!errors.expiry}
          />
          <TextInput
            style={[styles.input, styles.half]}
            label="CVC"
            keyboardType="number-pad"
            value={cvc}
            onChangeText={(v) => {
              setCvc(v.replace(/\D/g, "").slice(0, 4));
              emit();
            }}
            error={!!errors.cvc}
          />
        </View>
        {!!errors.expiry && (
          <HelperText type="error">{errors.expiry}</HelperText>
        )}
        {!!errors.cvc && <HelperText type="error">{errors.cvc}</HelperText>}

        <Button
          mode="contained"
          onPress={createStripeToken}
          loading={isCreatingToken}
          disabled={
            !isLuhnValid(cardNumber) ||
            !/^\d{2}\/\d{2}$/.test(expiry) ||
            !/^\d{3,4}$/.test(cvc) ||
            !name
          }
          style={styles.button}
        >
          {isCreatingToken ? "Creating Token..." : "Create Payment Token"}
        </Button>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  input: {
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  half: {
    flex: 1,
  },
  button: {
    marginTop: 16,
  },
});
