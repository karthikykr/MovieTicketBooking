const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
    booking: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Booking", 
        required: true 
    },
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    },
    amount: { 
        type: Number, 
        required: true,
        min: 0
    },
    currency: { 
        type: String, 
        default: "USD",
        enum: ['USD', 'EUR', 'GBP', 'INR', 'CAD', 'AUD']
    },
    paymentMethod: {
        type: String,
        required: true,
        enum: ['credit_card', 'debit_card', 'paypal', 'stripe', 'wallet', 'bank_transfer', 'cash']
    },
    paymentProvider: {
        type: String,
        enum: ['stripe', 'paypal', 'razorpay', 'square', 'manual'],
        default: 'stripe'
    },
    transactionId: { 
        type: String, 
        required: true,
        unique: true
    },
    providerTransactionId: { 
        type: String 
    },
    paymentStatus: {
        type: String,
        required: true,
        enum: ['pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded', 'partially_refunded'],
        default: 'pending'
    },
    paymentDate: { 
        type: Date, 
        default: Date.now 
    },
    
    // Card/Payment details (encrypted/tokenized)
    paymentDetails: {
        cardLast4: String,
        cardBrand: String, // visa, mastercard, amex, etc.
        cardType: String,  // credit, debit
        expiryMonth: Number,
        expiryYear: Number,
        billingAddress: {
            street: String,
            city: String,
            state: String,
            zipCode: String,
            country: String
        }
    },
    
    // Breakdown
    breakdown: {
        subtotal: { type: Number, required: true },
        taxes: { type: Number, default: 0 },
        serviceFee: { type: Number, default: 0 },
        discount: { type: Number, default: 0 },
        loyaltyPointsDiscount: { type: Number, default: 0 },
        total: { type: Number, required: true }
    },
    
    // Refund information
    refunds: [{
        refundId: String,
        amount: Number,
        reason: String,
        status: {
            type: String,
            enum: ['pending', 'completed', 'failed'],
            default: 'pending'
        },
        refundDate: { type: Date, default: Date.now },
        processedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
    }],
    
    totalRefunded: { 
        type: Number, 
        default: 0 
    },
    
    // Additional metadata
    ipAddress: String,
    userAgent: String,
    deviceInfo: String,
    
    // Failure information
    failureReason: String,
    failureCode: String,
    
    // Processing information
    processingFee: { 
        type: Number, 
        default: 0 
    },
    netAmount: Number, // Amount after processing fees
    
    // Notifications
    receiptSent: { 
        type: Boolean, 
        default: false 
    },
    receiptEmail: String,
    
    // Fraud detection
    riskScore: { 
        type: Number, 
        min: 0, 
        max: 100 
    },
    fraudFlags: [String],
    
    // Webhook/callback information
    webhookStatus: {
        type: String,
        enum: ['pending', 'received', 'processed', 'failed'],
        default: 'pending'
    },
    webhookAttempts: { 
        type: Number, 
        default: 0 
    },
    
    notes: String
}, { timestamps: true });

// Indexes for better performance
paymentSchema.index({ booking: 1 });
paymentSchema.index({ user: 1 });
paymentSchema.index({ transactionId: 1 });
paymentSchema.index({ paymentStatus: 1 });
paymentSchema.index({ paymentDate: -1 });

// Calculate net amount before saving
paymentSchema.pre('save', function(next) {
    if (this.isModified('amount') || this.isModified('processingFee')) {
        this.netAmount = this.amount - (this.processingFee || 0);
    }
    next();
});

module.exports = mongoose.model("Payment", paymentSchema);
