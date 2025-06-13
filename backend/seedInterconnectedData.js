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
        isBooked: Math.random() < 0.2, // 20% chance of being booked
      });
    }
  }
  return seats;
};

// Utility function to get random elements from array
const getRandomElements = (arr, count) => {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// Utility function to generate random date within range
const getRandomDate = (start, end) => {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
};

// Seed comprehensive user data
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
        notifications: { email: true, sms: true, push: true },
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
        notifications: { email: true, sms: false, push: true },
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
        notifications: { email: true, sms: true, push: false },
      },
      loyaltyPoints: 320,
      membershipTier: "bronze",
      role: "user",
    },
  ];

  // Add more diverse users
  const additionalUsers = [
    {
      name: "Sarah Wilson",
      email: "sarah@example.com",
      password: "password123",
      phone: "+1-555-0105",
      dateOfBirth: new Date("1988-03-12"),
      gender: "female",
      address: {
        street: "321 Elm St",
        city: "San Francisco",
        state: "CA",
        zipCode: "94102",
        country: "USA",
      },
      preferences: {
        favoriteGenres: ["Sci-Fi", "Fantasy", "Adventure"],
        notifications: { email: true, sms: true, push: true },
      },
      loyaltyPoints: 2100,
      membershipTier: "platinum",
      role: "user",
    },
    {
      name: "David Chen",
      email: "david@example.com",
      password: "password123",
      phone: "+1-555-0106",
      dateOfBirth: new Date("1995-11-08"),
      gender: "male",
      address: {
        street: "654 Maple Ave",
        city: "Seattle",
        state: "WA",
        zipCode: "98101",
        country: "USA",
      },
      preferences: {
        favoriteGenres: ["Animation", "Family", "Comedy"],
        notifications: { email: false, sms: true, push: true },
      },
      loyaltyPoints: 450,
      membershipTier: "bronze",
      role: "user",
    },
    {
      name: "Emily Rodriguez",
      email: "emily@example.com",
      password: "password123",
      phone: "+1-555-0107",
      dateOfBirth: new Date("1987-07-25"),
      gender: "female",
      address: {
        street: "987 Cedar Blvd",
        city: "Miami",
        state: "FL",
        zipCode: "33101",
        country: "USA",
      },
      preferences: {
        favoriteGenres: ["Drama", "Romance", "Thriller"],
        notifications: { email: true, sms: false, push: false },
      },
      loyaltyPoints: 1680,
      membershipTier: "gold",
      role: "user",
    },
    {
      name: "Alex Thompson",
      email: "alex@example.com",
      password: "password123",
      phone: "+1-555-0108",
      dateOfBirth: new Date("1993-01-18"),
      gender: "other",
      address: {
        street: "147 Birch St",
        city: "Austin",
        state: "TX",
        zipCode: "73301",
        country: "USA",
      },
      preferences: {
        favoriteGenres: ["Horror", "Mystery", "Crime"],
        notifications: { email: true, sms: true, push: true },
      },
      loyaltyPoints: 890,
      membershipTier: "silver",
      role: "user",
    },
    {
      name: "Lisa Park",
      email: "lisa@example.com",
      password: "password123",
      phone: "+1-555-0109",
      dateOfBirth: new Date("1991-09-14"),
      gender: "female",
      address: {
        street: "258 Spruce Ave",
        city: "Boston",
        state: "MA",
        zipCode: "02101",
        country: "USA",
      },
      preferences: {
        favoriteGenres: ["Documentary", "Biography", "History"],
        notifications: { email: true, sms: false, push: true },
      },
      loyaltyPoints: 1340,
      membershipTier: "gold",
      role: "user",
    },
  ];

  const allUsers = [...users, ...additionalUsers];
  const createdUsers = await User.insertMany(allUsers);
  console.log(`${createdUsers.length} users created`);
  return createdUsers;
};

