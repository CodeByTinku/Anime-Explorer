import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Flame, Calendar, ChevronRight, Sparkles } from 'lucide-react';
import { getTopAnime, getTopAiring, getCurrentSeason } from '../services/api';
import AnimeCard from '../components/AnimeCard';
import './Home.css';

function SkeletonGrid({ count = 6 }) {
  return (
    <div className="anime-grid">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="skeleton-card-wrap">
          <div className="skeleton skeleton-card" />
          <div className="skeleton skeleton-text" />
          <div className="skeleton skeleton-text-sm" />
        </div>
      ))}
    </div>
  );
}

export default function Home() {
  const [topAnime, setTopAnime] = useState([]);
  const [airing, setAiring] = useState([]);
  const [seasonal, setSeasonal] = useState([]);
  const [loading, setLoading] = useState({
    top: true,
    airing: true,
    seasonal: true,
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    async function fetchData() {
      // Fetch sequentially to respect rate limits
      try {
        const topRes = await getTopAnime(1, 12);
        setTopAnime(topRes.data || []);
      } catch (err) {
        setErrors((p) => ({ ...p, top: err.message }));
      }
      setLoading((p) => ({ ...p, top: false }));

      try {
        const airingRes = await getTopAiring(1, 12);
        setAiring(airingRes.data || []);
      } catch (err) {
        setErrors((p) => ({ ...p, airing: err.message }));
      }
      setLoading((p) => ({ ...p, airing: false }));

      try {
        const seasonRes = await getCurrentSeason(1, 12);
        setSeasonal(seasonRes.data || []);
      } catch (err) {
        setErrors((p) => ({ ...p, seasonal: err.message }));
      }
      setLoading((p) => ({ ...p, seasonal: false }));
    }

    fetchData();
  }, []);

  return (
    <div className="page-container">
      {/* Hero */}
      <section className="hero fade-in-up">
        <div className="hero-content">
          <h1 className="heading-xl">
            Discover Your Next{' '}
            <span className="text-gradient">Favorite Anime</span>
          </h1>
          <p className="hero-subtitle">
            Browse thousands of anime titles, track your progress, and build
            your perfect watchlist — all powered by MyAnimeList data.
          </p>
          <div className="hero-badges">
            <span className="badge badge-primary">
              <Sparkles size={14} /> Powered by Jikan API
            </span>
            <span className="badge badge-accent">
              <TrendingUp size={14} /> 60,000+ Titles
            </span>
          </div>
        </div>
      </section>

      {/* Top Airing */}
      <section className="section">
        <div className="section-header">
          <h2 className="heading-lg">
            <Flame size={24} className="section-icon flame" />
            Top Airing
          </h2>
          <Link to="/search?filter=airing" className="btn btn-outline btn-sm">
            View All <ChevronRight size={16} />
          </Link>
        </div>
        {loading.airing ? (
          <SkeletonGrid />
        ) : errors.airing ? (
          <div className="status-message">
            <p>Failed to load airing anime.</p>
          </div>
        ) : (
          <div className="anime-grid stagger">
            {airing.map((a, i) => (
              <AnimeCard key={a.mal_id} anime={a} index={i} />
            ))}
          </div>
        )}
      </section>

      {/* Top All-Time */}
      <section className="section">
        <div className="section-header">
          <h2 className="heading-lg">
            <TrendingUp size={24} className="section-icon trending" />
            Top All-Time
          </h2>
          <Link to="/search?filter=bypopularity" className="btn btn-outline btn-sm">
            View All <ChevronRight size={16} />
          </Link>
        </div>
        {loading.top ? (
          <SkeletonGrid />
        ) : errors.top ? (
          <div className="status-message">
            <p>Failed to load top anime.</p>
          </div>
        ) : (
          <div className="anime-grid stagger">
            {topAnime.map((a, i) => (
              <AnimeCard key={a.mal_id} anime={a} index={i} />
            ))}
          </div>
        )}
      </section>

      {/* Current Season */}
      <section className="section">
        <div className="section-header">
          <h2 className="heading-lg">
            <Calendar size={24} className="section-icon calendar" />
            This Season
          </h2>
          <Link to="/search?filter=upcoming" className="btn btn-outline btn-sm">
            Upcoming <ChevronRight size={16} />
          </Link>
        </div>
        {loading.seasonal ? (
          <SkeletonGrid />
        ) : errors.seasonal ? (
          <div className="status-message">
            <p>Failed to load seasonal anime.</p>
          </div>
        ) : (
          <div className="anime-grid stagger">
            {seasonal.map((a, i) => (
              <AnimeCard key={a.mal_id} anime={a} index={i} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
