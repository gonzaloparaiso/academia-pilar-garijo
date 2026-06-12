/* ============================================================
   Pilar Garijo — Header compartido (un solo menú para todo el sitio)
   Inyecta cabecera + drawer móvil + modal de WhatsApp + botón flotante,
   y gestiona: navegación, idioma ES/EN, enlaces de WhatsApp y scroll.

   El idioma se difunde con el evento `pg:langchange` (detail.lang):
   cada página escucha ese evento y traduce SU propio contenido.
   API: window.PG = { getLang(), setLang('es'|'en') }.
   ============================================================ */
(function () {
  "use strict";

  /* ---------- WhatsApp ---------- */
  var WA = { vallecas: "34919532133", lopezdehoyos: "34919532134", estrella: "34919532135" };
  var WA_NAME = { vallecas: "Vallecas (Peña Ambote)", lopezdehoyos: "López de Hoyos", estrella: "Estrella" };

  function waMessage(key, lang) {
    var name = WA_NAME[key] || "";
    var txt = lang === "en"
      ? "Hi! I'd like to book an appointment at your " + name + " centre."
      : "¡Hola! Me gustaría reservar una cita en el centro de " + name + ".";
    return encodeURIComponent(txt);
  }
  function refreshWaLinks() {
    var lang = getLang();
    document.querySelectorAll("[data-wa]").forEach(function (el) {
      var key = el.getAttribute("data-wa");
      if (!WA[key]) return;
      el.setAttribute("href", "https://wa.me/" + WA[key] + "?text=" + waMessage(key, lang));
      el.setAttribute("target", "_blank");
      el.setAttribute("rel", "noopener");
    });
  }

  /* ---------- Textos del propio header ---------- */
  var T = {
    es: { centros: "Centros", metodo: "El método", cursos: "Nuestros cursos", privada: "Área privada",
          reservar: "Reservar cita", modalTitle: "Reserva por WhatsApp",
          modalSub: "Elige el centro con el que quieres hablar", nuevo: "· NUEVO" },
    en: { centros: "Centres", metodo: "The method", cursos: "Our courses", privada: "Private area",
          reservar: "Book now", modalTitle: "Book on WhatsApp",
          modalSub: "Choose the centre you'd like to talk to", nuevo: "· NEW" }
  };

  /* ---------- SVGs ---------- */
  var WA_PATH = "M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2zm5.8 14.04c-.25.69-1.45 1.32-2 1.4-.51.08-1.16.11-1.87-.12-.43-.14-.98-.32-1.69-.62-2.97-1.28-4.91-4.27-5.06-4.47-.15-.2-1.21-1.61-1.21-3.07s.77-2.18 1.04-2.48c.27-.3.59-.37.79-.37.2 0 .39 0 .57.01.18.01.43-.07.67.51.25.6.84 2.06.91 2.21.07.15.12.32.02.52-.1.2-.15.32-.3.49-.15.17-.31.39-.45.52-.15.15-.3.31-.13.6.17.3.76 1.25 1.63 2.02 1.12.99 2.06 1.3 2.36 1.45.3.15.47.12.65-.07.18-.2.74-.86.94-1.16.2-.3.4-.25.67-.15.27.1 1.72.81 2.02.96.3.15.5.22.57.35.07.12.07.72-.18 1.41z";
  function waGlyph(cls) { return '<svg class="' + cls + '" viewBox="0 0 24 24" fill="#fff" aria-hidden="true"><path d="' + WA_PATH + '"/></svg>'; }
  var ARROW = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';

  /* ---------- Markup (un único origen para todas las páginas) ---------- */
  var headerHTML =
    '<header class="pg-header" id="pg-header"><div class="pg-nav">' +
      '<a href="index.html" class="pg-logo" aria-label="Pilar Garijo · inicio"><img src="assets/logo.png" alt="Pilar Garijo"></a>' +
      '<nav class="pg-links">' +
        '<a href="index.html#centros" data-h="centros">Centros</a>' +
        '<a href="index.html#metodo" data-h="metodo">El método</a>' +
        '<a href="Landing Academia Pilar Garijo.html" data-h="cursos">Nuestros cursos</a>' +
      '</nav>' +
      '<div class="pg-lang" role="group" aria-label="Idioma">' +
        '<button type="button" data-lang="es">ES</button>' +
        '<button type="button" data-lang="en">EN</button>' +
      '</div>' +
      '<a class="pg-btn pg-btn--ghost pg-privada" href="Academia Pilar Garijo.html" data-h="privada">Área privada</a>' +
      '<button class="pg-btn pg-btn--wa" type="button" data-open-modal>' + waGlyph("pg-wa") + '<span data-h="reservar">Reservar cita</span></button>' +
      '<button class="pg-burger" type="button" aria-label="Menú" data-open-drawer><svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round"><path d="M3 6h18M3 12h18M3 18h18"/></svg></button>' +
    '</div></header>';

  var drawerHTML =
    '<div class="pg-drawer" id="pg-drawer">' +
      '<button class="pg-drawer-close" type="button" aria-label="Cerrar" data-close-drawer><svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg></button>' +
      '<a href="index.html#centros" data-close-drawer data-h="centros">Centros</a>' +
      '<a href="index.html#metodo" data-close-drawer data-h="metodo">El método</a>' +
      '<a href="Landing Academia Pilar Garijo.html" data-close-drawer data-h="cursos">Nuestros cursos</a>' +
      '<a href="Academia Pilar Garijo.html" data-close-drawer data-h="privada">Área privada</a>' +
      '<button class="pg-btn pg-btn--wa" type="button" data-open-modal data-close-drawer>' + waGlyph("pg-wa") + '<span data-h="reservar">Reservar cita</span></button>' +
    '</div>';

  function modalRow(key, ic, city, addr, isNew) {
    return '<a data-wa="' + key + '" href="#"><span class="pg-ic">' + ic + '</span>' +
      '<span class="pg-meta"><span class="pg-c">' + city +
      (isNew ? ' <span class="pg-new" style="color:#9A7B3C;font-size:11px;font-weight:800" data-h="nuevo">· NUEVO</span>' : '') +
      '</span><span class="pg-a">' + addr + '</span></span><span class="pg-go">' + ARROW + '</span></a>';
  }
  var modalHTML =
    '<div class="pg-modal-backdrop" id="pg-wa-modal"><div class="pg-modal" role="dialog" aria-modal="true" aria-labelledby="pg-wa-title">' +
      '<div class="pg-modal-head"><div class="pg-wa-ico">' + waGlyph("") + '</div>' +
        '<div><h3 id="pg-wa-title" data-h="modalTitle">Reserva por WhatsApp</h3><p data-h="modalSub">Elige el centro con el que quieres hablar</p></div>' +
        '<button class="pg-close" type="button" aria-label="Cerrar" data-close-modal><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg></button>' +
      '</div><div class="pg-modal-list">' +
        modalRow("vallecas", "V", "Vallecas", "Peña Ambote 22 · 28031 Madrid", false) +
        modalRow("lopezdehoyos", "L", "López de Hoyos", "López de Hoyos 27 · 28006 Madrid", false) +
        modalRow("estrella", "E", "Estrella", "Sirio 20 · Retiro · 28007 Madrid", true) +
      '</div></div></div>';

  var fabHTML = '<button class="pg-fab" type="button" data-open-modal aria-label="Reservar por WhatsApp">' + waGlyph("") + '</button>';

  /* ---------- Inyección ---------- */
  document.body.insertAdjacentHTML("afterbegin", headerHTML);
  document.body.insertAdjacentHTML("beforeend", drawerHTML + modalHTML + fabHTML);

  var header = document.getElementById("pg-header");
  var drawer = document.getElementById("pg-drawer");
  var modal = document.getElementById("pg-wa-modal");

  /* ---------- Idioma ---------- */
  function getLang() { return document.documentElement.getAttribute("lang") === "en" ? "en" : "es"; }
  function applyHeaderText(lang) {
    var dict = T[lang] || T.es;
    document.querySelectorAll("[data-h]").forEach(function (el) {
      var k = el.getAttribute("data-h");
      if (dict[k] != null) el.textContent = dict[k];
    });
  }
  function setLang(lang) {
    lang = lang === "en" ? "en" : "es";
    document.documentElement.setAttribute("lang", lang);
    applyHeaderText(lang);
    document.querySelectorAll(".pg-lang button").forEach(function (b) {
      b.classList.toggle("on", b.getAttribute("data-lang") === lang);
    });
    refreshWaLinks();
    try { localStorage.setItem("pg_lang", lang); } catch (e) {}
    document.dispatchEvent(new CustomEvent("pg:langchange", { detail: { lang: lang } }));
  }

  /* ---------- Modal / Drawer ---------- */
  function openModal() { modal.classList.add("pg-open"); document.body.style.overflow = "hidden"; }
  function closeModal() { modal.classList.remove("pg-open"); document.body.style.overflow = ""; }
  function openDrawer() { drawer.classList.add("pg-open"); document.body.style.overflow = "hidden"; }
  function closeDrawer() { drawer.classList.remove("pg-open"); document.body.style.overflow = ""; }

  document.addEventListener("click", function (e) {
    var t = e.target.closest("[data-open-modal],[data-close-modal],[data-open-drawer],[data-close-drawer],[data-lang]");
    if (!t) { if (e.target === modal) closeModal(); return; }
    if (t.hasAttribute("data-open-modal")) { e.preventDefault(); openModal(); }
    if (t.hasAttribute("data-close-modal")) { closeModal(); }
    if (t.hasAttribute("data-open-drawer")) { openDrawer(); }
    if (t.hasAttribute("data-close-drawer")) { closeDrawer(); }
    if (t.hasAttribute("data-lang")) { setLang(t.getAttribute("data-lang")); }
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") { closeModal(); closeDrawer(); }
  });

  /* ---------- Scroll state ---------- */
  var onScroll = function () { header.classList.toggle("pg-scrolled", window.scrollY > 12); };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- API + init ---------- */
  window.PG = { getLang: getLang, setLang: setLang };
  var saved = "es";
  try { saved = localStorage.getItem("pg_lang") || "es"; } catch (e) {}
  setLang(saved);
})();
