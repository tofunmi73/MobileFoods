import { mocks, mockImages } from "./mock";
import camelize from "camelize";
import { BACKEND_URL } from "../api/config";

export const restaurantsRequest = async (location) => {
  const [lat, lng] = location.split(",");
  // Try backend first
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout
    
    const res = await fetch(
      `${BACKEND_URL}/api/places/nearby?lat=${encodeURIComponent(
        lat
      )}&lng=${encodeURIComponent(lng)}&radius=1500`,
      { signal: controller.signal }
    );
    
    clearTimeout(timeoutId);
    
    if (res.ok) {
      const data = await res.json();
      // Map to legacy mock shape so transform can stay the same
      const results = (data.results || []).map((r) => ({
        place_id: r.placeId,
        name: r.name,
        rating: r.rating,
        user_ratings_total: r.userRatingsTotal,
        vicinity: r.address,
        geometry: { location: r.location },
        // Prefer Google photo URL when available; fall back to photoRef or empty
        photos: r.photoUrl ? [r.photoUrl] : r.photoRef ? [r.photoRef] : [],
        opening_hours: {},
        business_status: "OPERATIONAL",
      }));
      return { results };
    } else {
      console.warn(`Backend restaurants returned ${res.status}, falling back to mock`);
    }
  } catch (err) {
    if (err.name === 'AbortError') {
      console.warn("Restaurants request timeout, falling back to mock");
    } else {
      console.warn("Restaurants request failed, falling back to mock:", err.message);
    }
  }

  // Fallback to mock
  return new Promise((resolve, reject) => {
    const mock = mocks[location];
    if (!mock) {
      reject("not found");
    }
    resolve(mock);
  });
};

export const restaurantsTransform = ({ results = [] }) => {
  const mappedResults = results.map((restaurant) => {
    const photos = Array.isArray(restaurant.photos) ? restaurant.photos : [];
    const hasHttpPhotos =
      photos.length > 0 &&
      typeof photos[0] === "string" &&
      /^https?:/i.test(photos[0]);

    const finalPhotos = hasHttpPhotos
      ? photos
      : [mockImages[Math.ceil(Math.random() * (mockImages.length - 1))]];

    return {
      ...restaurant,
      photos: finalPhotos,
      address: restaurant.vicinity,
      isOpenNow: restaurant.opening_hours && restaurant.opening_hours.open_now,
      isClosedTemporarily: restaurant.business_status === "CLOSED_TEMPORARILY",
    };
  });

  return camelize(mappedResults);
};
