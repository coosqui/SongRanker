document.addEventListener("DOMContentLoaded", () => {
  const BACKEND_URL = "https://song-ranker-chi.vercel.app/api/spotify";
  const loginBtn = document.getElementById("loginBtn");

  // Optional: Logout-Button erstellen, falls noch nicht im HTML
  let logoutBtn = document.getElementById("logoutBtn");
  if (!logoutBtn) {
    logoutBtn = document.createElement("button");
    logoutBtn.id = "logoutBtn";
    logoutBtn.textContent = "Logout";
    logoutBtn.style.margin = "10px";
    logoutBtn.style.padding = "10px 20px";
    logoutBtn.style.fontSize = "16px";
    document.body.appendChild(logoutBtn);
  }

  // 1️⃣ Token aus URL holen
  const params = new URLSearchParams(window.location.search);
  const tokenFromUrl = params.get("token");

  if (tokenFromUrl) {
    localStorage.setItem("spotifyToken", tokenFromUrl);
    // URL bereinigen
    const cleanUrl = window.location.origin + window.location.pathname;
    window.history.replaceState({}, document.title, cleanUrl);
  }

  // 2️⃣ Prüfen, ob Token existiert
  const token = localStorage.getItem("spotifyToken");

  if (token) {
    // Token existiert → Button ausblenden
    if (loginBtn) loginBtn.style.display = "none";

    // Logout-Button sichtbar machen
    logoutBtn.style.display = "inline-block";

    // Optional: direkt zur App-Seite, falls noch nicht dort
    if (window.location.pathname !== "/SongRanker/") {
      window.location.href = "/SongRanker/";
    }
  } else {
    // Kein Token → Login-Button sichtbar
    if (loginBtn) loginBtn.style.display = "inline-block";
    if (loginBtn) loginBtn.onclick = () => {
      window.location.href = BACKEND_URL;
    };

    // Logout-Button ausblenden
    logoutBtn.style.display = "none";
  }

  // 3️⃣ Logout-Funktion
  logoutBtn.onclick = () => {
    localStorage.removeItem("spotifyToken"); // Token löschen
    window.location.href = "/SongRanker/";    // Optional: Seite neu laden oder zurück zur Login-Seite
  };
});
