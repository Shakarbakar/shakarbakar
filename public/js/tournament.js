/*
==================================================
SHAKARBAKAR TOURNAMENT HUB
==================================================

Mock tournament data and frontend-only prediction
payloads. Backend integration will be added later.

==================================================
*/

const tournamentState = {
  upcomingMatches: [
    {
      id: "match-spain-uruguay",
      teamA: "Spain",
      teamB: "Uruguay",
      date: "June 20, 2026",
      time: "8:00 PM",
      stadium: "Arena Central",
    },
    {
      id: "match-germany-brazil",
      teamA: "Germany",
      teamB: "Brazil",
      date: "June 21, 2026",
      time: "9:00 PM",
      stadium: "Night Stadium",
    },
    {
      id: "match-france-mexico",
      teamA: "France",
      teamB: "Mexico",
      date: "June 22, 2026",
      time: "7:30 PM",
      stadium: "Gold Arena",
    },
  ],

  matchResults: [
    {
      teamA: "Spain",
      teamB: "Uruguay",
      scoreA: 2,
      scoreB: 1,
      date: "June 18, 2026",
    },
    {
      teamA: "France",
      teamB: "Germany",
      scoreA: 1,
      scoreB: 1,
      date: "June 17, 2026",
    },
    {
      teamA: "Brazil",
      teamB: "Japan",
      scoreA: 3,
      scoreB: 0,
      date: "June 16, 2026",
    },
  ],

  qualifiedTeams: [
    "Canada",
    "Mexico",
    "USA",
    "Australia",
    "IR Iran",
    "Iraq",
    "Japan",
    "Jordan",
    "Korea Republic",
    "Qatar",
    "Saudi Arabia",
    "Uzbekistan",
    "Algeria",
    "Cabo Verde",
    "Congo DR",
    "Côte d'Ivoire",
    "Egypt",
    "Ghana",
    "Morocco",
    "Senegal",
    "South Africa",
    "Tunisia",
    "Curaçao",
    "Haiti",
    "Panama",
    "Argentina",
    "Brazil",
    "Colombia",
    "Ecuador",
    "Paraguay",
    "Uruguay",
    "New Zealand",
    "Austria",
    "Belgium",
    "Bosnia and Herzegovina",
    "Croatia",
    "Czechia",
    "England",
    "France",
    "Germany",
    "Netherlands",
    "Norway",
    "Portugal",
    "Scotland",
    "Spain",
    "Sweden",
    "Switzerland",
    "Türkiye",
  ],

  quarterFinals: [
    {
      label: "Quarter Final 1",
      teamA: "Spain",
      teamB: "Brazil",
    },
    {
      label: "Quarter Final 2",
      teamA: "France",
      teamB: "Germany",
    },
    {
      label: "Quarter Final 3",
      teamA: "Argentina",
      teamB: "Portugal",
    },
    {
      label: "Quarter Final 4",
      teamA: "England",
      teamB: "Netherlands",
    },
  ],

  semiFinals: [
    {
      label: "Semi Final 1",
      teamA: "Winner QF1",
      teamB: "Winner QF2",
    },
    {
      label: "Semi Final 2",
      teamA: "Winner QF3",
      teamB: "Winner QF4",
    },
  ],

  final: {
    label: "Final",
    teamA: "Winner SF1",
    teamB: "Winner SF2",
  },

  predictionDrafts: [],
};

function createElement(tagName, className, textContent) {
  const element = document.createElement(tagName);

  if (className) {
    element.className = className;
  }

  if (textContent !== undefined) {
    element.textContent = textContent;
  }

  return element;
}

function createFlag(teamName) {
  const flagPath = getFlagSvg(teamName);

  if (!flagPath) {
    return null;
  }

  const image = document.createElement("img");
  image.src = flagPath;
  image.alt = teamName;
  image.className = "team-flag team-flag--small";
  image.loading = "lazy";

  return image;
}

