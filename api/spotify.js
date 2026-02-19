export default async function handler(req, res) {
  const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
  const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
  const REDIRECT_URI = "https://song-ranker-chi.vercel.app/api/spotify";

  const { code, refresh } = req.query;

  const authHeader = Buffer.from(CLIENT_ID + ":" + CLIENT_SECRET).toString("base64");

  if (refresh) {
    // Schritt: Refresh-Token benutzen
    const body = new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refresh,
    });

    const tokenRes = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        Authorization: "Basic " + authHeader,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
    });

    const data = await tokenRes.json();

    // Access-Token zurückgeben (Refresh-Token bleibt gleich)
    res.status(200).json({ access_token: data.access_token });
    return;
  }

  if (!code) {
    // Schritt: User zu Spotify Login schicken
    const scope = "playlist-read-private playlist-modify-private";
    const url =
      "https://accounts.spotify.com/authorize" +
      "?response_type=code" +
      "&client_id=" + CLIENT_ID +
      "&scope=" + encodeURIComponent(scope) +
      "&redirect_uri=" + encodeURIComponent(REDIRECT_URI) +
      "&show_dialog=true"; // immer Login-Dialog
    res.redirect(url);
    return;
  }

  // Schritt: Code gegen Access + Refresh Token tauschen
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    redirect_uri: REDIRECT_URI,
  });

  const tokenRes = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: "Basic " + authHeader,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });

  const data = await tokenRes.json();

  // Access + Refresh Token an Frontend weitergeben
  // Redirect zu GitHub Pages, beide Tokens in URL (verschlüsseln optional)
  res.redirect(
    `https://coosqui.github.io/SongRanker/?access_token=${data.access_token}&refresh_token=${data.refresh_token}`
  );
};
