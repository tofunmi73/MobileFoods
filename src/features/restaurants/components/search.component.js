import { StyleSheet, Text, View } from 'react-native'
import React, { useState, useContext, useEffect } from 'react';
import { Searchbar } from 'react-native-paper';
import { LocationContext } from '../../../services/location/location.context';

const Search = ({ isFavouritesToggled, onFavouritesToggle }) => {
  
  const { keyword, search } = useContext(LocationContext);
  const [searchQuery, setSearchQuery] = useState(keyword);

 useEffect(() => {
   setSearchQuery(keyword);
 }, [keyword]);


  return (
    <View style={styles.search}>
      <Searchbar
        icon={isFavouritesToggled ? "heart" : "heart-outline"}
        onIconPress={onFavouritesToggle}
        placeholder="Search for a restaurant"
        value={searchQuery}
        onChangeText={setSearchQuery}       
        onSubmitEditing={() => {
          search(searchQuery);
        }}
      />
    </View>
  );
}

export default Search

const styles = StyleSheet.create({
  search: {
    padding: 20,
    justifyContent: "center",
  },
});