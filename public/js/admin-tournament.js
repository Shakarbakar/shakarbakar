const emptyTournamentData = {
  upcomingMatches: [],
  results: [],
  qualifiedTeams: [],
  round16: [],
  quarterFinals: [],
  semiFinals: [],
  final: [],
};

const bracketLabels = {
  round16: "Round of 16",
  quarterFinals: "Quarter Final",
  semiFinals: "Semi Final",
  final: "Final",
};

const bracketSections = ["round16", "quarterFinals", "semiFinals", "final"];

let tournamentData = { ...emptyTournamentData };
const tournamentStorage = window.ShakarBakarTournament;

function createId(prefix) {
  if (window.crypto && typeof window.crypto.randomUUID === "function") {
    return `${prefix}-${window.crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function setStatus(message, isError = false) {
  const status = document.getElementById("managerStatus");

  status.textContent = message;
  status.style.color = isError ? "#fca5a5" : "#86efac";
}

function normalizeClientData(data = {}) {
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
  };
}

function loadTournamentData() {
  tournamentData = normalizeClientData(tournamentStorage.getTournamentData());
  renderAll();
}

function saveTournamentData(successMessage) {
  tournamentData = normalizeClientData(
    tournamentStorage.saveTournamentData(tournamentData),
  );
  renderAll();
  setStatus(successMessage || "Tournament data saved.");
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

function createActionButton(label, className, onClick) {
  const button = createElement("button", className, label);

  button.type = "button";
  button.addEventListener("click", onClick);

  return button;
}

function clearForm(formId, submitId, submitLabel) {
  document.getElementById(formId).reset();
  document.getElementById(submitId).textContent = submitLabel;
}

function renderEmpty(container, message) {
  container.appendChild(createElement("p", "empty-state", message));
}

function renderUpcomingMatches() {
  const container = document.getElementById("upcomingList");

  container.textContent = "";

  if (!tournamentData.upcomingMatches.length) {
    renderEmpty(container, "No upcoming matches added.");
    return;
  }

  tournamentData.upcomingMatches.forEach((match) => {
    const item = createElement("article", "manager-item");
    const content = createElement("div");
    const title = createElement(
      "div",
      "item-title",
      `${match.teamA} vs ${match.teamB}`,
    );
    const meta = createElement(
      "div",
      "item-meta",
      `${match.date || "No date"} · ${match.time || "No time"} · ${
        match.stadium || "No stadium"
      }`,
    );
    const actions = createElement("div", "item-actions");

    actions.appendChild(
      createActionButton("Edit", "secondary-button", () => editUpcoming(match.id)),
    );
    actions.appendChild(
      createActionButton("Delete", "danger-button", () =>
        deleteItem("upcomingMatches", match.id, "Match deleted."),
      ),
    );

    content.appendChild(title);
    content.appendChild(meta);
    item.appendChild(content);
    item.appendChild(actions);
    container.appendChild(item);
  });
}

function editUpcoming(id) {
  const match = tournamentData.upcomingMatches.find((item) => item.id === id);

  if (!match) {
    return;
  }

  document.getElementById("upcomingId").value = match.id;
  document.getElementById("upcomingTeamA").value = match.teamA;
  document.getElementById("upcomingTeamB").value = match.teamB;
  document.getElementById("upcomingDate").value = match.date;
  document.getElementById("upcomingTime").value = match.time;
  document.getElementById("upcomingStadium").value = match.stadium || "";
  document.getElementById("upcomingSubmit").textContent = "Update Match";
}

function handleUpcomingSubmit(event) {
  event.preventDefault();

  const id = document.getElementById("upcomingId").value;
  const match = {
    id: id || createId("match"),
    teamA: document.getElementById("upcomingTeamA").value.trim(),
    teamB: document.getElementById("upcomingTeamB").value.trim(),
    date: document.getElementById("upcomingDate").value,
    time: document.getElementById("upcomingTime").value,
    stadium: document.getElementById("upcomingStadium").value.trim(),
  };

  if (id) {
    tournamentData.upcomingMatches = tournamentData.upcomingMatches.map((item) =>
      item.id === id ? match : item,
    );
  } else {
    tournamentData.upcomingMatches.push(match);
  }

  clearForm("upcomingForm", "upcomingSubmit", "Add Match");
  saveTournamentData(id ? "Match updated." : "Match added.");
}

function renderResults() {
  const container = document.getElementById("resultsList");

  container.textContent = "";

  if (!tournamentData.results.length) {
    renderEmpty(container, "No match results added.");
    return;
  }

  tournamentData.results.forEach((result) => {
    const item = createElement("article", "manager-item");
    const content = createElement("div");
    const title = createElement(
      "div",
      "item-title",
      `${result.teamA} ${result.scoreA} - ${result.scoreB} ${result.teamB}`,
    );
    const meta = createElement("div", "item-meta", "Completed match result");
    const actions = createElement("div", "item-actions");

    actions.appendChild(
      createActionButton("Edit", "secondary-button", () => editResult(result.id)),
    );
    actions.appendChild(
      createActionButton("Delete", "danger-button", () =>
        deleteItem("results", result.id, "Result deleted."),
      ),
    );

    content.appendChild(title);
    content.appendChild(meta);
    item.appendChild(content);
    item.appendChild(actions);
    container.appendChild(item);
  });
}

function editResult(id) {
  const result = tournamentData.results.find((item) => item.id === id);

  if (!result) {
    return;
  }

  document.getElementById("resultId").value = result.id;
  document.getElementById("resultTeamA").value = result.teamA;
  document.getElementById("resultTeamB").value = result.teamB;
  document.getElementById("scoreA").value = result.scoreA;
  document.getElementById("scoreB").value = result.scoreB;
  document.getElementById("resultSubmit").textContent = "Update Result";
}

function handleResultSubmit(event) {
  event.preventDefault();

  const id = document.getElementById("resultId").value;
  const result = {
    id: id || createId("result"),
    teamA: document.getElementById("resultTeamA").value.trim(),
    teamB: document.getElementById("resultTeamB").value.trim(),
    scoreA: Number(document.getElementById("scoreA").value),
    scoreB: Number(document.getElementById("scoreB").value),
  };

  if (id) {
    tournamentData.results = tournamentData.results.map((item) =>
      item.id === id ? result : item,
    );
  } else {
    tournamentData.results.push(result);
  }

  clearForm("resultForm", "resultSubmit", "Add Result");
  saveTournamentData(id ? "Result updated." : "Result added.");
}

function renderQualifiedTeams() {
  const container = document.getElementById("qualifiedList");

  container.textContent = "";

  if (!tournamentData.qualifiedTeams.length) {
    renderEmpty(container, "No qualified teams added.");
    return;
  }

  tournamentData.qualifiedTeams.forEach((teamName) => {
    const pill = createElement("span", "team-pill");
    const name = createElement("span", "", teamName);
    const remove = createActionButton("Remove", "danger-button", () => {
      tournamentData.qualifiedTeams = tournamentData.qualifiedTeams.filter(
        (team) => team !== teamName,
      );
      saveTournamentData("Team removed.");
    });

    pill.appendChild(name);
    pill.appendChild(remove);
    container.appendChild(pill);
  });
}

function handleQualifiedSubmit(event) {
  event.preventDefault();

  const input = document.getElementById("qualifiedTeam");
  const teamName = input.value.trim();

  if (!teamName) {
    return;
  }

  if (!tournamentData.qualifiedTeams.includes(teamName)) {
    tournamentData.qualifiedTeams.push(teamName);
    saveTournamentData("Team added.");
  } else {
    setStatus("That team is already qualified.");
  }

  input.value = "";
}

function buildBracketForm(sectionName, mount) {
  const form = createElement("form", "manager-form");
  const idInput = document.createElement("input");
  const labelField = createField(`${sectionName}Label`, "Match Label");
  const teamAField = createField(`${sectionName}TeamA`, "Team A");
  const teamBField = createField(`${sectionName}TeamB`, "Team B");
  const actions = createElement("div", "form-actions");
  const submit = createElement("button", "gold-button", "Add Matchup");
  const cancel = createElement("button", "secondary-button", "Cancel Edit");

  idInput.type = "hidden";
  idInput.id = `${sectionName}Id`;
  submit.type = "submit";
  submit.id = `${sectionName}Submit`;
  cancel.type = "button";
  cancel.addEventListener("click", () => {
    form.reset();
    idInput.value = "";
    submit.textContent = "Add Matchup";
  });

  form.id = `${sectionName}Form`;
  form.appendChild(idInput);
  form.appendChild(labelField.wrapper);
  form.appendChild(teamAField.wrapper);
  form.appendChild(teamBField.wrapper);
  actions.appendChild(submit);
  actions.appendChild(cancel);
  form.appendChild(actions);
  form.addEventListener("submit", (event) => handleBracketSubmit(event, sectionName));

  mount.appendChild(form);
  mount.appendChild(createElement("div", "item-list"));
}

function createField(id, labelText) {
  const wrapper = createElement("div", "field");
  const label = document.createElement("label");
  const input = document.createElement("input");

  label.htmlFor = id;
  label.textContent = labelText;
  input.id = id;
  input.required = labelText !== "Match Label";

  wrapper.appendChild(label);
  wrapper.appendChild(input);

  return { wrapper, input };
}

function handleBracketSubmit(event, sectionName) {
  event.preventDefault();

  const id = document.getElementById(`${sectionName}Id`).value;
  const defaultLabel =
    sectionName === "final"
      ? "Final"
      : `${bracketLabels[sectionName]} ${tournamentData[sectionName].length + 1}`;
  const match = {
    id: id || createId(sectionName),
    label:
      document.getElementById(`${sectionName}Label`).value.trim() ||
      defaultLabel,
    teamA: document.getElementById(`${sectionName}TeamA`).value.trim(),
    teamB: document.getElementById(`${sectionName}TeamB`).value.trim(),
  };

  if (id) {
    tournamentData[sectionName] = tournamentData[sectionName].map((item) =>
      item.id === id ? match : item,
    );
  } else {
    tournamentData[sectionName].push(match);
  }

  document.getElementById(`${sectionName}Form`).reset();
  document.getElementById(`${sectionName}Id`).value = "";
  document.getElementById(`${sectionName}Submit`).textContent = "Add Matchup";
  saveTournamentData("Bracket matchup saved.");
}

function renderBracketSection(sectionName) {
  const section = document.querySelector(`[data-bracket-section="${sectionName}"]`);
  const container = section.querySelector(".item-list");

  container.textContent = "";

  if (!tournamentData[sectionName].length) {
    renderEmpty(container, "No matchups assigned.");
    return;
  }

  tournamentData[sectionName].forEach((match) => {
    const item = createElement("article", "manager-item");
    const content = createElement("div");
    const title = createElement("div", "item-title", match.label);
    const meta = createElement(
      "div",
      "item-meta",
      `${match.teamA || "TBD"} vs ${match.teamB || "TBD"}`,
    );
    const actions = createElement("div", "item-actions");

    actions.appendChild(
      createActionButton("Edit", "secondary-button", () =>
        editBracketMatch(sectionName, match.id),
      ),
    );
    actions.appendChild(
      createActionButton("Delete", "danger-button", () =>
        deleteItem(sectionName, match.id, "Bracket matchup deleted."),
      ),
    );

    content.appendChild(title);
    content.appendChild(meta);
    item.appendChild(content);
    item.appendChild(actions);
    container.appendChild(item);
  });
}

function editBracketMatch(sectionName, id) {
  const match = tournamentData[sectionName].find((item) => item.id === id);

  if (!match) {
    return;
  }

  document.getElementById(`${sectionName}Id`).value = match.id;
  document.getElementById(`${sectionName}Label`).value = match.label;
  document.getElementById(`${sectionName}TeamA`).value = match.teamA;
  document.getElementById(`${sectionName}TeamB`).value = match.teamB;
  document.getElementById(`${sectionName}Submit`).textContent = "Update Matchup";
}

function deleteItem(collectionName, id, message) {
  tournamentData[collectionName] = tournamentData[collectionName].filter(
    (item) => item.id !== id,
  );
  saveTournamentData(message);
}

function renderAll() {
  renderUpcomingMatches();
  renderResults();
  renderQualifiedTeams();
  bracketSections.forEach(renderBracketSection);
  renderPredictionDashboard();
}

function renderMetric(id, value) {
  const element = document.getElementById(id);

  if (element) {
    element.textContent = value;
  }
}

function renderDashboardList(containerId, items, emptyMessage) {
  const container = document.getElementById(containerId);

  if (!container) {
    return;
  }

  container.textContent = "";

  if (!items.length) {
    renderEmpty(container, emptyMessage);
    return;
  }

  items.forEach((item) => {
    container.appendChild(item);
  });
}

function renderPredictionDashboard() {
  const breakdown = tournamentStorage.getPredictionBreakdown();
  const leaderboard = tournamentStorage.getLeaderboard();
  const announcements = tournamentStorage.getTournamentAnnouncements();

  renderMetric("totalPredictions", breakdown.total);
  renderMetric("teamPredictionCount", breakdown.teamPredictions);
  renderMetric("scorePredictionCount", breakdown.scorePredictions);
  renderMetric("perfectPredictionCount", breakdown.perfectPrediction);

  renderDashboardList(
    "predictionBreakdownList",
    [
      createDashboardItem("Pending", `${breakdown.pending} predictions`),
      createDashboardItem(
        "Correct Winner",
        `${breakdown.correctWinner} predictions`,
      ),
      createDashboardItem(
        "Perfect Prediction",
        `${breakdown.perfectPrediction} predictions`,
      ),
      createDashboardItem("Incorrect", `${breakdown.incorrect} predictions`),
    ],
    "No prediction breakdown yet.",
  );

  renderDashboardList(
    "topPredictorsList",
    leaderboard.slice(0, 5).map((entry) =>
      createDashboardItem(
        `#${entry.rank} ${entry.username}`,
        `${entry.points} points`,
      ),
    ),
    "No predictors yet.",
  );

  renderDashboardList(
    "tournamentAnnouncementsList",
    announcements.slice(0, 5).map((announcement) =>
      createDashboardItem(
        announcement.text,
        new Date(announcement.timestamp).toLocaleString(),
      ),
    ),
    "No tournament announcements yet.",
  );
}

