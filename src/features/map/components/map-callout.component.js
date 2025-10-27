import React from "react";
import CompactRestaurantInfo from "../../../components/restraurant/compact-restaurant-info.component";

const MapCallout = ({ restaurant }) => {
  return <CompactRestaurantInfo isMap restaurant={restaurant} />;
};

export default MapCallout;

// const styles = StyleSheet.create({
//     container: {
//         width: 160,
//         padding: 10,
//         backgroundColor: 'white',
//         borderRadius: 10,
//         overflow: 'hidden',
//     },
//     image: {
//         width: 120,
//         height: 100,
//         borderRadius: 10,
//     },
// });
