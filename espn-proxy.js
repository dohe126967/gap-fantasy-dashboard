export async function handler(event, context) {
  const leagueId = event.queryStringParameters.leagueId;
  const season = event.queryStringParameters.season || new Date().getFullYear();

  const url = `https://fantasy.espn.com/apis/v3/games/ffl/seasons/${season}/segments/0/leagues/${leagueId}?view=mTeam&view=mMatchupScore&view=mStandings`;

  const headers = {
    "Cookie": `espn_s2=${process.env.ESPN_S2}; SWID=${process.env.SWID}`,
    "User-Agent": "Mozilla/5.0",
    "X-Fantasy-Filter": JSON.stringify({}),
  };

  try {
    const response = await fetch(url, { headers });
    const data = await response.json();

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json"
      },
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
}
