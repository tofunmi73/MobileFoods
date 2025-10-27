module.exports = ({ config }) => ({
  ...config,
  // Inject Google Maps API key via Expo's supported android config
  android: {
    ...(config.android || {}),
    config: {
      ...((config.android && config.android.config) || {}),
      googleMaps: {
        apiKey: process.env.GOOGLE_MAPS_API_KEY,
      },
    },
  },
});
