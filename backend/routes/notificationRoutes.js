const express = require('express');
const router = express.Router();
const Notification = require('../models/notificationModel');

// Get notifications for a user
router.get('/user/:userId', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;
        
        const filter = { recipient: req.params.userId };
        if (req.query.type) filter.type = req.query.type;
        if (req.query.isRead !== undefined) filter.isRead = req.query.isRead === 'true';
        if (req.query.priority) filter.priority = req.query.priority;

        const notifications = await Notification.find(filter)
            .populate('sender', 'name profilePicture')
            .populate('relatedBooking', 'bookingReference')
            .populate('relatedMovie', 'title image')
            .populate('relatedTheater', 'name location.city')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Notification.countDocuments(filter);
        const unreadCount = await Notification.countDocuments({ 
            recipient: req.params.userId, 
            isRead: false 
        });

        res.json({
            notifications,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalNotifications: total
            },
            unreadCount
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create a new notification
router.post('/', async (req, res) => {
    try {
        const {
            recipient,
            sender,
            type,
            title,
            message,
            relatedBooking,
            relatedMovie,
            relatedTheater,
            priority,
            actionUrl,
            actionText,
            expiresAt
        } = req.body;

        const notification = new Notification({
            recipient,
            sender,
            type,
            title,
            message,
            relatedBooking,
            relatedMovie,
            relatedTheater,
            priority: priority || 'normal',
            actionUrl,
            actionText,
            expiresAt
        });

        await notification.save();

        // Populate the notification before sending response
        await notification.populate('sender', 'name profilePicture');
        await notification.populate('relatedBooking', 'bookingReference');
        await notification.populate('relatedMovie', 'title image');
        await notification.populate('relatedTheater', 'name location.city');

        res.status(201).json(notification);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Mark notification as read
router.put('/:id/read', async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id);
        if (!notification) {
            return res.status(404).json({ error: 'Notification not found' });
        }

        notification.isRead = true;
        notification.readAt = new Date();
        await notification.save();

        res.json({ message: 'Notification marked as read' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Mark all notifications as read for a user
router.put('/user/:userId/read-all', async (req, res) => {
    try {
        const result = await Notification.updateMany(
            { recipient: req.params.userId, isRead: false },
            { 
                isRead: true, 
                readAt: new Date() 
            }
        );

        res.json({ 
            message: 'All notifications marked as read',
            modifiedCount: result.modifiedCount
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete a notification
router.delete('/:id', async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id);
        if (!notification) {
            return res.status(404).json({ error: 'Notification not found' });
        }

        await Notification.findByIdAndDelete(req.params.id);
        res.json({ message: 'Notification deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get notification statistics for a user
router.get('/user/:userId/stats', async (req, res) => {
    try {
        const stats = await Notification.aggregate([
            { $match: { recipient: mongoose.Types.ObjectId(req.params.userId) } },
            {
                $group: {
                    _id: null,
                    total: { $sum: 1 },
                    unread: { $sum: { $cond: ['$isRead', 0, 1] } },
                    byType: {
                        $push: {
                            type: '$type',
                            isRead: '$isRead'
                        }
                    }
                }
            }
        ]);

        const typeStats = await Notification.aggregate([
            { $match: { recipient: mongoose.Types.ObjectId(req.params.userId) } },
            {
                $group: {
                    _id: '$type',
                    total: { $sum: 1 },
                    unread: { $sum: { $cond: ['$isRead', 0, 1] } }
                }
            }
        ]);

        res.json({
            summary: stats[0] || { total: 0, unread: 0 },
            byType: typeStats
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Send bulk notifications
router.post('/bulk', async (req, res) => {
    try {
        const {
            recipients, // Array of user IDs
            type,
            title,
            message,
            priority,
            actionUrl,
            actionText,
            expiresAt,
            sender
        } = req.body;

        if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
            return res.status(400).json({ error: 'Recipients array is required' });
        }

        const batchId = 'BATCH_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
        
        const notifications = recipients.map(recipientId => ({
            recipient: recipientId,
            sender,
            type,
            title,
            message,
            priority: priority || 'normal',
            actionUrl,
            actionText,
            expiresAt,
            batchId
        }));

        const createdNotifications = await Notification.insertMany(notifications);

        res.status(201).json({
            message: 'Bulk notifications sent successfully',
            batchId,
            count: createdNotifications.length
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get notifications by batch ID
router.get('/batch/:batchId', async (req, res) => {
    try {
        const notifications = await Notification.find({ batchId: req.params.batchId })
            .populate('recipient', 'name email')
            .sort({ createdAt: -1 });

        const stats = await Notification.aggregate([
            { $match: { batchId: req.params.batchId } },
            {
                $group: {
                    _id: null,
                    total: { $sum: 1 },
                    read: { $sum: { $cond: ['$isRead', 1, 0] } },
                    unread: { $sum: { $cond: ['$isRead', 0, 1] } }
                }
            }
        ]);

        res.json({
            notifications,
            stats: stats[0] || { total: 0, read: 0, unread: 0 }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create booking confirmation notification
router.post('/booking-confirmation', async (req, res) => {
    try {
        const { userId, bookingId, movieTitle, theaterName, showDate, showTime } = req.body;

        const notification = new Notification({
            recipient: userId,
            type: 'booking_confirmation',
            title: 'Booking Confirmed!',
            message: `Your booking for "${movieTitle}" at ${theaterName} on ${showDate} at ${showTime} has been confirmed.`,
            relatedBooking: bookingId,
            priority: 'high',
            actionUrl: `/booking/${bookingId}`,
            actionText: 'View Booking'
        });

        await notification.save();
        res.status(201).json(notification);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Create payment success notification
router.post('/payment-success', async (req, res) => {
    try {
        const { userId, bookingId, amount, transactionId } = req.body;

        const notification = new Notification({
            recipient: userId,
            type: 'payment_success',
            title: 'Payment Successful',
            message: `Your payment of $${amount} has been processed successfully. Transaction ID: ${transactionId}`,
            relatedBooking: bookingId,
            priority: 'high',
            actionUrl: `/booking/${bookingId}`,
            actionText: 'View Receipt'
        });

        await notification.save();
        res.status(201).json(notification);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Create show reminder notification
router.post('/show-reminder', async (req, res) => {
    try {
        const { userId, bookingId, movieTitle, theaterName, showDate, showTime } = req.body;

        const notification = new Notification({
            recipient: userId,
            type: 'show_reminder',
            title: 'Show Reminder',
            message: `Don't forget! Your movie "${movieTitle}" starts in 2 hours at ${theaterName}.`,
            relatedBooking: bookingId,
            priority: 'normal',
            actionUrl: `/booking/${bookingId}`,
            actionText: 'View Details'
        });

        await notification.save();
        res.status(201).json(notification);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
