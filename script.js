(() => {
  "use strict";
  const c = window.WEDDING_CONFIG || {};
  const $ = (selector) => document.querySelector(selector);
  const set = (selector, value) => document.querySelectorAll(selector).forEach(el => { el.textContent = value ?? ""; });

  set("[data-groom]", c.groom || "Amartya");
  set("[data-bride]", c.bride || "Sangeeta");
  set("[data-groom-full]", c.groomFull || c.groom || "GROOM");
  set("[data-bride-full]", c.brideFull || c.bride || "BRIDE");
  set("[data-groom-parents]", c.groomParents || "");
  set("[data-bride-parents]", c.brideParents || "");
  set("[data-date-long]", c.dateLong || "2 December 2026");
  set("[data-date-ribbon]", c.dateRibbon || "2 DECEMBER 2026");
  set("[data-venue]", c.venue || "Venue details to follow");
  set("[data-address]", c.address || "Venue details to follow");
  set("[data-time]", c.time || "Time to be confirmed");
  (c.events || []).forEach((event, index) => {
    const n = index + 1;
    set(`[data-event${n}-date]`, event.date);
    set(`[data-event${n}-venue]`, event.venue);
    set(`[data-event${n}-title]`, event.title);
  });
  const mapLink = $("#mapLink");
  if (mapLink) mapLink.href = c.mapUrl || "#";

  // Tap anywhere on the temple entrance. Reveal the next section underneath
  // before fading the entrance away, preventing a black/blank frame.
  const gate = $("#gate");
  const main = $("#invitation");
  let entranceStarted = false;
  const openEntrance = () => {
    if (entranceStarted) return;
    entranceStarted = true;
    gate.classList.add("opening");
    window.setTimeout(() => {
      main.classList.add("visible");
      main.setAttribute("aria-hidden", "false");
      document.body.classList.add("unlocked");
    }, 520);
    window.setTimeout(() => {
      gate.classList.add("gone");
      const audio = $("#bgMusic");
      const musicButton = $("#musicToggle");
      musicButton.hidden = false;
      if (audio) audio.play().then(() => musicButton.classList.add("playing")).catch(() => {});
    }, 1650);
  };
  gate.addEventListener("click", openEntrance);
  gate.addEventListener("keydown", event => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openEntrance();
    }
  });
  gate.setAttribute("role", "button");
  gate.setAttribute("tabindex", "0");
  gate.setAttribute("aria-label", "Tap anywhere to open the wedding invitation");

  // Music is optional and visitor-controlled.
  $("#musicToggle").addEventListener("click", () => {
    const audio = $("#bgMusic");
    const button = $("#musicToggle");
    if (audio.paused) audio.play().then(() => button.classList.add("playing")).catch(() => {});
    else { audio.pause(); button.classList.remove("playing"); }
  });

  // Countdown to the wedding day. Midnight is used because the muhurta is not confirmed yet.
  const target = new Date(c.weddingDate || "2026-12-02T00:00:00");
  const countdown = $("#countdown");
  function tick() {
    const ms = Math.max(0, target.getTime() - Date.now());
    const values = [
      [Math.floor(ms / 86400000), "DAYS"],
      [Math.floor(ms / 3600000) % 24, "HOURS"],
      [Math.floor(ms / 60000) % 60, "MINUTES"],
      [Math.floor(ms / 1000) % 60, "SECONDS"]
    ];
    countdown.innerHTML = values.map(([number, label]) =>
      `<div><strong>${String(number).padStart(2, "0")}</strong><small>${label}</small></div>`
    ).join("");
  }
  tick();
  window.setInterval(tick, 1000);

  // Scratch-to-reveal keepsake, with pointer support for phones and desktops.
  const canvas = $("#scratchCanvas");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    let drawing = false, cleared = false;
    function setupScratch() {
      const rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = "#b9a17a";
      ctx.fillRect(0, 0, rect.width, rect.height);
      ctx.fillStyle = "#fff0c9";
      ctx.font = "600 17px 'Cormorant Garamond', serif";
      ctx.textAlign = "center";
      ctx.fillText("SCRATCH HERE ✧", rect.width / 2, rect.height / 2);
      ctx.globalCompositeOperation = "destination-out";
    }
    function scratch(event) {
      if (!drawing || cleared) return;
      const rect = canvas.getBoundingClientRect();
      const point = event.touches ? event.touches[0] : event;
      ctx.beginPath();
      ctx.arc(point.clientX - rect.left, point.clientY - rect.top, 24, 0, Math.PI * 2);
      ctx.fill();
    }
    function start(event) { drawing = true; scratch(event); }
    function end() {
      if (!drawing || cleared) return;
      drawing = false;
      const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      let transparent = 0;
      for (let i = 3; i < data.length; i += 32) if (data[i] === 0) transparent++;
      if (transparent > data.length / 32 * 0.38) {
        cleared = true;
        canvas.classList.add("cleared");
      }
    }
    canvas.addEventListener("pointerdown", start);
    canvas.addEventListener("pointermove", scratch);
    window.addEventListener("pointerup", end);
    window.addEventListener("pointercancel", end);
    setupScratch();
    window.addEventListener("resize", () => { if (!cleared) setupScratch(); });
  }

  // Scroll reveals: content remains in the document for accessibility and SEO.
  const revealItems = document.querySelectorAll(".reveal, .event-card");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -35px 0px" });
    revealItems.forEach(item => observer.observe(item));
  } else revealItems.forEach(item => item.classList.add("in-view"));

  // Thin progress indicator helps guests understand the long invitation.
  const progress = $("#scrollProgress");
  const updateProgress = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const amount = max > 0 ? (window.scrollY / max) * 100 : 0;
    progress.style.width = `${amount}%`;
  };
  window.addEventListener("scroll", updateProgress, { passive: true });
  updateProgress();

  // Share button uses the device share sheet where supported; clipboard is the fallback.
  $("#shareInvite").addEventListener("click", async () => {
    const shareData = {
      title: "Amartya & Sangeeta — Shubha Bibaha",
      text: "With the blessings of Mahaprabhu Jagannath, please join us to celebrate our wedding.",
      url: window.location.href
    };
    try {
      if (navigator.share) await navigator.share(shareData);
      else if (navigator.clipboard) {
        await navigator.clipboard.writeText(window.location.href);
        $("#shareInvite").textContent = "INVITATION LINK COPIED";
      } else {
        window.prompt("Copy your wedding invitation link:", window.location.href);
      }
    } catch (error) {
      if (error.name !== "AbortError") console.warn("Sharing was not completed.", error);
    }
  });

  // Decorative falling motifs; limited count for performance.
  const petals = $(".petal-layer");
  if (petals) {
    for (let i = 0; i < 16; i++) {
      const petal = document.createElement("i");
      petal.textContent = ["✿", "❀", "✥"][i % 3];
      petal.style.left = `${Math.random() * 100}%`;
      petal.style.animationDelay = `${Math.random() * 18}s`;
      petal.style.animationDuration = `${18 + Math.random() * 12}s`;
      petals.appendChild(petal);
    }
  }
})();
