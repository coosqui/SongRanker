console.log("JavaScript is running");

// ------------------- Spotify Login -------------------
const CLIENT_ID = "ebfc630b5e9d46d7aca0d68e8f4045a1";
const REDIRECT_URI = "https://coosqui.github.io/SongRanker/callback.html";
const SCOPES = "playlist-read-private playlist-modify-private";

document.getElementById("loginBtn").onclick = () => {
const url =
  "https://accounts.spotify.com/authorize" +
  "?response_type=token" +
  "&client_id=" + CLIENT_ID +
  "&scope=" + encodeURIComponent(SCOPES) +
  "&redirect_uri=" + encodeURIComponent(REDIRECT_URI);
window.location = url;
};

// ------------------- Variables -------------------
let songs = [];
let left, right;
let comparisons = 0;
const MAX_COMPARISONS = 50;
const pairHistory = {};

const leftBtn = document.getElementById("leftBtn");
const rightBtn = document.getElementById("rightBtn");

// ------------------- Helpers -------------------
function pairKey(a, b) {
  return [a.name, b.name].sort().join("|");
}

function updateElo(winner, loser) {
  const K = 16;
  const expectedWinner = 1 / (1 + Math.pow(10, (loser.rating - winner.rating) / 400));
  const expectedLoser = 1 / (1 + Math.pow(10, (winner.rating - loser.rating) / 400));
  winner.rating += K * (1 - expectedWinner);
  loser.rating += K * (0 - expectedLoser);
}

// ------------------- Spotify API -------------------
async function fetchUserPlaylists() {
  const token = localStorage.getItem("spotifyToken");
  if (!token) return [];
  const res = await fetch("https://api.spotify.com/v1/me/playlists", {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  return data.items;
}

async function fetchSpotifyTracks(playlistId) {
  const token = localStorage.getItem("spotifyToken");
  if (!token) return [];
  const res = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  return data.items.map(item => ({
    name: item.track.name,
    artist: item.track.artists.map(a => a.name).join(", "),
    rating: 1000,
    id: item.track.id
  }));
}

async function createRankedPlaylist(playlistName) {
  const token = localStorage.getItem("spotifyToken");
  if (!token) return alert("Please log in first.");

  const userRes = await fetch("https://api.spotify.com/v1/me", {
    headers: { Authorization: `Bearer ${token}` },
  });
  const userData = await userRes.json();
  const userId = userData.id;

  const playlistRes = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ name: playlistName, description: "Ranked by Song Ranker App", public: false })
  });
  const playlistData = await playlistRes.json();
  const playlistId = playlistData.id;

  const sortedTracks = [...songs].sort((a, b) => b.rating - a.rating);
  const uris = sortedTracks.map(song => `spotify:track:${song.id}`);

  for (let i = 0; i < uris.length; i += 100) {
    const chunk = uris.slice(i, i + 100);
    await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ uris: chunk })
    });
  }
  alert(`Ranked playlist "${playlistName}" created!`);
}

// ------------------- Ranking Logic -------------------
function start() { nextMatch(); }

function nextMatch() {
  let bestPair = null;
  let lowestCount = Infinity;
  for (let i = 0; i < songs.length; i++) {
    for (let j = i + 1; j < songs.length; j++) {
      const key = pairKey(songs[i], songs[j]);
      const count = pairHistory[key] || 0;
      if (count < lowestCount || (count === lowestCount && Math.random() < 0.5)) {
        lowestCount = count;
        bestPair = [songs[i], songs[j]];
      }
    }
  }
  left = bestPair[0]; right = bestPair[1];
  leftBtn.innerText = left.name; rightBtn.innerText = right.name;
}

function pickWinner(winner, loser) {
  updateElo(winner, loser);
  const key = pairKey(winner, loser);
  pairHistory[key] = (pairHistory[key] || 0) + 1;
  comparisons++;
  if (comparisons >= MAX_COMPARISONS) showRanking();
  else nextMatch();
}

leftBtn.onclick = () => pickWinner(left, right);
rightBtn.onclick = () => pickWinner(right, left);

function showRanking() {
  document.body.innerHTML = "<h1>Final Ranking</h1>";
  const sorted = [...songs].sort((a,b)=>b.rating-a.rating);
  sorted.forEach((song,index)=>{
    const p=document.createElement("p");
    p.innerText=`${index+1}. ${song.name} (${song.rating})`;
    document.body.appendChild(p);
  });
  const btn = document.createElement("button");
  btn.innerText="Create Ranked Spotify Playlist";
  btn.onclick = () => createRankedPlaylist("My Ranked Playlist");
  document.body.appendChild(btn);
}

// ------------------- Initialize -------------------
async function init() {
  const tokenFromHash = window.location.hash.substring(1).split("&").find(p=>p.startsWith("access_token="))?.split("=")[1];
  if (tokenFromHash) {
    localStorage.setItem("spotifyToken", tokenFromHash);
    window.location.hash = "";
  }

  const token = localStorage.getItem("spotifyToken");
  if (!token) return;

  // Playlist picker
  const playlists = await fetchUserPlaylists();
  if (!playlists.length) return alert("No playlists found.");

  const picker = document.getElementById("playlistPicker");
  picker.innerHTML = "<h2>Select a playlist to rank:</h2>";
  playlists.forEach(pl => {
    const btn = document.createElement("button");
    btn.innerText = pl.name;
    btn.onclick = async () => {
      songs = await fetchSpotifyTracks(pl.id);
      if (!songs.length) return alert("No tracks found in this playlist.");
      picker.remove(); start();
    };
    picker.appendChild(btn);
    picker.appendChild(document.createElement("br"));
  });
}

init();