// Seed comprehensive movie data
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
      status: "now_playing",
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

  // Add more diverse movies
  const additionalMovies = [
    {
      title: "Everything Everywhere All at Once",
      genre: ["Action", "Adventure", "Comedy", "Sci-Fi"],
      duration: 139,
      releaseDate: new Date("2022-03-25"),
      rating: 7.8,
      votes: 234567,
      description:
        "An aging Chinese immigrant is swept up in an insane adventure, where she alone can save what's important to her by connecting with the lives she could have led in other universes.",
      image: "https://image.tmdb.org/t/p/w500/w3LxiVYdWWRvEVdn5RYq6jIqkb1.jpg",
      backdropImage:
        "https://image.tmdb.org/t/p/w1280/yYrvN5WFeGYjJnRzhY0QXuo4Isw.jpg",
      trailer: "https://www.youtube.com/watch?v=G4S_N4QifPk",
      language: "English",
      country: "USA",
      budget: 14300000,
      boxOffice: 139400000,
      awards: ["Academy Award Winner", "Golden Globe Winner"],
      ageRating: "R",
      status: "now_playing",
      cast: [
        { name: "Michelle Yeoh", character: "Evelyn Quan Wang", order: 1 },
        {
          name: "Stephanie Hsu",
          character: "Joy Wang / Jobu Tupaki",
          order: 2,
        },
        { name: "Ke Huy Quan", character: "Waymond Wang", order: 3 },
        {
          name: "Jamie Lee Curtis",
          character: "Deirdre Beaubeirdre",
          order: 4,
        },
      ],
      crew: [
        { name: "Daniel Kwan", job: "Director", department: "Directing" },
        { name: "Daniel Scheinert", job: "Director", department: "Directing" },
      ],
      averageRating: 7.8,
      totalReviews: 0,
    },
    {
      title: "Black Panther: Wakanda Forever",
      genre: ["Action", "Adventure", "Drama"],
      duration: 161,
      releaseDate: new Date("2022-11-11"),
      rating: 6.7,
      votes: 345678,
      description:
        "Queen Ramonda, Shuri, M'Baku, Okoye and the Dora Milaje fight to protect their nation from intervening world powers in the wake of King T'Challa's death.",
      image: "https://image.tmdb.org/t/p/w500/sv1xJUazXeYqALzczSZ3O6nkH75.jpg",
      backdropImage:
        "https://image.tmdb.org/t/p/w1280/yDHYTfA3R0jFYba16jBB1ef8oIt.jpg",
      trailer: "https://www.youtube.com/watch?v=_Z3QKkl1WyM",
      language: "English",
      country: "USA",
      budget: 250000000,
      boxOffice: 859208423,
      awards: ["NAACP Image Award Winner"],
      ageRating: "PG-13",
      status: "now_playing",
      cast: [
        { name: "Letitia Wright", character: "Shuri", order: 1 },
        { name: "Angela Bassett", character: "Queen Ramonda", order: 2 },
        { name: "Tenoch Huerta", character: "Namor", order: 3 },
        { name: "Danai Gurira", character: "Okoye", order: 4 },
      ],
      crew: [
        { name: "Ryan Coogler", job: "Director", department: "Directing" },
        { name: "Ryan Coogler", job: "Writer", department: "Writing" },
      ],
      averageRating: 6.7,
      totalReviews: 0,
    },
    {
      title: "Avatar: The Way of Water",
      genre: ["Action", "Adventure", "Family", "Sci-Fi"],
      duration: 192,
      releaseDate: new Date("2022-12-16"),
      rating: 7.6,
      votes: 456789,
      description:
        "Jake Sully lives with his newfound family formed on the extrasolar moon Pandora. Once a familiar threat returns to finish what was previously started, Jake must work with Neytiri and the army of the Na'vi race to protect their home.",
      image: "https://image.tmdb.org/t/p/w500/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg",
      backdropImage:
        "https://image.tmdb.org/t/p/w1280/s16H6tpK2utvwDtzZ8Qy4qm5Emw.jpg",
      trailer: "https://www.youtube.com/watch?v=d9MyW72ELq0",
      language: "English",
      country: "USA",
      budget: 460000000,
      boxOffice: 2320250281,
      awards: ["Academy Award Nominee"],
      ageRating: "PG-13",
      status: "now_playing",
      cast: [
        { name: "Sam Worthington", character: "Jake Sully", order: 1 },
        { name: "Zoe Saldaña", character: "Neytiri", order: 2 },
        { name: "Sigourney Weaver", character: "Kiri", order: 3 },
        { name: "Stephen Lang", character: "Colonel Miles Quatrich", order: 4 },
      ],
      crew: [
        { name: "James Cameron", job: "Director", department: "Directing" },
        { name: "James Cameron", job: "Writer", department: "Writing" },
      ],
      averageRating: 7.6,
      totalReviews: 0,
    },
    {
      title: "Oppenheimer",
      genre: ["Biography", "Drama", "History"],
      duration: 180,
      releaseDate: new Date("2023-07-21"),
      rating: 8.3,
      votes: 567890,
      description:
        "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.",
      image: "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
      backdropImage:
        "https://image.tmdb.org/t/p/w1280/rLb2cwF3Pazuxaj0sRXQ037tGI1.jpg",
      trailer: "https://www.youtube.com/watch?v=uYPbbksJxIg",
      language: "English",
      country: "USA",
      budget: 100000000,
      boxOffice: 952000000,
      awards: ["Academy Award Winner", "Golden Globe Winner"],
      ageRating: "R",
      status: "now_playing",
      cast: [
        {
          name: "Cillian Murphy",
          character: "J. Robert Oppenheimer",
          order: 1,
        },
        { name: "Emily Blunt", character: "Katherine Oppenheimer", order: 2 },
        { name: "Matt Damon", character: "Leslie Groves", order: 3 },
        { name: "Robert Downey Jr.", character: "Lewis Strauss", order: 4 },
      ],
      crew: [
        { name: "Christopher Nolan", job: "Director", department: "Directing" },
        { name: "Christopher Nolan", job: "Writer", department: "Writing" },
      ],
      averageRating: 8.3,
      totalReviews: 0,
    },
    {
      title: "Barbie",
      genre: ["Adventure", "Comedy", "Fantasy"],
      duration: 114,
      releaseDate: new Date("2023-07-21"),
      rating: 6.9,
      votes: 678901,
      description:
        "Barbie and Ken are having the time of their lives in the colorful and seemingly perfect world of Barbie Land. However, when they get a chance to go to the real world, they soon discover the joys and perils of living among humans.",
      image: "https://image.tmdb.org/t/p/w500/iuFNMS8U5cb6xfzi51Dbkovj7vM.jpg",
      backdropImage:
        "https://image.tmdb.org/t/p/w1280/nHf61UzkfFno5X1ofIhugCPus2R.jpg",
      trailer: "https://www.youtube.com/watch?v=pBk4NYhWNMM",
      language: "English",
      country: "USA",
      budget: 145000000,
      boxOffice: 1446000000,
      awards: ["Golden Globe Winner"],
      ageRating: "PG-13",
      status: "now_playing",
      cast: [
        { name: "Margot Robbie", character: "Barbie", order: 1 },
        { name: "Ryan Gosling", character: "Ken", order: 2 },
        { name: "America Ferrera", character: "Gloria", order: 3 },
        { name: "Kate McKinnon", character: "Weird Barbie", order: 4 },
      ],
      crew: [
        { name: "Greta Gerwig", job: "Director", department: "Directing" },
        { name: "Greta Gerwig", job: "Writer", department: "Writing" },
      ],
      averageRating: 6.9,
      totalReviews: 0,
    },
  ];

  const allMovies = [...movies, ...additionalMovies];
  const createdMovies = await Movie.insertMany(allMovies);
  console.log(`${createdMovies.length} movies created`);
  return createdMovies;
};

