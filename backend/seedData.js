const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Movie = require('./models/movieModel');
const Theater = require('./models/theaterModel');
const MovieShowtime = require('./models/MovieShowtimeModel');

dotenv.config();

// Sample Movies Data
const moviesData = [
    {
        title: "Avengers: Endgame",
        genre: "Action, Adventure, Drama",
        duration: "181",
        releaseDate: "2024-01-15",
        rating: 8.4,
        votes: 1250000,
        description: "After the devastating events of Avengers: Infinity War, the universe is in ruins. With the help of remaining allies, the Avengers assemble once more in order to reverse Thanos' actions and restore balance to the universe.",
        image: "https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg",
        cast: [
            { name: "Robert Downey Jr.", role: "Tony Stark / Iron Man", image: "https://image.tmdb.org/t/p/w185/5qHNjhtjMD4YWH3UP0rm4tKwxCL.jpg" },
            { name: "Chris Evans", role: "Steve Rogers / Captain America", image: "https://image.tmdb.org/t/p/w185/3bOGNsHlrswhyW79uvIHH1V43JI.jpg" },
            { name: "Mark Ruffalo", role: "Bruce Banner / Hulk", image: "https://image.tmdb.org/t/p/w185/z3dvKqMNDQWk3QLxzumloQVR0pv.jpg" }
        ],
        crew: [
            { name: "Anthony Russo", role: "Director", image: "https://image.tmdb.org/t/p/w185/aGSvZg7uITJGrxw8BuyVHe6NXH.jpg" },
            { name: "Joe Russo", role: "Director", image: "https://image.tmdb.org/t/p/w185/aGSvZg7uITJGrxw8BuyVHe6NXH.jpg" }
        ]
    },
    {
        title: "Spider-Man: No Way Home",
        genre: "Action, Adventure, Sci-Fi",
        duration: "148",
        releaseDate: "2024-02-10",
        rating: 8.2,
        votes: 980000,
        description: "With Spider-Man's identity now revealed, Peter asks Doctor Strange for help. When a spell goes wrong, dangerous foes from other worlds start to appear, forcing Peter to discover what it truly means to be Spider-Man.",
        image: "https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg",
        cast: [
            { name: "Tom Holland", role: "Peter Parker / Spider-Man", image: "https://image.tmdb.org/t/p/w185/bqRrTf4wWFW3xAWr3wXlHrSNlvj.jpg" },
            { name: "Zendaya", role: "MJ", image: "https://image.tmdb.org/t/p/w185/kg2D6qOOpWmsHKHKKysFbfXwAjY.jpg" },
            { name: "Benedict Cumberbatch", role: "Doctor Strange", image: "https://image.tmdb.org/t/p/w185/fBEucxECxGLKVHBznO0qHtCGiMO.jpg" }
        ],
        crew: [
            { name: "Jon Watts", role: "Director", image: "https://image.tmdb.org/t/p/w185/aGSvZg7uITJGrxw8BuyVHe6NXH.jpg" }
        ]
    },
    {
        title: "The Batman",
        genre: "Action, Crime, Drama",
        duration: "176",
        releaseDate: "2024-03-05",
        rating: 7.8,
        votes: 750000,
        description: "When the Riddler, a sadistic serial killer, begins murdering key political figures in Gotham, Batman is forced to investigate the city's hidden corruption and question his family's involvement.",
        image: "https://image.tmdb.org/t/p/w500/b0PlSFdDwbyK0cf5RxwDpaOJQvQ.jpg",
        cast: [
            { name: "Robert Pattinson", role: "Bruce Wayne / Batman", image: "https://image.tmdb.org/t/p/w185/kks3ZzqLaC4O9g1fv76rydtIVgU.jpg" },
            { name: "Zoë Kravitz", role: "Selina Kyle / Catwoman", image: "https://image.tmdb.org/t/p/w185/afS6eVbbbpLfiOyuEqMWRs2XKh4.jpg" },
            { name: "Paul Dano", role: "The Riddler", image: "https://image.tmdb.org/t/p/w185/aCQZs8JKu9U5VF3c56OHzKXhafP.jpg" }
        ],
        crew: [
            { name: "Matt Reeves", role: "Director", image: "https://image.tmdb.org/t/p/w185/aGSvZg7uITJGrxw8BuyVHe6NXH.jpg" }
        ]
    },
    {
        title: "Top Gun: Maverick",
        genre: "Action, Drama",
        duration: "130",
        releaseDate: "2024-04-20",
        rating: 8.3,
        votes: 650000,
        description: "After thirty years, Maverick is still pushing the envelope as a top naval aviator, but must confront ghosts of his past when he leads TOP GUN's elite graduates on a mission that demands the ultimate sacrifice from those chosen to fly it.",
        image: "https://image.tmdb.org/t/p/w500/62HCnUTziyWcpDaBO2i1DX17ljH.jpg",
        cast: [
            { name: "Tom Cruise", role: "Pete 'Maverick' Mitchell", image: "https://image.tmdb.org/t/p/w185/eOh4ubpOm2Igdg0QH2ghj0mFtC.jpg" },
            { name: "Miles Teller", role: "Bradley 'Rooster' Bradshaw", image: "https://image.tmdb.org/t/p/w185/yYhwWRcxDHTn63gSEF1vnDAD7cD.jpg" },
            { name: "Jennifer Connelly", role: "Penny Benjamin", image: "https://image.tmdb.org/t/p/w185/bpILtSl6z5xc6YOAiPnDBlXDYMJ.jpg" }
        ],
        crew: [
            { name: "Joseph Kosinski", role: "Director", image: "https://image.tmdb.org/t/p/w185/aGSvZg7uITJGrxw8BuyVHe6NXH.jpg" }
        ]
    }
];

