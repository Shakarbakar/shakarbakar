const funData = window.FunZoneData;

function el(tag, className, text) {
  const node = document.createElement(tag);

  if (className) {
    node.className = className;
  }

  if (text !== undefined) {
    node.textContent = text;
  }

  return node;
}

function pick(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function normalizeAnswer(value) {
  return String(value).trim().toLowerCase().replace(/\s+/g, " ");
}

function revealIndexes(answer) {
  const letters = [...answer]
    .map((char, index) => ({ char, index }))
    .filter((item) => /[a-z0-9]/i.test(item.char));
  const revealPercent = letters.length <= 6 ? 0.25 : 0.45;
  const revealCount = Math.max(1, Math.round(letters.length * revealPercent));
  const shuffled = [...letters].sort(() => Math.random() - 0.5);

  return new Set(shuffled.slice(0, revealCount).map((item) => item.index));
}

function renderLetterBoxes(container, answer) {
  const revealed = revealIndexes(answer);

  container.textContent = "";

  [...answer].forEach((char, index) => {
    if (char === " ") {
      container.appendChild(el("span", "letter-space", ""));
      return;
    }

    container.appendChild(
      el("span", "letter-box", revealed.has(index) ? char : ""),
    );
  });
}

function createNav() {
  return `
    <nav class="fun-nav">
      <a class="fun-logo" href="index.html">SHAKARBAKAR</a>
      <div class="fun-links">
        <a href="index.html">Home</a>
        <a href="arena.html">Arena</a>
        <a class="active" href="fun-zone.html">Fun Zone</a>
      </div>
    </nav>
  `;
}

function renderHub() {
  const grid = document.getElementById("gamesGrid");

  if (!grid) {
    return;
  }

  funData.games.forEach((game) => {
    const card = el("article", "game-card");
    const image = document.createElement("img");
    const body = el("div", "game-card-body");
    const button = el("a", "fun-button", "Play");

    image.src = game.image;
    image.alt = game.name;
    button.href = game.page;

    body.appendChild(el("h2", "", game.name));
    body.appendChild(el("p", "", game.description));
    body.appendChild(button);
    card.appendChild(image);
    card.appendChild(body);
    grid.appendChild(card);
  });
}

function setupGuessGame(items, titleBuilder, imageBuilder) {
  let current = pick(items);
  const title = document.getElementById("challengeTitle");
  const visual = document.getElementById("challengeVisual");
  const boxes = document.getElementById("letterBoxes");
  const input = document.getElementById("answerInput");
  const status = document.getElementById("gameStatus");
  const next = document.getElementById("nextChallenge");

  function loadChallenge() {
    current = pick(items);
    title.textContent = titleBuilder(current);
    visual.replaceChildren(imageBuilder(current));
    renderLetterBoxes(boxes, current.answer || current.country);
    input.value = "";
    status.textContent = "";
  }

  document.getElementById("submitAnswer").addEventListener("click", () => {
    const answer = current.answer || current.country;

    if (normalizeAnswer(input.value) === normalizeAnswer(answer)) {
      status.textContent = "Correct! Nice one.";
    } else {
      status.textContent = "Try again. Look carefully at the boxes.";
    }
  });

  next.addEventListener("click", loadChallenge);
  loadChallenge();
}

function imageFromItem(item) {
  const image = document.createElement("img");

  image.src = item.image;
  image.alt = `${item.team || item.country} shirt`;

  return image;
}

function initGuessPlayer() {
  setupGuessGame(
    funData.numberLegends,
    (item) => `${item.team} #${item.number}`,
    imageFromItem,
  );
}

function initGuessTeam() {
  setupGuessGame(
    funData.teams.map((team) => ({ ...team, answer: team.country })),
    () => "Guess the country",
    (item) => el("div", "big-flag", item.flag),
  );
}

function initHigherLower() {
  let current = pick(funData.worldCupTitles);
  let next = pick(funData.worldCupTitles.filter((team) => team.team !== current.team));
  let score = 0;
  const prompt = document.getElementById("higherLowerPrompt");
  const status = document.getElementById("gameStatus");
  const scoreBox = document.getElementById("scoreBox");

  function render() {
    prompt.textContent = `${next.team}: higher or lower than ${current.team}'s ${current.titles} titles?`;
    scoreBox.textContent = `Score: ${score}`;
  }

  function answer(choice) {
    const correct =
      choice === "higher"
        ? next.titles >= current.titles
        : next.titles <= current.titles;

    if (correct) {
      score += 1;
      status.textContent = `Correct! ${next.team} has ${next.titles}.`;
      current = next;
    } else {
      score = 0;
      status.textContent = `Oops! ${next.team} has ${next.titles}. Streak reset.`;
    }

    next = pick(funData.worldCupTitles.filter((team) => team.team !== current.team));
    render();
  }

  document.getElementById("higherButton").addEventListener("click", () => answer("higher"));
  document.getElementById("lowerButton").addEventListener("click", () => answer("lower"));
  render();
}

function initPenaltyShootout() {
  const directions = ["Left", "Center", "Right"];
  let goals = 0;
  let streak = 0;
  const status = document.getElementById("gameStatus");
  const score = document.getElementById("scoreBox");

  function updateScore() {
    score.textContent = `Goals: ${goals} | Streak: ${streak}`;
  }

  document.querySelectorAll("[data-shot]").forEach((button) => {
    button.addEventListener("click", () => {
      const shot = button.dataset.shot;
      const keeper = pick(directions);

      if (shot === keeper) {
        streak = 0;
        status.textContent = `Saved! Keeper dived ${keeper}.`;
      } else {
        goals += 1;
        streak += 1;
        status.textContent = `Goal! Keeper dived ${keeper}.`;
      }

      updateScore();
    });
  });

  updateScore();
}

function initSpotFlag() {
  const target = document.getElementById("targetCountry");
  const grid = document.getElementById("flagGrid");
  const status = document.getElementById("gameStatus");
  let current = pick(funData.teams);

  function loadRound() {
    current = pick(funData.teams);
    target.textContent = `Find: ${current.country}`;
    status.textContent = "";
    grid.textContent = "";

    [...funData.teams]
      .sort(() => Math.random() - 0.5)
      .slice(0, 6)
      .concat(current)
      .filter((team, index, list) => list.findIndex((item) => item.country === team.country) === index)
      .sort(() => Math.random() - 0.5)
      .forEach((team) => {
        const card = el("button", "choice-card");

        card.appendChild(el("div", "flag-choice", team.flag));
        card.appendChild(el("strong", "", team.country));
        card.addEventListener("click", () => {
          if (team.country === current.country) {
            status.textContent = "Correct flag!";
            setTimeout(loadRound, 700);
          } else {
            status.textContent = "Not that one. Try again.";
          }
        });
        grid.appendChild(card);
      });
  }

  loadRound();
}

function initMysteryPlayer() {
  let current = pick(funData.mysteryPlayers);
  let hintCount = 1;
  const hints = document.getElementById("hintList");
  const input = document.getElementById("answerInput");
  const status = document.getElementById("gameStatus");

  function renderHints() {
    hints.textContent = "";
    current.hints.slice(0, hintCount).forEach((hint) => {
      hints.appendChild(el("li", "", hint));
    });
  }

  function nextPlayer() {
    current = pick(funData.mysteryPlayers);
    hintCount = 1;
    input.value = "";
    status.textContent = "";
    renderHints();
  }

  document.getElementById("submitAnswer").addEventListener("click", () => {
    if (normalizeAnswer(input.value) === normalizeAnswer(current.answer)) {
      status.textContent = "Correct mystery solved!";
      return;
    }

    hintCount = Math.min(current.hints.length, hintCount + 1);
    status.textContent = "Wrong guess. New hint unlocked.";
    renderHints();
  });

  document.getElementById("nextChallenge").addEventListener("click", nextPlayer);
  renderHints();
}

function initNumberLegends() {
  const grid = document.getElementById("legendGrid");
  const title = document.getElementById("challengeTitle");
  const boxes = document.getElementById("letterBoxes");
  const input = document.getElementById("answerInput");
  const status = document.getElementById("gameStatus");
  let current = null;

  funData.numberLegends.forEach((item) => {
    const card = el("button", "choice-card");
    const image = document.createElement("img");

    image.src = item.image;
    image.alt = `${item.team} number ${item.number}`;
    image.className = "game-image";
    card.appendChild(image);
    card.appendChild(el("strong", "", `${item.team} #${item.number}`));
    card.addEventListener("click", () => {
      current = item;
      title.textContent = `${item.team} #${item.number}`;
      renderLetterBoxes(boxes, item.answer);
      input.value = "";
      status.textContent = "Guess the legend.";
    });
    grid.appendChild(card);
  });

  document.getElementById("submitAnswer").addEventListener("click", () => {
    if (!current) {
      status.textContent = "Pick a shirt first.";
      return;
    }

    status.textContent =
      normalizeAnswer(input.value) === normalizeAnswer(current.answer)
        ? "Correct legend!"
        : "Not yet. Try the letters again.";
  });
}

function initGame() {
  const game = document.body.dataset.game;

  if (game === "hub") renderHub();
  if (game === "guess-player") initGuessPlayer();
  if (game === "guess-team") initGuessTeam();
  if (game === "higher-lower") initHigherLower();
  if (game === "penalty-shootout") initPenaltyShootout();
  if (game === "spot-flag") initSpotFlag();
  if (game === "mystery-player") initMysteryPlayer();
  if (game === "number-legends") initNumberLegends();
}

document.addEventListener("DOMContentLoaded", initGame);
