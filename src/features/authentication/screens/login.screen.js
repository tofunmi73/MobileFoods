import React, { useState, useEffect, useContext, useCallback } from "react";
import { ImageBackground, StyleSheet, View, Text } from "react-native";
import { Button } from "react-native-paper";
import homeBg from "../../../../assets/home_bg.jpg";
import { theme } from "../../../infrastructure/theme";
import { TextInput, IconButton } from "react-native-paper";
import { Asset } from "expo-asset";
import { ActivityIndicator } from "react-native";
import { AuthenticationContext } from "../../../services/authentication/authentication.context";
import { useIsFocused } from "@react-navigation/native";

export const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [ready, setReady] = useState(false);
  const { onLogin, error, clearError } = useContext(AuthenticationContext);
  const isFocused = useIsFocused();


  useEffect(() => {
    if (!isFocused) clearError(); // clear only when leaving
  }, [isFocused]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      await Asset.loadAsync([homeBg]);
      if (mounted) setReady(true);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  if (!ready) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <ImageBackground source={homeBg} resizeMode="cover" style={styles.image}>
      <View
        style={[
          StyleSheet.absoluteFillObject,
          { backgroundColor: "rgba(225,225,225,0.3)" },
        ]}
      />
      <Text style={styles.title}>Mobile Foods</Text>
      <View style={styles.container}>
        <View style={styles.form}>
          <TextInput
            label="Email"
            mode="outlined"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            autoCapitalize="none"
            textContentType="emailAddress"
            keyboardType="email-address"
          />
          <TextInput
            label="Password"
            value={password}
            textContentType="password"
            onChangeText={setPassword}
            mode="outlined"
            secureTextEntry
            style={styles.input}
          />
          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.error}>{error}</Text>
            </View>
          )}
        </View>
        <Button
          mode="contained"
          icon="lock-open-outline"
          buttonColor="black"
          onPress={() => onLogin(email, password)}
          style={styles.authButton}
        >
          Login
        </Button>
      </View>
      <IconButton
        icon="arrow-left"
        size={48}
        onPress={() => navigation.goBack()}
        iconColor="black"
        // containerColor="black"
        style={{ borderRadius: 24, marginTop: theme.space[3] }}
      />
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: theme.space[3],
    marginTop: theme.space[2],
    backgroundColor: "rgba(225,225,225,0.8)",
    alignSelf: "stretch",
    marginHorizontal: theme.space[4],
  },
  form: {
    alignSelf: "center",
    width: "90%", // or a number like 320
    maxWidth: 420, // optional
  },
  image: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    marginBottom: theme.space[3],
  },
  authButton: {
    padding: theme.space[1],
    borderRadius: theme.space[2],
    marginTop: theme.space[1],
    alignSelf: "center",
    width: "90%",
    maxWidth: 420,
  },
  error: {
    color: "red",
    fontFamily: "Oswald_400Regular",
    textAlign: "center",
  },
  errorContainer: {
    maxWidth: 300,
    alignItems: "center",
    alignSelf: "center",
    marginTop: theme.space[2],
    marginBottom: theme.space[2],
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: theme.space[2],
    fontFamily: "Oswald_400Regular",
  },
});
