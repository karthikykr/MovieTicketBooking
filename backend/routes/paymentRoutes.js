const express = require('express');
const router = express.Router();
const Payment = require('../models/paymentModel');
const Booking = require('../models/bookingModel');
const User = require('../models/userModel');

// Create a new payment
router.post('/create', async (req, res) => {
    try {
        const {
            booking,
            user,
            amount,
            currency,
            paymentMethod,
            paymentProvider,
            paymentDetails,
            breakdown
        } = req.body;

        // Generate unique transaction ID
        const transactionId = 'TXN_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9).toUpperCase();

        const payment = new Payment({
            booking,
            user,
            amount,
            currency: currency || 'USD',
            paymentMethod,
            paymentProvider: paymentProvider || 'stripe',
            transactionId,
            paymentDetails,
            breakdown: {
                subtotal: breakdown.subtotal,
                taxes: breakdown.taxes || 0,
                serviceFee: breakdown.serviceFee || 0,
                discount: breakdown.discount || 0,
                loyaltyPointsDiscount: breakdown.loyaltyPointsDiscount || 0,
                total: amount
            },
            paymentStatus: 'pending',
            ipAddress: req.ip,
            userAgent: req.get('User-Agent')
        });

        await payment.save();

        // Simulate payment processing
        setTimeout(async () => {
            try {
                const success = Math.random() > 0.1; // 90% success rate
                
                if (success) {
                    payment.paymentStatus = 'completed';
                    payment.providerTransactionId = 'PROV_' + Date.now();
                    
                    // Update booking status
                    await Booking.findByIdAndUpdate(booking, {
                        paymentStatus: 'completed',
                        bookingStatus: 'confirmed',
                        transactionId: payment.transactionId
                    });

                    // Award loyalty points
                    if (payment.breakdown.loyaltyPointsDiscount === 0) {
                        const pointsEarned = Math.floor(amount / 10); // 1 point per $10
                        await User.findByIdAndUpdate(user, {
                            $inc: { loyaltyPoints: pointsEarned }
                        });
                    }
                } else {
                    payment.paymentStatus = 'failed';
                    payment.failureReason = 'Payment declined by bank';
                    payment.failureCode = 'DECLINED_' + Math.floor(Math.random() * 1000);
                    
                    // Update booking status
                    await Booking.findByIdAndUpdate(booking, {
                        paymentStatus: 'failed',
                        bookingStatus: 'cancelled'
                    });
                }
                
                await payment.save();
            } catch (error) {
                console.error('Payment processing error:', error);
            }
        }, 2000); // 2 second delay to simulate processing

        res.status(201).json({
            paymentId: payment._id,
            transactionId: payment.transactionId,
            status: payment.paymentStatus,
            message: 'Payment initiated successfully'
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get payment status
router.get('/:paymentId/status', async (req, res) => {
    try {
        const payment = await Payment.findById(req.params.paymentId)
            .populate('booking', 'bookingReference seats showDate showTime')
            .populate('user', 'name email');

        if (!payment) {
            return res.status(404).json({ error: 'Payment not found' });
        }

        res.json({
            paymentId: payment._id,
            transactionId: payment.transactionId,
            status: payment.paymentStatus,
            amount: payment.amount,
            currency: payment.currency,
            paymentMethod: payment.paymentMethod,
            paymentDate: payment.paymentDate,
            booking: payment.booking,
            user: payment.user,
            breakdown: payment.breakdown,
            failureReason: payment.failureReason
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all payments for a user
router.get('/user/:userId', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const filter = { user: req.params.userId };
        if (req.query.status) filter.paymentStatus = req.query.status;
        if (req.query.method) filter.paymentMethod = req.query.method;

        const payments = await Payment.find(filter)
            .populate('booking', 'bookingReference movie theater showDate showTime seats')
            .populate({
                path: 'booking',
                populate: [
                    { path: 'movie', select: 'title image' },
                    { path: 'theater', select: 'name location.city' }
                ]
            })
            .sort({ paymentDate: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Payment.countDocuments(filter);

        res.json({
            payments,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalPayments: total
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Process refund
router.post('/:paymentId/refund', async (req, res) => {
    try {
        const { amount, reason, processedBy } = req.body;
        
        const payment = await Payment.findById(req.params.paymentId);
        if (!payment) {
            return res.status(404).json({ error: 'Payment not found' });
        }

        if (payment.paymentStatus !== 'completed') {
            return res.status(400).json({ error: 'Cannot refund non-completed payment' });
        }

        const refundAmount = amount || payment.amount;
        if (refundAmount > (payment.amount - payment.totalRefunded)) {
            return res.status(400).json({ error: 'Refund amount exceeds available amount' });
        }

        const refundId = 'REF_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6).toUpperCase();

        const refund = {
            refundId,
            amount: refundAmount,
            reason: reason || 'Customer request',
            status: 'pending',
            refundDate: new Date(),
            processedBy
        };

        payment.refunds.push(refund);
        payment.totalRefunded += refundAmount;

        // Update payment status
        if (payment.totalRefunded >= payment.amount) {
            payment.paymentStatus = 'refunded';
        } else {
            payment.paymentStatus = 'partially_refunded';
        }

        await payment.save();

        // Update booking status
        await Booking.findByIdAndUpdate(payment.booking, {
            bookingStatus: 'refunded',
            refundAmount: payment.totalRefunded
        });

        // Simulate refund processing
        setTimeout(async () => {
            try {
                const refundIndex = payment.refunds.length - 1;
                payment.refunds[refundIndex].status = 'completed';
                await payment.save();
            } catch (error) {
                console.error('Refund processing error:', error);
            }
        }, 3000);

        res.json({
            message: 'Refund initiated successfully',
            refundId,
            refundAmount,
            totalRefunded: payment.totalRefunded,
            paymentStatus: payment.paymentStatus
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get payment analytics
router.get('/analytics/summary', async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        
        const matchFilter = {};
        if (startDate && endDate) {
            matchFilter.paymentDate = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }

        const analytics = await Payment.aggregate([
            { $match: matchFilter },
            {
                $group: {
                    _id: null,
                    totalPayments: { $sum: 1 },
                    totalAmount: { $sum: '$amount' },
                    totalRefunded: { $sum: '$totalRefunded' },
                    successfulPayments: {
                        $sum: { $cond: [{ $eq: ['$paymentStatus', 'completed'] }, 1, 0] }
                    },
                    failedPayments: {
                        $sum: { $cond: [{ $eq: ['$paymentStatus', 'failed'] }, 1, 0] }
                    },
                    averageAmount: { $avg: '$amount' }
                }
            }
        ]);

        const paymentMethodStats = await Payment.aggregate([
            { $match: matchFilter },
            { $group: { _id: '$paymentMethod', count: { $sum: 1 }, totalAmount: { $sum: '$amount' } } },
            { $sort: { count: -1 } }
        ]);

        const dailyStats = await Payment.aggregate([
            { $match: matchFilter },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$paymentDate' } },
                    count: { $sum: 1 },
                    totalAmount: { $sum: '$amount' }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        res.json({
            summary: analytics[0] || {
                totalPayments: 0,
                totalAmount: 0,
                totalRefunded: 0,
                successfulPayments: 0,
                failedPayments: 0,
                averageAmount: 0
            },
            paymentMethodStats,
            dailyStats
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Webhook endpoint for payment providers
router.post('/webhook/:provider', async (req, res) => {
    try {
        const provider = req.params.provider;
        const webhookData = req.body;

        // This would typically verify the webhook signature
        // For demo purposes, we'll just log it
        console.log(`Webhook received from ${provider}:`, webhookData);

        // Update payment status based on webhook
        if (webhookData.transactionId) {
            const payment = await Payment.findOne({ 
                providerTransactionId: webhookData.transactionId 
            });

            if (payment) {
                payment.webhookStatus = 'received';
                payment.webhookAttempts += 1;
                
                if (webhookData.status) {
                    payment.paymentStatus = webhookData.status;
                }
                
                await payment.save();
            }
        }

        res.status(200).json({ received: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
