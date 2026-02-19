document.addEventListener("DOMContentLoaded", () => {
  const BACKEND_URL = "https://song-ranker-chi.vercel.app/api/spotify";
  const loginBtn = document.getElementById("loginBtn");

  // 1️⃣ Token aus URL holen (nach Login)
  const params = new URLSearchParams(window.location.search);
  const tokenFromUrl = params.get("token");

  if (tokenFromUrl) {
    // Token speichern
    localStorage.setItem("spotifyToken", tokenFromUrl);

    // URL bereinigen
    const cleanUrl = window.location.origin + window.location.pathname;
    window.history.replaceState({}, document.title, cleanUrl);
  }

  // 2️⃣ Prüfen, ob schon ein Token im Storage ist
  const token = localStorage.getItem("spotifyToken");

  if (token) {
    // Token existiert → Button ausblenden
    if (loginBtn) loginBtn.style.display = "none";

    // Direkt zur App-Seite weiterleiten
    if (window.location.pathname !== "/SongRanker/") {
      window.location.href = "/SongRanker/";
    }
  } else {
    // Kein Token → Login-Button aktiv lassen
    if (loginBtn) loginBtn.onclick = () => {
      window.location.href = BACKEND_URL;
    };
  }
});
