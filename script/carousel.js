function initCarousel(images) {
  const container = document.querySelector(".thumbTrack");

  container.innerHTML = `
    <div class="thumbCarousel">
      <button class="thumbArrow leftArrow">←</button>

      <div class="thumbWrapper">
        <div class="thumbTrack"></div>
      </div>

      <button class="thumbArrow rightArrow">→</button>
    </div>
  `;

  const track = container.querySelector(".thumbTrack");
  const mainImg = document.getElementById("mainPanelImage");

  // Build thumbnails
  images.forEach((src, i) => {
    const t = document.createElement("img");
    t.src = src;
    t.className = "thumbImg";

    if (i === 0) t.classList.add("activeThumb");

    t.addEventListener("click", () => {
      mainImg.src = src;

      document.querySelectorAll(".thumbImg").forEach((x) => x.classList.remove("activeThumb"));
      t.classList.add("activeThumb");
    });

    track.appendChild(t);
  });

  // Scrolling
  let position = 0;
  const itemWidth = 80; // 70px wide + 10px gap
  const visible = 5;

  const left = container.querySelector(".leftArrow");
  const right = container.querySelector(".rightArrow");

  right.onclick = () => {
    if (position > -(images.length - visible) * itemWidth) {
      position -= itemWidth;
      track.style.transform = `translateX(${position}px)`;
    }
  };

  left.onclick = () => {
    if (position < 0) {
      position += itemWidth;
      track.style.transform = `translateX(${position}px)`;
    }
  };
}
