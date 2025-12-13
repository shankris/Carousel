/* ===============================
   GLOBAL STATE
================================ */
let allCakes = [];

/* helper — always read language from lang.js */
function lang() {
  return window.currentLang || "en";
}

/* ===============================
   LOAD JSON
================================ */
fetch("cakes.json")
  .then((res) => res.json())
  .then((data) => {
    allCakes = data;
    renderCards(allCakes);
    checkURLForAutoOpen();
  });

/* ===============================
   RENDER CARDS
================================ */
function renderCards(list) {
  const container = document.getElementById("cakeGrid");
  if (!container) return;

  container.innerHTML = "";

  list.forEach((item) => {
    const card = document.createElement("div");
    card.className = "card";

    const firstImage = item.images?.[0] ?? item.image ?? "";

    card.innerHTML = `
      ${
        item.bestSeller
          ? `<span class="ribbon1">
               <span class="content">
                 ${lang() === "hi" ? "बेस्टसेलर" : "Bestseller"}
               </span>
             </span>`
          : ""
      }

      <img src="${firstImage}" alt="${item.name[lang()]}">

      <div class="section info">
        <div class="title">${item.name[lang()]}</div>
        <div class="desc">${item.smallDesc[lang()]}</div>

        <div class="tags">
          ${item.tags.map((t) => `<span class="tag">${t}</span>`).join("")}
        </div>
      </div>

      <div class="section footer">
        <a class="more" href="?id=${item.id}" data-id="${item.id}">
          ${lang() === "hi" ? "और देखें ..." : "Find out more ..."}
        </a>
      </div>
    `;

    container.appendChild(card);
  });
}

/* ===============================
   DETAILS PANEL
================================ */
const panel = document.getElementById("detailsPanel");
const overlay = document.getElementById("overlay");
const detailsContent = document.getElementById("detailsContent");

/* open from card click */
document.addEventListener("click", (e) => {
  if (!e.target.classList.contains("more")) return;

  const id = e.target.dataset.id;
  const item = allCakes.find((c) => c.id == id);
  if (!item) return;

  history.replaceState(null, "", `?id=${id}`);
  openPanel(item);

  e.preventDefault();
});

function openPanel(item) {
  detailsContent.innerHTML = `
<div class="imageContainer">

  <div class="swiper mainSwiper">
    <div class="swiper-wrapper">
      ${item.images.map((img) => `<div class="swiper-slide"><img src="${img}"></div>`).join("")}
    </div>
  </div>

  ${
    item.images.length > 1
      ? `
      <div class="thumbSwiperWrapper">
        <div class="swiper thumbSwiper">
          <div class="swiper-wrapper">
            ${item.images.map((img) => `<div class="swiper-slide"><img src="${img}"></div>`).join("")}
          </div>
        </div>
      </div>
      `
      : ""
  }
</div>

<div class="panelTxt">
  <h2 class="detailsH2">${item.name[lang()]}</h2>
  <div class="description">${item.description[lang()]}</div>

  <div class="details-table">
    <div class="label">${lang() === "hi" ? "डिलीवरी समय" : "Delivery time"}</div>
    <div class="value">${item.deliveryTime?.[lang()] || "—"}</div>

    <div class="label">${lang() === "hi" ? "शेल्फ लाइफ" : "Shelf life"}</div>
    <div class="value">${item.shelfLife?.[lang()] || "—"}</div>

    ${
      item.bestSeller
        ? `
        <div class="label">${lang() === "hi" ? "बेस्टसेलर" : "Bestseller"}</div>
        <div class="value">${lang() === "hi" ? "हाँ" : "Yes"}</div>
        `
        : ""
    }

    <div class="label">${lang() === "hi" ? "कीमत" : "Price"}</div>
    <div class="value">
      <div class="priceOptions">
        <div class="option">
          <span class="weight">500 g</span><br>
          ₹ <span class="price">${item.price}</span>
        </div>
        <div class="option">
          <span class="weight">1 kg</span><br>
          ₹ <span class="price">${item.price2}</span>
        </div>
      </div>
    </div>
  </div>

  <div class="navBar">
    <button class="navBtn prevBtn" data-id="${item.id}">←</button>
    <button id="closePanel" class="navBtn backBtn hidden">
      ${lang() === "hi" ? "वापस जाएँ" : "Back to List"}
    </button>
    <button class="navBtn nextBtn" data-id="${item.id}">→</button>
  </div>
</div>
`;

  panel.classList.add("open");
  overlay.classList.add("show");

  setTimeout(initSwipers, 50);
}

function initSwipers() {
  const hasThumbs = document.querySelector(".thumbSwiper");

  let thumbSwiper = null;

  if (hasThumbs) {
    thumbSwiper = new Swiper(".thumbSwiper", {
      slidesPerView: "auto",
      spaceBetween: 4,
      freeMode: true,
      watchSlidesProgress: true,
      speed: 600,
    });
  }

  new Swiper(".mainSwiper", {
    spaceBetween: 10,
    loop: !!thumbSwiper,
    speed: 1000,
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
    },
    thumbs: thumbSwiper ? { swiper: thumbSwiper } : {},
  });
}

/* ===============================
   CLOSE PANEL
================================ */
function closePanel() {
  panel.classList.remove("open");
  overlay.classList.remove("show");
  history.replaceState(null, "", window.location.pathname);
}

overlay.onclick = closePanel;

document.addEventListener("click", (e) => {
  if (e.target.id === "closePanel") closePanel();
});

/* ===============================
   NEXT / PREV
================================ */
function navigateTo(direction, currentId) {
  const index = allCakes.findIndex((c) => c.id == currentId);
  if (index === -1) return;

  const newIndex = direction === "next" ? (index + 1) % allCakes.length : (index - 1 + allCakes.length) % allCakes.length;

  const newItem = allCakes[newIndex];
  history.replaceState(null, "", `?id=${newItem.id}`);
  openPanel(newItem);
}

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("nextBtn")) navigateTo("next", e.target.dataset.id);

  if (e.target.classList.contains("prevBtn")) navigateTo("prev", e.target.dataset.id);
});

/* ===============================
   AUTO OPEN FROM URL
================================ */
function checkURLForAutoOpen() {
  const id = new URLSearchParams(window.location.search).get("id");
  if (!id) return;

  const item = allCakes.find((c) => c.id == id);
  if (item) setTimeout(() => openPanel(item), 150);
}

/* ===============================
   REACT TO LANGUAGE CHANGE
================================ */
window.addEventListener("languageChanged", () => {
  renderCards(allCakes);

  const id = new URLSearchParams(window.location.search).get("id");
  if (id) {
    const item = allCakes.find((c) => c.id == id);
    if (item) openPanel(item);
  }
});