// Seed comprehensive theater data
const seedTheaters = async (users) => {
  const theaters = [
    {
      name: "Regal Cinemas Times Square",
      location: {
        address: "247 W 42nd St",
        city: "New York",
        state: "NY",
        zipCode: "10036",
        coordinates: { latitude: 40.7589, longitude: -73.9851 },
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
      pricing: { standard: 15.99, premium: 22.99, imax: 28.99, fourDX: 32.99 },
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
        coordinates: { latitude: 40.758, longitude: -73.9855 },
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
      pricing: { standard: 16.99, premium: 24.99, imax: 29.99, fourDX: 34.99 },
      operatingHours: {
        weekdays: { open: "09:30", close: "24:00" },
        weekends: { open: "08:30", close: "01:00" },
      },
      manager: users.find((u) => u.role === "admin")?._id,
      rating: 4.3,
      totalReviews: 2156,
    },
  ];

  // Add more theaters in different cities
  const additionalTheaters = [
    {
      name: "TCL Chinese Theatre",
      location: {
        address: "6925 Hollywood Blvd",
        city: "Los Angeles",
        state: "CA",
        zipCode: "90028",
        coordinates: { latitude: 34.1022, longitude: -118.3406 },
      },
      contact: {
        phone: "+1-323-461-3331",
        email: "info@tclchinesetheatres.com",
        website: "https://www.tclchinesetheatres.com",
      },
      totalSeats: 932,
      availableSeats: generateSeatLayout(14, 18),
      seatLayout: {
        rows: 14,
        seatsPerRow: 18,
        premiumRows: ["A", "B", "C", "D"],
        wheelchairAccessible: ["L15", "L16", "M15", "M16"],
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
          totalSeats: 932,
          seatLayout: { rows: 14, seatsPerRow: 18 },
        },
      ],
      pricing: { standard: 18.99, premium: 26.99, imax: 32.99, fourDX: 0 },
      operatingHours: {
        weekdays: { open: "11:00", close: "23:00" },
        weekends: { open: "10:00", close: "24:00" },
      },
      manager: users.find((u) => u.role === "theater_manager")?._id,
      rating: 4.7,
      totalReviews: 3421,
    },
    {
      name: "Cinemark Century Theaters",
      location: {
        address: "1000 Van Ness Ave",
        city: "San Francisco",
        state: "CA",
        zipCode: "94109",
        coordinates: { latitude: 37.7849, longitude: -122.4194 },
      },
      contact: {
        phone: "+1-415-776-2388",
        email: "vanness@cinemark.com",
        website: "https://www.cinemark.com",
      },
      totalSeats: 1800,
      availableSeats: generateSeatLayout(12, 16),
      seatLayout: {
        rows: 12,
        seatsPerRow: 16,
        premiumRows: ["A", "B"],
        wheelchairAccessible: ["K14", "K15", "L14", "L15"],
      },
      amenities: [
        "4DX",
        "Dolby Atmos",
        "Recliner Seats",
        "Food Court",
        "Parking",
        "AC",
      ],
      screens: [
        {
          screenNumber: 1,
          screenType: "4DX",
          totalSeats: 200,
          seatLayout: { rows: 10, seatsPerRow: 20 },
        },
        {
          screenNumber: 2,
          screenType: "Premium",
          totalSeats: 180,
          seatLayout: { rows: 12, seatsPerRow: 15 },
        },
        {
          screenNumber: 3,
          screenType: "Standard",
          totalSeats: 150,
          seatLayout: { rows: 10, seatsPerRow: 15 },
        },
      ],
      pricing: { standard: 17.99, premium: 25.99, imax: 0, fourDX: 33.99 },
      operatingHours: {
        weekdays: { open: "10:30", close: "23:30" },
        weekends: { open: "09:30", close: "24:30" },
      },
      manager: users.find((u) => u.role === "admin")?._id,
      rating: 4.2,
      totalReviews: 1876,
    },
    {
      name: "Landmark Theatres",
      location: {
        address: "1200 Market St",
        city: "Seattle",
        state: "WA",
        zipCode: "98101",
        coordinates: { latitude: 47.6062, longitude: -122.3321 },
      },
      contact: {
        phone: "+1-206-781-5755",
        email: "seattle@landmarktheatres.com",
        website: "https://www.landmarktheatres.com",
      },
      totalSeats: 1400,
      availableSeats: generateSeatLayout(10, 14),
      seatLayout: {
        rows: 10,
        seatsPerRow: 14,
        premiumRows: ["A", "B", "C"],
        wheelchairAccessible: ["H12", "H13", "I12", "I13"],
      },
      amenities: [
        "Recliner Seats",
        "Dolby Atmos",
        "Food Court",
        "Parking",
        "AC",
        "Wheelchair Access",
      ],
      screens: [
        {
          screenNumber: 1,
          screenType: "Premium",
          totalSeats: 200,
          seatLayout: { rows: 10, seatsPerRow: 20 },
        },
        {
          screenNumber: 2,
          screenType: "Standard",
          totalSeats: 140,
          seatLayout: { rows: 10, seatsPerRow: 14 },
        },
        {
          screenNumber: 3,
          screenType: "Standard",
          totalSeats: 140,
          seatLayout: { rows: 10, seatsPerRow: 14 },
        },
      ],
      pricing: { standard: 14.99, premium: 21.99, imax: 0, fourDX: 0 },
      operatingHours: {
        weekdays: { open: "11:00", close: "22:30" },
        weekends: { open: "10:00", close: "23:30" },
      },
      manager: users.find((u) => u.role === "theater_manager")?._id,
      rating: 4.4,
      totalReviews: 987,
    },
    {
      name: "Alamo Drafthouse Cinema",
      location: {
        address: "1120 S Lamar Blvd",
        city: "Austin",
        state: "TX",
        zipCode: "78704",
        coordinates: { latitude: 30.2672, longitude: -97.7431 },
      },
      contact: {
        phone: "+1-512-476-1320",
        email: "austin@drafthouse.com",
        website: "https://drafthouse.com",
      },
      totalSeats: 800,
      availableSeats: generateSeatLayout(8, 12),
      seatLayout: {
        rows: 8,
        seatsPerRow: 12,
        premiumRows: ["A", "B"],
        wheelchairAccessible: ["G10", "G11", "H10", "H11"],
      },
      amenities: [
        "Food Court",
        "Recliner Seats",
        "Dolby Atmos",
        "Parking",
        "AC",
      ],
      screens: [
        {
          screenNumber: 1,
          screenType: "Standard",
          totalSeats: 96,
          seatLayout: { rows: 8, seatsPerRow: 12 },
        },
        {
          screenNumber: 2,
          screenType: "Standard",
          totalSeats: 96,
          seatLayout: { rows: 8, seatsPerRow: 12 },
        },
        {
          screenNumber: 3,
          screenType: "Premium",
          totalSeats: 120,
          seatLayout: { rows: 10, seatsPerRow: 12 },
        },
      ],
      pricing: { standard: 13.99, premium: 19.99, imax: 0, fourDX: 0 },
      operatingHours: {
        weekdays: { open: "12:00", close: "23:00" },
        weekends: { open: "11:00", close: "24:00" },
      },
      manager: users.find((u) => u.role === "admin")?._id,
      rating: 4.6,
      totalReviews: 2341,
    },
  ];

  const allTheaters = [...theaters, ...additionalTheaters];
  const createdTheaters = await Theater.insertMany(allTheaters);
  console.log(`${createdTheaters.length} theaters created`);
  return createdTheaters;
};

