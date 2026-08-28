/* NuevoBridges — fine-pointer Federal Navy cursor glow.
   Soft, blurry orb. Off on touch, mobile iframe embed, and prefers-reduced-motion. */
(function () {
  var embed =
    new URLSearchParams(window.location.search).get("vp") === "mobile";
  var reduce =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fine =
    window.matchMedia &&
    window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  if (embed || reduce || !fine) return;

  var HALF = 150; /* matches 300px orb in site.css */

  var orb = document.createElement("div");
  orb.className = "cursor-glow";
  orb.setAttribute("aria-hidden", "true");
  document.body.appendChild(orb);

  var x = 0;
  var y = 0;
  var raf = 0;

  function paint() {
    raf = 0;
    orb.style.transform =
      "translate3d(" + (x - HALF) + "px," + (y - HALF) + "px,0)";
  }

  window.addEventListener(
    "pointermove",
    function (e) {
      x = e.clientX;
      y = e.clientY;
      if (!orb.classList.contains("is-on")) orb.classList.add("is-on");
      if (!raf) raf = requestAnimationFrame(paint);
    },
    { passive: true }
  );

  window.addEventListener(
    "pointerleave",
    function () {
      orb.classList.remove("is-on");
    },
    { passive: true }
  );
})();
