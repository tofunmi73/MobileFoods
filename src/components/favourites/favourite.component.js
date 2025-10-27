import React, { useContext, useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { FavouritesContext } from "../../services/favourites/favourites.context";
import { Ionicons } from "@expo/vector-icons";

export const Favourite = ({ restaurant }) => {
  const { favourites, addToFavourites, removeFromFavourites } =
    useContext(FavouritesContext);

  // Compute isFavourite from context, not local state
  const isFavourite = favourites.some((r) => r.placeId === restaurant.placeId);

  const toggleFavourite = () => {
    if (isFavourite) {
      removeFromFavourites(restaurant);
    } else {
      addToFavourites(restaurant);
    }
  };

  return (
    <Ionicons
      style={styles.icon}
      name={isFavourite ? "heart" : "heart-outline"}
      size={24}
      color={isFavourite ? "red" : "white"}
      onPress={toggleFavourite}
    />
  );
};

const styles = StyleSheet.create({
  icon: {
    position: "absolute",
    top: 25,
    right: 25,
    zIndex: 9,
  },
});
