(function () {
  const TOURNAMENT_DATA_KEY = "shakarbakar_tournament_data";
  const TOURNAMENT_PREDICTIONS_KEY = "shakarbakar_tournament_predictions";
  const TOURNAMENT_ANNOUNCEMENTS_KEY = "shakarbakar_tournament_announcements";
  const USER_KEY = "shakarbakar_user";

  const defaultTournamentData = {
    upcomingMatches: [],
    results: [],
    qualifiedTeams: [],
    round16: [],
    quarterFinals: [],
    semiFinals: [],
    final: [],
  };

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function readJson(key, fallback) {
    const raw = localStorage.getItem(key);

    if (!raw) {
      return clone(fallback);
    }

    try {
      return JSON.parse(raw);
    } catch (error) {
      return clone(fallback);
    }
  }

  function writeJson(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function createId(prefix) {
    if (window.crypto && typeof window.crypto.randomUUID === "function") {
      return `${prefix}-${window.crypto.randomUUID()}`;
    }

    return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  }

  function cleanString(value) {
    return typeof value === "string" ? value.trim() : "";
  }

  function isPlaceholderText(value) {
    const text = cleanString(value).toLowerCase();

    return (
      !text ||
      text === "team a" ||
      text === "team b" ||
      text.startsWith("team placeholder") ||
      text.startsWith("match slot") ||
      text.startsWith("result slot") ||
      text.startsWith("winner r16") ||
      text.startsWith("winner qf") ||
      text.startsWith("winner sf") ||
      text.includes("placeholder")
    );
  }

  function containsPlaceholderContent(value) {
    const text = cleanString(value).toLowerCase();

    return (
      text.includes("match slot") ||
      text.includes("team placeholder") ||
      text.includes("team a") ||
      text.includes("team b") ||
      text.includes("placeholder") ||
      text.includes("winner r16") ||
      text.includes("winner qf") ||
      text.includes("winner sf")
    );
  }

  function isRealTeamName(value) {
    return !isPlaceholderText(value);
  }

  function isRealUpcomingMatch(match) {
    return isRealTeamName(match.teamA) && isRealTeamName(match.teamB);
  }

  function isRealResult(result) {
    return isRealTeamName(result.teamA) && isRealTeamName(result.teamB);
  }

  function normalizeMatchList(items) {
    return Array.isArray(items)
      ? items.map((item) => ({
          id: cleanString(item.id) || createId("match"),
          label: cleanString(item.label),
          teamA: cleanString(item.teamA),
          teamB: cleanString(item.teamB),
          date: cleanString(item.date),
          time: cleanString(item.time),
          stadium: cleanString(item.stadium || item.venue),
        })).filter(isRealUpcomingMatch)
      : [];
  }

  function normalizeResults(items) {
    return Array.isArray(items)
      ? items.map((item) => ({
          id: cleanString(item.id) || createId("result"),
          matchId: cleanString(item.matchId),
          label: cleanString(item.label),
          teamA: cleanString(item.teamA),
          teamB: cleanString(item.teamB),
          scoreA: item.scoreA === "" ? "" : Number(item.scoreA),
          scoreB: item.scoreB === "" ? "" : Number(item.scoreB),
          date: cleanString(item.date),
        })).filter(isRealResult)
      : [];
  }

  function normalizeBracketList(items, prefix) {
    return Array.isArray(items)
      ? items.map((item, index) => ({
          id: cleanString(item.id) || createId(prefix),
          label: cleanString(item.label) || `Match ${index + 1}`,
          teamA: cleanString(item.teamA),
          teamB: cleanString(item.teamB),
        })).filter((item) => isRealTeamName(item.teamA) && isRealTeamName(item.teamB))
      : [];
  }

  function normalizeTournamentData(data) {
    const source = data || defaultTournamentData;

    return {
      upcomingMatches: normalizeMatchList(source.upcomingMatches),
      results: normalizeResults(source.results),
      qualifiedTeams: Array.isArray(source.qualifiedTeams)
        ? [...new Set(source.qualifiedTeams.map(cleanString).filter(isRealTeamName))]
        : [],
      round16: normalizeBracketList(source.round16, "round16"),
      quarterFinals: normalizeBracketList(source.quarterFinals, "qf"),
      semiFinals: normalizeBracketList(source.semiFinals, "sf"),
      final: normalizeBracketList(source.final, "final"),
    };
  }

  function getTournamentData() {
    const stored = localStorage.getItem(TOURNAMENT_DATA_KEY);
    const data = normalizeTournamentData(
      stored ? readJson(TOURNAMENT_DATA_KEY, defaultTournamentData) : defaultTournamentData,
    );

    if (!stored || JSON.stringify(data) !== stored) {
      writeJson(TOURNAMENT_DATA_KEY, data);
    }

    return data;
  }

  function saveTournamentData(data) {
    const normalized = normalizeTournamentData(data);

    writeJson(TOURNAMENT_DATA_KEY, normalized);
    refreshTournamentAnnouncements();
    window.dispatchEvent(new CustomEvent("shakarbakar:tournament-updated"));

    return normalized;
  }

  function getLoggedInUsername() {
    const user = readJson(USER_KEY, null);

    return user && user.username ? user.username : "Guest";
  }

  function getPredictions() {
    const predictions = readJson(TOURNAMENT_PREDICTIONS_KEY, []).filter(
      isRealPrediction,
    );

    writeJson(TOURNAMENT_PREDICTIONS_KEY, predictions);

    return predictions;
  }

  function savePredictions(predictions) {
    const cleanedPredictions = predictions.filter(isRealPrediction);

    writeJson(TOURNAMENT_PREDICTIONS_KEY, cleanedPredictions);
    refreshTournamentAnnouncements();
    window.dispatchEvent(new CustomEvent("shakarbakar:predictions-updated"));

    return cleanedPredictions;
  }

  function savePrediction(prediction) {
    const predictions = getPredictions();
    const nextPrediction = {
      id: createId("prediction"),
      username: getLoggedInUsername(),
      matchId: cleanString(prediction.matchId),
      match: getPredictionMatchName(prediction),
      teamA: cleanString(prediction.teamA),
      teamB: cleanString(prediction.teamB),
      type: cleanString(prediction.type),
      prediction: prediction.prediction,
      timestamp: new Date().toISOString(),
    };

    if (!isRealPrediction(nextPrediction)) {
      return null;
    }

    predictions.push(nextPrediction);
    savePredictions(predictions);

    return nextPrediction;
  }

  function normalizeTeamName(teamName) {
    return cleanString(teamName).toLowerCase();
  }

  function getMatchLabel(match) {
    if (!match) {
      return "Upcoming Match";
    }

    return `${match.teamA} vs ${match.teamB}`;
  }

  function getPredictionMatchName(prediction) {
    return `${cleanString(prediction.teamA)} vs ${cleanString(prediction.teamB)}`;
  }

  function isRealPrediction(prediction) {
    return (
      prediction &&
      isRealTeamName(prediction.teamA) &&
      isRealTeamName(prediction.teamB)
    );
  }

  function findResultForPrediction(prediction, data = getTournamentData()) {
    return data.results.find((result) => {
      if (result.matchId && prediction.matchId) {
        return result.matchId === prediction.matchId;
      }

      return (
        normalizeTeamName(result.teamA) === normalizeTeamName(prediction.teamA) &&
        normalizeTeamName(result.teamB) === normalizeTeamName(prediction.teamB)
      );
    });
  }

  function hasUsableScore(result) {
    return (
      result.scoreA !== "" &&
      result.scoreB !== "" &&
      Number.isFinite(Number(result.scoreA)) &&
      Number.isFinite(Number(result.scoreB))
    );
  }

  function determineWinner(teamA, teamB, scoreA, scoreB) {
    const firstScore = Number(scoreA);
    const secondScore = Number(scoreB);

    if (firstScore === secondScore) {
      return "Draw";
    }

    return firstScore > secondScore ? teamA : teamB;
  }

  function getPredictionWinner(prediction) {
    if (prediction.type === "score") {
      return determineWinner(
        prediction.teamA,
        prediction.teamB,
        prediction.prediction.scoreA,
        prediction.prediction.scoreB,
      );
    }

    return prediction.prediction.selection;
  }

  function evaluatePrediction(prediction, data = getTournamentData()) {
    const result = findResultForPrediction(prediction, data);

    if (!result || !hasUsableScore(result)) {
      return {
        status: "Pending",
        points: 0,
      };
    }

    const actualWinner = determineWinner(
      result.teamA,
      result.teamB,
      result.scoreA,
      result.scoreB,
    );

    if (
      prediction.type === "score" &&
      Number(prediction.prediction.scoreA) === Number(result.scoreA) &&
      Number(prediction.prediction.scoreB) === Number(result.scoreB)
    ) {
      return {
        status: "Perfect Prediction",
        points: 10,
      };
    }

    if (getPredictionWinner(prediction) === actualWinner) {
      return {
        status: "Correct Winner",
        points: 3,
      };
    }

    return {
      status: "Incorrect",
      points: 0,
    };
  }

  function getLeaderboard() {
    const scores = new Map();
    const data = getTournamentData();

    getPredictions().forEach((prediction) => {
      const evaluation = evaluatePrediction(prediction, data);

      if (!scores.has(prediction.username)) {
        scores.set(prediction.username, 0);
      }

      scores.set(prediction.username, scores.get(prediction.username) + evaluation.points);
    });

    return [...scores.entries()]
      .map(([username, points]) => ({ username, points }))
      .filter((entry) => entry.points > 0)
      .sort((first, second) => second.points - first.points || first.username.localeCompare(second.username))
      .map((entry, index) => ({
        rank: index + 1,
        ...entry,
      }));
  }

  function getPredictionBreakdown() {
    const predictions = getPredictions();
    const data = getTournamentData();
    const breakdown = {
      total: predictions.length,
      pending: 0,
      correctWinner: 0,
      perfectPrediction: 0,
      incorrect: 0,
      teamPredictions: 0,
      scorePredictions: 0,
    };

    predictions.forEach((prediction) => {
      const evaluation = evaluatePrediction(prediction, data);

      if (prediction.type === "score") {
        breakdown.scorePredictions += 1;
      } else {
        breakdown.teamPredictions += 1;
      }

      if (evaluation.status === "Pending") {
        breakdown.pending += 1;
      } else if (evaluation.status === "Correct Winner") {
        breakdown.correctWinner += 1;
      } else if (evaluation.status === "Perfect Prediction") {
        breakdown.perfectPrediction += 1;
      } else {
        breakdown.incorrect += 1;
      }
    });

    return breakdown;
  }

  function getPublicPredictionStats() {
    const teamStats = new Map();
    const scoreStats = new Map();

    getPredictions().forEach((prediction) => {
      const match = getPredictionMatchName(prediction);

      if (prediction.type === "score") {
        const score = `${prediction.prediction.scoreA}-${prediction.prediction.scoreB}`;
        const key = `${match}|${score}`;
        scoreStats.set(key, {
          match,
          prediction: score,
          count: (scoreStats.get(key)?.count || 0) + 1,
        });
        return;
      }

      const selection = prediction.prediction.selection;
      const key = `${match}|${selection}`;
      teamStats.set(key, {
        match,
        prediction: selection,
        count: (teamStats.get(key)?.count || 0) + 1,
      });
    });

    const teamRows = [...teamStats.values()];
    const totalsByMatch = teamRows.reduce((totals, row) => {
      totals[row.match] = (totals[row.match] || 0) + row.count;
      return totals;
    }, {});

    return {
      teamStats: teamRows.map((row) => ({
        ...row,
        percentage: totalsByMatch[row.match]
          ? Math.round((row.count / totalsByMatch[row.match]) * 100)
          : 0,
      })),
      scoreStats: [...scoreStats.values()].sort(
        (first, second) => second.count - first.count,
      ),
    };
  }

  function getTournamentAnnouncements() {
    const announcements = readJson(TOURNAMENT_ANNOUNCEMENTS_KEY, []).filter(
      (announcement) => !containsPlaceholderContent(announcement.text),
    );

    writeJson(TOURNAMENT_ANNOUNCEMENTS_KEY, announcements);

    return announcements;
  }

  function saveTournamentAnnouncements(announcements) {
    writeJson(TOURNAMENT_ANNOUNCEMENTS_KEY, announcements);
    window.dispatchEvent(new CustomEvent("shakarbakar:tournament-announcements-updated"));
  }

  function buildPredictionAnnouncement(prediction, evaluation, data) {
    const result = findResultForPrediction(prediction, data);

    if (!result || evaluation.status === "Pending" || evaluation.points === 0) {
      return null;
    }

    const scoreText = `${result.teamA} ${result.scoreA}-${result.scoreB} ${result.teamB}`;
    const phrase =
      evaluation.status === "Perfect Prediction"
        ? "correctly predicted"
        : "picked the correct winner for";

    return {
      id: `prediction-${prediction.id}-${evaluation.status}`,
      text: `${prediction.username} ${phrase} ${scoreText} and earned ${evaluation.points} points.`,
      timestamp: new Date().toISOString(),
    };
  }

  function refreshTournamentAnnouncements() {
    const data = normalizeTournamentData(readJson(TOURNAMENT_DATA_KEY, defaultTournamentData));
    const predictions = getPredictions();
    const existing = getTournamentAnnouncements();
    const byId = new Map(existing.map((announcement) => [announcement.id, announcement]));

    predictions.forEach((prediction) => {
      const evaluation = evaluatePrediction(prediction, data);
      const announcement = buildPredictionAnnouncement(prediction, evaluation, data);

      if (announcement && !byId.has(announcement.id)) {
        byId.set(announcement.id, announcement);
      }
    });

    const leader = getLeaderboard()[0];

    if (leader && leader.points > 0) {
      const leaderAnnouncement = {
        id: `leader-${leader.username}-${leader.points}`,
        text: `${leader.username} is now #1 on the Leaderboard with ${leader.points} points.`,
        timestamp: new Date().toISOString(),
      };

      if (!byId.has(leaderAnnouncement.id)) {
        byId.set(leaderAnnouncement.id, leaderAnnouncement);
      }
    }

    saveTournamentAnnouncements(
      [...byId.values()].sort(
        (first, second) =>
          new Date(second.timestamp).getTime() - new Date(first.timestamp).getTime(),
      ),
    );
  }

  window.ShakarBakarTournament = {
    getTournamentData,
    saveTournamentData,
    getLoggedInUsername,
    getMatchLabel,
    savePrediction,
    getPredictions,
    evaluatePrediction,
    getLeaderboard,
    getPredictionBreakdown,
    getPublicPredictionStats,
    getTournamentAnnouncements,
    refreshTournamentAnnouncements,
    isRealUpcomingMatch,
    getPredictionMatchName,
    createId,
  };
})();
