/**
 * _gen_charts.cjs — Moteur de rendu declaratif pour graphiques GIEC AR6
 * -----------------------------------------------------------------------
 * Usage : node tools/rag/giec-expert-agent-graphs/_gen_charts.cjs
 *
 * WORKFLOW
 * --------
 * 1. L'agent peuple charts[] (entre les marqueurs BEGIN/END) et met a jour
 *    le bloc render() en bas du fichier (fichier, titre, sources, commentary)
 * 2. node _gen_charts.cjs -> genere le HTML dans ce dossier et l'ouvre
 * 3. Le script se reecrit automatiquement pour vider charts[]
 * 4. Valider ou rejeter le HTML genere
 *
 * AJOUTER UN GRAPHIQUE
 * --------------------
 *   charts.push({
 *     title:      'Titre affiche dans la carte',
 *     source:     '[AR6 WGII, p.XX — Auteur, annee]',
 *     note:       'Commentaire methodologique.',
 *     chartConfig: { type: 'bar', data: { ... }, options: { ... } }
 *   });
 *
 * PANNEAU LATERAL (commentary)
 * ----------------------------
 * Passer une chaine HTML au parametre commentary de render() pour afficher
 * un panneau lateral depliable avec l'analyse textuelle correspondante.
 * Laisser '' pour desactiver le panneau.
 *
 * HELPERS DISPONIBLES
 * -------------------
 *   readCsv(relPath)              Lit CSV relatif a la racine du projet
 *   loadSspTemperatures(keep, colors, labels)
 *     Retourne datasets Chart.js (type 'line') depuis le CSV OWID SSP.
 *     Scenarios : 'SSP1 - 1.9', 'SSP1 - 2.6', 'SSP2 - 4.5', 'SSP3 - 6.0',
 *                 'SSP5 - Baseline' (et variantes SSP2/3/4/5)
 *
 * THEME T (valeurs hex directement dans chartConfig)
 * -------------------
 *   T.bg '#0a0f1e'  T.card '#111827'  T.border '#1f2d3d'  T.deep '#334155'
 *   T.text '#e2e8f0'  T.muted '#94a3b8'  T.faint '#64748b'
 *   T.green '#00ff88'  T.cyan '#00e5ff'  T.red '#ff5050'
 *   T.orange '#fb923c'  T.yellow '#facc15'
 *
 * ──────────────────────────────────────────────────────────────────────────────
 * EXEMPLES COMMENTES (graphiques eau & climat — session 2026-06-25)
 * ──────────────────────────────────────────────────────────────────────────────
 *
 * // Graphique ligne SSP temperature :
 * // const tempDatasets = loadSspTemperatures(
 * //   ['SSP1 - 1.9', 'SSP1 - 2.6', 'SSP2 - 4.5', 'SSP3 - 6.0', 'SSP5 - Baseline'],
 * //   {'SSP1 - 1.9':'#00ff88','SSP1 - 2.6':'#00e5ff','SSP2 - 4.5':'#facc15','SSP3 - 6.0':'#fb923c','SSP5 - Baseline':'#ff5050'},
 * //   {'SSP1 - 1.9':'SSP1-1.9 (tres ambitieux)','SSP1 - 2.6':'SSP1-2.6 (ambitieux)',
 * //    'SSP2 - 4.5':'SSP2-4.5 (politiques actuelles)','SSP3 - 6.0':'SSP3-6.0 (fragmentation)',
 * //    'SSP5 - Baseline':'SSP5-Baseline (fossiles sans limite)'}
 * // );
 * // {
 * //   title: 'Projections de temperature mondiale par scenario SSP (2005-2100)',
 * //   source: '[IPCC AR6 WGI, Figure SPM.4 — CEDA, CC-BY-4.0]',
 * //   note:   'Seuils 1,5C et 2C de l\'Accord de Paris en pointilles.',
 * //   chartConfig: {
 * //     type: 'line',
 * //     data: { datasets: [...tempDatasets,
 * //       {label:'Seuil 1,5C',data:[{x:2005,y:1.5},{x:2100,y:1.5}],borderColor:'#ffffff66',borderDash:[6,4],borderWidth:1.5,pointRadius:0,fill:false},
 * //       {label:'Seuil 2C',  data:[{x:2005,y:2  },{x:2100,y:2  }],borderColor:'#ffffff44',borderDash:[3,4],borderWidth:1.5,pointRadius:0,fill:false},
 * //     ]},
 * //     options: { responsive:true,
 * //       plugins:{ legend:{position:'bottom',labels:{boxWidth:12,font:{size:10},color:'#94a3b8'}}, tooltip:{mode:'index',intersect:false} },
 * //       scales:{ x:{type:'linear',min:2005,max:2100,ticks:{stepSize:10},title:{display:true,text:'Annee',color:'#64748b'}},
 * //                y:{min:0.5,max:6,title:{display:true,text:'C / niveau pre-industriel',color:'#64748b'},grid:{color:'#1f2d3d'}} }
 * //     },
 * //   },
 * // },
 * //
 * // Pertes PIB penuries eau (bar) :
 * // { title:'Pertes de PIB projetees liees a la penurie d\'eau (sans action)',
 * //   source:'[AR6 WGII, p.664-665 & p.1531 — World Bank 2016]',
 * //   note:'Avec tarification et regulation, pertes 2050 inversees en +0,09% PIB.',
 * //   chartConfig:{ type:'bar', data:{ labels:['Monde (2050)','Asie du Sud (2050)','Asie du Sud (2100)','Europe a 3C'],
 * //     datasets:[{data:[-0.49,-2,-9,-4],backgroundColor:['#ff505099','#fb923c99','#ff505066','#facc1599'],
 * //       borderColor:['#ff5050','#fb923c','#ff5050','#facc15'],borderWidth:1.5}]},
 * //     options:{ responsive:true, plugins:{legend:{display:false},
 * //       tooltip:{callbacks:{label:(c)=>c.dataIndex===3?'Pertes x4 vs 1,5C':c.parsed.y+'% du PIB'}}},
 * //       scales:{ x:{ticks:{color:'#94a3b8',font:{size:10}},grid:{color:'#1f2d3d'}},
 * //                y:{title:{display:true,text:'% de PIB',color:'#64748b'},grid:{color:'#1f2d3d'}} } },
 * //   },
 * // },
 * //
 * // Population penurie eau (doughnut) :
 * // { title:'Population mondiale exposee a la penurie d\'eau severe (2020)',
 * //   source:'[AR6 WGII, p.570 — medium confidence]',
 * //   note:'~4 Md de personnes exposees a un stress hydrique severe au moins une partie de l\'annee.',
 * //   chartConfig:{ type:'doughnut', data:{ labels:['Exposes (~4 Md)','Non exposes (~4 Md)'],
 * //     datasets:[{data:[50,50],backgroundColor:['#ff505099','#1f2d3d'],borderColor:['#ff5050','#334155'],borderWidth:2,hoverOffset:8}]},
 * //     options:{ responsive:true,cutout:'65%', plugins:{legend:{position:'bottom',labels:{color:'#94a3b8',font:{size:11}}},
 * //       tooltip:{callbacks:{label:(c)=>c.label+' ('+c.parsed+'% pop. mondiale)'}}} },
 * //   },
 * // },
 * //
 * // Gouvernance transfrontaliere eau (bar) :
 * // { title:'Gouvernance transfrontaliere de l\'eau — etat des lieux',
 * //   source:'[AR6 WGII, p.670 — McCracken & Meyer 2018]',
 * //   note:'Sur 310 bassins fluviaux internationaux, 50%+ n\'ont aucun cadre cooperatif.',
 * //   chartConfig:{ type:'bar', data:{ labels:['Bassins partages entre pays (186/310)','Bassins SANS cadre cooperatif (155+)','Bassins AVEC cadre cooperatif (<155)'],
 * //     datasets:[{data:[186,155,155],backgroundColor:['#00e5ff55','#ff505099','#00ff8899'],borderColor:['#00e5ff','#ff5050','#00ff88'],borderWidth:1.5}]},
 * //     options:{ responsive:true, plugins:{legend:{display:false}},
 * //       scales:{ x:{ticks:{color:'#94a3b8',font:{size:10}},grid:{color:'#1f2d3d'}},
 * //                y:{title:{display:true,text:'Nombre de bassins (total: 310)',color:'#64748b'},grid:{color:'#1f2d3d'},max:220} } },
 * //   },
 * // },
 */

