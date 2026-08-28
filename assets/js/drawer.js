/* NuevoBridges — menu drawer + Practice areas submenu */
(function () {
  var drawer = document.getElementById("site-drawer");
  var backdrop = document.querySelector("[data-drawer-backdrop]");
  var openers = document.querySelectorAll("[data-drawer-open]");
  var closer = document.querySelector("[data-drawer-close]");
  if (!drawer || !openers.length) return;

  var lastFocus = null;

  /** Mobile / touch / Mobile iframe: first tap expands; desktop click → hub. */
  function expandFirst() {
    if (new URLSearchParams(window.location.search).get("vp") === "mobile") {
      return true;
    }
    return (
      window.matchMedia &&
      window.matchMedia("(hover: none), (pointer: coarse)").matches
    );
  }

  function collapseAllGroups() {
    drawer.querySelectorAll("[data-drawer-group].is-open").forEach(function (g) {
      g.classList.remove("is-open");
      var p = g.querySelector("[data-drawer-parent]");
      if (p) p.setAttribute("aria-expanded", "false");
    });
  }

  function setOpen(open) {
    drawer.classList.toggle("is-open", open);
    drawer.setAttribute("aria-hidden", open ? "false" : "true");
    if (backdrop) {
      backdrop.hidden = !open;
      backdrop.classList.toggle("is-open", open);
    }
    openers.forEach(function (btn) {
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    });
    document.body.style.overflow = open ? "hidden" : "";
    if (open) {
      lastFocus = document.activeElement;
      var focusEl = closer || drawer.querySelector("a, button");
      if (focusEl) focusEl.focus();
    } else {
      collapseAllGroups();
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }
  }

  openers.forEach(function (btn) {
    btn.addEventListener("click", function () {
      setOpen(!drawer.classList.contains("is-open"));
    });
  });

  if (closer) closer.addEventListener("click", function () { setOpen(false); });
  if (backdrop) backdrop.addEventListener("click", function () { setOpen(false); });

  drawer.querySelectorAll("[data-drawer-group]").forEach(function (group) {
    var parent = group.querySelector("[data-drawer-parent]");
    if (!parent) return;
    parent.setAttribute("aria-expanded", "false");
    parent.setAttribute("aria-haspopup", "true");

    // Capture so loader cannot schedule hub nav on the first expand tap
    parent.addEventListener(
      "click",
      function (e) {
        // Desktop / fine pointer: hover reveals; click goes to hub
        if (!expandFirst()) return;
        if (group.classList.contains("is-open")) return;
        e.preventDefault();
        e.stopImmediatePropagation();
        collapseAllGroups();
        group.classList.add("is-open");
        parent.setAttribute("aria-expanded", "true");
      },
      true
    );
  });

  drawer.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function (e) {
      if (
        expandFirst() &&
        link.hasAttribute("data-drawer-parent") &&
        e.defaultPrevented
      ) {
        return;
      }
      setOpen(false);
    });
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && drawer.classList.contains("is-open")) setOpen(false);
  });
})();
