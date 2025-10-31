import camelize from "camelize";
import { locations } from "./location.mock";
import { BACKEND_URL } from "../api/config";

export const locationRequest = async (searchTerm) => {
  // Try backend first
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // 8s timeout
    
    const res = await fetch(
      `${BACKEND_URL}/api/geocode?query=${encodeURIComponent(searchTerm)}`,
      { signal: controller.signal }
    );
    
    clearTimeout(timeoutId);
    
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
    } else {
      console.warn(`Backend geocode returned ${res.status}, falling back to mock`);
    }
  } catch (err) {
    if (err.name === 'AbortError') {
      console.warn("Location request timeout, falling back to mock");
    } else {
      console.warn("Location request failed, falling back to mock:", err.message);
    }
  }

  // Fallback to mock (preserve original case for mock lookup)
  return new Promise((resolve, reject) => {
    const locationMock = locations[searchTerm.toLowerCase()];
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
