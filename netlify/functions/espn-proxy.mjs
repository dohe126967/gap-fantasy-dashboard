import fetch from 'node-fetch';

export async function handler(event) {
  const { leagueId, seasonId } = event.queryStringParameters;

  if (!leagueId || !seasonId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing leagueId or seasonId" }),
    };
  }

  const url = `https://fantasy.espn.com/apis/v3/games/ffl/seasons/${seasonId}/segments/0/leagues/${leagueId}?view=mTeam`;

  try {
    const response = await fetch(url, {
      headers: {
        'X-Fantasy-Source': 'kona',
        'X-Fantasy-Platform': 'kona-PROD-a7898f83',
        'X-Fantasy-Filter': '{}',
        'Referer': 'https://fantasy.espn.com/',
      },
    });

    const contentType = response.headers.get('content-type');

    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      return {
        statusCode: response.status,
        body: JSON.stringify({
          error: 'Failed to fetch data from ESPN',
          details: 'Invalid content-type or error response',
          raw: text,
        }),
      };
    }

    const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Unexpected error',
        details: err.message,
      }),
    };
  }
}
