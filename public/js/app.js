/*
==================================================
SHAKARBAKAR - SHARED JAVASCRIPT
==================================================

This file contains frontend logic used across
multiple pages (login, register, marketplace).

==================================================
*/

/*
==================================================
LOCAL STORAGE — LOGGED IN USER
==================================================

Stores the logged-in user after login.
Used by the marketplace to buy teams.

(No cookies or JWT — Version 1 approach.)

==================================================
*/

const STORAGE_KEY = "shakarbakar_user";

/*
==================================================
GET LOGGED IN USER
==================================================
*/

function getLoggedInUser() {

    const raw = localStorage.getItem(STORAGE_KEY);

    if (!raw) {
        return null;
    }

    try {
        return JSON.parse(raw);
    }
    catch (error) {
        return null;
    }

}

/*
==================================================
SAVE LOGGED IN USER
==================================================
*/

function saveLoggedInUser(user) {

    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));

}

/*
==================================================
CLEAR LOGGED IN USER
==================================================
*/

function clearLoggedInUser() {

    localStorage.removeItem(STORAGE_KEY);

}

/*
==================================================
LOGIN USER
==================================================

Called on login.html.

==================================================
*/

async function loginUser() {

    const identifier =
        document.getElementById("identifier").value;

    const password =
        document.getElementById("password").value;

    const message =
        document.getElementById("message");

    if (!identifier.trim() || !password) {

        message.className = "message error";
        message.innerText =
            "Please enter your username or email and password";

        return;

    }

    try {

        const response = await fetch("/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                identifier: identifier.trim(),
                password: password
            })
        });

        const data = await response.json();

        if (data.success) {

            // Save user for marketplace and ownership
            saveLoggedInUser(data.user);

            message.className = "message success";

            message.innerText =
                "Login successful! Welcome, " +
                data.user.username +
                ". You have " +
                data.user.bucksBalance.toLocaleString() +
                " Bucks.";

            // Redirect to marketplace after short delay
            setTimeout(function () {
                window.location.href = "marketplace.html";
            }, 1500);

        }
        else {

            message.className = "message error";
            message.innerText = data.message;

        }

    }
    catch (error) {

        console.error(error);
        message.className = "message error";
        message.innerText = "Server error";

    }

}

/*
==================================================
MARKETPLACE — GLOBAL STATE
==================================================
*/

let marketplaceTeams = [];
let selectedTeamId = null;

/*
==================================================
LOAD MARKETPLACE
==================================================

Fetches all teams and builds the grid.
Simple display: flag + name only.

==================================================
*/

async function loadMarketplace() {

    const grid = document.getElementById("teamsGrid");
    const messageEl = document.getElementById("marketplaceMessage");

    if (!grid) {
        return;
    }

    const user = getLoggedInUser();

    updateUserBar(user);

    try {

        let url = "/api/teams";

        if (user && user.id) {
            url += "?userId=" + user.id;
        }

        const response = await fetch(url);
        const data = await response.json();

        if (!data.success) {
            messageEl.className = "message error";
            messageEl.innerText = data.message || "Could not load teams";
            return;
        }

        marketplaceTeams = data.teams;

        grid.innerHTML = "";

        marketplaceTeams.forEach(function (team) {

            const card = document.createElement("div");

            card.className = "team-card";

            if (team.isOwned) {
                card.classList.add("team-card-owned");
            }

            card.onclick = function () {
                openTeamPopup(team._id);
            };

            let ownedLabel = "";

            if (team.isOwned) {
                ownedLabel =
                    '<span class="team-card-owned-label">I own ' +
                    team.name +
                    "</span>";
            }

            card.innerHTML =
                '<span class="team-card-flag">' +
                team.flag +
                "</span>" +
                '<span class="team-card-name">' +
                team.name +
                "</span>" +
                ownedLabel;

            grid.appendChild(card);

        });

    }
    catch (error) {

        console.error(error);
        messageEl.className = "message error";
        messageEl.innerText = "Server error";

    }

}

/*
==================================================
UPDATE USER BAR
==================================================
*/

