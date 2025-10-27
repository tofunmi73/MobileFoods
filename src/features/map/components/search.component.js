import { StyleSheet, Text, View } from "react-native";
import React, { useState, useContext, useEffect } from "react";
import { Searchbar } from "react-native-paper";
import { LocationContext } from "../../../services/location/location.context";

const Search = () => {
  const { keyword, search } = useContext(LocationContext);
  const [searchQuery, setSearchQuery] = useState(keyword);

    useEffect(() => {
      setSearchQuery(keyword);
    }, [keyword]);

  return (
    <View style={styles.search}>
      <Searchbar
        placeholder="Search for a location"
        icon="map"
        value={searchQuery}
        onChangeText={setSearchQuery}
        onSubmitEditing={() => {
          search(searchQuery);
        }}
      />
    </View>
  );
};

export default Search;

const styles = StyleSheet.create({
  search: {
    padding: 20,
    // justifyContent: "center",
    position: "absolute",
    zIndex: 999,
    width: "100%",
    top: 50,
    // left: 0,
    // right: 0,
   
  },
});
