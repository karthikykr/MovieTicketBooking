const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config({ path: __dirname + "/.env" });

// Import models
const User = require("./models/userModel");
const Movie = require("./models/movieModel");
const Theater = require("./models/theaterModel");
const MovieShowtime = require("./models/MovieShowtimeModel");
const Booking = require("./models/bookingModel");
const Review = require("./models/reviewModel");
const Payment = require("./models/paymentModel");
const Notification = require("./models/notificationModel");

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Clear existing data
const clearDatabase = async () => {
  try {
    await User.deleteMany({});
    await Movie.deleteMany({});
    await Theater.deleteMany({});
    await MovieShowtime.deleteMany({});
    await Booking.deleteMany({});
    await Review.deleteMany({});
    await Payment.deleteMany({});
    await Notification.deleteMany({});
    console.log("Database cleared successfully");
  } catch (error) {
    console.error("Error clearing database:", error);
  }
};

// Generate seat layout
const generateSeatLayout = (rows, seatsPerRow) => {
  const seats = [];
  const rowLabels = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  for (let i = 0; i < rows; i++) {
    for (let j = 1; j <= seatsPerRow; j++) {
      seats.push(`${rowLabels[i]}${j}`);
    }
  }
  return seats;
};

// Generate seats for showtime
const generateShowtimeSeats = (totalSeats) => {
  const seats = [];
  const rowLabels = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const seatsPerRow = 12;
  const rows = Math.ceil(totalSeats / seatsPerRow);

  for (let i = 0; i < rows; i++) {
    for (let j = 1; j <= seatsPerRow && seats.length < totalSeats; j++) {
      seats.push({
        seatNumber: `${rowLabels[i]}${j}`,
        isBooked: Math.random() < 0.3, // 30% chance of being booked
      });
    }
  }
  return seats;
};

// Seed Users
const seedUsers = async () => {
  const users = [
    {
      name: "John Doe",
      email: "john@example.com",
      password: "password123",
      phone: "+1-555-0101",
      dateOfBirth: new Date("1990-05-15"),
      gender: "male",
      address: {
        street: "123 Main St",
        city: "New York",
        state: "NY",
        zipCode: "10001",
        country: "USA",
      },
      preferences: {
        favoriteGenres: ["Action", "Sci-Fi", "Thriller"],
        notifications: {
          email: true,
          sms: true,
          push: true,
        },
      },
      loyaltyPoints: 1250,
      membershipTier: "gold",
      role: "user",
    },
    {
      name: "Jane Smith",
      email: "jane@example.com",
      password: "password123",
      phone: "+1-555-0102",
      dateOfBirth: new Date("1985-08-22"),
      gender: "female",
      address: {
        street: "456 Oak Ave",
        city: "Los Angeles",
        state: "CA",
        zipCode: "90210",
        country: "USA",
      },
      preferences: {
        favoriteGenres: ["Romance", "Comedy", "Drama"],
        notifications: {
          email: true,
          sms: false,
          push: true,
        },
      },
      loyaltyPoints: 850,
      membershipTier: "silver",
      role: "user",
    },
    {
      name: "Admin User",
      email: "admin@moviebooking.com",
      password: "admin123",
      phone: "+1-555-0100",
      role: "admin",
      loyaltyPoints: 0,
      membershipTier: "platinum",
    },
    {
      name: "Theater Manager",
      email: "manager@regalcinemas.com",
      password: "manager123",
      phone: "+1-555-0103",
      role: "theater_manager",
      loyaltyPoints: 500,
      membershipTier: "bronze",
    },
    {
      name: "Mike Johnson",
      email: "mike@example.com",
      password: "password123",
      phone: "+1-555-0104",
      dateOfBirth: new Date("1992-12-10"),
      gender: "male",
      address: {
        street: "789 Pine St",
        city: "Chicago",
        state: "IL",
        zipCode: "60601",
        country: "USA",
      },
      preferences: {
        favoriteGenres: ["Horror", "Action", "Comedy"],
        notifications: {
          email: true,
          sms: true,
          push: false,
        },
      },
      loyaltyPoints: 320,
      membershipTier: "bronze",
      role: "user",
    },
  ];

  const createdUsers = await User.insertMany(users);
  console.log(`${createdUsers.length} users created`);
  return createdUsers;
};

