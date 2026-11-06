// Formulario de cotizacion: abre el correo con los datos listos
var form = document.getElementById("quote-form");
form.addEventListener("submit", function (e) {
  e.preventDefault();
  var d = new FormData(form);
  var body = [t("f_name")+": "+d.get("name"), t("f_phone")+": "+d.get("phone"), t("f_email")+": "+(d.get("email")||""),
              t("f_project")+": "+d.get("project"), "", d.get("msg")||""].join("\n");
  location.href = "mailto:" + VHP.email + "?subject=" + encodeURIComponent("Quote request - " + d.get("name")) + "&body=" + encodeURIComponent(body);
  document.getElementById("form-ok").hidden = false;
});
var slabParam = new URLSearchParams(location.search).get("slab");
if (slabParam) document.getElementById("f-msg").value = "Slab: " + slabParam + "\n";
