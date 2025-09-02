import fetch from 'node-fetch';

export async function handler(event) {
  const leagueId = event.queryStringParameters.leagueId;
  const seasonId = event.queryStringParameters.seasonId;

  if (!leagueId || !seasonId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing leagueId or seasonId in query parameters' }),
    };
  }

  const espnS2 = process.env.ESPN_s2;
  const swid = process.env.SWID;

  if (!espnS2 || !swid) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Missing ESPN authentication cookies in environment variables' }),
    };
  }

  const url = `https://fantasy.espn.com/apis/v3/games/ffl/seasons/${seasonId}/segments/0/leagues/${leagueId}?view=mMatchup&view=mMatchupScore&view=mTeam`;

  try {
    const response = await fetch(url, {
      headers: {
        'X-Fantasy-Source': 'kona',
        'X-Fantasy-Platform': 'kona-PROD-a7898f83',
        'X-Fantasy-Filter': '{}',
        'Referer': 'https://fantasy.espn.com/',
        'Cookie': `espn_s2=${espnS2}; SWID=${swid}`,
      },
    });

    const contentType = response.headers.get('content-type');
    const text = await response.text();

    if (!response.ok || !contentType.includes('application/json')) {
      return {
        statusCode: response.status,
        body: JSON.stringify({
          error: 'Not authorized or wrong response',
          contentType,
          raw: text,
        }),
      };
    }

    const data = JSON.parse(text);

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
