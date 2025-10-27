import React, { useContext } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, TouchableOpacity, Image, StyleSheet, View } from "react-native";
import { List, Avatar } from "react-native-paper";
import { AuthenticationContext } from "../../../services/authentication/authentication.context";
import { Ionicons } from "@expo/vector-icons";

export const SettingsScreen = ({ navigation }) => {
  const { onLogout, user, profilePicture } = useContext(AuthenticationContext);

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
      <List.Section>
        <TouchableOpacity onPress={() => navigation.navigate("Camera")}>
          <View style={styles.avatarContainer}>
            {profilePicture ? (
              <Image
                source={{ uri: profilePicture }}
                style={styles.profileImage}
              />
            ) : (
              <Avatar.Icon
                size={180}
                icon="account"
                backgroundColor="#2182BD"
              />
            )}
            <View style={styles.cameraIconBadge}>
              <Ionicons name="camera" size={24} color="white" />
            </View>
          </View>
        </TouchableOpacity>
        <Text
          style={{
            fontSize: 24,
            fontWeight: "bold",
            marginTop: 16,
            textAlign: "center",
          }}
        >
          {user.email}
        </Text>
        <List.Item
          style={{ padding: 24, marginTop: 24 }}
          title="Favourites"
          description="View your favourites"
          onPress={() => navigation.navigate("Favourites")}
          left={() => <List.Icon icon="heart" />}
        />
        <List.Item
          style={{ padding: 24, marginTop: 24 }}
          title="Logout"
          onPress={onLogout}
          left={() => <List.Icon icon="logout" />}
        />
      </List.Section>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  avatarContainer: {
    alignSelf: "center",
    position: "relative",
  },
  profileImage: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: "#f0f0f0",
  },
  cameraIconBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#2182BD",
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "white",
  },
});
