import React from "react";
import { ImageBackground, StyleSheet, View, Text } from "react-native";
import { Button } from "react-native-paper";
import homeBg from "../../../../assets/home_bg.jpg";
import { theme } from "../../../infrastructure/theme";
import LottieView from "lottie-react-native";

export const AuthenticationScreen = ({ navigation }) => {
  return (
    <ImageBackground source={homeBg} resizeMode="cover" style={styles.image}>
      <View
        style={[
          StyleSheet.absoluteFillObject,
          { backgroundColor: "rgba(225,225,225,0.3)" },
        ]}
      />
      <View style={styles.animationContainer}>
        <LottieView
          key="animation"
          autoPlay
          loop
          resizeMode="cover"
          source={require("../../../../assets/watermelon.json")}
          style={{ width: "100%", height: "100%" }}
        />
      </View>
      <Text style={styles.title}>Mobile Foods</Text>
      <View style={styles.container}>
        <Button
          mode="contained"
          icon="lock-open-outline"
          buttonColor="black"
          onPress={() => navigation.navigate("Login")}
          style={styles.authButton}
        >
          Login
        </Button>
        <Button
          mode="contained"
          icon="account-plus-outline"
          buttonColor="black"
          onPress={() => navigation.navigate("Register")}
          style={styles.authButton}
        >
          Register
        </Button>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: theme.space[4],
    marginTop: theme.space[2],
    justifyContent: "center",
    backgroundColor: "rgba(225,225,225,0.8)",
  },
  image: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  animationContainer: {
    position: "absolute",
    top: 70,
    left: 0,
    right: 0,
    height: 300, // fixed height
    padding: theme.space[2],
  },
  authButton: {
    padding: theme.space[2],
    borderRadius: theme.space[2],
    marginTop: theme.space[4],
  },
  authButtonText: {
    fontSize: theme.fontSizes.body,
    fontWeight: "bold",
    textAlign: "center",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: theme.space[2],
    fontFamily: "Oswald_400Regular",
  },
});
