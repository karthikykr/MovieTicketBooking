import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import MovieDetails from './pages/MovieDetails';
import MovieShowtimes from './pages/MovieShowtimes';
import Login from './pages/login';
import Signup from './pages/signUp';
import Dashboard from './pages/Dashboard';



function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/movie/:id" element={<MovieDetails />} />
        <Route path="/showtimes/:id" element={<MovieShowtimes />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