// Seed Movies
const seedMovies = async () => {
  const movies = [
    {
      title: "Avengers: Endgame",
      genre: ["Action", "Adventure", "Sci-Fi"],
      duration: 181,
      releaseDate: new Date("2019-04-26"),
      rating: 8.4,
      votes: 876543,
      description:
        "After the devastating events of Avengers: Infinity War, the universe is in ruins. With the help of remaining allies, the Avengers assemble once more in order to reverse Thanos' actions and restore balance to the universe.",
      image: "https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg",
      backdropImage:
        "https://image.tmdb.org/t/p/w1280/7RyHsO4yDXtBv1zUU3mTpHeQ0d5.jpg",
      trailer: "https://www.youtube.com/watch?v=TcMBFSGVi1c",
      language: "English",
      country: "USA",
      budget: 356000000,
      boxOffice: 2797800564,
      awards: ["Academy Award Nominee", "BAFTA Winner"],
      ageRating: "PG-13",
      status: "now_playing",
      cast: [
        {
          name: "Robert Downey Jr.",
          character: "Tony Stark / Iron Man",
          order: 1,
        },
        {
          name: "Chris Evans",
          character: "Steve Rogers / Captain America",
          order: 2,
        },
        { name: "Mark Ruffalo", character: "Bruce Banner / Hulk", order: 3 },
        { name: "Chris Hemsworth", character: "Thor", order: 4 },
        {
          name: "Scarlett Johansson",
          character: "Natasha Romanoff / Black Widow",
          order: 5,
        },
      ],
      crew: [
        { name: "Anthony Russo", job: "Director", department: "Directing" },
        { name: "Joe Russo", job: "Director", department: "Directing" },
        { name: "Christopher Markus", job: "Writer", department: "Writing" },
      ],
      averageRating: 8.4,
      totalReviews: 0,
    },
    {
      title: "Spider-Man: No Way Home",
      genre: ["Action", "Adventure", "Sci-Fi"],
      duration: 148,
      releaseDate: new Date("2021-12-17"),
      rating: 8.2,
      votes: 654321,
      description:
        "With Spider-Man's identity now revealed, Peter asks Doctor Strange for help. When a spell goes wrong, dangerous foes from other worlds start to appear, forcing Peter to discover what it truly means to be Spider-Man.",
      image: "https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg",
      backdropImage:
        "https://image.tmdb.org/t/p/w1280/14QbnygCuTO0vl7CAFmPf1fgZfV.jpg",
      trailer: "https://www.youtube.com/watch?v=JfVOs4VSpmA",
      language: "English",
      country: "USA",
      budget: 200000000,
      boxOffice: 1921847111,
      awards: ["People's Choice Award Winner"],
      ageRating: "PG-13",
      status: "now_playing",
      cast: [
        {
          name: "Tom Holland",
          character: "Peter Parker / Spider-Man",
          order: 1,
        },
        { name: "Zendaya", character: "MJ", order: 2 },
        { name: "Benedict Cumberbatch", character: "Doctor Strange", order: 3 },
        { name: "Jacob Batalon", character: "Ned Leeds", order: 4 },
      ],
      crew: [
        { name: "Jon Watts", job: "Director", department: "Directing" },
        { name: "Chris McKenna", job: "Writer", department: "Writing" },
      ],
      averageRating: 8.2,
      totalReviews: 0,
    },
    {
      title: "The Batman",
      genre: ["Action", "Crime", "Drama"],
      duration: 176,
      releaseDate: new Date("2022-03-04"),
      rating: 7.8,
      votes: 543210,
      description:
        "When the Riddler, a sadistic serial killer, begins murdering key political figures in Gotham, Batman is forced to investigate the city's hidden corruption and question his family's involvement.",
      image: "https://image.tmdb.org/t/p/w500/b0PlSFdDwbyK0cf5RxwDpaOJQvQ.jpg",
      backdropImage:
        "https://image.tmdb.org/t/p/w1280/qqHQsStV6exghCM7zbObuYBiYxw.jpg",
      trailer: "https://www.youtube.com/watch?v=mqqft2x_Aa4",
      language: "English",
      country: "USA",
      budget: 185000000,
      boxOffice: 771000000,
      awards: ["Saturn Award Winner"],
      ageRating: "PG-13",
      status: "now_playing",
      cast: [
        {
          name: "Robert Pattinson",
          character: "Bruce Wayne / Batman",
          order: 1,
        },
        { name: "Zoë Kravitz", character: "Selina Kyle / Catwoman", order: 2 },
        { name: "Paul Dano", character: "The Riddler", order: 3 },
        { name: "Jeffrey Wright", character: "James Gordon", order: 4 },
      ],
      crew: [
        { name: "Matt Reeves", job: "Director", department: "Directing" },
        { name: "Matt Reeves", job: "Writer", department: "Writing" },
      ],
      averageRating: 7.8,
      totalReviews: 0,
    },
    {
      title: "Top Gun: Maverick",
      genre: ["Action", "Drama"],
      duration: 130,
      releaseDate: new Date("2022-05-27"),
      rating: 8.3,
      votes: 432109,
      description:
        "After thirty years, Maverick is still pushing the envelope as a top naval aviator, but must confront ghosts of his past when he leads TOP GUN's elite graduates on a mission that demands the ultimate sacrifice from those chosen to fly it.",
      image: "https://image.tmdb.org/t/p/w500/62HCnUTziyWcpDaBO2i1DX17ljH.jpg",
      backdropImage:
        "https://image.tmdb.org/t/p/w1280/odJ4hx6g6vBt4lBWKFD1tI8WS4x.jpg",
      trailer: "https://www.youtube.com/watch?v=qSqVVswa420",
      language: "English",
      country: "USA",
      budget: 170000000,
      boxOffice: 1488732821,
      awards: ["Academy Award Nominee", "Golden Globe Winner"],
      ageRating: "PG-13",
      status: "now_playing",
      cast: [
        { name: "Tom Cruise", character: 'Pete "Maverick" Mitchell', order: 1 },
        {
          name: "Miles Teller",
          character: 'Bradley "Rooster" Bradshaw',
          order: 2,
        },
        { name: "Jennifer Connelly", character: "Penny Benjamin", order: 3 },
        { name: "Jon Hamm", character: "Cyclone", order: 4 },
      ],
      crew: [
        { name: "Joseph Kosinski", job: "Director", department: "Directing" },
        { name: "Ehren Kruger", job: "Writer", department: "Writing" },
      ],
      averageRating: 8.3,
      totalReviews: 0,
    },
    {
      title: "Dune",
      genre: ["Adventure", "Drama", "Sci-Fi"],
      duration: 155,
      releaseDate: new Date("2021-10-22"),
      rating: 8.0,
      votes: 321098,
      description:
        "Paul Atreides, a brilliant and gifted young man born into a great destiny beyond his understanding, must travel to the most dangerous planet in the universe to ensure the future of his family and his people.",
      image: "https://image.tmdb.org/t/p/w500/d5NXSklXo0qyIYkgV94XAgMIckC.jpg",
      backdropImage:
        "https://image.tmdb.org/t/p/w1280/iopYFB1b6Bh7FWZh3onQhph1sih.jpg",
      trailer: "https://www.youtube.com/watch?v=8g18jFHCLXk",
      language: "English",
      country: "USA",
      budget: 165000000,
      boxOffice: 401763527,
      awards: ["Academy Award Winner", "BAFTA Winner"],
      ageRating: "PG-13",
      status: "upcoming",
      cast: [
        { name: "Timothée Chalamet", character: "Paul Atreides", order: 1 },
        { name: "Rebecca Ferguson", character: "Lady Jessica", order: 2 },
        { name: "Oscar Isaac", character: "Duke Leto Atreides", order: 3 },
        { name: "Josh Brolin", character: "Gurney Halleck", order: 4 },
      ],
      crew: [
        { name: "Denis Villeneuve", job: "Director", department: "Directing" },
        { name: "Jon Spaihts", job: "Writer", department: "Writing" },
      ],
      averageRating: 8.0,
      totalReviews: 0,
    },
  ];

  const createdMovies = await Movie.insertMany(movies);
  console.log(`${createdMovies.length} movies created`);
  return createdMovies;
};