function createDashboardItem(title, meta) {
  const item = createElement("article", "manager-item");
  const content = createElement("div");

  content.appendChild(createElement("div", "item-title", title));
  content.appendChild(createElement("div", "item-meta", meta));
  item.appendChild(content);

  return item;
}

function initializeBracketManagers() {
  document.querySelectorAll(".bracket-manager").forEach((section) => {
    const sectionName = section.dataset.bracketSection;
    const mount = section.querySelector(".bracketMount");

    buildBracketForm(sectionName, mount);
  });
}

function initializeTournamentManager() {
  initializeBracketManagers();
  document
    .getElementById("upcomingForm")
    .addEventListener("submit", handleUpcomingSubmit);
  document.getElementById("upcomingCancel").addEventListener("click", () => {
    document.getElementById("upcomingId").value = "";
    clearForm("upcomingForm", "upcomingSubmit", "Add Match");
  });
  document
    .getElementById("resultForm")
    .addEventListener("submit", handleResultSubmit);
  document.getElementById("resultCancel").addEventListener("click", () => {
    document.getElementById("resultId").value = "";
    clearForm("resultForm", "resultSubmit", "Add Result");
  });
  document
    .getElementById("qualifiedForm")
    .addEventListener("submit", handleQualifiedSubmit);

  loadTournamentData();

  window.addEventListener("storage", loadTournamentData);
  window.addEventListener("shakarbakar:predictions-updated", renderAll);
  window.addEventListener("shakarbakar:tournament-announcements-updated", renderAll);
}

document.addEventListener("DOMContentLoaded", initializeTournamentManager);
