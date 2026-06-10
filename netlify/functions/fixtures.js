const fetch = require("node-fetch");

// Uses wc2026api.com — free tier, no API key needed for basic access
// Docs: https://www.wc2026api.com

const BASE = "https://api.wc2026api.com";

exports.handler = async function(event) {
  const resHeaders = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type"
  };

  const type = (event.queryStringParameters && event.queryStringParameters.type) || "matches";

  let url;
  try {
    if (type === "matches" || type === "fixtures" || type === "all") {
      url = `${BASE}/matches`;
    } else if (type === "upcoming") {
      url = `${BASE}/matches?status=scheduled`;
    } else if (type === "live") {
      url = `${BASE}/matches?status=live`;
    } else if (type === "finished") {
      url = `${BASE}/matches?status=finished`;
    } else if (type === "today") {
      const today = new Date().toISOString().split("T")[0];
      url = `${BASE}/matches?date=${today}`;
    } else if (type === "standings" || type === "groups") {
      url = `${BASE}/standings`;
    } else {
      return {
        statusCode: 400,
        headers: resHeaders,
        body: JSON.stringify({ error: "Unknown type: " + type })
      };
    }

    const apiRes  = await fetch(url, { method: "GET", headers: { "Accept": "application/json" } });

    // If API returns non-JSON (HTML error page), catch it
    const text = await apiRes.text();
    let apiData;
    try {
      apiData = JSON.parse(text);
    } catch(e) {
      return {
        statusCode: 200,
        headers: resHeaders,
        body: JSON.stringify({ error: "API returned non-JSON response", raw: text.substring(0, 300), url })
      };
    }

    return {
      statusCode: 200,
      headers: resHeaders,
      body: JSON.stringify(apiData)
    };

  } catch (err) {
    return {
      statusCode: 500,
      headers: resHeaders,
      body: JSON.stringify({ error: err.message, url: url || "not set" })
    };
  }
};
