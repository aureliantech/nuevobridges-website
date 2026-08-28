/* NuevoBridges — FAQ accordion (single-open per [data-faq] root) */
(function () {
  var roots = Array.prototype.slice.call(document.querySelectorAll("[data-faq]"));
  if (!roots.length) return;

  roots.forEach(function (root) {
    var items = Array.prototype.slice.call(root.querySelectorAll(".faq-item"));

    function setOpen(item, open) {
      var btn = item.querySelector(".faq-item__q");
      if (!btn) return;
      item.classList.toggle("is-open", open);
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    }

    items.forEach(function (item) {
      var btn = item.querySelector(".faq-item__q");
      if (!btn) return;
      btn.addEventListener("click", function () {
        var willOpen = !item.classList.contains("is-open");
        items.forEach(function (other) {
          setOpen(other, willOpen && other === item);
        });
      });
    });
  });
})();
