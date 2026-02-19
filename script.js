document.addEventListener("DOMContentLoaded", () => {
  const BACKEND_URL = "https://song-ranker-chi.vercel.app/api/spotify";
  const loginBtn = document.getElementById("loginBtn");
  const logoutBtn = document.getElementById("logoutBtn");

  const params = new URLSearchParams(window.location.search);
  const accessToken = params.get("access_token");
  const refreshToken = params.get("refresh_token");

  if (accessToken) localStorage.setItem("spotifyToken", accessToken);
  if (refreshToken) localStorage.setItem("spotifyRefreshToken", refreshToken);

  // URL bereinigen
  window.history.replaceState({}, document.title, window.location.pathname);

  const token = localStorage.getItem("spotifyToken");
  const refresh = localStorage.getItem("spotifyRefreshToken");

  // Auto-Redirect & Button Management
  if (token) {
    if (loginBtn) loginBtn.style.display = "none";
    if (logoutBtn) logoutBtn.style.display = "inline-block";

    if (window.location.pathname !== "/SongRanker/") {
      window.location.href = "/SongRanker/";
    }

    // Optionally: Refresh Access Token nach Ablauf
    const TOKEN_EXPIRE_TIME = 3500 * 1000; // Spotify ~3600s, wir refreshen nach 3500s
    setTimeout(async () => {
      if (refresh) {
        const res = await fetch(`${BACKEND_URL}?refresh=${refresh}`);
        const data = await res.json();
        if (data.access_token) localStorage.setItem("spotifyToken", data.access_token);
        // optional: Seite neu laden oder API Calls fortsetzen
      }
    }, TOKEN_EXPIRE_TIME);
  } else {
    if (loginBtn) {
      loginBtn.style.display = "inline-block";
      loginBtn.onclick = () => (window.location.href = BACKEND_URL);
    }
    if (logoutBtn) logoutBtn.style.display = "none";
  }

  if (logoutBtn) {
    logoutBtn.onclick = () => {
      localStorage.removeItem("spotifyToken");
      localStorage.removeItem("spotifyRefreshToken");
      window.location.href = "/SongRanker/";
    };
  }
});
