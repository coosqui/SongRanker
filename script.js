const BACKEND_URL = "https://song-ranker-chi.vercel.app/";

document.getElementById("loginBtn").onclick = () => {
  window.location = BACKEND_URL;
};


// Handle callback with code
const urlParams = new URLSearchParams(window.location.search);
const code = urlParams.get("code");

if (code) {
  fetch(`${BACKEND_URL}?code=${code}`)
    .then(res => res.json())
    .then(data => {
      localStorage.setItem("spotifyToken", data.access_token);
      window.history.replaceState({}, document.title, "/");
      location.reload();
    });
}
