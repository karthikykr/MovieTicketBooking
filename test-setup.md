# Testing the Movie Ticket Booking System

## Quick Test Guide

### 1. Start MongoDB
Make sure MongoDB is running on your system:
```bash
# For Windows (if MongoDB is installed as a service)
net start MongoDB

# For macOS/Linux
sudo systemctl start mongod
# or
brew services start mongodb-community
```

### 2. Seed the Database
```bash
cd backend
npm run seed
```
Expected output:
```
Connected to MongoDB
Cleared existing data
Movies seeded successfully
Theaters seeded successfully
Showtimes seeded successfully
Database seeded successfully!
```

### 3. Start Backend Server
```bash
cd backend
npm run dev
```
Expected output:
```
Server running on http://localhost:5000
MongoDB Connected: localhost
```

### 4. Start Frontend Server
```bash
cd frontend
npm run dev
```
Expected output:
```
  VITE v6.0.5  ready in XXX ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### 5. Test the Application

#### Homepage Test
1. Open `http://localhost:5173`
2. Should see movie grid with 4 sample movies
3. Navigation bar should show "Login" and "Sign Up" options

#### Registration Test
1. Click "Sign Up" in navbar
2. Fill form with test data:
   - Name: Test User
   - Email: test@example.com
   - Password: password123
3. Should redirect to login page

#### Login Test
1. Use the same credentials to login
2. Should redirect to dashboard
3. Navbar should now show "Welcome, Test User!"

#### Movie Browsing Test
1. Click "MovieBook" logo to go home
2. Click on any movie card
3. Should see movie details page
4. Click "Book Tickets" button

#### Showtime Selection Test
1. Should see available showtimes
2. Click on any showtime button
3. Seat selection modal should open

#### Seat Booking Test
1. Select 2-3 seats (green seats)
2. Should see total price calculation
3. Click "Book X Seats" button
4. Should see success message

#### Dashboard Test
1. Click profile icon in navbar
2. Click "Dashboard"
3. Should see user info and booking history

### 6. API Testing (Optional)

Test API endpoints directly:

```bash
# Get all movies
curl http://localhost:5000/api/movies/allMovie

# Get all theaters
curl http://localhost:5000/api/theaters

# Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"API Test","email":"api@test.com","password":"test123"}'
```

### 7. Common Issues and Solutions

#### MongoDB Connection Error
- Ensure MongoDB is running
- Check MONGO_URI in backend/.env
- Default: `mongodb://localhost:27017`

#### Port Already in Use
- Backend (5000): Change PORT in backend/.env
- Frontend (5173): Vite will automatically use next available port

#### CORS Errors
- Ensure backend server is running
- Check frontend API calls use correct backend URL

#### Seat Selection Not Working
- Check browser console for errors
- Ensure showtimes have seat data (run seed script)

### 8. Sample Data Overview

After seeding, you'll have:
- **4 Movies**: Avengers Endgame, Spider-Man, The Batman, Top Gun
- **3 Theaters**: AMC Empire 25 (NY), Regal LA Live (LA), Cinemark Century City (CA)
- **Showtimes**: 7 days of showtimes for each movie in each theater
- **Seats**: 100-150 seats per theater with proper layout

### 9. Expected Behavior

✅ **Working Features:**
- User registration and login
- Movie browsing and details
- Showtime viewing with filters
- Interactive seat selection
- Booking confirmation
- User dashboard
- Responsive design

⚠️ **Known Limitations:**
- No payment processing (shows success message)
- No email notifications
- Basic error handling
- Mock user data in dashboard
- No admin panel

### 10. Performance Notes

- Initial load may be slow due to image loading
- Seat selection modal handles up to 150 seats efficiently
- Database queries are optimized with proper indexing
- Frontend uses React's built-in optimization

This completes the basic testing of the Movie Ticket Booking System!
