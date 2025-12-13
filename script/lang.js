/* ===============================
   LANGUAGE STATE
================================ */
let translations = {};
let currentLang = "en";

/* Load saved language from localStorage */
if (localStorage.getItem("lang")) {
  currentLang = localStorage.getItem("lang");
}

/* 🔑 Expose globally so other scripts (Card.js) can read it */
window.currentLang = currentLang;

/* ===============================
   LOAD TRANSLATIONS
================================ */
document.addEventListener("DOMContentLoaded", () => {
  fetch("./script/lang.json")
    .then((res) => res.json())
    .then((data) => {
      translations = data;
      applyLanguage(currentLang);
      updateLangToggle();
    })
    .catch((err) => console.error("Language load failed:", err));
});

/* ===============================
   APPLY LANGUAGE
================================ */
function applyLanguage(lang) {
  currentLang = lang;
  window.currentLang = lang; // ✅ sync global state

  localStorage.setItem("lang", lang);

  document.querySelectorAll("[data-translate]").forEach((el) => {
    const key = el.dataset.translate;
    const translation = translations?.[lang]?.[key];

    if (translation) {
      el.innerHTML = translation.replace(/\n/g, "<br>");
    }
  });
}

/* ===============================
   LANGUAGE TOGGLE
================================ */
const langToggle = document.getElementById("langToggle");
const langFlag = document.getElementById("langFlag");
const langText = document.getElementById("langText");

/* Safety check (prevents errors on pages without toggle) */
if (langToggle && langFlag && langText) {
  updateLangToggle();

  langToggle.addEventListener("click", () => {
    const newLang = currentLang === "en" ? "hi" : "en";

    applyLanguage(newLang);
    updateLangToggle();

    /* 🔥 Notify other scripts (Card.js) */
    window.dispatchEvent(new Event("languageChanged"));
  });
}

function updateLangToggle() {
  if (currentLang === "en") {
    langFlag.src = "./public/FlagIndia.svg";
    langText.textContent = "हिन्दी";
  } else {
    langFlag.src = "./public/FlagUk.svg";
    langText.textContent = "English";
  }
}