function createTeamInline(teamName) {
  const wrapper = createElement("span", "team-inline");
  const flag = createFlag(teamName);

  if (flag) {
    wrapper.appendChild(flag);
  }

  wrapper.appendChild(document.createTextNode(teamName));

  return wrapper;
}

function renderUpcomingMatches() {
  const container = document.getElementById("upcomingMatches");

  tournamentState.upcomingMatches.forEach((match) => {
    const card = createElement("article", "match-card");
    const teams = createElement("div", "match-teams");
    const meta = createElement("div", "match-meta");

    teams.appendChild(createTeamInline(match.teamA));
    teams.appendChild(createElement("span", "versus", "VS"));
    teams.appendChild(createTeamInline(match.teamB));

    meta.textContent = match.date + " · " + match.time + " · " + match.stadium;

    card.appendChild(teams);
    card.appendChild(meta);
    container.appendChild(card);
  });
}

function renderMatchResults() {
  const container = document.getElementById("matchResults");

  tournamentState.matchResults.forEach((result) => {
    const card = createElement("article", "result-card");
    const score = createElement("div", "result-score");
    const scoreNumber = createElement(
      "span",
      "score-number",
      result.scoreA + " - " + result.scoreB,
    );
    const meta = createElement("div", "result-meta", result.date);

    score.appendChild(createTeamInline(result.teamA));
    score.appendChild(scoreNumber);
    score.appendChild(createTeamInline(result.teamB));

    card.appendChild(score);
    card.appendChild(meta);
    container.appendChild(card);
  });
}

function renderQualifiedTeams() {
  const container = document.getElementById("qualifiedTeams");

  tournamentState.qualifiedTeams.forEach((teamName) => {
    const tile = createElement("div", "team-tile");
    const flag = createFlag(teamName);

    if (flag) {
      tile.appendChild(flag);
    }

    tile.appendChild(document.createTextNode(teamName));
    container.appendChild(tile);
  });
}

function renderBracket(containerId, matches, isFinal = false) {
  const container = document.getElementById(containerId);

  matches.forEach((match) => {
    const card = createElement(
      "article",
      isFinal ? "bracket-card final-card" : "bracket-card",
    );
    const label = createElement("div", "bracket-label", match.label);
    const matchup = createElement("div", "bracket-matchup");

    matchup.appendChild(createTeamInline(match.teamA));
    matchup.appendChild(createElement("span", "versus", "VS"));
    matchup.appendChild(createTeamInline(match.teamB));

    card.appendChild(label);
    card.appendChild(matchup);
    container.appendChild(card);
  });
}

function createRadioOption(name, value, label) {
  const wrapper = createElement("label", "radio-option");
  const input = document.createElement("input");

  input.type = "radio";
  input.name = name;
  input.value = value;

  wrapper.appendChild(input);
  wrapper.appendChild(document.createTextNode(label));

  return wrapper;
}

function createScoreSelect(matchId, teamName) {
  const field = createElement("div", "score-field");
  const label = document.createElement("label");
  const select = document.createElement("select");

  label.textContent = teamName + " Score";
  label.htmlFor = matchId + "-" + teamName.replace(/\s+/g, "-") + "-score";

  select.id = label.htmlFor;

  for (let score = 0; score <= 7; score++) {
    const option = document.createElement("option");
    option.value = String(score);
    option.textContent = String(score);
    select.appendChild(option);
  }

  field.appendChild(label);
  field.appendChild(select);

  return field;
}

function savePredictionDraft(payload, statusElement) {
  tournamentState.predictionDrafts.push({
    ...payload,
    submittedAt: new Date().toISOString(),
  });

  statusElement.textContent = "Prediction saved locally for future backend.";
}

function renderPredictionForms() {
  const container = document.getElementById("predictionForms");

  tournamentState.upcomingMatches.forEach((match) => {
    const matchPanel = createElement("div", "prediction-panel section-panel");
    const title = createElement(
      "h3",
      "section-title",
      match.teamA + " vs " + match.teamB,
    );
    const predictionLayout = createElement("div", "prediction-layout");

    matchPanel.appendChild(title);

    predictionLayout.appendChild(createWinnerPredictionCard(match));
    predictionLayout.appendChild(createTeamPredictionCard(match));
    predictionLayout.appendChild(createScorePredictionCard(match));

    matchPanel.appendChild(predictionLayout);
    container.appendChild(matchPanel);
  });
}

