import camelize from "camelize";
import { locations } from "./location.mock";
import { BACKEND_URL } from "../api/config";

export const locationRequest = async (searchTerm) => {
  // Try backend first
  try {
    const res = await fetch(
      `${BACKEND_URL}/api/geocode?query=${encodeURIComponent(searchTerm)}`
    );
    if (res.ok) {
      const data = await res.json();
      // shape already { lat, lng, viewport }
      return {
        results: [
          {
            geometry: {
              location: { lat: data.lat, lng: data.lng },
              viewport: data.viewport,
            },
          },
        ],
      };
    }
  } catch (_) {}

  // Fallback to mock
  return new Promise((resolve, reject) => {
    const locationMock = locations[searchTerm];
    if (!locationMock) {
      reject("not found");
    }
    resolve(locationMock);
  });
};

export const locationTransform = (result) => {
  const formattedResponse = camelize(result);
  const { geometry = {} } = formattedResponse.results[0];
  const { lat, lng } = geometry.location;
  return { lat, lng, viewport: geometry.viewport };
};
