import { Link } from 'react-router-dom';
import { Star, Play, Plus, Check } from 'lucide-react';
import { useWatchlist } from '../context/WatchlistContext';
import './AnimeCard.css';

export default function AnimeCard({ anime, index = 0 }) {
  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useWatchlist();
  const inList = isInWatchlist(anime.mal_id);

  const imageUrl =
    anime.images?.webp?.large_image_url ||
    anime.images?.jpg?.large_image_url ||
    anime.images?.jpg?.image_url;

  const year =
    anime.year || anime.aired?.prop?.from?.year || '';

  const handleWatchlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (inList) {
      removeFromWatchlist(anime.mal_id);
    } else {
      addToWatchlist(anime);
    }
  };

  return (
    <Link
      to={`/anime/${anime.mal_id}`}
      className="anime-card"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="card-image-wrapper">
        <img
          src={imageUrl}
          alt={anime.title}
          className="card-image"
          loading="lazy"
        />
        <div className="card-overlay">
          <button
            className={`card-watchlist-btn ${inList ? 'in-list' : ''}`}
            onClick={handleWatchlistClick}
            title={inList ? 'Remove from watchlist' : 'Add to watchlist'}
          >
            {inList ? <Check size={18} /> : <Plus size={18} />}
          </button>
          <div className="card-play-hint">
            <Play size={32} fill="#fff" />
          </div>
        </div>
        {anime.score && (
          <div className="card-score">
            <Star size={12} fill="#fdcb6e" stroke="#fdcb6e" />
            <span>{anime.score}</span>
          </div>
        )}
        {anime.type && <span className="card-type">{anime.type}</span>}
      </div>
      <div className="card-info">
        <h3 className="card-title">{anime.title}</h3>
        <div className="card-meta">
          {year && <span>{year}</span>}
          {anime.episodes && <span>{anime.episodes} eps</span>}
        </div>
      </div>
    </Link>
  );
}
