exports.handler = async function (event, context) {
  const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

  const leagueId = event.queryStringParameters.leagueId;
  if (!leagueId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing leagueId parameter" }),
    };
  }

  try {
    const response = await fetch(
      `https://fantasy.espn.com/apis/v3/games/ffl/seasons/2024/segments/0/leagues/${leagueId}?view=mTeam`
    );

    if (!response.ok) {
      throw new Error(`ESPN API returned ${response.status}`);
    }

    const data = await response.json();

    const teams = data.teams.map((team) => ({
      teamName: team.location + " " + team.nickname,
      manager: team.owners ? team.owners[0] : "Unknown",
      record: `${team.record.overall.wins}-${team.record.overall.losses}`,
    }));

    return {
      statusCode: 200,
      body: JSON.stringify({ teams }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Failed to fetch data from ESPN",
        details: error.message,
        debug: error.stack,
      }),
    };
  }
};
