/* NuevoBridges — hero entrance, parallax, header state */
(function () {
  var hero = document.getElementById("hero-enter");
  var media = document.querySelector("[data-hero-parallax]");
  var header = document.querySelector("[data-site-header]");
  var heroSec = document.querySelector("[data-hero]");
  var started = false;

  var reduce =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function startEntrance() {
    if (!hero || reduce || started) return;
    started = true;
    hero.classList.add("is-ready");
  }

  if (hero) {
    if (document.getElementById("site-loader") && !reduce) {
      // Wait for nb:ready so rise starts with overlay fade-out (intro + nav).
      document.addEventListener("nb:ready", startEntrance, { once: true });
      setTimeout(function () {
        if (!started) startEntrance();
      }, 2500);
    } else {
      requestAnimationFrame(function () {
        requestAnimationFrame(startEntrance);
      });
    }
  }

  function updateHeader() {
    if (!header || !heroSec) return;
    var bottom = heroSec.getBoundingClientRect().bottom;
    var over = bottom > header.offsetHeight + 8;
    header.classList.toggle("is-over-hero", over);
    header.classList.toggle("is-solid", !over);
  }

  window.addEventListener("scroll", updateHeader, { passive: true });
  window.addEventListener("resize", updateHeader);
  updateHeader();

  if (reduce || !media) return;

  var mq = window.matchMedia("(min-width: 961px)");
  function onScroll() {
    if (!mq.matches) {
      media.style.transform = "";
      return;
    }
    var y = window.scrollY || 0;
    if (y > window.innerHeight * 1.2) return;
    media.style.transform = "translate3d(0," + Math.round(y * 0.22) + "px,0)";
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
})();
