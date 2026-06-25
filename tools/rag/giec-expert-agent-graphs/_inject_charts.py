"""
Injecteur generique idempotent pour _gen_charts.cjs.

Workflow :
  1. python tools/rag/giec-expert-agent-graphs/_writer.py
        → restaure la structure de base (charts=[], render vide)
  2. Remplir les 5 variables de la section "A CONFIGURER" ci-dessous
  3. python tools/rag/giec-expert-agent-graphs/_inject_charts.py
        → injecte CHARTS et COMMENTARY dans _gen_charts.cjs
  4. node tools/rag/giec-expert-agent-graphs/_gen_charts.cjs
        → genere le HTML et auto-reset charts=[]

Idempotent : peut etre relance sans creer de doublons (ecrase ce qui
etait deja injecte).
"""
import re

TARGET = 'tools/rag/giec-expert-agent-graphs/_gen_charts.cjs'


def js_str(s):
    """Encode une chaine Python en literal JS single-quote.

    Utiliser pour les chaines qui seront interpolees dans CHARTS
    (notes de bas de graphique, labels, etc.).

    Exemple :
        NOTE1 = js_str("L'AR6 etablit que...")
        # -> "'L\\'AR6 etablit que...'"
    """
    return "'" + s.replace("\\", "\\\\").replace("'", "\\'") + "'"


# ══ A CONFIGURER ══════════════════════════════════════════════════════════════
# Contenu des graphiques — chaine JS valide entre les marqueurs BEGIN/END-CHARTS
# Chaque element est un objet { title, source, note, chartConfig }.
# Voir l'exemple migration (fin de ce fichier) pour la structure complete.
CHARTS = (
    ""
)

# Contenu HTML du panneau lateral (laisser vide '' pour pas de panneau).
# Balises supportees : h2 h3 h4 p blockquote table .warn .cite
COMMENTARY = (
    ""
)

OUTPUT_FILE  = 'output.html'
PAGE_TITLE   = 'Titre des graphiques'
PAGE_SOURCES = 'Sources et credits.'
# ══════════════════════════════════════════════════════════════════════════════


# ── Engine (ne pas modifier) ──────────────────────────────────────────────────

with open(TARGET, 'r', encoding='utf-8') as f:
    src = f.read()

# 1. Injecter charts[] (idempotent via regex + lambda)
new_block = (
    '// \u2500\u2500BEGIN-CHARTS\u2500\u2500\n'
    'const charts = [\n'
    + CHARTS
    + '];\n// \u2500\u2500END-CHARTS\u2500\u2500'
)
src = re.sub(
    r'// \u2500\u2500BEGIN-CHARTS\u2500\u2500\n[\s\S]*?// \u2500\u2500END-CHARTS\u2500\u2500',
    lambda m: new_block,
    src,
)

# 2. Supprimer tout bloc COMMENTARY existant (idempotent)
src = re.sub(
    r'// \u2500\u2500 Contenu du panneau lateral [\u2500]+\nconst COMMENTARY = [^\n]+;\n\n',
    '',
    src,
)

# 3. Remplacer le bloc render() entier
RENDER_BLOCK = (
    '// \u2500\u2500 Contenu du panneau lateral '
    + '\u2500' * 45 + '\n'
    + 'const COMMENTARY = ' + repr(COMMENTARY) + ';\n\n'
    + 'render(\n'
    + '  ' + repr(OUTPUT_FILE) + ',\n'
    + '  ' + repr(PAGE_TITLE) + ',\n'
    + '  ' + repr(PAGE_SOURCES) + ',\n'
    + '  charts,\n'
    + '  COMMENTARY\n'
    + ');\n'
)
src = re.sub(
    r'render\(\s*\n[\s\S]*?\);\n',
    lambda m: RENDER_BLOCK,
    src,
)

with open(TARGET, 'w', encoding='utf-8') as f:
    f.write(src)

print('OK')


