document.addEventListener("DOMContentLoaded", async () => {
  // Load GSAP plugins from window.gsap
  gsap.registerPlugin(gsap.ScrollTrigger, gsap.SplitText);

  // Load JSON content
  const slides = await fetch("public/slides.json").then((res) => res.json());

  // LENIS
  const lenis = new Lenis();
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  // DOM elements
  const progressBar = document.querySelector(".slider-progress");
  const sliderImages = document.querySelector(".slider-images");
  const sliderTitle = document.querySelector(".slider-title");
  const sliderIndices = document.querySelector(".slider-indices");

  let activeSlide = 0;
  let currentSplit = null;

  // ----- Create Indices -----
  function createIndices() {
    sliderIndices.innerHTML = "";

    slides.forEach((_, index) => {
      const indexNum = (index + 1).toString().padStart(2, "0");
      const indicatorElement = document.createElement("p");
      indicatorElement.dataset.index = index;
      indicatorElement.innerHTML = `
        <span class="marker"></span>
        <span class="index">${indexNum}</span>
      `;
      sliderIndices.appendChild(indicatorElement);

      gsap.set(indicatorElement.querySelector(".index"), {
        opacity: index === 0 ? 1 : 0.35,
      });
      gsap.set(indicatorElement.querySelector(".marker"), {
        scaleX: index === 0 ? 1 : 0,
      });
    });
  }

  // ----- Animate Slide -----
  function animateNewSlide(index) {
    const newSliderImage = document.createElement("img");

    // Pick correct image based on device size
    if (window.innerWidth < 600 && slides[index].imageMobile) {
      newSliderImage.src = slides[index].imageMobile;
    } else if (window.innerWidth < 1024 && slides[index].imageTablet) {
      newSliderImage.src = slides[index].imageTablet;
    } else {
      newSliderImage.src = slides[index].image;
    }

    newSliderImage.alt = `Slide ${index + 1}`;

    gsap.set(newSliderImage, { opacity: 0, scale: 1.1 });
    sliderImages.appendChild(newSliderImage);

    gsap.to(newSliderImage, {
      opacity: 1,
      duration: 0.5,
      ease: "power2.out",
    });

    gsap.to(newSliderImage, {
      scale: 1,
      duration: 1,
      ease: "power2.out",
    });

    const allImages = sliderImages.querySelectorAll("img");
    if (allImages.length > 3) {
      const excess = allImages.length - 3;
      for (let i = 0; i < excess; i++) sliderImages.removeChild(allImages[i]);
    }

    animateNewTitle(index);
    animateIndicators(index);
  }

  // ----- Animate Title + Subhead -----
  function animateNewTitle(index) {
    if (currentSplit) currentSplit.revert();

    // NEW WRAPPER FOR TITLE + SUBHEAD
    sliderTitle.innerHTML = `
      <div class="title-wrapper">
        <h1 class="mainTitle">${slides[index].title}</h1>
        <h2 class="subHead">${slides[index].subhead}</h2>
      </div>
    `;

    const titleEl = sliderTitle.querySelector(".mainTitle");
    const subheadEl = sliderTitle.querySelector(".subHead");

    // Split only the title
    currentSplit = new SplitText(titleEl, {
      type: "lines",
      linesClass: "line",
      mask: "lines",
    });

    // Animate title lines
    gsap.set(currentSplit.lines, { yPercent: 100, opacity: 0 });
    gsap.to(currentSplit.lines, {
      yPercent: 0,
      opacity: 1,
      duration: 0.75,
      stagger: 0.1,
      ease: "power3.out",
    });

    // Animate subhead AFTER title
    gsap.fromTo(
      subheadEl,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        delay: 0.6,
        ease: "power2.out",
      }
    );
  }

  // ----- Animate Indicators -----
  function animateIndicators(index) {
    const indicators = sliderIndices.querySelectorAll("p");
    indicators.forEach((indicator, i) => {
      const marker = indicator.querySelector(".marker");
      const number = indicator.querySelector(".index");

      gsap.to(number, {
        opacity: i === index ? 1 : 0.5,
        duration: 0.3,
      });

      gsap.to(marker, {
        scaleX: i === index ? 1 : 0,
        duration: 0.3,
      });
    });
  }

  // Init indices
  createIndices();

  // ----- ScrollTrigger -----
  const pinDistance = window.innerHeight * slides.length;

  ScrollTrigger.create({
    trigger: ".slider",
    start: "top top",
    end: `+=${pinDistance}px`,
    scrub: 1,
    pin: true,
    pinSpacing: true,
    onUpdate: (self) => {
      gsap.set(progressBar, { scaleY: self.progress });

      const currentSlide = Math.floor(self.progress * slides.length);
      if (currentSlide !== activeSlide && currentSlide < slides.length) {
        activeSlide = currentSlide;
        animateNewSlide(activeSlide);
      }
    },
  });
});
