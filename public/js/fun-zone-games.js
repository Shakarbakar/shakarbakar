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

function getPuzzleValue(container) {
  return [...container.querySelectorAll("[data-letter-index]")]
    .map((node) => {
      if (node.dataset.space === "true") {
        return " ";
      }

      return node.value || node.textContent || "";
    })
    .join("");
}

function focusNextInput(input) {
  const inputs = [...document.querySelectorAll(".letter-input")];
  const index = inputs.indexOf(input);
  const next = inputs[index + 1];

  if (next) {
    next.focus();
  }
}

function renderEditableLetterBoxes(container, answer) {
  const revealed = revealIndexes(answer);

  container.textContent = "";

  [...answer].forEach((char, index) => {
    if (char === " ") {
      const space = el("span", "letter-space", "");
      space.dataset.letterIndex = String(index);
      space.dataset.space = "true";
      container.appendChild(space);
      return;
    }

    if (revealed.has(index)) {
      const fixed = el("span", "letter-box fixed", char);
      fixed.dataset.letterIndex = String(index);
      container.appendChild(fixed);
      return;
    }

    const input = document.createElement("input");
    input.className = "letter-input";
    input.maxLength = 1;
    input.autocomplete = "off";
    input.inputMode = "text";
    input.dataset.letterIndex = String(index);
    input.setAttribute("aria-label", `Letter ${index + 1}`);
    input.addEventListener("input", () => {
      input.value = input.value.slice(0, 1).toUpperCase();
      input.classList.remove("correct", "wrong");
      if (input.value) {
        focusNextInput(input);
      }
    });
    container.appendChild(input);
  });
}

function markPuzzle(container, answer) {
  let allCorrect = true;

  [...container.querySelectorAll(".letter-input")].forEach((input) => {
    const index = Number(input.dataset.letterIndex);
    const expected = answer[index].toLowerCase();
    const actual = input.value.toLowerCase();

    input.classList.remove("correct", "wrong");

    if (actual === expected) {
      input.classList.add("correct");
    } else {
      input.classList.add("wrong");
      allCorrect = false;
    }
  });

  return allCorrect && normalizeAnswer(getPuzzleValue(container)) === normalizeAnswer(answer);
}

function setSubmitSuccess(button, isCorrect) {
  if (isCorrect) {
    button.textContent = "✓ Correct";
    button.classList.add("secondary");
    button.disabled = true;
  } else {
    button.textContent = "Submit";
    button.classList.remove("secondary");
    button.disabled = false;
  }
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
    image.loading = "lazy";
    image.decoding = "async";
    button.href = game.page;

    body.appendChild(el("h2", "", game.name));
    body.appendChild(el("p", "", game.description));
    body.appendChild(button);
    card.appendChild(image);
    card.appendChild(body);
    grid.appendChild(card);
  });
}

function setupGuessGame(items, titleBuilder, visualBuilder) {
  let index = Math.floor(Math.random() * items.length);
  let current = items[index];
  const title = document.getElementById("challengeTitle");
  const visual = document.getElementById("challengeVisual");
  const boxes = document.getElementById("letterBoxes");
  const status = document.getElementById("gameStatus");
  const submit = document.getElementById("submitAnswer");
  const next = document.getElementById("nextChallenge");
  const previous = document.getElementById("previousChallenge");

  function loadChallenge(nextIndex) {
    index = (nextIndex + items.length) % items.length;
    current = items[index];
    title.textContent = titleBuilder(current);
    visual.replaceChildren(visualBuilder(current));
    renderEditableLetterBoxes(boxes, current.answer || current.country);
    status.textContent = "";
    setSubmitSuccess(submit, false);
    const firstInput = boxes.querySelector(".letter-input");
    if (firstInput) {
      firstInput.focus();
    }
  }

  submit.addEventListener("click", () => {
    const answer = current.answer || current.country;
    const correct = markPuzzle(boxes, answer);

    if (correct) {
      status.textContent = "✓ Perfect! You solved it.";
      setSubmitSuccess(submit, true);
    } else {
      status.textContent = "Red boxes need another try.";
    }
  });

  next.addEventListener("click", () => loadChallenge(index + 1));
  previous.addEventListener("click", () => loadChallenge(index - 1));
  loadChallenge(index);
}

