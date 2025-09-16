const axios = require('axios');

const OMDB_API_KEY = process.env.OMDB_API_KEY;
const OMDB_BASE_URL = 'http://www.omdbapi.com/';

const fetchMovieDetails = async (title) => {
  try {
    const response = await axios.get(OMDB_BASE_URL, {
      params: {
        t: title,
        apikey: OMDB_API_KEY,
      },
    });
    if (response.data.Response === 'False') {
      throw new Error(response.data.Error);
    }
    return response.data;
  } catch (error) {
    console.error('Error fetching movie details from OMDB:', error.message);
    throw error;
  }
};

module.exports = {
  fetchMovieDetails,
};
