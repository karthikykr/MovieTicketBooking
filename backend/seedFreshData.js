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
        isBooked: false,
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
      password: await bcrypt.hash("password123", 10),
      role: "user",
      phone: "+1-555-0101",
      dateOfBirth: new Date("1990-05-15"),
      gender: "male",
      address: {
        street: "123 Main St",
        city: "New York",
        state: "NY",
        zipCode: "10001",
      },
    },
    {
      name: "Jane Smith",
      email: "jane@example.com",
      password: await bcrypt.hash("password123", 10),
      role: "user",
      phone: "+1-555-0102",
      dateOfBirth: new Date("1985-03-20"),
      gender: "female",
      address: {
        street: "456 Oak Ave",
        city: "Los Angeles",
        state: "CA",
        zipCode: "90210",
      },
    },
    {
      name: "Admin User",
      email: "admin@moviebooking.com",
      password: await bcrypt.hash("admin123", 10),
      role: "admin",
      phone: "+1-555-0000",
      dateOfBirth: new Date("1980-01-01"),
      gender: "male",
      address: {
        street: "789 Admin Blvd",
        city: "Chicago",
        state: "IL",
        zipCode: "60601",
      },
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
      description: "After the devastating events of Avengers: Infinity War, the universe is in ruins. With the help of remaining allies, the Avengers assemble once more in order to reverse Thanos' actions and restore balance to the universe.",
      status: "now_playing",
      posterUrl: "https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg",
      backdropUrl: "https://image.tmdb.org/t/p/w1280/7RyHsO4yDXtBv1zUU3mTpHeQ0d5.jpg",
      cast: [
        { name: "Robert Downey Jr.", character: "Tony Stark / Iron Man", order: 0 },
        { name: "Chris Evans", character: "Steve Rogers / Captain America", order: 1 },
        { name: "Mark Ruffalo", character: "Bruce Banner / Hulk", order: 2 },
      ],
      crew: [
        { name: "Anthony Russo", job: "Director", department: "Directing" },
        { name: "Joe Russo", job: "Director", department: "Directing" },
        { name: "Christopher Markus", job: "Writer", department: "Writing" },
        { name: "Stephen McFeely", job: "Writer", department: "Writing" },
      ],
      language: "English",
      country: "USA",
    },
    {
      title: "Spider-Man: No Way Home",
      genre: ["Action", "Adventure", "Sci-Fi"],
      duration: 148,
      releaseDate: new Date("2021-12-17"),
      rating: 8.2,
      description: "Peter Parker's secret identity is revealed to the entire world. Desperate for help, Peter turns to Doctor Strange to make the world forget that he is Spider-Man. The spell goes horribly wrong and shatters the multiverse.",
      status: "now_playing",
      posterUrl: "https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg",
      backdropUrl: "https://image.tmdb.org/t/p/w1280/14QbnygCuTO0vl7CAFmPf1fgZfV.jpg",
      cast: [
        { name: "Tom Holland", character: "Peter Parker / Spider-Man", order: 0 },
        { name: "Zendaya", character: "MJ", order: 1 },
        { name: "Benedict Cumberbatch", character: "Doctor Strange", order: 2 },
      ],
      crew: [
        { name: "Jon Watts", job: "Director", department: "Directing" },
      ],
      language: "English",
      country: "USA",
    },
    {
      title: "The Dark Knight",
      genre: ["Action", "Crime", "Drama"],
      duration: 152,
      releaseDate: new Date("2008-07-18"),
      rating: 9.0,
      description: "Batman raises the stakes in his war on crime. With the help of Lt. Jim Gordon and District Attorney Harvey Dent, Batman sets out to dismantle the remaining criminal organizations that plague the streets.",
      status: "now_playing",
      posterUrl: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
      backdropUrl: "https://image.tmdb.org/t/p/w1280/hqkIcbrOHL86UncnHIsHVcVmzue.jpg",
      cast: [
        { name: "Christian Bale", character: "Bruce Wayne / Batman", order: 0 },
        { name: "Heath Ledger", character: "The Joker", order: 1 },
        { name: "Aaron Eckhart", character: "Harvey Dent / Two-Face", order: 2 },
      ],
      crew: [
        { name: "Christopher Nolan", job: "Director", department: "Directing" },
        { name: "Christopher Nolan", job: "Writer", department: "Writing" },
        { name: "Jonathan Nolan", job: "Writer", department: "Writing" },
      ],
      language: "English",
      country: "USA",
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
      },
      totalSeats: 1200,
      availableSeats: generateSeatLayout(10, 12),
      amenities: ["IMAX", "4DX", "Dolby Atmos"],
      operatingHours: {
        weekdays: { open: "09:30", close: "24:00" },
        weekends: { open: "08:30", close: "01:00" },
      },
      manager: users.find((u) => u.role === "admin")?._id,
      rating: 4.3,
      totalReviews: 2156,
    },
    {
      name: "AMC Lincoln Square",
      location: {
        address: "1998 Broadway",
        city: "New York",
        state: "NY",
        zipCode: "10023",
      },
      totalSeats: 1000,
      availableSeats: generateSeatLayout(8, 12),
      amenities: ["IMAX", "Dolby Atmos"],
      operatingHours: {
        weekdays: { open: "10:00", close: "23:00" },
        weekends: { open: "09:00", close: "24:00" },
      },
      manager: users.find((u) => u.role === "admin")?._id,
      rating: 4.1,
      totalReviews: 1823,
    },
    {
      name: "Cinemark Hollywood",
      location: {
        address: "6301 Hollywood Blvd",
        city: "Los Angeles",
        state: "CA",
        zipCode: "90028",
      },
      totalSeats: 1500,
      availableSeats: generateSeatLayout(12, 12),
      amenities: ["4DX", "IMAX"],
      operatingHours: {
        weekdays: { open: "09:00", close: "24:00" },
        weekends: { open: "08:00", close: "01:00" },
      },
      manager: users.find((u) => u.role === "admin")?._id,
      rating: 4.5,
      totalReviews: 3124,
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

// Seed Bookings
const seedBookings = async (users, movies, theaters, showtimes) => {
  const bookings = [];
  const paymentMethods = ["credit_card", "debit_card", "paypal", "wallet"];
  const bookingStatuses = ["confirmed", "completed", "cancelled"];

  // Create 100 bookings
  for (let i = 0; i < 100; i++) {
    const user = users[Math.floor(Math.random() * users.length)];
    const showtime = showtimes[Math.floor(Math.random() * showtimes.length)];
    const movie = movies.find((m) => m._id.equals(showtime.movieId));
    const theater = theaters.find((t) => t._id.equals(showtime.theaterId));

    if (!movie || !theater) continue;

    // Select a random showtime slot
    const showtimeSlot = showtime.showtimes[Math.floor(Math.random() * showtime.showtimes.length)];

    // Select 1-4 seats
    const numSeats = Math.floor(Math.random() * 4) + 1;
    const availableSeats = showtimeSlot.seats.filter((seat) => !seat.isBooked);

    if (availableSeats.length < numSeats) continue;

    const selectedSeats = availableSeats.slice(0, numSeats).map((seat) => ({
      seatNumber: seat.seatNumber,
      seatType: Math.random() < 0.2 ? "premium" : "standard",
      price: showtimeSlot.price + (Math.random() < 0.2 ? 5 : 0),
    }));

    const totalPrice = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);
    const taxes = Math.round(totalPrice * 0.08 * 100) / 100;
    const discount = Math.random() < 0.1 ? Math.round(totalPrice * 0.1 * 100) / 100 : 0;
    const finalAmount = Math.round((totalPrice + taxes - discount) * 100) / 100;

    const bookingDate = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000); // Random date in last 30 days

    const booking = {
      user: user._id,
      movie: movie._id,
      theater: theater._id,
      showtime: showtime._id,
      seats: selectedSeats,
      bookingDate: bookingDate,
      showDate: showtime.date,
      showTime: showtimeSlot.time,
      totalPrice: totalPrice,
      taxes: taxes,
      discount: discount,
      finalAmount: finalAmount,
      bookingStatus: bookingStatuses[Math.floor(Math.random() * bookingStatuses.length)],
      paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
      bookingReference: "BK" + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase(),
    };

    bookings.push(booking);
  }

  const createdBookings = await Booking.insertMany(bookings);
  console.log(`${createdBookings.length} bookings created`);
  return createdBookings;
};

