const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
    recipient: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    },
    sender: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User" 
    },
    type: {
        type: String,
        required: true,
        enum: [
            'booking_confirmation',
            'booking_cancellation', 
            'payment_success',
            'payment_failed',
            'refund_processed',
            'show_reminder',
            'new_movie_release',
            'price_drop',
            'loyalty_points_earned',
            'membership_upgrade',
            'review_response',
            'system_maintenance',
            'promotional_offer',
            'group_booking_invite',
            'seat_availability',
            'general'
        ]
    },
    title: { 
        type: String, 
        required: true,
        maxlength: 100
    },
    message: { 
        type: String, 
        required: true,
        maxlength: 500
    },
    
    // Related entities
    relatedBooking: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Booking" 
    },
    relatedMovie: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Movie" 
    },
    relatedTheater: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Theater" 
    },
    relatedPayment: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Payment" 
    },
    
    // Delivery channels
    channels: {
        email: {
            enabled: { type: Boolean, default: true },
            sent: { type: Boolean, default: false },
            sentAt: Date,
            deliveryStatus: {
                type: String,
                enum: ['pending', 'sent', 'delivered', 'failed', 'bounced'],
                default: 'pending'
            },
            emailId: String,
            errorMessage: String
        },
        sms: {
            enabled: { type: Boolean, default: false },
            sent: { type: Boolean, default: false },
            sentAt: Date,
            deliveryStatus: {
                type: String,
                enum: ['pending', 'sent', 'delivered', 'failed'],
                default: 'pending'
            },
            smsId: String,
            errorMessage: String
        },
        push: {
            enabled: { type: Boolean, default: true },
            sent: { type: Boolean, default: false },
            sentAt: Date,
            deliveryStatus: {
                type: String,
                enum: ['pending', 'sent', 'delivered', 'failed'],
                default: 'pending'
            },
            pushId: String,
            errorMessage: String
        },
        inApp: {
            enabled: { type: Boolean, default: true },
            read: { type: Boolean, default: false },
            readAt: Date
        }
    },
    
    // Priority and scheduling
    priority: {
        type: String,
        enum: ['low', 'normal', 'high', 'urgent'],
        default: 'normal'
    },
    scheduledFor: Date, // For scheduled notifications
    
    // Status tracking
    status: {
        type: String,
        enum: ['draft', 'scheduled', 'sent', 'delivered', 'failed', 'cancelled'],
        default: 'draft'
    },
    
    // Action buttons/links
    actionButtons: [{
        text: String,
        url: String,
        action: String, // 'view_booking', 'make_payment', 'cancel_booking', etc.
        style: {
            type: String,
            enum: ['primary', 'secondary', 'danger', 'success'],
            default: 'primary'
        }
    }],
    
    // Metadata
    metadata: {
        campaign: String,
        source: String,
        medium: String,
        tags: [String]
    },
    
    // Tracking
    interactions: [{
        action: {
            type: String,
            enum: ['opened', 'clicked', 'dismissed', 'action_taken']
        },
        timestamp: { type: Date, default: Date.now },
        metadata: mongoose.Schema.Types.Mixed
    }],
    
    // Expiry
    expiresAt: Date,
    
    // Template information
    template: {
        name: String,
        version: String,
        variables: mongoose.Schema.Types.Mixed
    },
    
    // Batch information (for bulk notifications)
    batchId: String,
    
    isRead: { 
        type: Boolean, 
        default: false 
    },
    readAt: Date,
    
    // Admin/system notifications
    isSystemNotification: { 
        type: Boolean, 
        default: false 
    },
    createdBy: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User" 
    }
}, { timestamps: true });

// Indexes for better performance
notificationSchema.index({ recipient: 1, createdAt: -1 });
notificationSchema.index({ type: 1 });
notificationSchema.index({ status: 1 });
notificationSchema.index({ scheduledFor: 1 });
notificationSchema.index({ expiresAt: 1 });
notificationSchema.index({ isRead: 1 });

// TTL index for automatic cleanup of expired notifications
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Mark as read
notificationSchema.methods.markAsRead = function() {
    this.isRead = true;
    this.readAt = new Date();
    this.channels.inApp.read = true;
    this.channels.inApp.readAt = new Date();
    return this.save();
};

module.exports = mongoose.model("Notification", notificationSchema);
