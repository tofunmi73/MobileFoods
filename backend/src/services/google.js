import axios from "axios";
// Axios defaults for robustness
axios.defaults.timeout = 10000; // 10s network timeout
axios.defaults.validateStatus = () => true; // we'll handle non-2xx manually

const KEY = process.env.GOOGLE_MAPS_API_KEY;
if (!KEY) {
  console.warn("GOOGLE_MAPS_API_KEY is not set");
}

const G = "https://maps.googleapis.com/maps/api";

export async function geocodeQuery(query) {
  const { data } = await axios.get(`${G}/geocode/json`, {
    params: { address: query, key: KEY },
  });
  if (!data.results?.length)
    throw Object.assign(new Error("No results"), { status: 404 });
  const r = data.results[0];
  const { lat, lng } = r.geometry.location;
  const viewport = r.geometry.viewport;
  return { lat, lng, viewport };
}

export async function nearbySearch({ lat, lng, radius, keyword }) {
  const { data } = await axios.get(`${G}/place/nearbysearch/json`, {
    params: {
      key: KEY,
      location: `${lat},${lng}`,
      radius,
      type: "restaurant",
      keyword,
    },
  });
  const results = (data.results || []).map((r) => ({
    placeId: r.place_id,
    name: r.name,
    rating: r.rating,
    userRatingsTotal: r.user_ratings_total,
    address: r.vicinity,
    location: r.geometry?.location,
    photoRef: r.photos?.[0]?.photo_reference,
  }));
  return { results };
}

export async function placeDetails(placeId) {
  const { data } = await axios.get(`${G}/place/details/json`, {
    params: {
      key: KEY,
      place_id: placeId,
      fields:
        "name,formatted_address,geometry,opening_hours,formatted_phone_number,website,photos,rating,user_ratings_total",
    },
  });
  const r = data.result;
  if (!r) throw Object.assign(new Error("Not found"), { status: 404 });

  const photos = (r.photos || [])
    .slice(0, 6)
    .map(
      (p) =>
        `${G}/place/photo?maxwidth=800&photo_reference=${p.photo_reference}&key=${KEY}`
    );

  return {
    placeId: placeId,
    name: r.name,
    address: r.formatted_address,
    location: r.geometry?.location,
    hours: r.opening_hours?.weekday_text,
    phone: r.formatted_phone_number,
    website: r.website,
    rating: r.rating,
    userRatingsTotal: r.user_ratings_total,
    photos,
  };
}