// Seed Theaters
const seedTheaters = async (users) => {
  const theaters = [
    {
      name: "Regal Cinemas Times Square",
      location: {
        address: "247 W 42nd St",
        city: "New York",
        state: "NY",
        zipCode: "10036",
        coordinates: {
          latitude: 40.7589,
          longitude: -73.9851,
        },
      },
      contact: {
        phone: "+1-212-768-0023",
        email: "timessquare@regalcinemas.com",
        website: "https://www.regmovies.com",
      },
      totalSeats: 1200,
      availableSeats: generateSeatLayout(10, 12),
      seatLayout: {
        rows: 10,
        seatsPerRow: 12,
        premiumRows: ["A", "B"],
        wheelchairAccessible: ["H8", "H9", "I8", "I9"],
      },
      amenities: [
        "IMAX",
        "Dolby Atmos",
        "Recliner Seats",
        "Food Court",
        "Parking",
        "AC",
      ],
      screens: [
        {
          screenNumber: 1,
          screenType: "IMAX",
          totalSeats: 300,
          seatLayout: { rows: 15, seatsPerRow: 20 },
        },
        {
          screenNumber: 2,
          screenType: "Premium",
          totalSeats: 150,
          seatLayout: { rows: 10, seatsPerRow: 15 },
        },
        {
          screenNumber: 3,
          screenType: "Standard",
          totalSeats: 120,
          seatLayout: { rows: 10, seatsPerRow: 12 },
        },
      ],
      pricing: {
        standard: 15.99,
        premium: 22.99,
        imax: 28.99,
        fourDX: 32.99,
      },
      operatingHours: {
        weekdays: { open: "10:00", close: "23:30" },
        weekends: { open: "09:00", close: "24:00" },
      },
      manager: users.find((u) => u.role === "theater_manager")?._id,
      rating: 4.5,
      totalReviews: 1247,
    },
    {
      name: "AMC Empire 25",
      location: {
        address: "234 W 42nd St",
        city: "New York",
        state: "NY",
        zipCode: "10036",
        coordinates: {
          latitude: 40.758,
          longitude: -73.9855,
        },
      },
      contact: {
        phone: "+1-212-398-3939",
        email: "empire25@amctheatres.com",
        website: "https://www.amctheatres.com",
      },
      totalSeats: 2500,
      availableSeats: generateSeatLayout(12, 15),
      seatLayout: {
        rows: 12,
        seatsPerRow: 15,
        premiumRows: ["A", "B", "C"],
        wheelchairAccessible: ["J10", "J11", "K10", "K11"],
      },
      amenities: [
        "IMAX",
        "4DX",
        "Dolby Atmos",
        "Recliner Seats",
        "Food Court",
        "Parking",
        "AC",
        "Wheelchair Access",
      ],
      screens: [
        {
          screenNumber: 1,
          screenType: "IMAX",
          totalSeats: 400,
          seatLayout: { rows: 20, seatsPerRow: 20 },
        },
        {
          screenNumber: 2,
          screenType: "4DX",
          totalSeats: 100,
          seatLayout: { rows: 8, seatsPerRow: 12 },
        },
        {
          screenNumber: 3,
          screenType: "Premium",
          totalSeats: 180,
          seatLayout: { rows: 12, seatsPerRow: 15 },
        },
      ],
      pricing: {
        standard: 16.99,
        premium: 24.99,
        imax: 29.99,
        fourDX: 34.99,
      },
      operatingHours: {
        weekdays: { open: "09:30", close: "24:00" },
        weekends: { open: "08:30", close: "01:00" },
      },
      manager: users.find((u) => u.role === "admin")?._id,
      rating: 4.3,
      totalReviews: 2156,
    },
  ];

  const createdTheaters = await Theater.insertMany(theaters);
  console.log(`${createdTheaters.length} theaters created`);
  return createdTheaters;
};

