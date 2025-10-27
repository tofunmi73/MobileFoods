import React, { useContext } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FavouritesContext } from "../../../services/favourites/favourites.context";
import RestaurantInfoCard from "../../restaurants/components/restaurant-info-card.component";

export const FavouritesScreen = ({ navigation }) => {
  const { favourites } = useContext(FavouritesContext);
  return favourites.length ? (
    <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
      {/* <Search
          isFavouritesToggled={isToggled}
          onFavouritesToggle={() => setIsToggled(!isToggled)}
        /> */}
      {/* {isToggled && <FavouritesBar favourites={favourites} />}
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator
              size="large"
              color={theme.colors.brand.primary}
            />
          </View>
        )} */}
      <FlatList
        data={favourites}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("Restaurants", {
                  screen: "RestaurantDetailScreen",
                  params: { restaurant: item },
                })
              }
            >
              <RestaurantInfoCard restaurant={item} />
            </TouchableOpacity>
          );
        }}
        keyExtractor={(item) => item.name}
        style={{ flex: 1 }}
        contentContainerStyle={{
          padding: 20,
        }}
      />
    </SafeAreaView>
  ) : (
    <SafeAreaView>
      <Text style={{ textAlign: "center", fontSize: 20, fontWeight: "bold" }}>
        No favourites yet
      </Text>
    </SafeAreaView>
  );
};
