const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    },
    movie: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Movie", 
        required: true 
    },
    theater: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Theater" 
    },
    rating: { 
        type: Number, 
        required: true, 
        min: 1, 
        max: 10 
    },
    title: { 
        type: String, 
        required: true,
        maxlength: 100
    },
    comment: { 
        type: String, 
        required: true,
        maxlength: 1000
    },
    reviewType: {
        type: String,
        enum: ['movie', 'theater', 'experience'],
        default: 'movie'
    },
    isVerifiedPurchase: { 
        type: Boolean, 
        default: false 
    },
    booking: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Booking" 
    },
    likes: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User" 
    }],
    dislikes: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User" 
    }],
    totalLikes: { 
        type: Number, 
        default: 0 
    },
    totalDislikes: { 
        type: Number, 
        default: 0 
    },
    isApproved: { 
        type: Boolean, 
        default: true 
    },
    isFlagged: { 
        type: Boolean, 
        default: false 
    },
    flagReason: { 
        type: String 
    },
    moderatedBy: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User" 
    },
    moderationDate: { 
        type: Date 
    },
    helpfulCount: { 
        type: Number, 
        default: 0 
    },
    tags: [String], // e.g., ['great-acting', 'good-story', 'poor-sound']
    spoilerAlert: { 
        type: Boolean, 
        default: false 
    }
}, { timestamps: true });

// Index for better query performance
reviewSchema.index({ movie: 1, user: 1 }, { unique: true });
reviewSchema.index({ theater: 1, user: 1 });
reviewSchema.index({ rating: -1 });
reviewSchema.index({ createdAt: -1 });

// Update movie's average rating when review is saved
reviewSchema.post('save', async function() {
    const Movie = mongoose.model('Movie');
    const reviews = await mongoose.model('Review').find({ movie: this.movie });
    
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.length;
    
    await Movie.findByIdAndUpdate(this.movie, {
        averageRating: Math.round(averageRating * 10) / 10,
        totalReviews: reviews.length
    });
});

// Update movie's average rating when review is removed
reviewSchema.post('remove', async function() {
    const Movie = mongoose.model('Movie');
    const reviews = await mongoose.model('Review').find({ movie: this.movie });
    
    if (reviews.length > 0) {
        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        const averageRating = totalRating / reviews.length;
        
        await Movie.findByIdAndUpdate(this.movie, {
            averageRating: Math.round(averageRating * 10) / 10,
            totalReviews: reviews.length
        });
    } else {
        await Movie.findByIdAndUpdate(this.movie, {
            averageRating: 0,
            totalReviews: 0
        });
    }
});

module.exports = mongoose.model("Review", reviewSchema);
