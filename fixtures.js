const fetch = require("node-fetch");

const FIXTURES_URL = "https://raw.githubusercontent.com/openfootball/worldcup.json/master/2026/worldcup.json";
const GROUPS_URL   = "https://raw.githubusercontent.com/openfootball/worldcup.json/master/2026/worldcup.groups.json";

exports.handler = async function(event) {
  const resHeaders = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type"
  };

  const type = (event.queryStringParameters && event.queryStringParameters.type) || "fixtures";

  try {
    const url = (type === "groups") ? GROUPS_URL : FIXTURES_URL;

    const apiRes = await fetch(url, {
      headers: { "User-Agent": "netlify-function" }
    });

    if (!apiRes.ok) {
      return {
        statusCode: 200,
        headers: resHeaders,
        body: JSON.stringify({ error: "GitHub fetch failed", status: apiRes.status, url })
      };
    }

    const data = await apiRes.json();

    // Server-side filter based on type
    if (data.matches) {
      const today = new Date().toISOString().split("T")[0];
      if (type === "upcoming") {
        data.matches = data.matches.filter(m => !m.score || !m.score.ft);
      } else if (type === "finished") {
        data.matches = data.matches.filter(m => m.score && m.score.ft);
      } else if (type === "today") {
        data.matches = data.matches.filter(m => m.date === today);
      } else if (type === "live") {
        data.matches = data.matches.filter(m => m.date === today && (!m.score || !m.score.ft));
      }
      // "fixtures" / "all" — return everything
    }

    return {
      statusCode: 200,
      headers: resHeaders,
      body: JSON.stringify(data)
    };

  } catch (err) {
    return {
      statusCode: 500,
      headers: resHeaders,
      body: JSON.stringify({ error: err.message })
    };
  }
};
