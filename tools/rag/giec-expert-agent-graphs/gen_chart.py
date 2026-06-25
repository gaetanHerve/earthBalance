"""
gen_chart.py — Générateur de graphiques GIEC AR6 (architecture déclarative).
=============================================================================
Usage:
    python gen_chart.py configs/<topic>.py [--open]

La config doit exposer :
    CHARTS      list[dict]   Configurations Chart.js (voir configs/ pour exemples)
    COMMENTARY  str          HTML du panneau latéral ('' = pas de panneau)
    OUTPUT_FILE str          Nom du fichier HTML de sortie
    PAGE_TITLE  str          Titre H1 de la page
    PAGE_SOURCES str         Crédits / sources (sous-titre)

Fonctions JS dans chartConfig :
    Préfixer la valeur string avec '__fn__' pour qu'elle soit convertie en
    fonction JavaScript à l'exécution par reviveFns() dans le template.
    Exemple :
        "label": "__fn__(c) => c.parsed.x + ' gCO₂-eq/kWh'"

Pipeline :
    1. python gen_chart.py configs/<topic>.py --open
    2. Valider le rendu dans le navigateur
"""
import json
import sys
import importlib.util
import pathlib
import os

HERE    = pathlib.Path(__file__).parent
TMPL    = HERE / "chart_template.html"
ROOT    = HERE.parent.parent.parent          # racine du projet
CHARTJS = ROOT / "node_modules/chart.js/dist/chart.umd.min.js"


def load_config(config_path: str):
    """Importe un fichier de config Python comme module."""
    p = pathlib.Path(config_path)
    if not p.is_absolute():
        p = pathlib.Path.cwd() / p
    spec = importlib.util.spec_from_file_location("chart_config", p)
    mod  = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


def main():
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)

    config  = load_config(sys.argv[1])
    do_open = "--open" in sys.argv or "-o" in sys.argv

    # ── Sérialisation JSON des charts ──────────────────────────────────────────
    charts_json = json.dumps(config.CHARTS, ensure_ascii=False, indent=2)
    # Eviter que </script> dans les chaînes ne termine le tag <script> HTML
    charts_json = charts_json.replace("</", "<\\/")

    # ── Chart.js bundle ────────────────────────────────────────────────────────
    if CHARTJS.exists():
        chartjs_code = CHARTJS.read_text(encoding="utf-8")
    else:
        print(f"⚠ Chart.js introuvable : {CHARTJS}")
        chartjs_code = ""

    # ── Template ───────────────────────────────────────────────────────────────
    html = TMPL.read_text(encoding="utf-8")

    commentary = getattr(config, "COMMENTARY", "")

    html = html.replace("__PAGE_TITLE__",   config.PAGE_TITLE)
    html = html.replace("__PAGE_SOURCES__", config.PAGE_SOURCES)
    html = html.replace("__CHARTS_JSON__",  charts_json)
    html = html.replace("__COMMENTARY__",   commentary)
    html = html.replace("/* __CHARTJS__ */", chartjs_code)

    # ── Écriture ───────────────────────────────────────────────────────────────
    output_path = HERE / config.OUTPUT_FILE
    output_path.write_text(html, encoding="utf-8")

    print(f"\n Fichier généré : {output_path}")
    print(f"  Ouvrir dans le navigateur pour valider avant tout usage.\n")

    if do_open:
        os.startfile(str(output_path))


if __name__ == "__main__":
    main()
