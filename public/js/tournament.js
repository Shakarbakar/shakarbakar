/*
==================================================
SHAKARBAKAR TOURNAMENT HUB
==================================================

Reads Tournament Manager data from localStorage and
saves user predictions locally for stats/leaderboards.

==================================================
*/

const tournamentStorage = window.ShakarBakarTournament;
let tournamentState = tournamentStorage.getTournamentData();

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
  wrapper.appendChild(document.createTextNode(teamName || "TBD"));

  return wrapper;
}

function clearContainer(id) {
  const container = document.getElementById(id);

  container.textContent = "";

  return container;
}

function renderEmpty(container, message) {
  container.appendChild(createElement("p", "section-note", message));
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
  const container = clearContainer("upcomingMatches");

  if (!tournamentState.upcomingMatches.length) {
    renderEmpty(container, "No upcoming matches available.");
    return;
  }

  tournamentState.upcomingMatches.forEach((match) => {
    const card = createElement("article", "match-card");
    const label = createElement(
      "div",
      "slot-label",
      tournamentStorage.getMatchLabel(match),
    );
    const matchup = createElement("div", "matchup");
    const meta = createElement("div", "match-meta");

    matchup.appendChild(createTeamInline(match.teamA));
    matchup.appendChild(createElement("span", "versus", "VS"));
    matchup.appendChild(createTeamInline(match.teamB));

    meta.appendChild(createElement("span", "", match.date || "Date TBD"));
    meta.appendChild(createElement("span", "", match.time || "Time TBD"));
    meta.appendChild(createElement("span", "", match.stadium || "Stadium TBD"));

    card.appendChild(label);
    card.appendChild(matchup);
    card.appendChild(meta);
    container.appendChild(card);
  });
}

function renderMatchResults() {
  const container = clearContainer("matchResults");

  if (!tournamentState.results.length) {
    renderEmpty(container, "No results available.");
    return;
  }

  tournamentState.results.forEach((result) => {
    const card = createElement("article", "result-card");
    const label = createElement("div", "result-label", result.label || "Result");
    const line = createElement("div", "result-line");
    const meta = createElement("div", "result-meta");
    const hasScore =
      Number.isFinite(Number(result.scoreA)) &&
      Number.isFinite(Number(result.scoreB));
    const scoreText = hasScore
      ? `${result.scoreA} - ${result.scoreB}`
      : "Score Pending";

    line.appendChild(createTeamInline(result.teamA));
    line.appendChild(createElement("span", "score-placeholder", scoreText));
    line.appendChild(createTeamInline(result.teamB));
    meta.appendChild(createElement("span", "", result.date || "Match Date TBD"));

    card.appendChild(label);
    card.appendChild(line);
    card.appendChild(meta);
    container.appendChild(card);
  });
}

function renderQualifiedTeams() {
  const container = clearContainer("qualifiedTeams");

  if (!tournamentState.qualifiedTeams.length) {
    renderEmpty(container, "No qualified teams yet.");
    return;
  }

  tournamentState.qualifiedTeams.forEach((teamName) => {
    const tile = createElement("div", "team-tile");

    tile.appendChild(createPlaceholderFlag());
    tile.appendChild(document.createTextNode(teamName));
    container.appendChild(tile);
  });
}

function renderBracket(containerId, matches, isFinal = false) {
  const container = clearContainer(containerId);

  if (!matches.length) {
    renderEmpty(container, "TBD");
    return;
  }

  matches.forEach((match) => {
    const card = createElement(
      "article",
      isFinal ? "bracket-card final-card" : "bracket-card",
    );
    const label = createElement("div", "bracket-label", match.label || "TBD");
    const matchup = createElement("div", "bracket-matchup");

    matchup.appendChild(createElement("span", "", match.teamA || "TBD"));
    matchup.appendChild(createElement("span", "versus", "VS"));
    matchup.appendChild(createElement("span", "", match.teamB || "TBD"));

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
  const safeName = (teamName || "team").toLowerCase().replace(/\s+/g, "-");

  label.textContent = `${teamName || "Team"} Score`;
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

function savePrediction(payload, statusElement) {
  const saved = tournamentStorage.savePrediction(payload);

  statusElement.textContent =
    `Prediction saved for ${saved.username} at ` +
    new Date(saved.timestamp).toLocaleString();
}

function renderPredictionForms() {
  const container = clearContainer("predictionForms");

  if (!tournamentState.upcomingMatches.length) {
    renderEmpty(container, "No active matches available for predictions.");
    return;
  }

  tournamentState.upcomingMatches.forEach((match) => {
    const panel = createElement("section", "prediction-match");
    const title = createElement(
      "h3",
      "prediction-match-title",
      tournamentStorage.getMatchLabel(match),
    );
    const layout = createElement("div", "prediction-layout");

    layout.appendChild(createTeamPredictionCard(match));
    layout.appendChild(createScorePredictionCard(match));

    panel.appendChild(title);
    panel.appendChild(layout);
    container.appendChild(panel);
  });
}

function createTeamPredictionCard(match) {
  const card = createElement("article", "prediction-card");
  const status = createElement("div", "prediction-status");
  const groupName = `${match.id}-team`;
  const options = createElement("div", "radio-list");
  const button = createElement("button", "prediction-button", "Submit Prediction");

  card.appendChild(createElement("h3", "", "Team Prediction"));
  card.appendChild(
    createElement("p", "prediction-question", "Who will win?"),
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

    savePrediction(
      {
        matchId: match.id,
        match: tournamentStorage.getMatchLabel(match),
        teamA: match.teamA,
        teamB: match.teamB,
        type: "team",
        prediction: {
          selection: selected.value,
        },
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
    savePrediction(
      {
        matchId: match.id,
        match: tournamentStorage.getMatchLabel(match),
        teamA: match.teamA,
        teamB: match.teamB,
        type: "score",
        prediction: {
          scoreA: Number(teamAField.querySelector("select").value),
          scoreB: Number(teamBField.querySelector("select").value),
        },
      },
      status,
    );
  });

  card.appendChild(scoreGrid);
  card.appendChild(button);
  card.appendChild(status);

  return card;
}

function renderTournamentPage() {
  tournamentState = tournamentStorage.getTournamentData();
  renderCounts();
  renderUpcomingMatches();
  renderMatchResults();
  renderQualifiedTeams();
  renderBracket("round16", tournamentState.round16);
  renderBracket("quarterFinals", tournamentState.quarterFinals);
  renderBracket("semiFinals", tournamentState.semiFinals);
  renderBracket("finalMatch", tournamentState.final, true);
  renderPredictionForms();
}

function initializeTournamentPage() {
  renderTournamentPage();
  window.addEventListener("storage", renderTournamentPage);
  window.addEventListener("shakarbakar:tournament-updated", renderTournamentPage);
}

document.addEventListener("DOMContentLoaded", initializeTournamentPage);
