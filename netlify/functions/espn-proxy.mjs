export async function handler(event, context) {
  const { leagueId, seasonId = new Date().getFullYear() } = event.queryStringParameters;

  if (!leagueId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing leagueId parameter" }),
    };
  }

  try {
    const fetch = (await import('node-fetch')).default;

    const url = `https://fantasy.espn.com/apis/v3/games/ffl/seasons/${seasonId}/segments/0/leagues/${leagueId}`;

    const headers = {
      'X-Fantasy-Filter': '{}',
      'X-Fantasy-Platform': 'kona-PROD-a7898f83',
      'X-Fantasy-Source': 'kona',
      'Referer': 'https://fantasy.espn.com/',
      'Cookie': `espn_s2=${process.env.ESPN_S2}; SWID=${process.env.SWID}`,
    };

    const response = await fetch(url, { headers });
    const contentType = response.headers.get('content-type');
    const raw = await response.text();

    if (!response.ok || !contentType.includes('application/json')) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: 'Not authorized or wrong response',
          contentType,
          raw,
        }),
      };
    }

    const data = JSON.parse(raw);
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Failed to fetch data from ESPN',
        details: error.message,
      }),
    };
  }
}
