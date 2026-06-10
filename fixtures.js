// Netlify serverless function — securely proxies API-Football calls
// Your API key lives ONLY here as an environment variable — never in the frontend

exports.handler = async function(event, context) {
  const API_KEY = process.env.API_FOOTBALL_KEY;
  const BASE    = "https://v3.football.api-sports.io";
  const LEAGUE  = 1;      // FIFA World Cup
  const SEASON  = 2026;

  const headers = {
    "x-apisports-key": API_KEY,
    "Content-Type": "application/json"
  };

  const cors = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json"
  };

  const type = event.queryStringParameters?.type || "fixtures";

  try {
    let url;
    if (type === "fixtures") {
      // All fixtures for the tournament
      url = `${BASE}/fixtures?league=${LEAGUE}&season=${SEASON}`;
    } else if (type === "standings") {
      url = `${BASE}/standings?league=${LEAGUE}&season=${SEASON}`;
    } else if (type === "topscorers") {
      url = `${BASE}/players/topscorers?league=${LEAGUE}&season=${SEASON}`;
    } else {
      return { statusCode: 400, headers: cors, body: JSON.stringify({ error: "Unknown type" }) };
    }

    const res  = await fetch(url, { headers });
    const data = await res.json();

    return {
      statusCode: 200,
      headers: cors,
      body: JSON.stringify(data)
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: cors,
      body: JSON.stringify({ error: err.message })
    };
  }
};
