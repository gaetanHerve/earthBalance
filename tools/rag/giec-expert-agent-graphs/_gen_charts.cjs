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
.panel-content .warn{background:#ff505011;border:1px solid #ff505044;border-radius:6px;padding:8px 10px;color:#fca5a5;font-size:.78rem;margin:0 0 10px}
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
// L'agent peuple ce tableau, puis execute le script.
// Il est automatiquement vide apres generation du HTML.

// ──BEGIN-CHARTS──
const charts = [
  {
    title: 'Intensité carbone par source d’électricité — médianes IPCC',
    source: '[AR6 WGIII, p.1158–1159 — soumissions au data call AR6]',
    note: 'Médianes IPCC (soumissions au data call AR6, toutes technologies confondues). Ces valeurs incluent les émissions amont (extraction, transport, fuites). Éolien : 9,3 — Gaz : 537 — Charbon : 965 gCO₂-eq/kWh. [AR6 WGIII, p.1158–1159]',
    chartConfig: {
      type: 'bar',
      data: {
        labels: ['Éolien', 'Gaz naturel (cycle combiné)', 'Charbon (toutes technologies)'],
        datasets: [{
          label: 'Intensité carbone (gCO₂-eq/kWh)',
          data: [9.3, 537, 965],
          backgroundColor: ['#00ff8899','#fb923c99','#ff505099'],
          borderColor:     ['#00ff88',  '#fb923c',  '#ff5050'],
          borderWidth: 1.5,
        }],
      },
      options: {
        indexAxis: 'y', responsive: true,
        plugins: { legend: { display: false },
          tooltip: { callbacks: { label: (c) => c.parsed.x + ' gCO₂-eq/kWh' } } },
        scales: {
          x: { min: 0, max: 1100, grid: { color: '#1f2d3d' },
            title: { display: true, text: 'gCO₂-eq/kWh (médiane, cycle de vie)', color: '#64748b' },
            ticks: { color: '#94a3b8' } },
          y: { ticks: { color: '#94a3b8', font: { size: 11 } }, grid: { color: '#1f2d3d' } },
        },
      },
    },
  },
  {
    title: 'Impact des fuites de méthane — seuil d’équivalence gaz/charbon',
    source: '[AR6 WGIII, p.1195 — Alvarez et al. 2012 & 2018, cités dans AR6]',
    note: 'Modèle illustratif calibré sur l’AR6 : combustion seule ≈ 450 gCO₂-eq/kWh, crossover charbon = seuil 2,7 % (Alvarez et al. 2012, cité dans AR6). Points jaunes = mesures US 2018 (2,3 %). Points rouges = zone équivalent charbon. [AR6 WGIII, p.1195]',
    chartConfig: {
      type: 'line',
      data: {
        labels: ['0 %', '1 %', '2 %', '2,3 % (USA 2018)', '2,7 % (seuil AR6)', '4 %'],
        datasets: [
          { label: 'Gaz naturel (intensité effective avec fuites)',
            data: [450, 641, 832, 889, 965, 1213],
            borderColor: '#fb923c', backgroundColor: '#fb923c22',
            tension: 0.2, fill: false,
            pointBackgroundColor: ['#fb923c','#fb923c','#fb923c','#facc15','#ff5050','#ff5050'],
            pointBorderColor:     ['#fb923c','#fb923c','#fb923c','#facc15','#ff5050','#ff5050'],
            pointRadius: [4,4,4,8,8,4],
          },
          { label: 'Charbon — référence (965 gCO₂-eq/kWh)',
            data: [965, 965, 965, 965, 965, 965],
            borderColor: '#ff5050', borderWidth: 2,
            borderDash: [8, 4], pointRadius: 0, fill: false,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'bottom', labels: { color: '#94a3b8', font: { size: 11 } } },
          tooltip: { mode: 'index', intersect: false,
            callbacks: { label: (c) => c.dataset.label + ' : ' + c.parsed.y + ' gCO₂-eq/kWh' } },
        },
        scales: {
          x: { ticks: { color: '#94a3b8', font: { size: 10 } }, grid: { color: '#1f2d3d' } },
          y: { min: 300, max: 1350, grid: { color: '#1f2d3d' },
            title: { display: true, text: 'gCO₂-eq/kWh', color: '#64748b' },
            ticks: { color: '#94a3b8' } },
        },
      },
    },
  },
  {
    title: 'CH₄ fugitif dans les émissions du secteur énergétique (2019)',
    source: '[AR6 WGIII, p.41 — 50 à 80 % réductibles à <50 USD/tCO₂-eq, medium confidence]',
    note: '50 à 80 % des fuites de méthane fossile pourraient être évitées à <50 USD/tCO₂-eq avec les technologies actuelles (medium confidence, AR6). Midpoint utilisé : 65 %. Total énergie 2019 : 20 GtCO₂-eq/an. [AR6 WGIII, p.41]',
    chartConfig: {
      type: 'doughnut',
      data: {
        labels: ['CH₄ fugitif réductible (<50 USD/tCO₂-eq)',
                 'CH₄ fugitif résiduel',
                 'Autres GES énergie (CO₂, N₂O…)'],
        datasets: [{
          data: [2.3, 1.3, 16.4],
          backgroundColor: ['#00ff8877','#fb923c77','#33415566'],
          borderColor:     ['#00ff88',  '#fb923c',  '#475569'],
          borderWidth: 2, hoverOffset: 8,
        }],
      },
      options: {
        responsive: true, cutout: '55%',
        plugins: {
          legend: { position: 'bottom', labels: { color: '#94a3b8', font: { size: 10 } } },
          tooltip: { callbacks: { label: (c) =>
            c.label + ' — ' + c.raw + ' GtCO₂-eq/an (' + (c.raw/20*100).toFixed(1) + ' %)' } },
        },
      },
    },
  },
];
// ──END-CHARTS──

// ── Point d'entree ────────────────────────────────────────────────────────────

// ── Contenu du panneau lateral ─────────────────────────────────────────────
const COMMENTARY = '<h2>Gaz de schiste — AR6 du GIEC</h2><p class="warn"><strong>Graphique 2 : modèle illustratif</strong> — Le seuil 2,7\u202f% est une donnée AR6 (Alvarez et al. 2012). Les valeurs intermédiaires suivent un modèle linéaire simplifié calibré sur ce seuil (combustion seule ≈\u202f450 gCO₂-eq/kWh à 0\u202f% de fuite).</p><h3>1. Combustion directe</h3><p>Le gaz naturel émet environ <strong>deux fois moins de CO₂</strong> que le charbon à la combustion. Médianes IPCC (data call AR6)\u202f: éolien\u202f: 9,3 — gaz\u202f: 537 — charbon\u202f: 965\u202fgCO₂-eq/kWh. <span class="cite">[AR6 WGIII, p.1158–1159]</span></p><h3>2. Le rôle décisif des fuites de méthane</h3><p>Le méthane (CH₄) a un potentiel de réchauffement <strong>∼\u202f82× celui du CO₂</strong> sur 20\u202fans (AR6 WGI révisé). Chaque pourcent de fuite annule une fraction du bénéfice climatique du gaz.</p><blockquote>« It would take a leakage rate of about 2.7\u202f% from natural gas production to undo the direct fuel switching from coal mitigation effect. »</blockquote><p><strong>Seuil d’équivalence\u202f: 2,7\u202f%</strong> <span class="cite">[AR6 WGIII, p.1195 — Alvarez et al. 2012]</span><br> USA mesuré (2018)\u202f: <strong>2,3\u202f%</strong> — 60\u202f% au-dessus des estimations précédentes. Données canadiennes encore plus élevées. <span class="cite">[AR6 WGIII, p.1195 — Alvarez et al. 2018]</span></p><h3>3. Potentiel de réduction massif</h3><p>Émissions fugitives énergétiques 2019\u202f: 18\u202f% des GES énergie — 32\u202f% du CH₄ mondial — <strong>6\u202f% des GES totaux</strong>. <span class="cite">[AR6 WGIII, p.41]</span></p><p><strong>50 à 80\u202f%</strong> de ces fuites pourraient être évitées avec les technologies actuelles, à moins de <strong>50\u202fUSD/tCO₂-eq</strong> (medium confidence). <span class="cite">[AR6 WGIII, p.41]</span></p><h3>4. Budget carbone</h3><p>Dans les scénarios compatibles avec +2°C, environ <strong>50\u202f% des réserves mondiales de gaz</strong> doivent rester inexploitées — large part des gaz non conventionnels (schíte, offshore profond). <span class="cite">[AR6 WGIII, p.660 — McGlade &amp; Ekins 2015]</span></p><h3>Synthèse</h3><table><tr><th>Dimension</th><th>Valeur / Verdict AR6</th></tr><tr><td>Intensité carbone gaz vs charbon</td><td>−44\u202f% (537 vs 965)</td></tr><tr><td>Seuil de fuite = équivalent charbon</td><td>2,7\u202f% — high confidence</td></tr><tr><td>Fuite mesurée USA (2018)</td><td>2,3\u202f% — near threshold</td></tr><tr><td>CH₄ fugitif / GES mondiaux (2019)</td><td>6\u202f% — high confidence</td></tr><tr><td>Potentiel réduction fuites (≤ 50 USD)</td><td>50–80\u202f% — medium confidence</td></tr><tr><td>Réserves gaz compatibles 2°C</td><td>≤50\u202f% des réserves actuelles</td></tr></table>';

render(
  'shale_gas_emissions_charts.html',
  'Gaz de schiste — Émissions et impact climatique (AR6 du GIEC)',
  'Sources\u202f: IPCC AR6 WGIII (2022) — Ch.\u20046 &amp; Ch.\u200411 [AR6_WG3_03912, AR6_WG3_04008, AR6_WG3_00084, AR6_WG3_02103]',
  charts,
  COMMENTARY
);
