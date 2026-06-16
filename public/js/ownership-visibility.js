/*
==================================================
OWNERSHIP VISIBILITY HELPERS
==================================================
*/

function formatBucks(value) {
  return (value || 0).toLocaleString() + " Bucks";
}

function formatOwnershipDate(value) {
  if (!value) {
    return "Unknown";
  }

  return new Date(value).toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function createOwnershipFlag(teamName) {
  if (typeof getFlagSvg !== "function") {
    return null;
  }

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

function createTeamOwnerLink(ownership) {
  const link = document.createElement("a");
  link.className = "ownership-team-link";
  link.href = "team-owners.html?teamId=" + encodeURIComponent(ownership.teamId);

  const flag = createOwnershipFlag(ownership.teamName);

  if (flag) {
    link.appendChild(flag);
  }

  link.appendChild(document.createTextNode(ownership.teamName));

  return link;
}

async function fetchOwnershipSummaries(userIds) {
  const uniqueUserIds = Array.from(new Set(userIds.filter(Boolean)));

  if (uniqueUserIds.length === 0) {
    return {};
  }

  const response = await fetch(
    "/api/ownership/summaries?userIds=" +
      uniqueUserIds.map(encodeURIComponent).join(","),
  );

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Failed to load ownership summaries");
  }

  return data.summaries || {};
}

function renderOwnershipPreview(container, summary) {
  container.replaceChildren();

  const title = document.createElement("div");
  title.className = "ownership-preview-title";
  title.textContent = "Teams Owned:";

  container.appendChild(title);

  if (!summary || summary.totalTeams === 0) {
    const empty = document.createElement("div");
    empty.className = "ownership-empty";
    empty.textContent = "No teams yet";
    container.appendChild(empty);
  } else {
    const list = document.createElement("div");
    list.className = "ownership-preview-list";

    summary.previewTeams.forEach((ownership) => {
      list.appendChild(createTeamOwnerLink(ownership));
    });

    if (summary.moreCount > 0) {
      const more = document.createElement("span");
      more.className = "ownership-more";
      more.textContent = "+" + summary.moreCount + " More";
      list.appendChild(more);
    }

    container.appendChild(list);
  }

  const portfolio = document.createElement("div");
  portfolio.className = "ownership-portfolio";
  portfolio.textContent =
    "Portfolio: " + (summary ? summary.totalTeams : 0) + " Teams";

  container.appendChild(portfolio);
}

