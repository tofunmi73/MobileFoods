import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthenticationContext } from '../authentication/authentication.context';

export const FavouritesContext = createContext();

export const FavouritesProvider = ({ children }) => {
    const [favourites, setFavourites] = useState([]);
    const [loaded, setLoaded] = useState(false);
    const { user } = useContext(AuthenticationContext);

    
    const saveFavourites = async (value, uid) => {
      try {
        await AsyncStorage.setItem(`favourites-${uid}`, JSON.stringify(value));
      } catch (e) {
        console.log("error saving favourites", e);
      }
    };

    const loadFavourites = async (uid) => {
      try {
        const jsonValue = await AsyncStorage.getItem(`favourites-${uid}`);
        setFavourites(jsonValue ? JSON.parse(jsonValue) : []);
      } catch (e) {
        console.log("error loading favourites", e);
      } finally {
        setLoaded(true);
      }
    };

    const add = (restaurant) => {
      setFavourites((prev) => [...prev, restaurant]);
    };

    const remove = (restaurant) => {
      setFavourites((prev) =>
        prev.filter((r) => r.placeId !== restaurant.placeId)
      );
    };

    useEffect(() => {
      if (!loaded || !user?.uid) return;
      saveFavourites(favourites, user.uid);
    }, [favourites, loaded, user]);

    useEffect(() => {
      if (user?.uid) {
        loadFavourites(user.uid);
      } else {
        setFavourites([]);
        setLoaded(false);
      }
    }, [user]);

    return (
        <FavouritesContext.Provider value={{ 
            favourites, 
            addToFavourites: add, 
            removeFromFavourites: remove 
        }}>
            {children}
        </FavouritesContext.Provider>
    );
};