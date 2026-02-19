export default async function handler(req, res) {
  const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
  const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

  const REDIRECT_URI = "https://song-ranker-chi.vercel.app/api/spotify";

  const { code } = req.query;

  // STEP 1 — Send user to Spotify login
  if (!code) {
    const scope = "playlist-read-private playlist-modify-private";

    const url =
      "https://accounts.spotify.com/authorize" +
      "?response_type=code" +
      "&client_id=" + CLIENT_ID +
      "&scope=" + encodeURIComponent(scope) +
      "&redirect_uri=" + encodeURIComponent(REDIRECT_URI);

    res.redirect(url);
    return;
  }

  // STEP 2 — Exchange code for token
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    redirect_uri: REDIRECT_URI,
  });

  const authHeader = Buffer.from(
    CLIENT_ID + ":" + CLIENT_SECRET
  ).toString("base64");

  const tokenRes = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: "Basic " + authHeader,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });

  const data = await tokenRes.json();

  // STEP 3 — Redirect back to your GitHub site
  res.redirect("https://coosqui.github.io/SongRanker/?token=" + data.access_token);
}
