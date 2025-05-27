
// const HttpError = require('../models/http-error');


// async function getCoordsForAddress(address) {
//   return {
//     lat: 40.7484474,
//     lng: -73.9871516
//   };
//   // const response = await axios.get(
//   //   `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
//   //     address
//   //   )}&key=${API_KEY}`
//   // );

//   // const data = response.data;

//   // if (!data || data.status === 'ZERO_RESULTS') {
//   //   const error = new HttpError(
//   //     'Could not find location for the specified address.',
//   //     422
//   //   );
//   //   throw error;
//   // }

//   // const coordinates = data.results[0].geometry.location;

//   // return coordinates;
// }

const axios = require('axios');


async function getCoordsForAddress(address) {
  const API_KEY = process.env.MAPBOX_API_KEY; // your Mapbox API key

  const response = await axios.get(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${API_KEY}`
  );

  const data = response.data;

  if (!data.features || data.features.length === 0) {
    const error = new Error('Could not find location for the specified address.');
    error.status = 422;
    throw error;
  }

  // Mapbox returns [lng, lat] in center
  const [lng, lat] = data.features[0].center;

  const coordinates = { lat, lng };

  return coordinates; // same exact format as original function
}

module.exports = getCoordsForAddress;
