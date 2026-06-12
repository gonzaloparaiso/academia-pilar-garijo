/* ============================================================
   PILAR GARIJO — Home
   Traduce el CONTENIDO de la home al recibir `pg:langchange`
   (el menú, el modal y el idioma los gobierna assets/site-header.js).
   ============================================================ */
(function () {
  "use strict";

  /* ---------- i18n del contenido ---------- */
  var EN = {
    "hero.eyebrow": "Chiromassage in Madrid · Since 1994",
    "hero.h1a": "Taking care of you",
    "hero.h1b": "since 1994",
    "hero.lead": "At Pilar Garijo Chiromassage Centres we offer the highest quality solutions for your wellbeing needs.",
    "hero.cta1": "Book on WhatsApp",
    "hero.cta2": "See our centres",
    "hero.stat1": "people treated with our method",
    "hero.stat2": "years average team experience",
    "hero.stat3": "centres in Madrid, always close to you",
    "hero.badge.t": "Our own method",
    "hero.badge.s": "Manual therapies of proven success",
    "centros.eyebrow": "Where we are",
    "centros.h2a": "Three centres in",
    "centros.sub": "The same method and the same care at each of our centres. Choose the one that suits you best.",
    "area.vallecas": "Peña Ambote",
    "area.lopez": "El Viso",
    "area.estrella": "Retiro · Estrella metro",
    "since.1994": "Since 1994",
    "since.2016": "Since 2016",
    "tag.new": "Now open",
    "link.map": "Directions",
    "link.call": "Call",
    "reserva.btn": "Book now",
    "metodo.eyebrow": "The Pilar Garijo method",
    "metodo.h2a": "Manual therapies with",
    "metodo.h2b": "our own method",
    "metodo.f1": "<b>Expert team.</b> Therapists with an average of more than a decade of experience.",
    "metodo.f2": "<b>Our own method.</b> Manual therapy techniques of proven success in more than twenty-five thousand people.",
    "metodo.f3": "<b>Quality wellbeing.</b> Solutions for your wellbeing needs since 1994.",
    "metodo.quote": "\"At our Centres, my team and I put all our care and this method at your disposal. Let us help you.\"",
    "cursos.eyebrow": "Training",
    "cursos.h2": "Our courses",
    "cursos.p": "Discover our training offer.",
    "cursos.btn": "See the courses",
    "cta.eyebrow": "Shall we begin?",
    "cta.h2a": "Your appointment is",
    "cta.h2b": "one message away",
    "cta.p": "Message us on WhatsApp and pick the centre that suits you best. We'll reply to give you an appointment as soon as possible.",
    "cta.button": "Book on WhatsApp",
    "footer.blurb": "The highest quality solutions for your wellbeing needs. In Madrid since 1994.",
    "footer.centros": "Centres",
    "footer.nuevo": "new",
    "footer.enlaces": "Links",
    "footer.equipo": "Meet the team",
    "nav.cursos": "Our courses",
    "nav.privada": "Private area",
    "footer.trabaja": "Work with us",
    "footer.contacto": "Contact",
    "footer.rights": "All rights reserved © Pilar Garijo & Linares Gestión de Masajes S.L.",
    "footer.legal": "Legal notice · Privacy · Cookies"
  };

  var esCache = null;
  function cacheES() {
    if (esCache) return;
    esCache = new Map();
    document.querySelectorAll("[data-i18n]").forEach(function (el) { esCache.set(el, el.innerHTML); });
  }
  function translate(lang) {
    cacheES();
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      if (lang === "en" && EN[key] != null) el.innerHTML = EN[key];
      else el.innerHTML = esCache.get(el);
    });
  }
  cacheES();
  document.addEventListener("pg:langchange", function (e) { translate(e.detail.lang); });

  /* ---------- Reveal on scroll ---------- */
  if (!window.matchMedia || !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    document.querySelectorAll(".reveal").forEach(function (el) { io.observe(el); });
  } else {
    document.querySelectorAll(".reveal").forEach(function (el) { el.classList.add("in"); });
  }
})();
