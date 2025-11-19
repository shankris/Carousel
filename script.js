document.addEventListener("DOMContentLoaded", () => {
  // Register plugins (no imports needed)
  gsap.registerPlugin(ScrollTrigger, SplitText);

  // Lenis smooth scroll
  const lenis = new Lenis();
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  // SLIDES DATA
  const slides = [
    {
      title: "Gourmet Cookie Collection",
      subhead: "Elegant, small-batch perfection. Available in beautifully boxed sets, ideal for corporate gifts or party favors.",
      image: "public/01.png",
    },
    {
      title: "The Original Tea-Time Favorite",
      subhead: "Simple, savory, and utterly addictive. Our classic Jeera Biscuits transport you back to traditional Indian chai time.",
      image: "public/02.png",
    },
    {
      title: "Blueberry Muffins: Baked Just for You",
      subhead: "Never pre-made. Order your batch 24 hours in advance to enjoy these moist, fruit-packed delights, baked fresh for your pickup or delivery.",
      image: "public/03.png",
    },
    {
      title: "The Ultimate Double Chocolate Chunk",
      subhead: "Deep, dark cocoa dough baked until chewy, loaded and topped with generous blocks of melting dark chocolate.",
      image: "public/04.png",
    },
    {
      title: "Festive Celebration Hamper",
      subhead: "Spread the joy with our limited-edition holiday box. Rich plum cake, intense chocolate treats, and festive flair—ready for gifting.",
      image: "public/05.png",
    },
    {
      title: "The Classic Dry Cake",
      subhead: "Simple perfection. A dense, moist loaf, generously studded and topped with a mix of toasted almonds, cashews, and raisins.",
      image: "public/06.png",
    },
    {
      title: "Blueberry Muffins: Baked Just for You",
      subhead: "Never pre-made. Order your batch 24 hours in advance to enjoy these moist, fruit-packed delights, baked fresh for your pickup or delivery.",
      image: "public/07.png",
    },
  ];

  const pinDistance = window.innerHeight * slides.length;
  const progressBar = document.querySelector(".slider-progress");
  const sliderImages = document.querySelector(".slider-images");
  const sliderTitle = document.querySelector(".slider-title");
  const sliderIndices = document.querySelector(".slider-indices");

  let activeSlide = 0;
  let currentSplit = null;

  // CREATE INDICES
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

      if (index === 0) {
        gsap.set(indicatorElement.querySelector(".index"), { opacity: 1 });
        gsap.set(indicatorElement.querySelector(".marker"), { scaleX: 1 });
      } else {
        gsap.set(indicatorElement.querySelector(".index"), { opacity: 0.35 });
        gsap.set(indicatorElement.querySelector(".marker"), { scaleX: 0 });
      }
    });
  }

  // SLIDE CHANGE ANIMATION
  function animateNewSlide(index) {
    const file = slides[index].image;
    let media;

    // 🎥 CHECK IF MEDIA IS VIDEO
    if (file.endsWith(".mp4")) {
      media = document.createElement("video");
      media.src = file;
      media.autoplay = true;
      media.loop = true;
      media.muted = true;
      media.playsinline = true;
    } else {
      media = document.createElement("img");
      media.src = file;
      media.alt = `Slide ${index + 1}`;
    }

    // Initial animation state
    gsap.set(media, { opacity: 0, scale: 1.1 });

    sliderImages.appendChild(media);

    // Fade + scale animation
    gsap.to(media, {
      opacity: 1,
      duration: 0.5,
      ease: "power2.out",
    });

    gsap.to(media, {
      scale: 1,
      duration: 1,
      ease: "power2.out",
    });

    // Remove old media elements
    const allMedia = sliderImages.querySelectorAll("img, video");
    if (allMedia.length > 3) {
      const removeCount = allMedia.length - 3;
      for (let i = 0; i < removeCount; i++) {
        sliderImages.removeChild(allMedia[i]);
      }
    }

    animateNewTitle(index);
    animateIndicators(index);
  }

  // INDICATOR ANIMATION
  function animateIndicators(index) {
    const indicators = sliderIndices.querySelectorAll("p");

    indicators.forEach((indicator, i) => {
      const marker = indicator.querySelector(".marker");
      const idx = indicator.querySelector(".index");

      if (i === index) {
        gsap.to(idx, { opacity: 1, duration: 0.3, ease: "power2.out" });
        gsap.to(marker, { scaleX: 1, duration: 0.3, ease: "power2.out" });
      } else {
        gsap.to(idx, { opacity: 0.5, duration: 0.3, ease: "power2.out" });
        gsap.to(marker, { scaleX: 0, duration: 0.3, ease: "power2.out" });
      }
    });
  }

  // TITLE ANIMATION
  function animateNewTitle(index) {
    if (currentSplit) currentSplit.revert();

    // Insert title + subhead into DOM
    sliderTitle.innerHTML = `
    <h1>${slides[index].title}</h1>
    <h2>${slides[index].subhead || ""}</h2>
  `;

    const titleEl = sliderTitle.querySelector("h1");
    const subheadEl = sliderTitle.querySelector("h2");

    // Split title into lines
    currentSplit = new SplitText(titleEl, {
      type: "lines",
      linesClass: "line",
      mask: "lines",
    });

    // Initial state
    gsap.set(currentSplit.lines, { yPercent: 100, opacity: 0 });
    gsap.set(subheadEl, { y: 30, opacity: 0 });

    // Animate title lines
    gsap.to(currentSplit.lines, {
      yPercent: 0,
      opacity: 1,
      duration: 0.75,
      stagger: 0.1,
      ease: "power3.out",
    });

    // Animate subhead after title
    gsap.to(subheadEl, {
      y: 0,
      opacity: 1,
      duration: 0.6,
      delay: 0.4,
      ease: "power3.out",
    });
  }

  createIndices();

  // SCROLL TRIGGER
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

      if (activeSlide !== currentSlide && currentSlide < slides.length) {
        activeSlide = currentSlide;
        animateNewSlide(activeSlide);
      }
    },
  });
});
