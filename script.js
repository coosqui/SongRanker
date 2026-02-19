const BACKEND_URL = "/api/spotify";

// LOGIN BUTTON
document.getElementById("loginBtn").onclick = () => {
  window.location.href = BACKEND_URL;
};

// HANDLE REDIRECT TOKEN
const params = new URLSearchParams(window.location.search);
const token = params.get("token");

if (token) {
  localStorage.setItem("spotifyToken", token);
  window.history.replaceState({}, document.title, "/");
  location.reload();
}