function createWinnerPredictionCard(match) {
  const card = createElement("article", "prediction-card");
  const status = createElement("div", "prediction-status");
  const groupName = match.id + "-winner";

  card.appendChild(createElement("h3", "", "Who Will Win?"));
  card.appendChild(createElement("p", "prediction-question", "Pick one result."));

  const options = createElement("div", "radio-list");
  options.appendChild(createRadioOption(groupName, match.teamA, match.teamA));
  options.appendChild(createRadioOption(groupName, "Draw", "Draw"));
  options.appendChild(createRadioOption(groupName, match.teamB, match.teamB));

  const button = createElement("button", "prediction-button", "Submit Prediction");
  button.addEventListener("click", () => {
    const selected = document.querySelector(
      'input[name="' + groupName + '"]:checked',
    );

    if (!selected) {
      status.textContent = "Choose a winner, draw, or opponent first.";
      return;
    }

    savePredictionDraft(
      {
        matchId: match.id,
        type: "winner",
        selection: selected.value,
      },
      status,
    );
  });

  card.appendChild(options);
  card.appendChild(button);
  card.appendChild(status);

  return card;
}

function createTeamPredictionCard(match) {
  const card = createElement("article", "prediction-card");
  const status = createElement("div", "prediction-status");
  const groupName = match.id + "-team";

  card.appendChild(createElement("h3", "", "Choose Your Team"));
  card.appendChild(
    createElement("p", "prediction-question", "One selection only."),
  );

  const options = createElement("div", "radio-list");
  options.appendChild(createRadioOption(groupName, match.teamA, match.teamA));
  options.appendChild(createRadioOption(groupName, match.teamB, match.teamB));

  const button = createElement("button", "prediction-button", "Submit Prediction");
  button.addEventListener("click", () => {
    const selected = document.querySelector(
      'input[name="' + groupName + '"]:checked',
    );

    if (!selected) {
      status.textContent = "Choose your team first.";
      return;
    }

    savePredictionDraft(
      {
        matchId: match.id,
        type: "team",
        selection: selected.value,
      },
      status,
    );
  });

  card.appendChild(options);
  card.appendChild(button);
  card.appendChild(status);

  return card;
}

function createScorePredictionCard(match) {
  const card = createElement("article", "prediction-card");
  const status = createElement("div", "prediction-status");
  const scoreGrid = createElement("div", "score-grid");
  const teamAField = createScoreSelect(match.id, match.teamA);
  const teamBField = createScoreSelect(match.id, match.teamB);

  card.appendChild(createElement("h3", "", "Exact Score"));
  card.appendChild(
    createElement("p", "prediction-question", "Predict 0-7 for each team."),
  );

  scoreGrid.appendChild(teamAField);
  scoreGrid.appendChild(teamBField);

  const button = createElement("button", "prediction-button", "Submit Prediction");
  button.addEventListener("click", () => {
    savePredictionDraft(
      {
        matchId: match.id,
        type: "score",
        teamAScore: Number(teamAField.querySelector("select").value),
        teamBScore: Number(teamBField.querySelector("select").value),
      },
      status,
    );
  });

  card.appendChild(scoreGrid);
  card.appendChild(button);
  card.appendChild(status);

  return card;
}

function initializeTournamentPage() {
  renderUpcomingMatches();
  renderMatchResults();
  renderQualifiedTeams();
  renderBracket("quarterFinals", tournamentState.quarterFinals);
  renderBracket("semiFinals", tournamentState.semiFinals);
  renderBracket("finalMatch", [tournamentState.final], true);
  renderPredictionForms();
}

document.addEventListener("DOMContentLoaded", initializeTournamentPage);
