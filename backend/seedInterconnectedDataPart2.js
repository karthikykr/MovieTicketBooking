// Import required models
const Booking = require("./models/bookingModel");
const Payment = require("./models/paymentModel");
const Review = require("./models/reviewModel");

// Seed realistic bookings with proper interconnections
const seedBookings = async (users, movies, theaters, showtimes) => {
  const bookings = [];
  const paymentMethods = ["credit_card", "debit_card", "paypal", "wallet"];
  const bookingStatuses = ["confirmed", "completed", "cancelled"];
  const paymentStatuses = ["completed", "pending", "failed"];

  // Create 200-300 bookings
  for (let i = 0; i < 250; i++) {
    const user = users[Math.floor(Math.random() * users.length)];
    const showtime = showtimes[Math.floor(Math.random() * showtimes.length)];
    const movie = movies.find((m) => m._id.equals(showtime.movieId));
    const theater = theaters.find((t) => t._id.equals(showtime.theaterId));

    if (!movie || !theater) continue;

    // Select a random showtime slot
    const showtimeSlot =
      showtime.showtimes[Math.floor(Math.random() * showtime.showtimes.length)];

    // Select 1-4 seats
    const numSeats = Math.floor(Math.random() * 4) + 1;
    const availableSeats = showtimeSlot.seats.filter((seat) => !seat.isBooked);

    if (availableSeats.length < numSeats) continue;

    const selectedSeats = getRandomElements(availableSeats, numSeats).map(
      (seat) => ({
        seatNumber: seat.seatNumber,
        seatType: Math.random() < 0.2 ? "premium" : "standard",
        price: showtimeSlot.price + (Math.random() < 0.2 ? 5 : 0), // Premium seats cost $5 more
      })
    );

    const totalPrice = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);
    const taxes = Math.round(totalPrice * 0.08 * 100) / 100; // 8% tax
    const discount =
      Math.random() < 0.1 ? Math.round(totalPrice * 0.1 * 100) / 100 : 0; // 10% chance of 10% discount
    const finalAmount = Math.round((totalPrice + taxes - discount) * 100) / 100;

    const bookingDate = getRandomDate(
      new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
      new Date() // now
    );

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
      bookingStatus:
        bookingStatuses[Math.floor(Math.random() * bookingStatuses.length)],
      paymentStatus:
        paymentStatuses[Math.floor(Math.random() * paymentStatuses.length)],
      paymentMethod:
        paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
      transactionId:
        "TXN" + Date.now() + Math.random().toString(36).substr(2, 5),
      bookingReference:
        "BK" +
        Date.now() +
        Math.random().toString(36).substr(2, 5).toUpperCase(),
      loyaltyPointsEarned: Math.floor(finalAmount / 10), // 1 point per $10
      loyaltyPointsUsed:
        Math.random() < 0.3 ? Math.floor(Math.random() * 100) : 0,
      specialRequests:
        Math.random() < 0.1 ? "Wheelchair accessible seating" : "",
      emailSent: Math.random() < 0.9, // 90% chance email was sent
      smsSent: Math.random() < 0.7, // 70% chance SMS was sent
    };

    // Mark selected seats as booked
    selectedSeats.forEach((selectedSeat) => {
      const seat = showtimeSlot.seats.find(
        (s) => s.seatNumber === selectedSeat.seatNumber
      );
      if (seat) seat.isBooked = true;
    });

    bookings.push(booking);
  }

  const createdBookings = await Booking.insertMany(bookings);
  console.log(`${createdBookings.length} bookings created`);
  return createdBookings;
};

// Seed payment records for bookings
const seedPayments = async (bookings, users) => {
  const payments = [];
  const paymentProviders = ["stripe", "paypal", "razorpay"];
  const currencies = ["USD"];
  const cardBrands = ["visa", "mastercard", "amex"];

  for (const booking of bookings) {
    if (
      booking.paymentStatus === "completed" ||
      booking.paymentStatus === "pending"
    ) {
      const user = users.find((u) => u._id.equals(booking.user));

      const payment = {
        booking: booking._id,
        user: booking.user,
        amount: booking.finalAmount,
        currency: currencies[Math.floor(Math.random() * currencies.length)],
        paymentMethod: booking.paymentMethod,
        paymentProvider:
          paymentProviders[Math.floor(Math.random() * paymentProviders.length)],
        transactionId: booking.transactionId,
        providerTransactionId: "PI_" + Math.random().toString(36).substr(2, 15),
        paymentStatus: booking.paymentStatus,
        paymentDate: booking.bookingDate,

        paymentDetails: {
          cardLast4: Math.floor(Math.random() * 9999)
            .toString()
            .padStart(4, "0"),
          cardBrand: cardBrands[Math.floor(Math.random() * cardBrands.length)],
          cardType: Math.random() < 0.7 ? "credit" : "debit",
          expiryMonth: Math.floor(Math.random() * 12) + 1,
          expiryYear:
            new Date().getFullYear() + Math.floor(Math.random() * 5) + 1,
          billingAddress: user?.address || {
            street: "123 Main St",
            city: "Default City",
            state: "NY",
            zipCode: "10001",
            country: "USA",
          },
        },

        breakdown: {
          subtotal: booking.totalPrice,
          taxes: booking.taxes,
          serviceFee: 1.5,
          discount: booking.discount,
          loyaltyPointsDiscount: 0,
          total: booking.finalAmount,
        },

        fees: {
          processingFee: Math.round(booking.finalAmount * 0.029 * 100) / 100, // 2.9% processing fee
          platformFee: 1.5,
          taxes: booking.taxes,
        },

        processingFee: Math.round(booking.finalAmount * 0.029 * 100) / 100,
        netAmount:
          Math.round(
            (booking.finalAmount - booking.finalAmount * 0.029 - 1.5) * 100
          ) / 100,

        receiptSent: Math.random() < 0.95, // 95% chance receipt was sent
        receiptEmail: user?.email || "user@example.com",

        riskScore: Math.floor(Math.random() * 30), // Low risk scores (0-30)
        fraudFlags: Math.random() < 0.05 ? ["unusual_location"] : [], // 5% chance of fraud flag

        webhookStatus: "processed",
        webhookAttempts: 1,

        notes:
          Math.random() < 0.1 ? "Customer requested receipt via email" : "",
      };

      payments.push(payment);
    }
  }

  const createdPayments = await Payment.insertMany(payments);
  console.log(`${createdPayments.length} payments created`);
  return createdPayments;
};

