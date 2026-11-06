(function () {
  var COLLS = { a: ["all", "natural", "pentalquartz"], s: ["all", "quartz", "porcelain", "natural"] };
  var COLL_LABEL = { a: { all: "col_live", natural: "col_natural", pentalquartz: "col_pentalquartz" },
                     s: { all: "all", quartz: "col_quartz", porcelain: "col_porcelain", natural: "col_natural" } };
  var p = new URLSearchParams(location.search);
  var st = { s: p.get("s") === "s" ? "s" : "a", c: p.get("c") || "all", type: "", fin: "", q: p.get("q") || "" };
  if (COLLS[st.s].indexOf(st.c) < 0) st.c = "all";
  var data, $ = function (id) { return document.getElementById(id); };

  function pool() { return data.items.filter(function (i) { return i.s === st.s && (st.c === "all" || i.c === st.c); }); }
  function syncUrl() {
    var u = new URLSearchParams({ s: st.s, c: st.c }); if (st.q) u.set("q", st.q);
    history.replaceState(null, "", "?" + u.toString());
  }
  function fillSelect(sel, values, allKey, cur, label) {
    sel.innerHTML = "";
    var o = document.createElement("option"); o.value = ""; o.textContent = t(allKey) + ": " + t("all"); sel.appendChild(o);
    values.forEach(function (v) { var x = document.createElement("option"); x.value = v; x.textContent = label ? label(v) : v; if (v === cur) x.selected = true; sel.appendChild(x); });
  }
  function controls() {
    ["a", "s"].forEach(function (s) { $("tab-" + s).setAttribute("aria-selected", st.s === s); });
    var coll = $("coll"); coll.innerHTML = "";
    COLLS[st.s].forEach(function (c) {
      var b = document.createElement("button"); b.className = "chip"; b.type = "button";
      b.textContent = t(COLL_LABEL[st.s][c]); b.setAttribute("aria-pressed", st.c === c);
      b.onclick = function () { st.c = c; st.type = ""; st.fin = ""; controls(); render(); };
      coll.appendChild(b);
    });
    var items = pool();
    var types = Array.from(new Set(items.map(function (i) { return i.t; }))).sort();
    if (types.indexOf(st.type) < 0) st.type = "";
    fillSelect($("f-type"), types, "filter_type", st.type, function (v) { return typeName(v, data); });
    var fins = Array.from(new Set([].concat.apply([], items.map(function (i) { return i.fin; })))).sort();
    if (fins.indexOf(st.fin) < 0) st.fin = "";
    fillSelect($("f-fin"), fins, "filter_finish", st.fin);
    $("f-q").value = st.q;
    var sup = VHP.suppliers[st.s];
    $("sup-note").innerHTML = t("supplied_by") + ' <strong>' + sup.name + '</strong>';
  }
  function render() {
    var q = st.q.trim().toLowerCase();
    var items = pool().filter(function (i) {
      return (!st.type || i.t === st.type) && (!st.fin || i.fin.indexOf(st.fin) >= 0) && (!q || i.name.toLowerCase().indexOf(q) >= 0);
    }).sort(function (a, b) { return a.name.localeCompare(b.name); });
    var g = $("grid"); g.innerHTML = "";
    var frag = document.createDocumentFragment();
    items.forEach(function (it) { var c = slabCard(it, data); c.onclick = function () { openDlg(it); }; frag.appendChild(c); });
    g.appendChild(frag);
    var slabs = st.s === "a" ? ", " + items.reduce(function (n, i) { return n + i.n; }, 0) + " " + t("n_slabs") : "";
    $("count").textContent = items.length + " " + t("n_colors") + slabs;
    $("empty").hidden = items.length > 0;
    syncUrl();
  }
  function lotLabel(it, l) {
    if (it.s === "a") return [l.f, l.sz, slabsTxt(l.n)].filter(Boolean).join(", ");
    return [l.f, l.th, l.g, l.j ? t("superjumbo") : ""].filter(Boolean).join(", ");
  }
  function showLot(it, l, btn) {
    $("dlg-img").src = imgPath(it, l.i, "large") || ""; $("dlg-img").alt = it.name + " slab";
    document.querySelectorAll("#dlg-lots button").forEach(function (b) { b.setAttribute("aria-current", b === btn); });
  }
  function openDlg(it) {
    $("dlg-name").textContent = it.name;
    $("dlg-type").textContent = typeName(it.t, data) + (it.s === "a" ? ", " + slabsTxt(it.n) + " " + t("in_stock") : "");
    $("dlg-sup").innerHTML = t("supplied_by") + " <strong>" + supName(it) + "</strong>";
    $("dlg-supurl").href = VHP.suppliers[it.s].url;
    $("dlg-ask").href = "index.html?slab=" + encodeURIComponent(it.name + " (" + supName(it) + ")") + "#quote";
    var ul = $("dlg-lots"); ul.innerHTML = "";
    var first;
    it.lots.forEach(function (l) {
      if (!l.i) return;
      var li = document.createElement("li"), b = document.createElement("button"); b.type = "button";
      b.innerHTML = '<img loading="lazy" src="' + imgPath(it, l.i, "thumb") + '" alt=""><span>' + esc(lotLabel(it, l)) + "</span>";
      b.onclick = function () { showLot(it, l, b); };
      li.appendChild(b); ul.appendChild(li); if (!first) first = [l, b];
    });
    if (first) showLot(it, first[0], first[1]);
    $("dlg").showModal();
  }
  $("dlg-close").onclick = function () { $("dlg").close(); };
  $("dlg").addEventListener("click", function (e) { if (e.target === this) this.close(); });
  ["a", "s"].forEach(function (s) { $("tab-" + s).onclick = function () { st.s = s; st.c = "all"; st.type = ""; st.fin = ""; controls(); render(); }; });
  $("f-type").onchange = function () { st.type = this.value; render(); };
  $("f-fin").onchange = function () { st.fin = this.value; render(); };
  $("f-q").oninput = function () { st.q = this.value; render(); };
  $("clear").onclick = function () { st.type = ""; st.fin = ""; st.q = ""; st.c = "all"; controls(); render(); };

  loadCatalog().then(function (d) {
    data = d;
    var dt = new Date(d.updated + "T12:00:00");
    function upd() { $("upd").textContent = dt.toLocaleDateString(vhpLang === "es" ? "es-US" : "en-US", { year: "numeric", month: "long", day: "numeric" }); }
    upd(); controls(); render();
    document.addEventListener("langchange", function () { upd(); controls(); render(); });
  });
})();
