/*
==================================================
FIFA WORLD CUP 2026 — QUALIFIED TEAMS
==================================================

Official source:
https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/articles/world-cup-2026-who-has-qualified

All 48 qualified national teams for FIFA World Cup 26™
(Canada, Mexico, USA as co-hosts).

worldCupTitles = historical FIFA World Cup wins
(basePrice is always 500, price = 500 + titles × 100)

winningChance = simple educational estimate (%)

==================================================
*/

module.exports = [

    /*
    ==========================================
    HOSTS (CONCACAF)
    ==========================================
    */

    { name: "Canada", flag: "🇨🇦", worldCupTitles: 0, qualificationStatus: "Qualified", winningChance: 3 },
    { name: "Mexico", flag: "🇲🇽", worldCupTitles: 0, qualificationStatus: "Qualified", winningChance: 5 },
    { name: "USA", flag: "🇺🇸", worldCupTitles: 0, qualificationStatus: "Qualified", winningChance: 6 },

    /*
    ==========================================
    AFC
    ==========================================
    */

    { name: "Australia", flag: "🇦🇺", worldCupTitles: 0, qualificationStatus: "Qualified", winningChance: 2 },
    { name: "IR Iran", flag: "🇮🇷", worldCupTitles: 0, qualificationStatus: "Qualified", winningChance: 2 },
    { name: "Iraq", flag: "🇮🇶", worldCupTitles: 0, qualificationStatus: "Qualified", winningChance: 1 },
    { name: "Japan", flag: "🇯🇵", worldCupTitles: 0, qualificationStatus: "Qualified", winningChance: 4 },
    { name: "Jordan", flag: "🇯🇴", worldCupTitles: 0, qualificationStatus: "Qualified", winningChance: 1 },
    { name: "Korea Republic", flag: "🇰🇷", worldCupTitles: 0, qualificationStatus: "Qualified", winningChance: 3 },
    { name: "Qatar", flag: "🇶🇦", worldCupTitles: 0, qualificationStatus: "Qualified", winningChance: 2 },
    { name: "Saudi Arabia", flag: "🇸🇦", worldCupTitles: 0, qualificationStatus: "Qualified", winningChance: 2 },
    { name: "Uzbekistan", flag: "🇺🇿", worldCupTitles: 0, qualificationStatus: "Qualified", winningChance: 1 },

    /*
    ==========================================
    CAF
    ==========================================
    */

    { name: "Algeria", flag: "🇩🇿", worldCupTitles: 0, qualificationStatus: "Qualified", winningChance: 2 },
    { name: "Cabo Verde", flag: "🇨🇻", worldCupTitles: 0, qualificationStatus: "Qualified", winningChance: 1 },
    { name: "Congo DR", flag: "🇨🇩", worldCupTitles: 0, qualificationStatus: "Qualified", winningChance: 2 },
    { name: "Côte d'Ivoire", flag: "🇨🇮", worldCupTitles: 0, qualificationStatus: "Qualified", winningChance: 3 },
    { name: "Egypt", flag: "🇪🇬", worldCupTitles: 0, qualificationStatus: "Qualified", winningChance: 2 },
    { name: "Ghana", flag: "🇬🇭", worldCupTitles: 0, qualificationStatus: "Qualified", winningChance: 2 },
    { name: "Morocco", flag: "🇲🇦", worldCupTitles: 0, qualificationStatus: "Qualified", winningChance: 5 },
    { name: "Senegal", flag: "🇸🇳", worldCupTitles: 0, qualificationStatus: "Qualified", winningChance: 4 },
    { name: "South Africa", flag: "🇿🇦", worldCupTitles: 0, qualificationStatus: "Qualified", winningChance: 2 },
    { name: "Tunisia", flag: "🇹🇳", worldCupTitles: 0, qualificationStatus: "Qualified", winningChance: 2 },

    /*
    ==========================================
    CONCACAF
    ==========================================
    */

    { name: "Curaçao", flag: "🇨🇼", worldCupTitles: 0, qualificationStatus: "Qualified", winningChance: 1 },
    { name: "Haiti", flag: "🇭🇹", worldCupTitles: 0, qualificationStatus: "Qualified", winningChance: 1 },
    { name: "Panama", flag: "🇵🇦", worldCupTitles: 0, qualificationStatus: "Qualified", winningChance: 1 },

    /*
    ==========================================
    CONMEBOL
    ==========================================
    */

    { name: "Argentina", flag: "🇦🇷", worldCupTitles: 3, qualificationStatus: "Qualified", winningChance: 16 },
    { name: "Brazil", flag: "🇧🇷", worldCupTitles: 5, qualificationStatus: "Qualified", winningChance: 18 },
    { name: "Colombia", flag: "🇨🇴", worldCupTitles: 0, qualificationStatus: "Qualified", winningChance: 5 },
    { name: "Ecuador", flag: "🇪🇨", worldCupTitles: 0, qualificationStatus: "Qualified", winningChance: 3 },
    { name: "Paraguay", flag: "🇵🇾", worldCupTitles: 0, qualificationStatus: "Qualified", winningChance: 2 },
    { name: "Uruguay", flag: "🇺🇾", worldCupTitles: 2, qualificationStatus: "Qualified", winningChance: 7 },

    /*
    ==========================================
    OFC
    ==========================================
    */

    { name: "New Zealand", flag: "🇳🇿", worldCupTitles: 0, qualificationStatus: "Qualified", winningChance: 1 },

    /*
    ==========================================
    UEFA
    ==========================================
    */

    { name: "Austria", flag: "🇦🇹", worldCupTitles: 0, qualificationStatus: "Qualified", winningChance: 3 },
    { name: "Belgium", flag: "🇧🇪", worldCupTitles: 0, qualificationStatus: "Qualified", winningChance: 5 },
    { name: "Bosnia and Herzegovina", flag: "🇧🇦", worldCupTitles: 0, qualificationStatus: "Qualified", winningChance: 2 },
    { name: "Croatia", flag: "🇭🇷", worldCupTitles: 0, qualificationStatus: "Qualified", winningChance: 6 },
    { name: "Czechia", flag: "🇨🇿", worldCupTitles: 0, qualificationStatus: "Qualified", winningChance: 3 },
    { name: "England", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", worldCupTitles: 1, qualificationStatus: "Qualified", winningChance: 10 },
    { name: "France", flag: "🇫🇷", worldCupTitles: 2, qualificationStatus: "Qualified", winningChance: 14 },
    { name: "Germany", flag: "🇩🇪", worldCupTitles: 4, qualificationStatus: "Qualified", winningChance: 12 },
    { name: "Netherlands", flag: "🇳🇱", worldCupTitles: 0, qualificationStatus: "Qualified", winningChance: 6 },
    { name: "Norway", flag: "🇳🇴", worldCupTitles: 0, qualificationStatus: "Qualified", winningChance: 3 },
    { name: "Portugal", flag: "🇵🇹", worldCupTitles: 0, qualificationStatus: "Qualified", winningChance: 7 },
    { name: "Scotland", flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", worldCupTitles: 0, qualificationStatus: "Qualified", winningChance: 2 },
    { name: "Spain", flag: "🇪🇸", worldCupTitles: 1, qualificationStatus: "Qualified", winningChance: 11 },
    { name: "Sweden", flag: "🇸🇪", worldCupTitles: 0, qualificationStatus: "Qualified", winningChance: 3 },
    { name: "Switzerland", flag: "🇨🇭", worldCupTitles: 0, qualificationStatus: "Qualified", winningChance: 4 },
    { name: "Türkiye", flag: "🇹🇷", worldCupTitles: 0, qualificationStatus: "Qualified", winningChance: 3 }

];
