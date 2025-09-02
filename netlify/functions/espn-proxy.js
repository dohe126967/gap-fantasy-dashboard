const fetch = require('node-fetch');

exports.handler = async function(event) {
  const leagueId = event.queryStringParameters.leagueId;

  if (!leagueId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing leagueId in query string" })
    };
  }

  const espn_s2 = process.env.ESPN_S2;
  const swid = process.env.SWID;

  if (!espn_s2 || !swid) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Missing ESPN authentication tokens in environment variables" })
    };
  }

  const url = `https://fantasy.espn.com/apis/v3/games/ffl/seasons/2025/segments/0/leagues/${leagueId}?view=mTeam`;

  try {
    const response = await fetch(url, {
      headers: {
        Cookie: `espn_s2=${espn_s2}; SWID=${swid};`
      }
    });

    const contentType = response.headers.get('content-type');

    if (!response.ok || !contentType.includes('application/json')) {
      const text = await response.text(); // For debugging
      throw new Error(`Invalid response: ${text}`);
    }

    const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify(data)
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Failed to fetch data from ESPN",
        details: err.message,
        debug: err.stack
      })
    };
  }
};