function imageFromItem(item) {
  const image = document.createElement("img");

  image.src = item.image;
  image.alt = `${item.team || item.country} shirt`;
  image.loading = "lazy";
  image.decoding = "async";

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
  const stage = document.getElementById("penaltyStage");
  const result = document.getElementById("penaltyResult");

  function updateScore() {
    score.textContent = `Goals: ${goals} | Streak: ${streak}`;
  }

  function resetAnimationClasses() {
    stage.className = "penalty-stage";
  }

  document.querySelectorAll("[data-shot]").forEach((button) => {
    button.addEventListener("click", () => {
      const shot = button.dataset.shot;
      const keeper = pick(directions);
      const scored = shot !== keeper;

      resetAnimationClasses();
      void stage.offsetWidth;
      stage.classList.add(`shot-${shot.toLowerCase()}`);
      stage.classList.add(`keeper-${keeper.toLowerCase()}`);
      stage.classList.add(scored ? "goal" : "save");

      if (scored) {
        goals += 1;
        streak += 1;
        result.textContent = "GOAL";
        status.textContent = `Goal! Keeper dived ${keeper}.`;
      } else {
        streak = 0;
        result.textContent = "SAVE";
        status.textContent = `Saved! Keeper dived ${keeper}.`;
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

        card.title = "Choose this flag";
        card.setAttribute("aria-label", "Flag option");
        card.appendChild(el("div", "flag-choice", team.flag));
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
  let hintCount = 2;
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
    hintCount = 2;
    input.value = "";
    status.textContent = "";
    renderHints();
  }

  document.getElementById("submitAnswer").addEventListener("click", () => {
    if (normalizeAnswer(input.value) === normalizeAnswer(current.answer)) {
      status.textContent = "✓ Mystery solved!";
      return;
    }

    hintCount = Math.min(current.hints.length, hintCount + 1);
    status.textContent =
      hintCount === current.hints.length
        ? "Last hint unlocked. You can do this."
        : "Wrong guess. New hint unlocked.";
    renderHints();
  });

  document.getElementById("nextChallenge").addEventListener("click", nextPlayer);
  renderHints();
}

function initNumberLegends() {
  const pageSize = 4;
  const grid = document.getElementById("legendGrid");
  const title = document.getElementById("challengeTitle");
  const boxes = document.getElementById("letterBoxes");
  const status = document.getElementById("gameStatus");
  const submit = document.getElementById("submitAnswer");
  const previous = document.getElementById("previousChallenge");
  const next = document.getElementById("nextChallenge");
  let pageStart = 0;
  let currentIndex = -1;
  let current = null;

  function selectLegend(index) {
    currentIndex = (index + funData.numberLegends.length) % funData.numberLegends.length;
    current = funData.numberLegends[currentIndex];
    title.textContent = `${current.team} #${current.number}`;
    renderEditableLetterBoxes(boxes, current.answer);
    status.textContent = "Type in the boxes.";
    setSubmitSuccess(submit, false);
  }

  function renderShirtPage() {
    grid.textContent = "";
    funData.numberLegends.slice(pageStart, pageStart + pageSize).forEach((item, offset) => {
      const card = el("button", "choice-card");
      const image = document.createElement("img");

      image.src = item.image;
      image.alt = `${item.team} number ${item.number}`;
      image.loading = "lazy";
      image.decoding = "async";
      image.className = "game-image";
      card.appendChild(image);
      card.appendChild(el("strong", "", `${item.team} #${item.number}`));
      card.addEventListener("click", () => selectLegend(pageStart + offset));
      grid.appendChild(card);
    });
  }

  submit.addEventListener("click", () => {
    if (!current) {
      status.textContent = "Pick a shirt first.";
      return;
    }

    const correct = markPuzzle(boxes, current.answer);
    if (correct) {
      status.textContent = "✓ Correct legend!";
      setSubmitSuccess(submit, true);
    } else {
      status.textContent = "Red boxes need another try.";
    }
  });

  previous.addEventListener("click", () => selectLegend(currentIndex - 1));
  next.addEventListener("click", () => selectLegend(currentIndex + 1));
  document.getElementById("previousShirts").addEventListener("click", () => {
    pageStart = (pageStart - pageSize + funData.numberLegends.length) % funData.numberLegends.length;
    renderShirtPage();
  });
  document.getElementById("nextShirts").addEventListener("click", () => {
    pageStart = (pageStart + pageSize) % funData.numberLegends.length;
    renderShirtPage();
  });

  renderShirtPage();
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
