// File: netlify/functions/espn-proxy.mjs
import fetch from 'node-fetch';

export async function handler(event) {
  const { leagueId, seasonId } = event.queryStringParameters;
  if (!leagueId || !seasonId) {
    return { statusCode: 400, body: JSON.stringify({ error: "Missing leagueId or seasonId" }) };
  }

  const url = `https://fantasy.espn.com/apis/v3/games/ffl/seasons/${seasonId}/segments/0/leagues/${leagueId}?view=mTeam`;

  const headers = {
    'X-Fantasy-Source': 'kona',
    'X-Fantasy-Platform': 'kona-PROD',
    'X-Fantasy-Filter': '{}',
    'Referer': 'https://fantasy.espn.com/',
    'Cookie': `espn_s2=${process.env.ESPN_S2}; SWID=${process.env.SWID}`
  };

  try {
    const resp = await fetch(url, { headers });
    const text = await resp.text();
    const contentType = resp.headers.get('content-type') || '';

    if (!resp.ok || !contentType.includes('application/json')) {
      return {
        statusCode: resp.status,
        body: JSON.stringify({
          error: 'Not authorized or wrong response',
          contentType,
          raw: text.substring(0, 500) // show first 500 chars for debugging
        })
      };
    }

    const data = JSON.parse(text);
    return { statusCode: 200, body: JSON.stringify(data) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
}