// Sample Theaters Data
const theatersData = [
    {
        name: "AMC Empire 25",
        location: "New York, NY",
        totalSeats: 120,
        seatLayout: { rows: 10, seatsPerRow: 12 },
        availableSeats: []
    },
    {
        name: "Regal LA Live",
        location: "Los Angeles, CA",
        totalSeats: 150,
        seatLayout: { rows: 12, seatsPerRow: 13 },
        availableSeats: []
    },
    {
        name: "Cinemark Century City",
        location: "Century City, CA",
        totalSeats: 100,
        seatLayout: { rows: 8, seatsPerRow: 12 },
        availableSeats: []
    }
];

// Function to generate seat numbers
const generateSeats = (rows, seatsPerRow) => {
    const seats = [];
    const rowLabels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    
    for (let row = 0; row < rows; row++) {
        for (let seat = 1; seat <= seatsPerRow; seat++) {
            seats.push(`${rowLabels[row]}${seat}`);
        }
    }
    return seats;
};

// Connect to MongoDB and seed data
const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to MongoDB');

        // Clear existing data
        await Movie.deleteMany({});
        await Theater.deleteMany({});
        await MovieShowtime.deleteMany({});
        console.log('Cleared existing data');

        // Insert movies
        const movies = await Movie.insertMany(moviesData);
        console.log('Movies seeded successfully');

        // Generate and insert theaters with seat data
        const theatersWithSeats = theatersData.map(theater => ({
            ...theater,
            availableSeats: generateSeats(theater.seatLayout.rows, theater.seatLayout.seatsPerRow)
        }));
        
        const theaters = await Theater.insertMany(theatersWithSeats);
        console.log('Theaters seeded successfully');

        // Generate showtimes for each movie in each theater
        const showtimesData = [];
        const today = new Date();
        const times = ['10:00 AM', '1:00 PM', '4:00 PM', '7:00 PM', '10:00 PM'];
        const formats = ['2D', '3D', 'IMAX'];
        const prices = { '2D': 12, '3D': 15, 'IMAX': 18 };

        movies.forEach(movie => {
            theaters.forEach(theater => {
                // Create showtimes for next 7 days
                for (let day = 0; day < 7; day++) {
                    const date = new Date(today);
                    date.setDate(today.getDate() + day);
                    
                    const showtimes = times.map(time => {
                        const format = formats[Math.floor(Math.random() * formats.length)];
                        return {
                            time,
                            format,
                            price: prices[format],
                            seats: theater.availableSeats.map(seatNumber => ({
                                seatNumber,
                                isBooked: false
                            }))
                        };
                    });

                    showtimesData.push({
                        movieId: movie._id,
                        theaterId: theater._id,
                        date,
                        showtimes
                    });
                }
            });
        });

        await MovieShowtime.insertMany(showtimesData);
        console.log('Showtimes seeded successfully');

        console.log('Database seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();
