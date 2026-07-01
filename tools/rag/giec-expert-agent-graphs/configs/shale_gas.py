# earthBalance — Config graphiques GIEC AR6
# Sujet : Gaz de schiste et impact climatique
# Sources : AR6 WGIII — AR6_WG3_03912, AR6_WG3_04008, AR6_WG3_00084, AR6_WG3_02103
# Session : 2026-06-25
# Générer : python gen_chart.py configs/shale_gas.py --open

OUTPUT_FILE  = "shale_gas_emissions_charts.html"
PAGE_TITLE   = "Gaz de schiste \u2014 \u00c9missions et impact climatique (AR6 du GIEC)"
PAGE_SOURCES = (
    "Sources\u202f: IPCC AR6 WGIII (2022) \u2014 Ch.\u20046 &amp; Ch.\u200411"
    " &nbsp;\u00b7&nbsp; [AR6_WG3_03912, AR6_WG3_04008, AR6_WG3_00084, AR6_WG3_02103]"
)

CHARTS = [
    # ── Graphique 1 : Intensité carbone par source ─────────────────────────────
    {
        "title": "Intensit\u00e9 carbone par source d\u2019\u00e9lectricit\u00e9 \u2014 m\u00e9dianes IPCC",
        "source": "[AR6 WGIII, p.1158\u20131159 \u2014 soumissions au data call AR6]",
        "note": (
            "M\u00e9dianes IPCC (toutes technologies confondues). Ces valeurs incluent les"
            " \u00e9missions amont (extraction, transport, fuites)."
            " \u00c9olien\u202f: 9,3 \u2014 Gaz\u202f: 537 \u2014 Charbon\u202f: 965 gCO\u2082-eq/kWh."
        ),
        "chartConfig": {
            "type": "bar",
            "data": {
                "labels": [
                    "\u00c9olien",
                    "Gaz naturel (cycle combin\u00e9)",
                    "Charbon (toutes technologies)",
                ],
                "datasets": [{
                    "label": "Intensit\u00e9 carbone (gCO\u2082-eq/kWh)",
                    "data": [9.3, 537, 965],
                    "backgroundColor": ["#00ff8899", "#fb923c99", "#ff505099"],
                    "borderColor":     ["#00ff88",   "#fb923c",   "#ff5050"],
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
                            "label": "__fn__(c) => c.parsed.x + '\u202fgCO\u2082-eq/kWh'",
                        },
                    },
                },
                "scales": {
                    "x": {
                        "min": 0, "max": 1100,
                        "grid":  {"color": "#1f2d3d"},
                        "title": {"display": True, "text": "gCO\u2082-eq/kWh (m\u00e9diane, cycle de vie)", "color": "#64748b"},
                        "ticks": {"color": "#94a3b8"},
                    },
                    "y": {
                        "ticks": {"color": "#94a3b8", "font": {"size": 11}},
                        "grid":  {"color": "#1f2d3d"},
                    },
                },
            },
        },
    },

    # ── Graphique 2 : Seuil des fuites de méthane ──────────────────────────────
    {
        "title": "Impact des fuites de m\u00e9thane \u2014 seuil d\u2019\u00e9quivalence gaz/charbon",
        "source": "[AR6 WGIII, p.1195 \u2014 Alvarez et al. 2012 & 2018, cit\u00e9s dans AR6]",
        "note": (
            "Mod\u00e8le illustratif calibr\u00e9 sur l\u2019AR6 : combustion seule \u2248 450 gCO\u2082-eq/kWh."
            " Points \u25cf jaunes = mesures US 2018 (2,3\u202f%)."
            " Points \u25cf rouges = zone \u00e9quivalent charbon (seuil 2,7\u202f%, AR6 WGIII p.1195)."
        ),
        "chartConfig": {
            "type": "line",
            "data": {
                "labels": [
                    "0\u202f%",
                    "1\u202f%",
                    "2\u202f%",
                    "2,3\u202f% (USA 2018)",
                    "2,7\u202f% (seuil AR6)",
                    "4\u202f%",
                ],
                "datasets": [
                    {
                        "label": "Gaz naturel (intensit\u00e9 effective avec fuites)",
                        "data": [450, 641, 832, 889, 965, 1213],
                        "borderColor": "#fb923c",
                        "backgroundColor": "#fb923c22",
                        "tension": 0.2,
                        "fill": False,
                        "pointBackgroundColor": ["#fb923c","#fb923c","#fb923c","#facc15","#ff5050","#ff5050"],
                        "pointBorderColor":     ["#fb923c","#fb923c","#fb923c","#facc15","#ff5050","#ff5050"],
                        "pointRadius": [4, 4, 4, 8, 8, 4],
                    },
                    {
                        "label": "Charbon \u2014 r\u00e9f\u00e9rence (965 gCO\u2082-eq/kWh)",
                        "data": [965, 965, 965, 965, 965, 965],
                        "borderColor": "#ff5050",
                        "borderWidth": 2,
                        "borderDash": [8, 4],
                        "pointRadius": 0,
                        "fill": False,
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
                    "tooltip": {
                        "mode": "index",
                        "intersect": False,
                        "callbacks": {
                            "label": "__fn__(c) => c.dataset.label + '\u202f: ' + c.parsed.y + '\u202fgCO\u2082-eq/kWh'",
                        },
                    },
                },
                "scales": {
                    "x": {
                        "ticks": {"color": "#94a3b8", "font": {"size": 10}},
                        "grid":  {"color": "#1f2d3d"},
                    },
                    "y": {
                        "min": 300, "max": 1350,
                        "grid":  {"color": "#1f2d3d"},
                        "title": {"display": True, "text": "gCO\u2082-eq/kWh", "color": "#64748b"},
                        "ticks": {"color": "#94a3b8"},
                    },
                },
            },
        },
    },

    # ── Graphique 3 : CH₄ fugitif dans le secteur énergétique ─────────────────
    {
        "title": "CH\u2084 fugitif dans les \u00e9missions du secteur \u00e9nerg\u00e9tique (2019)",
        "source": "[AR6 WGIII, p.41 \u2014 50\u202f\u00e0 80\u202f% r\u00e9ductibles \u00e0 <50\u202fUSD/tCO\u2082-eq, medium confidence]",
        "note": (
            "50 \u00e0 80\u202f% des fuites de m\u00e9thane fossile pourraient \u00eatre \u00e9vit\u00e9es"
            " \u00e0 <50\u202fUSD/tCO\u2082-eq avec les technologies actuelles (medium confidence)."
            " Midpoint utilis\u00e9\u202f: 65\u202f%. Total \u00e9nergie 2019\u202f: 20\u202fGtCO\u2082-eq/an. [AR6 WGIII, p.41]"
        ),
        "chartConfig": {
            "type": "doughnut",
            "data": {
                "labels": [
                    "CH\u2084 fugitif r\u00e9ductible (<50\u202fUSD/tCO\u2082-eq)",
                    "CH\u2084 fugitif r\u00e9siduel",
                    "Autres GES \u00e9nergie (CO\u2082, N\u2082O\u2026)",
                ],
                "datasets": [{
                    "data": [2.3, 1.3, 16.4],
                    "backgroundColor": ["#00ff8877", "#fb923c77", "#33415566"],
                    "borderColor":     ["#00ff88",   "#fb923c",   "#475569"],
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
                        "labels": {"color": "#94a3b8", "font": {"size": 10}},
                    },
                    "tooltip": {
                        "callbacks": {
                            "label": "__fn__(c) => c.label + '\u202f\u2014\u202f' + c.raw + '\u202fGtCO\u2082-eq/an (' + (c.raw / 20 * 100).toFixed(1) + '\u202f%)'",
                        },
                    },
                },
            },
        },
    },
]

