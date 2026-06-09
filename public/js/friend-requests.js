/*
==================================================
FRIEND REQUESTS PAGE
==================================================

Loads incoming friend requests.

Allows:
- Accept Request
- Decline Request

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
LOAD REQUESTS
==================================================
*/

async function loadFriendRequests() {
  const grid = document.getElementById("requestsGrid");

  if (!grid) {
    return;
  }

  const user = getLoggedInUser();

  if (!user) {
    grid.innerHTML = "<h2>Please login first.</h2>";

    return;
  }

  try {
    const response = await fetch("/api/chat/friend-requests/" + user.id);

    const data = await response.json();

    if (!data.success) {
      grid.innerHTML = "<h2>No requests found.</h2>";

      return;
    }

    grid.innerHTML = "";

    if (data.requests.length === 0) {
      grid.innerHTML = "<h2>No pending friend requests.</h2>";

      return;
    }

    data.requests.forEach((request) => {
      const card = document.createElement("div");

      card.className = "request-card";

      card.innerHTML =
        '<div class="username">' +
        request.fromUsername +
        "</div>" +
        "<p>Wants to become your friend.</p>" +
        '<button class="btn accept-btn" onclick="acceptRequest(\'' +
        request._id +
        "')\">Accept Request</button>" +
        '<button class="btn decline-btn" onclick="declineRequest(\'' +
        request._id +
        "')\">Decline Request</button>";

      grid.appendChild(card);
    });
  } catch (error) {
    console.error(error);

    grid.innerHTML = "<h2>Server Error</h2>";
  }
}

/*
==================================================
ACCEPT REQUEST
==================================================
*/

async function acceptRequest(requestId) {
  try {
    const response = await fetch("/api/chat/friend-request/accept", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        requestId: requestId,
      }),
    });

    const data = await response.json();

    alert(data.message);

    loadFriendRequests();
  } catch (error) {
    console.error(error);
  }
}

/*
==================================================
DECLINE REQUEST
==================================================
*/

async function declineRequest(requestId) {
  try {
    const response = await fetch("/api/chat/friend-request/reject", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        requestId: requestId,
      }),
    });

    const data = await response.json();

    alert(data.message);

    loadFriendRequests();
  } catch (error) {
    console.error(error);
  }
}

/*
==================================================
START
==================================================
*/

window.onload = function () {
  loadFriendRequests();
};
