# earthBalance — Config graphiques GIEC AR6
# Sujet : Migrations climatiques
# Sources : AR6 WGII — AR6_WG3_02106 (migrations & déplacements)
# Session : 2026-06-25
# Générer : python gen_chart.py configs/migration.py --open

OUTPUT_FILE  = "migration_climate_charts.html"
PAGE_TITLE   = "Migrations climatiques \u2014 Illustrations des donn\u00e9es AR6 du GIEC"
PAGE_SOURCES = "Sources\u202f: IPCC AR6 WGII (2022) &nbsp;\u00b7&nbsp; [AR6 WGII Ch.7, Ch.8, Ch.10]"

CHARTS = [
    # ── Graphique 1 : Moteurs des déplacements ─────────────────────────────────
    {
        "title": "1. Moteurs des d\u00e9placements climatiques \u2014 niveau de confiance AR6",
        "source": "[AR6 WGII, p.1111 &amp; p.2440 \u2014 high confidence]",
        "note": (
            "Niveau de confiance AR6 sur une \u00e9chelle indicative 1\u20133."
            " Temp\u00eates, inondations et s\u00e9cheresses sont les moteurs les mieux"
            " document\u00e9s (high confidence)."
        ),
        "chartConfig": {
            "type": "bar",
            "data": {
                "labels": [
                    "Temp\u00eates / cyclones",
                    "Inondations",
                    "S\u00e9cheresses",
                    "Stress thermique chronique",
                    "Mont\u00e9e des eaux (international)",
                ],
                "datasets": [{
                    "label": "Niveau de confiance (indicatif)",
                    "data": [3, 3, 2.5, 2, 1],
                    "backgroundColor": ["#00ff8899","#00e5ff99","#facc1599","#fb923c99","#ff505099"],
                    "borderColor":     ["#00ff88",  "#00e5ff",  "#facc15",  "#fb923c",  "#ff5050"],
                    "borderWidth": 1.5,
                }],
            },
            "options": {
                "indexAxis": "y",
                "responsive": True,
                "plugins": {
                    "legend": {"display": False},
                    "tooltip": {
                        "callbacks": {
                            "label": "__fn__(c) => (['','Faible','Moyen','Moyen-fort','Élevé'][Math.round(c.parsed.x * 2)] || '') + ' (' + c.parsed.x + '/3)'",
                        },
                    },
                },
                "scales": {
                    "x": {
                        "min": 0, "max": 3.2,
                        "grid":  {"color": "#1f2d3d"},
                        "title": {"display": True, "text": "Niveau de confiance AR6 (indicatif)", "color": "#64748b"},
                        "ticks": {
                            "color": "#94a3b8",
                            "callback": "__fn__(v) => (['Faible','','Moyen','Élevé'][v] || '')",
                        },
                    },
                    "y": {
                        "ticks": {"color": "#94a3b8", "font": {"size": 10}},
                        "grid":  {"color": "#1f2d3d"},
                    },
                },
            },
        },
    },

    # ── Graphique 2 : Nature des déplacements ──────────────────────────────────
    {
        "title": "2. Nature des d\u00e9placements climatiques (caract\u00e9risation AR6)",
        "source": "[AR6 WGII, p.2440 \u2014 illustration qualitative de la hi\u00e9rarchie \u00e9tablie]",
        "note": (
            "Repr\u00e9sentation qualitative\u202f: l\u2019AR6 \u00e9tablit que les"
            " d\u00e9placements internes temporaires sont dominants."
            " Les proportions illustrent cette hi\u00e9rarchie, non des donn\u00e9es statistiques exactes."
        ),
        "chartConfig": {
            "type": "doughnut",
            "data": {
                "labels": [
                    "Internes & temporaires (dominant)",
                    "Internes & plus durables",
                    "Internationaux",
                ],
                "datasets": [{
                    "data": [70, 20, 10],
                    "backgroundColor": ["#00ff8877","#00e5ff66","#ff505066"],
                    "borderColor":     ["#00ff88",  "#00e5ff",  "#ff5050"],
                    "borderWidth": 2,
                    "hoverOffset": 8,
                }],
            },
            "options": {
                "responsive": True,
                "cutout": "55%",
                "plugins": {
                    "legend": {
                        "position": "bottom",
                        "labels": {"color": "#94a3b8", "font": {"size": 11}},
                    },
                    "tooltip": {
                        "callbacks": {
                            "label": "__fn__(c) => c.label + ' \u2014 ' + c.parsed + '% (illustratif)'",
                        },
                    },
                },
            },
        },
    },

    # ── Graphique 3 : Piège de mobilité ────────────────────────────────────────
    {
        "title": "3. Le pi\u00e8ge de mobilit\u00e9 \u2014 vuln\u00e9rabilit\u00e9 vs capacit\u00e9 \u00e0 migrer",
        "source": "[AR6 WGII, p.1186 &amp; p.1403 \u2014 high agreement, medium evidence]",
        "note": (
            "Relation inverse document\u00e9e par l\u2019AR6\u202f: les populations les plus"
            " vuln\u00e9rables sont les moins capables de migrer."
            " Plus l\u2019agentivit\u00e9 du migrant est \u00e9lev\u00e9e, plus la migration est une adaptation efficace."
        ),
        "chartConfig": {
            "type": "bar",
            "data": {
                "labels": [
                    "Faible vuln\u00e9rabilit\u00e9",
                    "Vuln\u00e9rabilit\u00e9 mod\u00e9r\u00e9e",
                    "Haute vuln\u00e9rabilit\u00e9",
                    "Tr\u00e8s haute vuln\u00e9rabilit\u00e9",
                ],
                "datasets": [
                    {
                        "label": "Exposition aux al\u00e9as climatiques",
                        "data": [1, 2, 3.5, 5],
                        "backgroundColor": "#ff505066",
                        "borderColor": "#ff5050",
                        "borderWidth": 1.5,
                    },
                    {
                        "label": "Capacit\u00e9 \u00e0 migrer (ressources & agentivit\u00e9)",
                        "data": [5, 3.5, 2, 1],
                        "backgroundColor": "#00ff8866",
                        "borderColor": "#00ff88",
                        "borderWidth": 1.5,
                    },
                ],
            },
            "options": {
                "responsive": True,
                "plugins": {
                    "legend": {
                        "position": "bottom",
                        "labels": {"color": "#94a3b8", "font": {"size": 11}},
                    },
                    "tooltip": {"mode": "index", "intersect": False},
                },
                "scales": {
                    "x": {
                        "ticks": {"color": "#94a3b8", "font": {"size": 10}},
                        "grid":  {"color": "#1f2d3d"},
                    },
                    "y": {
                        "min": 0, "max": 5.5,
                        "ticks": {"color": "#94a3b8"},
                        "grid":  {"color": "#1f2d3d"},
                        "title": {"display": True, "text": "Niveau relatif (illustratif)", "color": "#64748b"},
                    },
                },
            },
        },
    },
]

