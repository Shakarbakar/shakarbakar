const tournamentTools = window.ShakarBakarTournament;

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

function renderEmpty(container, message) {
  container.textContent = "";
  container.appendChild(createElement("p", "empty-state", message));
}

function formatPrediction(prediction) {
  if (prediction.type === "score") {
    return `${prediction.teamA} ${prediction.prediction.scoreA}-${prediction.prediction.scoreB} ${prediction.teamB}`;
  }

  return prediction.prediction.selection;
}

function renderCardList(containerId, items, emptyMessage) {
  const container = document.getElementById(containerId);

  container.textContent = "";

  if (!items.length) {
    renderEmpty(container, emptyMessage);
    return;
  }

  items.forEach((item) => container.appendChild(item));
}

function createInfoCard(title, lines) {
  const card = createElement("article", "info-card");
  const heading = createElement("h3", "", title);

  card.appendChild(heading);

  lines.forEach((line) => {
    card.appendChild(createElement("p", "", line));
  });

  return card;
}

function renderMyPredictions() {
  const username = tournamentTools.getLoggedInUsername();
  const data = tournamentTools.getTournamentData();
  const predictions = tournamentTools
    .getPredictions()
    .filter((prediction) => prediction.username === username)
    .sort((first, second) => new Date(second.timestamp) - new Date(first.timestamp));

  document.getElementById("currentUsername").textContent = username;

  renderCardList(
    "myPredictionsList",
    predictions.map((prediction) => {
      const evaluation = tournamentTools.evaluatePrediction(prediction, data);

      return createInfoCard(prediction.match, [
        `Type: ${prediction.type === "score" ? "Exact Score" : "Team Prediction"}`,
        `Prediction: ${formatPrediction(prediction)}`,
        `Status: ${evaluation.status}`,
        `Points: ${evaluation.points}`,
        `Submitted: ${new Date(prediction.timestamp).toLocaleString()}`,
      ]);
    }),
    "You have not submitted any predictions yet.",
  );
}

function renderPublicStats() {
  const stats = tournamentTools.getPublicPredictionStats();

  renderCardList(
    "teamStatsList",
    stats.teamStats.map((row) =>
      createInfoCard(row.match, [
        `Prediction: ${row.prediction}`,
        `Votes: ${row.count}`,
        `Share: ${row.percentage}%`,
      ]),
    ),
    "No team prediction votes yet.",
  );

  renderCardList(
    "scoreStatsList",
    stats.scoreStats.map((row) =>
      createInfoCard(row.match, [
        `Exact Score: ${row.prediction}`,
        `Votes: ${row.count}`,
      ]),
    ),
    "No exact score votes yet.",
  );
}

function renderLeaderboard() {
  const leaderboard = tournamentTools.getLeaderboard();

  renderCardList(
    "leaderboardList",
    leaderboard.map((entry) =>
      createInfoCard(`#${entry.rank} ${entry.username}`, [
        `Points: ${entry.points}`,
      ]),
    ),
    "No scored predictions yet.",
  );
}

function renderCurrentInfoPage() {
  const page = document.body.dataset.page;

  if (page === "my-predictions") {
    renderMyPredictions();
  } else if (page === "predictions") {
    renderPublicStats();
  } else if (page === "leaderboard") {
    renderLeaderboard();
  }
}

function initializeTournamentInfoPage() {
  renderCurrentInfoPage();
  window.addEventListener("storage", renderCurrentInfoPage);
  window.addEventListener("shakarbakar:predictions-updated", renderCurrentInfoPage);
  window.addEventListener("shakarbakar:tournament-updated", renderCurrentInfoPage);
}

document.addEventListener("DOMContentLoaded", initializeTournamentInfoPage);
