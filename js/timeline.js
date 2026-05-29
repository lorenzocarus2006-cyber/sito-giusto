/* =====================================================
   KREA GLOBAL CONTRACT — Fullscreen Horizontal Timeline
   Timeline animation controller using GSAP + ScrollTrigger
===================================================== */

document.addEventListener("DOMContentLoaded", () => {
  // Register ScrollTrigger
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
    console.error("GSAP or ScrollTrigger not loaded. Skipping timeline initialization.");
    return;
  }
  
  gsap.registerPlugin(ScrollTrigger);

  const sticky = document.querySelector(".timeline-sticky");
  const navBar = document.querySelector(".timeline-nav-bar");
  const scrollContainer = document.querySelector(".timeline-scroll-container");
  
  if (!sticky || !navBar || !scrollContainer) return;

  // Create a paused timeline that we manually scrub using horizontal scroll progress
  const tl = gsap.timeline({
    paused: true
  });

  // Set initial states
  gsap.set(".timeline-bg:not(.timeline-bg--0)", { opacity: 0 });
  gsap.set(".panel-story", { opacity: 0 });
  gsap.set(".panel-story .story-content", { opacity: 0, y: 50 });
  gsap.set("#timelineActiveDot", { scale: 0, left: "0%" });
  gsap.set("#timelineProgressLine", { width: "0%" });
  gsap.set(".peek-text--1999", { opacity: 0.75 });

  // 1. STATE 0 -> STATE 1 (Scroll range: 0 to 1)
  tl.to(".panel-intro", { opacity: 0, y: -30, pointerEvents: "none", duration: 0.4 }, 0)
    .to(".timeline-bg--0", { opacity: 0, duration: 0.4 }, 0)
    .to(".timeline-bg--1", { opacity: 1, duration: 0.4 }, 0.2)
    // Scale active dot up at 1999 position
    .to("#timelineActiveDot", { scale: 1, left: "0%", duration: 0.3 }, 0.4)
    // Show State 1 panel
    .to(".panel-story--1", { opacity: 1, pointerEvents: "auto", duration: 0.1 }, 0.4)
    .to(".panel-story--1 .story-content", { opacity: 1, y: 0, duration: 0.4 }, 0.4)
    // Highlight label 1999
    .to("#dotItem1999 .dot-label", { color: "#ffffff", fontWeight: "700", duration: 0.3 }, 0.4)
    // Crossfade peek text
    .to(".peek-text--1999", { opacity: 0, duration: 0.2 }, 0.2)
    .to(".peek-text--2006", { opacity: 0.75, duration: 0.2 }, 0.5);

  // 2. STATE 1 -> STATE 2 (Scroll range: 1 to 2)
  tl.to(".panel-story--1 .story-content", { opacity: 0, y: -30, duration: 0.3 }, 1.0)
    .to(".panel-story--1", { pointerEvents: "none", duration: 0.1 }, 1.3)
    .to(".timeline-bg--1", { opacity: 0, duration: 0.4 }, 1.0)
    .to(".timeline-bg--2", { opacity: 1, duration: 0.4 }, 1.3)
    // Active dot moves to 2006
    .to("#timelineActiveDot", { left: "33.333%", duration: 0.6 }, 1.1)
    .to("#timelineProgressLine", { width: "33.333%", duration: 0.6 }, 1.1)
    // 1999 node becomes past dot
    .to("#dotItem1999 .dot-node", { width: 8, height: 8, backgroundColor: "#4A2C6B", borderColor: "#4A2C6B", duration: 0.3 }, 1.0)
    .to("#dotItem1999 .dot-label", { color: "rgba(255, 255, 255, 0.5)", fontWeight: "600", duration: 0.3 }, 1.0)
    // Show State 2 panel
    .to(".panel-story--2", { opacity: 1, pointerEvents: "auto", duration: 0.1 }, 1.4)
    .to(".panel-story--2 .story-content", { opacity: 1, y: 0, duration: 0.4 }, 1.4)
    // Highlight label 2006
    .to("#dotItem2006 .dot-label", { color: "#ffffff", fontWeight: "700", duration: 0.3 }, 1.4)
    // Crossfade peek text
    .to(".peek-text--2006", { opacity: 0, duration: 0.2 }, 1.1)
    .to(".peek-text--2015", { opacity: 0.75, duration: 0.2 }, 1.4);

  // 3. STATE 2 -> STATE 3 (Scroll range: 2 to 3)
  tl.to(".panel-story--2 .story-content", { opacity: 0, y: -30, duration: 0.3 }, 2.0)
    .to(".panel-story--2", { pointerEvents: "none", duration: 0.1 }, 2.3)
    .to(".timeline-bg--2", { opacity: 0, duration: 0.4 }, 2.0)
    .to(".timeline-bg--3", { opacity: 1, duration: 0.4 }, 2.3)
    // Active dot moves to 2015
    .to("#timelineActiveDot", { left: "66.667%", duration: 0.6 }, 2.1)
    .to("#timelineProgressLine", { width: "66.667%", duration: 0.6 }, 2.1)
    // 2006 node becomes past dot
    .to("#dotItem2006 .dot-node", { width: 8, height: 8, backgroundColor: "#4A2C6B", borderColor: "#4A2C6B", duration: 0.3 }, 2.0)
    .to("#dotItem2006 .dot-label", { color: "rgba(255, 255, 255, 0.5)", fontWeight: "600", duration: 0.3 }, 2.0)
    // Show State 3 panel
    .to(".panel-story--3", { opacity: 1, pointerEvents: "auto", duration: 0.1 }, 2.4)
    .to(".panel-story--3 .story-content", { opacity: 1, y: 0, duration: 0.4 }, 2.4)
    // Highlight label 2015
    .to("#dotItem2015 .dot-label", { color: "#ffffff", fontWeight: "700", duration: 0.3 }, 2.4)
    // Crossfade peek text
    .to(".peek-text--2015", { opacity: 0, duration: 0.2 }, 2.1)
    .to(".peek-text--2026", { opacity: 0.75, duration: 0.2 }, 2.4);

  // 4. STATE 3 -> STATE 4 (Scroll range: 3 to 4)
  tl.to(".panel-story--3 .story-content", { opacity: 0, y: -30, duration: 0.3 }, 3.0)
    .to(".panel-story--3", { pointerEvents: "none", duration: 0.1 }, 3.3)
    .to(".timeline-bg--3", { opacity: 0, duration: 0.4 }, 3.0)
    .to(".timeline-bg--4", { opacity: 1, duration: 0.4 }, 3.3)
    // Active dot moves to 2026
    .to("#timelineActiveDot", { left: "100%", duration: 0.6 }, 3.1)
    .to("#timelineProgressLine", { width: "100%", duration: 0.6 }, 3.1)
    // 2015 node becomes past dot
    .to("#dotItem2015 .dot-node", { width: 8, height: 8, backgroundColor: "#4A2C6B", borderColor: "#4A2C6B", duration: 0.3 }, 3.0)
    .to("#dotItem2015 .dot-label", { color: "rgba(255, 255, 255, 0.5)", fontWeight: "600", duration: 0.3 }, 3.0)
    // Show State 4 panel
    .to(".panel-story--4", { opacity: 1, pointerEvents: "auto", duration: 0.1 }, 3.4)
    .to(".panel-story--4 .story-content", { opacity: 1, y: 0, duration: 0.4 }, 3.4)
    // Highlight label 2026
    .to("#dotItem2026 .dot-label", { color: "#ffffff", fontWeight: "700", duration: 0.3 }, 3.4)
    .to("#peekSliver", { opacity: 0, scale: 0.8, pointerEvents: "none", duration: 0.3 }, 3.0);

  // Horizontal scroll scrubbing logic
  scrollContainer.addEventListener("scroll", () => {
    const maxScroll = scrollContainer.scrollWidth - scrollContainer.clientWidth;
    if (maxScroll <= 0) return;
    const progress = scrollContainer.scrollLeft / maxScroll;

    // Smoothly animate the timeline's progress
    gsap.to(tl, {
      progress: progress,
      duration: 0.45,
      ease: "power2.out",
      overwrite: "auto"
    });

    // Toggle dark mode class on navBar based on horizontal progress
    if (progress > 0.08) {
      navBar.classList.add("dark-mode");
    } else {
      navBar.classList.remove("dark-mode");
    }
  });

  // Click handler to scroll to specific stages horizontally
  const dotItems = document.querySelectorAll(".timeline-dot-item");
  dotItems.forEach(item => {
    item.addEventListener("click", () => {
      const targetState = parseInt(item.getAttribute("data-state"), 10);
      
      let targetProgress = 0;
      if (targetState === 1) targetProgress = 0.25;
      else if (targetState === 2) targetProgress = 0.50;
      else if (targetState === 3) targetProgress = 0.75;
      else if (targetState === 4) targetProgress = 1.0;
      
      const maxScroll = scrollContainer.scrollWidth - scrollContainer.clientWidth;
      scrollContainer.scrollTo({
        left: maxScroll * targetProgress,
        behavior: "smooth"
      });
    });
  });
});
