/* NuevoBridges — quiet branded loader.
   Intro (once per tab): ceremonial fade + wordmark, then mark nb-intro-done.
   In-site nav: simple opacity fade in/out with destination hero grade (no wordmark).
   Prefetch during fade-in; fire nb:ready when fade-out starts so hero rise syncs.
   Skipped under reduced motion and mobile iframe embed. */
(function () {
  var FLAG = "nb-loader-nav";
  var INTRO_DONE = "nb-intro-done";
  var INTRO_FADE_MS = 700;
  var INTRO_HOLD_MS = 500;
  var NAV_FADE_MS = 600;
  var GRADE_CLASSES = [
    "grade-hero",
    "grade-corridor",
    "grade-farm",
    "grade-detention",
    "grade-highway",
    "grade-portrait",
  ];

  var loader = document.getElementById("site-loader");
  var embed =
    new URLSearchParams(window.location.search).get("vp") === "mobile";
  var reduce =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var activeOutMs = INTRO_FADE_MS;
  var navArrive = false;

  /** Mobile / touch / Mobile iframe: first tap expands PA parent; desktop click → hub. */
  function expandFirst() {
    if (embed) return true;
    return (
      window.matchMedia &&
      window.matchMedia("(hover: none), (pointer: coarse)").matches
    );
  }

  function fireReady() {
    document.dispatchEvent(
      new CustomEvent("nb:ready", { detail: { fromNav: navArrive } })
    );
  }

  function clearCover() {
    document.documentElement.classList.remove("nb-covered");
    document.documentElement.classList.remove("nb-nav-cover");
    document.documentElement.classList.remove("nb-nav-arrive");
    document.documentElement.style.background = "";
  }

  function removeLoader() {
    if (loader && loader.parentNode) loader.parentNode.removeChild(loader);
    loader = null;
  }

  function finishOut() {
    if (!loader) {
      clearCover();
      fireReady();
      return;
    }
    // Reveal page under overlay, start fade-out, fire nb:ready so hero rise begins same beat.
    clearCover();
    loader.style.opacity = "";
    loader.style.transform = "";
    loader.style.clipPath = "";
    loader.classList.remove("is-intro");
    loader.classList.add("is-done");
    loader.classList.remove("is-in");
    fireReady();
    setTimeout(removeLoader, activeOutMs + 50);
  }

  function gradeForPath(pathname) {
    var p = (pathname || "").replace(/\/+$/, "") || "/";
    var parts = p.split("/").filter(Boolean);
    var last = (parts.pop() || "").replace(/\.html?$/i, "");
    if (last === "index" || last === "") last = parts.pop() || "";
    if (last === "about") return "grade-portrait";
    if (last === "h2a-visas") return "grade-farm";
    if (last === "ice-detention-habeas") return "grade-detention";
    if (last === "truck-accidents") return "grade-highway";
    if (last === "contact" || last === "reviews" || last === "faq" ||
        last === "practice-areas") return "grade-corridor";
    return "grade-hero";
  }
  function applyGrade(el, grade) {
    if (!el) return;
    GRADE_CLASSES.forEach(function (c) {
      el.classList.remove(c);
    });
    if (grade) el.classList.add(grade);
  }

  function hideMark(el) {
    var mark = el && el.querySelector(".site-loader__mark");
    if (!mark) return;
    mark.style.animation = "none";
    mark.style.opacity = "0";
    mark.setAttribute("aria-hidden", "true");
  }

  /** Opacity fade in (destination grade). */
  function fadeIn(el, grade) {
    el.classList.remove("is-done");
    el.classList.remove("is-in");
    el.classList.remove("is-intro");
    el.classList.add("is-nav");
    applyGrade(el, grade);
    hideMark(el);
    el.style.transition = "none";
    el.style.opacity = "0";
    el.style.transform = "";
    el.style.clipPath = "";
    void el.offsetWidth;
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        el.style.transition = "";
        el.style.opacity = "";
        el.classList.add("is-in");
      });
    });
  }

  /** Prefetch destination while fade-in plays so navigate is snappy. */
  function warmDestination(href) {
    if (window.location.protocol === "file:") return Promise.resolve();
    try {
      var link = document.createElement("link");
      link.rel = "prefetch";
      link.as = "document";
      link.href = href;
      document.head.appendChild(link);
    } catch (err) {}
    return fetch(href, {
      credentials: "same-origin",
      mode: "same-origin",
    })
      .then(function (res) {
        if (!res.ok) return;
        return res.text();
      })
      .catch(function () {});
  }

  function markIntroDone() {
    try {
      sessionStorage.setItem(INTRO_DONE, "1");
    } catch (e) {}
  }

  /* —— Skip cases —— */
  if (!loader || embed || reduce) {
    if (loader) removeLoader();
    clearCover();
    fireReady();
    return;
  }

  /* —— Entry —— */
  var fromNav = false;
  var introDone = false;
  try {
    fromNav = sessionStorage.getItem(FLAG) === "1";
    if (fromNav) sessionStorage.removeItem(FLAG);
    introDone = sessionStorage.getItem(INTRO_DONE) === "1";
  } catch (e) {}

  if (fromNav) {
    // Arriving covered: fade overlay out; hero rise starts via nb:ready on same beat.
    navArrive = true;
    activeOutMs = NAV_FADE_MS;
    var arrivalGrade =
      document.documentElement.getAttribute("data-hero-grade") ||
      gradeForPath(window.location.pathname);
    loader.classList.add("is-nav");
    applyGrade(loader, arrivalGrade);
    hideMark(loader);
    loader.classList.add("is-in");
    loader.style.opacity = "1";
    markIntroDone();
    finishOut();
  } else if (!introDone) {
    // First document in this tab: ceremonial intro. Stay covered until finishOut.
    activeOutMs = INTRO_FADE_MS;
    markIntroDone();
    loader.classList.add("is-intro");
    loader.classList.add("is-in");
    loader.style.opacity = "1";
    setTimeout(finishOut, INTRO_FADE_MS + INTRO_HOLD_MS);
  } else {
    // Hard refresh after intro already played — no overlay.
    removeLoader();
    clearCover();
    fireReady();
  }

  /* —— Exit intercept (same-origin /website/ HTML links) —— */
  document.addEventListener(
    "click",
    function (e) {
      if (e.defaultPrevented) return;
      if (e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      var a = e.target.closest && e.target.closest("a");
      if (!a) return;
      if (a.hasAttribute("download")) return;
      if (a.getAttribute("target") === "_blank") return;
      if (a.closest("[data-vp-chrome]")) return;

      var href = a.getAttribute("href");
      if (!href || href.charAt(0) === "#") return;
      if (/^(tel|mailto|javascript):/i.test(href)) return;

      var url;
      try {
        url = new URL(href, window.location.href);
      } catch (err) {
        return;
      }
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname && url.hash) return;
      var path = url.pathname;
      var isHtml = /\.html?$/i.test(path);
      var isPretty =
        path === "/" ||
        /^\/(about|contact|reviews|faq)\/?$/i.test(path) ||
        /^\/practice-areas\/?$/i.test(path) ||
        /^\/practice-areas\/(h2a-visas|ice-detention-habeas|truck-accidents)\/?$/i.test(
          path
        );
      if (!isHtml && !isPretty) return;
      // Expand-first: let drawer own the first tap on a closed Practice areas parent
      if (expandFirst() && a.hasAttribute("data-drawer-parent")) {
        var group = a.closest("[data-drawer-group]");
        if (group && !group.classList.contains("is-open")) return;
      }

      e.preventDefault();

      try {
        sessionStorage.setItem(FLAG, "1");
      } catch (err2) {}

      var destGrade = gradeForPath(url.pathname);
      var exit = document.getElementById("site-loader");
      if (!exit) {
        exit = document.createElement("div");
        exit.className = "site-loader";
        exit.id = "site-loader";
        exit.setAttribute("aria-hidden", "true");
        exit.innerHTML =
          '<div class="site-loader__mark">NuevoBridges Law</div>';
        document.body.appendChild(exit);
      }
      exit.classList.remove("is-intro");
      fadeIn(exit, destGrade);

      var warmed = warmDestination(url.href);
      var fadeDone = new Promise(function (resolve) {
        setTimeout(resolve, NAV_FADE_MS);
      });
      var warmCap = new Promise(function (resolve) {
        setTimeout(resolve, NAV_FADE_MS + 300);
      });

      Promise.all([fadeDone, Promise.race([warmed, warmCap])]).then(
        function () {
          window.location.href = url.href;
        }
      );
    },
    true
  );
})();
