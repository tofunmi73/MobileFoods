import React, { createContext, useState, useEffect, useRef } from "react";
import { Register, Login, Logout } from "./authentication.service";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { AppState } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { INACTIVITY_TIMEOUT, LAST_ACTIVE_KEY } from "./auth.config";

const PROFILE_PICTURE_KEY = "@profile_picture_";

const formatAuthError = (error) => {
  const code = error?.code || "";
  switch (code) {
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/user-not-found":
      return "No account found with that email.";
    case "auth/wrong-password":
      return "Incorrect password. Please try again.";
    case "auth/email-already-in-use":
      return "This email is already registered.";
    case "auth/weak-password":
      return "Password is too weak. Use at least 6 characters.";
    case "auth/too-many-requests":
      return "Too many attempts. Please try again later.";
    case "auth/network-request-failed":
      return "Network error. Check your internet connection.";
    case "auth/invalid-credential":
      return "Invalid credentials. Please sign in again.";
    default:
      return "Something went wrong. Please try again.";
  }
};

export const AuthenticationContext = createContext();

export const AuthenticationProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [profilePicture, setProfilePicture] = useState(null);
  const appState = useRef(AppState.currentState);
  const inactivityTimer = useRef(null);

  // Check if session has expired due to inactivity
  const checkInactivity = async () => {
    if (!user) return;

    try {
      const lastActiveStr = await AsyncStorage.getItem(LAST_ACTIVE_KEY);
      if (lastActiveStr) {
        const lastActive = parseInt(lastActiveStr, 10);
        const now = Date.now();
        const timeSinceActive = now - lastActive;

        if (timeSinceActive > INACTIVITY_TIMEOUT) {
          console.log("Session expired due to inactivity");
          await Logout();
          setUser(null);
        }
      }
    } catch (err) {
      console.error("Error checking inactivity:", err);
    }
  };

  // Update last active timestamp
  const updateLastActive = async () => {
    try {
      await AsyncStorage.setItem(LAST_ACTIVE_KEY, Date.now().toString());
    } catch (err) {
      console.error("Error updating last active:", err);
    }
  };

  // Load profile picture from AsyncStorage
  const loadProfilePicture = async (userEmail) => {
    try {
      if (!userEmail) return;

      const key = `${PROFILE_PICTURE_KEY}${userEmail}`;
      const savedPicture = await AsyncStorage.getItem(key);

      if (savedPicture) {
        setProfilePicture(savedPicture);
      }
    } catch (err) {
      console.log("Could not load profile picture:", err.message);
    }
  };

  // Save profile picture to AsyncStorage
  const saveProfilePicture = async (userEmail, photoUri) => {
    try {
      if (!userEmail || !photoUri) return false;

      const key = `${PROFILE_PICTURE_KEY}${userEmail}`;
      await AsyncStorage.setItem(key, photoUri);
      setProfilePicture(photoUri);

      return true;
    } catch (err) {
      console.error("Error saving profile picture:", err);
      return false;
    }
  };

  // Monitor Firebase auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (usr) => {
      setUser(usr ?? null);
      setError(null);
      setInitializing(false);

      if (usr) {
        updateLastActive();
        // Load profile picture when user logs in
        loadProfilePicture(usr.email);
      } else {
        // Clear profile picture when user logs out
        setProfilePicture(null);
      }
    });
    return unsubscribe;
  }, []);

  // Monitor app state changes (foreground/background)
  useEffect(() => {
    const subscription = AppState.addEventListener(
      "change",
      async (nextAppState) => {
        // App coming to foreground
        if (
          appState.current.match(/inactive|background/) &&
          nextAppState === "active"
        ) {
          await checkInactivity();
        }

        // App going to background
        if (
          appState.current === "active" &&
          nextAppState.match(/inactive|background/)
        ) {
          await updateLastActive();
        }

        appState.current = nextAppState;
      }
    );

    return () => {
      subscription.remove();
    };
  }, [user]);

  const onRegister = async (email, password, repeatedPassword) => {
    setLoading(true);
    if (password !== repeatedPassword) {
      setError("Error: Passwords do not match");
      setLoading(false);
      return;
    }
    try {
      const user = await Register(email, password);
      setUser(user);
      await updateLastActive();
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError(formatAuthError(err));
    }
  };

  const onLogin = async (email, password) => {
    setLoading(true);
    try {
      const user = await Login(email, password);
      setUser(user);
      await updateLastActive();
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError(formatAuthError(err));
    }
  };

  const onLogout = async () => {
    setLoading(true);
    try {
      await Logout();
      await AsyncStorage.removeItem(LAST_ACTIVE_KEY);
      setUser(null);
    } catch (err) {
      setError(formatAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  return (
    <AuthenticationContext.Provider
      value={{
        user,
        error,
        loading,
        onRegister,
        onLogin,
        onLogout,
        isAuthenticated: !!user,
        clearError,
        profilePicture,
        saveProfilePicture,
      }}
    >
      {children}
    </AuthenticationContext.Provider>
  );
};
