# PROJECT_CONTEXT.md

## Project

ShakarBakar is a World Cup social trading game.

Users receive Bucks and can buy national football teams.

Users can own multiple teams.

Multiple users can own the same team.

A user cannot own the same team twice.

Technology:

- Node.js
- Express
- MongoDB
- Mongoose
- Vanilla HTML/CSS/JavaScript

---

## Current Features

### Authentication

Working:

- Register
- Login
- LocalStorage user session

### Marketplace

Working:

- Teams loaded from MongoDB
- Buy Team
- Sell Team
- Ownership tracking
- User Bucks balance updates

Models:

- User
- Team
- Ownership

Rules:

- Multiple users can own same team.
- User cannot own same team twice.

### Social

Existing:

- Friends
- Friend Requests
- Player Directory
- Private Chat
- Prediction Duels

Known Issue:

- Friend messages currently not arriving correctly.

### Arena

Existing:

- Arena page
- Arena Chat Hub
- Arena Announcements page
- Admin Dashboard

### Admin Dashboard

Existing:

- View platform statistics
- Create announcements
- Delete announcements
- View announcements

Announcement model:

- title
- content
- category
- createdBy
- timestamps

---

## Important Product Direction

Focus on finishing and polishing existing features before building advanced systems.

Do NOT build:

- Order books
- Futures
- Margin trading
- Complex exchange engine

World Cup timeline is more important than advanced trading features.

---

## Approved Development Roadmap

### Phase 1

1. Fix friend messages.
2. Show password on login page.
3. Show password on register page.

### Phase 2

1. My Teams page.
2. Show owned teams on Friends page.
3. Show owned teams on Player Directory.
4. Show owned teams on User Profile page.

### Phase 3

1. Admin Team Price Manager.
2. Arena Announcements improvements.
3. Homepage news feed.

### Phase 4

1. Tournament page.
2. Match results.
3. Qualified teams.
4. Quarter-finals section.
5. Semi-finals section.
6. Final section.

### Phase 5

Prediction system.

Users can:

- Predict winner.
- Predict tournament winner.
- Predict exact score.

Example:

Germany vs Brazil

Germany Score:
0-7 dropdown

Brazil Score:
0-7 dropdown

Submit Prediction.

Future rewards:

- Correct winner.
- Perfect score.

---

## Ownership Visibility Vision

Users should be able to see team ownership throughout the platform.

Examples:

Friends page:

George

Teams Owned:
Brazil
France
Germany

Player Directory:

Maria

Teams Owned:
Argentina
Spain

User Profile:

Teams Owned:
Brazil
France
Germany

This should become a core social feature.

---

## Marketplace Vision

Current:

- Buy Team
- Sell Team

Future:

- Price changes after buys/sells.
- Admin tournament boosts.
- Portfolio value.
- Profit/Loss tracking.

Example:

Brazil

Bought At:
1000 Bucks

Current Price:
1300 Bucks

Profit:
+300 Bucks

---

## Future Trade Center

Possible future page:

trade.html

Examples:

Brazil/BUCKS
France/BUCKS
Germany/BUCKS

Simple Binance-style UI.

No order book.

No matching engine.

No futures.

No leverage.

Just:

- Current price
- Buy
- Sell
- Ownership
- Portfolio information

This is lower priority than the World Cup roadmap.
