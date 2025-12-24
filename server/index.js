// server/index.js
import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

// Serve static files
app.use(express.static(new URL("../public", import.meta.url).pathname));

const PORT = Number(process.env.PORT || 3000);
const TOKEN_MODE = (process.env.TOKEN_MODE || "proxy").toLowerCase();

// POST /api/directline/token
// Returns: { token: "<DIRECT_LINE_TOKEN>" }
app.post("/api/directline/token", async (req, res) => {
  try {
    if (TOKEN_MODE === "proxy") {
      const endpoint = process.env.PROXY_TOKEN_ENDPOINT;
      if (!endpoint) {
        return res.status(500).json({ error: "Missing PROXY_TOKEN_ENDPOINT in .env" });
      }

      const headerName = process.env.PROXY_AUTH_HEADER_NAME;
      const headerValue = process.env.PROXY_AUTH_HEADER_VALUE;

      const headers = { "content-type": "application/json" };
      if (headerName && headerValue) headers[headerName] = headerValue;

      // Forward request to the upstream token endpoint
      const upstream = await fetch(endpoint, { method: "POST", headers });

      if (!upstream.ok) {
        const text = await upstream.text().catch(() => "");
        return res.status(upstream.status).send(text || "Upstream token endpoint error");
      }

      const json = await upstream.json();
      const token = json.token || json.directLineToken || json.direct_line_token;
      if (!token) {
        return res.status(500).json({ error: "Upstream response did not include a token field" });
      }

      return res.json({ token });
    }

    if (TOKEN_MODE === "directline_secret") {
      const secret = process.env.DIRECTLINE_SECRET;
      if (!secret) {
        return res.status(500).json({ error: "Missing DIRECTLINE_SECRET in .env" });
      }

      // Direct Line token exchange
      // POST https://directline.botframework.com/v3/directline/tokens/generate
      const dl = await fetch("https://directline.botframework.com/v3/directline/tokens/generate", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${secret}`,
          "content-type": "application/json"
        },
        body: JSON.stringify({})
      });

      if (!dl.ok) {
        const text = await dl.text().catch(() => "");
        return res.status(dl.status).send(text || "Direct Line token generation failed");
      }

      const json = await dl.json();
      if (!json.token) {
        return res.status(500).json({ error: "Direct Line did not return a token" });
      }

      return res.json({ token: json.token });
    }

    return res.status(500).json({ error: `Unknown TOKEN_MODE: ${TOKEN_MODE}` });
  } catch (err) {
    console.error("Token error:", err);
    return res.status(500).json({ error: "Token service error" });
  }
});

// SPA-ish fallback (optional)
app.get("*", (req, res) => {
  res.sendFile(new URL("../public/index.html", import.meta.url).pathname);
});

app.listen(PORT, () => {
  console.log(`Direct Line Web Chat FAB demo running on http://localhost:${PORT}`);
  console.log(`TOKEN_MODE=${TOKEN_MODE}`);
});
