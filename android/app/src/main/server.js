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
const LINKEDIN_CLIENT_ID = "7884ug1isb9wug";
const LINKEDIN_CLIENT_SECRET = "WPL_AP1.1MhVARd9ifNn1cAk.06FQWg==";
const REDIRECT_URI = "https://ravishing-expression-production-393f.up.railway.app";

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

  if (!code) {
    return res.status(400).json({ error: "No code received from LinkedIn" });
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

    // LinkedIn se Profile lo
    let name = "LinkedIn User";
    let email = "";
    let picture = "";

    try {
      const profileRes = await axios.get(
        "https://api.linkedin.com/v2/me?projection=(id,localizedFirstName,localizedLastName,profilePicture(displayImage~:playableStreams))",
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      name =
        (profileRes.data.localizedFirstName || "") +
        " " +
        (profileRes.data.localizedLastName || "");
      const images =
        profileRes.data?.profilePicture?.["displayImage~"]?.elements;
      if (images && images.length > 0) {
        picture =
          images[images.length - 1]?.identifiers?.[0]?.identifier || "";
      }
    } catch (e) {
      console.error("Profile fetch error:", e.message);
    }

    try {
      const emailRes = await axios.get(
        "https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))",
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      email =
        emailRes.data?.elements?.[0]?.["handle~"]?.emailAddress || "";
    } catch (e) {
      console.error("Email fetch error:", e.message);
    }

    // User ko app par wapas bhejo
    res.send(`
      <html>
        <body>
          <h3>✅ LinkedIn Login Successful!</h3>
          <p>App par wapas ja raha hai...</p>
          <script>
            localStorage.setItem('isAccountCreated', 'true');
            localStorage.setItem('userName', '${name.trim()}');
            localStorage.setItem('userEmail', '${email}');
            localStorage.setItem('userPhoto', '${picture}');
            localStorage.removeItem('linkedin_state');
            setTimeout(() => {
              window.location.href = '/';
            }, 1000);
          </script>
        </body>
      </html>
    `);
  } catch (error) {
    console.error("LinkedIn OAuth Error:", error.message);
    res.status(500).json({ error: "LinkedIn login failed: " + error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});