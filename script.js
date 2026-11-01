const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-links");

if (hamburger && navMenu) {
  hamburger.addEventListener("click", () => {
      hamburger.classList.toggle("active");
      navMenu.classList.toggle("active");
  })

  document.querySelectorAll(".nav-links a").forEach(link => {
      link.addEventListener("click", () => {
          hamburger.classList.remove("active");
          navMenu.classList.remove("active");
      });
  });
}

const hasGsap = typeof gsap !== "undefined";
const hasScrollTrigger = typeof ScrollTrigger !== "undefined";

if (hasGsap) {
  gsap.registerPlugin(...[ScrollTrigger, typeof ScrollToPlugin !== "undefined" ? ScrollToPlugin : null].filter(Boolean));
}

if (hasGsap && hasScrollTrigger) {
  document.documentElement.classList.add("cinematic");
}

const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
const finePointerQuery = window.matchMedia("(pointer: fine)");

const heroSection = document.querySelector(".hero");
const heroBgLayer = document.querySelector(".hero-bg");
const heroCta = document.getElementById("explore-btn");

if (heroSection && !reducedMotionQuery.matches && finePointerQuery.matches) {
  let pointerFrame = null;
  let pointerX = 0;
  let pointerY = 0;

  const resetHeroEffects = () => {
    if (pointerFrame) {
      cancelAnimationFrame(pointerFrame);
      pointerFrame = null;
    }

    heroSection.classList.remove("is-pointer-active");
    heroSection.style.setProperty("--hero-x", "50%");
    heroSection.style.setProperty("--hero-y", "50%");

    if (heroBgLayer) {
      heroBgLayer.style.translate = "0px 0px";
    }

    if (heroCta) {
      heroCta.style.setProperty("--magnet-x", "0px");
      heroCta.style.setProperty("--magnet-y", "0px");
    }
  };

  const updateHeroEffects = () => {
    pointerFrame = null;

    const rect = heroSection.getBoundingClientRect();
    const localX = pointerX - rect.left;
    const localY = pointerY - rect.top;
    const xRatio = localX / rect.width - 0.5;
    const yRatio = localY / rect.height - 0.5;

    heroSection.style.setProperty("--hero-x", `${(xRatio + 0.5) * 100}%`);
    heroSection.style.setProperty("--hero-y", `${(yRatio + 0.5) * 100}%`);

    if (heroBgLayer) {
      heroBgLayer.style.translate = `${(-xRatio * 14).toFixed(2)}px ${(-yRatio * 10).toFixed(2)}px`;
    }
  };

  heroSection.addEventListener("mousemove", (e) => {
    pointerX = e.clientX;
    pointerY = e.clientY;
    heroSection.classList.add("is-pointer-active");

    if (!pointerFrame) {
      pointerFrame = requestAnimationFrame(updateHeroEffects);
    }
  });

  heroSection.addEventListener("mouseleave", resetHeroEffects);

  if (heroCta) {
    const magnetStrength = 0.16;
    const magnetLimit = 9;

    heroCta.addEventListener("mousemove", (e) => {
      const rect = heroCta.getBoundingClientRect();
      const dx = e.clientX - (rect.left + rect.width / 2);
      const dy = e.clientY - (rect.top + rect.height / 2);
      const magnetX = Math.max(-magnetLimit, Math.min(magnetLimit, dx * magnetStrength));
      const magnetY = Math.max(-magnetLimit, Math.min(magnetLimit, dy * magnetStrength));

      heroCta.style.setProperty("--magnet-x", `${magnetX.toFixed(2)}px`);
      heroCta.style.setProperty("--magnet-y", `${magnetY.toFixed(2)}px`);
    });

    heroCta.addEventListener("mouseleave", () => {
      heroCta.style.setProperty("--magnet-x", "0px");
      heroCta.style.setProperty("--magnet-y", "0px");
    });
  }
}

function setStoryStep(step) {
  document.querySelectorAll(".story-step").forEach((s) => {
      s.classList.toggle("active", s.getAttribute("data-step") === step);
  });
}

function setJourneyStep(step) {
  document.querySelectorAll(".s2-journey-step").forEach((s) => {
    s.classList.toggle("s2-current-step", s.getAttribute("data-journey-step") === step);
  });
  positionJourneyMarker();
}

function positionJourneyMarker() {
  const rail = document.querySelector(".opening-journey");
  if (!rail || !rail.offsetHeight) return;

  const marker = rail.querySelector(".s2-gold-marker");
  const active = rail.querySelector(".s2-journey-step.s2-current-step");
  const dot = active && active.querySelector(".s2-step-dot");
  if (!marker || !dot) return;

  const railRect = rail.getBoundingClientRect();
  const dotRect = dot.getBoundingClientRect();
  marker.style.top = `${dotRect.top - railRect.top + dotRect.height / 2 - marker.offsetHeight / 2}px`;
}

positionJourneyMarker();
window.addEventListener("resize", positionJourneyMarker);
window.addEventListener("load", positionJourneyMarker);
if (document.fonts && document.fonts.ready) {
  document.fonts.ready.then(positionJourneyMarker);
}

