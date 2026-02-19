export default async function handler(req, res) {
  const CLIENT_ID = "ebfc630b5e9d46d7aca0d68e8f4045a1";
  const CLIENT_SECRET = "8317a110b5ae45c8bbc5e4641aa1b7e3";
  const REDIRECT_URI = "https://coosqui.github.io/SongRanker/";

  const { code } = req.query;

  // STEP 1 — Redirect to Spotify login
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
    code: code,
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

  // STEP 3 — Send token back to frontend
  res.redirect(
    REDIRECT_URI +
      "?token=" +
      data.access_token
  );
}