'use strict';
const fs   = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// ── Chemins ───────────────────────────────────────────────────────────────────
const ROOT    = path.resolve(__dirname, '../../..');
const OUT_DIR = __dirname;
const CHARTJS = path.join(ROOT, 'node_modules/chart.js/dist/chart.umd.min.js');

// ── Theme earthBalance ────────────────────────────────────────────────────────
const T = {
  bg: '#0a0f1e', card: '#111827', border: '#1f2d3d', deep: '#334155',
  text: '#e2e8f0', muted: '#94a3b8', faint: '#64748b',
  green: '#00ff88', cyan: '#00e5ff', red: '#ff5050',
  orange: '#fb923c', yellow: '#facc15',
};

// ── Helpers CSV ───────────────────────────────────────────────────────────────

function readCsv(relPath) {
  return fs.readFileSync(path.join(ROOT, relPath), 'utf8')
    .trim().split('\n').slice(1).map(l => l.split(','));
}

function loadSspTemperatures(keep, colors, labels) {
  const CSV = 'tools/rag/data_sources/external_data/shared-economic-pathways'
    + '/global-average-temperature-increase-relative-to-the-pre-industrial-era'
    + '/global-average-temperature-increase-relative-to-the-pre-industrial-era.csv';
  const map = {};
  readCsv(CSV).forEach(([entity, year, temp]) => {
    if (!map[entity]) map[entity] = { years: [], temps: [] };
    map[entity].years.push(parseInt(year));
    map[entity].temps.push(parseFloat(parseFloat(temp).toFixed(2)));
  });
  return keep.map(k => ({
    label: labels[k], borderColor: colors[k], backgroundColor: colors[k] + '22',
    borderWidth: 2, pointRadius: 0, tension: 0.3, fill: false,
    data: map[k].years.map((y, i) => ({ x: y, y: map[k].temps[i] })),
  }));
}