if (hasGsap && hasScrollTrigger) {
  const mm = gsap.matchMedia();
  mm.add("(min-width: 761px) and (prefers-reduced-motion: no-preference)", () => {
      let activeStage = "notice";
      gsap.set(".hero", { autoAlpha: 1 });
      gsap.set(".hero-bg", { scale: 1 });
      gsap.set(".scroll-one", { autoAlpha: 1 });
      gsap.set(".scroll-one-bg", { opacity: 1, scale: 1.28 });
      gsap.set(".scroll-two", { autoAlpha: 1 });
      gsap.set([
          ".scroll-one .scroll-two-header",
          ".scroll-one .story-copy",
          ".scroll-one .detail-card",
            ".scroll-one .scroll-footer"
        ], { opacity: 0 });

        gsap.set(".scroll-one .scroll-two-header", { y: -25 });
        gsap.set(".opening-journey", { opacity: 0, x: -25 });
        gsap.set(".scroll-one .story-copy", { scale: 0.94 });
        gsap.set(".scroll-one .detail-card", { x: 50 });
        gsap.set(".scroll-one .scroll-footer", { y: 32 });

        gsap.set(".scroll-two-bg", { opacity: 1, scale: 1.18 });

        gsap.set([
            ".scroll-two .s2-header",
            ".scroll-two .s2-intro",
            ".scroll-two .s2-panel",
            ".scroll-two .s2-mode-card",
            ".scroll-two .s2-location-pill",
            ".scroll-two .s2-sound-control"
        ], { opacity: 0 });

        gsap.set(".scroll-two .s2-header", { y: -25 });
        gsap.set(".scroll-two .s2-intro", { y: 30 });
        gsap.set(".scroll-two .s2-panel", { x: 35 });
        gsap.set(".scroll-two .s2-mode-card", { y: 24 });
        gsap.set(".scroll-two .s2-location-pill, .scroll-two .s2-sound-control", { y: 15 });

        gsap.set(".scroll-three-bg", { scale: 1.18 });

        gsap.set([
            ".scroll-three .s3-header",
            ".scroll-three .s3-intro-row",
            ".scroll-three .s3-intro",
            ".scroll-three .s3-city-carousel-wrap",
            ".scroll-three .s3-city-grid",
            ".scroll-three .s3-footer"
        ], { autoAlpha: 0 });

        gsap.set(".scroll-three .s3-header", { y: -22 });
        gsap.set([".scroll-three .s3-intro-row", ".scroll-three .s3-intro"], { y: 28 });
        gsap.set([".scroll-three .s3-city-carousel-wrap", ".scroll-three .s3-city-grid"], { y: 22, scale: 1.04 });
        gsap.set(".scroll-three .s3-city-copy", { y: 10 });
        gsap.set(".scroll-three .s3-footer", { y: 18 });

        const openingTimeline = gsap.timeline({
            scrollTrigger: {
                id: "opening-pin",
                trigger: ".opening",
                start: "top top",
                end: "+=620%",
                pin: true,
                scrub: true,
                anticipatePin: 1,
                invalidateOnRefresh: true,
                onUpdate: (self) => {
                    const stage = self.progress >= 0.84
                        ? "feel"
                        : self.progress >= 0.58
                            ? "explore"
                            : "notice";
                    if (stage === activeStage) return;
                    activeStage = stage;
                    setStoryStep(stage);
                    setJourneyStep(stage);
                }
            }
        });

        // ---- LANDING -> FIRST STREET ----
        openingTimeline.to(".hero-bg", {
            scale: 1.34,
            ease: "none",
            duration: 0.3
        }, 0);

        openingTimeline.to(".hero .hero-header", {
            autoAlpha: 0,
            y: -26,
            duration: 0.1,
            ease: "power2.out"
        }, 0.02);

        openingTimeline.to(".hero .hero-content", {
            autoAlpha: 0,
            y: -44,
            duration: 0.14,
            ease: "power2.out"
        }, 0.06);

        // Fade the whole landing shot away to reveal the street beneath it.
        openingTimeline.to(".hero", {
            autoAlpha: 0,
            duration: 0.16,
            ease: "none"
        }, 0.14);

        // The incoming background keeps moving, so the dissolve reads as one
        // continuous push forward rather than a crossfade between stills.
        openingTimeline.to(".scroll-one-bg", {
            scale: 1.46,
            ease: "none",
            duration: 0.5
        }, 0);

        openingTimeline.to(".scroll-one .scroll-two-header", {
            opacity: 1,
            y: 0,
            duration: 0.08,
            ease: "power2.out"
        }, 0.14);

        openingTimeline.to(".opening-journey", {
            opacity: 1,
            x: 0,
            duration: 0.08,
            ease: "power2.out"
        }, 0.16);

        openingTimeline.to(".scroll-one .story-copy", {
            opacity: 1,
            scale: 1,
            duration: 0.1,
            ease: "power3.out"
        }, 0.16);

        openingTimeline.to(".scroll-one .detail-card", {
            opacity: 1,
            x: 0,
            duration: 0.12,
            ease: "power3.out"
        }, 0.18);

        openingTimeline.to(".scroll-one .scroll-footer", {
            opacity: 1,
            y: 0,
            duration: 0.08,
            ease: "power2.out"
        }, 0.2);

        // ---- FIRST STREET -> NEXT STREET ----
        // The first street is pushed through and dissolved out while the next
        // background is already scaling up underneath it. No viewport of
        // travel or empty space separates the two pages.
        openingTimeline.to(".scroll-one .scroll-two-header", {
            autoAlpha: 0,
            y: -24,
            duration: 0.08,
            ease: "power2.in"
        }, 0.44);

        openingTimeline.to(".scroll-one .story-copy", {
            autoAlpha: 0,
            scale: 1.08,
            duration: 0.1,
            ease: "power2.in"
        }, 0.44);

        openingTimeline.to(".scroll-one .detail-card", {
            autoAlpha: 0,
            x: 36,
            duration: 0.1,
            ease: "power2.in"
        }, 0.45);

        openingTimeline.to(".scroll-one .scroll-footer", {
            autoAlpha: 0,
            y: 24,
            duration: 0.08,
            ease: "power2.in"
        }, 0.45);

        openingTimeline.to(".scroll-one-bg", {
            scale: 1.66,
            ease: "none",
            duration: 0.2
        }, 0.44);

        openingTimeline.to(".scroll-one", {
            autoAlpha: 0,
            duration: 0.16,
            ease: "none"
        }, 0.48);

        // The next background moves throughout, so the scene change is a
        // continuation of the same camera push.
        openingTimeline.to(".scroll-two-bg", {
            scale: 1.55,
            ease: "none",
            duration: 0.56
        }, 0.44);

        openingTimeline.to(".scroll-two .s2-header", {
            opacity: 1,
            y: 0,
            duration: 0.08,
            ease: "power2.out"
        }, 0.56);

        openingTimeline.to(".scroll-two .s2-intro", {
            opacity: 1,
            y: 0,
            duration: 0.12,
            ease: "power3.out"
        }, 0.58);

        openingTimeline.to(".scroll-two .s2-panel", {
            opacity: 1,
            x: 0,
            duration: 0.14,
            ease: "power3.out"
        }, 0.6);

        openingTimeline.to(".scroll-two .s2-mode-card", {
            opacity: 1,
            y: 0,
            duration: 0.08,
            stagger: 0.04,
            ease: "power2.out"
        }, 0.64);

        openingTimeline.to(".scroll-two .s2-location-pill, .scroll-two .s2-sound-control", {
            opacity: 1,
            y: 0,
            duration: 0.1,
            ease: "power2.out"
        }, 0.64);

        // ---- SECOND STREET -> CITY SELECT ----
        // The second street is pushed through and dissolved away, exactly
        // like the earlier transitions. Its background keeps moving under the
        // fade while the city background scales up from behind it.
        openingTimeline.to(".scroll-two .s2-header", {
            autoAlpha: 0,
            y: -24,
            duration: 0.08,
            ease: "power2.in"
        }, 0.74);

        openingTimeline.to(".opening-journey", {
            autoAlpha: 0,
            x: -30,
            duration: 0.08,
            ease: "power2.in"
        }, 0.74);

        openingTimeline.to(".scroll-two .s2-intro", {
            autoAlpha: 0,
            y: -22,
            duration: 0.08,
            ease: "power2.in"
        }, 0.75);

        openingTimeline.to(".scroll-two .s2-panel", {
            autoAlpha: 0,
            x: 34,
            duration: 0.09,
            ease: "power2.in"
        }, 0.75);

        openingTimeline.to(".scroll-two .s2-mode-card", {
            autoAlpha: 0,
            y: 18,
            duration: 0.07,
            ease: "power2.in"
        }, 0.75);

        openingTimeline.to(".scroll-two .s2-location-pill, .scroll-two .s2-sound-control", {
            autoAlpha: 0,
            y: 16,
            duration: 0.08,
            ease: "power2.in"
        }, 0.75);

        openingTimeline.to(".scroll-two", {
            autoAlpha: 0,
            duration: 0.12,
            ease: "none"
        }, 0.78);

        // Incoming city shot: same slow push-in used by every scene change.
        openingTimeline.to(".scroll-three-bg", {
            scale: 1.4,
            ease: "none",
            duration: 0.26
        }, 0.74);

        openingTimeline.to(".scroll-three .s3-header", {
            autoAlpha: 1,
            y: 0,
            duration: 0.06,
            ease: "power2.out"
        }, 0.78);

        openingTimeline.to([".scroll-three .s3-intro-row", ".scroll-three .s3-intro"], {
            autoAlpha: 1,
            y: 0,
            duration: 0.08,
            ease: "power3.out"
        }, 0.79);

        openingTimeline.to([".scroll-three .s3-city-carousel-wrap", ".scroll-three .s3-city-grid"], {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.1,
            ease: "power2.out"
        }, 0.8);

        openingTimeline.to(".scroll-three .s3-city-copy", {
            y: 0,
            duration: 0.06,
            stagger: 0.015,
            ease: "power2.out"
        }, 0.82);

        openingTimeline.to(".scroll-three .s3-footer", {
            autoAlpha: 1,
            y: 0,
            duration: 0.06,
            ease: "power2.out"
        }, 0.83);
    });

    // Recalculate pin ranges once fonts/images have settled.
    window.addEventListener("load", () => ScrollTrigger.refresh());
    if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(() => ScrollTrigger.refresh());
    }
}

// In-page labels jump to the matching point of the pinned journey, so the
// destination scene is fully composed instead of halfway through a dissolve.
const OPENING_STAGE_PROGRESS = {
    notice: 0.32,
    explore: 0.8,
    feel: 0.96,
    choose: 0.96
};

function getOpeningTrigger() {
    return hasScrollTrigger && typeof ScrollTrigger.getById === "function"
        ? ScrollTrigger.getById("opening-pin")
        : null;
}

function scrollToOpeningStage(progress, duration = 1.4) {
    const trigger = getOpeningTrigger();
    if (!trigger) return false;

    const targetY = trigger.start + (trigger.end - trigger.start) * progress;

    if (hasGsap && typeof ScrollToPlugin !== "undefined" && !reducedMotionQuery.matches) {
        gsap.to(window, {
            duration,
            scrollTo: { y: targetY, offsetY: 0 },
            ease: "power2.inOut"
        });
    } else {
        window.scrollTo({ top: targetY, behavior: "auto" });
    }

    return true;
}

const heroExploreLinks = document.querySelectorAll("#explore-btn, #hero-scroll-cue");
heroExploreLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
        if (scrollToOpeningStage(OPENING_STAGE_PROGRESS.notice, 1.6)) {
            e.preventDefault();
            return;
        }

        const target = document.querySelector("#scroll-one");
        if (!target) return;

        e.preventDefault();
        window.scrollTo({
            top: target.getBoundingClientRect().top + window.scrollY,
            behavior: "auto"
        });
    });
});

const revealDetail = document.getElementById("reveal-detail");
if (revealDetail) {
    revealDetail.addEventListener("click", (e) => {
        if (scrollToOpeningStage(OPENING_STAGE_PROGRESS.explore)) {
            e.preventDefault();
            return;
        }

        const target = document.querySelector("#next-section");
        if (!target) return;

        e.preventDefault();
        window.scrollTo({
            top: target.getBoundingClientRect().top + window.scrollY,
            behavior: "auto"
        });
    });
}

document.querySelectorAll('.story-step[data-step="explore"]').forEach((link) => {
    link.addEventListener("click", (e) => {
        if (scrollToOpeningStage(OPENING_STAGE_PROGRESS.explore)) e.preventDefault();
    });
});

document.querySelectorAll('.s2-nav a[href="#next-section"], .scroll-cue[href="#next-section"]').forEach((link) => {
    link.addEventListener("click", (e) => {
        if (scrollToOpeningStage(OPENING_STAGE_PROGRESS.explore)) e.preventDefault();
    });
});

[
    ['a[href="#cities"]', OPENING_STAGE_PROGRESS.feel]
].forEach(([selector, progress]) => {
    document.querySelectorAll(selector).forEach((link) => {
        link.addEventListener("click", (e) => {
            if (scrollToOpeningStage(progress)) e.preventDefault();
        });
    });
});

if (typeof window !== "undefined" && window.location && window.location.hash === "#cities") {
    window.addEventListener("load", () => {
        window.setTimeout(() => {
            scrollToOpeningStage(OPENING_STAGE_PROGRESS.choose);
        }, 120);
    });
}

const s2ModeCards = document.querySelectorAll(".s2-mode-card");
const s2StartButtons = document.querySelectorAll(".s2-start-button");

let s2SelectedMode = "walking";

s2ModeCards.forEach((card) => {
    card.addEventListener("click", () => {
        s2ModeCards.forEach((item) => {
            item.classList.remove("s2-mode-selected");
            item.setAttribute("aria-pressed", "false");
        });

        card.classList.add("s2-mode-selected");
        card.setAttribute("aria-pressed", "true");
        s2SelectedMode = card.dataset.mode;

        const panel = card.closest(".s2-panel");
        const label = panel ? panel.querySelector(".s2-button-label") : null;

        if (label) {
            if (s2SelectedMode === "driving") {
                label.textContent = "DRIVE THE CITY";
            } else {
                label.textContent = "WALK THE CITY";
            }
        }
    });
});

s2StartButtons.forEach((s2StartButton) => {
    s2StartButton.addEventListener("click", () => {
        if (scrollToOpeningStage(OPENING_STAGE_PROGRESS.choose)) return;

        const cities = document.querySelector("#cities");
        if (!cities) return;

        const targetY = cities.getBoundingClientRect().top + window.scrollY;

        if (hasGsap && typeof ScrollToPlugin !== "undefined" && !reducedMotionQuery.matches) {
            gsap.to(window, {
                duration: 1.4,
                scrollTo: { y: targetY, offsetY: 0 },
                ease: "power2.inOut"
            });
        } else {
            window.scrollTo({ top: targetY, behavior: "auto" });
        }
    });
});

