let allCakes = [];

// Load JSON
fetch("cakes.json")
  .then((res) => res.json())
  .then((data) => {
    allCakes = data;
    renderCards(allCakes);
  });

// Render Cards
function renderCards(list) {
  const container = document.getElementById("cakeGrid");
  container.innerHTML = "";

  list.forEach((item) => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      
      <div class="section info">
        <div class="title">${item.name}</div>
        <div class="desc">${item.smallDesc}</div>
        <div class="desc">${item.description}</div>
        
        <div class="tags">
          ${item.tags.map((t) => `<span class="tag">${t}</span>`).join("")}
        </div>
      </div>

      <div class="section footer">
        <a class="more" data-id="${item.id}">Find out more ...</a>
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
    openPanel(item);
  }
});

function openPanel(item) {
  detailsContent.innerHTML = `
<div class="cardCarousel">
  <div class="imageContainer">
    <img src="${item.image}" class="panel-img" alt="${item.name}" />
  </div>
</div>

<div class="panelTxt">
  <h2 class="detailsH2">${item.name}</h2>
  <div class="description">${item.description}</div>

  <div class="details-table">
    <div class="label">Price</div>
    <div class="value">₹${item.price}</div>

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
  </div>

  <h3 class="ingredientsTitle">Ingredients</h3>
  <ul class="ingredients-list">
    ${item.ingredients ? item.ingredients.map((i) => `<li>${i}</li>`).join("") : "<li>Not available</li>"}
  </ul>

<div class="navBar">
  <button class="navBtn prevBtn" data-id="${item.id}">←</button>
  <button id="closePanel" class="navBtn backBtn hidden">Back to List</button>
  <button class="navBtn nextBtn" data-id="${item.id}">→</button>
</div>

</div>
  `;

  panel.classList.add("open");
  overlay.classList.add("show");

  // 👇 Make button visible after render
  setTimeout(() => {
    const btn = document.getElementById("closePanel");
    if (btn) btn.classList.remove("hidden");
  }, 0);
}

function closePanel() {
  panel.classList.remove("open");
  overlay.classList.remove("show");

  const btn = document.getElementById("closePanel");
  if (btn) btn.classList.add("hidden");
}

// ---------------------------
// CLOSING EVENTS
// ---------------------------

// Close Back to List (dynamic element)
document.addEventListener("click", (e) => {
  if (e.target.id === "closePanel") closePanel();
});

// Close by clicking overlay
overlay.onclick = closePanel;

// Close on ESC key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closePanel();
});

// Next / Previous navigation
function navigateTo(direction, currentId) {
  const index = allCakes.findIndex((c) => c.id == currentId);
  let newIndex = index;

  if (direction === "next") {
    newIndex = (index + 1) % allCakes.length; // loop to beginning
  } else if (direction === "prev") {
    newIndex = (index - 1 + allCakes.length) % allCakes.length; // loop to end
  }

  openPanel(allCakes[newIndex]);
}

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("nextBtn")) {
    const id = e.target.dataset.id;
    navigateTo("next", id);
  }

  if (e.target.classList.contains("prevBtn")) {
    const id = e.target.dataset.id;
    navigateTo("prev", id);
  }
});
