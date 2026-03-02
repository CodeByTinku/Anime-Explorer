import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Star,
  Trophy,
  Users,
  Tv,
  Clock,
  Tag,
  Plus,
  Check,
  ArrowLeft,
  Heart,
  Calendar,
  Film,
  BarChart3,
} from 'lucide-react';
import { getAnimeById } from '../services/api';
import { useWatchlist } from '../context/WatchlistContext';
import './AnimeDetails.css';

export default function AnimeDetails() {
  const { id } = useParams();
  const [anime, setAnime] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isInWatchlist, addToWatchlist, removeFromWatchlist, CATEGORIES } =
    useWatchlist();

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    getAnimeById(id)
      .then((res) => {
        if (!cancelled) setAnime(res.data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    window.scrollTo(0, 0);
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="page-container">
        <div className="detail-skeleton fade-in">
          <div className="detail-skeleton-poster skeleton" />
          <div className="detail-skeleton-info">
            <div className="skeleton" style={{ height: 36, width: '70%', borderRadius: 8 }} />
            <div className="skeleton" style={{ height: 20, width: '40%', borderRadius: 6, marginTop: 12 }} />
            <div className="skeleton" style={{ height: 16, width: '100%', borderRadius: 4, marginTop: 24 }} />
            <div className="skeleton" style={{ height: 16, width: '100%', borderRadius: 4, marginTop: 8 }} />
            <div className="skeleton" style={{ height: 16, width: '80%', borderRadius: 4, marginTop: 8 }} />
            <div className="skeleton" style={{ height: 16, width: '60%', borderRadius: 4, marginTop: 8 }} />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="status-message">
          <div className="icon">⚠️</div>
          <h3>Failed to load anime details</h3>
          <p>{error}</p>
          <Link to="/" className="btn btn-primary" style={{ marginTop: 16 }}>
            <ArrowLeft size={16} /> Go Home
          </Link>
        </div>
      </div>
    );
  }

  if (!anime) return null;

  const imageUrl =
    anime.images?.webp?.large_image_url ||
    anime.images?.jpg?.large_image_url;
  const inList = isInWatchlist(anime.mal_id);
  const titleEn = anime.title_english;
  const titleJp = anime.title_japanese;

  return (
    <div className="page-container">
      <Link to="/" className="back-link fade-in">
        <ArrowLeft size={18} /> Back
      </Link>

      <div className="detail-layout fade-in-up">
        {/* Poster side */}
        <div className="detail-poster-col">
          <div className="detail-poster-wrap">
            <img src={imageUrl} alt={anime.title} className="detail-poster" />
            {anime.score && (
              <div className="detail-poster-score">
                <Star size={16} fill="#fdcb6e" stroke="#fdcb6e" />
                <span>{anime.score}</span>
              </div>
            )}
          </div>

          {/* Watchlist button */}
          <button
            className={`btn ${inList ? 'btn-danger' : 'btn-primary'} btn-lg detail-watchlist-btn`}
            onClick={() =>
              inList
                ? removeFromWatchlist(anime.mal_id)
                : addToWatchlist(anime)
            }
          >
            {inList ? (
              <>
                <Check size={18} /> Remove from Watchlist
              </>
            ) : (
              <>
                <Plus size={18} /> Add to Watchlist
              </>
            )}
          </button>

          {/* Quick stats - mobile hidden, shown on desktop */}
          <div className="detail-quick-stats">
            {anime.rank && (
              <div className="quick-stat">
                <Trophy size={16} className="stat-icon gold" />
                <span>Rank #{anime.rank}</span>
              </div>
            )}
            {anime.popularity && (
              <div className="quick-stat">
                <BarChart3 size={16} className="stat-icon purple" />
                <span>Popularity #{anime.popularity}</span>
              </div>
            )}
            {anime.members && (
              <div className="quick-stat">
                <Users size={16} className="stat-icon blue" />
                <span>{anime.members.toLocaleString()} members</span>
              </div>
            )}
            {anime.favorites && (
              <div className="quick-stat">
                <Heart size={16} className="stat-icon pink" />
                <span>{anime.favorites.toLocaleString()} favorites</span>
              </div>
            )}
          </div>
        </div>

        {/* Info side */}
        <div className="detail-info-col">
          <h1 className="detail-title">{anime.title}</h1>
          {titleEn && titleEn !== anime.title && (
            <p className="detail-title-alt">{titleEn}</p>
          )}
          {titleJp && (
            <p className="detail-title-jp">{titleJp}</p>
          )}

          {/* Meta tags */}
          <div className="detail-meta-tags">
            {anime.type && (
              <span className="badge badge-primary">
                <Tv size={12} /> {anime.type}
              </span>
            )}
            {anime.episodes && (
              <span className="badge badge-primary">
                <Film size={12} /> {anime.episodes} episodes
              </span>
            )}
            {anime.status && (
              <span
                className={`badge ${
                  anime.status === 'Currently Airing'
                    ? 'badge-success'
                    : anime.status === 'Not yet aired'
                    ? 'badge-warning'
                    : 'badge-accent'
                }`}
              >
                <Clock size={12} /> {anime.status}
              </span>
            )}
            {anime.duration && (
              <span className="badge badge-primary">
                <Clock size={12} /> {anime.duration}
              </span>
            )}
            {anime.season && anime.year && (
              <span className="badge badge-primary">
                <Calendar size={12} /> {anime.season} {anime.year}
              </span>
            )}
            {anime.rating && (
              <span className="badge badge-warning">
                {anime.rating}
              </span>
            )}
          </div>

          {/* Genres */}
          {anime.genres?.length > 0 && (
            <div className="detail-genres">
              <h3 className="detail-label">
                <Tag size={16} /> Genres
              </h3>
              <div className="genre-list">
                {anime.genres.map((g) => (
                  <span key={g.mal_id} className="genre-chip">
                    {g.name}
                  </span>
                ))}
                {anime.themes?.map((t) => (
                  <span key={t.mal_id} className="genre-chip theme-chip">
                    {t.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Score stats */}
          <div className="detail-score-section">
            <div className="score-big">
              <Star size={28} fill="#fdcb6e" stroke="#fdcb6e" />
              <span className="score-value">{anime.score || 'N/A'}</span>
              <span className="score-max">/ 10</span>
            </div>
            {anime.scored_by && (
              <span className="score-votes">
                {anime.scored_by.toLocaleString()} votes
              </span>
            )}
          </div>

          {/* Synopsis */}
          {anime.synopsis && (
            <div className="detail-synopsis">
              <h3 className="detail-label">Synopsis</h3>
              <p>{anime.synopsis}</p>
            </div>
          )}

          {/* Background */}
          {anime.background && (
            <div className="detail-background">
              <h3 className="detail-label">Background</h3>
              <p>{anime.background}</p>
            </div>
          )}

          {/* Studios & Producers */}
          <div className="detail-extra-info">
            {anime.studios?.length > 0 && (
              <div className="extra-info-item">
                <span className="extra-label">Studios</span>
                <span>{anime.studios.map((s) => s.name).join(', ')}</span>
              </div>
            )}
            {anime.producers?.length > 0 && (
              <div className="extra-info-item">
                <span className="extra-label">Producers</span>
                <span>{anime.producers.map((p) => p.name).join(', ')}</span>
              </div>
            )}
            {anime.source && (
              <div className="extra-info-item">
                <span className="extra-label">Source</span>
                <span>{anime.source}</span>
              </div>
            )}
            {anime.aired?.string && (
              <div className="extra-info-item">
                <span className="extra-label">Aired</span>
                <span>{anime.aired.string}</span>
              </div>
            )}
          </div>

          {/* Trailer */}
          {anime.trailer?.embed_url && (
            <div className="detail-trailer">
              <h3 className="detail-label">Trailer</h3>
              <div className="trailer-wrap">
                <iframe
                  src={anime.trailer.embed_url}
                  title="Trailer"
                  allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
