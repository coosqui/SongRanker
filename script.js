const BACKEND_URL = "https://song-ranker-chi.vercel.app/api/spotify";

// 1️⃣ Token aus URL abholen
const params = new URLSearchParams(window.location.search);
const token = params.get("token");

if (token) {
  // Token speichern
  localStorage.setItem("spotifyToken", token);

  // URL bereinigen (ohne Reload)
  const cleanUrl = window.location.origin + window.location.pathname;
  window.history.replaceState({}, document.title, cleanUrl);

  // App laden
  window.location.href = "/SongRanker/";
}

// 2️⃣ Login Button
document.getElementById("loginBtn").onclick = () => {
  // Vercel Backend aufrufen, das den OAuth Flow startet
  window.location.href = BACKEND_URL;
};