// Seed Movie Showtimes
const seedMovieShowtimes = async (movies, theaters) => {
  const showtimes = [];
  const times = ["10:00", "13:30", "16:45", "19:30", "22:15"];
  const formats = ["2D", "3D", "IMAX", "4DX"];
  const prices = { "2D": 12.99, "3D": 16.99, IMAX: 22.99, "4DX": 26.99 };

  // Create showtimes for next 14 days
  for (let day = 0; day < 14; day++) {
    const showDate = new Date();
    showDate.setDate(showDate.getDate() + day);

    for (const movie of movies) {
      for (const theater of theaters) {
        const movieShowtime = {
          movieId: movie._id,
          theaterId: theater._id,
          date: showDate,
          showtimes: [],
        };

        // Add 3-4 showtimes per day per theater per movie
        const numShowtimes = Math.floor(Math.random() * 2) + 3;
        const selectedTimes = times.slice(0, numShowtimes);

        for (const time of selectedTimes) {
          const format = formats[Math.floor(Math.random() * formats.length)];
          movieShowtime.showtimes.push({
            time: time,
            format: format,
            price: prices[format],
            seats: generateShowtimeSeats(120),
          });
        }

        showtimes.push(movieShowtime);
      }
    }
  }

  const createdShowtimes = await MovieShowtime.insertMany(showtimes);
  console.log(`${createdShowtimes.length} movie showtimes created`);
  return createdShowtimes;
};

// Main seeding function
const seedDatabase = async () => {
  try {
    await connectDB();
    await clearDatabase();

    console.log("Starting database seeding...");

    const users = await seedUsers();
    const movies = await seedMovies();
    const theaters = await seedTheaters(users);
    const showtimes = await seedMovieShowtimes(movies, theaters);

    console.log("Database seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

// Run seeding
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };
