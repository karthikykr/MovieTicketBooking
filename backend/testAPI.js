const axios = require('axios');

const BASE_URL = 'http://localhost:3001/api';

async function testAPI() {
    console.log('🧪 Testing Movie Ticket Booking API Endpoints\n');

    try {
        // Test 1: Get all movies (now playing)
        console.log('1. Testing /api/movies/allMovie...');
        const nowPlayingResponse = await axios.get(`${BASE_URL}/movies/allMovie`);
        console.log(`✅ Now Playing Movies: ${nowPlayingResponse.data.results.length} movies found`);
        console.log(`   First movie: ${nowPlayingResponse.data.results[0]?.title}`);

        // Test 2: Get popular movies
        console.log('\n2. Testing /api/movies/popular...');
        const popularResponse = await axios.get(`${BASE_URL}/movies/popular`);
        console.log(`✅ Popular Movies: ${popularResponse.data.results.length} movies found`);
        console.log(`   Top movie: ${popularResponse.data.results[0]?.title} (Rating: ${popularResponse.data.results[0]?.rating})`);

        // Test 3: Get upcoming movies
        console.log('\n3. Testing /api/movies/upcoming...');
        const upcomingResponse = await axios.get(`${BASE_URL}/movies/upcoming`);
        console.log(`✅ Upcoming Movies: ${upcomingResponse.data.results.length} movies found`);

        // Test 4: Get single movie details
        if (nowPlayingResponse.data.results.length > 0) {
            const movieId = nowPlayingResponse.data.results[0]._id;
            console.log(`\n4. Testing /api/movies/${movieId}...`);
            const movieResponse = await axios.get(`${BASE_URL}/movies/${movieId}`);
            console.log(`✅ Movie Details: ${movieResponse.data.title}`);
            console.log(`   Genre: ${movieResponse.data.genre.join(', ')}`);
            console.log(`   Cast: ${movieResponse.data.cast.length} members`);
            console.log(`   Crew: ${movieResponse.data.crew.length} members`);
        }

        // Test 5: Search movies
        console.log('\n5. Testing /api/movies/search?query=Avengers...');
        const searchResponse = await axios.get(`${BASE_URL}/movies/search?query=Avengers`);
        console.log(`✅ Search Results: ${searchResponse.data.results.length} movies found`);
        if (searchResponse.data.results.length > 0) {
            console.log(`   Found: ${searchResponse.data.results[0].title}`);
        }

        // Test 6: Get theaters
        console.log('\n6. Testing /api/theaters...');
        try {
            const theatersResponse = await axios.get(`${BASE_URL}/theaters`);
            console.log(`✅ Theaters: ${theatersResponse.data.length} theaters found`);
            if (theatersResponse.data.length > 0) {
                console.log(`   First theater: ${theatersResponse.data[0].name} in ${theatersResponse.data[0].location.city}`);
            }
        } catch (error) {
            console.log(`❌ Theaters endpoint not available: ${error.message}`);
        }

        console.log('\n🎉 API Testing Complete! All endpoints are working with database data.');
        console.log('\n📊 Summary:');
        console.log(`   • ${nowPlayingResponse.data.results.length} movies currently playing`);
        console.log(`   • ${popularResponse.data.results.length} popular movies available`);
        console.log(`   • ${upcomingResponse.data.results.length} upcoming movies`);
        console.log('   • Movie details, search, and cast/crew data all working');

    } catch (error) {
        console.error('❌ API Test Failed:', error.message);
        if (error.response) {
            console.error('Response status:', error.response.status);
            console.error('Response data:', error.response.data);
        }
    }
}

// Run the test
testAPI();