function updateUserBar(user) {

    const userBar = document.getElementById("userBar");
    const loginPrompt = document.getElementById("loginPrompt");
    const greeting = document.getElementById("userGreeting");
    const balance = document.getElementById("userBalance");

    if (!userBar) {
        return;
    }

    if (user && user.id) {

        userBar.classList.remove("hidden");
        loginPrompt.classList.add("hidden");

        greeting.innerText = "Welcome, " + user.username;
        balance.innerText =
            user.bucksBalance.toLocaleString() + " Bucks";

    }
    else {

        userBar.classList.add("hidden");
        loginPrompt.classList.remove("hidden");

    }

}

/*
==================================================
OPEN TEAM POPUP
==================================================
*/

function openTeamPopup(teamId) {

    const team = marketplaceTeams.find(function (t) {
        return String(t._id) === String(teamId);
    });

    if (!team) {
        return;
    }

    selectedTeamId = teamId;

    document.getElementById("popupFlag").innerText = team.flag;
    document.getElementById("popupName").innerText = team.name;
    document.getElementById("popupBasePrice").innerText =
        team.basePrice.toLocaleString() + " Bucks";

    const starsEl = document.getElementById("popupStars");

    if (team.stars) {
        starsEl.innerText = team.stars;
    }
    else {
        starsEl.innerText = "—";
    }

    document.getElementById("popupPrice").innerText =
        team.price.toLocaleString() + " Bucks";

    document.getElementById("popupQualification").innerText =
        team.qualificationStatus;

    const ownershipEl = document.getElementById("popupOwnership");
    const buyButton = document.getElementById("buyTeamButton");

    if (team.isOwned) {

        ownershipEl.innerText = "I own " + team.name;
        ownershipEl.classList.remove("available");
        buyButton.disabled = true;
        buyButton.innerText = "I own " + team.name;

    }
    else {

        ownershipEl.innerText = "Available";
        ownershipEl.classList.add("available");
        buyButton.disabled = false;
        buyButton.innerText = "Buy Team";

    }

    document.getElementById("popupMessage").innerText = "";
    document.getElementById("popupMessage").className = "message";

    document.getElementById("teamPopup").classList.remove("hidden");
    document.getElementById("popupOverlay").classList.remove("hidden");

}

/*
==================================================
CLOSE TEAM POPUP
==================================================
*/

function closeTeamPopup() {

    document.getElementById("teamPopup").classList.add("hidden");
    document.getElementById("popupOverlay").classList.add("hidden");
    selectedTeamId = null;

}

/*
==================================================
BUY TEAM
==================================================

Calls POST /api/ownership/buy

==================================================
*/

async function buyTeam() {

    const user = getLoggedInUser();
    const messageEl = document.getElementById("popupMessage");
    const buyButton = document.getElementById("buyTeamButton");

    if (!user || !user.id) {

        messageEl.className = "message error";
        messageEl.innerText = "Please log in to buy a team.";

        return;

    }

    if (!selectedTeamId) {
        return;
    }

    buyButton.disabled = true;

    try {

        const response = await fetch("/api/ownership/buy", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                userId: user.id,
                teamId: selectedTeamId
            })
        });

        const data = await response.json();

        if (data.success) {

            // Update stored user balance
            user.bucksBalance = data.remainingBalance;
            saveLoggedInUser(user);

            updateUserBar(user);

            messageEl.className = "message success";

            messageEl.innerHTML =
                "Success!<br><br>" +
                "You now own " + data.team.name + ".<br><br>" +
                "Remaining Balance:<br>" +
                data.remainingBalance.toLocaleString() +
                " Bucks";

            buyButton.innerText = "I own " + data.team.name;

            document.getElementById("popupOwnership").innerText =
                "I own " + data.team.name;

            document.getElementById("popupOwnership").classList.remove("available");

            // Refresh grid so ownership shows on cards
            await loadMarketplace();

            // Re-open popup with updated team data
            openTeamPopup(selectedTeamId);

            // Restore success message after reload
            document.getElementById("popupMessage").className = "message success";
            document.getElementById("popupMessage").innerHTML =
                "Success!<br><br>" +
                "You now own " + data.team.name + ".<br><br>" +
                "Remaining Balance:<br>" +
                data.remainingBalance.toLocaleString() +
                " Bucks";

        }
        else {

            messageEl.className = "message error";
            messageEl.innerText = data.message;
            buyButton.disabled = false;

        }

    }
    catch (error) {

        console.error(error);
        messageEl.className = "message error";
        messageEl.innerText = "Server error";
        buyButton.disabled = false;

    }

}
