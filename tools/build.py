#!/usr/bin/env python3
"""Arma las paginas del sitio a partir de src/.

Cada pagina comparte el mismo <head>, encabezado, pie y botones flotantes.
Editar el contenido en src/pages/*.html (o el pie en src/footer.html)
y luego correr:  python3 tools/build.py
"""
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "src")

PAGES = {
    # archivo: (titulo, descripcion, clave del menu activo, scripts extra)
    "index.html": ("Vasquez Home Projects | Countertops in Oklahoma City",
                   "Granite, quartz, quartzite and marble countertops in Oklahoma City. Choose your slab from 800+ in stock and we measure, fabricate and install.",
                   "", ["js/hero.js", "js/home.js"]),
    "catalog.html": ("Slab catalog | Vasquez Home Projects",
                     "Granite, marble, quartzite, quartz and porcelain slabs in stock in Oklahoma City from Architectural Surfaces and Stratus Surfaces.",
                     "catalog", ["js/catalog.js"]),
    "inspiration.html": ("Inspiration: finished kitchens and baths | Vasquez Home Projects",
                         "Kitchens and bathrooms finished by Vasquez Home Projects in Oklahoma, and what our clients say on Google.",
                         "insp", ["js/hero.js"]),
    "services.html": ("Countertop and remodeling services | Vasquez Home Projects",
                      "Kitchen countertops, bathroom vanities, backsplashes and full kitchen and bath remodeling in Oklahoma. Free measurements and estimates.",
                      "serv", []),
    "contact.html": ("Free quote and contact | Vasquez Home Projects",
                     "Request a free countertop quote. Call (405) 408-4868 or visit our shop at 2620 S Meridian Ave, Oklahoma City.",
                     "contact", ["js/contact.js"]),
}

NAV = [("catalog", "catalog.html", "nav_catalog"), ("insp", "inspiration.html", "nav_insp"),
       ("serv", "services.html", "nav_services")]


def header(active):
    links = "\n".join(
        f'      <a href="{href}" data-i18n="{key}"{" aria-current=\"page\"" if k == active else ""}></a>'
        for k, href, key in NAV)
    cur = ' aria-current="page"' if active == "contact" else ""
    return f'''<header class="site-head">
  <div class="wrap">
    <a class="brand" href="index.html"><img src="img/brand/logo.svg" alt="Vasquez Home Projects" width="173" height="60"></a>
    <button class="menu-btn" aria-label="Menu" aria-expanded="false">&#9776;</button>
    <nav class="nav-links">
{links}
      <a class="btn" href="contact.html" data-i18n="nav_contact"{cur}></a>
      <button class="lang-btn" data-i18n="lang_btn" aria-label="Change language / Cambiar idioma"></button>
    </nav>
  </div>
</header>
'''


def page(fname, title, desc, active, scripts):
    body = open(os.path.join(SRC, "pages", fname), encoding="utf-8").read()
    foot = open(os.path.join(SRC, "footer.html"), encoding="utf-8").read()
    js = "\n".join(f'<script src="{s}"></script>' for s in ["js/config.js", "js/i18n.js", "js/common.js"] + scripts)
    return f'''<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title}</title>
<meta name="description" content="{desc}">
<link rel="canonical" href="https://vasquezhomeproject.com/{'' if fname == 'index.html' else fname}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600&family=Marcellus&display=swap" rel="stylesheet">
<link rel="stylesheet" href="css/site.css">
<link rel="icon" href="img/brand/icon.svg" type="image/svg+xml">
<meta name="theme-color" content="#FFFFFF">
</head>
<body>
<!-- Generado por tools/build.py: editar src/pages/{fname} -->
{header(active)}
{body}
{foot}
{js}
</body>
</html>
'''


for f, (t, d, a, s) in PAGES.items():
    open(os.path.join(ROOT, f), "w", encoding="utf-8").write(page(f, t, d, a, s))
    print("ok", f)

with open(os.path.join(ROOT, "sitemap.xml"), "w") as sm:
    sm.write('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n')
    for f in PAGES:
        sm.write(f'  <url><loc>https://vasquezhomeproject.com/{"" if f == "index.html" else f}</loc></url>\n')
    sm.write('</urlset>\n')
