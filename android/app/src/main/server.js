const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

const ONESIGNAL_APP_ID = "bb6f5013-9733-4600-a122-dcb6b8eb4100";
const ONESIGNAL_REST_KEY = "PASTE_YOUR_REST_KEY";

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

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});