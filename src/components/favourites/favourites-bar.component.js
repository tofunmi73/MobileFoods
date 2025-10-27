import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import CompactRestaurantInfo from "../../components/restraurant/compact-restaurant-info.component";
import { useNavigation } from "@react-navigation/native";
import { fonts } from "../../infrastructure/theme/fonts";

export const FavouritesBar = ({ favourites = [] }) => {
  const navigation = useNavigation();
  if (!favourites.length) return null;

  return (
    <>
      <View style={styles.bar}>
        <Text style={styles.barText}>Favourites</Text>
      </View>
      <View style={styles.container}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {favourites.map((restaurant) => (
            <View
              key={restaurant.placeId || restaurant.name}
              style={styles.info}
            >
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("Restaurants", {
                    screen: "RestaurantDetailScreen",
                    params: { restaurant },
                  })
                }
              >
                <CompactRestaurantInfo restaurant={restaurant} />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 5,
  },
  info: {
    // paddingLeft: 10,
  },
  bar: {
    paddingLeft: 20,
  },
  barText: {
    fontFamily: fonts.body,
    fontSize: 16,
  },
});