// ==========================================================================
// CITY CONFIGURATION & DATA STRUCTURE
// ==========================================================================
// CITY DATA & HIGH-DEFINITION 4K ZERO-CHROME STREET TOURS
// ==========================================================================
const cityData = {
    tokyo: {
        name: "Tokyo",
        coords: [139.6917, 35.6895],
        endZoom: 15.6,
        endPitch: 64,
        endBearing: 28,
        youtube: {
            driving: "joPpxvhS2_I", // Tokyo Morning 4K Drive
            walking: "4smIgSkZOTc"  // Tokyo Shinjuku 4K Night Walk
        },
        videoFile: "videos/tokyo.mp4",
        country: "Japan",
        timezone: "Asia/Tokyo",
        tagline: "Shinjuku & Shibuya Neon Corridors"
    },
    paris: {
        name: "Paris",
        coords: [2.3522, 48.8566],
        endZoom: 15.4,
        endPitch: 63,
        endBearing: -22,
        youtube: {
            driving: "xWykIGjCtr0", // Paris Downtown 4K Drive
            walking: "C7j49pJTBEk"  // Paris 4K HDR Walking Tour
        },
        videoFile: "videos/paris.mp4",
        country: "France",
        timezone: "Europe/Paris",
        tagline: "Haussmann Boulevards & Seine Glow"
    },
    newyork: {
        name: "New York",
        coords: [-74.0060, 40.7128],
        endZoom: 15.6,
        endPitch: 64,
        endBearing: -36,
        youtube: {
            driving: "7OgQjRn2x1w", // New York 4K Drive
            walking: "caHn6rkejSI"  // NYC 5th Ave Sunset Walk
        },
        videoFile: "videos/newyork.mp4",
        country: "United States",
        timezone: "America/New_York",
        tagline: "Manhattan Canyons & 5th Avenue"
    },
    istanbul: {
        name: "Istanbul",
        coords: [28.9784, 41.0082],
        endZoom: 15.3,
        endPitch: 60,
        endBearing: 16,
        youtube: {
            driving: "PMc2UhLaDlA", // Istanbul 4K Drive
            walking: "F2gWAAFhoNg"  // Istanbul 4K Walk
        },
        videoFile: "videos/istanbul.mp4",
        country: "Turkey",
        timezone: "Europe/Istanbul",
        tagline: "Bosphorus Crossings & Historic Old City"
    },
    mumbai: {
        name: "Mumbai",
        coords: [72.8777, 19.0760],
        endZoom: 15.4,
        endPitch: 62,
        endBearing: -14,
        youtube: {
            driving: "Oj3sd0idv2k", // Mumbai Downtown 4K Drive
            walking: "VF-cvqRWWaw"  // Mumbai Streets 4K Walk
        },
        videoFile: "videos/mumbai.mp4",
        country: "India",
        timezone: "Asia/Kolkata",
        tagline: "Colonial Grandeur & Coastal Roads"
    },
    lisbon: {
        name: "Lisbon",
        coords: [-9.1393, 38.7223],
        endZoom: 15.3,
        endPitch: 60,
        endBearing: 24,
        youtube: {
            driving: "bVFDlEk98rs", // Lisbon 4K Drive
            walking: "rpb5KRBMSRI"  // Lisbon 4K Walk
        },
        videoFile: "videos/lisbon.mp4",
        country: "Portugal",
        timezone: "Europe/Lisbon",
        tagline: "Cobblestone Hills & Pastel Quarters"
    },
    seoul: {
        name: "Seoul",
        coords: [126.9780, 37.5665],
        endZoom: 15.5,
        endPitch: 63,
        endBearing: -18,
        youtube: {
            driving: "EbDIVva1_e8", // Midnight in Seoul 4K Drive
            walking: "SIGdNj_5ouE"  // Seoul Sunset 4K Walk
        },
        videoFile: "videos/seoul.mp4",
        country: "South Korea",
        timezone: "Asia/Seoul",
        tagline: "Gangnam Neon & Han River Bridges"
    },
    cairo: {
        name: "Cairo",
        coords: [31.2357, 30.0444],
        endZoom: 15.3,
        endPitch: 60,
        endBearing: 22,
        youtube: {
            driving: "86pZTI5gJQM", // Cairo 4K Night Drive
            walking: "48PXW6V8Cj4"  // Cairo Khan el-Khalili 4K Walk
        },
        videoFile: "videos/cairo.mp4",
        country: "Egypt",
        timezone: "Africa/Cairo",
        tagline: "Nile Corniche & Historic Khan el-Khalili"
    }
};

// Verified official Mapbox public token
const MAPBOX_DEFAULT_TOKEN = "pk.eyJ1IjoiZXhhbXBsZXMiLCJhIjoiY2xxeTBib3pyMGsxcTJpbXQ3bmo4YXU0ZiJ9.wvqlBMQSxTHgvAh6l9OXXw";

function getActiveMapboxToken() {
    return window.MAPBOX_ACCESS_TOKEN || localStorage.getItem("MAPBOX_ACCESS_TOKEN") || MAPBOX_DEFAULT_TOKEN;
}

// Modal & Stage State Management
let activeMap = null;
let isModalOpen = false;
let underMapPreloadStarted = false;
let isFinalPushTriggered = false;
let isFlightComplete = false;
let activeYtPlayer = null;
let isYtPlaying = false;
let isAudioUnmuted = true;
let currentStreetMode = "walking";
let underMapTimer = null;
let finalPushTimer = null;
let mapFlightTimeout = null;
let wasAmbientPlaying = false;
let currentCityData = null;
let activeTimezone = null;
let lastFocusedElement = null;
let ytApiReadyPromise = null;

const cityModal = document.getElementById("city-modal");
const cityModalBackdrop = document.getElementById("city-modal-backdrop");
const cityModalDialog = cityModal ? cityModal.querySelector(".city-modal-dialog") : null;
const cityModalCloseBtn = document.getElementById("city-modal-close");
const cityModalSkipBtn = document.getElementById("city-modal-skip-btn");
const cityModalTitle = document.getElementById("city-modal-title");
const cityModalCountry = document.getElementById("city-modal-country");
const cityModalCoords = document.getElementById("city-modal-coords");
const cityModalStatusText = document.getElementById("city-modal-status-text");

const cityMapStage = document.getElementById("city-modal-map-stage");
const cityMapContainer = document.getElementById("city-mapbox-container");
const cityMapFallback = document.getElementById("city-map-fallback");
const fallbackActionBtn = document.getElementById("fallback-action-btn");
const hudAltitudeLabel = document.getElementById("hud-altitude-label");
const hudTargetName = document.getElementById("hud-target-name");
const hudCameraZoom = document.getElementById("hud-camera-zoom");

const cityVideoStage = document.getElementById("city-modal-video-stage");
const cityVideoFrame = document.getElementById("city-video-frame");
const cityVideo = document.getElementById("city-video");
const cityVideoShield = document.getElementById("city-video-shield");
const cityVideoAudioBtn = document.getElementById("city-video-audio-btn");
const cityVideoAudioLabel = document.getElementById("city-video-audio-label");
const cityVideoPlayOverlay = document.getElementById("city-video-play-overlay");
const cityVideoBigPlay = document.getElementById("city-video-big-play");
const videoModeBadge = document.getElementById("video-mode-badge");
const videoModeBadgeBtn = document.getElementById("video-mode-badge-btn");
const videoCityTag = document.getElementById("video-city-tag");
const cityVideoLoading = document.getElementById("city-video-loading");
const cityVideoLoadingLabel = document.getElementById("city-video-loading-label");
const cityVideoFallback = document.getElementById("city-video-fallback");
const cityVideoFallbackBtn = document.getElementById("city-video-fallback-btn");

function getMapboxStyle() {
    const customToken = window.MAPBOX_ACCESS_TOKEN || localStorage.getItem("MAPBOX_ACCESS_TOKEN");
    if (customToken && customToken.startsWith("pk.") && customToken !== MAPBOX_DEFAULT_TOKEN) {
        return "mapbox://styles/mapbox/dark-v11";
    }

    // Realistic Cinematic 3D Satellite & Extrusion Style
    // Renders Earth from stratosphere down to street level with satellite imagery,
    // glowing golden highway corridors, and extruded 3D illuminated buildings.
    return {
        version: 8,
        name: "Cinematic 3D Satellite",
        sources: {
            "esri-satellite": {
                type: "raster",
                tiles: [
                    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                ],
                tileSize: 256,
                maxzoom: 19
            },
            "openmaptiles": {
                type: "vector",
                url: "https://tiles.openfreemap.org/planet"
            }
        },
        layers: [
            {
                id: "satellite-layer",
                type: "raster",
                source: "esri-satellite",
                paint: {
                    "raster-saturation": -0.05,
                    "raster-contrast": 0.18,
                    "raster-brightness-min": 0.05
                }
            },
            {
                id: "night-ambience",
                type: "background",
                paint: {
                    "background-color": "#060913",
                    "background-opacity": 0.22
                }
            },
            {
                id: "highways-glow",
                type: "line",
                source: "openmaptiles",
                "source-layer": "transportation",
                filter: ["in", "class", "motorway", "trunk", "primary"],
                paint: {
                    "line-color": "#f59e0b",
                    "line-width": [
                        "interpolate",
                        ["linear"],
                        ["zoom"],
                        6, 1.0,
                        11, 2.0,
                        15, 3.8
                    ],
                    "line-opacity": 0.85
                }
            },
            {
                id: "add-3d-buildings",
                source: "openmaptiles",
                "source-layer": "building",
                type: "fill-extrusion",
                minzoom: 13,
                paint: {
                    "fill-extrusion-color": [
                        "interpolate",
                        ["linear"],
                        ["get", "render_height"],
                        0, "#1c2538",     // architectural steel base
                        25, "#2b3952",    // illuminated facade
                        60, "#485b7e",    // architectural glass
                        120, "#c59a48",   // warm bronze
                        220, "#dfbd82",   // luminous gold
                        340, "#ffe59e"    // penthouse gold beacon
                    ],
                    "fill-extrusion-height": [
                        "interpolate",
                        ["linear"],
                        ["zoom"],
                        13, 0,
                        14.05, ["get", "render_height"]
                    ],
                    "fill-extrusion-base": [
                        "interpolate",
                        ["linear"],
                        ["zoom"],
                        13, 0,
                        14.05, ["get", "render_min_height"]
                    ],
                    "fill-extrusion-opacity": 0.95
                }
            }
        ]
    };
}