# ══ EXEMPLE — migration_climate_charts.html (session 2026-06-25) ══════════════
#
# Remplacer les variables A CONFIGURER par le bloc ci-dessous pour regenerer.
#
# NOTE1 = js_str("Niveau de confiance AR6 sur une echelle indicative 1-3."
#                " Tempetes, inondations et secheresses sont les moteurs les"
#                " mieux documentes (high confidence).")
# NOTE2 = js_str("Representation qualitative : l'AR6 etablit que les"
#                " deplacements internes temporaires sont dominants. Les"
#                " proportions illustrent cette hierarchie, non des donnees"
#                " statistiques exactes.")
# NOTE3 = js_str("Relation inverse documentee par l'AR6 : les populations les"
#                " plus vulnerables sont les moins capables de migrer. Plus"
#                " l'agentivite du migrant est elevee, plus la migration est"
#                " une adaptation efficace.")
#
# CHARTS = (
#     "  {\n"
#     "    title: '1. Moteurs des deplacements climatiques \u2014 niveau de confiance AR6',\n"
#     "    source: '[AR6 WGII, p.1111 &amp; p.2440 \u2014 high confidence]',\n"
#     "    note: " + NOTE1 + ",\n"
#     "    chartConfig: {\n"
#     "      type: 'bar',\n"
#     "      data: {\n"
#     "        labels: ['Tempetes / cyclones', 'Inondations', 'Secheresses',\n"
#     "                 'Stress thermique chronique',\n"
#     "                 'Montee des eaux (actuel, international)'],\n"
#     "        datasets: [{\n"
#     "          label: 'Niveau de confiance (indicatif)',\n"
#     "          data: [3, 3, 2.5, 2, 1],\n"
#     "          backgroundColor: ['#00ff8899','#00e5ff99','#facc1599','#fb923c99','#ff505099'],\n"
#     "          borderColor:     ['#00ff88',  '#00e5ff',  '#facc15',  '#fb923c',  '#ff5050'],\n"
#     "          borderWidth: 1.5,\n"
#     "        }],\n"
#     "      },\n"
#     "      options: {\n"
#     "        indexAxis: 'y', responsive: true,\n"
#     "        plugins: { legend: { display: false },\n"
#     "          tooltip: { callbacks: { label: (c) =>\n"
#     "            ['','Faible','Moyen','Moyen-fort','Eleve'][Math.round(c.parsed.x * 2)]\n"
#     "            + ' (' + c.parsed.x + '/3)' } } },\n"
#     "        scales: {\n"
#     "          x: { min: 0, max: 3.2, grid: { color: '#1f2d3d' },\n"
#     "            ticks: { callback: (v) => (['Faible','','Moyen','Eleve'][v] || ''),\n"
#     "                     color: '#94a3b8' },\n"
#     "            title: { display: true,\n"
#     "                     text: 'Niveau de confiance AR6 (indicatif)',\n"
#     "                     color: '#64748b' } },\n"
#     "          y: { ticks: { color: '#94a3b8', font: { size: 10 } },\n"
#     "               grid: { color: '#1f2d3d' } },\n"
#     "        },\n"
#     "      },\n"
#     "    },\n"
#     "  },\n"
#     "  {\n"
#     "    title: '2. Nature des deplacements climatiques (caracterisation AR6)',\n"
#     "    source: '[AR6 WGII, p.2440 \u2014 illustration qualitative de la hierarchie etablie]',\n"
#     "    note: " + NOTE2 + ",\n"
#     "    chartConfig: {\n"
#     "      type: 'doughnut',\n"
#     "      data: {\n"
#     "        labels: ['Internes & temporaires (dominant)',\n"
#     "                 'Internes & plus durables', 'Internationaux'],\n"
#     "        datasets: [{\n"
#     "          data: [70, 20, 10],\n"
#     "          backgroundColor: ['#00ff8877','#00e5ff66','#ff505066'],\n"
#     "          borderColor:     ['#00ff88',  '#00e5ff',  '#ff5050'],\n"
#     "          borderWidth: 2, hoverOffset: 8,\n"
#     "        }],\n"
#     "      },\n"
#     "      options: {\n"
#     "        responsive: true, cutout: '55%',\n"
#     "        plugins: {\n"
#     "          legend: { position: 'bottom',\n"
#     "                    labels: { color: '#94a3b8', font: { size: 11 } } },\n"
#     "          tooltip: { callbacks: { label: (c) =>\n"
#     "            c.label + ' \u2014 ' + c.parsed + '% (illustratif)' } },\n"
#     "        },\n"
#     "      },\n"
#     "    },\n"
#     "  },\n"
#     "  {\n"
#     "    title: '3. Le piege de mobilite \u2014 vulnerabilite vs capacite a migrer',\n"
#     "    source: '[AR6 WGII, p.1186 &amp; p.1403 \u2014 high agreement, medium evidence]',\n"
#     "    note: " + NOTE3 + ",\n"
#     "    chartConfig: {\n"
#     "      type: 'bar',\n"
#     "      data: {\n"
#     "        labels: ['Faible vulnerabilite', 'Vulnerabilite moderee',\n"
#     "                 'Haute vulnerabilite', 'Tres haute vulnerabilite'],\n"
#     "        datasets: [\n"
#     "          { label: 'Exposition aux aleas climatiques',\n"
#     "            data: [1, 2, 3.5, 5],\n"
#     "            backgroundColor: '#ff505066', borderColor: '#ff5050',\n"
#     "            borderWidth: 1.5 },\n"
#     "          { label: 'Capacite a migrer (ressources & agentivite)',\n"
#     "            data: [5, 3.5, 2, 1],\n"
#     "            backgroundColor: '#00ff8866', borderColor: '#00ff88',\n"
#     "            borderWidth: 1.5 },\n"
#     "        ],\n"
#     "      },\n"
#     "      options: {\n"
#     "        responsive: true,\n"
#     "        plugins: {\n"
#     "          legend: { position: 'bottom',\n"
#     "                    labels: { color: '#94a3b8', font: { size: 11 } } },\n"
#     "          tooltip: { mode: 'index', intersect: false },\n"
#     "        },\n"
#     "        scales: {\n"
#     "          x: { ticks: { color: '#94a3b8', font: { size: 10 } },\n"
#     "               grid: { color: '#1f2d3d' } },\n"
#     "          y: { min: 0, max: 5.5,\n"
#     "               ticks: { color: '#94a3b8' },\n"
#     "               grid: { color: '#1f2d3d' },\n"
#     "               title: { display: true,\n"
#     "                        text: 'Niveau relatif (illustratif)',\n"
#     "                        color: '#64748b' } },\n"
#     "        },\n"
#     "      },\n"
#     "    },\n"
#     "  },\n"
# )
#
# COMMENTARY = (
#     '<h2>Migrations climatiques \u2014 AR6 du GIEC</h2>'
#     '<p class="warn"><strong>Projections difficiles</strong> \u2014 Les migrations climatiques'
#     ' d\u00e9pendent fortement des facteurs socio\u00e9conomiques. Aucune projection chiffr\u00e9e'
#     ' robuste n\u2019existe \u00e0 ce jour.'
#     ' <span class="cite">[AR6 WGII, p.76\u201377]</span></p>'
#     '<h3>Moteurs observ\u00e9s</h3>'
#     '<p>Principaux moteurs\u202f: <strong>temp\u00eates tropicales, inondations et'
#     ' s\u00e9cheresses</strong> (high confidence). D\u00e9placements majoritairement'
#     ' <strong>internes et temporaires</strong>.'
#     ' <span class="cite">[AR6 WGII, p.1111 &amp; p.2440]</span></p>'
#     '<h3>M\u00e9canismes r\u00e9gionaux</h3>'
#     '<h4>Petites \u00eeles et c\u00f4tes basses</h4>'
#     '<blockquote>\u00ab The reduction of island habitability is expected to cause'
#     ' increased migration [...] depopulation of some islands. \u00bb</blockquote>'
#     '<p>R\u00e9sistance au d\u00e9part jusqu\u2019\u00e0'
#     ' <strong>50\u202f% de perte de surface</strong>.'
#     ' <span class="cite">[AR6 WGII, p.2085 &amp; p.1112]</span></p>'
#     '<h4>Asie</h4>'
#     '<p>Risques climatiques <strong>exacerbant migrations internes et'
#     ' internationales</strong>. Relocalisations planifi\u00e9es = dernier recours.'
#     ' <span class="cite">[AR6 WGII, p.1517\u20131518]</span></p>'
#     '<h4>Zones rurales</h4>'
#     '<p><strong>23\u202f% des m\u00e9nages ruraux</strong> d\u2019Afrique sub-saharienne'
#     ' migrent pour s\u2019adapter aux changements agricoles.'
#     ' <span class="cite">[AR6 WGII, p.1403 &amp; p.941\u2013942]</span></p>'
#     '<h4>Lien avec l\u2019Europe</h4>'
#     '<p>Lien <strong>indirect</strong>\u202f: climat \u2192 conflit \u2192 exil.'
#     ' <span class="cite">[AR6 WGII, p.1095\u20131096]</span></p>'
#     '<h3>Le pi\u00e8ge de mobilit\u00e9</h3>'
#     '<blockquote>\u00ab The more agency migrants have, the greater the potential'
#     ' benefits for sending and receiving areas. \u00bb</blockquote>'
#     '<p>Les plus vuln\u00e9rables sont \u00e0 la fois les plus expos\u00e9s <em>et</em>'
#     ' les moins capables de migrer.'
#     ' <span class="cite">[AR6 WGII, p.1186 &amp; p.1403]</span></p>'
#     '<h3>Gouvernance internationale</h3>'
#     '<p>Aucun <strong>statut de r\u00e9fugi\u00e9 climatique</strong> en droit international.'
#     ' M\u00e9canisme de Varsovie recommande des strat\u00e9gies nationales depuis 2018.'
#     ' <span class="cite">[AR6 WGII, p.1135]</span></p>'
#     '<h3>Synth\u00e8se</h3>'
#     '<table><tr><th>Dimension</th><th>Confiance AR6</th></tr>'
#     '<tr><td>Temp\u00eates/inondations/s\u00e9cheresses = moteurs</td><td>High confidence</td></tr>'
#     '<tr><td>D\u00e9placements internes temporaires dominants</td><td>High confidence</td></tr>'
#     '<tr><td>Projections chiffr\u00e9es robustes impossibles</td><td>High confidence</td></tr>'
#     '<tr><td>Migration efficace si volontaire, pi\u00e8ge si forc\u00e9e</td><td>High agreement</td></tr>'
#     '<tr><td>Lien direct avec migrations vers Europe</td><td>Medium evidence</td></tr>'
#     '<tr><td>D\u00e9population petites \u00eeles \u00e0 terme</td><td>Medium-high confidence</td></tr>'
#     '</table>'
# )
#
# OUTPUT_FILE  = 'migration_climate_charts.html'
# PAGE_TITLE   = 'Migrations climatiques \u2014 Illustrations des donn\u00e9es AR6 du GIEC'
# PAGE_SOURCES = 'Sources\u202f: IPCC AR6 WGII (2022) &nbsp;\u00b7&nbsp; [AR6 WGII Ch.7, Ch.8, Ch.10]'
