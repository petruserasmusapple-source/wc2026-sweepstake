const fetch = require("node-fetch");

exports.handler = async function(event) {
  const API_KEY = process.env.API_FOOTBALL_KEY;

  if (!API_KEY) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: "API_FOOTBALL_KEY not set in Netlify environment variables" })
    };
  }

  const BASE   = "https://v3.football.api-sports.io";
  const LEAGUE = 1;
  const SEASON = 2026;

  const reqHeaders = { "x-apisports-key": API_KEY };
  const resHeaders = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type"
  };

  const type = (event.queryStringParameters && event.queryStringParameters.type) || "fixtures";

  let url;

  try {
    if (type === "debug") {
      // Returns API account status and which leagues are available on your plan
      url = `${BASE}/status`;
    } else if (type === "fixtures" || type === "all") {
      url = `${BASE}/fixtures?league=${LEAGUE}&season=${SEASON}`;
    } else if (type === "upcoming") {
      url = `${BASE}/fixtures?league=${LEAGUE}&season=${SEASON}&status=NS`;
    } else if (type === "live") {
      url = `${BASE}/fixtures?league=${LEAGUE}&season=${SEASON}&live=all`;
    } else if (type === "finished") {
      url = `${BASE}/fixtures?league=${LEAGUE}&season=${SEASON}&status=FT-AET-PEN`;
    } else if (type === "today") {
      const today = new Date().toISOString().split("T")[0];
      url = `${BASE}/fixtures?league=${LEAGUE}&season=${SEASON}&date=${today}`;
    } else if (type === "standings") {
      url = `${BASE}/standings?league=${LEAGUE}&season=${SEASON}`;
    } else if (type === "topscorers") {
      url = `${BASE}/players/topscorers?league=${LEAGUE}&season=${SEASON}`;
    } else {
      return { statusCode: 400, headers: resHeaders, body: JSON.stringify({ error: "Unknown type: " + type }) };
    }

    const apiRes  = await fetch(url, { method: "GET", headers: reqHeaders });
    const apiData = await apiRes.json();

    // Include the URL in response for debugging
    apiData._debug_url = url;
    apiData._debug_key_length = API_KEY.length;

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