function updateModalStatus(text) {
    if (cityModalStatusText) {
        cityModalStatusText.textContent = text;
    }
}

// ==========================================================================
// ZERO-CHROME YOUTUBE & STREET IMMERSION LIFECYCLE
// ==========================================================================

function loadYouTubeApi() {
    if (window.YT && window.YT.Player) {
        return Promise.resolve(window.YT);
    }
    if (ytApiReadyPromise) return ytApiReadyPromise;

    ytApiReadyPromise = new Promise((resolve) => {
        const prev = window.onYouTubeIframeAPIReady;
        window.onYouTubeIframeAPIReady = () => {
            if (typeof prev === "function") prev();
            resolve(window.YT);
        };
        if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
            const tag = document.createElement("script");
            tag.src = "https://www.youtube.com/iframe_api";
            document.head.appendChild(tag);
        }
    });
    return ytApiReadyPromise;
}

function destroyYouTubePlayer() {
    if (activeYtPlayer) {
        try {
            activeYtPlayer.stopVideo();
            activeYtPlayer.destroy();
        } catch (e) {}
        activeYtPlayer = null;
    }
    const wrap = document.getElementById("city-youtube-wrap");
    if (wrap) {
        wrap.innerHTML = '<div id="city-youtube-player"></div>';
    }
}

function updateModeBadgeUI(mode) {
    if (videoModeBadge) {
        videoModeBadge.textContent = (mode === "driving") ? "DRIVING TOUR" : "WALKING TOUR";
    }
}

function updateAudioButtonUI(isUnmuted) {
    if (!cityVideoAudioBtn) return;
    const mutedIcon = cityVideoAudioBtn.querySelector(".audio-muted-icon");
    const unmutedIcon = cityVideoAudioBtn.querySelector(".audio-unmuted-icon");

    cityVideoAudioBtn.classList.toggle("is-unmuted", isUnmuted);
    if (mutedIcon) mutedIcon.style.display = isUnmuted ? "none" : "block";
    if (unmutedIcon) unmutedIcon.style.display = isUnmuted ? "block" : "none";
    if (cityVideoAudioLabel) {
        cityVideoAudioLabel.textContent = isUnmuted ? "MUTE AUDIO" : "UNMUTE AUDIO";
    }
}

function toggleStreetAudio() {
    isAudioUnmuted = !isAudioUnmuted;
    if (activeYtPlayer && typeof activeYtPlayer.isMuted === "function") {
        if (isAudioUnmuted) {
            activeYtPlayer.unMute();
            activeYtPlayer.setVolume(100);
        } else {
            activeYtPlayer.mute();
        }
    }
    if (cityVideo && cityVideo.getAttribute("src")) {
        cityVideo.muted = !isAudioUnmuted;
    }
    updateAudioButtonUI(isAudioUnmuted);
}

function toggleStreetPlayPause() {
    if (activeYtPlayer && typeof activeYtPlayer.getPlayerState === "function") {
        const state = activeYtPlayer.getPlayerState();
        if (state === 1) { // PLAYING
            activeYtPlayer.pauseVideo();
        } else {
            activeYtPlayer.playVideo();
            hidePlayOverlay();
        }
    } else if (cityVideo && cityVideo.getAttribute("src")) {
        if (cityVideo.paused) {
            cityVideo.play();
            hidePlayOverlay();
        } else {
            cityVideo.pause();
        }
    }
}

function switchStreetPerspective() {
    if (!currentCityData) return;
    currentStreetMode = (currentStreetMode === "walking") ? "driving" : "walking";
    updateModeBadgeUI(currentStreetMode);

    const videoId = (currentCityData.youtube && (currentCityData.youtube[currentStreetMode] || currentCityData.youtube.walking || currentCityData.youtube.driving)) || "joPpxvhS2_I";

    // Smooth subtle crossfade
    if (typeof gsap !== "undefined") {
        gsap.to(cityVideoFrame, {
            opacity: 0.35,
            duration: 0.25,
            onComplete: () => {
                if (activeYtPlayer && typeof activeYtPlayer.loadVideoById === "function") {
                    activeYtPlayer.loadVideoById({
                        videoId: videoId,
                        startSeconds: 0
                    });
                    if (!isAudioUnmuted) {
                        activeYtPlayer.mute();
                    }
                }
                gsap.to(cityVideoFrame, { opacity: 1, duration: 0.45, delay: 0.1 });
            }
        });
    } else {
        if (activeYtPlayer && typeof activeYtPlayer.loadVideoById === "function") {
            activeYtPlayer.loadVideoById({ videoId: videoId, startSeconds: 0 });
            if (!isAudioUnmuted) activeYtPlayer.mute();
        }
    }
}

function startUnderMapPlayback(city) {
    if (underMapPreloadStarted || !isModalOpen) return;
    underMapPreloadStarted = true;

    // Detect user preference from section 2
    currentStreetMode = (typeof s2SelectedMode !== "undefined" && s2SelectedMode === "driving") ? "driving" : "walking";
    updateModeBadgeUI(currentStreetMode);

    if (videoCityTag) {
        videoCityTag.textContent = `${city.name}, ${city.country || ""}`;
    }

    // Audio ON by default as requested
    isAudioUnmuted = true;
    updateAudioButtonUI(true);

    const videoId = (city.youtube && (city.youtube[currentStreetMode] || city.youtube.walking || city.youtube.driving)) || "joPpxvhS2_I";

    if (cityVideoLoadingLabel) {
        cityVideoLoadingLabel.textContent = `ENTERING ${city.name.toUpperCase()}…`;
    }
    if (cityVideoLoading) {
        cityVideoLoading.hidden = false;
        cityVideoLoading.classList.remove("is-hidden");
    }

    loadYouTubeApi().then((YT) => {
        if (!isModalOpen || !document.getElementById("city-youtube-player")) return;

        const origin = (window.location.protocol.startsWith("http")) ? window.location.origin : undefined;
        const playerVars = {
            autoplay: 1,
            mute: 1, // Start muted under the map for unblocked browser autoplay
            controls: 0,
            showinfo: 0,
            rel: 0,
            iv_load_policy: 3,
            modestbranding: 1,
            disablekb: 1,
            playsinline: 1,
            fs: 0,
            loop: 1,
            playlist: videoId
        };
        if (origin) playerVars.origin = origin;

        try {
            activeYtPlayer = new YT.Player("city-youtube-player", {
                videoId: videoId,
                playerVars: playerVars,
                events: {
                    onReady: (event) => {
                        event.target.playVideo();
                        if (isAudioUnmuted) {
                            try {
                                event.target.unMute();
                                event.target.setVolume(100);
                            } catch (e) {}
                        }
                    },
                    onStateChange: (event) => {
                        if (event.data === YT.PlayerState.PLAYING) {
                            if (isAudioUnmuted) {
                                try {
                                    event.target.unMute();
                                    event.target.setVolume(100);
                                } catch (e) {}
                            }
                            isYtPlaying = true;
                            hideVideoLoading();
                            hidePlayOverlay();
                        } else if (event.data === YT.PlayerState.ENDED) {
                            event.target.playVideo();
                        }
                    },
                    onError: (err) => {
                        console.warn("YouTube player notice:", err);
                        tryLocalVideoFallback(city);
                    }
                }
            });
        } catch (e) {
            console.warn("YT.Player init failed, trying local fallback:", e);
            tryLocalVideoFallback(city);
        }
    }).catch(() => {
        tryLocalVideoFallback(city);
    });
}

function tryLocalVideoFallback(city) {
    if (!cityVideo || !isModalOpen) return;
    const videoSrc = city.videoFile || `videos/${(city.name || "").toLowerCase().replace(/\s+/g, "")}.mp4`;
    cityVideo.src = videoSrc;
    cityVideo.style.display = "block";
    cityVideo.muted = !isAudioUnmuted;
    cityVideo.play().then(() => {
        hideVideoLoading();
        hidePlayOverlay();
    }).catch(() => {
        showVideoFallback();
    });
}

