// Portada: conteo de colores por proveedor y slabs destacados
// Destacados: nombres de colores del catalogo (cambiar aqui para mostrar otros)
var FEATURED = [["a","Taj Mahal"],["a","Unique Calacatta Gold"],["s","Calacatta Lumiere"],["a","White Ice"]];
loadCatalog().then(function (data) {
  var a = data.items.filter(function (i) { return i.s === "a"; }).length;
  var s = data.items.length - a;
  document.getElementById("count-a").firstChild.textContent = a;
  document.getElementById("count-s").firstChild.textContent = s;
  var box = document.getElementById("featured");
  function render() {
    box.innerHTML = "";
    FEATURED.forEach(function (f) {
      var it = data.items.find(function (i) { return i.s === f[0] && i.name === f[1]; });
      if (!it) return;
      var a = slabCard(it, data); var link = document.createElement("a");
      link.href = "catalog.html?s=" + it.s + "&q=" + encodeURIComponent(it.name);
      link.className = a.className; link.innerHTML = a.innerHTML; link.style.textDecoration = "none";
      box.appendChild(link);
    });
  }
  render(); document.addEventListener("langchange", render);
});
