const express = require("express");
const cors = require("cors");
const axios = require("axios");
const app = express();

app.use(cors());
app.use(express.json());

// ========== OneSignal Config ==========
const ONESIGNAL_APP_ID = "bb6f5013-9733-4600-a122-dcb6b8eb4100";
const ONESIGNAL_REST_KEY = "PASTE_YOUR_REST_KEY";

// ========== LinkedIn Config ==========
const LINKEDIN_CLIENT_ID = "784irhiq5au78p";
const LINKEDIN_CLIENT_SECRET = process.env.LINKEDIN_CLIENT_SECRET || "";
const REDIRECT_URI = "https://ravishing-expression-production-393f.up.railway.app/auth/linkedin/callback";

// ========== Health Check ==========
app.get("/", (req, res) => {
  res.send("Railway Server is running! ✅");
});

// ========== OneSignal: Send Notification ==========
app.post("/send-notification", async (req, res) => {
  const { title, message, playerId } = req.body;

  const body = {
    app_id: ONESIGNAL_APP_ID,
    headings: { en: title },
    contents: { en: message },
  };

  if (playerId) {
    body.include_player_ids = [playerId];
  } else {
    body.included_segments = ["All"];
  }

  try {
    const response = await fetch("https://onesignal.com/api/v1/notifications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${ONESIGNAL_REST_KEY}`,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ========== LinkedIn: OAuth Callback ==========
app.get("/auth/linkedin/callback", async (req, res) => {
  const code = req.query.code;
  const frontendUrl = req.query.frontend_url
    ? decodeURIComponent(req.query.frontend_url)
    : null;

  if (!code) {
    return res.status(400).json({ error: "No code received from LinkedIn" });
  }

  try {
    // ✅ LinkedIn se Access Token lo (OpenID Connect)
    const tokenResponse = await axios.post(
      "https://www.linkedin.com/oauth/v2/accessToken",
      new URLSearchParams({
        grant_type: "authorization_code",
        code: code,
        redirect_uri: REDIRECT_URI,
        client_id: LINKEDIN_CLIENT_ID,
        client_secret: LINKEDIN_CLIENT_SECRET,
      }),
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );

    const accessToken = tokenResponse.data.access_token;

    // ✅ OpenID Connect userinfo endpoint se profile lo
    let name = "LinkedIn User";
    let email = "";
    let picture = "";

    try {
      const userinfoRes = await axios.get(
        "https://api.linkedin.com/v2/userinfo",
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      const userinfo = userinfoRes.data;
      name = userinfo.name || (userinfo.given_name + " " + (userinfo.family_name || "")).trim() || "LinkedIn User";
      email = userinfo.email || "";
      picture = userinfo.picture || "";
    } catch (e) {
      console.error("Userinfo fetch error:", e.message);
    }

    // ✅ Frontend pe redirect karo with data
    const safeName = encodeURIComponent(name.trim());
    const safeEmail = encodeURIComponent(email);
    const safePhoto = encodeURIComponent(picture);

    if (frontendUrl) {
      // Frontend alag domain pe hai - redirect wahan
      return res.redirect(
        `${frontendUrl}/account?linkedin_name=${safeName}&linkedin_email=${safeEmail}&linkedin_photo=${safePhoto}`
      );
    } else {
      // Same domain pe hai - HTML page se localStorage set karo
      return res.send(`
        <html>
          <body>
            <h3>✅ LinkedIn Login Successful!</h3>
            <p>App par wapas ja raha hai...</p>
            <script>
              localStorage.setItem('isAccountCreated', 'true');
              localStorage.setItem('userName', '${name.trim().replace(/'/g, "\\'")}');
              localStorage.setItem('userEmail', '${email.replace(/'/g, "\\'")}');
              localStorage.setItem('userPhoto', '${picture.replace(/'/g, "\\'")}');
              localStorage.removeItem('linkedin_state');
              setTimeout(() => {
                window.location.href = '/';
              }, 500);
            </script>
          </body>
        </html>
      `);
    }
  } catch (error) {
    console.error("LinkedIn OAuth Error:", error.response?.data || error.message);
    const errMsg = encodeURIComponent("LinkedIn login failed");
    if (req.query.frontend_url) {
      const frontendUrl = decodeURIComponent(req.query.frontend_url);
      return res.redirect(`${frontendUrl}/account?linkedin_error=${errMsg}`);
    }
    res.status(500).json({ error: "LinkedIn login failed: " + error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});