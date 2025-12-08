let translations = {};
let currentLang = "en";

// Load saved language from localStorage (if any)
if (localStorage.getItem("lang")) {
  currentLang = localStorage.getItem("lang");
}

document.addEventListener("DOMContentLoaded", () => {
  fetch("./script/lang.json")
    .then((res) => res.json())
    .then((data) => {
      translations = data;
      applyLanguage(currentLang);
      updateLangToggle();
    });
});

// Apply language to all elements
function applyLanguage(lang) {
  currentLang = lang;

  // Save selection to localStorage
  localStorage.setItem("lang", lang);

  document.querySelectorAll("[data-translate]").forEach((el) => {
    const key = el.dataset.translate;
    const translation = translations[lang][key];

    if (translation) {
      el.innerHTML = translation.replace(/\n/g, "<br>");
    }
  });
}

// ----- LANGUAGE TOGGLE BUTTON -----
const langToggle = document.getElementById("langToggle");
const langFlag = document.getElementById("langFlag");
const langText = document.getElementById("langText");

function updateLangToggle() {
  if (currentLang === "en") {
    langFlag.src = "./public/FlagIndia.svg";
    langText.textContent = "हिन्दी";
  } else {
    langFlag.src = "./public/FlagUk.svg";
    langText.textContent = "English";
  }
}

// Toggle language on click
langToggle.addEventListener("click", () => {
  const newLang = currentLang === "en" ? "hi" : "en";

  applyLanguage(newLang);
  updateLangToggle();

  // 🔥 Notify other scripts that language changed
  window.dispatchEvent(new Event("languageChanged"));
});
