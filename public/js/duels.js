/*
==================================================
SHAKARBAKAR - DUELS FRONTEND
==================================================

Frontend functions for:

- Create Duel
- Accept Duel
- Pending Duels
- Duel History

==================================================
*/

/*
==================================================
GET LOGGED IN USER
==================================================
*/

function getDuelUser() {
  const raw = localStorage.getItem("shakarbakar_user");

  if (!raw) {
    return null;
  }

  return JSON.parse(raw);
}

/*
==================================================
CREATE DUEL
==================================================
*/

async function createDuel() {
  try {
    const user = getDuelUser();

    if (!user) {
      alert("Please login first");

      return;
    }

    const opponentUserId = document.getElementById("duelOpponent").value;

    const duelTitle = document.getElementById("duelTitle").value;

    const duelQuestion = document.getElementById("duelQuestion").value;

    const duelPrediction = document.getElementById("duelPrediction").value;

    const response = await fetch("/api/duels/create", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        challengerUserId: user.id,

        opponentUserId: opponentUserId,

        duelTitle: duelTitle,

        duelQuestion: duelQuestion,

        challengerPrediction: duelPrediction,
      }),
    });

    const data = await response.json();

    alert(data.message);

    loadDuelHistory();

    loadPendingDuels();
  } catch (error) {
    console.error(error);
  }
}

/*
==================================================
LOAD PENDING DUELS
==================================================
*/

async function loadPendingDuels() {
  try {
    const user = getDuelUser();

    if (!user) {
      return;
    }

    const response = await fetch("/api/duels/pending/" + user.id);

    const data = await response.json();

    const container = document.getElementById("pendingDuels");

    if (!container) {
      return;
    }

    container.innerHTML = "";

    if (!data.duels || data.duels.length === 0) {
      container.innerHTML = "No pending duels.";

      return;
    }

    data.duels.forEach(function (duel) {
      const div = document.createElement("div");

      div.className = "duel-history-item";

      div.innerHTML =
        "<strong>" +
        duel.duelTitle +
        "</strong><br>" +
        duel.challengerUsername +
        " challenged you<br><br>" +
        "<button onclick=\"acceptDuel('" +
        duel._id +
        "')\">Accept Duel</button>";

      container.appendChild(div);
    });
  } catch (error) {
    console.error(error);
  }
}

/*
==================================================
ACCEPT DUEL
==================================================
*/

async function acceptDuel(duelId) {
  try {
    const prediction = prompt("Enter your prediction");

    if (!prediction) {
      return;
    }

    const response = await fetch("/api/duels/accept", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        duelId: duelId,

        opponentPrediction: prediction,
      }),
    });

    const data = await response.json();

    alert(data.message);

    loadPendingDuels();

    loadDuelHistory();
  } catch (error) {
    console.error(error);
  }
}

/*
==================================================
LOAD DUEL HISTORY
==================================================
*/

async function loadDuelHistory() {
  try {
    const user = getDuelUser();

    if (!user) {
      return;
    }

    const response = await fetch("/api/duels/user/" + user.id);

    const data = await response.json();

    const container = document.getElementById("duelHistory");

    if (!container) {
      return;
    }

    container.innerHTML = "";

    if (!data.duels || data.duels.length === 0) {
      container.innerHTML = "No duels yet.";

      return;
    }

    data.duels.forEach(function (duel) {
      const div = document.createElement("div");

      div.className = "duel-history-item";

      div.innerHTML =
        "<strong>" +
        duel.duelTitle +
        "</strong><br>" +
        duel.challengerUsername +
        " vs " +
        duel.opponentUsername +
        "<br>" +
        "Status: " +
        duel.status;

      container.appendChild(div);
    });
  } catch (error) {
    console.error(error);
  }
}

/*
==================================================
AUTO LOAD
==================================================
*/

document.addEventListener(
  "DOMContentLoaded",

  async function () {
    await loadPendingDuels();

    await loadDuelHistory();
  },
);
