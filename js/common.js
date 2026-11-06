// Utilidades compartidas: carga del catalogo y tarjeta de slab.
var _cat;
function loadCatalog() {
  if (!_cat) _cat = fetch("data/catalog.json").then(function (r) { return r.json(); });
  return _cat;
}
function imgPath(item, rel, size) {
  if (!rel) return null;
  return "img/" + (item.s === "a" ? "architectural" : "stratus") + "/" + size + "/" + rel + ".webp";
}
function typeName(t, data) { return vhpLang === "es" ? (data.typesES[t] || t) : t; }
function supName(item) { return VHP.suppliers[item.s].name; }
function slabsTxt(n) { return n + " " + t(n === 1 ? "n_slab" : "n_slabs"); }
function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
function slabCard(item, data) {
  var b = document.createElement("button");
  b.type = "button"; b.className = "slab";
  var src = imgPath(item, item.img, "thumb");
  var stock = item.s === "a" ? '<span class="stock">' + slabsTxt(item.n) + " " + t("in_stock") + "</span>" : "";
  b.innerHTML = '<span class="ph">' + (src ? '<img loading="lazy" decoding="async" src="' + src + '" alt="">' : "") + "</span>" +
    '<span class="meta"><span class="nm">' + esc(item.name) + '</span><span class="ty">' + esc(typeName(item.t, data)) + "</span>" +
    stock + '<span class="sup-tag">' + t("supplied_by") + " " + supName(item) + "</span></span>";
  return b;
}
