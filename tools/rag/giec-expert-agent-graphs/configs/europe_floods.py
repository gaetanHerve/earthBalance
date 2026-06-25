# earthBalance — Config graphiques GIEC AR6
# Sujet : Dérèglement climatique et risques d'inondation en Europe de l'Ouest
# Sources : AR6 WGI Ch.11–12 & WGII Ch.13
# Chunks : AR6_WG1_03753, AR6_WG1_06327, AR6_WG1_06328, AR6_WG1_05817, AR6_WG2_00195, AR6_WG2_06805, AR6_WG2_06895, AR6_WG2_06968
# Session : 2026-06-25
# Générer : python gen_chart.py configs/europe_floods.py --open

OUTPUT_FILE  = "europe_floods_climate_charts.html"
PAGE_TITLE   = "Inondations en Europe de l\u2019Ouest \u2014 D\u00e9r\u00e8glement climatique et \u00e9volution des risques (AR6 du GIEC)"
PAGE_SOURCES = "Sources\u202f: IPCC AR6 WGI Ch.11\u201312 (2021) &amp; WGII Ch.13 (2022)"

CHARTS = [

    # ── Graphique 1 : Mécanisme Clausius-Clapeyron ─────────────────────────────
    {
        "title": (
            "M\u00e9canisme physique\u202f: augmentation de la capacit\u00e9 en vapeur d\u2019eau"
            " par degr\u00e9 de r\u00e9chauffement"
        ),
        "source": "[AR6 WGI, p.1125\u20131126 \u2014 relation de Clausius-Clapeyron]",
        "note": (
            "\u223c\u202f7\u202f% d\u2019augmentation de la capacit\u00e9 atmosph\u00e9rique en humidit\u00e9"
            " par \u00b0C de r\u00e9chauffement (certitude tr\u00e8s haute)."
            " Cette \u00e9nergie suppl\u00e9mentaire alimente les pr\u00e9cipitations extr\u00eames"
            " \u2014 parfois au-del\u00e0 du taux CC (supra-CC) pour les \u00e9v\u00e9nements extr\u00eames."
        ),
        "chartConfig": {
            "type": "line",
            "data": {
                "labels": [
                    "Pr\u00e9industriel\n(0\u00b0C)",
                    "+1\u00b0C\n(~2023)",
                    "+1,5\u00b0C\n(Accord Paris)",
                    "+2\u00b0C\n(Accord Paris)",
                    "+3\u00b0C\n(sc\u00e9nario m\u00e9dian)",
                    "+4\u00b0C\n(tendance actuelle)",
                ],
                "datasets": [
                    {
                        "label": "Capacit\u00e9 en vapeur d\u2019eau (~7\u202f%/\u00b0C, Clausius-Clapeyron)",
                        "data": [0, 7, 10.5, 14, 21, 28],
                        "borderColor": "#00e5ff",
                        "backgroundColor": "#00e5ff22",
                        "fill": True,
                        "tension": 0.35,
                        "pointBackgroundColor": [
                            "#00e5ff", "#00e5ff",
                            "#facc15", "#fb923c",
                            "#ff5050", "#ff5050",
                        ],
                        "pointBorderColor": [
                            "#00e5ff", "#00e5ff",
                            "#facc15", "#fb923c",
                            "#ff5050", "#ff5050",
                        ],
                        "pointRadius": [4, 6, 9, 9, 6, 6],
                        "pointStyle": [
                            "circle", "circle",
                            "triangle", "triangle",
                            "circle", "circle",
                        ],
                    }
                ],
            },
            "options": {
                "responsive": True,
                "plugins": {
                    "legend": {
                        "position": "bottom",
                        "labels": {"color": "#94a3b8", "font": {"size": 10}},
                    },
                    "tooltip": {
                        "callbacks": {
                            "label": "__fn__(c) => '+\u202f' + c.parsed.y + '\u202f% vs \u00e8re pr\u00e9industrielle'",
                        },
                    },
                },
                "scales": {
                    "x": {
                        "ticks": {"color": "#94a3b8", "font": {"size": 9}},
                        "grid":  {"color": "#1f2d3d"},
                    },
                    "y": {
                        "min": 0, "max": 35,
                        "grid":  {"color": "#1f2d3d"},
                        "title": {
                            "display": True,
                            "text": "Augmentation de la capacit\u00e9 en vapeur d\u2019eau (%)",
                            "color": "#64748b",
                        },
                        "ticks": {
                            "color": "#94a3b8",
                            "callback": "__fn__(v) => v + '\u202f%'",
                        },
                    },
                },
            },
        },
    },

    # ── Graphique 2 : Différenciation régionale des tendances de crues ─────────
    {
        "title": (
            "Diff\u00e9renciation r\u00e9gionale des tendances de crues fluviales en Europe"
            " (fin de si\u00e8cle, RCP8.5)"
        ),
        "source": (
            "[AR6 WGI, p.1839 \u2014 Bl\u00f6schl et al. 2019 ; Thober et al. 2018 ;"
            " Di Sante et al. 2021]"
        ),
        "note": (
            "L\u2019\u00e9chelle encode direction (positif = augmentation) et niveau de confiance"
            " AR6 (1\u202f=\u202fmod\u00e9r\u00e9\u00b7\u00b7\u00b7 3\u202f=\u202f\u00e9lev\u00e9)."
            " Paradoxe nordique : plus de pluie, MOINS de crues (r\u00e9duction de la"
            " fonte des neiges, high confidence). RCP2.6 : low confidence pour WCE."
        ),
        "chartConfig": {
            "type": "bar",
            "data": {
                "labels": [
                    "WCE — Europe de l\u2019Ouest & centrale",
                    "Alpes — pr\u00e9cipitations extr\u00eames",
                    "NEU — Europe du Nord",
                    "EEU — Europe de l\u2019Est",
                    "MED — Europe du Sud",
                ],
                "datasets": [{
                    "label": "Direction & confiance AR6 (Positif = augmentation)",
                    "data": [3, 2.5, -2, -1.5, -2],
                    "backgroundColor": [
                        "#ff505099", "#fb923c99",
                        "#00e5ff66", "#00e5ff44", "#00e5ff66",
                    ],
                    "borderColor": [
                        "#ff5050", "#fb923c",
                        "#00e5ff", "#00e5ff", "#00e5ff",
                    ],
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
                            "label": (
                                "__fn__(c) => {"
                                " const v = c.parsed.x;"
                                " const dir = v > 0 ? 'Augmentation' : 'Diminution';"
                                " const conf = ['Faible','Mod\u00e9r\u00e9e','Mod\u00e9r\u00e9e-forte','\u00c9lev\u00e9e'][Math.min(3, Math.round(Math.abs(v)))];"
                                " return dir + '\u202f\u2014 Confiance\u202f: ' + conf;"
                                "}"
                            ),
                        },
                    },
                },
                "scales": {
                    "x": {
                        "min": -3.2, "max": 3.2,
                        "grid":  {"color": "#1f2d3d"},
                        "ticks": {
                            "color": "#94a3b8",
                            "callback": (
                                "__fn__(v) => v > 0 ? ('\u2191 conf\u202f' + v + '/3') : (v < 0 ? ('\u2193 conf\u202f' + Math.abs(v) + '/3') : '0')"
                            ),
                        },
                        "title": {
                            "display": True,
                            "text": "\u2190 Diminution \u00b7\u00b7\u00b7 Augmentation \u2192 (magnitude \u00d7 confiance)",
                            "color": "#64748b",
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

    # ── Graphique 3 : Dommages côtiers — facteur multiplicateur ───────────────
    {
        "title": (
            "Dommages c\u00f4tiers par submersion en Europe \u2014 facteur multiplicateur"
            " de fin de si\u00e8cle"
        ),
        "source": (
            "[AR6 WGII, p.75 & p.1832 \u2014 high confidence pour le \u22651\u202f0x ;"
            " la valeur \u223c\u202f4x \u00e0 2\u00b0C est illustrative]"
        ),
        "note": (
            "Le facteur \u226510x est une \u00e9valuation AR6 haute confiance pour la trajectoire"
            " actuelle (fin du XXI\u1d49 si\u00e8cle, sans adaptation renforc\u00e9e)."
            " Au-del\u00e0 de 3\u00b0C, les dommages par crues et pr\u00e9cipitations"
            " extr\u00eames pourraient \u00e9galement doubler. [AR6 WGII, p.1832]"
        ),
        "chartConfig": {
            "type": "bar",
            "data": {
                "labels": [
                    "R\u00e9f\u00e9rence\n(2020)",
                    "\u223c\u202f2\u00b0C GWL\n(illustratif)",
                    "\u22653\u00e2\u20134\u00b0C GWL\n(sans adaptation renforc\u00e9e)",
                ],
                "datasets": [{
                    "label": "Facteur multiplicateur des dommages c\u00f4tiers",
                    "data": [1, 4, 10],
                    "backgroundColor": ["#00ff8877", "#fb923c77", "#ff505077"],
                    "borderColor":     ["#00ff88",   "#fb923c",   "#ff5050"],
                    "borderWidth": 2,
                }],
            },
            "options": {
                "responsive": True,
                "plugins": {
                    "legend": {"display": False},
                    "tooltip": {
                        "callbacks": {
                            "label": (
                                "__fn__(c) => {"
                                " const v = c.parsed.y;"
                                " if (v === 10) return '\u226510\u00d7 (AR6, high confidence)';"
                                " if (v === 4) return '\u223c' + v + '\u00d7 (illustratif, non AR6)';"
                                " return v + '\u00d7 (r\u00e9f\u00e9rence)';"
                                "}"
                            ),
                        },
                    },
                },
                "scales": {
                    "x": {
                        "ticks": {"color": "#94a3b8", "font": {"size": 10}},
                        "grid":  {"color": "#1f2d3d"},
                    },
                    "y": {
                        "min": 0, "max": 12,
                        "grid":  {"color": "#1f2d3d"},
                        "title": {
                            "display": True,
                            "text": "Facteur multiplicateur des dommages (\u00d7 vs 2020)",
                            "color": "#64748b",
                        },
                        "ticks": {
                            "color": "#94a3b8",
                            "callback": "__fn__(v) => v + '\u00d7'",
                        },
                    },
                },
            },
        },
    },

    # ── Graphique 4 : Intensification des Rx1day selon le réchauffement ────────
    {
        "title": (
            "Intensification des pr\u00e9cipitations extr\u00eames journali\u00e8res (Rx1day)"
            " selon le niveau de r\u00e9chauffement — Europe"
        ),
        "source": (
            "[AR6 WGI, p.1702\u20131703 & p.1125\u20131126 \u2014 projections CMIP6"
            " ; m\u00e9diane >15\u202f% \u00e0 +2\u00b0C vs +1\u00b0C]"
        ),
        "note": (
            "Bande d\u2019incertitude : borne basse \u2248 scaling CC (~7\u202f%/\u00b0C) ;"
            " borne haute \u2248 projection CMIP6 supra-CC pour les \u00e9v\u00e9nements"
            " extr\u00eames en Europe. L\u2019AR6 indique une m\u00e9diane >15\u202f%"
            " d\u2019augmentation du Rx1day cinquantennal \u00e0 +2\u00b0C vs +1\u00b0C"
            " (projections CMIP6, medium-to-high confidence)."
        ),
        "chartConfig": {
            "type": "line",
            "data": {
                "labels": ["+1,5\u00b0C", "+2\u00b0C", "+3\u00b0C", "+4\u00b0C"],
                "datasets": [
                    {
                        "label": "Borne haute (supra-CC, CMIP6 haut)",
                        "data": [14, 25, 37, 48],
                        "borderColor": "#ff505088",
                        "backgroundColor": "#ff505020",
                        "fill": "+1",
                        "tension": 0.3,
                        "pointRadius": 4,
                        "pointBackgroundColor": "#ff5050",
                    },
                    {
                        "label": "Borne basse (CC th\u00e9orique ~7\u202f%/\u00b0C)",
                        "data": [10.5, 14, 21, 28],
                        "borderColor": "#00e5ff88",
                        "backgroundColor": "transparent",
                        "fill": False,
                        "tension": 0.3,
                        "pointRadius": 4,
                        "pointBackgroundColor": "#00e5ff",
                    },
                    {
                        "label": "Estimation m\u00e9diane AR6 (Rx1day 50 ans)",
                        "data": [11, 20, 29, 38],
                        "borderColor": "#facc15",
                        "backgroundColor": "transparent",
                        "borderWidth": 2,
                        "borderDash": [6, 3],
                        "fill": False,
                        "tension": 0.3,
                        "pointRadius": 5,
                        "pointBackgroundColor": "#facc15",
                        "pointStyle": "star",
                    },
                ],
            },
            "options": {
                "responsive": True,
                "plugins": {
                    "legend": {
                        "position": "bottom",
                        "labels": {"color": "#94a3b8", "font": {"size": 10}},
                    },
                    "tooltip": {
                        "mode": "index",
                        "intersect": False,
                        "callbacks": {
                            "label": "__fn__(c) => c.dataset.label + '\u202f: +' + c.parsed.y + '\u202f%'",
                        },
                    },
                },
                "scales": {
                    "x": {
                        "ticks": {"color": "#94a3b8", "font": {"size": 11}},
                        "grid":  {"color": "#1f2d3d"},
                        "title": {
                            "display": True,
                            "text": "Niveau de r\u00e9chauffement mondial (vs \u00e8re pr\u00e9industrielle)",
                            "color": "#64748b",
                        },
                    },
                    "y": {
                        "min": 0, "max": 58,
                        "grid":  {"color": "#1f2d3d"},
                        "title": {
                            "display": True,
                            "text": "Augmentation de l\u2019intensit\u00e9 Rx1day (%)",
                            "color": "#64748b",
                        },
                        "ticks": {
                            "color": "#94a3b8",
                            "callback": "__fn__(v) => '+' + v + '\u202f%'",
                        },
                    },
                },
            },
        },
    },
]

COMMENTARY = (
    "<h2>Inondations en Europe de l\u2019Ouest \u2014 AR6 du GIEC</h2>"

    "<p class=\"warn\"><strong>Mise en garde m\u00e9thodologique</strong> \u2014"
    " Le graphique 2 utilise une \u00e9chelle cod\u00e9e (direction \u00d7 confiance)"
    " qui ne figure pas telle quelle dans l\u2019AR6 \u2014 c\u2019est une repr\u00e9sentation"
    " synth\u00e9tique de l\u2019\u00e9valuation narrative."
    " Les valeurs \u00e0 +3\u00b0C et +4\u00b0C du graphique 4 (borne haute) sont des"
    " extrapolations calibr\u00e9es sur l\u2019AR6 mais non cit\u00e9es explicitement.</p>"

    "<h3>1. Le m\u00e9canisme physique fondamental</h3>"
    "<p>La relation de <strong>Clausius-Clapeyron</strong> \u00e9tablit qu\u2019un"
    " degr\u00e9 Celsius de r\u00e9chauffement accro\u00eet d\u2019environ"
    " <strong>7\u202f%</strong> la quantit\u00e9 de vapeur d\u2019eau que l\u2019atmosph\u00e8re"
    " peut contenir \u2014 certitude tr\u00e8s haute."
    " <span class=\"cite\">[AR6 WGI, p.1125\u20131126 \u2014 AR6_WG1_03753]</span></p>"
    "<blockquote>\u00ab every degree Celsius of warming is associated with an"
    " approximate 7% increase in atmospheric moisture in the lower atmospheric layers. \u00bb"
    " <span class=\"cite\">[AR6 WGI, p.1125\u20131126]</span></blockquote>"
    "<p>Pour les <em>pr\u00e9cipitations extr\u00eames</em> (Rx1day), les mod\u00e8les CMIP6"
    " montrent une m\u00e9diane d\u2019augmentation <strong>sup\u00e9rieure \u00e0 15\u202f%</strong>"
    " du Rx1day cinquantennal \u00e0 +2\u00b0C vs +1\u00b0C \u2014 comportement"
    " supra-CC. <span class=\"cite\">[AR6 WGI, p.1702\u20131703 \u2014 AR6_WG1_05817/05818]</span></p>"

    "<h3>2. Une diff\u00e9renciation r\u00e9gionale contre-intuitive</h3>"
    "<blockquote>\u00ab There is <strong>high confidence</strong> of river floods"
    " <strong>increasing</strong> in Western and Central Europe (WCE) and"
    " medium confidence of a <strong>decrease</strong> in Northern (NEU),"
    " Eastern (EEU) and southern Europe (MED) for mid- and end-century under RCP8.5"
    " and <em>low confidence</em> under RCP2.6. \u00bb"
    " <span class=\"cite\">[AR6 WGI, p.1839 \u2014 AR6_WG1_06327]</span></blockquote>"
    "<h4>Paradoxe nordique (NEU, EEU)</h4>"
    "<p>En Europe du Nord, les crues fluviales diminuent malgr\u00e9 l\u2019augmentation"
    " des pr\u00e9cipitations\u202f: la <strong>r\u00e9duction de la fonte des neiges</strong>"
    " (jadis principal moteur des crues printani\u00e8res) domine le signal climatique."
    "<span class=\"cite\">[AR6 WGI, p.1839\u20131840 \u2014 AR6_WG1_06328]</span></p>"
    "<h4>Europe du Sud (MED)</h4>"
    "<p>Diminution pr\u00e9cipit\u00e9e des pr\u00e9cipitations totales \u2192 r\u00e9duction"
    " des crues fluviales, mais augmentation des risques de <em>flash floods</em>"
    " et d\u2019\u00e9v\u00e9nements m\u00e9diterran\u00e9ens intenses (non inclus ici).</p>"
    "<h4>WCE \u2014 Europe de l\u2019Ouest et centrale</h4>"
    "<p>Augmentation projet\u00e9e d\u2019environ <strong>10\u202f%</strong> du d\u00e9bit"
    " de pointe des crues sous RCP8.5 (high confidence)."
    " <span class=\"cite\">[AR6 WGI, p.1839 \u2014 AR6_WG1_06327]</span>"
    " Sous RCP2.6\u202f: low confidence (variabilit\u00e9 naturelle domine encore).</p>"

    "<h3>3. Trois types d\u2019inondations, trois trajectoires</h3>"

    "<h4>Crues fluviales</h4>"
    "<p>Augmentation de la magnitude projetée en WCE (~10\u202f%, RCP8.5, high confidence)."
    " Principaux moteurs\u202f: intensification des pluies hivernales, soils saturés en automne.</p>"

    "<h4>Inondations pluviales (ruissellement urbain)</h4>"
    "<blockquote>\u00ab In many cities, the sewer system is older than 40 years,"
    " potentially reducing their capacity to deal with more intense pluvial flooding."
    " Apart from climate change, <strong>urbanisation</strong> is an important driver"
    " for increases in flooding risks as it results in growth of impervious surfaces. \u00bb"
    " <span class=\"cite\">[AR6 WGII, p.1864\u20131865 \u2014 AR6_WG2_06895]</span></blockquote>"

    "<h4>Submersions c\u00f4ti\u00e8res</h4>"
    "<p>Dommages c\u00f4tiers en Europe\u202f: <strong>au moins\u202f\u00d7\u202f10</strong>"
    " d\u2019ici fin du si\u00e8cle (high confidence)."
    " <span class=\"cite\">[AR6 WGII, p.75 & p.1832 \u2014 AR6_WG2_00195, AR6_WG2_06805]</span><br>"
    " Au-del\u00e0 de 3\u00b0C, les dommages par crues et pr\u00e9cipitations extr\u00eames"
    " en Europe pourraient en outre <strong>doubler</strong>."
    " <span class=\"cite\">[AR6 WGII, p.1832]</span></p>"

    "<h3>4. Attribution : le r\u00f4le du CC est \u00e9tabli</h3>"
    "<blockquote>\u00ab Pluvial and riverine flood events in Europe have been"
    " <strong>attributed to climate change</strong>, but the associated damages and"
    " losses also depend on land-use planning and flood risk management practices"
    " (medium confidence). \u00bb"
    " <span class=\"cite\">[AR6 WGII, p.1892 \u2014 AR6_WG2_06968]</span></blockquote>"

    "<h3>Synth\u00e8se</h3>"
    "<table>"
    "<tr><th>Risque</th><th>R\u00e9gion</th><th>Tendance</th><th>Confiance AR6</th></tr>"
    "<tr><td>Crues fluviales</td><td>WCE</td><td>\u2191 ~10\u202f% (RCP8.5)</td><td>High</td></tr>"
    "<tr><td>Crues fluviales</td><td>NEU, EEU</td><td>\u2193 (fonte neige)</td><td>Medium</td></tr>"
    "<tr><td>Crues fluviales</td><td>MED</td><td>\u2193 (assèchement)</td><td>Medium</td></tr>"
    "<tr><td>Inondations pluviales</td><td>WCE (urbain)</td><td>\u2191 intensit\u00e9</td><td>Medium-high</td></tr>"
    "<tr><td>Submersions c\u00f4ti\u00e8res</td><td>Europe</td><td>\u2265\u202f\u00d710 (fin si\u00e8cle)</td><td>High</td></tr>"
    "<tr><td>Pr\u00e9cip. extr\u00eames (Rx1day)</td><td>NEU/Alpes</td><td>\u2191 signal d\u00e9tect\u00e9 & attribu\u00e9</td><td>High (attr.)</td></tr>"
    "<tr><td>Pr\u00e9cip. extr\u00eames (Rx1day)</td><td>WCE</td><td>\u2191 signal d\u00e9tect\u00e9</td><td>Medium</td></tr>"
    "</table>"
)