function executeFinalPush(city) {
    if (isFinalPushTriggered || !isModalOpen) return;
    isFinalPushTriggered = true;

    if (underMapTimer) {
        clearTimeout(underMapTimer);
        underMapTimer = null;
    }
    if (finalPushTimer) {
        clearTimeout(finalPushTimer);
        finalPushTimer = null;
    }
    if (mapFlightTimeout) {
        clearTimeout(mapFlightTimeout);
        mapFlightTimeout = null;
    }

    // Ensure under-map playback was started
    if (!underMapPreloadStarted) {
        startUnderMapPlayback(city);
    }

    if (cityModalSkipBtn) {
        cityModalSkipBtn.style.display = "none";
    }

    updateModalStatus("DIVING INTO THE ROAD…");

    // 1. Camera pushes into the ground / road
    if (activeMap) {
        try {
            activeMap.easeTo({
                pitch: 85, // Camera tilts flat against asphalt
                zoom: Math.min(19.2, (city.endZoom || 15.5) + 3.2), // Plunges down to the road surface
                bearing: (city.endBearing || 0) + 14,
                duration: 1300,
                easing: (t) => t * t * t // Aggressive acceleration into the ground
            });
        } catch (e) {}
    }

    // 2. Map scales up / blurs / fades, revealing video already playing underneath
    if (cityModal) {
        cityModal.classList.add("is-immersive");
    }

    if (typeof gsap !== "undefined") {
        gsap.killTweensOf([cityMapStage, cityVideoFrame]);

        gsap.to(cityMapStage, {
            scale: 2.4,
            filter: "blur(22px) brightness(1.25)",
            opacity: 0,
            duration: 1.25,
            ease: "power2.inOut",
            onComplete: () => {
                // 3. Map is destroyed! Only street video remains!
                destroyMap();
                updateModalStatus("YOU'RE HERE.");

                // Unmute audio on reveal by default
                if (isAudioUnmuted) {
                    if (activeYtPlayer && typeof activeYtPlayer.unMute === "function") {
                        try {
                            activeYtPlayer.unMute();
                            activeYtPlayer.setVolume(100);
                        } catch (e) {}
                    }
                    if (cityVideo) {
                        cityVideo.muted = false;
                    }
                }
            }
        });

        // Full-bleed street video smoothly settles
        gsap.fromTo(cityVideoFrame,
            { scale: 1.05 },
            { scale: 1.0, duration: 1.25, ease: "power2.out" }
        );
    } else {
        destroyMap();
        updateModalStatus("YOU'RE HERE.");
        if (isAudioUnmuted) {
            if (activeYtPlayer && typeof activeYtPlayer.unMute === "function") {
                try {
                    activeYtPlayer.unMute();
                    activeYtPlayer.setVolume(100);
                } catch (e) {}
            }
            if (cityVideo) cityVideo.muted = false;
        }
    }
}

function destroyMap() {
    if (activeMap) {
        try {
            activeMap.remove();
        } catch (e) {}
        activeMap = null;
    }
    if (cityMapContainer) {
        cityMapContainer.innerHTML = "";
    }
    if (cityMapStage) {
        cityMapStage.style.display = "none";
        if (typeof gsap !== "undefined") {
            gsap.set(cityMapStage, { clearProps: "all" });
        }
    }
}

function showMapError(title, desc) {
    if (cityMapFallback) {
        cityMapFallback.style.display = "flex";
        const titleEl = document.getElementById("fallback-title");
        const descEl = document.getElementById("fallback-desc");
        if (titleEl) titleEl.textContent = title;
        if (descEl) descEl.textContent = desc;
    }
    updateModalStatus("MAP UNAVAILABLE");

    // Seamlessly transition straight to street view experience
    window.setTimeout(() => {
        if (isModalOpen && !isFinalPushTriggered && currentCityData) {
            executeFinalPush(currentCityData);
        }
    }, 1400);
}

function updateModalStatus(text) {
    if (cityModalStatusText) {
        cityModalStatusText.textContent = text;
    }
}

function openCityModal(cityKey) {
    const city = cityData[cityKey];
    if (!city || isModalOpen) return;

    isModalOpen = true;
    underMapPreloadStarted = false;
    isFinalPushTriggered = false;
    currentCityData = city;
    lastFocusedElement = document.activeElement;

    if (city.timezone) {
        activeTimezone = city.timezone;
        updateLocalClock();
    }

    // Pause ambient background audio if playing
    const ambientAudio = document.getElementById("ambient-audio");
    if (ambientAudio) {
        wasAmbientPlaying = !ambientAudio.paused;
        if (wasAmbientPlaying) {
            ambientAudio.pause();
        }
    }

    // Populate header info
    if (cityModalTitle) cityModalTitle.textContent = city.name;
    if (cityModalCountry) cityModalCountry.textContent = city.country || "";
    if (cityModalCoords) {
        const [lng, lat] = city.coords;
        const latStr = `${Math.abs(lat).toFixed(4)}° ${lat >= 0 ? "N" : "S"}`;
        const lngStr = `${Math.abs(lng).toFixed(4)}° ${lng >= 0 ? "E" : "W"}`;
        cityModalCoords.textContent = `${latStr}, ${lngStr}`;
    }
    if (hudTargetName) hudTargetName.textContent = `CITY: ${city.name.toUpperCase()}`;
    if (hudCameraZoom) hudCameraZoom.textContent = "ZOOM: 2.0";
    if (hudAltitudeLabel) hudAltitudeLabel.textContent = "HIGH ABOVE THE CITY";

    updateModalStatus("FINDING THE CITY…");

    // Clean up previous video player
    destroyYouTubePlayer();

    // Reset stages (Map on top z-index:2, Video underneath z-index:1)
    if (cityMapStage) {
        cityMapStage.style.display = "block";
        cityMapStage.style.opacity = "1";
        if (typeof gsap !== "undefined") {
            gsap.set(cityMapStage, { scale: 1, filter: "none", opacity: 1 });
        }
    }
    if (cityVideoStage) {
        cityVideoStage.style.display = "block";
        cityVideoStage.style.opacity = "1";
    }
    if (cityMapFallback) cityMapFallback.style.display = "none";
    if (cityVideoPlayOverlay) cityVideoPlayOverlay.style.display = "none";
    if (cityVideoLoading) cityVideoLoading.hidden = true;
    if (cityVideoFallback) cityVideoFallback.hidden = true;
    if (cityModalSkipBtn) cityModalSkipBtn.style.display = "inline-flex";

    if (cityVideo) {
        cityVideo.muted = false;
        cityVideo.removeAttribute("src");
        cityVideo.style.display = "none";
    }
    // Audio ON by default as requested
    isAudioUnmuted = true;
    updateAudioButtonUI(true);

    // Show modal container
    cityModal.classList.add("is-active");
    cityModal.classList.remove("is-immersive");
    cityModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("city-modal-open");

    window.requestAnimationFrame(() => {
        if (cityModalCloseBtn) cityModalCloseBtn.focus();
    });

    // GSAP Open Animation (fade + slight scale in)
    if (typeof gsap !== "undefined") {
        gsap.killTweensOf([cityModalBackdrop, cityModalDialog]);
        gsap.fromTo(cityModalBackdrop, 
            { opacity: 0 }, 
            { opacity: 1, duration: 0.35, ease: "power2.out" }
        );
        gsap.fromTo(cityModalDialog, 
            { opacity: 0, scale: 0.94, y: 15 }, 
            { 
                opacity: 1, 
                scale: 1, 
                y: 0, 
                duration: 0.45, 
                ease: "power3.out",
                onComplete: () => {
                    initCityMap(city);
                }
            }
        );
    } else {
        cityModalBackdrop.style.opacity = "1";
        cityModalDialog.style.opacity = "1";
        cityModalDialog.style.transform = "scale(1)";
        initCityMap(city);
    }
}

