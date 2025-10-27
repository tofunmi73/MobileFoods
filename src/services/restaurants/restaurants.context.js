import React, { createContext, useState, useEffect, useMemo, useContext } from "react";
import { restaurantsRequest, restaurantsTransform } from "./restaurants.service";
import { LocationContext } from "../location/location.context";

export const RestaurantsContext = createContext();

export const RestaurantsProvider = ({ children }) => {
    const [restaurants, setRestaurants] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const { location } = useContext(LocationContext);

    const retrieveRestaurants = (loc) => {
        setIsLoading(true);
        setRestaurants([]);
        setTimeout(() => {
          restaurantsRequest(loc)
            .then(restaurantsTransform)
            .then((results) => {
              setIsLoading(false);
              setRestaurants(results);
            })
            .catch((err) => {
              setIsLoading(false);
              setError(err);
            });
        }, 2000);
    };
    useEffect(() => {
      if (location) {
        const LocationString = `${location.lat},${location.lng}`;
        retrieveRestaurants(LocationString);
      }
      
    }, [location]);
  
  return <RestaurantsContext.Provider value={{ 
    restaurants, 
    isLoading, 
    error 
    }}>{children}</RestaurantsContext.Provider>;
};