document.addEventListener("DOMContentLoaded", () => {
  const BACKEND_URL = "https://song-ranker-chi.vercel.app/api/spotify";

  // 1️⃣ Token aus URL holen
  const params = new URLSearchParams(window.location.search);
  const tokenFromUrl = params.get("token");

  if (tokenFromUrl) {
    // Token speichern
    localStorage.setItem("spotifyToken", tokenFromUrl);

    // URL bereinigen (ohne Reload)
    const cleanUrl = window.location.origin + window.location.pathname;
    window.history.replaceState({}, document.title, cleanUrl);
  }

  // 2️⃣ Prüfen, ob schon ein Token im Storage ist
  const token = localStorage.getItem("spotifyToken");
  const loginBtn = document.getElementById("loginBtn");

  if (token) {
    // Token existiert → Button ausblenden
    if (loginBtn) loginBtn.style.display = "none";
  } else {
    // Kein Token → Login-Button aktiv lassen
    if (loginBtn) loginBtn.onclick = () => {
      window.location.href = BACKEND_URL;
    };
  }
});
