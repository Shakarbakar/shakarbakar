/*
==================================================
SHAKARBAKAR TOURNAMENT HUB
==================================================

Phase 4 frontend-only placeholder data.
No backend calls, no scoring, and no rewards yet.

==================================================
*/

const tournamentState = {
  upcomingMatches: [
    {
      id: "match-slot-1",
      label: "Match Slot 1",
      teamA: "Team A",
      teamB: "Team B",
      date: "Date Placeholder",
      time: "Time Placeholder",
      venue: "Stadium Placeholder",
    },
    {
      id: "match-slot-2",
      label: "Match Slot 2",
      teamA: "Team A",
      teamB: "Team B",
      date: "Date Placeholder",
      time: "Time Placeholder",
      venue: "Stadium Placeholder",
    },
    {
      id: "match-slot-3",
      label: "Match Slot 3",
      teamA: "Team A",
      teamB: "Team B",
      date: "Date Placeholder",
      time: "Time Placeholder",
      venue: "Stadium Placeholder",
    },
  ],
  results: [
    {
      id: "result-slot-1",
      label: "Result Slot 1",
      teamA: "Team Placeholder",
      teamB: "Team Placeholder",
      score: "Score Placeholder",
      date: "Match Date Placeholder",
    },
    {
      id: "result-slot-2",
      label: "Result Slot 2",
      teamA: "Team Placeholder",
      teamB: "Team Placeholder",
      score: "Score Placeholder",
      date: "Match Date Placeholder",
    },
    {
      id: "result-slot-3",
      label: "Result Slot 3",
      teamA: "Team Placeholder",
      teamB: "Team Placeholder",
      score: "Score Placeholder",
      date: "Match Date Placeholder",
    },
  ],
  qualifiedTeams: [
    "Team Placeholder 1",
    "Team Placeholder 2",
    "Team Placeholder 3",
    "Team Placeholder 4",
    "Team Placeholder 5",
    "Team Placeholder 6",
    "Team Placeholder 7",
    "Team Placeholder 8",
  ],
  quarterFinals: [
    {
      label: "Quarter Final 1",
      teamA: "Winner R16-1",
      teamB: "Winner R16-2",
    },
    {
      label: "Quarter Final 2",
      teamA: "Winner R16-3",
      teamB: "Winner R16-4",
    },
    {
      label: "Quarter Final 3",
      teamA: "Winner R16-5",
      teamB: "Winner R16-6",
    },
    {
      label: "Quarter Final 4",
      teamA: "Winner R16-7",
      teamB: "Winner R16-8",
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
  final: [
    {
      label: "Final",
      teamA: "Winner SF1",
      teamB: "Winner SF2",
    },
  ],
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

function createPlaceholderFlag() {
  const flag = createElement("span", "placeholder-flag");

  flag.setAttribute("aria-hidden", "true");

  return flag;
}

function createTeamInline(teamName) {
  const wrapper = createElement("span", "team-inline");

  wrapper.appendChild(createPlaceholderFlag());
  wrapper.appendChild(document.createTextNode(teamName));

  return wrapper;
}

function renderCounts() {
  document.getElementById("upcomingCount").textContent =
    tournamentState.upcomingMatches.length;
  document.getElementById("resultCount").textContent =
    tournamentState.results.length;
  document.getElementById("qualifiedCount").textContent =
    tournamentState.qualifiedTeams.length;
}

function renderUpcomingMatches() {
  const container = document.getElementById("upcomingMatches");

  container.textContent = "";

  tournamentState.upcomingMatches.forEach((match) => {
    const card = createElement("article", "match-card");
    const label = createElement("div", "slot-label", match.label);
    const matchup = createElement("div", "matchup");
    const meta = createElement("div", "match-meta");

    matchup.appendChild(createTeamInline(match.teamA));
    matchup.appendChild(createElement("span", "versus", "VS"));
    matchup.appendChild(createTeamInline(match.teamB));

    meta.appendChild(createElement("span", "", match.date));
    meta.appendChild(createElement("span", "", match.time));
    meta.appendChild(createElement("span", "", match.venue));

    card.appendChild(label);
    card.appendChild(matchup);
    card.appendChild(meta);
    container.appendChild(card);
  });
}

function renderMatchResults() {
  const container = document.getElementById("matchResults");

  container.textContent = "";

  tournamentState.results.forEach((result) => {
    const card = createElement("article", "result-card");
    const label = createElement("div", "result-label", result.label);
    const line = createElement("div", "result-line");
    const meta = createElement("div", "result-meta");

    line.appendChild(createTeamInline(result.teamA));
    line.appendChild(createElement("span", "score-placeholder", result.score));
    line.appendChild(createTeamInline(result.teamB));
    meta.appendChild(createElement("span", "", result.date));

    card.appendChild(label);
    card.appendChild(line);
    card.appendChild(meta);
    container.appendChild(card);
  });
}

function renderQualifiedTeams() {
  const container = document.getElementById("qualifiedTeams");

  container.textContent = "";

  tournamentState.qualifiedTeams.forEach((teamName) => {
    const tile = createElement("div", "team-tile");

    tile.appendChild(createPlaceholderFlag());
    tile.appendChild(document.createTextNode(teamName));
    container.appendChild(tile);
  });
}

function renderBracket(containerId, matches, isFinal = false) {
  const container = document.getElementById(containerId);

  container.textContent = "";

  matches.forEach((match) => {
    const card = createElement(
      "article",
      isFinal ? "bracket-card final-card" : "bracket-card",
    );
    const label = createElement("div", "bracket-label", match.label);
    const matchup = createElement("div", "bracket-matchup");

    matchup.appendChild(createElement("span", "", match.teamA));
    matchup.appendChild(createElement("span", "versus", "VS"));
    matchup.appendChild(createElement("span", "", match.teamB));

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
  const safeName = teamName.toLowerCase().replace(/\s+/g, "-");

  label.textContent = `${teamName} Score`;
  label.htmlFor = `${matchId}-${safeName}-score`;
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

  container.textContent = "";

  tournamentState.upcomingMatches.forEach((match) => {
    const panel = createElement("section", "prediction-match");
    const title = createElement("h3", "prediction-match-title", "Upcoming Match");
    const layout = createElement("div", "prediction-layout");

    layout.appendChild(createWinnerPredictionCard(match));
    layout.appendChild(createTeamPredictionCard(match));
    layout.appendChild(createScorePredictionCard(match));

    panel.appendChild(title);
    panel.appendChild(layout);
    container.appendChild(panel);
  });
}

function createWinnerPredictionCard(match) {
  const card = createElement("article", "prediction-card");
  const status = createElement("div", "prediction-status");
  const groupName = `${match.id}-winner`;
  const options = createElement("div", "radio-list");
  const button = createElement("button", "prediction-button", "Submit Prediction");

  card.appendChild(createElement("h3", "", "Who Will Win?"));
  card.appendChild(
    createElement("p", "prediction-question", "Choose one placeholder result."),
  );

  options.appendChild(createRadioOption(groupName, match.teamA, match.teamA));
  options.appendChild(createRadioOption(groupName, "Draw", "Draw"));
  options.appendChild(createRadioOption(groupName, match.teamB, match.teamB));

  button.addEventListener("click", () => {
    const selected = document.querySelector(
      `input[name="${groupName}"]:checked`,
    );

    if (!selected) {
      status.textContent = "Choose Team A, Draw, or Team B first.";
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
  const groupName = `${match.id}-team`;
  const options = createElement("div", "radio-list");
  const button = createElement("button", "prediction-button", "Submit Prediction");

  card.appendChild(createElement("h3", "", "Choose Your Team"));
  card.appendChild(
    createElement("p", "prediction-question", "One selection only."),
  );

  options.appendChild(createRadioOption(groupName, match.teamA, match.teamA));
  options.appendChild(createRadioOption(groupName, match.teamB, match.teamB));

  button.addEventListener("click", () => {
    const selected = document.querySelector(
      `input[name="${groupName}"]:checked`,
    );

    if (!selected) {
      status.textContent = "Choose your placeholder team first.";
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
  const button = createElement("button", "prediction-button", "Submit Prediction");

  card.appendChild(createElement("h3", "", "Exact Score"));
  card.appendChild(
    createElement("p", "prediction-question", "Select scores from 0-7."),
  );

  scoreGrid.appendChild(teamAField);
  scoreGrid.appendChild(teamBField);

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
  renderCounts();
  renderUpcomingMatches();
  renderMatchResults();
  renderQualifiedTeams();
  renderBracket("quarterFinals", tournamentState.quarterFinals);
  renderBracket("semiFinals", tournamentState.semiFinals);
  renderBracket("finalMatch", tournamentState.final, true);
  renderPredictionForms();
}

document.addEventListener("DOMContentLoaded", initializeTournamentPage);
