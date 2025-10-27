import React, { useState } from "react";
import { ScrollView } from "react-native";
import { List } from "react-native-paper";
import RestaurantInfoCard from "../components/restaurant-info-card.component";

export const RestaurantDetailScreen = ({ route }) => {
  const [breakfastExpanded, setBreakfastExpanded] = useState(false);
  const [lunchExpanded, setLunchExpanded] = useState(false);
  const [dinnerExpanded, setDinnerExpanded] = useState(false);
  const [drinksExpanded, setDrinksExpanded] = useState(false);

  const { restaurant } = route.params;

  return (
    <ScrollView>
      <RestaurantInfoCard restaurant={restaurant} />
      <List.Accordion
        title="Breakfast"
        left={(props) => <List.Icon {...props} icon="bread-slice" />}
        expanded={breakfastExpanded}
        onPress={() => setBreakfastExpanded(!breakfastExpanded)}
      >
        <List.Item title="Eggs Benedict" />
        <List.Item title="Classic Breakfast" />
      </List.Accordion>

      <List.Accordion
        title="Lunch"
        left={(props) => <List.Icon {...props} icon="hamburger" />}
        expanded={lunchExpanded}
        onPress={() => setLunchExpanded(!lunchExpanded)}
      >
        <List.Item title="Burger" />
        <List.Item title="Pizza" />
      </List.Accordion>

      <List.Accordion
        title="Dinner"
        left={(props) => <List.Icon {...props} icon="food-fork-drink" />}
        expanded={dinnerExpanded}
        onPress={() => setDinnerExpanded(!dinnerExpanded)}
      >
        <List.Item title="Steak" />
        <List.Item title="Pasta" />
      </List.Accordion>

      <List.Accordion
        title="Drinks"
        left={(props) => <List.Icon {...props} icon="cup" />}
        expanded={drinksExpanded}
        onPress={() => setDrinksExpanded(!drinksExpanded)}
      >
        <List.Item title="Coffee" />
        <List.Item title="Tea" />
        <List.Item title="Soda" />
      </List.Accordion>
    </ScrollView>
  );
};
