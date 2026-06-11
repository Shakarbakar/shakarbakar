# SHAKARBAKAR PROJECT MAP

## Technology Stack

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- Vanilla JavaScript
- HTML/CSS

---

# Backend

## Main Server

### server.js

Application entry point.

Responsibilities:

- Start Express server
- Connect MongoDB Atlas
- Register routes
- Serve frontend files
- Configure middleware

---

# Data

## data/

### fifaWorldCup2026Teams.js

World Cup 2026 team dataset.

---

# Models

## models/

### User.js

User accounts and profiles.

### Friend.js

Friend relationships.

### FriendRequest.js

Pending friend requests.

### Message.js

Private messages.

### ChatRoom.js

Arena and chat rooms.

### Duel.js

Prediction duel records.

### Team.js

Football teams.

### Ownership.js

Ownership system.

---

# API Routes

## routes/

### login.js

Authentication and login endpoints.

### register.js

User registration endpoints.

### users.js

User management endpoints.

### chat.js

Chat system API.

### duels.js

Prediction duel API.

### teams.js

Teams and football data API.

### ownership.js

Ownership system API.

---

# Frontend Pages

## public/

### index.html

Homepage.

### login.html

Login page.

### register.html

Registration page.

### profile.html

User profile page.

### friends.html

Friends management page.

### friend-requests.html

Pending friend requests page.

### private-chat.html

Private messaging page.

### arena.html

Main arena page.

### arena-chat.html

Arena chat interface.

### prediction-duels.html

Prediction duel page.

### marketplace.html

Marketplace page.

### player-directory.html

Player directory page.

---

# Frontend JavaScript

## public/js/

### app.js

Global application functions.

### chat.js

Chat functionality.

### duels.js

Prediction duel frontend.

### friends.js

Friends management.

### friend-requests.js

Friend request handling.

### player-directory.js

Player directory functions.

### translations.js

Language and translation support.

---

# Scripts

## scripts/

### seedTeams.js

Database seeding script for football teams.

---

# Core Systems

## Authentication System

Files:

- login.html
- register.html
- routes/login.js
- routes/register.js
- models/User.js

---

## Friends System

Files:

- friends.html
- friend-requests.html
- public/js/friends.js
- public/js/friend-requests.js
- models/Friend.js
- models/FriendRequest.js

---

## Chat System

Files:

- private-chat.html
- arena-chat.html
- public/js/chat.js
- routes/chat.js
- models/Message.js
- models/ChatRoom.js

---

## Prediction Duel System

Files:

- prediction-duels.html
- public/js/duels.js
- routes/duels.js
- models/Duel.js

---

## Football System

Files:

- player-directory.html
- routes/teams.js
- models/Team.js
- data/fifaWorldCup2026Teams.js

---

## Ownership System

Files:

- marketplace.html
- routes/ownership.js
- models/Ownership.js

---

# Database Collections

- users
- friends
- friendrequests
- messages
- chatrooms
- duels
- teams
- ownerships

---

# Ignored Folders

Never analyze or modify unless specifically needed:

- node_modules/
- .git/

---

# Development Rule

Before modifying any feature:

1. Read the related HTML page.
2. Read the related frontend JavaScript file.
3. Read the related route file.
4. Read the related model file.
5. Verify MongoDB schema compatibility.