function initCityMap(city) {
    if (!cityModal || !cityModal.classList.contains("is-active")) return;

    const token = getActiveMapboxToken();

    // Check Mapbox GL availability & WebGL support
    const isMapboxAvailable = typeof mapboxgl !== "undefined" && (typeof mapboxgl.supported === "function" ? mapboxgl.supported() : true);

    if (!isMapboxAvailable) {
        showMapError("This view needs WebGL.", "Hardware acceleration / WebGL is required for 3D satellite visualization.");
        return;
    }

    if (!token || !token.startsWith("pk.")) {
        showMapError("The map needs a token.", "Please provide a valid Mapbox Public Access Token (starts with 'pk.') to initialize 3D cities.");
        return;
    }

    try {
        mapboxgl.accessToken = token;
        const style = getMapboxStyle();

        // 1. Camera starts high in stratosphere looking straight down (pitch 0)
        const startZoom = 2.0;
        const targetZoom = city.endZoom || 15.6;
        const targetPitch = city.endPitch || 64;
        const targetBearing = city.endBearing || 28;

        if (cityMapContainer) {
            cityMapContainer.innerHTML = "";
        }

        const map = new mapboxgl.Map({
            container: "city-mapbox-container",
            style: style,
            center: city.coords,
            zoom: startZoom,
            pitch: 0,
            bearing: 0,
            preserveDrawingBuffer: true,
            attributionControl: false,
            antialias: true
        });

        activeMap = map;

        let hasFlightStarted = false;

        const onMapReady = () => {
            if (!activeMap) return;

            // Vibrant Atmospheric Space Fog & Horizon Glow
            if (typeof map.setFog === "function") {
                map.setFog({
                    range: [0.5, 10],
                    color: "#121d30",
                    "horizon-blend": 0.3,
                    "high-color": "#091425",
                    "space-color": "#01040b",
                    "star-intensity": 0.9
                });
            }

            // Beautiful Palette
            try {
                if (map.getLayer("background")) {
                    map.setPaintProperty("background", "background-color", "#0c111d");
                }
                if (map.getLayer("water")) {
                    map.setPaintProperty("water", "fill-color", "#0f3254");
                    map.setPaintProperty("water", "fill-opacity", 0.95);
                }
                if (map.getLayer("waterway")) {
                    map.setPaintProperty("waterway", "line-color", "#1a4f7e");
                    map.setPaintProperty("waterway", "line-width", 2);
                }
                if (map.getLayer("landuse_park")) {
                    map.setPaintProperty("landuse_park", "fill-color", "#0f2e21");
                    map.setPaintProperty("landuse_park", "fill-opacity", 0.85);
                }
                if (map.getLayer("landcover_wood")) {
                    map.setPaintProperty("landcover_wood", "fill-color", "#0c2419");
                    map.setPaintProperty("landcover_wood", "fill-opacity", 0.8);
                }
                if (map.getLayer("highway_motorway_inner")) {
                    map.setPaintProperty("highway_motorway_inner", "line-color", "#dfbd82");
                    map.setPaintProperty("highway_motorway_inner", "line-width", 2.4);
                }
                if (map.getLayer("highway_major_inner")) {
                    map.setPaintProperty("highway_major_inner", "line-color", "#f59e0b");
                    map.setPaintProperty("highway_major_inner", "line-width", 1.8);
                }
                if (map.getLayer("highway_minor")) {
                    map.setPaintProperty("highway_minor", "line-color", "#28394e");
                }
            } catch (err) {}

            // Insert 3D Extruded Buildings Layer
            const currentStyle = map.getStyle();
            if (currentStyle && currentStyle.layers) {
                let labelLayerId;
                for (let i = 0; i < currentStyle.layers.length; i++) {
                    if (currentStyle.layers[i].type === "symbol" && currentStyle.layers[i].layout && currentStyle.layers[i].layout["text-field"]) {
                        labelLayerId = currentStyle.layers[i].id;
                        break;
                    }
                }

                const isMapboxComposite = !!(currentStyle.sources && currentStyle.sources["composite"]);
                const buildingSource = isMapboxComposite ? "composite" : "openmaptiles";
                const heightProp = isMapboxComposite ? "height" : "render_height";
                const minHeightProp = isMapboxComposite ? "min_height" : "render_min_height";
                const filterExpr = isMapboxComposite ? ["==", "extrude", "true"] : ["has", "render_height"];

                if (!map.getLayer("add-3d-buildings")) {
                    map.addLayer(
                        {
                            id: "add-3d-buildings",
                            source: buildingSource,
                            "source-layer": "building",
                            filter: filterExpr,
                            type: "fill-extrusion",
                            minzoom: 13,
                            paint: {
                                "fill-extrusion-color": [
                                    "interpolate",
                                    ["linear"],
                                    ["get", heightProp],
                                    0, "#1c2538",
                                    25, "#2b3952",
                                    60, "#485b7e",
                                    120, "#c59a48",
                                    220, "#dfbd82",
                                    340, "#ffe59e"
                                ],
                                "fill-extrusion-height": [
                                    "interpolate",
                                    ["linear"],
                                    ["zoom"],
                                    13, 0,
                                    14.05, ["get", heightProp]
                                ],
                                "fill-extrusion-base": [
                                    "interpolate",
                                    ["linear"],
                                    ["zoom"],
                                    13, 0,
                                    14.05, ["get", minHeightProp]
                                ],
                                "fill-extrusion-opacity": 0.95
                            }
                        },
                        labelLayerId
                    );
                }
            }

            startCinematicFlight();
        };

        const startCinematicFlight = () => {
            if (hasFlightStarted || !activeMap) return;
            hasFlightStarted = true;

            map.resize();
            updateModalStatus("APPROACHING THE CITY…");
            if (hudAltitudeLabel) hudAltitudeLabel.textContent = "HIGH ABOVE THE CITY";

            // Camera smoothly flies down while tilting into 3D perspective
            const flightDuration = 4800;
            map.flyTo({
                center: city.coords,
                zoom: targetZoom,
                pitch: targetPitch,
                bearing: targetBearing,
                duration: flightDuration,
                speed: 0.85,
                curve: 1.4,
                essential: true,
                easing: (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
            });

            // Near the end of the flight (~2.8s in): start loading street video & muted playback under the map
            underMapTimer = setTimeout(() => {
                if (isModalOpen && !isFinalPushTriggered) {
                    startUnderMapPlayback(city);
                }
            }, 2800);

            // Final push at 4.6s: camera dives into road, map blurs/fades, video reveals
            finalPushTimer = setTimeout(() => {
                if (isModalOpen && !isFinalPushTriggered) {
                    executeFinalPush(city);
                }
            }, 4600);
        };

        if (map.isStyleLoaded()) {
            onMapReady();
        } else {
            map.once("style.load", onMapReady);
        }

        // Live telemetry updater during flight
        const updateTelemetry = () => {
            if (!activeMap) return;
            const z = map.getZoom();
            if (hudCameraZoom) hudCameraZoom.textContent = `ZOOM: ${z.toFixed(1)}`;

            // Altitude descent mapping
            const progress = Math.min(1, Math.max(0, (z - 2.0) / (targetZoom - 2.0)));
            const altKm = 50 * Math.pow(0.005, progress);

            let altText = "";
            let phase = "HIGH ABOVE";
            if (progress >= 0.92) {
                phase = "CITY LEVEL";
                altText = `${Math.round(altKm * 1000)} M`;
            } else if (progress >= 0.65) {
                phase = "APPROACH";
                altText = `${altKm.toFixed(1)} KM`;
            } else if (progress >= 0.3) {
                phase = "DESCENT";
                altText = `${altKm.toFixed(1)} KM`;
            } else {
                phase = "HIGH ABOVE";
                altText = `${altKm.toFixed(1)} KM`;
            }

            if (hudAltitudeLabel && !isFinalPushTriggered) {
                hudAltitudeLabel.textContent = `${phase} (${altText})`;
            }

            // Fallback trigger if zoom crosses threshold
            if (z >= 13.8 && !underMapPreloadStarted) {
                startUnderMapPlayback(city);
            }
        };

        map.on("move", updateTelemetry);
        map.on("render", updateTelemetry);

        // When 3D camera flight finishes
        map.once("moveend", () => {
            if (!hasFlightStarted || isFinalPushTriggered) return;
            executeFinalPush(city);
        });

        map.on("error", (e) => {
            console.warn("Mapbox error:", e);
            if (e && e.error && (e.error.status === 401 || e.error.status === 403)) {
                showMapError("The map access expired.", "The provided Mapbox Access Token is invalid or unauthorized.");
            }
        });

        // Safety fallback timer
        mapFlightTimeout = setTimeout(() => {
            if (!isFinalPushTriggered) {
                executeFinalPush(city);
            }
        }, 8500);

    } catch (err) {
        console.error("Map initialization failed:", err);
        showMapError("The map could not open.", err.message || "Failed to load 3D map engine.");
    }
}

function hideVideoLoading() {
    if (!cityVideoLoading) return;
    cityVideoLoading.classList.add("is-hidden");
    window.setTimeout(() => {
        if (cityVideoLoading && cityVideoLoading.classList.contains("is-hidden")) {
            cityVideoLoading.hidden = true;
        }
    }, 460);
}

function showVideoFallback() {
    if (!isModalOpen) return;
    hideVideoLoading();
    hidePlayOverlay();
    if (cityVideoFallback) cityVideoFallback.hidden = false;
    updateModalStatus("STREET VIEW UNAVAILABLE");
    if (cityVideo) {
        cityVideo.pause();
    }
}

function showPlayOverlay() {
    if (cityVideoPlayOverlay) {
        cityVideoPlayOverlay.style.display = "flex";
        if (typeof gsap !== "undefined") {
            gsap.fromTo(cityVideoPlayOverlay, { opacity: 0 }, { opacity: 1, duration: 0.3 });
        }
    }
}

function hidePlayOverlay() {
    if (cityVideoPlayOverlay) {
        cityVideoPlayOverlay.style.display = "none";
    }
}

function restoreModalFocus() {
    if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
        lastFocusedElement.focus({ preventScroll: true });
    }
    lastFocusedElement = null;
}

function closeCityModal() {
    if (!isModalOpen) return;
    isModalOpen = false;
    isFinalPushTriggered = false;
    underMapPreloadStarted = false;

    if (underMapTimer) {
        clearTimeout(underMapTimer);
        underMapTimer = null;
    }
    if (finalPushTimer) {
        clearTimeout(finalPushTimer);
        finalPushTimer = null;
    }
    if (mapFlightTimeout) {
        clearTimeout(mapFlightTimeout);
        mapFlightTimeout = null;
    }

    // 1. Destroy YouTube player completely
    destroyYouTubePlayer();

    // 2. Pause and reset local video completely
    if (cityVideo) {
        cityVideo.pause();
        cityVideo.muted = true;
        cityVideo.removeAttribute("src");
        cityVideo.load();
        cityVideo.style.display = "none";
    }
    isAudioUnmuted = false;
    updateAudioButtonUI(false);

    hidePlayOverlay();
    hideVideoLoading();
    if (cityVideoFallback) cityVideoFallback.hidden = true;
    if (cityModal) cityModal.classList.remove("is-immersive");
    updateModalStatus("FINDING THE CITY…");

    // 3. Destroy Mapbox instance cleanly
    destroyMap();

    // 4. GSAP Close Animation
    if (typeof gsap !== "undefined") {
        gsap.killTweensOf([cityModalDialog, cityModalBackdrop]);
        gsap.to(cityModalDialog, {
            opacity: 0,
            scale: 0.94,
            y: 12,
            duration: 0.3,
            ease: "power2.in"
        });
        gsap.to(cityModalBackdrop, {
            opacity: 0,
            duration: 0.3,
            ease: "power2.in",
            onComplete: () => {
                if (cityModal) {
                    cityModal.classList.remove("is-active");
                    cityModal.setAttribute("aria-hidden", "true");
                }
                document.body.classList.remove("city-modal-open");
                restoreModalFocus();
            }
        });
    } else {
        if (cityModal) {
            cityModal.classList.remove("is-active");
            cityModal.setAttribute("aria-hidden", "true");
        }
        document.body.classList.remove("city-modal-open");
        restoreModalFocus();
    }

    // Resume ambient background audio if it was active before opening
    const ambientAudio = document.getElementById("ambient-audio");
    if (ambientAudio && wasAmbientPlaying) {
        ambientAudio.play().catch(() => {});
        wasAmbientPlaying = false;
    }
}

// Attach Event Listeners
if (cityModalCloseBtn) {
    cityModalCloseBtn.addEventListener("click", closeCityModal);
}

if (cityModalBackdrop) {
    cityModalBackdrop.addEventListener("click", closeCityModal);
}

if (cityModalSkipBtn) {
    cityModalSkipBtn.addEventListener("click", () => {
        if (currentCityData) {
            executeFinalPush(currentCityData);
        }
    });
}

if (fallbackActionBtn) {
    fallbackActionBtn.addEventListener("click", () => {
        if (currentCityData) {
            executeFinalPush(currentCityData);
        }
    });
}

