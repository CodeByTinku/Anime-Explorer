import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { WatchlistProvider } from './context/WatchlistContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import SearchResults from './pages/SearchResults';
import AnimeDetails from './pages/AnimeDetails';
import Watchlist from './pages/Watchlist';
import './App.css';

export default function App() {
  return (
    <ThemeProvider>
      <WatchlistProvider>
        <BrowserRouter>
          <div className="app-container">
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/search" element={<SearchResults />} />
              <Route path="/anime/:id" element={<AnimeDetails />} />
              <Route path="/watchlist" element={<Watchlist />} />
            </Routes>
            <footer className="app-footer">
              <p>
                Powered by{' '}
                <a
                  href="https://jikan.moe/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Jikan API
                </a>{' '}
                · Built with React · For informational purposes only
              </p>
            </footer>
          </div>
        </BrowserRouter>
      </WatchlistProvider>
    </ThemeProvider>
  );
}
