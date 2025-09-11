const Joi = require('joi');

// Validation middleware using Joi
const validate = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body, { abortEarly: false });

        if (error) {
            const errors = error.details.map(detail => ({
                field: detail.path.join('.'),
                message: detail.message
            }));

            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors
            });
        }

        next();
    };
};

// Validation schemas
const userRegistrationSchema = Joi.object({
    name: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    phone: Joi.string().optional(),
    dateOfBirth: Joi.date().optional(),
    gender: Joi.string().valid('male', 'female', 'other').optional(),
    address: Joi.object({
        street: Joi.string().optional(),
        city: Joi.string().optional(),
        state: Joi.string().optional(),
        zipCode: Joi.string().optional(),
        country: Joi.string().optional()
    }).optional(),
    preferences: Joi.object({
        favoriteGenres: Joi.array().items(Joi.string()).optional(),
        notifications: Joi.object({
            email: Joi.boolean().optional(),
            sms: Joi.boolean().optional(),
            push: Joi.boolean().optional()
        }).optional()
    }).optional()
});

const userLoginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});

const movieSchema = Joi.object({
    title: Joi.string().required(),
    genre: Joi.array().items(Joi.string()).required(),
    duration: Joi.number().integer().min(1).required(),
    releaseDate: Joi.date().required(),
    rating: Joi.number().min(0).max(10).required(),
    votes: Joi.number().integer().min(0).optional(),
    description: Joi.string().required(),
    image: Joi.string().uri().optional(),
    backdropImage: Joi.string().uri().optional(),
    trailer: Joi.string().uri().optional(),
    language: Joi.string().optional(),
    country: Joi.string().optional(),
    budget: Joi.number().optional(),
    boxOffice: Joi.number().optional(),
    awards: Joi.array().items(Joi.string()).optional(),
    ageRating: Joi.string().valid('G', 'PG', 'PG-13', 'R', 'NC-17', 'U', 'UA', 'A').optional(),
    status: Joi.string().valid('now_playing', 'upcoming', 'released').optional(),
    tmdbId: Joi.number().optional(),
    imdbId: Joi.string().optional(),
    cast: Joi.array().items(Joi.object({
        name: Joi.string().required(),
        character: Joi.string().required(),
        image: Joi.string().uri().optional(),
        order: Joi.number().optional()
    })).optional(),
    crew: Joi.array().items(Joi.object({
        name: Joi.string().required(),
        job: Joi.string().required(),
        department: Joi.string().required(),
        image: Joi.string().uri().optional()
    })).optional(),
    averageRating: Joi.number().min(0).max(10).optional(),
    totalReviews: Joi.number().integer().min(0).optional(),
    isActive: Joi.boolean().optional()
});

module.exports = {
    validate,
    userRegistrationSchema,
    userLoginSchema,
    movieSchema
};
