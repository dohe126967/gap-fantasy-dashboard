// netlify/functions/espn-proxy.mjs

export async function handler(event) {
  const leagueId = event.queryStringParameters.leagueId;
  const seasonId = event.queryStringParameters.seasonId;

  if (!leagueId || !seasonId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing leagueId or seasonId' })
    };
  }

  const url = `https://fantasy.espn.com/apis/v3/games/ffl/seasons/${seasonId}/segments/0/leagues/${leagueId}`;

  const response = await fetch(url, {
    headers: {
      "Cookie": "espn_s2=AEATaeYjT7QUvX1WUTjphal4%2FaMFvmhkZt1iRbhGoBtk5FBHcx8zUwEoKUHjiX2PKYvoBYIDGgtB3YJjEP7EfP0%2Fmcl%2BpLLuXpJRxpIwWd7dqLpnhwACiyRWMGsFiIU8JugcMVzXSgMZtP5I3zaCm4W0GLE1ZYv%2B2x0%2BzrxTyLFNNHhiFqUNkOU0e8aUcXXmz8ArBnOuEpfiOv00p%2FfR%2FC45XoKfc3FL8VmcL71B66%2FStnM40gN5PblkrcmuirPawipg6OG5krMYcJX%2B2I8OQZJL7Mqda4BLx7W9%2F2F3awrLc7Gf1XfFSvzzMscyWRUShwCf8OGMl16XWoj%2F3dXoFFOELkeNhTTK; SWID={AF7AA59E-4FFE-4B06-BAA5-9E4FFE0B06AA}",
      "User-Agent": "Mozilla/5.0",
      "Referer": "https://fantasy.espn.com/",
      "x-fantasy-filter": "{}"
    }
  });

  const data = await response.text(); // use .text() for debugging to capture non-JSON too

  return {
    statusCode: response.status,
    body: data,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"
    }
  };
}
