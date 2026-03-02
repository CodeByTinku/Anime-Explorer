import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const WatchlistContext = createContext();

const STORAGE_KEY = 'anime-explorer-watchlist';
const CATEGORIES = ['Plan to Watch', 'Watching', 'Completed', 'On Hold', 'Dropped'];

function loadWatchlist() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function WatchlistProvider({ children }) {
  const [watchlist, setWatchlist] = useState(loadWatchlist);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(watchlist));
  }, [watchlist]);

  const addToWatchlist = useCallback((anime, category = 'Plan to Watch') => {
    setWatchlist((prev) => {
      if (prev.some((a) => a.mal_id === anime.mal_id)) return prev;
      return [
        ...prev,
        {
          mal_id: anime.mal_id,
          title: anime.title,
          title_english: anime.title_english,
          images: anime.images,
          score: anime.score,
          type: anime.type,
          episodes: anime.episodes,
          status: anime.status,
          year: anime.year || anime.aired?.prop?.from?.year,
          category,
          addedAt: Date.now(),
        },
      ];
    });
  }, []);

  const removeFromWatchlist = useCallback((malId) => {
    setWatchlist((prev) => prev.filter((a) => a.mal_id !== malId));
  }, []);

  const updateCategory = useCallback((malId, category) => {
    setWatchlist((prev) =>
      prev.map((a) => (a.mal_id === malId ? { ...a, category } : a))
    );
  }, []);

  const isInWatchlist = useCallback(
    (malId) => watchlist.some((a) => a.mal_id === malId),
    [watchlist]
  );

  const getStats = useCallback(() => {
    const stats = { total: watchlist.length };
    CATEGORIES.forEach((cat) => {
      stats[cat] = watchlist.filter((a) => a.category === cat).length;
    });
    return stats;
  }, [watchlist]);

  return (
    <WatchlistContext.Provider
      value={{
        watchlist,
        addToWatchlist,
        removeFromWatchlist,
        updateCategory,
        isInWatchlist,
        getStats,
        CATEGORIES,
      }}
    >
      {children}
    </WatchlistContext.Provider>
  );
}

export function useWatchlist() {
  const ctx = useContext(WatchlistContext);
  if (!ctx) throw new Error('useWatchlist must be used within WatchlistProvider');
  return ctx;
}
