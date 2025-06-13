const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: __dirname + '/.env' });

// Import models
const User = require('./models/userModel');
const Movie = require('./models/movieModel');
const Theater = require('./models/theaterModel');
const MovieShowtime = require('./models/MovieShowtimeModel');
const Booking = require('./models/bookingModel');
const Review = require('./models/reviewModel');
const Payment = require('./models/paymentModel');
const Notification = require('./models/notificationModel');

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

// Generate seats for showtime
const generateShowtimeSeats = (totalSeats) => {
    const seats = [];
    const rowLabels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const seatsPerRow = 12;
    const rows = Math.ceil(totalSeats / seatsPerRow);
    
    for (let i = 0; i < rows; i++) {
        for (let j = 1; j <= seatsPerRow && seats.length < totalSeats; j++) {
            seats.push({
                seatNumber: `${rowLabels[i]}${j}`,
                isBooked: Math.random() < 0.3 // 30% chance of being booked
            });
        }
    }
    return seats;
};

// Seed Movie Showtimes
const seedMovieShowtimes = async (movies, theaters) => {
    const showtimes = [];
    const times = ['10:00 AM', '1:00 PM', '4:00 PM', '7:00 PM', '10:00 PM'];
    const formats = ['2D', '3D', 'IMAX', '4DX'];
    const prices = { '2D': 12.99, '3D': 16.99, 'IMAX': 22.99, '4DX': 26.99 };

    // Create showtimes for next 7 days
    for (let day = 0; day < 7; day++) {
        const showDate = new Date();
        showDate.setDate(showDate.getDate() + day);

        for (const movie of movies) {
            for (const theater of theaters) {
                const movieShowtime = {
                    movieId: movie._id,
                    theaterId: theater._id,
                    date: showDate,
                    showtimes: []
                };

                // Add 3-5 showtimes per day per theater per movie
                const numShowtimes = Math.floor(Math.random() * 3) + 3;
                const selectedTimes = times.slice(0, numShowtimes);

                for (const time of selectedTimes) {
                    const format = formats[Math.floor(Math.random() * formats.length)];
                    movieShowtime.showtimes.push({
                        time: time,
                        format: format,
                        price: prices[format],
                        seats: generateShowtimeSeats(120)
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
    const regularUsers = users.filter(u => u.role === 'user');

    for (let i = 0; i < 50; i++) {
        const user = regularUsers[Math.floor(Math.random() * regularUsers.length)];
        const showtime = showtimes[Math.floor(Math.random() * showtimes.length)];
        const movie = movies.find(m => m._id.equals(showtime.movieId));
        const theater = theaters.find(t => t._id.equals(showtime.theaterId));
        
        // Select random showtime slot
        const showtimeSlot = showtime.showtimes[Math.floor(Math.random() * showtime.showtimes.length)];
        
        // Select 1-4 seats
        const numSeats = Math.floor(Math.random() * 4) + 1;
        const availableSeats = showtimeSlot.seats.filter(s => !s.isBooked);
        const selectedSeats = [];
        
        for (let j = 0; j < Math.min(numSeats, availableSeats.length); j++) {
            const seat = availableSeats[Math.floor(Math.random() * availableSeats.length)];
            selectedSeats.push({
                seatNumber: seat.seatNumber,
                seatType: Math.random() < 0.2 ? 'premium' : 'standard',
                price: showtimeSlot.price
            });
            // Mark seat as booked
            seat.isBooked = true;
        }

        if (selectedSeats.length > 0) {
            const totalPrice = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);
            const taxes = totalPrice * 0.08; // 8% tax
            const finalAmount = totalPrice + taxes;

            const booking = {
                user: user._id,
                movie: movie._id,
                theater: theater._id,
                showtime: showtime._id,
                seats: selectedSeats,
                bookingDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Random date in last 30 days
                showDate: showtime.date,
                showTime: showtimeSlot.time,
                totalPrice: totalPrice,
                taxes: taxes,
                finalAmount: finalAmount,
                bookingStatus: ['confirmed', 'completed', 'cancelled'][Math.floor(Math.random() * 3)],
                paymentStatus: ['completed', 'pending', 'failed'][Math.floor(Math.random() * 3)],
                paymentMethod: ['credit_card', 'debit_card', 'paypal', 'wallet'][Math.floor(Math.random() * 4)],
                transactionId: 'TXN' + Date.now() + Math.random().toString(36).substr(2, 5),
                loyaltyPointsEarned: Math.floor(finalAmount / 10), // 1 point per $10
                isGroupBooking: Math.random() < 0.1 // 10% chance of group booking
            };

            bookings.push(booking);
        }
    }

    const createdBookings = await Booking.insertMany(bookings);
    console.log(`${createdBookings.length} bookings created`);
    return createdBookings;
};

// Seed Reviews
const seedReviews = async (users, movies, theaters, bookings) => {
    const reviews = [];
    const regularUsers = users.filter(u => u.role === 'user');
    
    // Create movie reviews
    for (const movie of movies) {
        const numReviews = Math.floor(Math.random() * 20) + 5; // 5-25 reviews per movie
        
        for (let i = 0; i < numReviews; i++) {
            const user = regularUsers[Math.floor(Math.random() * regularUsers.length)];
            const rating = Math.floor(Math.random() * 10) + 1; // 1-10 rating
            
            const reviewTitles = [
                'Amazing movie!', 'Great experience', 'Loved it!', 'Fantastic!', 'Must watch',
                'Good movie', 'Worth watching', 'Decent film', 'Not bad', 'Average',
                'Disappointing', 'Could be better', 'Not worth it', 'Poor quality', 'Waste of time'
            ];
            
            const reviewComments = [
                'This movie exceeded all my expectations. The acting was superb and the story was engaging.',
                'Great cinematography and excellent performances by the cast. Highly recommended!',
                'A thrilling experience from start to finish. The special effects were amazing.',
                'Good storyline but could have been executed better. Still worth a watch.',
                'The movie was okay but nothing special. Average entertainment.',
                'Disappointing compared to the hype. The plot was predictable.',
                'Not my cup of tea. The pacing was too slow for my liking.',
                'Excellent direction and screenplay. One of the best movies this year.',
                'The movie had its moments but overall felt rushed.',
                'Perfect blend of action and emotion. Great character development.'
            ];

            const review = {
                user: user._id,
                movie: movie._id,
                rating: rating,
                title: reviewTitles[Math.floor(Math.random() * reviewTitles.length)],
                comment: reviewComments[Math.floor(Math.random() * reviewComments.length)],
                reviewType: 'movie',
                isVerifiedPurchase: Math.random() < 0.7, // 70% verified purchases
                totalLikes: Math.floor(Math.random() * 50),
                totalDislikes: Math.floor(Math.random() * 10),
                helpfulCount: Math.floor(Math.random() * 30),
                tags: ['great-acting', 'good-story', 'amazing-effects', 'worth-watching'].slice(0, Math.floor(Math.random() * 3) + 1)
            };

            reviews.push(review);
        }
    }

    const createdReviews = await Review.insertMany(reviews);
    console.log(`${createdReviews.length} reviews created`);
    return createdReviews;
};

// Main function to seed additional data
const seedAdditionalData = async () => {
    try {
        await connectDB();
        
        console.log('Starting additional data seeding...');
        
        // Get existing data
        const users = await User.find();
        const movies = await Movie.find();
        const theaters = await Theater.find();
        
        console.log(`Found ${users.length} users, ${movies.length} movies, ${theaters.length} theaters`);
        
        // Seed additional data
        const showtimes = await seedMovieShowtimes(movies, theaters);
        const bookings = await seedBookings(users, movies, theaters, showtimes);
        const reviews = await seedReviews(users, movies, theaters, bookings);
        
        console.log('Additional data seeding completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding additional data:', error);
        process.exit(1);
    }
};

// Run seeding
if (require.main === module) {
    seedAdditionalData();
}

module.exports = { seedAdditionalData };
