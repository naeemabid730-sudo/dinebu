import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import axios from "axios";

admin.initializeApp();

const LINKEDIN_CLIENT_ID = "YOUR_LINKEDIN_CLIENT_ID";       // Step baad mein bharein
const LINKEDIN_CLIENT_SECRET = "YOUR_LINKEDIN_CLIENT_SECRET"; // Step baad mein bharein
const REDIRECT_URI = "https://us-central1-dinebu.cloudfunctions.net/linkedinCallback";

// ========== Step 1: LinkedIn Login URL ==========
export const linkedinAuth = functions.https.onRequest((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");

  const scope = "openid profile email";
  const state = Math.random().toString(36).substring(7);

  const authUrl =
    `https://www.linkedin.com/oauth/v2/authorization` +
    `?response_type=code` +
    `&client_id=${LINKEDIN_CLIENT_ID}` +
    `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
    `&scope=${encodeURIComponent(scope)}` +
    `&state=${state}`;

  res.redirect(authUrl);
});

// ========== Step 2: LinkedIn Callback ==========
export const linkedinCallback = functions.https.onRequest(async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");

  const code = req.query.code as string;

  if (!code) {
    res.status(400).send("No code received from LinkedIn");
    return;
  }

  try {
    // LinkedIn se Access Token lo
    const tokenResponse = await axios.post(
      "https://www.linkedin.com/oauth/v2/accessToken",
      null,
      {
        params: {
          grant_type: "authorization_code",
          code: code,
          redirect_uri: REDIRECT_URI,
          client_id: LINKEDIN_CLIENT_ID,
          client_secret: LINKEDIN_CLIENT_SECRET,
        },
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );

    const accessToken = tokenResponse.data.access_token;

    // LinkedIn se User Info lo
    const userInfo = await axios.get("https://api.linkedin.com/v2/userinfo", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const { sub, email, name, picture } = userInfo.data;

    // Firebase Custom Token banao
    const firebaseToken = await admin.auth().createCustomToken(sub, {
      email: email,
      displayName: name,
      photoURL: picture,
    });

    // App ko token bhejo
    const deepLink =
      `com.dinebu.app://login?` +
      `token=${firebaseToken}` +
      `&name=${encodeURIComponent(name || "")}` +
      `&email=${encodeURIComponent(email || "")}` +
      `&photo=${encodeURIComponent(picture || "")}`;

    res.send(`
      <html>
        <body>
          <h3>Login successful! App par wapas jao.</h3>
          <script>
            window.location.href = "${deepLink}";
            setTimeout(() => window.close(), 2000);
          </script>
        </body>
      </html>
    `);
  } catch (error: any) {
    console.error("LinkedIn OAuth Error:", error.message);
    res.status(500).send("LinkedIn login failed: " + error.message);
  }
});