// ── Auto-reset : vide charts[] dans ce fichier source ────────────────────────

function resetChartsInSource() {
  const content = fs.readFileSync(__filename, 'utf8');
  const cleared = content.replace(
    /(\/\/ ──BEGIN-CHARTS──\n)[\s\S]*?(\/\/ ──END-CHARTS──)/,
    '$1const charts = [];\n$2'
  );
  fs.writeFileSync(__filename, cleared, 'utf8');
  console.log('  charts[] vide dans _gen_charts.cjs.');
}

// ── Moteur de rendu ───────────────────────────────────────────────────────────

/**
 * Genere un fichier HTML standalone avec graphiques + panneau lateral optionnel.
 * @param {string}   filename    - nom du fichier de sortie
 * @param {string}   title       - titre H1 de la page
 * @param {string}   subtitle    - sous-titre / credits sources
 * @param {Object[]} charts      - tableau de definitions declaratives
 * @param {string}   commentary  - HTML du panneau lateral ('' = panneau absent)
 * @param {boolean}  autoOpen    - ouvre dans le navigateur apres generation
 */
function render(filename, title, subtitle, charts, commentary, autoOpen) {
  if (commentary === undefined) commentary = '';
  if (autoOpen === undefined) autoOpen = true;

  if (charts.length === 0) {
    console.warn('\n charts[] est vide — rien a generer.\n');
    return;
  }

  const chartjsCode = fs.readFileSync(CHARTJS, 'utf8');
  const outputPath  = path.join(OUT_DIR, filename);

  const cards = charts.map((c, i) => `
  <div class="card">
    <h2>${c.title}</h2>
    <p class="source">${c.source}</p>
    <canvas id="c${i}" height="260"></canvas>
    <p class="note">${c.note}</p>
  </div>`).join('\n');

  const scripts = charts.map((c, i) =>
    `new Chart(document.getElementById('c${i}'), ${JSON.stringify(c.chartConfig)});`
  ).join('\n\n');

  const html = `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<title>${title}</title>
<style>
body{background:${T.bg};color:${T.text};font-family:system-ui,sans-serif;margin:0;padding:24px}
h1{color:${T.cyan};font-size:1.4rem;text-align:center;margin-bottom:4px}
.subtitle{color:${T.muted};font-size:.85rem;text-align:center;margin-bottom:32px}
.grid{display:grid;grid-template-columns:1fr 1fr;gap:24px;max-width:1200px;margin:0 auto}
.card{background:${T.card};border:1px solid ${T.border};border-radius:12px;padding:20px}
.card h2{color:${T.cyan};font-size:.95rem;margin:0 0 4px}
.card .source{color:${T.faint};font-size:.72rem;margin:0 0 14px}
.note{color:${T.muted};font-size:.75rem;margin-top:10px;line-height:1.5}
@media(max-width:700px){.grid{grid-template-columns:1fr}}
#panel-btn{position:fixed;bottom:20px;right:20px;background:#00e5ff;color:#0a0f1e;border:none;border-radius:24px;padding:10px 18px;font-size:.85rem;font-weight:600;cursor:pointer;z-index:200;box-shadow:0 2px 12px #00e5ff44;transition:background .2s}
#panel-btn:hover{background:#00ff88}
#side-panel{position:fixed;top:0;right:-460px;width:440px;height:100vh;background:#111827;border-left:1px solid #1f2d3d;overflow-y:auto;transition:right .35s cubic-bezier(.4,0,.2,1);z-index:100;padding:24px 20px 40px;box-sizing:border-box}
#side-panel.open{right:0}
#panel-close{background:none;border:none;color:#94a3b8;font-size:1.1rem;cursor:pointer;float:right;padding:0;margin:0 0 12px 0}
#panel-close:hover{color:#00e5ff}
.panel-content h2{color:#00e5ff;font-size:1rem;margin:0 0 14px;padding-top:4px}
.panel-content h3{color:#00ff88;font-size:.88rem;margin:18px 0 6px;border-top:1px solid #1f2d3d;padding-top:10px}
.panel-content h4{color:#facc15;font-size:.82rem;margin:10px 0 4px}
.panel-content p{font-size:.8rem;color:#cbd5e1;line-height:1.65;margin:0 0 8px}
.panel-content blockquote{border-left:3px solid #00e5ff;margin:8px 0;padding:4px 12px;color:#94a3b8;font-style:italic;font-size:.78rem;background:#0a0f1e;border-radius:0 4px 4px 0}
.panel-content .cite{color:#64748b;font-size:.7rem}
.panel-content table{width:100%;border-collapse:collapse;font-size:.75rem;margin:10px 0}
.panel-content th{background:#1f2d3d;color:#00e5ff;padding:5px 8px;text-align:left}
.panel-content td{padding:5px 8px;border-bottom:1px solid #1f2d3d;color:#cbd5e1}
.panel-content .warn{background:#ff500011;border:1px solid #ff500044;border-radius:6px;padding:8px 10px;color:#fca5a5;font-size:.78rem;margin:0 0 10px}
</style>
</head>
<body>
<h1>${title}</h1>
<p class="subtitle">${subtitle}</p>
<div class="grid">
${cards}
</div>
${commentary ? `
<button id="panel-btn" onclick="document.getElementById('side-panel').classList.toggle('open')">&#128203;&nbsp;Analyse GIEC</button>
<aside id="side-panel">
  <button id="panel-close" onclick="document.getElementById('side-panel').classList.remove('open')">&#x2715; Fermer</button>
  <div class="panel-content">${commentary}</div>
</aside>` : ''}
<script>${chartjsCode}</script>
<script>
Chart.defaults.color='${T.muted}';
Chart.defaults.borderColor='${T.border}';
${scripts}
${commentary ? `document.addEventListener('keydown',(e)=>{if(e.key==='Escape')document.getElementById('side-panel').classList.remove('open');});` : ''}
</script>
</body>
</html>`;

  fs.writeFileSync(outputPath, html);
  console.log('\n Fichier genere : ' + outputPath);
  console.log('  Ouvrir dans le navigateur pour valider avant tout usage.\n');

  resetChartsInSource();

  if (autoOpen) {
    try { execSync('start "" "' + outputPath + '"'); } catch (_) {}
  }
}

