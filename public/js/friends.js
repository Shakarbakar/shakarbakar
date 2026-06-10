/*
==================================================
FRIENDS PAGE
==================================================

Loads all friends for the currently logged-in user.

Allows:

- Private Chat
- Challenge To Duel
- Remove Friend

==================================================
*/

/*
==================================================
GET LOGGED IN USER
==================================================
*/

function getLoggedInUser() {
  const raw = localStorage.getItem("shakarbakar_user");

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw);
  } catch (error) {
    return null;
  }
}

/*
==================================================
LOAD FRIENDS
==================================================
*/

async function loadFriends() {
  const grid = document.getElementById("friendsGrid");

  if (!grid) {
    return;
  }

  const user = getLoggedInUser();

  if (!user) {
    grid.innerHTML = "<h2>Please login first.</h2>";
    return;
  }

  try {
    const response = await fetch("/api/chat/friends/" + user.id);

    const data = await response.json();

    if (!data.success) {
      grid.innerHTML = "<h2>Failed to load friends.</h2>";
      return;
    }

    grid.innerHTML = "";

    if (data.friends.length === 0) {
      grid.innerHTML = "<h2>You do not have any friends yet.</h2>";
      return;
    }

    data.friends.forEach((friend) => {
      const card = document.createElement("div");

      card.className = "friend-card";

      card.innerHTML = `
        <div style="font-size:60px;text-align:center;margin-bottom:10px;">
          👤
        </div>

        <div class="friend-name">
          ${friend.friendUsername}
        </div>

        <div class="online">
          🟢 Registered Player
        </div>

        <button
          class="btn message-btn"
          onclick="openPrivateChat('${friend.friendUserId}')"
        >
          💬 Chat Friend
        </button>

        <button
          class="btn duel-btn"
          onclick="challengeFriend('${friend.friendUserId}')"
        >
          ⚔️ Duel
        </button>

        <button
          class="btn remove-btn"
          onclick="removeFriend('${friend.friendUserId}')"
        >
          ❌ Remove
        </button>
      `;

      grid.appendChild(card);
    });
  } catch (error) {
    console.error(error);

    grid.innerHTML = "<h2>Server Error</h2>";
  }
}

/*
==================================================
OPEN PRIVATE CHAT
==================================================
*/

function openPrivateChat(friendId) {
  if (!friendId) {
    alert("Friend ID not found");
    return;
  }

  window.location.href =
    "private-chat.html?userId=" + encodeURIComponent(friendId);
}

/*
==================================================
CHALLENGE FRIEND
==================================================
*/

function challengeFriend(friendId) {
  window.location.href =
    "prediction-duels.html?opponent=" + encodeURIComponent(friendId);
}

/*
==================================================
REMOVE FRIEND
==================================================
*/

async function removeFriend(friendId) {
  const user = getLoggedInUser();

  if (!user) {
    return;
  }

  const confirmed = confirm("Remove this friend?");

  if (!confirmed) {
    return;
  }

  try {
    const response = await fetch("/api/chat/remove-friend", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        userId: user.id,
        friendUserId: friendId,
      }),
    });

    const data = await response.json();

    alert(data.message);

    await loadFriends();
  } catch (error) {
    console.error(error);
  }
}

/*
==================================================
START PAGE
==================================================
*/

window.onload = function () {
  loadFriends();
};
