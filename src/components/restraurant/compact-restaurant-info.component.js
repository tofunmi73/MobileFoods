import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { fonts } from "../../infrastructure/theme/fonts";
// cleaned for clarity – no platform conditionals needed

const CompactRestaurantInfo = ({ restaurant, isMap }) => {
  return (
    <View style={isMap ? styles.mapView : styles.view}>
      <Image source={{ uri: restaurant.photos[0] }} style={styles.image} />
      <Text style={styles.text} numberOfLines={2}>
        {restaurant.name}
      </Text>
    </View>
  );
};

export default CompactRestaurantInfo;

const styles = StyleSheet.create({
  view: {
    padding: 10,
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 10,
  },
  mapView: {
    width: 150,
    padding: 10,
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 10,
    // ...(isAndroid
    //   ? {
    //       elevation: 4,
    //     }
    //   : {
    //       shadowColor: "#000",
    //       shadowOffset: { width: 0, height: 2 },
    //       shadowOpacity: 0.25,
    //       shadowRadius: 3.84,
    //     }),
  },
  image: {
    width: 120,
    height: 100,
    borderRadius: 10,
    resizeMode: "cover",
  },
  text: {
    textAlign: "center",
    fontSize: 12,
    fontFamily: fonts.body,
    marginTop: 8,
    maxWidth: 120,
  },
});
