document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger, SplitText);

  const lenis = new Lenis();
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  // DETECT DEVICE
  const screenWidth = window.innerWidth;
  const device = screenWidth < 600 ? "mobile" : screenWidth < 1024 ? "tablet" : "desktop";

  // SLIDES DATA (update paths accordingly)
  const slides = [
    {
      title: "Our Best Seller",
      subhead: "Elegant, small-batch perfection. Available in beautifully boxed sets, ideal for corporate gifts or party favors.",
      imageLow: "public/low/01_low.jpg",
      imageMobile: "public/mobile/01.jpg",
      imageTablet: "public/tablet/01.jpg",
      image: "public/01.jpg",
    },
    {
      title: "The Original Tea-Time Favorite",
      subhead: "Simple, savory, and utterly addictive. Our classic Jeera Biscuits transport you back to traditional Indian chai time.",
      imageLow: "public/low/02_low.jpg",
      imageMobile: "public/mobile/02.jpg",
      imageTablet: "public/tablet/02.jpg",
      image: "public/02.jpg",
    },

    {
      title: "Blueberry Muffins: Baked Just for You",
      subhead: "Never pre-made. Order your batch 24 hours in advance to enjoy these moist, fruit-packed delights, baked fresh for your pickup or delivery.",
      image: "public/03.png",
      imageMobile: "public/mobile/03.jpg",
      imageTablet: "public/tablet/03.jpg",
      image: "public/03.jpg",
    },
    {
      title: "The Ultimate Double Chocolate Chunk",
      subhead: "Deep, dark cocoa dough baked until chewy, loaded and topped with generous blocks of melting dark chocolate.",
      image: "public/04.png",
      imageMobile: "public/mobile/04.jpg",
      imageTablet: "public/tablet/04.jpg",
      image: "public/04.jpg",
    },
    {
      title: "Festive Celebration Hamper",
      subhead: "Spread the joy with our limited-edition holiday box. Rich plum cake, intense chocolate treats, and festive flair—ready for gifting.",
      image: "public/05.png",
      imageMobile: "public/mobile/05.jpg",
      imageTablet: "public/tablet/05.jpg",
      image: "public/05.jpg",
    },
    {
      title: "The Showstopper Dessert Pyramid",
      subhead: "Elevate your event tables with our signature almond mini-bites. Striking presentation and irresistible flavor for every guest.",
      image: "public/06.png",
      imageMobile: "public/mobile/06.jpg",
      imageTablet: "public/tablet/06.jpg",
      image: "public/06.jpg",
    },
    {
      title: "The Ultimate Fresh Fruit Delight",
      subhead: "A light vanilla sponge layered with fresh cream and topped with an abundance of seasonal, hand-picked fruits and berries.",
      image: "public/07.png",
      imageMobile: "public/mobile/07.jpg",
      imageTablet: "public/tablet/07.jpg",
      image: "public/07.jpg",
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
      const indicator = document.createElement("p");
      const indexNum = (index + 1).toString().padStart(2, "0");

      indicator.innerHTML = `
        <span class="marker"></span>
        <span class="index">${indexNum}</span>
      `;
      sliderIndices.appendChild(indicator);

      gsap.set(indicator.querySelector(".index"), { opacity: index === 0 ? 1 : 0.35 });
      gsap.set(indicator.querySelector(".marker"), { scaleX: index === 0 ? 1 : 0 });
    });
  }

  // 🔥 ***LOAD CORRECT IMAGE BASED ON DEVICE***
  function getImageForDevice(slide) {
    if (device === "mobile") return slide.imageMobile;
    if (device === "tablet") return slide.imageTablet;
    return slide.image;
  }

  // 🔥 ***SLIDE CHANGE WITH LQIP (LOW RES FIRST)***
  function animateNewSlide(index) {
    const slide = slides[index];

    const lowSrc = slide.imageLow;
    const finalSrc = getImageForDevice(slide);

    // Create elements
    const lowImg = document.createElement("img");
    lowImg.src = lowSrc;
    lowImg.className = "low-res";
    lowImg.style.filter = "blur(20px)";
    lowImg.style.opacity = "0.6";

    const finalImg = document.createElement("img");
    finalImg.src = finalSrc;
    finalImg.className = "full-res";
    finalImg.style.opacity = "0";

    // Insert both images
    sliderImages.appendChild(lowImg);
    sliderImages.appendChild(finalImg);

    // Fade in low resolution immediately
    gsap.to(lowImg, { opacity: 1, duration: 0.4 });

    // When HD image loads → fade it in + remove low-res
    finalImg.onload = () => {
      gsap.to(finalImg, { opacity: 1, duration: 0.7, ease: "power2.out" });
      gsap.to(lowImg, {
        opacity: 0,
        duration: 0.6,
        onComplete: () => lowImg.remove(),
      });
    };

    // Remove old images
    const allMedia = sliderImages.querySelectorAll("img, video");
    if (allMedia.length > 4) {
      for (let i = 0; i < allMedia.length - 4; i++) {
        allMedia[i].remove();
      }
    }

    animateNewTitle(index);
    animateIndicators(index);
  }

  // INDICATOR ANIMATION
  function animateIndicators(index) {
    const indicators = sliderIndices.querySelectorAll("p");
    indicators.forEach((el, i) => {
      const marker = el.querySelector(".marker");
      const idx = el.querySelector(".index");
      gsap.to(idx, { opacity: i === index ? 1 : 0.5, duration: 0.3 });
      gsap.to(marker, { scaleX: i === index ? 1 : 0, duration: 0.3 });
    });
  }

  // TITLE ANIMATION
  function animateNewTitle(index) {
    if (currentSplit) currentSplit.revert();
    sliderTitle.innerHTML = `
      <h1>${slides[index].title}</h1>
      <h2>${slides[index].subhead}</h2>
    `;

    const titleEl = sliderTitle.querySelector("h1");
    const subheadEl = sliderTitle.querySelector("h2");

    currentSplit = new SplitText(titleEl, { type: "lines", linesClass: "line" });

    gsap.set(currentSplit.lines, { yPercent: 100, opacity: 0 });
    gsap.set(subheadEl, { y: 30, opacity: 0 });

    gsap.to(currentSplit.lines, {
      yPercent: 0,
      opacity: 1,
      duration: 0.8,
      stagger: 0.1,
      ease: "power3.out",
    });

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
