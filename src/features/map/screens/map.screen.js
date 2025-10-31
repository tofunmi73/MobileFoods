import React, { useContext, useEffect, useState } from "react";
import MapView, { Marker, Callout, PROVIDER_GOOGLE } from "react-native-maps";
import { StyleSheet, TouchableOpacity, View as RNView, Text, ActivityIndicator } from "react-native";
import { View } from "react-native";
import Search from "../components/search.component";
import { LocationContext } from "../../../services/location/location.context";
import { RestaurantsContext } from "../../../services/restaurants/restaurants.context";
import MapCallout from "../components/map-callout.component";
import { Platform } from "react-native";
import CompactRestaurantInfo from "../../../components/restraurant/compact-restaurant-info.component";
import { theme } from "../../../infrastructure/theme";
const isAndroid = Platform.OS === "android";

export const MapScreen = ({ navigation }) => {
  const { location, isLoading: locationLoading } = useContext(LocationContext);
  const { restaurants = [], isLoading: restaurantsLoading } = useContext(RestaurantsContext);
  const [latDelta, setLatDelta] = useState(0);
  const safeLatDelta = latDelta && latDelta > 0 ? latDelta : 0.1;
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  // Keep hooks order stable: call hooks before any early return
  useEffect(() => {
    const northeastLat = location?.viewport?.northeast?.lat;
    const southwestLat = location?.viewport?.southwest?.lat;
    if (typeof northeastLat === "number" && typeof southwestLat === "number") {
      setLatDelta(northeastLat - southwestLat);
    }
  }, [location]);
  
  // Show loading state while location is loading
  if (locationLoading || !location) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.brand.primary} />
          <Text style={{ marginTop: 10, color: theme.colors.ui.secondary }}>
            Loading map...
          </Text>
        </View>
      </View>
    );
  }
  
  const { lat, lng } = location;
  return (
    <>
      <Search />
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        region={{
          latitude: lat,
          longitude: lng,
          latitudeDelta: safeLatDelta,
          longitudeDelta: 0.02,
        }}
        onPress={() => {
          if (isAndroid) setSelectedRestaurant(null);
        }}
      >
        {restaurants.map((r) => (
          // <Marker
          //   key={r.placeId || r.name}
          //   coordinate={{
          //     latitude: r.geometry.location.lat,
          //     longitude: r.geometry.location.lng,
          //   }}
          // >
          //   <Callout
          //     onPress={() => {
          //       navigation.navigate("Restaurants", {
          //         screen: "RestaurantDetailScreen",
          //         params: { restaurant: r },
          //       });
          //     }}
          //   >
          //     <MapCallout restaurant={r} />
          //   </Callout>
          // </Marker>
          <Marker
            key={r.placeId || r.name}
            coordinate={{
              latitude: r.geometry.location.lat,
              longitude: r.geometry.location.lng,
            }}
            // Android: use native InfoWindow
            title={isAndroid ? r.name : undefined}
            snippet={isAndroid ? r.vicinity || r.address || "" : undefined}
            onPress={() => {
              if (isAndroid) setSelectedRestaurant(r);
            }}
            onCalloutPress={() => {
              navigation.navigate("Restaurants", {
                screen: "RestaurantDetailScreen",
                params: { restaurant: r },
              });
            }}
          >
            {/* iOS only: custom React callout */}
            {!isAndroid && (
              <Callout
                onPress={() =>
                  navigation.navigate("Restaurants", {
                    screen: "RestaurantDetailScreen",
                    params: { restaurant: r },
                  })
                }
              >
                <MapCallout restaurant={r} />
              </Callout>
            )}
          </Marker>
        ))}
      </MapView>
      {isAndroid && selectedRestaurant && (
        <RNView style={styles.androidOverlayContainer} pointerEvents="box-none">
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => {
              navigation.navigate("Restaurants", {
                screen: "RestaurantDetailScreen",
                params: { restaurant: selectedRestaurant },
              });
              setSelectedRestaurant(null);
            }}
            style={styles.androidOverlayCard}
          >
            <CompactRestaurantInfo isMap restaurant={selectedRestaurant} />
          </TouchableOpacity>
        </RNView>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.bg.primary,
  },
  androidOverlayContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 20,
    alignItems: "center",
  },
  androidOverlayCard: {
    backgroundColor: "white",
    borderRadius: 12,
    elevation: 4,
  },
  androidCallout: {
    width: 160, // must be explicit on Android when using tooltip
    height: 150,
  },
});