COMMENTARY = (
    "<h2>Gaz de schiste \u2014 AR6 du GIEC</h2>"
    "<p class=\"warn\"><strong>Graphique 2 : mod\u00e8le illustratif</strong> \u2014"
    " Le seuil 2,7\u202f% est une donn\u00e9e AR6 (Alvarez et al. 2012)."
    " Les valeurs interm\u00e9diaires suivent un mod\u00e8le lin\u00e9aire simplifi\u00e9"
    " calibr\u00e9 sur ce seuil (combustion seule \u2248\u202f450 gCO\u2082-eq/kWh \u00e0 0\u202f% de fuite).</p>"
    "<h3>1. Combustion directe</h3>"
    "<p>Le gaz naturel \u00e9met environ <strong>deux fois moins de CO\u2082</strong> que le charbon"
    " \u00e0 la combustion. M\u00e9dianes IPCC (data call AR6)\u202f:"
    " \u00e9olien\u202f: 9,3 \u2014 gaz\u202f: 537 \u2014 charbon\u202f: 965\u202fgCO\u2082-eq/kWh."
    " <span class=\"cite\">[AR6 WGIII, p.1158\u20131159]</span></p>"
    "<h3>2. Le r\u00f4le d\u00e9cisif des fuites de m\u00e9thane</h3>"
    "<p>Le m\u00e9thane a un potentiel de r\u00e9chauffement"
    " <strong>\u223c\u202f82\u00d7 celui du CO\u2082</strong> sur 20\u202fans (AR6 WGI r\u00e9vis\u00e9)."
    " Chaque pourcent de fuite annule une fraction du b\u00e9n\u00e9fice climatique du gaz.</p>"
    "<blockquote>\u00ab It would take a leakage rate of about 2.7\u202f% from natural gas production"
    " to undo the direct fuel switching from coal mitigation effect. \u00bb</blockquote>"
    "<p><strong>Seuil d\u2019\u00e9quivalence\u202f: 2,7\u202f%</strong>"
    " <span class=\"cite\">[AR6 WGIII, p.1195 \u2014 Alvarez et al. 2012]</span><br>"
    " USA mesur\u00e9 (2018)\u202f: <strong>2,3\u202f%</strong> \u2014"
    " 60\u202f% au-dessus des estimations pr\u00e9c\u00e9dentes."
    " <span class=\"cite\">[AR6 WGIII, p.1195 \u2014 Alvarez et al. 2018]</span></p>"
    "<h3>3. Potentiel de r\u00e9duction massif</h3>"
    "<p>\u00c9missions fugitives \u00e9nerg\u00e9tiques 2019\u202f:"
    " 18\u202f% des GES \u00e9nergie \u2014 32\u202f% du CH\u2084 mondial \u2014"
    " <strong>6\u202f% des GES totaux</strong>."
    " <span class=\"cite\">[AR6 WGIII, p.41]</span></p>"
    "<p><strong>50 \u00e0 80\u202f%</strong> de ces fuites pourraient \u00eatre \u00e9vit\u00e9es"
    " avec les technologies actuelles \u00e0 moins de <strong>50\u202fUSD/tCO\u2082-eq</strong>"
    " (medium confidence). <span class=\"cite\">[AR6 WGIII, p.41]</span></p>"
    "<h3>4. Budget carbone</h3>"
    "<p>Dans les sc\u00e9narios compatibles avec +2\u00b0C, environ"
    " <strong>50\u202f% des r\u00e9serves mondiales de gaz</strong> doivent rester inexploit\u00e9es"
    " \u2014 y compris une large part des gaz non conventionnels."
    " <span class=\"cite\">[AR6 WGIII, p.660 \u2014 McGlade &amp; Ekins 2015]</span></p>"
    "<h3>Synth\u00e8se</h3>"
    "<table>"
    "<tr><th>Dimension</th><th>Valeur / Verdict AR6</th></tr>"
    "<tr><td>Intensit\u00e9 carbone gaz vs charbon</td><td>\u221244\u202f% (537 vs 965)</td></tr>"
    "<tr><td>Seuil de fuite = charbon</td><td>2,7\u202f% \u2014 high confidence</td></tr>"
    "<tr><td>Fuite mesur\u00e9e USA (2018)</td><td>2,3\u202f% \u2014 near threshold</td></tr>"
    "<tr><td>CH\u2084 fugitif / GES mondiaux</td><td>6\u202f% \u2014 high confidence</td></tr>"
    "<tr><td>R\u00e9duction fuites (\u2264 50 USD)</td><td>50\u201380\u202f% \u2014 medium confidence</td></tr>"
    "<tr><td>R\u00e9serves gaz compatibles 2\u00b0C</td><td>\u226450\u202f% des r\u00e9serves</td></tr>"
    "</table>"
)