const fallbackSaveBtn = document.getElementById("fallback-save-btn");
const mapboxTokenInput = document.getElementById("mapbox-token-input");
if (fallbackSaveBtn && mapboxTokenInput) {
    fallbackSaveBtn.addEventListener("click", () => {
        const val = mapboxTokenInput.value.trim();
        if (val.startsWith("pk.")) {
            localStorage.setItem("MAPBOX_ACCESS_TOKEN", val);
            window.MAPBOX_ACCESS_TOKEN = val;
            if (cityMapFallback) cityMapFallback.style.display = "none";
            if (currentCityData) {
                initCityMap(currentCityData);
            }
        } else {
            alert("Please enter a valid Mapbox public token starting with 'pk.'");
        }
    });
}

if (cityVideoAudioBtn) {
    cityVideoAudioBtn.addEventListener("click", toggleStreetAudio);
}

if (videoModeBadgeBtn) {
    videoModeBadgeBtn.addEventListener("click", switchStreetPerspective);
}

if (cityVideoShield) {
    cityVideoShield.addEventListener("click", toggleStreetPlayPause);
}

if (cityVideoBigPlay) {
    cityVideoBigPlay.addEventListener("click", () => {
        hidePlayOverlay();
        if (activeYtPlayer && typeof activeYtPlayer.playVideo === "function") {
            try { activeYtPlayer.playVideo(); } catch (e) {}
        } else if (cityVideo) {
            cityVideo.play().catch(() => {});
        }
    });
}

if (cityVideoFallbackBtn) {
    cityVideoFallbackBtn.addEventListener("click", closeCityModal);
}

window.addEventListener("message", (e) => {
    try {
        const data = typeof e.data === "string" ? JSON.parse(e.data) : e.data;
        if (data && data.event === "onStateChange" && data.info === 1) {
            hidePlayOverlay();
        }
    } catch (err) {}
});

document.addEventListener("keydown", (e) => {
    if (!isModalOpen) return;

    if (e.key === "Escape") {
        closeCityModal();
        return;
    }

    if (e.key === "m" || e.key === "M") {
        toggleStreetAudio();
        return;
    }

    if (e.key === " " && !e.target.matches("input, textarea, button")) {
        e.preventDefault();
        toggleStreetPlayPause();
        return;
    }

    if (e.key !== "Tab" || !cityModalDialog) return;

    const focusable = Array.from(cityModalDialog.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )).filter((el) => el.offsetParent !== null || el === document.activeElement);

    if (!focusable.length) {
        e.preventDefault();
        cityModalDialog.focus();
        return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.shiftKey && (document.activeElement === first || document.activeElement === cityModalDialog)) {
        e.preventDefault();
        last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
    }
});

// ==========================================================================
// CITY CAROUSEL & COMPACT PLACE SELECTOR ENGINE
// ==========================================================================

function scrollCarouselToCity(cityKey) {
    const track = document.getElementById("city-carousel-track");
    const targetCard = document.getElementById(`city-card-${cityKey}`);
    if (!track || !targetCard) return;

    // Center the target card smoothly within the carousel viewport
    const trackWidth = track.clientWidth;
    const cardLeft = targetCard.offsetLeft;
    const cardWidth = targetCard.offsetWidth;
    const scrollTarget = cardLeft - (trackWidth / 2) + (cardWidth / 2);

    if (typeof gsap !== "undefined") {
        gsap.to(track, {
            scrollLeft: Math.max(0, scrollTarget),
            duration: 0.45,
            ease: "power2.out"
        });
    } else {
        track.scrollTo({
            left: Math.max(0, scrollTarget),
            behavior: "smooth"
        });
    }
}

function highlightCityCard(cityKey) {
    const cards = document.querySelectorAll(".s3-city-card");
    const targetCard = document.getElementById(`city-card-${cityKey}`);
    if (!targetCard) return;

    cards.forEach((c) => {
        c.classList.remove("s3-city-selected", "s3-card-focused");
        c.setAttribute("aria-pressed", "false");
    });

    targetCard.classList.add("s3-city-selected", "s3-card-focused");
    targetCard.setAttribute("aria-pressed", "true");

    // Fast, smooth pop feedback (300-400ms)
    if (typeof gsap !== "undefined") {
        gsap.fromTo(targetCard,
            { scale: 0.98 },
            { scale: 1.03, duration: 0.38, ease: "back.out(1.5)" }
        );
    }
}

function setupCityDropdownSelector() {
    const dropdown = document.getElementById("city-selector-dropdown");
    const dropdownBtn = document.getElementById("city-selector-btn");
    const dropdownMenu = document.getElementById("city-selector-menu");
    const currentLabel = document.getElementById("selector-current");
    const options = document.querySelectorAll(".city-option");

    if (!dropdown || !dropdownBtn || !dropdownMenu) return;

    const toggleMenu = (open) => {
        const isOpen = (typeof open === "boolean") ? open : !dropdownMenu.classList.contains("is-open");
        dropdownMenu.classList.toggle("is-open", isOpen);
        dropdownBtn.setAttribute("aria-expanded", String(isOpen));
    };

    dropdownBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        toggleMenu();
    });

    options.forEach((opt) => {
        opt.addEventListener("click", (e) => {
            e.stopPropagation();
            const cityKey = opt.getAttribute("data-city");
            const optName = opt.querySelector(".city-opt-name")?.textContent || cityKey;

            if (currentLabel) {
                currentLabel.textContent = optName;
            }

            toggleMenu(false);

            // Fast, intentional jump to city in carousel without auto-opening modal!
            scrollCarouselToCity(cityKey);
            highlightCityCard(cityKey);
        });
    });

    // Close on click outside
    document.addEventListener("click", (e) => {
        if (!dropdown.contains(e.target)) {
            toggleMenu(false);
        }
    });

    // Close on Escape
    dropdown.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            toggleMenu(false);
            dropdownBtn.focus();
        }
    });
}

