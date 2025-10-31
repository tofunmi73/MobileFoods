import React from "react";
import { StatusBar as ExpoStatusBar } from "expo-status-bar";
import { StyleSheet, StatusBar } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { StripeProvider } from "@stripe/stripe-react-native";
import Constants from "expo-constants";
import {
  useFonts as useOswald,
  Oswald_400Regular,
} from "@expo-google-fonts/oswald";
import { useFonts as useLato, Lato_400Regular } from "@expo-google-fonts/lato";
import { theme } from "./src/infrastructure/theme";
import { Navigation } from "./src/infrastructure/navigation";
import { AuthenticationProvider } from "./src/services/authentication/authentication.context";

const stripePublishableKey =
  Constants.expoConfig?.extra?.stripePublishableKey ||
  Constants.manifest?.extra?.stripePublishableKey;

export default function App() {
  const [oswaldLoaded] = useOswald({
    Oswald_400Regular,
  });

  const [latoLoaded] = useLato({
    Lato_400Regular,
  });

  if (!oswaldLoaded || !latoLoaded) {
    return null;
  }

  return (
    <StripeProvider publishableKey={stripePublishableKey}>
      <SafeAreaProvider>
        <ExpoStatusBar
          style="auto"
          backgroundColor={theme.colors.bg.primary}
          translucent={false}
        />
        {/* <SafeAreaView style={styles.container} edges={["top"]}> */}
          <AuthenticationProvider>
            <Navigation />
          </AuthenticationProvider>
        {/* </SafeAreaView> */}
      </SafeAreaProvider>
    </StripeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.bg.primary,
    marginTop: StatusBar.currentHeight,
  },
});
