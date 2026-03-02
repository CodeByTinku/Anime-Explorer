import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Heart,
  Trash2,
  Eye,
  CheckCircle,
  Clock,
  Pause,
  XCircle,
  BarChart3,
  Star,
  Film,
  Filter,
} from 'lucide-react';
import { useWatchlist } from '../context/WatchlistContext';
import './Watchlist.css';

const CATEGORY_ICONS = {
  'Plan to Watch': <Clock size={14} />,
  Watching: <Eye size={14} />,
  Completed: <CheckCircle size={14} />,
  'On Hold': <Pause size={14} />,
  Dropped: <XCircle size={14} />,
};

const CATEGORY_COLORS = {
  'Plan to Watch': 'badge-primary',
  Watching: 'badge-success',
  Completed: 'badge-accent',
  'On Hold': 'badge-warning',
  Dropped: 'badge-danger',
};

export default function Watchlist() {
  const {
    watchlist,
    removeFromWatchlist,
    updateCategory,
    getStats,
    CATEGORIES,
  } = useWatchlist();

  const [activeFilter, setActiveFilter] = useState('All');
  const stats = getStats();

  const filtered = useMemo(() => {
    if (activeFilter === 'All') return watchlist;
    return watchlist.filter((a) => a.category === activeFilter);
  }, [watchlist, activeFilter]);

  return (
    <div className="page-container">
      {/* Header */}
      <div className="watchlist-header fade-in-up">
        <h1 className="heading-lg">
          <Heart size={24} className="text-gradient-icon" />
          My Watchlist
        </h1>
        <p className="watchlist-subtitle">
          {watchlist.length === 0
            ? 'Your watchlist is empty. Start exploring anime and add some!'
            : `You have ${watchlist.length} anime in your watchlist.`}
        </p>
      </div>

      {watchlist.length > 0 && (
        <>
          {/* Stats cards */}
          <div className="stats-grid fade-in-up">
            <div className="stat-card stat-total">
              <div className="stat-card-icon">
                <Film size={20} />
              </div>
              <div className="stat-card-info">
                <span className="stat-card-value">{stats.total}</span>
                <span className="stat-card-label">Total</span>
              </div>
            </div>
            {CATEGORIES.map((cat) => (
              <div key={cat} className={`stat-card stat-${cat.toLowerCase().replace(/\s/g, '-')}`}>
                <div className="stat-card-icon">{CATEGORY_ICONS[cat]}</div>
                <div className="stat-card-info">
                  <span className="stat-card-value">{stats[cat] || 0}</span>
                  <span className="stat-card-label">{cat}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="watchlist-filters fade-in">
            <button
              className={`filter-chip ${activeFilter === 'All' ? 'active' : ''}`}
              onClick={() => setActiveFilter('All')}
            >
              <Filter size={14} /> All ({watchlist.length})
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`filter-chip ${activeFilter === cat ? 'active' : ''}`}
                onClick={() => setActiveFilter(cat)}
              >
                {CATEGORY_ICONS[cat]} {cat} ({stats[cat] || 0})
              </button>
            ))}
          </div>

          {/* List */}
          {filtered.length === 0 ? (
            <div className="status-message">
              <div className="icon">📭</div>
              <h3>No anime in this category</h3>
              <p>Try selecting a different filter.</p>
            </div>
          ) : (
            <div className="watchlist-list stagger">
              {filtered.map((anime) => {
                const imageUrl =
                  anime.images?.webp?.large_image_url ||
                  anime.images?.jpg?.large_image_url ||
                  anime.images?.jpg?.image_url;

                return (
                  <div key={anime.mal_id} className="watchlist-item fade-in-up">
                    <Link
                      to={`/anime/${anime.mal_id}`}
                      className="watchlist-item-poster"
                    >
                      <img src={imageUrl} alt={anime.title} loading="lazy" />
                    </Link>
                    <div className="watchlist-item-info">
                      <Link
                        to={`/anime/${anime.mal_id}`}
                        className="watchlist-item-title"
                      >
                        {anime.title}
                      </Link>
                      <div className="watchlist-item-meta">
                        {anime.type && <span className="badge badge-primary">{anime.type}</span>}
                        {anime.score && (
                          <span className="badge badge-primary">
                            <Star size={10} fill="#fdcb6e" stroke="#fdcb6e" />{' '}
                            {anime.score}
                          </span>
                        )}
                        {anime.episodes && (
                          <span className="badge badge-primary">
                            {anime.episodes} eps
                          </span>
                        )}
                        {anime.year && (
                          <span className="badge badge-primary">{anime.year}</span>
                        )}
                      </div>

                      {/* Category select */}
                      <div className="watchlist-item-actions">
                        <select
                          value={anime.category}
                          onChange={(e) =>
                            updateCategory(anime.mal_id, e.target.value)
                          }
                          className="category-select"
                        >
                          {CATEGORIES.map((cat) => (
                            <option key={cat} value={cat}>
                              {cat}
                            </option>
                          ))}
                        </select>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => removeFromWatchlist(anime.mal_id)}
                        >
                          <Trash2 size={14} /> Remove
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {watchlist.length === 0 && (
        <div className="watchlist-empty fade-in-up">
          <div className="empty-illustration">💫</div>
          <h2>Nothing here yet!</h2>
          <p>
            Start exploring anime and click the{' '}
            <strong>Add to Watchlist</strong> button on any anime to begin
            tracking.
          </p>
          <Link to="/" className="btn btn-primary btn-lg">
            Explore Anime
          </Link>
        </div>
      )}
    </div>
  );
}
