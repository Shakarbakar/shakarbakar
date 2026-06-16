/*
==================================================
SHAKARBAKAR TOURNAMENT HUB
==================================================

Public renderer for Tournament Manager data.
Prediction submissions are still local-only drafts for
future backend integration.

==================================================
*/

const emptyTournamentState = {
  upcomingMatches: [],
  results: [],
  qualifiedTeams: [],
  round16: [],
  quarterFinals: [],
  semiFinals: [],
  final: [],
  predictionDrafts: [],
};

let tournamentState = { ...emptyTournamentState };

function normalizeTournamentData(data = {}) {
  return {
    upcomingMatches: Array.isArray(data.upcomingMatches)
      ? data.upcomingMatches
      : [],
    results: Array.isArray(data.results) ? data.results : [],
    qualifiedTeams: Array.isArray(data.qualifiedTeams)
      ? data.qualifiedTeams
      : [],
    round16: Array.isArray(data.round16) ? data.round16 : [],
    quarterFinals: Array.isArray(data.quarterFinals)
      ? data.quarterFinals
      : [],
    semiFinals: Array.isArray(data.semiFinals) ? data.semiFinals : [],
    final: Array.isArray(data.final) ? data.final : [],
    predictionDrafts: [],
  };
}

async function loadTournamentData() {
  try {
    const response = await fetch("/api/admin/tournament");
    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || "Unable to load tournament data");
    }

    tournamentState = normalizeTournamentData(data.tournament);
  } catch (error) {
    console.error(error);
    tournamentState = { ...emptyTournamentState };
  }
}

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

function clearContainer(containerId) {
  const container = document.getElementById(containerId);

  container.textContent = "";

  return container;
}

function renderEmptyState(container, message) {
  container.appendChild(createElement("p", "empty-state", message));
}

function createFlag(teamName) {
  const flagPath =
    typeof getFlagSvg === "function" ? getFlagSvg(teamName) : undefined;

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
  const displayName = teamName || "TBD";
  const flag = createFlag(displayName);

  if (flag) {
    wrapper.appendChild(flag);
  }

  wrapper.appendChild(document.createTextNode(displayName));

  return wrapper;
}

function formatMatchMeta(match) {
  return [match.date, match.time, match.stadium].filter(Boolean).join(" · ");
}

function renderUpcomingMatches() {
  const container = clearContainer("upcomingMatches");

  if (!tournamentState.upcomingMatches.length) {
    renderEmptyState(container, "No upcoming matches available.");
    return;
  }

  tournamentState.upcomingMatches.forEach((match) => {
    const card = createElement("article", "match-card");
    const teams = createElement("div", "match-teams");
    const meta = createElement("div", "match-meta");

    teams.appendChild(createTeamInline(match.teamA));
    teams.appendChild(createElement("span", "versus", "VS"));
    teams.appendChild(createTeamInline(match.teamB));

    meta.textContent = formatMatchMeta(match) || "Fixture details pending";

    card.appendChild(teams);
    card.appendChild(meta);
    container.appendChild(card);
  });
}

function renderMatchResults() {
  const container = clearContainer("matchResults");

  if (!tournamentState.results.length) {
    renderEmptyState(container, "No results available.");
    return;
  }

  tournamentState.results.forEach((result) => {
    const card = createElement("article", "result-card");
    const score = createElement("div", "result-score");
    const scoreNumber = createElement(
      "span",
      "score-number",
      `${result.scoreA} - ${result.scoreB}`,
    );

    score.appendChild(createTeamInline(result.teamA));
    score.appendChild(scoreNumber);
    score.appendChild(createTeamInline(result.teamB));

    card.appendChild(score);
    container.appendChild(card);
  });
}

function renderQualifiedTeams() {
  const container = clearContainer("qualifiedTeams");

  if (!tournamentState.qualifiedTeams.length) {
    renderEmptyState(container, "No qualified teams yet.");
    return;
  }

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
  const container = clearContainer(containerId);

  if (!matches.length) {
    renderEmptyState(container, "TBD");
    return;
  }

  matches.forEach((match) => {
    const card = createElement(
      "article",
      isFinal ? "bracket-card final-card" : "bracket-card",
    );
    const label = createElement("div", "bracket-label", match.label || "TBD");
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
  const safeTeamId = (teamName || "team").replace(/\s+/g, "-");

  label.textContent = `${teamName} Score`;
  label.htmlFor = `${matchId}-${safeTeamId}-score`;

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
  const container = clearContainer("predictionForms");

  if (!tournamentState.upcomingMatches.length) {
    renderEmptyState(container, "No active matches available for predictions.");
    return;
  }

  tournamentState.upcomingMatches.forEach((match) => {
    const matchPanel = createElement("div", "prediction-panel section-panel");
    const title = createElement(
      "h3",
      "section-title",
      `${match.teamA} vs ${match.teamB}`,
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
  const groupName = `${match.id}-winner`;

  card.appendChild(createElement("h3", "", "Who Will Win?"));
  card.appendChild(createElement("p", "prediction-question", "Pick one result."));

  const options = createElement("div", "radio-list");
  options.appendChild(createRadioOption(groupName, match.teamA, match.teamA));
  options.appendChild(createRadioOption(groupName, "Draw", "Draw"));
  options.appendChild(createRadioOption(groupName, match.teamB, match.teamB));

  const button = createElement("button", "prediction-button", "Submit Prediction");
  button.addEventListener("click", () => {
    const selected = document.querySelector(
      `input[name="${groupName}"]:checked`,
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
  const groupName = `${match.id}-team`;

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
      `input[name="${groupName}"]:checked`,
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

async function initializeTournamentPage() {
  await loadTournamentData();
  renderUpcomingMatches();
  renderMatchResults();
  renderQualifiedTeams();
  renderBracket("round16", tournamentState.round16);
  renderBracket("quarterFinals", tournamentState.quarterFinals);
  renderBracket("semiFinals", tournamentState.semiFinals);
  renderBracket("finalMatch", tournamentState.final, true);
  renderPredictionForms();
}

document.addEventListener("DOMContentLoaded", initializeTournamentPage);
