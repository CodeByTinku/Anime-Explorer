import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search as SearchIcon, Filter, AlertCircle } from 'lucide-react';
import { searchAnime } from '../services/api';
import AnimeCard from '../components/AnimeCard';
import './SearchResults.css';

export default function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [localQuery, setLocalQuery] = useState(query);

  // Filters
  const [type, setType] = useState('');
  const [status, setStatus] = useState('');
  const [orderBy, setOrderBy] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    setLocalQuery(query);
    setPage(1);
  }, [query]);

  useEffect(() => {
    if (!query) return;
    let cancelled = false;
    setLoading(true);
    setError(null);

    const filters = {};
    if (type) filters.type = type;
    if (status) filters.status = status;
    if (orderBy) filters.order_by = orderBy;
    if (orderBy) filters.sort = 'desc';

    searchAnime(query, page, 20, filters)
      .then((res) => {
        if (!cancelled) {
          setResults(res.data || []);
          setPagination(res.pagination);
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [query, page, type, status, orderBy]);

  const handleSearch = (e) => {
    e.preventDefault();
    const trimmed = localQuery.trim();
    if (trimmed) {
      setSearchParams({ q: trimmed });
    }
  };

  return (
    <div className="page-container">
      {/* Search header */}
      <div className="search-header fade-in-up">
        <h1 className="heading-lg">
          <SearchIcon size={24} />
          {query ? (
            <>
              Results for "<span className="text-gradient">{query}</span>"
            </>
          ) : (
            'Search Anime'
          )}
        </h1>

        <form className="search-form" onSubmit={handleSearch}>
          <div className="search-input-wrap">
            <SearchIcon size={18} className="search-form-icon" />
            <input
              type="text"
              placeholder="Type an anime name..."
              value={localQuery}
              onChange={(e) => setLocalQuery(e.target.value)}
              className="search-form-input"
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Search
          </button>
          <button
            type="button"
            className={`btn btn-outline btn-icon ${showFilters ? 'active' : ''}`}
            onClick={() => setShowFilters(!showFilters)}
            title="Toggle filters"
          >
            <Filter size={18} />
          </button>
        </form>

        {/* Filters */}
        {showFilters && (
          <div className="search-filters fade-in">
            <select
              value={type}
              onChange={(e) => { setType(e.target.value); setPage(1); }}
              className="filter-select"
            >
              <option value="">All Types</option>
              <option value="tv">TV</option>
              <option value="movie">Movie</option>
              <option value="ova">OVA</option>
              <option value="special">Special</option>
              <option value="ona">ONA</option>
              <option value="music">Music</option>
            </select>
            <select
              value={status}
              onChange={(e) => { setStatus(e.target.value); setPage(1); }}
              className="filter-select"
            >
              <option value="">All Status</option>
              <option value="airing">Airing</option>
              <option value="complete">Completed</option>
              <option value="upcoming">Upcoming</option>
            </select>
            <select
              value={orderBy}
              onChange={(e) => { setOrderBy(e.target.value); setPage(1); }}
              className="filter-select"
            >
              <option value="">Default Order</option>
              <option value="score">Score</option>
              <option value="popularity">Popularity</option>
              <option value="start_date">Newest</option>
              <option value="episodes">Episodes</option>
            </select>
          </div>
        )}

        {pagination && !loading && (
          <p className="results-count">
            {pagination.items?.total?.toLocaleString() || 0} results found
          </p>
        )}
      </div>

      {/* Results */}
      {loading ? (
        <div className="anime-grid">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="skeleton-card-wrap">
              <div className="skeleton skeleton-card" />
              <div className="skeleton skeleton-text" />
              <div className="skeleton skeleton-text-sm" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="status-message">
          <div className="icon">⚠️</div>
          <h3>Something went wrong</h3>
          <p>{error}</p>
        </div>
      ) : results.length === 0 && query ? (
        <div className="status-message">
          <div className="icon">🔍</div>
          <h3>No results found</h3>
          <p>Try adjusting your search or filters.</p>
        </div>
      ) : !query ? (
        <div className="status-message">
          <div className="icon">✨</div>
          <h3>Start searching</h3>
          <p>Enter an anime title to find results.</p>
        </div>
      ) : (
        <>
          <div className="anime-grid stagger">
            {results.map((a, i) => (
              <AnimeCard key={a.mal_id} anime={a} index={i} />
            ))}
          </div>

          {/* Pagination */}
          {pagination && pagination.last_visible_page > 1 && (
            <div className="pagination">
              <button
                className="btn btn-outline btn-sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Previous
              </button>
              <span className="pagination-info">
                Page {page} of {pagination.last_visible_page}
              </span>
              <button
                className="btn btn-outline btn-sm"
                disabled={!pagination.has_next_page}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