// Seed Payments
const seedPayments = async (bookings, users) => {
  const payments = [];
  const paymentStatuses = ["completed", "pending", "failed"];

  for (const booking of bookings) {
    const user = users.find((u) => u._id.equals(booking.user));
    if (!user) continue;

    const payment = {
      booking: booking._id,
      user: user._id,
      amount: booking.finalAmount,
      paymentMethod: booking.paymentMethod,
      status: paymentStatuses[Math.floor(Math.random() * paymentStatuses.length)],
      transactionId: `TXN${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      paymentDate: booking.bookingDate,
      breakdown: {
        subtotal: booking.totalPrice,
        taxes: booking.taxes,
        discount: booking.discount,
        total: booking.finalAmount,
      },
    };

    payments.push(payment);
  }

  const createdPayments = await Payment.insertMany(payments);
  console.log(`${createdPayments.length} payments created`);
  return createdPayments;
};

// Seed Reviews
const seedReviews = async (users, movies, theaters, bookings) => {
  const reviews = [];
  const reviewTitles = [
    "Amazing Experience!",
    "Great Movie!",
    "Disappointing",
    "Worth Watching",
    "Not My Cup of Tea",
    "Excellent Direction",
    "Good Story",
    "Average Entertainment",
    "Disappointing Compared to Hype",
    "Perfect Blend of Action and Emotion",
  ];
  const reviewComments = [
    "The movie had its moments but overall felt rushed.",
    "Perfect blend of action and emotion. Great character development.",
    "Excellent direction and screenplay. One of the best movies this year.",
    "Not my cup of tea. The pacing was too slow for my liking.",
    "Disappointing compared to the hype. The plot was predictable.",
    "Average entertainment. Nothing special but not bad either.",
    "Good story with some great acting performances.",
    "Amazing special effects and cinematography.",
    "The ending was unexpected and satisfying.",
    "Could have been better with more character development.",
  ];

  for (const booking of bookings) {
    if (Math.random() < 0.7) { // 70% chance of review
      const user = users.find((u) => u._id.equals(booking.user));
      const movie = movies.find((m) => m._id.equals(booking.movie));
      const theater = theaters.find((t) => t._id.equals(booking.theater));

      if (!user || !movie || !theater) continue;

      const rating = Math.floor(Math.random() * 5) + 1; // 1-5 stars
      const review = {
        user: user._id,
        movie: movie._id,
        theater: theater._id,
        rating: rating,
        title: reviewTitles[Math.floor(Math.random() * reviewTitles.length)],
        comment: reviewComments[Math.floor(Math.random() * reviewComments.length)],
        reviewType: "movie",
        isVerifiedPurchase: true,
        booking: booking._id,
        helpfulCount: Math.floor(Math.random() * 20),
        reportCount: Math.random() < 0.05 ? 1 : 0,
        isApproved: true,
        moderationStatus: "approved",
      };

      reviews.push(review);
    }
  }

  const createdReviews = await Review.insertMany(reviews);
  console.log(`${createdReviews.length} reviews created`);
  return createdReviews;
};

// Seed Notifications
const seedNotifications = async (users, bookings, movies, payments) => {
  const notifications = [];

  for (const user of users) {
    // Booking confirmation notification
    const userBookings = bookings.filter((b) => b.user.equals(user._id));
    if (userBookings.length > 0) {
      const booking = userBookings[Math.floor(Math.random() * userBookings.length)];
      const movie = movies.find((m) => m._id.equals(booking.movie));

      const notification = {
        user: user._id,
        title: "Booking Confirmed",
        message: `Your booking for ${movie.title} has been confirmed. Showtime: ${booking.showTime} on ${booking.showDate.toDateString()}`,
        type: "booking",
        priority: "high",
        status: "sent",
        actionButtons: [
          {
            text: "View Booking",
            url: "/bookings",
            action: "view_booking",
            style: "primary",
          },
        ],
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        isRead: Math.random() < 0.4,
      };

      notifications.push(notification);
    }

    // Payment notification
    const userPayments = payments.filter((p) => p.user.equals(user._id));
    if (userPayments.length > 0) {
      const payment = userPayments[Math.floor(Math.random() * userPayments.length)];

      const notification = {
        user: user._id,
        title: "Payment Processed",
        message: `Your payment of $${payment.amount} has been ${payment.status}. Transaction ID: ${payment.transactionId}`,
        type: "payment",
        priority: "medium",
        status: "sent",
        actionButtons: [
          {
            text: "View Receipt",
            url: "/payments",
            action: "view_receipt",
            style: "secondary",
          },
        ],
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        isRead: Math.random() < 0.4,
      };

      notifications.push(notification);
    }

    // Promotional notification
    if (Math.random() < 0.5) {
      const notification = {
        user: user._id,
        title: "New Movies Available",
        message: "Check out the latest movies now playing at our theaters. Book your tickets today!",
        type: "promotion",
        priority: "low",
        status: "sent",
        actionButtons: [
          {
            text: "Browse Movies",
            url: "/movies",
            action: "browse_movies",
            style: "primary",
          },
        ],
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
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
const seedDatabase = async () => {
  try {
    await connectDB();
    await clearDatabase();

    console.log("Starting fresh interconnected data seeding...");

    const users = await seedUsers();
    const movies = await seedMovies();
    const theaters = await seedTheaters(users);
    const showtimes = await seedMovieShowtimes(movies, theaters);
    const bookings = await seedBookings(users, movies, theaters, showtimes);
    const payments = await seedPayments(bookings, users);
    const reviews = await seedReviews(users, movies, theaters, bookings);
    const notifications = await seedNotifications(users, bookings, movies, payments);

    console.log("\n=== SEEDING SUMMARY ===");
    console.log(`✅ ${users.length} users created`);
    console.log(`✅ ${movies.length} movies created`);
    console.log(`✅ ${theaters.length} theaters created`);
    console.log(`✅ ${showtimes.length} movie showtimes created`);
    console.log(`✅ ${bookings.length} bookings created`);
    console.log(`✅ ${payments.length} payments created`);
    console.log(`✅ ${reviews.length} reviews created`);
    console.log(`✅ ${notifications.length} notifications created`);
    console.log("=======================\n");

    console.log("🎉 Fresh interconnected data seeding completed successfully!");
    console.log("Your movie ticket booking system now has realistic, well-connected data!");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding fresh data:", error);
    process.exit(1);
  }
};

// Run seeding if executed directly
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };
