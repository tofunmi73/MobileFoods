import React from "react";
import { Text } from "react-native";
import {
  createStackNavigator,
  TransitionPresets,
} from "@react-navigation/stack";
import RestaurantScreen from "../../features/restaurants/screens/restaurant.screen";
import { RestaurantDetailScreen } from "../../features/restaurants/screens/restaurant-detail.screen";


const RestaurantsStack = createStackNavigator();

export const RestaurantsNavigator = () => {
  return (
    <RestaurantsStack.Navigator
      screenOptions={{
        headerShown: false,
        

        ...TransitionPresets.ModalPresentationIOS,
      }}
    >
      <RestaurantsStack.Screen
        name="RestaurantScreen"
        component={RestaurantScreen}
      />
      <RestaurantsStack.Screen
        name="RestaurantDetailScreen"
        component={RestaurantDetailScreen}
        options={{
        
          ...TransitionPresets.ModalPresentationIOS,
        }}
      />
    </RestaurantsStack.Navigator>
  );
};
