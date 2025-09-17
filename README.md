# Movie Ticket Booking System

A full-stack movie ticket booking application built with React.js frontend and Node.js/Express backend with MongoDB database.

## Features

### Implemented Features ✅
- **User Authentication**: Registration and login system
- **Movie Browsing**: View all available movies with details
- **Movie Details**: Detailed view of individual movies with cast and crew
- **Showtimes**: View available showtimes for movies across different theaters
- **Seat Selection**: Interactive seat selection with real-time availability
- **Booking System**: Complete booking flow with seat reservation
- **User Dashboard**: View booking history and manage account
- **Responsive Design**: Mobile-friendly interface
- **Theater Management**: Multiple theaters with different locations

### Core Components
- **Frontend**: React.js with React Router, Tailwind CSS
- **Backend**: Node.js, Express.js, MongoDB with Mongoose
- **Authentication**: JWT-based authentication
- **Database**: MongoDB with proper schema design

## Project Structure

```
MovieTicketBooking/
├── backend/
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   ├── server.js         # Main server file
│   ├── seedData.js       # Database seeding script
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/   # Reusable components
│   │   ├── pages/        # Page components
│   │   └── App.jsx       # Main app component
│   └── package.json
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn package manager

### Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment Configuration**:
   - The `.env` file is already configured with default values
   - Update `MONGO_URI` if using a different MongoDB connection
   - Update `JWT_SECRET` for production use

4. **Seed the database** (populate with sample data):
   ```bash
   npm run seed
   ```

5. **Start the backend server**:
   ```bash
   npm run dev
   ```
   Server will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```
   Frontend will run on `http://localhost:5173`

### Database Setup

1. **MongoDB Local Setup**:
   - Install MongoDB locally
   - Start MongoDB service
   - Database will be created automatically when seeding

2. **MongoDB Atlas Setup** (Alternative):
   - Create a MongoDB Atlas account
   - Create a new cluster
   - Update `MONGO_URI` in backend/.env with your Atlas connection string

## Hosting

This application is hosted on:
- **Frontend**: Vercel - [https://movie-ticket-booking-livid-delta.vercel.app/](https://movie-ticket-booking-livid-delta.vercel.app/)
- **Backend**: Render

## Usage

### Local Development
1. **Start both servers** (backend and frontend)
2. **Open browser** and navigate to `http://localhost:5173`
3. **Browse movies** on the homepage
4. **Register/Login** to book tickets
5. **Select a movie** and view showtimes
6. **Choose seats** and complete booking
7. **View bookings** in the user dashboard

### Live Application
Visit the live application at: [https://movie-ticket-booking-livid-delta.vercel.app/](https://movie-ticket-booking-livid-delta.vercel.app/)

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Movies
- `GET /api/movies/allMovie` - Get all movies
- `GET /api/movies/:id` - Get single movie
- `POST /api/movies/addMovie` - Add new movie

### Showtimes
- `GET /api/showtimes/movies/:movieId` - Get showtimes for a movie
- `POST /api/showtimes/:showtimeId/book` - Book seats

### Theaters
- `GET /api/theaters` - Get all theaters
- `POST /api/theaters` - Add new theater

### Bookings
- `POST /api/bookings/book` - Create booking
- `GET /api/bookings/bookings` - Get all bookings

## Technologies Used

### Frontend
- React.js 18
- React Router DOM
- Tailwind CSS
- React Icons
- Axios for API calls

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing
- CORS for cross-origin requests

## Recent Fixes and Improvements

1. **Fixed Authentication Bug**: Corrected variable reference in login route
2. **API Endpoint Consistency**: Fixed frontend-backend API endpoint mismatches
3. **Enhanced Seat Selection**: Improved seat booking modal with better UX
4. **User Dashboard**: Added comprehensive user dashboard with booking history
5. **Responsive Navbar**: Updated navigation with authentication state management
6. **Database Seeding**: Added comprehensive sample data for testing

## Future Enhancements

- Payment integration
- Email notifications
- Admin panel for theater management
- Movie reviews and ratings
- Group booking functionality
- Mobile app development
- Advanced search and filtering
- Loyalty program

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request


