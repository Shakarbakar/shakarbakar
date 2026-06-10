/*
==================================================
SHAKARBAKAR - DUELS FRONTEND
==================================================

Frontend functions for:

- Create Duel
- Accept Duel
- Pending Duels
- Duel History
- Friends Dropdown

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
LOAD FRIENDS DROPDOWN
==================================================
*/

async function loadFriendsDropdown() {
  try {
    const user = getDuelUser();

    if (!user) {
      return;
    }

    const select = document.getElementById("duelOpponent");

    if (!select) {
      return;
    }

    select.innerHTML = '<option value="">Select Friend</option>';

    const response = await fetch("/api/chat/friends/" + user.id);

    const data = await response.json();

    if (!data.success) {
      return;
    }

    data.friends.forEach(function (friend) {
      const option = document.createElement("option");

      option.value = friend.friendUsername;

      option.textContent = friend.friendUsername;

      select.appendChild(option);
    });
  } catch (error) {
    console.error(error);
  }
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

    const duelTitle = document.getElementById("duelTitle").value.trim();

    let duelQuestion = document.getElementById("duelQuestion").value;

    const duelPrediction = document.getElementById("duelPrediction").value;

    const customQuestionEl = document.getElementById("customQuestion");

    if (duelQuestion === "custom" && customQuestionEl) {
      duelQuestion = customQuestionEl.value.trim();
    }

    if (!opponentUserId || !duelTitle || !duelQuestion || !duelPrediction) {
      alert("Please complete all fields");

      return;
    }

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

    if (data.success) {
      document.getElementById("duelTitle").value = "";

      document.getElementById("duelQuestion").selectedIndex = 0;

      document.getElementById("duelPrediction").selectedIndex = 0;

      if (customQuestionEl) {
        customQuestionEl.value = "";
      }
    }

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
        "<br>Status: " +
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
    await loadFriendsDropdown();

    await loadPendingDuels();

    await loadDuelHistory();
  },
);
