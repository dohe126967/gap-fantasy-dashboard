import fetch from 'node-fetch';

export async function handler(event) {
  const { leagueId, seasonId } = event.queryStringParameters;

  if (!leagueId || !seasonId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing leagueId or seasonId" }),
    };
  }

  const espnUrl = `https://fantasy.espn.com/apis/v3/games/ffl/seasons/${seasonId}/segments/0/leagues/${leagueId}?view=mTeam`;

  try {
    const response = await fetch(espnUrl, {
      headers: {
        cookie: process.env.ESPN_COOKIE,
      },
    });

    const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Failed to fetch data from ESPN",
        details: error.message,
      }),
    };
  }
}
