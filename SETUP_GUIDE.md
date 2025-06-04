# MovieTicketBooking - Complete Setup Guide

## 🎬 New Features Implemented

### ✨ **External Movie API Integration (TMDB)**
- Real movie data from The Movie Database (TMDB)
- Popular, Now Playing, and Upcoming movies
- High-quality movie posters and backdrop images
- Detailed movie information including cast and crew

### 🔄 **Real-time Seat Selection**
- Live seat selection updates using Socket.IO
- See other users selecting seats in real-time
- Prevents double booking with temporary seat locks
- BookMyShow-style seat selection experience

### 🎨 **Modern Homepage Design**
- Beautiful gradient backgrounds and animations
- Framer Motion animations throughout
- Glass morphism effects and modern UI patterns
- Responsive design with mobile-first approach

## 🚀 Quick Start

### 1. **Get TMDB API Key**
1. Visit [TMDB Website](https://www.themoviedb.org/)
2. Create a free account
3. Go to Settings → API → Create API Key
4. Copy your API key

### 2. **Environment Setup**
Update `backend/.env` with your TMDB API key:
```env
MONGO_URI=mongodb://localhost:27017
PORT=5000
JWT_SECRET=your_jwt_secret_key
TMDB_API_KEY=your_actual_tmdb_api_key_here
TMDB_BASE_URL=https://api.themoviedb.org/3
```

### 3. **Install Dependencies**

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

### 4. **Start the Application**

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

## 🎯 New Features Guide

### **TMDB Movie Integration**

The app now fetches real movies from TMDB API with:
- **Now Playing**: Current movies in theaters
- **Popular**: Most popular movies
- **Upcoming**: Soon-to-be-released movies
- **Search**: Search functionality for movies

**API Endpoints:**
- `GET /api/movies/allMovie` - Now playing movies
- `GET /api/movies/popular` - Popular movies  
- `GET /api/movies/upcoming` - Upcoming movies
- `GET /api/movies/search?query=movie_name` - Search movies
- `GET /api/movies/:tmdbId` - Get movie details

### **Real-time Seat Selection**

**Features:**
- **Live Updates**: See other users selecting seats instantly
- **Temporary Locks**: Seats are temporarily locked when being selected
- **Auto-cleanup**: Abandoned selections are cleared after 5 minutes
- **Visual Indicators**: Different colors for different seat states

**Seat States:**
- 🟢 **Green**: Available seats
- 🔵 **Blue**: Your selected seats
- 🟠 **Orange**: Being selected by others (animated)
- 🔴 **Red**: Permanently booked seats

**How it works:**
1. User joins a showtime room via Socket.IO
2. Seat selections are broadcast to all users in the room
3. Temporary selections prevent conflicts
4. Final booking permanently reserves seats

### **Modern UI Components**

**Hero Section:**
- Full-screen movie backdrops
- Smooth slide transitions
- Interactive navigation arrows
- Auto-play with manual controls

**Trending Section:**
- Animated movie cards with hover effects
- 3D transform animations
- Gradient overlays and glow effects
- Staggered loading animations

**Movie Categories:**
- Tabbed interface with smooth transitions
- Real-time content switching
- Animated card grids
- Glass morphism design

**Seat Selection Modal:**
- Modern dark theme with gradients
- Real-time connection status
- Animated seat interactions
- Responsive grid layout

## 🛠 Technical Implementation

### **Socket.IO Integration**
```javascript
// Server-side events
socket.on('join-showtime', (showtimeId))
socket.on('select-seat', (data))
socket.on('deselect-seat', (data))

// Client-side events
socket.emit('seat-selected', (data))
socket.emit('seat-deselected', (data))
```

### **Framer Motion Animations**
```javascript
// Staggered children animation
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}
```

### **TMDB Service Architecture**
```javascript
// Centralized API service
class TMDBService {
  async getPopularMovies(page)
  async getNowPlayingMovies(page)
  async getUpcomingMovies(page)
  async getMovieDetails(movieId)
  async searchMovies(query, page)
}
```

## 🎨 Design System

### **Color Palette**
- **Primary**: Purple to Pink gradients
- **Background**: Dark gradients (gray-900 to purple-900)
- **Accents**: Blue, Green, Orange, Red for seat states
- **Text**: White, Gray variants for hierarchy

### **Animation Principles**
- **Entrance**: Fade in with slide up (y: 30)
- **Hover**: Scale (1.05) with smooth transitions
- **Stagger**: 0.1s delay between child elements
- **Duration**: 0.3-0.6s for most animations

### **Responsive Breakpoints**
- **Mobile**: < 640px (1-2 columns)
- **Tablet**: 640px - 1024px (2-3 columns)
- **Desktop**: > 1024px (4-5 columns)

## 🔧 Troubleshooting

### **TMDB API Issues**
- Verify API key is correct in `.env`
- Check API rate limits (1000 requests/day for free tier)
- Ensure internet connection for API calls

### **Socket.IO Connection Issues**
- Check if backend server is running on port 5000
- Verify CORS settings in server configuration
- Check browser console for connection errors

### **Animation Performance**
- Reduce `staggerChildren` delay if animations feel slow
- Use `will-change: transform` for better performance
- Consider `prefers-reduced-motion` for accessibility

## 📱 Mobile Optimization

- Touch-friendly seat selection
- Responsive grid layouts
- Optimized image loading
- Gesture-based navigation
- Reduced animation complexity on mobile

## 🚀 Production Deployment

### **Environment Variables**
```env
NODE_ENV=production
TMDB_API_KEY=your_production_api_key
MONGO_URI=your_production_mongodb_uri
JWT_SECRET=your_secure_jwt_secret
```

### **Performance Optimizations**
- Image lazy loading
- API response caching
- Socket.IO connection pooling
- Minified CSS/JS bundles

## 🎉 What's New Summary

1. **Real Movies**: Live data from TMDB instead of static data
2. **Real-time Features**: Live seat selection like BookMyShow
3. **Modern Design**: Beautiful animations and gradients
4. **Better UX**: Smooth transitions and interactive elements
5. **Mobile Ready**: Fully responsive design
6. **Production Ready**: Optimized for deployment

The application now provides a professional movie booking experience with real-time features and modern design patterns!