COMMENTARY = (
    "<h2>Migrations climatiques \u2014 AR6 du GIEC</h2>"
    "<p class=\"warn\"><strong>Projections difficiles</strong> \u2014 Les migrations climatiques"
    " d\u00e9pendent fortement des facteurs socio\u00e9conomiques. Aucune projection chiffr\u00e9e"
    " robuste n\u2019existe \u00e0 ce jour."
    " <span class=\"cite\">[AR6 WGII, p.76\u201377]</span></p>"
    "<h3>Moteurs observ\u00e9s</h3>"
    "<p>Principaux moteurs\u202f: <strong>temp\u00eates tropicales, inondations et"
    " s\u00e9cheresses</strong> (high confidence). D\u00e9placements majoritairement"
    " <strong>internes et temporaires</strong>."
    " <span class=\"cite\">[AR6 WGII, p.1111 &amp; p.2440]</span></p>"
    "<h3>M\u00e9canismes r\u00e9gionaux</h3>"
    "<h4>Petites \u00eeles et c\u00f4tes basses</h4>"
    "<blockquote>\u00ab The reduction of island habitability is expected to cause"
    " increased migration [...] depopulation of some islands. \u00bb</blockquote>"
    "<p>R\u00e9sistance au d\u00e9part jusqu\u2019\u00e0"
    " <strong>50\u202f% de perte de surface</strong>."
    " <span class=\"cite\">[AR6 WGII, p.2085 &amp; p.1112]</span></p>"
    "<h4>Asie</h4>"
    "<p>Risques climatiques <strong>exacerbant migrations internes et internationales</strong>."
    " Relocalisations planifi\u00e9es = dernier recours."
    " <span class=\"cite\">[AR6 WGII, p.1517\u20131518]</span></p>"
    "<h4>Zones rurales (Afrique sub-saharienne)</h4>"
    "<p><strong>23\u202f% des m\u00e9nages ruraux</strong> migrent pour s\u2019adapter aux"
    " changements agricoles."
    " <span class=\"cite\">[AR6 WGII, p.1403 &amp; p.941\u2013942]</span></p>"
    "<h4>Lien avec l\u2019Europe</h4>"
    "<p>Lien <strong>indirect</strong>\u202f: climat \u2192 conflit \u2192 exil."
    " <span class=\"cite\">[AR6 WGII, p.1095\u20131096]</span></p>"
    "<h3>Le pi\u00e8ge de mobilit\u00e9</h3>"
    "<blockquote>\u00ab The more agency migrants have, the greater the potential"
    " benefits for sending and receiving areas. \u00bb</blockquote>"
    "<p>Les plus vuln\u00e9rables sont \u00e0 la fois les plus expos\u00e9s <em>et</em>"
    " les moins capables de migrer."
    " <span class=\"cite\">[AR6 WGII, p.1186 &amp; p.1403]</span></p>"
    "<h3>Synth\u00e8se</h3>"
    "<table>"
    "<tr><th>Dimension</th><th>Confiance AR6</th></tr>"
    "<tr><td>Temp\u00eates/inondations/s\u00e9cheresses = moteurs</td><td>High confidence</td></tr>"
    "<tr><td>D\u00e9placements internes temporaires dominants</td><td>High confidence</td></tr>"
    "<tr><td>Projections chiffr\u00e9es robustes impossibles</td><td>High confidence</td></tr>"
    "<tr><td>Migration efficace si volontaire</td><td>High agreement</td></tr>"
    "<tr><td>Lien direct avec migrations Europe</td><td>Medium evidence</td></tr>"
    "<tr><td>D\u00e9population petites \u00eeles \u00e0 terme</td><td>Medium-high confidence</td></tr>"
    "</table>"
)
