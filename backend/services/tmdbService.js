const axios = require('axios');

class TMDBService {
    constructor() {
        this.apiKey = process.env.TMDB_API_KEY || 'demo_key';
        this.baseURL = process.env.TMDB_BASE_URL || 'https://api.themoviedb.org/3';
        this.imageBaseURL = 'https://image.tmdb.org/t/p/w500';
        this.backdropBaseURL = 'https://image.tmdb.org/t/p/w1280';
    }

    async getPopularMovies(page = 1) {
        try {
            const response = await axios.get(`${this.baseURL}/movie/popular`, {
                params: {
                    api_key: this.apiKey,
                    page: page,
                    language: 'en-US'
                }
            });
            return this.transformMovies(response.data.results);
        } catch (error) {
            console.error('Error fetching popular movies:', error);
            return this.getFallbackMovies();
        }
    }

    async getNowPlayingMovies(page = 1) {
        try {
            const response = await axios.get(`${this.baseURL}/movie/now_playing`, {
                params: {
                    api_key: this.apiKey,
                    page: page,
                    language: 'en-US'
                }
            });
            return this.transformMovies(response.data.results);
        } catch (error) {
            console.error('Error fetching now playing movies:', error);
            return this.getFallbackMovies();
        }
    }

    async getUpcomingMovies(page = 1) {
        try {
            const response = await axios.get(`${this.baseURL}/movie/upcoming`, {
                params: {
                    api_key: this.apiKey,
                    page: page,
                    language: 'en-US'
                }
            });
            return this.transformMovies(response.data.results);
        } catch (error) {
            console.error('Error fetching upcoming movies:', error);
            return this.getFallbackMovies();
        }
    }

    async getMovieDetails(movieId) {
        try {
            const [movieResponse, creditsResponse] = await Promise.all([
                axios.get(`${this.baseURL}/movie/${movieId}`, {
                    params: {
                        api_key: this.apiKey,
                        language: 'en-US'
                    }
                }),
                axios.get(`${this.baseURL}/movie/${movieId}/credits`, {
                    params: {
                        api_key: this.apiKey,
                        language: 'en-US'
                    }
                })
            ]);

            return this.transformMovieDetails(movieResponse.data, creditsResponse.data);
        } catch (error) {
            console.error('Error fetching movie details:', error);
            return null;
        }
    }

    async searchMovies(query, page = 1) {
        try {
            const response = await axios.get(`${this.baseURL}/search/movie`, {
                params: {
                    api_key: this.apiKey,
                    query: query,
                    page: page,
                    language: 'en-US'
                }
            });
            return this.transformMovies(response.data.results);
        } catch (error) {
            console.error('Error searching movies:', error);
            return [];
        }
    }

    transformMovies(tmdbMovies) {
        return tmdbMovies.map(movie => ({
            tmdbId: movie.id,
            title: movie.title,
            genre: movie.genre_ids?.map(id => this.getGenreName(id)).join(', ') || 'Unknown',
            duration: '120', // TMDB doesn't provide runtime in list endpoints
            releaseDate: movie.release_date,
            rating: movie.vote_average,
            votes: movie.vote_count,
            description: movie.overview,
            image: movie.poster_path ? `${this.imageBaseURL}${movie.poster_path}` : null,
            backdropImage: movie.backdrop_path ? `${this.backdropBaseURL}${movie.backdrop_path}` : null,
            popularity: movie.popularity,
            adult: movie.adult
        }));
    }

    transformMovieDetails(movie, credits) {
        const cast = credits.cast?.slice(0, 10).map(person => ({
            name: person.name,
            role: person.character,
            image: person.profile_path ? `${this.imageBaseURL}${person.profile_path}` : null
        })) || [];

        const crew = credits.crew?.filter(person => 
            ['Director', 'Producer', 'Writer'].includes(person.job)
        ).slice(0, 5).map(person => ({
            name: person.name,
            role: person.job,
            image: person.profile_path ? `${this.imageBaseURL}${person.profile_path}` : null
        })) || [];

        return {
            tmdbId: movie.id,
            title: movie.title,
            genre: movie.genres?.map(g => g.name).join(', ') || 'Unknown',
            duration: movie.runtime?.toString() || '120',
            releaseDate: movie.release_date,
            rating: movie.vote_average,
            votes: movie.vote_count,
            description: movie.overview,
            image: movie.poster_path ? `${this.imageBaseURL}${movie.poster_path}` : null,
            backdropImage: movie.backdrop_path ? `${this.backdropBaseURL}${movie.backdrop_path}` : null,
            cast: cast,
            crew: crew,
            budget: movie.budget,
            revenue: movie.revenue,
            status: movie.status,
            tagline: movie.tagline
        };
    }

    getGenreName(genreId) {
        const genres = {
            28: 'Action', 12: 'Adventure', 16: 'Animation', 35: 'Comedy',
            80: 'Crime', 99: 'Documentary', 18: 'Drama', 10751: 'Family',
            14: 'Fantasy', 36: 'History', 27: 'Horror', 10402: 'Music',
            9648: 'Mystery', 10749: 'Romance', 878: 'Science Fiction',
            10770: 'TV Movie', 53: 'Thriller', 10752: 'War', 37: 'Western'
        };
        return genres[genreId] || 'Unknown';
    }

    getFallbackMovies() {
        return [
            {
                tmdbId: 1,
                title: "Avengers: Endgame",
                genre: "Action, Adventure, Drama",
                duration: "181",
                releaseDate: "2019-04-26",
                rating: 8.4,
                votes: 1250000,
                description: "After the devastating events of Avengers: Infinity War, the universe is in ruins.",
                image: "https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg",
                backdropImage: "https://image.tmdb.org/t/p/w1280/7RyHsO4yDXtBv1zUU3mTpHeQ0d5.jpg"
            },
            {
                tmdbId: 2,
                title: "Spider-Man: No Way Home",
                genre: "Action, Adventure, Sci-Fi",
                duration: "148",
                releaseDate: "2021-12-17",
                rating: 8.2,
                votes: 980000,
                description: "With Spider-Man's identity now revealed, Peter asks Doctor Strange for help.",
                image: "https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg",
                backdropImage: "https://image.tmdb.org/t/p/w1280/14QbnygCuTO0vl7CAFmPf1fgZfV.jpg"
            }
        ];
    }
}

module.exports = new TMDBService();
