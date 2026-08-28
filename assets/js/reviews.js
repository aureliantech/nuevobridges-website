/* NuevoBridges — reviews carousel: fixed height, infinite slide, autoplay */
(function () {
  var AUTOPLAY_MS = 3000;
  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.querySelectorAll("[data-reviews]").forEach(initCarousel);

  function initCarousel(root) {
    var originals = Array.prototype.slice.call(root.querySelectorAll(".review-slide"));
    if (!originals.length) return;

    var dots = Array.prototype.slice.call(root.querySelectorAll("[data-review-dot]"));
    var prevBtn = root.querySelector("[data-review-prev]");
    var nextBtn = root.querySelector("[data-review-next]");
    var nav = root.querySelector(".reviews-nav");
    var count = originals.length;

    originals.forEach(function (slide) {
      slide.hidden = false;
      slide.classList.remove("is-active");
    });

    var viewport = document.createElement("div");
    viewport.className = "reviews-viewport";
    viewport.setAttribute("aria-live", "polite");

    var track = document.createElement("div");
    track.className = "reviews-track";

    var cloneLast = originals[count - 1].cloneNode(true);
    var cloneFirst = originals[0].cloneNode(true);
    cloneLast.classList.add("is-clone");
    cloneFirst.classList.add("is-clone");
    cloneLast.setAttribute("aria-hidden", "true");
    cloneFirst.setAttribute("aria-hidden", "true");

    track.appendChild(cloneLast);
    originals.forEach(function (slide) {
      track.appendChild(slide);
    });
    track.appendChild(cloneFirst);
    viewport.appendChild(track);

    if (nav) {
      root.insertBefore(viewport, nav);
    } else {
      root.appendChild(viewport);
    }

    var trackIndex = 1;
    var animating = false;
    var autoplayTimer = null;
    var paused = false;

    function setViewportHeight() {
      var width = viewport.clientWidth || root.clientWidth;
      if (!width) return;

      var max = 0;
      var measurer = document.createElement("div");
      measurer.style.cssText =
        "position:absolute;visibility:hidden;pointer-events:none;width:" +
        width +
        "px;left:-9999px;top:0;";
      document.body.appendChild(measurer);

      originals.forEach(function (slide) {
        var clone = slide.cloneNode(true);
        clone.className = slide.className;
        measurer.appendChild(clone);
        max = Math.max(max, clone.offsetHeight);
        measurer.removeChild(clone);
      });

      document.body.removeChild(measurer);
      root.style.setProperty("--reviews-viewport-height", max + "px");
    }

    function realIndex() {
      if (trackIndex === 0) return count - 1;
      if (trackIndex === count + 1) return 0;
      return trackIndex - 1;
    }

    function updateDots() {
      var ri = realIndex();
      dots.forEach(function (dot, i) {
        dot.classList.toggle("is-active", i === ri);
        dot.setAttribute("aria-selected", i === ri ? "true" : "false");
      });
      originals.forEach(function (slide, i) {
        slide.setAttribute("aria-hidden", i === ri ? "false" : "true");
      });
    }

    function applyTransform(instant) {
      if (instant || reducedMotion) {
        track.classList.add("is-instant");
      } else {
        track.classList.remove("is-instant");
      }
      track.style.transform = "translate3d(-" + trackIndex * 100 + "%, 0, 0)";
      if (instant || reducedMotion) {
        track.offsetHeight;
        track.classList.remove("is-instant");
      }
    }

    function onTransitionEnd(e) {
      if (e.target !== track || e.propertyName !== "transform") return;
      animating = false;

      if (trackIndex === 0) {
        trackIndex = count;
        applyTransform(true);
      } else if (trackIndex === count + 1) {
        trackIndex = 1;
        applyTransform(true);
      }

      updateDots();
      if (!paused && !reducedMotion && !document.hidden) {
        startAutoplay();
      }
    }

    function go(delta) {
      if (animating && !reducedMotion) return;
      stopAutoplay();

      if (reducedMotion) {
        trackIndex += delta;
        if (trackIndex < 1) trackIndex = count;
        if (trackIndex > count) trackIndex = 1;
        applyTransform(true);
        updateDots();
        if (!paused && !document.hidden) startAutoplay();
        return;
      }

      animating = true;
      trackIndex += delta;
      applyTransform(false);
      updateDots();
    }

    function goToReal(target) {
      if (target < 0 || target >= count) return;
      stopAutoplay();

      var current = realIndex();
      if (target === current) {
        startAutoplay();
        return;
      }

      if (reducedMotion) {
        trackIndex = target + 1;
        applyTransform(true);
        updateDots();
        if (!paused && !document.hidden) startAutoplay();
        return;
      }

      animating = true;
      trackIndex = target + 1;
      applyTransform(false);
      updateDots();
    }

    function next() {
      go(1);
    }

    function prev() {
      go(-1);
    }

    function startAutoplay() {
      stopAutoplay();
      if (reducedMotion || paused || document.hidden) return;
      autoplayTimer = window.setInterval(next, AUTOPLAY_MS);
    }

    function stopAutoplay() {
      if (autoplayTimer) {
        clearInterval(autoplayTimer);
        autoplayTimer = null;
      }
    }

    track.addEventListener("transitionend", onTransitionEnd);

    if (prevBtn) prevBtn.addEventListener("click", prev);
    if (nextBtn) nextBtn.addEventListener("click", next);
    dots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        goToReal(Number(dot.getAttribute("data-review-dot")) || 0);
      });
    });

    root.addEventListener("mouseenter", function () {
      paused = true;
      stopAutoplay();
    });
    root.addEventListener("mouseleave", function () {
      paused = false;
      if (!animating) startAutoplay();
    });
    root.addEventListener("focusin", function () {
      paused = true;
      stopAutoplay();
    });
    root.addEventListener("focusout", function () {
      paused = false;
      if (!root.contains(document.activeElement) && !animating) {
        startAutoplay();
      }
    });

    document.addEventListener("visibilitychange", function () {
      if (document.hidden) {
        stopAutoplay();
      } else if (!paused && !animating) {
        startAutoplay();
      }
    });

    var resizeTimer;
    window.addEventListener("resize", function () {
      clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(function () {
        setViewportHeight();
        applyTransform(true);
      }, 150);
    });

    setViewportHeight();
    applyTransform(true);
    updateDots();
    startAutoplay();
  }
})();
