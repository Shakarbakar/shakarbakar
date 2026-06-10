/*
==================================================
SHAKARBAKAR - DUELS FRONTEND
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

    data.friends.forEach((friend) => {
      const option = document.createElement("option");

      option.value = friend.friendUserId;

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

    let duelPrediction = "";

    const customQuestionEl = document.getElementById("customQuestion");

    const customPredictionEl = document.getElementById("customPrediction");

    if (duelQuestion === "custom") {
      duelQuestion = customQuestionEl.value.trim();
      duelPrediction = customPredictionEl.value.trim();
    } else {
      duelPrediction = document.getElementById("duelPrediction").value;
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
        opponentUserId,
        duelTitle,
        duelQuestion,
        challengerPrediction: duelPrediction,
      }),
    });

    const data = await response.json();

    alert(data.message);

    await loadPendingDuels();
    await loadActiveDuels();
    await loadDuelHistory();
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

    data.duels.forEach((duel) => {
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
        duelId,
        opponentPrediction: prediction,
      }),
    });

    const data = await response.json();

    alert(data.message);

    await loadPendingDuels();
    await loadActiveDuels();
    await loadDuelHistory();
  } catch (error) {
    console.error(error);
  }
}

/*
==================================================
LOAD ACTIVE DUELS
==================================================
*/

async function loadActiveDuels() {
  try {
    const user = getDuelUser();

    if (!user) {
      return;
    }

    const response = await fetch("/api/duels/user/" + user.id);

    const data = await response.json();

    const container = document.getElementById("activeDuels");

    if (!container) {
      return;
    }

    container.innerHTML = "";

    const activeDuels = data.duels.filter((duel) => duel.status === "accepted");

    if (activeDuels.length === 0) {
      container.innerHTML = "No active duels.";
      return;
    }

    activeDuels.forEach((duel) => {
      const div = document.createElement("div");

      div.className = "duel-history-item";

      div.innerHTML =
        "<strong>" +
        duel.duelTitle +
        "</strong><br>" +
        duel.challengerUsername +
        " vs " +
        duel.opponentUsername +
        "<br><br>" +
        "<button onclick=\"submitResult('" +
        duel._id +
        "')\">Submit Result</button>";

      container.appendChild(div);
    });
  } catch (error) {
    console.error(error);
  }
}

/*
==================================================
SUBMIT RESULT
==================================================
*/

async function submitResult(duelId) {
  const actualResult = prompt("Enter actual result");

  if (!actualResult) {
    return;
  }

  try {
    const response = await fetch("/api/duels/submit-result", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        duelId,
        actualResult,
      }),
    });

    const data = await response.json();

    alert(data.message);

    await loadActiveDuels();
    await loadDuelHistory();
  } catch (error) {
    console.error(error);
  }
}

/*
==================================================
LOAD HISTORY
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

    data.duels.forEach((duel) => {
      const div = document.createElement("div");

      div.className = "duel-history-item";

      let html =
        "<strong>" +
        duel.duelTitle +
        "</strong><br>" +
        duel.challengerUsername +
        " vs " +
        duel.opponentUsername +
        "<br>Status: " +
        duel.status;

      if (duel.status === "result_submitted") {
        html +=
          "<br><br><button onclick=\"confirmResult('" +
          duel._id +
          "')\">Confirm Result</button>";
      }

      div.innerHTML = html;

      container.appendChild(div);
    });
  } catch (error) {
    console.error(error);
  }
}

/*
==================================================
CONFIRM RESULT
==================================================
*/

async function confirmResult(duelId) {
  try {
    const response = await fetch("/api/duels/confirm-result", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        duelId,
      }),
    });

    const data = await response.json();

    alert(data.message);

    await loadActiveDuels();
    await loadDuelHistory();
  } catch (error) {
    console.error(error);
  }
}

/*
==================================================
AUTO REFRESH
==================================================
*/

setInterval(async () => {
  await loadPendingDuels();
  await loadActiveDuels();
  await loadDuelHistory();
}, 5000);

/*
==================================================
START
==================================================
*/

document.addEventListener("DOMContentLoaded", async function () {
  await loadFriendsDropdown();
  await loadPendingDuels();
  await loadActiveDuels();
  await loadDuelHistory();
});
