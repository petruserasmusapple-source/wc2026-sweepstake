const fetch = require("node-fetch");

// Uses openfootball/worldcup.json on GitHub Raw
// Completely free, no API key, no auth required
// Updated by the community as scores come in

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
    let url = type === "groups" ? GROUPS_URL : FIXTURES_URL;

    const apiRes = await fetch(url);
    const text   = await apiRes.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch(e) {
      return {
        statusCode: 200,
        headers: resHeaders,
        body: JSON.stringify({ error: "Could not parse JSON from openfootball", raw: text.substring(0, 200) })
      };
    }

    // For fixtures, apply filtering server-side based on type
    if (type !== "groups" && data.matches) {
      const today = new Date().toISOString().split("T")[0];

      if (type === "upcoming") {
        data.matches = data.matches.filter(m => !m.score || Object.keys(m.score).length === 0);
      } else if (type === "finished") {
        data.matches = data.matches.filter(m => m.score && m.score.ft);
      } else if (type === "today") {
        data.matches = data.matches.filter(m => m.date === today);
      } else if (type === "live") {
        // openfootball doesn't do live scores — return today's matches as proxy
        data.matches = data.matches.filter(m => m.date === today);
      }
      // "fixtures" / "all" returns everything unfiltered
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
