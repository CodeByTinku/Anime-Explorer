import axios from 'axios';

const BASE_URL = 'https://api.jikan.moe/v4';

const jikanApi = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

// Simple rate-limit queue: Jikan allows ~3 requests/sec
let lastRequestTime = 0;
const MIN_INTERVAL = 350; // ms between requests

async function rateLimitedRequest(config) {
  const now = Date.now();
  const elapsed = now - lastRequestTime;
  if (elapsed < MIN_INTERVAL) {
    await new Promise((r) => setTimeout(r, MIN_INTERVAL - elapsed));
  }
  lastRequestTime = Date.now();
  return jikanApi(config);
}

// ---------- Top anime ----------
export async function getTopAnime(page = 1, limit = 12) {
  const { data } = await rateLimitedRequest({
    url: '/top/anime',
    params: { page, limit },
  });
  return data;
}

export async function getTopAiring(page = 1, limit = 12) {
  const { data } = await rateLimitedRequest({
    url: '/top/anime',
    params: { page, limit, filter: 'airing' },
  });
  return data;
}

export async function getUpcomingAnime(page = 1, limit = 12) {
  const { data } = await rateLimitedRequest({
    url: '/top/anime',
    params: { page, limit, filter: 'upcoming' },
  });
  return data;
}

// ---------- Seasonal ----------
export async function getCurrentSeason(page = 1, limit = 12) {
  const { data } = await rateLimitedRequest({
    url: '/seasons/now',
    params: { page, limit },
  });
  return data;
}

// ---------- Search ----------
export async function searchAnime(query, page = 1, limit = 20, filters = {}) {
  const { data } = await rateLimitedRequest({
    url: '/anime',
    params: { q: query, page, limit, ...filters },
  });
  return data;
}

// ---------- Single anime ----------
export async function getAnimeById(id) {
  const { data } = await rateLimitedRequest({ url: `/anime/${id}/full` });
  return data;
}

// ---------- Anime recommendations ----------
export async function getAnimeRecommendations(id) {
  const { data } = await rateLimitedRequest({
    url: `/anime/${id}/recommendations`,
  });
  return data;
}
