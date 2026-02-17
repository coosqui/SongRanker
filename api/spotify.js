import fetch from "node-fetch";

const CLIENT_ID = "ebfc630b5e9d46d7aca0d68e8f4045a1";
const CLIENT_SECRET = "8317a110b5ae45c8bbc5e4641aa1b7e3";
const REDIRECT_URI = "https://coosqui.github.io/SongRanker/index.html";

export default async function handler(req, res) {
  const { code } = req.query;

  if (!code) {
    // Redirect to Spotify login
    const scope = "playlist-read-private playlist-modify-private";
    const url = `https://accounts.spotify.com/authorize?response_type=code&client_id=${CLIENT_ID}&scope=${encodeURIComponent(scope)}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`;
    res.redirect(url);
    return;
  }

  // Exchange code for token
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    redirect_uri: REDIRECT_URI,
  });

  const tokenRes = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: "Basic " + Buffer.from(CLIENT_ID + ":" + CLIENT_SECRET).toString("base64"),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });

  const data = await tokenRes.json();
  res.status(200).json(data);
}
