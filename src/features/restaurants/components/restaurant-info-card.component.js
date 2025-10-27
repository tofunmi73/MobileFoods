import { StyleSheet, Text, View, Image } from "react-native";
import { Card } from "react-native-paper";
import {SvgXml} from 'react-native-svg';
import React from 'react'
import { theme } from "../../../infrastructure/theme";
import star from '../../../../assets/star';
import open from '../../../../assets/open';
import { Favourite } from "../../../components/favourites/favourite.component";

const RestaurantInfoCard = ({restaurant = {}}) => {
    const {
      name = "The Place",
      icon = "https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/lodging-71.png",
      photos = [
        "https://media.istockphoto.com/id/1457433817/photo/group-of-healthy-food-for-flexitarian-diet.jpg?s=612x612&w=0&k=20&c=v48RE0ZNWpMZOlSp13KdF1yFDmidorO2pZTu2Idmd3M=",
      ],
      address = "123 Main St",
      isOpenNow = true,
      rating = 4,
      placeId,
      isClosedTemporarily = true,
    } = restaurant;
    const ratingArray = Array.from(new Array(Math.floor(rating)));
    
  return (
    <View>
      <Card style={styles.card}>
        <Favourite restaurant={restaurant} />
        <Card.Cover
          key={name}
          style={styles.cover}
          source={{ uri: photos[0] }}
        />
        <Card.Content>
          <Text style={styles.name}>{name}</Text>

          <View style={styles.rating}>
            {ratingArray.map((_, index) => (
              <SvgXml
                key={`star-${placeId}-${index}`}
                xml={star}
                width={20}
                height={20}
              />
            ))}
            <View>
              {isClosedTemporarily && (
                <Text style={styles.closed}>CLOSED TEMPORARILY</Text>
              )}
            </View>
            <View style={styles.open}>
              {isOpenNow && <SvgXml xml={open} width={20} height={20} />}
            </View>
            <View style={styles.icon}>
              <Image source={{ uri: icon }} width={20} height={20} />
            </View>
          </View>

          <Text style={styles.address}>{address}</Text>
        </Card.Content>
      </Card>
    </View>
  );
}

export default RestaurantInfoCard

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.bg.primary,
    marginBottom: 10,
    marginBottom: 30,
  },
  cover: {
    padding: 10,
    backgroundColor: theme.colors.bg.primary,
  },
  name: {
    fontFamily: theme.fonts.heading,
    fontSize: theme.fontSizes.title,
    color: theme.colors.text.primary,
  },
  address: {
    fontFamily: theme.fonts.body,
    fontSize: theme.fontSizes.caption,
    color: theme.colors.text.secondary,
  },
  rating: {
    flexDirection: "row",
    paddingTop: theme.space[0],
  },
  closed: {
    color: theme.colors.text.error,
    marginLeft: theme.space[4],
  },
  open: {
    flexDirection: "row",
    marginLeft: "auto",
    paddingRight: theme.space[3],
    paddingLeft: theme.space[3],
  },
  icon: {
    // flexDirection: "row",
    // marginRight: "auto",
  },
});