function setupCarouselArrows() {
    const track = document.getElementById("city-carousel-track");
    const prevBtn = document.getElementById("carousel-prev");
    const nextBtn = document.getElementById("carousel-next");
    if (!track) return;

    if (prevBtn) {
        prevBtn.addEventListener("click", () => {
            const step = track.clientWidth * 0.7;
            if (typeof gsap !== "undefined") {
                gsap.to(track, { scrollLeft: Math.max(0, track.scrollLeft - step), duration: 0.4, ease: "power2.out" });
            } else {
                track.scrollBy({ left: -step, behavior: "smooth" });
            }
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener("click", () => {
            const step = track.clientWidth * 0.7;
            if (typeof gsap !== "undefined") {
                gsap.to(track, { scrollLeft: track.scrollLeft + step, duration: 0.4, ease: "power2.out" });
            } else {
                track.scrollBy({ left: step, behavior: "smooth" });
            }
        });
    }
}

// City Cards Click Handling (User confirms with ENTER on the card)
const s3CityCards = document.querySelectorAll(".s3-city-card");

s3CityCards.forEach((card) => {
    card.addEventListener("click", (e) => {
        e.preventDefault();

        s3CityCards.forEach((item) => {
            item.classList.remove("s3-city-selected", "s3-card-focused");
            item.setAttribute("aria-pressed", "false");
        });

        card.classList.add("s3-city-selected", "s3-card-focused");
        card.setAttribute("aria-pressed", "true");

        // Read selected city key from data-city
        const rawCity = card.getAttribute("data-city") || "";
        const cityKey = rawCity.toLowerCase().replace(/\s+/g, "");

        // Sync dropdown label
        const currentLabel = document.getElementById("selector-current");
        if (currentLabel) {
            currentLabel.textContent = rawCity;
        }

        openCityModal(cityKey);
    });
});

setupCityDropdownSelector();
setupCarouselArrows();

// Auto-open city modal if requested via URL param (e.g. ?openCity=paris)
const searchParams = new URLSearchParams(window.location.search);
const queryCity = searchParams.get("openCity");
if (queryCity && cityData[queryCity.toLowerCase()]) {
    const triggerAutoOpen = () => {
        setTimeout(() => {
            openCityModal(queryCity.toLowerCase());
        }, 100);
    };

    if (document.readyState === "complete" || document.readyState === "interactive") {
        triggerAutoOpen();
    } else {
        window.addEventListener("DOMContentLoaded", triggerAutoOpen);
        window.addEventListener("load", triggerAutoOpen);
    }
}

function updateLocalClock() {
    const clocks = document.querySelectorAll("#s2-local-clock, #s3-local-clock, #local-clock");
    if (!clocks.length) return;

    const time = new Intl.DateTimeFormat("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone: activeTimezone || undefined
    }).format(new Date());

    clocks.forEach((clock) => {
        clock.textContent = time;
    });
}

updateLocalClock();
setInterval(updateLocalClock, 60000);

function setupSoundControls() {
    const controls = document.querySelectorAll(".s2-sound-control");
    const ambientAudio = document.getElementById("ambient-audio");
    if (!controls.length) return;

    if (ambientAudio) {
        ambientAudio.volume = 0.25;
    }

    const setSoundState = (isActive) => {
        controls.forEach((control) => {
            control.classList.toggle("s2-sound-active", isActive);
            control.setAttribute("aria-pressed", String(isActive));

            const label = control.querySelector(".s2-sound-label");
            if (label) {
                label.textContent = isActive ? "AMBIENT SOUND ON" : "AMBIENT SOUND OFF";
            }
        });

        if (ambientAudio) {
            if (isActive) {
                const playPromise = ambientAudio.play();
                if (playPromise !== undefined) {
                    playPromise.catch(() => {
                    });
                }
            } else {
                ambientAudio.pause();
            }
        }
    };

    controls.forEach((control) => {
        control.addEventListener("click", () => {
            const currentlyActive = control.classList.contains("s2-sound-active");
            setSoundState(!currentlyActive);
        });
    });
}

setupSoundControls();

/* ==========================================================================
   Smooth Trailing Cursor Engine
   ========================================================================== */
function initSmoothTrailingCursor() {
    const finePointer = window.matchMedia("(pointer: fine) and (hover: hover)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    const cursorEl = document.getElementById("custom-cursor");
    const cursorLabelEl = document.getElementById("cursor-label");

    if (!cursorEl || !cursorLabelEl) return;

    let mouseX = -100;
    let mouseY = -100;
    let currX = -100;
    let currY = -100;
    let isInitialized = false;
    let isVisible = false;
    let isIdle = true;
    let rafId = null;
    let lastTime = performance.now();

    // Viscous air-drag damping coefficient for weighted inertia
    const DAMPING_LAMBDA = 11;

    const INTERACTIVE_SELECTOR = [
        "a",
        "button",
        "input[type='button']",
        "input[type='submit']",
        "input[type='reset']",
        "[role='button']",
        ".s3-city-card",
        ".s2-mode-card",
        ".story-step",
        ".explore-link",
        ".reveal-button",
        ".s2-start-button",
        ".s2-sound-control",
        ".hero-scroll-cue",
        ".scroll-cue",
        ".city-video-audio-toggle",
        ".city-video-big-play",
        ".city-video-close",
        "[data-cursor]",
        "[data-cursor-label]"
    ].join(", ");

    function getCursorLabel(el) {
        if (!el) return "";
        if (el.dataset.cursor) return el.dataset.cursor;
        if (el.dataset.cursorLabel) return el.dataset.cursorLabel;

        if (el.id === "explore-btn" || el.classList.contains("explore-link")) return "Enter";
        if (el.classList.contains("s3-city-card")) return "Explore";
        if (el.classList.contains("s2-start-button")) return "Start";
        if (el.classList.contains("reveal-button")) return "Discover";
        if (el.classList.contains("city-video-big-play")) return "Play";
        if (el.classList.contains("city-video-close")) return "Close";
        if (el.classList.contains("s2-sound-control") || el.classList.contains("city-video-audio-toggle")) return "Sound";
        if (el.classList.contains("hero-scroll-cue") || el.classList.contains("scroll-cue")) return "Scroll";
        if (el.classList.contains("s2-signin")) return "Sign In";

        if (el.classList.contains("s2-mode-card")) {
            const mode = el.getAttribute("data-mode");
            if (mode === "driving") return "Drive";
            if (mode === "walking") return "Walk";
        }

        return "";
    }

    function checkActiveState() {
        return finePointer.matches && !reducedMotion.matches;
    }

    function updateActiveState() {
        if (checkActiveState()) {
            if (isInitialized) {
                document.documentElement.classList.add("has-custom-cursor");
            }
            cursorEl.style.display = "";
        } else {
            document.documentElement.classList.remove("has-custom-cursor");
            cursorEl.style.display = "none";
            if (rafId) {
                cancelAnimationFrame(rafId);
                rafId = null;
            }
            isIdle = true;
        }
    }

    function renderLoop(now) {
        const dt = Math.min((now - lastTime) / 1000, 0.1);
        lastTime = now;

        const factor = 1 - Math.exp(-DAMPING_LAMBDA * dt);
        const dx = mouseX - currX;
        const dy = mouseY - currY;

        currX += dx * factor;
        currY += dy * factor;

        cursorEl.style.transform = `translate3d(${currX.toFixed(2)}px, ${currY.toFixed(2)}px, 0)`;

        if (Math.hypot(dx, dy) > 0.08) {
            rafId = requestAnimationFrame(renderLoop);
        } else {
            currX = mouseX;
            currY = mouseY;
            cursorEl.style.transform = `translate3d(${currX.toFixed(2)}px, ${currY.toFixed(2)}px, 0)`;
            isIdle = true;
            rafId = null;
        }
    }

    function onPointerMove(e) {
        if (!checkActiveState()) return;

        mouseX = e.clientX;
        mouseY = e.clientY;

        if (!isInitialized) {
            currX = mouseX;
            currY = mouseY;
            cursorEl.style.transform = `translate3d(${currX.toFixed(2)}px, ${currY.toFixed(2)}px, 0)`;
            document.documentElement.classList.add("has-custom-cursor");
            isInitialized = true;
        }

        if (!isVisible) {
            cursorEl.classList.remove("is-hidden");
            cursorEl.classList.add("is-visible");
            isVisible = true;
        }

        if (isIdle) {
            isIdle = false;
            lastTime = performance.now();
            rafId = requestAnimationFrame(renderLoop);
        }
    }

    function onPointerOver(e) {
        if (!checkActiveState()) return;
        const target = e.target.closest(INTERACTIVE_SELECTOR);
        if (target) {
            cursorEl.classList.add("is-hovering");
            const label = getCursorLabel(target);
            if (label) {
                cursorLabelEl.textContent = label;
                cursorEl.classList.add("has-label");
            } else {
                cursorLabelEl.textContent = "";
                cursorEl.classList.remove("has-label");
            }
        }
    }

    function onPointerOut(e) {
        if (!checkActiveState()) return;
        const related = e.relatedTarget ? e.relatedTarget.closest(INTERACTIVE_SELECTOR) : null;
        if (!related) {
            cursorEl.classList.remove("is-hovering", "has-label");
            cursorLabelEl.textContent = "";
        } else {
            const label = getCursorLabel(related);
            if (label) {
                cursorLabelEl.textContent = label;
                cursorEl.classList.add("has-label");
            } else {
                cursorLabelEl.textContent = "";
                cursorEl.classList.remove("has-label");
            }
        }
    }

    function onPointerDown() {
        if (!checkActiveState()) return;
        cursorEl.classList.add("is-clicking");
    }

    function onPointerUp() {
        if (!checkActiveState()) return;
        cursorEl.classList.remove("is-clicking");
    }

    function onMouseLeave() {
        cursorEl.classList.remove("is-visible");
        cursorEl.classList.add("is-hidden");
        isVisible = false;
    }

    function onMouseEnter() {
        if (!checkActiveState()) return;
        cursorEl.classList.remove("is-hidden");
        cursorEl.classList.add("is-visible");
        isVisible = true;
    }

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("pointerover", onPointerOver, { passive: true });
    document.addEventListener("pointerout", onPointerOut, { passive: true });
    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    window.addEventListener("pointerup", onPointerUp, { passive: true });
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mouseenter", onMouseEnter);
    window.addEventListener("blur", onMouseLeave);
    window.addEventListener("focus", onMouseEnter);

    finePointer.addEventListener("change", updateActiveState);
    reducedMotion.addEventListener("change", updateActiveState);

    updateActiveState();
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initSmoothTrailingCursor);
} else {
    initSmoothTrailingCursor();
}


function setupCityDropdownSelector() {
    const input = document.getElementById("city-search-input");
    const results = document.getElementById("city-search-results");
    const clearBtn = document.getElementById("city-search-clear");
    const wrapper = document.getElementById("city-search-wrapper");

    if (!input || !results || !clearBtn || !wrapper) return;

    // Build suggestions from the actual city cards already on the page.
    const cities = Array.from(document.querySelectorAll(".s3-city-card"))
        .map((card) => {
            const cityKey = (card.getAttribute("data-city") || "")
                .toLowerCase()
                .replace(/\s+/g, "");

            const cityName =
                card.querySelector(".s3-city-name")?.textContent.trim() || "";

            const countryMap = {
                tokyo: "Japan",
                paris: "France",
                newyork: "United States",
                istanbul: "Turkey",
                mumbai: "India",
                lisbon: "Portugal",
                seoul: "South Korea",
                cairo: "Egypt"
            };

            return {
                key: cityKey,
                name: cityName,
                country: countryMap[cityKey] || ""
            };
        })
        .filter((city) => city.key && city.name);

    function closeResults() {
        results.hidden = true;
        input.setAttribute("aria-expanded", "false");
    }

    function selectCity(city) {
        input.value = city.name;
        clearBtn.hidden = false;
        closeResults();

        // Reuse the existing carousel navigation and selection behavior.
        scrollCarouselToCity(city.key);
        highlightCityCard(city.key);
    }

    function renderResults(query) {
        results.replaceChildren();

        const normalizedQuery = query.trim().toLowerCase();

        // Never display the complete city list when the search is empty.
        if (!normalizedQuery) {
            closeResults();
            return;
        }

        const matches = cities.filter((city) =>
            city.name.toLowerCase().includes(normalizedQuery) ||
            city.country.toLowerCase().includes(normalizedQuery)
        );

        if (matches.length === 0) {
            const emptyMessage = document.createElement("div");
            emptyMessage.className = "city-search-empty";
            emptyMessage.textContent = "No cities found.";
            results.appendChild(emptyMessage);
        } else {
            matches.forEach((city) => {
                const option = document.createElement("button");
                option.type = "button";
                option.className = "city-search-result";
                option.setAttribute("role", "option");

                const name = document.createElement("span");
                name.className = "city-search-result-name";
                name.textContent = city.name;

                const country = document.createElement("span");
                country.className = "city-search-result-country";
                country.textContent = city.country;

                option.append(name, country);

                option.addEventListener("click", () => {
                    selectCity(city);
                });

                results.appendChild(option);
            });
        }

        results.hidden = false;
        input.setAttribute("aria-expanded", "true");
    }

    input.addEventListener("input", () => {
        clearBtn.hidden = input.value.length === 0;
        renderResults(input.value);
    });

    input.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeResults();
            return;
        }

        if (event.key === "Enter" && !results.hidden) {
            event.preventDefault();

            const firstResult = results.querySelector(".city-search-result");
            if (firstResult) firstResult.click();
        }

        if (event.key === "ArrowDown" && !results.hidden) {
            event.preventDefault();
            results.querySelector(".city-search-result")?.focus();
        }
    });

    clearBtn.addEventListener("click", () => {
        input.value = "";
        clearBtn.hidden = true;
        closeResults();
        input.focus();
    });

    document.addEventListener("click", (event) => {
        if (!wrapper.contains(event.target)) {
            closeResults();
        }
    });
}