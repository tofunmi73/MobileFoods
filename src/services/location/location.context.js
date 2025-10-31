import React, { createContext, useState, useEffect, useMemo } from "react";
import { locationRequest, locationTransform } from "./location.service";

export const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
  const [keyword, setKeyword] = useState("Lagos");
  const [location, setLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const retrieveLocation = (searchKeyword) => {
    setIsLoading(true);
    setKeyword(searchKeyword);   
  };

  useEffect(() => {
    if (!keyword.length) {
      return;
    }
    locationRequest(keyword.toLowerCase())
      .then(locationTransform)
      .then((result) => {
        setIsLoading(false);
        setLocation(result);
        // console.log(result);
      })
      .catch((err) => {
        setIsLoading(false);
        setError(err);
      });
  }, [keyword]);

  return (
    <LocationContext.Provider
      value={{
        isLoading,
        error,
        location,
        search: retrieveLocation,
        keyword,
        setKeyword,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};
