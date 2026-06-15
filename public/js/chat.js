/*
==================================================
SHAKARBAKAR - CHAT FRONTEND
==================================================

Frontend functions for:

- Player Directory
- Friend Requests
- Private Messages
- Chat Rooms

==================================================
*/

/*
==================================================
GET LOGGED IN USER
==================================================
*/

function getArenaUser() {
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
LOAD FRIENDS FOR PRIVATE CHAT
==================================================
*/

async function loadFriendsForChat() {
  const user = getArenaUser();

  if (!user || !user.id) {
    return [];
  }

  const response = await fetch(
    "/api/chat/friends/" + encodeURIComponent(user.id),
  );

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Failed to load friends");
  }

  return data.friends;
}

/*
==================================================
LOAD ALL USERS
==================================================
*/

async function loadUsers() {
  try {
    const response = await fetch("/api/chat/users");

    const data = await response.json();

    console.log("Users:", data.users);

    return data.users;
  } catch (error) {
    console.error(error);
  }
}

/*
==================================================
SEND FRIEND REQUEST
==================================================
*/

async function sendFriendRequest(toUserId) {
  try {
    const user = getArenaUser();

    const response = await fetch("/api/chat/friend-request", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        fromUserId: user.id,
        toUserId: toUserId,
      }),
    });

    const data = await response.json();

    alert(data.message);
  } catch (error) {
    console.error(error);
  }
}

/*
==================================================
LOAD FRIEND REQUESTS
==================================================
*/

async function loadFriendRequests() {
  try {
    const user = getArenaUser();

    const response = await fetch("/api/chat/friend-requests/" + user.id);

    const data = await response.json();

    console.log("Friend Requests:", data.requests);

    return data.requests;
  } catch (error) {
    console.error(error);
  }
}

/*
==================================================
SEND PRIVATE MESSAGE
==================================================
*/

async function sendPrivateMessage(toUserId, messageText) {
  try {
    const user = getArenaUser();

    if (!user || !user.id || !toUserId) {
      return {
        success: false,
        message: "Choose a friend before sending a message",
      };
    }

    const response = await fetch("/api/chat/send-message", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        fromUserId: user.id,
        toUserId: toUserId,
        message: messageText,
      }),
    });

    const data = await response.json();

    return data;
  } catch (error) {
    console.error(error);

    return {
      success: false,
      message: "Unable to send message",
    };
  }
}

/*
==================================================
LOAD CONVERSATION
==================================================
*/

async function loadMessages(otherUserId) {
  const user = getArenaUser();

  if (!user || !user.id || !otherUserId) {
    return [];
  }

  const response = await fetch(
    "/api/chat/messages" +
      "?user1=" +
      encodeURIComponent(user.id) +
      "&user2=" +
      encodeURIComponent(otherUserId),
  );

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Failed to load messages");
  }

  return data.messages;
}

/*
==================================================
MARK CONVERSATION READ
==================================================
*/

async function markConversationRead(otherUserId) {
  const user = getArenaUser();

  if (!user || !user.id || !otherUserId) {
    return;
  }

  const response = await fetch("/api/chat/mark-read", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId: user.id,
      friendUserId: otherUserId,
    }),
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Failed to update message notifications");
  }
}

/*
==================================================
CREATE CHAT ROOM
==================================================
*/

async function createChatRoom() {
  try {
    const user = getArenaUser();

    const roomName = prompt("Room Name");

    const description = prompt("Description");

    if (!roomName) {
      return;
    }

    const response = await fetch("/api/chat/create-room", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        roomName: roomName,

        description: description,

        userId: user.id,
      }),
    });

    const data = await response.json();

    alert("Room created");

    loadChatRooms();
  } catch (error) {
    console.error(error);
  }
}

/*
==================================================
LOAD CHAT ROOMS
==================================================
*/

async function loadChatRooms() {
  try {
    const response = await fetch("/api/chat/rooms");

    const data = await response.json();

    console.log("Rooms:", data.rooms);

    return data.rooms;
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
    await loadUsers();

    await loadFriendRequests();

    await loadChatRooms();
  },
);
