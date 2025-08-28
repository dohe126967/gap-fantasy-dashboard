export async function handler(event, context) {
  const leagueId = event.queryStringParameters.leagueId;
  const season = event.queryStringParameters.season || new Date().getFullYear();
  const url = `https://fantasy.espn.com/apis/v3/games/ffl/seasons/${season}/segments/0/leagues/${leagueId}?view=mTeam&view=mMatchupScore&view=mStandings`;
  const resp = await fetch(url);
  const data = await resp.json();
  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "content-type": "application/json"
    },
    body: JSON.stringify(data)
  };
}