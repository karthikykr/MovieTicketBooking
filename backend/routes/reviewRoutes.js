const express = require('express');
const router = express.Router();
const Review = require('../models/reviewModel');
const Movie = require('../models/movieModel');
const Theater = require('../models/theaterModel');

// Get all reviews with pagination and filtering
router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        
        const filter = {};
        if (req.query.movie) filter.movie = req.query.movie;
        if (req.query.theater) filter.theater = req.query.theater;
        if (req.query.user) filter.user = req.query.user;
        if (req.query.rating) filter.rating = { $gte: parseInt(req.query.rating) };
        if (req.query.reviewType) filter.reviewType = req.query.reviewType;
        if (req.query.isVerified) filter.isVerifiedPurchase = req.query.isVerified === 'true';

        const reviews = await Review.find(filter)
            .populate('user', 'name profilePicture membershipTier')
            .populate('movie', 'title image rating')
            .populate('theater', 'name location.city')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Review.countDocuments(filter);

        res.json({
            reviews,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalReviews: total,
                hasNext: page < Math.ceil(total / limit),
                hasPrev: page > 1
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get reviews for a specific movie
router.get('/movie/:movieId', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const sortBy = req.query.sortBy || 'createdAt'; // createdAt, rating, helpfulCount
        const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;

        const reviews = await Review.find({ movie: req.params.movieId, isApproved: true })
            .populate('user', 'name profilePicture membershipTier')
            .sort({ [sortBy]: sortOrder })
            .skip(skip)
            .limit(limit);

        const total = await Review.countDocuments({ movie: req.params.movieId, isApproved: true });
        
        // Get rating distribution
        const ratingDistribution = await Review.aggregate([
            { $match: { movie: mongoose.Types.ObjectId(req.params.movieId), isApproved: true } },
            { $group: { _id: '$rating', count: { $sum: 1 } } },
            { $sort: { _id: 1 } }
        ]);

        res.json({
            reviews,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalReviews: total
            },
            ratingDistribution
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create a new review
router.post('/', async (req, res) => {
    try {
        const {
            user,
            movie,
            theater,
            rating,
            title,
            comment,
            reviewType,
            booking,
            tags,
            spoilerAlert
        } = req.body;

        // Check if user already reviewed this movie
        const existingReview = await Review.findOne({ user, movie });
        if (existingReview) {
            return res.status(400).json({ error: 'You have already reviewed this movie' });
        }

        const review = new Review({
            user,
            movie,
            theater,
            rating,
            title,
            comment,
            reviewType: reviewType || 'movie',
            booking,
            tags: tags || [],
            spoilerAlert: spoilerAlert || false,
            isVerifiedPurchase: !!booking
        });

        await review.save();

        // Populate the review before sending response
        await review.populate('user', 'name profilePicture membershipTier');
        await review.populate('movie', 'title image');

        res.status(201).json(review);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Update a review
router.put('/:id', async (req, res) => {
    try {
        const { rating, title, comment, tags, spoilerAlert } = req.body;
        
        const review = await Review.findById(req.params.id);
        if (!review) {
            return res.status(404).json({ error: 'Review not found' });
        }

        // Update fields
        if (rating !== undefined) review.rating = rating;
        if (title !== undefined) review.title = title;
        if (comment !== undefined) review.comment = comment;
        if (tags !== undefined) review.tags = tags;
        if (spoilerAlert !== undefined) review.spoilerAlert = spoilerAlert;

        await review.save();
        
        await review.populate('user', 'name profilePicture membershipTier');
        await review.populate('movie', 'title image');

        res.json(review);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete a review
router.delete('/:id', async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);
        if (!review) {
            return res.status(404).json({ error: 'Review not found' });
        }

        await Review.findByIdAndDelete(req.params.id);
        res.json({ message: 'Review deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Like/Unlike a review
router.post('/:id/like', async (req, res) => {
    try {
        const { userId } = req.body;
        const review = await Review.findById(req.params.id);
        
        if (!review) {
            return res.status(404).json({ error: 'Review not found' });
        }

        const userLiked = review.likes.includes(userId);
        const userDisliked = review.dislikes.includes(userId);

        if (userLiked) {
            // Remove like
            review.likes.pull(userId);
            review.totalLikes = Math.max(0, review.totalLikes - 1);
        } else {
            // Add like
            review.likes.push(userId);
            review.totalLikes += 1;
            
            // Remove dislike if exists
            if (userDisliked) {
                review.dislikes.pull(userId);
                review.totalDislikes = Math.max(0, review.totalDislikes - 1);
            }
        }

        await review.save();
        res.json({ 
            liked: !userLiked,
            totalLikes: review.totalLikes,
            totalDislikes: review.totalDislikes
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Dislike/Remove dislike from a review
router.post('/:id/dislike', async (req, res) => {
    try {
        const { userId } = req.body;
        const review = await Review.findById(req.params.id);
        
        if (!review) {
            return res.status(404).json({ error: 'Review not found' });
        }

        const userLiked = review.likes.includes(userId);
        const userDisliked = review.dislikes.includes(userId);

        if (userDisliked) {
            // Remove dislike
            review.dislikes.pull(userId);
            review.totalDislikes = Math.max(0, review.totalDislikes - 1);
        } else {
            // Add dislike
            review.dislikes.push(userId);
            review.totalDislikes += 1;
            
            // Remove like if exists
            if (userLiked) {
                review.likes.pull(userId);
                review.totalLikes = Math.max(0, review.totalLikes - 1);
            }
        }

        await review.save();
        res.json({ 
            disliked: !userDisliked,
            totalLikes: review.totalLikes,
            totalDislikes: review.totalDislikes
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Mark review as helpful
router.post('/:id/helpful', async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);
        if (!review) {
            return res.status(404).json({ error: 'Review not found' });
        }

        review.helpfulCount += 1;
        await review.save();

        res.json({ helpfulCount: review.helpfulCount });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get review statistics for a movie
router.get('/stats/movie/:movieId', async (req, res) => {
    try {
        const stats = await Review.aggregate([
            { $match: { movie: mongoose.Types.ObjectId(req.params.movieId), isApproved: true } },
            {
                $group: {
                    _id: null,
                    totalReviews: { $sum: 1 },
                    averageRating: { $avg: '$rating' },
                    totalLikes: { $sum: '$totalLikes' },
                    totalDislikes: { $sum: '$totalDislikes' },
                    verifiedReviews: { $sum: { $cond: ['$isVerifiedPurchase', 1, 0] } }
                }
            }
        ]);

        const ratingDistribution = await Review.aggregate([
            { $match: { movie: mongoose.Types.ObjectId(req.params.movieId), isApproved: true } },
            { $group: { _id: '$rating', count: { $sum: 1 } } },
            { $sort: { _id: 1 } }
        ]);

        res.json({
            stats: stats[0] || { totalReviews: 0, averageRating: 0 },
            ratingDistribution
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
