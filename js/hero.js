// Slider del hero: cambia cada 6.5 s con zoom lento; los puntos permiten elegir.
(function () {
  var slides = [].slice.call(document.querySelectorAll(".hero .slide"));
  var dots = [].slice.call(document.querySelectorAll(".hero .dots button"));
  if (!slides.length) return;
  var i = 0, timer, reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function show(n) {
    var prev = slides[i];
    i = (n + slides.length) % slides.length;
    var cur = slides[i];
    // carga la imagen siguiente antes de que se necesite
    var nxt = slides[(i + 1) % slides.length].querySelector("img"); nxt.loading = "eager";
    cur.classList.remove("is-zoom"); void cur.offsetWidth; cur.classList.add("is-zoom");
    slides.forEach(function (s) { s.classList.toggle("is-on", s === cur); });
    setTimeout(function () { if (prev !== slides[i]) prev.classList.remove("is-zoom"); }, 1500);
    dots.forEach(function (d, k) { d.setAttribute("aria-current", k === i); });
  }
  function start() { clearInterval(timer); timer = setInterval(function () { show(i + 1); }, reduce ? 9000 : 6500); }
  dots.forEach(function (d, k) { d.addEventListener("click", function () { show(k); start(); }); });
  document.addEventListener("visibilitychange", function () { document.hidden ? clearInterval(timer) : start(); });
  show(0); start();
})();

// Galeria de inspiracion: filtro cocinas/baños y vista ampliada
(function () {
  var grid = document.getElementById("ph-grid"); if (!grid) return;
  var dlg = document.getElementById("ph-dlg"), big = document.getElementById("ph-big");
  document.querySelectorAll(".insp-filter .chip").forEach(function (b, _, all) {
    b.addEventListener("click", function () {
      all.forEach(function (x) { x.setAttribute("aria-pressed", x === b); });
      grid.querySelectorAll(".ph-tile").forEach(function (t) { t.hidden = b.dataset.f !== "all" && t.dataset.cat !== b.dataset.f; });
    });
  });
  grid.querySelectorAll(".ph-tile").forEach(function (t) {
    t.addEventListener("click", function () { var i = t.querySelector("img"); big.src = t.dataset.full; big.alt = i.alt; dlg.showModal(); });
  });
  document.getElementById("ph-close").onclick = function () { dlg.close(); };
  dlg.addEventListener("click", function (e) { if (e.target === dlg) dlg.close(); });
})();
