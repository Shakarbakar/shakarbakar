(function () {
  const labels = {
    en: "Install App",
    fr: "Installer",
    ar: "تثبيت التطبيق",
  };

  let deferredInstallPrompt = null;
  let installButton = null;
  let iosHint = null;

  function getCurrentLanguage() {
    if (typeof window.getLanguage === "function") {
      return window.getLanguage();
    }

    return localStorage.getItem("shakarbakar_language") || "en";
  }

  function isStandalone() {
    return (
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone === true
    );
  }

  function isIos() {
    return /iphone|ipad|ipod/i.test(window.navigator.userAgent);
  }

  function isIosSafari() {
    return isIos() && /safari/i.test(window.navigator.userAgent) && !/crios|fxios/i.test(window.navigator.userAgent);
  }

  function ensureStyles() {
    if (document.getElementById("shakarbakar-pwa-style")) {
      return;
    }

    const style = document.createElement("style");
    style.id = "shakarbakar-pwa-style";
    style.textContent = `
      .pwa-install-button {
        display: none;
        width: auto;
        min-width: auto;
        padding: 8px 12px;
        border: 1px solid rgba(244, 196, 48, 0.45);
        border-radius: 999px;
        background: #f4c430;
        color: #07152d;
        font-size: 13px;
        font-weight: 800;
        cursor: pointer;
        box-shadow: 0 8px 20px rgba(244, 196, 48, 0.18);
      }

      .pwa-install-button.is-visible {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
      }

      .pwa-ios-hint {
        display: none;
        position: fixed;
        left: 50%;
        bottom: 18px;
        z-index: 10001;
        transform: translateX(-50%);
        max-width: min(420px, calc(100% - 28px));
        padding: 12px 16px;
        border: 1px solid rgba(244, 196, 48, 0.4);
        border-radius: 16px;
        background: rgba(7, 21, 45, 0.94);
        color: #fff;
        font-weight: 700;
        text-align: center;
        box-shadow: 0 16px 35px rgba(0, 0, 0, 0.34);
      }

      .pwa-ios-hint.is-visible {
        display: block;
      }

      html[dir="rtl"] .pwa-ios-hint {
        direction: rtl;
      }
    `;
    document.head.appendChild(style);
  }

  function updateInstallText() {
    if (!installButton) {
      return;
    }

    installButton.textContent = labels[getCurrentLanguage()] || labels.en;
  }

  function placeInstallButton() {
    if (installButton) {
      updateInstallText();
      return;
    }

    installButton = document.createElement("button");
    installButton.type = "button";
    installButton.className = "pwa-install-button";
    installButton.addEventListener("click", installApp);
    updateInstallText();

    const navRight = document.querySelector(".nav-right");
    const languages = document.querySelector(".languages");
    const funNav = document.querySelector(".fun-nav");
    const languageSelector = document.querySelector(".language-selector, .language-selector-floating");

    if (languages && languages.parentElement) {
      languages.parentElement.insertBefore(installButton, languages);
    } else if (navRight) {
      navRight.appendChild(installButton);
    } else if (funNav) {
      funNav.appendChild(installButton);
    } else if (languageSelector && languageSelector.parentElement) {
      languageSelector.parentElement.insertBefore(installButton, languageSelector);
    } else {
      installButton.style.position = "fixed";
      installButton.style.top = "14px";
      installButton.style.left = "14px";
      installButton.style.zIndex = "10000";
      document.body.appendChild(installButton);
    }
  }

  function showInstallButton() {
    if (isStandalone()) {
      return;
    }

    placeInstallButton();
    installButton.classList.add("is-visible");
  }

  function hideInstallButton() {
    if (installButton) {
      installButton.classList.remove("is-visible");
    }
  }

  function ensureIosHint() {
    if (iosHint) {
      return iosHint;
    }

    iosHint = document.createElement("div");
    iosHint.className = "pwa-ios-hint";
    iosHint.textContent = "Tap Share → Add to Home Screen";
    document.body.appendChild(iosHint);
    return iosHint;
  }

  async function installApp() {
    if (deferredInstallPrompt) {
      deferredInstallPrompt.prompt();
      await deferredInstallPrompt.userChoice;
      deferredInstallPrompt = null;
      hideInstallButton();
      return;
    }

    if (isIosSafari()) {
      const hint = ensureIosHint();
      hint.classList.add("is-visible");
      setTimeout(() => hint.classList.remove("is-visible"), 7000);
    }
  }

  function registerServiceWorker() {
    if (!("serviceWorker" in navigator)) {
      return;
    }

    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          registration.update();

          if (registration.waiting) {
            registration.waiting.postMessage({ type: "SKIP_WAITING" });
          }
        })
        .catch((error) => {
          console.warn("ShakarBakar service worker registration failed:", error);
        });
    });
  }

  function initInstallPrompt() {
    window.addEventListener("beforeinstallprompt", (event) => {
      event.preventDefault();
      deferredInstallPrompt = event;
      showInstallButton();
    });

    window.addEventListener("appinstalled", () => {
      deferredInstallPrompt = null;
      hideInstallButton();
    });

    if (isIosSafari() && !isStandalone()) {
      showInstallButton();
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    ensureStyles();
    placeInstallButton();
    initInstallPrompt();

    document.addEventListener("click", () => updateInstallText(), true);
    window.addEventListener("storage", updateInstallText);
    setInterval(updateInstallText, 1000);
  });

  registerServiceWorker();
})();