// Seed Movie Showtimes with realistic scheduling
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
        const selectedTimes = getRandomElements(times, numShowtimes);

        for (const time of selectedTimes) {
          // Choose format based on theater capabilities
          let availableFormats = ["2D"];
          if (theater.amenities.includes("IMAX")) availableFormats.push("IMAX");
          if (theater.amenities.includes("4DX")) availableFormats.push("4DX");
          availableFormats.push("3D");

          const format =
            availableFormats[
              Math.floor(Math.random() * availableFormats.length)
            ];

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

// Import additional seeding functions
const {
  seedBookings,
  seedPayments,
  seedReviews,
} = require("./seedInterconnectedDataPart2");

// Seed notifications based on user activities
const seedNotifications = async (users, bookings, movies, payments) => {
  const notifications = [];
  const notificationTypes = [
    "booking_confirmation",
    "payment_success",
    "show_reminder",
    "new_movie_release",
    "loyalty_points_earned",
    "promotional_offer",
  ];

  // Create booking confirmation notifications
  for (const booking of bookings.slice(0, 100)) {
    // Limit to first 100 bookings
    const user = users.find((u) => u._id.equals(booking.user));
    const movie = movies.find((m) => m._id.equals(booking.movie));

    if (!user || !movie) continue;

    const notification = {
      recipient: user._id,
      type: "booking_confirmation",
      title: "Booking Confirmed!",
      message: `Your booking for "${movie.title}" has been confirmed. Booking reference: ${booking.bookingReference}`,
      relatedBooking: booking._id,
      relatedMovie: movie._id,
      channels: {
        email: {
          enabled: user.preferences?.notifications?.email || true,
          sent: Math.random() < 0.95,
          deliveryStatus: Math.random() < 0.9 ? "delivered" : "sent",
        },
        sms: {
          enabled: user.preferences?.notifications?.sms || false,
          sent: Math.random() < 0.8,
          deliveryStatus: Math.random() < 0.85 ? "delivered" : "sent",
        },
        push: {
          enabled: user.preferences?.notifications?.push || true,
          sent: Math.random() < 0.9,
          deliveryStatus: Math.random() < 0.95 ? "delivered" : "sent",
        },
        inApp: {
          enabled: true,
          read: Math.random() < 0.7,
        },
      },
      priority: "high",
      status: "delivered",
      actionButtons: [
        {
          text: "View Booking",
          url: `/bookings/${booking._id}`,
          action: "view_booking",
          style: "primary",
        },
      ],
      isRead: Math.random() < 0.8,
      readAt: Math.random() < 0.8 ? new Date() : null,
    };

    notifications.push(notification);
  }

  // Create payment success notifications
  for (const payment of payments.slice(0, 80)) {
    // Limit to first 80 payments
    const booking = bookings.find((b) => b._id.equals(payment.booking));
    if (!booking) continue;

    const user = users.find((u) => u._id.equals(booking.user));
    if (!user) continue;

    const notification = {
      recipient: user._id,
      type: "payment_success",
      title: "Payment Successful",
      message: `Your payment of $${payment.amount} has been processed successfully.`,
      relatedBooking: booking._id,
      relatedPayment: payment._id,
      channels: {
        email: {
          enabled: true,
          sent: true,
          deliveryStatus: "delivered",
        },
        inApp: {
          enabled: true,
          read: Math.random() < 0.9,
        },
      },
      priority: "normal",
      status: "delivered",
      isRead: Math.random() < 0.85,
    };

    notifications.push(notification);
  }

  // Create promotional notifications
  for (const user of users) {
    if (Math.random() < 0.6) {
      // 60% of users get promotional notifications
      const notification = {
        recipient: user._id,
        type: "promotional_offer",
        title: "Special Offer Just for You!",
        message: "Get 20% off your next booking. Use code SAVE20 at checkout.",
        channels: {
          email: {
            enabled: user.preferences?.notifications?.email || true,
            sent: Math.random() < 0.8,
            deliveryStatus: "delivered",
          },
          inApp: {
            enabled: true,
            read: Math.random() < 0.4,
          },
        },
        priority: "low",
        status: "delivered",
        actionButtons: [
          {
            text: "Book Now",
            url: "/movies",
            action: "browse_movies",
            style: "primary",
          },
        ],
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Expires in 7 days
        isRead: Math.random() < 0.4,
      };

      notifications.push(notification);
    }
  }

  const createdNotifications = await Notification.insertMany(notifications);
  console.log(`${createdNotifications.length} notifications created`);
  return createdNotifications;
};

// Main seeding function
const seedInterconnectedData = async () => {
  try {
    await connectDB();
    await clearDatabase();

    console.log("Starting comprehensive interconnected data seeding...");

    // Seed base data
    const users = await seedUsers();
    const movies = await seedMovies();
    const theaters = await seedTheaters(users);
    const showtimes = await seedMovieShowtimes(movies, theaters);

    // Seed interconnected data
    const bookings = await seedBookings(users, movies, theaters, showtimes);
    const payments = await seedPayments(bookings, users);
    const reviews = await seedReviews(users, movies, theaters, bookings);
    const notifications = await seedNotifications(
      users,
      bookings,
      movies,
      payments
    );

    console.log("\n=== SEEDING SUMMARY ===");
    console.log(`✅ ${users.length} users created`);
    console.log(`✅ ${movies.length} movies created`);
    console.log(`✅ ${theaters.length} theaters created`);
    console.log(`✅ ${showtimes.length} movie showtimes created`);
    console.log(`✅ ${bookings.length} bookings created`);
    console.log(`✅ ${payments.length} payments created`);
    console.log(`✅ ${reviews.length} reviews created`);
    console.log(`✅ ${notifications.length} notifications created`);
    console.log("======================\n");

    console.log(
      "🎉 Comprehensive interconnected data seeding completed successfully!"
    );
    console.log(
      "Your movie ticket booking system now has realistic, well-connected data!"
    );

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding interconnected data:", error);
    process.exit(1);
  }
};

// Run seeding
if (require.main === module) {
  seedInterconnectedData();
}

module.exports = { seedInterconnectedData };