// ── Graphiques a produire ─────────────────────────────────────────────────────
// Peuple ce tableau, puis execute : node tools/rag/giec-expert-agent-graphs/_gen_charts.cjs
// Il est automatiquement vide apres generation du HTML.

// ──BEGIN-CHARTS──
const charts = [];
// ──END-CHARTS──

// ── Panneau lateral — analyse AR6 ────────────────────────────────────────────
const COMMENTARY = '<h2>Géopolitique, ressources critiques &amp; ENR — AR6 GIEC</h2>'
  + '<div class="warn"><strong>Note méthodologique (graphiques 1 &amp; 2)</strong> — Les pourcentages de concentration (graphique 1) et les trajectoires de demande (graphique 2) sont des données indicatives (USGS 2022 / IEA WEO 2021). Le concept et les ordres de grandeur sont validés high confidence par AR6 WGIII Ch.10, mais les valeurs numériques exactes ne figurent pas dans les chunks AR6 indexés. Le graphique 3 (budget carbone) s’appuie directement sur les chunks AR6_WG3_02014 et AR6_WG3_06292.</div>'
  + '<h3>1. Dépendances minérales documentées par l’AR6</h3>'
  + '<blockquote>"A low-carbon energy system transition will increase the demand for these minerals to be used in technologies like wind turbines, PV cells, and batteries [...] Reliance on these minerals has raised questions about possible constraints to a low-carbon energy system transition, including supply chain disruptions."</blockquote>'
  + '<p class="cite">[AR6 WGIII, p.650–651 — chunk AR6_WG3_02072]</p>'
  + '<p>Minéraux identifiés explicitement dans AR6 WGIII Ch.10 :</p>'
  + '<table><tr><th>Technologie</th><th>Minéraux critiques</th></tr>'
  + '<tr><td>Turbines éoliennes</td><td>Neodymium, dysprosium (aimants permanents)</td></tr>'
  + '<tr><td>Batteries (VE, stockage)</td><td>Lithium, cobalt, nickel, manganèse</td></tr>'
  + '<tr><td>Solaire PV</td><td>Cadmium, tellure, sélénium, gallium, indium</td></tr>'
  + '</table>'
  + '<p class="cite">[AR6 WGIII, p.1129 — chunk AR6_WG3_03783]</p>'
  + '<h3>2. Quasi-monopole de la Chine sur les terres rares</h3>'
  + '<blockquote>"China has a near-monopoly on REE processing, though other mines and manufacturing facilities are now responding to these constrained markets [...] China, on the other hand, is reliant on other nations for the supply of other critical metals, particularly cobalt and lithium for batteries."</blockquote>'
  + '<p class="cite">[AR6 WGIII, p.1130–1131 — chunk AR6_WG3_03787]</p>'
  + '<p>L’AR6 documente une <strong>interdépendance asymétrique</strong> : la Chine contrôle le raffinage des REE lourdes (essentielles aux éoliennes), mais dépend de la RDC et de l’Amérique du Sud pour le cobalt et le lithium. Cette structure crée des points de friction géopolitique multiples dans la chaîne de valeur ENR.</p>'
  + '<h3>3. Réserves insuffisantes pour le scénario de transition</h3>'
  + '<blockquote>"Used battery technologies and the known reserves currently being exploited are not compatible with the transition scenario due to insufficient cobalt and lithium reserves (Månberger &amp; Stenqvist 2018)."</blockquote>'
  + '<p class="cite">[AR6 WGIII, p.1757 — chunk AR6_WG3_06182]</p>'
  + '<p>L’AR6 identifie une voie de sortie : le recyclage en circuit fermé des batteries Li-ion. <em>"Given the high degree of potential recyclability of LIBs, a near closed-loop system in the future would be a feasible opportunity to minimise critical mineral issues."</em> <span class="cite">[AR6 WGIII, p.1129 — chunk AR6_WG3_03782]</span></p>'
  + '<h3>4. Verrou fossile et actifs échoués — résistance géopolitique</h3>'
  + '<blockquote>"Limiting warming to well below 2°C will strand fossil-related assets, including fossil infrastructure and unburned fossil fuel resources. The economic impact of [...] carbon lock-in can have a long-lasting effect on future emissions trajectories after 2030."</blockquote>'
  + '<p class="cite">[AR6 WGIII, p.628–629 — chunk AR6_WG3_02014]</p>'
  + '<blockquote>"Countries dependent on fossil fuel income will need to forego these revenues to keep well within the Paris Agreement requirements [...] Energy and other forms of structural inequities are likely to make the transition planning more challenging, especially given stranded assets."</blockquote>'
  + '<p class="cite">[AR6 WGIII, p.1784 — chunk AR6_WG3_06292]</p>'
  + '<p>L’AR6 nuance : certains pays en développement financent leur protection sociale via les rentes fossiles (ex. Ghana — éducation via revenus pétroliers), ce qui rend la résistance à la transition non seulement stratégique mais aussi sociale. <span class="cite">[AR6 WGIII, p.1759 — chunk AR6_WG3_06192]</span></p>'
  + '<h3>5. Transferts technologiques — opportunité inégalement distribuée</h3>'
  + '<blockquote>"Such globalisation of production and supply chains opens up economic development opportunities for developing countries."</blockquote>'
  + '<p class="cite">[AR6 WGIII, p.1697 — chunk AR6_WG3_05943]</p>'
  + '<p>L’AR6 identifie des barrières persistantes : financement, droits de propriété intellectuelle, capacités humaines. <em>"International cooperation on technology development and transfer can enable developing countries to achieve their climate goals more effectively."</em> <span class="cite">[AR6 WGIII, p.1697 — chunk AR6_WG3_05944]</span></p>'
  + '<h3>Synthèse — la chaîne causale AR6</h3>'
  + '<table><tr><th>Tension</th><th>Mécanisme</th><th>Confiance AR6</th></tr>'
  + '<tr><td>Concentration REE</td><td>Quasi-monopole raffinage → risque rupture turbines</td><td>High</td></tr>'
  + '<tr><td>Cobalt / Lithium</td><td>Réserves insuffisantes pour scénario 1,5°C</td><td>High</td></tr>'
  + '<tr><td>Actifs fossiles échoués</td><td>États rentiers résistent structurellement</td><td>High</td></tr>'
  + '<tr><td>Transferts techno.</td><td>Déploiement ENR inégal Nord/Sud</td><td>High</td></tr>'
  + '</table>';

render(
  'geopolitics_resources_renewables.html',
  'Géopolitique, Ressources Critiques & Développement des ENR',
  'Sources : AR6 WGIII Ch.6 & Ch.10 (p.628–631, p.1129–1131, p.1757, p.1784) — chunks AR6_WG3_02014/03782/03783/03787/06182/06292',
  charts,
  COMMENTARY
);
