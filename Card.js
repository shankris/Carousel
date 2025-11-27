let allCakes = [];

// Load JSON
fetch("cakes.json")
  .then((res) => res.json())
  .then((data) => {
    allCakes = data;
    renderCards(allCakes);

    // ⭐ ADDED — Auto-open panel if URL contains ?id=
    checkURLForAutoOpen();
  });

// Render Cards
function renderCards(list) {
  const container = document.getElementById("cakeGrid");
  container.innerHTML = "";

  list.forEach((item) => {
    const card = document.createElement("div");
    card.className = "card";

    const firstImage = item.images?.[0] ?? item.image ?? "";

    card.innerHTML = `
      <img src="${firstImage}" alt="${item.name}">
      
      <div class="section info">
        <div class="title">${item.name}</div>
        <div class="desc">${item.smallDesc}</div>
        
        <div class="tags">
          ${item.tags.map((t) => `<span class="tag">${t}</span>`).join("")}
        </div>
      </div>

      <div class="section footer">
        <a class="more" href="?id=${item.id}" data-id="${item.id}">
          Find out more ...
        </a>
      </div>
    `;

    container.appendChild(card);
  });
}

/* ---------------------
   DETAILS PANEL LOGIC
---------------------- */
const panel = document.getElementById("detailsPanel");
const overlay = document.getElementById("overlay");
const detailsContent = document.getElementById("detailsContent");

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("more")) {
    const id = e.target.dataset.id;
    const item = allCakes.find((c) => c.id == id);

    // ⭐ ADDED — Update URL when clicked (no page reload)
    history.replaceState(null, "", `?id=${id}`);

    openPanel(item);

    e.preventDefault(); // stop normal navigation
  }
});

function openPanel(item) {
  const firstImage = item.images?.[0] ?? item.image ?? "";

  detailsContent.innerHTML = `
<div class="imageContainer">

  <!-- MAIN SWIPER -->
  <div class="swiper mainSwiper">
    <div class="swiper-wrapper">
      ${item.images.map((img) => `<div class="swiper-slide"><img src="${img}" /></div>`).join("")}
    </div>
  </div>

${
  item.images && item.images.length > 1
    ? `
<div class="thumbSwiperWrapper">

  <div class="swiper thumbSwiper">
    <div class="swiper-wrapper">
      ${item.images.map((img) => `<div class="swiper-slide"><img src="${img}" /></div>`).join("")}
    </div>
  </div>

</div>
    `
    : ""
}


</div>



<div class="panelTxt">
  <h2 class="detailsH2">${item.name}</h2>
  <div class="description">${item.description}</div>

  <div class="details-table">
    <div class="label">Category</div>
    <div class="value">${item.category || "—"}</div>

    <div class="label">Weight</div>
    <div class="value">${item.weight || "—"}</div>

    <div class="label">Delivery time</div>
    <div class="value">${item.deliveryTime || "—"}</div>

    <div class="label">Shelf life</div>
    <div class="value">${item.shelfLife || "—"}</div>

    ${
      item.bestSeller === true
        ? `
        <div class="label">Bestseller</div>
        <div class="value">Yes</div>
      `
        : ""
    }

    <div class="label">Tags</div>
    <div class="value">${item.tags?.join(", ") || "None"}</div>

    <div class="label">Rating</div>
    <div class="value">★ ${item.rating}</div>

    <div class="label">Price</div>
    <div class="value">
    ₹ <span class="price">${item.price}</span> - 500 g<br/>
    ₹ <span class="price">${item.price2}</span> - 1 Kg
    </div>

  </div>

<div class="navBar">
  <button class="navBtn prevBtn" data-id="${item.id}">←</button>
  <button id="closePanel" class="navBtn backBtn hidden">Back to List</button>
  <button class="navBtn nextBtn" data-id="${item.id}">→</button>
</div>

</div>
 `;

  panel.classList.add("open");
  overlay.classList.add("show");

  setTimeout(() => {
    const btn = document.getElementById("closePanel");
    if (btn) btn.classList.remove("hidden");
  }, 0);

  // Wait for DOM to update
  setTimeout(() => {
    const hasThumbs = item.images && item.images.length > 1;

    let thumbSwiper = null;

    if (hasThumbs) {
      thumbSwiper = new Swiper(".thumbSwiper", {
        slidesPerView: "auto", // automatically fit as many slides as possible
        spaceBetween: 4, // 8px gap between thumbnails
        freeMode: true, // allow free scrolling
        watchSlidesProgress: true, // sync with main swiper
        allowTouchMove: true, // allow swipe on mobile

        // remove navigation arrows completely
        navigation: false,
        // no pagination needed for thumbnails

        // optional: slower transition when clicking thumbnail
        speed: 600, // 600ms transition when mainSwiper slides
      });
    }

    new Swiper(".mainSwiper", {
      spaceBetween: 10,
      loop: hasThumbs, // only loop if more than 1
      speed: 1000,
      autoplay: {
        delay: 3000, // 2.5 seconds per slide
        disableOnInteraction: false, // keep autoplay even if user swipes
      },
      thumbs: hasThumbs ? { swiper: thumbSwiper } : {},
    });
  }, 50);
}

function closePanel() {
  panel.classList.remove("open");
  overlay.classList.remove("show");

  const btn = document.getElementById("closePanel");
  if (btn) btn.classList.add("hidden");

  // ⭐ ADDED — Remove ?id= from URL without reloading
  history.replaceState(null, "", window.location.pathname);
}

/* ---------------------------
   CLOSING EVENTS
--------------------------- */

document.addEventListener("click", (e) => {
  if (e.target.id === "closePanel") closePanel();
});

overlay.onclick = closePanel;

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closePanel();
});

/* ---------------------------
   NEXT / PREV NAVIGATION
--------------------------- */

function navigateTo(direction, currentId) {
  const index = allCakes.findIndex((c) => c.id == currentId);
  let newIndex = index;

  if (direction === "next") {
    newIndex = (index + 1) % allCakes.length;
  } else if (direction === "prev") {
    newIndex = (index - 1 + allCakes.length) % allCakes.length;
  }

  const newItem = allCakes[newIndex];

  // ⭐ ADDED — Update URL when sliding
  history.replaceState(null, "", `?id=${newItem.id}`);

  openPanel(newItem);
}

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("nextBtn")) {
    navigateTo("next", e.target.dataset.id);
  }

  if (e.target.classList.contains("prevBtn")) {
    navigateTo("prev", e.target.dataset.id);
  }
});

/* ---------------------------
   AUTO-OPEN FROM URL
--------------------------- */

function checkURLForAutoOpen() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  if (!id) return;

  const item = allCakes.find((c) => c.id == id);
  if (!item) return;

  // Delay needed so the layout renders first
  setTimeout(() => openPanel(item), 150);
}
