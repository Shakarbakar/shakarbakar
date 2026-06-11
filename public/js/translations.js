const translations = {
en: {
home: "Home",
marketplace: "Marketplace",
arena: "Arena",
about: "About",
howItWorks: "How It Works",

```
login: "Login",
signup: "Sign Up",

welcomeBack: "Welcome Back",
loginToAccount: "Log in to your ShakarBakar account.",

createAccount: "Create Account",
joinAndReceive: "Join ShakarBakar and receive your starter pack.",

claimStarterPack: "Claim Starter Pack",
teamsMarketplace: "Teams Marketplace",

tradePredictCompete: "Trade. Predict. Compete."
```

},

fr: {
home: "Accueil",
marketplace: "Marché",
arena: "Arène",
about: "À propos",
howItWorks: "Comment ça marche",

```
login: "Connexion",
signup: "Inscription",

welcomeBack: "Bon Retour",
loginToAccount: "Connectez-vous à votre compte ShakarBakar.",

createAccount: "Créer un Compte",
joinAndReceive: "Rejoignez ShakarBakar et recevez votre pack de départ.",

claimStarterPack: "Réclamer le Pack de Départ",
teamsMarketplace: "Marché des Équipes",

tradePredictCompete: "Échangez. Prédisez. Rivalisez."
```

},

ar: {
home: "الرئيسية",
marketplace: "السوق",
arena: "الساحة",
about: "من نحن",
howItWorks: "كيف يعمل",

```
login: "تسجيل الدخول",
signup: "إنشاء حساب",

welcomeBack: "مرحباً بعودتك",
loginToAccount: "قم بتسجيل الدخول إلى حساب شكربكر.",

createAccount: "إنشاء حساب",
joinAndReceive: "انضم إلى شكربكر واحصل على حزمة البداية.",

claimStarterPack: "احصل على حزمة البداية",
teamsMarketplace: "سوق المنتخبات",

tradePredictCompete: "تداول. توقّع. نافس."
```

}
};

function getLanguage() {
return localStorage.getItem("shakarbakar_language") || "en";
}

function setLanguage(language) {
localStorage.setItem("shakarbakar_language", language);
applyTranslations();
}

function applyTranslations() {
const language = getLanguage();

document.documentElement.lang = language;

if (language === "ar") {
document.documentElement.dir = "rtl";
} else {
document.documentElement.dir = "ltr";
}

document.querySelectorAll("[data-translate]").forEach((element) => {
const key = element.getAttribute("data-translate");

```
if (
  translations[language] &&
  translations[language][key]
) {
  element.textContent = translations[language][key];
}
```

});
}

document.addEventListener("DOMContentLoaded", () => {
applyTranslations();
});