// Seed reviews based on completed bookings
const seedReviews = async (users, movies, theaters, bookings) => {
  const reviews = [];
  const reviewTitles = [
    "Amazing experience!",
    "Great movie, great theater",
    "Could be better",
    "Fantastic sound quality",
    "Comfortable seating",
    "Poor service",
    "Excellent picture quality",
    "Worth the price",
    "Disappointing experience",
    "Highly recommend!",
  ];

  const reviewComments = [
    "The movie was absolutely fantastic and the theater provided an excellent viewing experience.",
    "Great sound quality and comfortable seating. Will definitely come back!",
    "The movie was good but the theater could use some improvements in cleanliness.",
    "Amazing IMAX experience! The picture quality was crystal clear.",
    "Staff was friendly and helpful. The concessions were reasonably priced.",
    "The seats were uncomfortable and the sound was too loud.",
    "Perfect date night venue. Loved the premium seating options.",
    "Good value for money. The theater was clean and well-maintained.",
    "The movie was disappointing but the theater experience was good.",
    "Excellent customer service and great amenities. Highly recommended!",
  ];

  // Create reviews for 60% of completed bookings
  const completedBookings = bookings.filter(
    (b) => b.bookingStatus === "completed"
  );
  const reviewableBookings = getRandomElements(
    completedBookings,
    Math.floor(completedBookings.length * 0.6)
  );

  // Track user-movie combinations to avoid duplicates
  const userMovieCombinations = new Set();

  for (const booking of reviewableBookings) {
    const user = users.find((u) => u._id.equals(booking.user));
    const movie = movies.find((m) => m._id.equals(booking.movie));
    const theater = theaters.find((t) => t._id.equals(booking.theater));

    if (!user || !movie || !theater) continue;

    // Check if this user has already reviewed this movie
    const userMovieKey = `${user._id}-${movie._id}`;
    if (userMovieCombinations.has(userMovieKey)) continue;

    userMovieCombinations.add(userMovieKey);

    // Movie review
    const movieReview = {
      user: user._id,
      movie: movie._id,
      theater: theater._id,
      rating: Math.floor(Math.random() * 4) + 7, // Rating between 7-10 for positive bias
      title: reviewTitles[Math.floor(Math.random() * reviewTitles.length)],
      comment:
        reviewComments[Math.floor(Math.random() * reviewComments.length)],
      reviewType: "movie",
      isVerifiedPurchase: true,
      booking: booking._id,
      likes: getRandomElements(users, Math.floor(Math.random() * 5)).map(
        (u) => u._id
      ),
      helpfulCount: Math.floor(Math.random() * 20),
      reportCount: Math.random() < 0.05 ? 1 : 0, // 5% chance of being reported
      isApproved: true,
      moderationStatus: "approved",
    };

    reviews.push(movieReview);

    // 30% chance of also reviewing the theater
    if (Math.random() < 0.3) {
      const theaterReview = {
        user: user._id,
        movie: movie._id,
        theater: theater._id,
        rating: Math.floor(Math.random() * 3) + 7, // Rating between 7-9 for theaters
        title: "Theater Experience",
        comment:
          "The theater facilities were " +
          (Math.random() < 0.8 ? "excellent" : "adequate") +
          ". " +
          reviewComments[Math.floor(Math.random() * reviewComments.length)],
        reviewType: "theater",
        isVerifiedPurchase: true,
        booking: booking._id,
        likes: getRandomElements(users, Math.floor(Math.random() * 3)).map(
          (u) => u._id
        ),
        helpfulCount: Math.floor(Math.random() * 10),
        reportCount: 0,
        isApproved: true,
        moderationStatus: "approved",
      };

      reviews.push(theaterReview);
    }
  }

  try {
    const createdReviews = await Review.insertMany(reviews);
    console.log(`${createdReviews.length} reviews created`);
    return createdReviews;
  } catch (error) {
    // Handle any remaining duplicate key errors gracefully
    console.log(
      `${
        reviews.length - (error.writeErrors?.length || 0)
      } reviews created (some duplicates skipped)`
    );
    return reviews.slice(0, reviews.length - (error.writeErrors?.length || 0));
  }
};

// Utility function to get random elements from array (defined here for this file)
const getRandomElements = (arr, count) => {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// Utility function to generate random date within range (defined here for this file)
const getRandomDate = (start, end) => {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
};

module.exports = {
  seedBookings,
  seedPayments,
  seedReviews,
  getRandomElements,
  getRandomDate,
};
