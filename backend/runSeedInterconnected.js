#!/usr/bin/env node

/**
 * Comprehensive Movie Ticket Booking System Data Seeder
 * 
 * This script seeds the database with realistic, interconnected data including:
 * - Diverse users with different profiles and preferences
 * - Popular movies with detailed metadata
 * - Theaters across multiple cities with various amenities
 * - Realistic showtimes spanning 14 days
 * - Bookings with proper seat assignments and pricing
 * - Payment records with detailed transaction information
 * - User reviews based on booking history
 * - Notifications for various user activities
 * 
 * All data is properly interconnected with foreign key relationships
 * to create a realistic movie booking ecosystem.
 */

const { seedInterconnectedData } = require('./seedInterconnectedData');

console.log('🎬 Movie Ticket Booking System - Comprehensive Data Seeder');
console.log('=========================================================');
console.log('');
console.log('This will create realistic, interconnected data for your movie booking system:');
console.log('• 10 diverse users with different profiles');
console.log('• 10 popular movies with detailed cast and crew information');
console.log('• 6 theaters across different cities with various amenities');
console.log('• 840 showtimes spanning 14 days');
console.log('• 250 realistic bookings with seat assignments');
console.log('• Payment records for all completed bookings');
console.log('• User reviews based on booking history');
console.log('• Notifications for user activities');
console.log('');
console.log('⚠️  WARNING: This will clear all existing data in the database!');
console.log('');

// Run the seeding process
seedInterconnectedData();
