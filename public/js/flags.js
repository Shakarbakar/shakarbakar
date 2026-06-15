/*
==================================================
SHAKARBAKAR TEAM FLAGS
==================================================

Maps marketplace team names to local SVG assets.

Usage:
  getFlagSvg("Brazil")
  // "images/flags/br.svg"

==================================================
*/

const TEAM_FLAG_CODES = Object.freeze({
  Canada: "ca",
  Mexico: "mx",
  USA: "us",
  Australia: "au",
  "IR Iran": "ir",
  Iraq: "iq",
  Japan: "jp",
  Jordan: "jo",
  "Korea Republic": "kr",
  Qatar: "qa",
  "Saudi Arabia": "sa",
  Uzbekistan: "uz",
  Algeria: "dz",
  "Cabo Verde": "cv",
  "Congo DR": "cd",
  "Côte d'Ivoire": "ci",
  Egypt: "eg",
  Ghana: "gh",
  Morocco: "ma",
  Senegal: "sn",
  "South Africa": "za",
  Tunisia: "tn",
  Curaçao: "cw",
  Haiti: "ht",
  Panama: "pa",
  Argentina: "ar",
  Brazil: "br",
  Colombia: "co",
  Ecuador: "ec",
  Paraguay: "py",
  Uruguay: "uy",
  "New Zealand": "nz",
  Austria: "at",
  Belgium: "be",
  "Bosnia and Herzegovina": "ba",
  Croatia: "hr",
  Czechia: "cz",
  England: "gb-eng",
  France: "fr",
  Germany: "de",
  Netherlands: "nl",
  Norway: "no",
  Portugal: "pt",
  Scotland: "gb-sct",
  Spain: "es",
  Sweden: "se",
  Switzerland: "ch",
  Türkiye: "tr",
});

const TEAM_FLAG_ALIASES = Object.freeze({
  "United States": "USA",
  "United States of America": "USA",
  Iran: "IR Iran",
  "South Korea": "Korea Republic",
  "Republic of Korea": "Korea Republic",
  "Cape Verde": "Cabo Verde",
  "DR Congo": "Congo DR",
  "Democratic Republic of the Congo": "Congo DR",
  "Ivory Coast": "Côte d'Ivoire",
  Curacao: "Curaçao",
  Turkey: "Türkiye",
});

const FLAG_CODE_TEAMS = Object.freeze(
  Object.entries(TEAM_FLAG_CODES).reduce((codeMap, [teamName, flagCode]) => {
    codeMap[flagCode] = teamName;
    return codeMap;
  }, {}),
);

function getFlagSvg(teamName) {
  if (typeof teamName !== "string") {
    return null;
  }

  const trimmedName = teamName.trim();
  const canonicalName = TEAM_FLAG_ALIASES[trimmedName] || trimmedName;
  const flagCode = TEAM_FLAG_CODES[canonicalName];

  return flagCode ? "images/flags/" + flagCode + ".svg" : null;
}

function escapeFlagRendererHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderAnnouncementFlags(text) {
  if (text === null || text === undefined) {
    return "";
  }

  const escapedText = escapeFlagRendererHtml(text);

  return escapedText.replace(
    /:([a-z]{2}(?:-[a-z]{3})?):/gi,
    (flagToken, rawFlagCode) => {
      const flagCode = rawFlagCode.toLowerCase();
      const teamName = FLAG_CODE_TEAMS[flagCode];

      if (!teamName) {
        return flagToken;
      }

      const flagPath = getFlagSvg(teamName);
      const safeTeamName = escapeFlagRendererHtml(teamName);

      return (
        '<img src="' +
        flagPath +
        '" class="announcement-flag" alt="' +
        safeTeamName +
        '" title="' +
        safeTeamName +
        '" loading="lazy">'
      );
    },
  );
}

if (typeof window !== "undefined") {
  window.getFlagSvg = getFlagSvg;
  window.renderAnnouncementFlags = renderAnnouncementFlags;
}
