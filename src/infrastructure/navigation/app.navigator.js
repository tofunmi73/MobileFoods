import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "@expo/vector-icons/Ionicons";
import { FavouritesProvider } from "../../services/favourites/favourites.context";
import { LocationProvider } from "../../services/location/location.context";
import { RestaurantsProvider } from "../../services/restaurants/restaurants.context";
import { RestaurantsNavigator } from "./restaurants.navigator";
import { MapScreen } from "../../features/map/screens/map.screen";
import { SettingsNavigator } from "./settings.navigator";

const Tab = createBottomTabNavigator();

export const AppNavigator = () => (
  <FavouritesProvider>
    <LocationProvider>
      <RestaurantsProvider>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            headerShown: false,
            tabBarIcon: ({ focused, color, size }) => {
              const icons = {
                Restaurants: focused ? "restaurant" : "restaurant-outline",
                Settings: focused ? "settings" : "settings-outline",
                Map: focused ? "map" : "map-outline",
              };
              return (
                <Ionicons name={icons[route.name]} size={size} color={color} />
              );
            },
            tabBarActiveTintColor: "tomato",
            tabBarInactiveTintColor: "gray",
          })}
        >
          <Tab.Screen name="Restaurants" component={RestaurantsNavigator} />
          <Tab.Screen name="Map" component={MapScreen} />
          <Tab.Screen name="Settings" component={SettingsNavigator} />
        </Tab.Navigator>
      </RestaurantsProvider>
    </LocationProvider>
  </FavouritesProvider>
);
