# ⛩️ Anime Explorer

A React app to discover anime and manage your personal watchlist, powered by the [Jikan API](https://jikan.moe/) (unofficial MyAnimeList API).

> **Note:** This app is for information and tracking only — no streaming or downloads.

## ✨ Features

- 🏠 **Home** — Top Airing, Top All-Time & Current Season anime
- 🔍 **Search** — Find anime by title with filters (type, status, sort)
- 📄 **Details** — Full info, score, genres, synopsis & trailer
- 📋 **Watchlist** — Save anime, categorize (Watching, Completed, etc.), view stats
- 🌗 **Dark / Light Theme** — Toggle with auto system detection
- 💾 **Persistent** — Watchlist & theme saved in localStorage
- 📱 **Responsive** — Works on mobile, tablet & desktop

## Screenshot
![alt text](<Screenshot 2026-02-14 093732.png>)

## 🛠️ Tech Stack

- React + Vite
- React Router
- Axios
- Lucide React (icons)
- Vanilla CSS (custom properties + animations)

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Production build
npm run build
```

## 📁 Structure

```
src/
├── services/api.js         # Jikan API client
├── context/                # Watchlist & Theme providers
├── components/             # Navbar, AnimeCard
└── pages/                  # Home, Search, Details, Watchlist
```

## 📜 License: MIT
