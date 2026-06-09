/*
==================================================
PLAYER DIRECTORY
==================================================
*/

async function loadPlayers() {
  const grid = document.getElementById("playersGrid");

  if (!grid) {
    return;
  }

  try {
    const response = await fetch("/api/users");

    const data = await response.json();

    if (!data.success) {
      grid.innerHTML = "<h2>Failed to load players</h2>";

      return;
    }

    grid.innerHTML = "";

    data.users.forEach((user) => {
      const card = document.createElement("div");

      card.className = "player-card";

      card.innerHTML =
        '<div class="player-name">' +
        user.username +
        "</div>" +
        '<div class="player-status online">' +
        "🟢 Registered Player" +
        "</div>" +
        '<button class="btn friend-btn" onclick="sendFriendRequest(\'' +
        user._id +
        "')\">" +
        "Add Friend" +
        "</button>" +
        '<button class="btn message-btn" onclick="openPrivateMessage(\'' +
        user._id +
        "')\">" +
        "Private Message" +
        "</button>" +
        '<button class="btn duel-btn" onclick="challengePlayer(\'' +
        user._id +
        "')\">" +
        "Challenge To Duel" +
        "</button>";

      grid.appendChild(card);
    });
  } catch (error) {
    console.error(error);

    grid.innerHTML = "<h2>Server Error</h2>";
  }
}

/*
==================================================
SEND FRIEND REQUEST
==================================================
*/

async function sendFriendRequest(receiverId) {
  const loggedUser = JSON.parse(localStorage.getItem("shakarbakar_user"));

  if (!loggedUser) {
    alert("Please login first");
    return;
  }

  try {
    const response = await fetch("/api/chat/friend-request", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fromUserId: loggedUser.id,
        toUserId: receiverId,
      }),
    });

    const data = await response.json();

    alert(data.message);
  } catch (error) {
    console.error(error);

    alert("Server Error");
  }
}

/*
==================================================
OPEN PRIVATE MESSAGE
==================================================
*/

function openPrivateMessage(userId) {
  window.location.href = "private-chat.html?userId=" + userId;
}

/*
==================================================
CHALLENGE PLAYER
==================================================
*/

function challengePlayer(userId) {
  window.location.href = "prediction-duels.html?opponentId=" + userId;
}

/*
==================================================
SEARCH
==================================================
*/

function setupSearch() {
  const searchBox = document.getElementById("playerSearch");

  const grid = document.getElementById("playersGrid");

  if (!searchBox || !grid) {
    return;
  }

  searchBox.addEventListener("input", () => {
    const term = searchBox.value.toLowerCase();

    const cards = document.querySelectorAll(".player-card");

    cards.forEach((card) => {
      const username = card
        .querySelector(".player-name")
        .innerText.toLowerCase();

      if (username.includes(term)) {
        card.style.display = "block";
      } else {
        card.style.display = "none";
      }
    });
  });
}

/*
==================================================
START
==================================================
*/

window.onload = function () {
  loadPlayers();

  setupSearch();
};
