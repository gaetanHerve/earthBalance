import os, sys

TARGET = 'tools/rag/giec-expert-agent-graphs/_gen_charts.cjs'

COMMENTARY_MIGRATION = """
<h2>Migrations climatiques — AR6 du GIEC</h2>
<p class="warn"><strong>Projections difficiles</strong> — Les migrations climatiques dependent fortement des facteurs socioeconomiques. Aucune projection chiffree robuste n'existe a ce jour <span class="cite">[AR6 WGII, p.76-77]</span>.</p>

<h3>Moteurs observes (aujourd'hui)</h3>
<p>Les principaux moteurs sont <strong>tempetes tropicales, inondations et secheresses</strong> (high confidence). La majorite des deplacements sont <strong>internes et temporaires</strong>, pas des migrations internationales permanentes. <span class="cite">[AR6 WGII, p.1111 &amp; p.2440]</span></p>

<h3>Mecanismes regionaux</h3>
<h4>Petites iles et cotes basses</h4>
<blockquote>« The reduction of island habitability is expected to cause increased migration [...] depopulation of some islands. »</blockquote>
<p>Les populations resistent au depart jusqu'a environ <strong>50% de perte de surface habitable</strong>. <span class="cite">[AR6 WGII, p.2085 &amp; p.1112]</span></p>
<h4>Asie</h4>
<p>Les risques climatiques <strong>exacerbent les migrations internes et internationales</strong> a travers l'Asie. Les relocalisations planifiees sont considerees comme un dernier recours. <span class="cite">[AR6 WGII, p.1517-1518]</span></p>
<h4>Zones rurales (Afrique sub-saharienne, Mexique)</h4>
<p><strong>23% des menages ruraux</strong> d'Afrique sub-saharienne utilisent la migration pour s'adapter aux changements agricoles. La secheresse accelere l'exode rural ; la chaleur produit un effet non lineaire (apparait apres ~34 mois). <span class="cite">[AR6 WGII, p.1403 &amp; p.941-942]</span></p>
<h4>Lien avec l'Europe (demandes d'asile)</h4>
<p>Le lien est <strong>indirect</strong> : climat → conflit → exil. Les demandes d'asile en Europe augmentent lors de fluctuations climatiques via des interactions avec les conflits (Moyen-Orient 2011-2015). <span class="cite">[AR6 WGII, p.1095-1096]</span></p>

<h3>Le piege de mobilite</h3>
<p>Tension centrale du rapport : <strong>les plus vulnerables sont a la fois les plus exposes et les moins capables de migrer</strong>. La migration est efficace comme adaptation si elle est volontaire ; elle devient un facteur de vulnerabilite si elle est forcee. <span class="cite">[AR6 WGII, p.1186 &amp; p.1403]</span></p>
<blockquote>« The more agency migrants have, the greater the potential benefits for sending and receiving areas. »</blockquote>

<h3>Gouvernance internationale</h3>
<p>Il n'existe <strong>aucun statut de refugie climatique</strong> en droit international. Le groupe de travail UNFCCC (Mecanisme de Varsovie) recommande depuis 2018 le developpement de strategies nationales. <span class="cite">[AR6 WGII, p.1135]</span></p>

<h3>Synthese</h3>
<table>
  <tr><th>Dimension</th><th>Niveau de confiance</th></tr>
  <tr><td>Tempetes/inondations/secheresses = moteurs principaux</td><td>High confidence</td></tr>
  <tr><td>Deplacements internes temporaires dominants</td><td>High confidence</td></tr>
  <tr><td>Projections chiffrees fiables impossibles</td><td>High confidence</td></tr>
  <tr><td>Migration efficace si volontaire, piege si forcee</td><td>High agreement</td></tr>
  <tr><td>Lien direct avec migrations vers Europe</td><td>Medium evidence</td></tr>
  <tr><td>Depopulation petites iles a terme</td><td>Medium-high confidence</td></tr>
</table>
"""

CHARTS_JS = """
  {
    title: '1. Moteurs des deplacements climatiques par niveau de confiance AR6',
    source: '[AR6 WGII, p.1111 &amp; p.2440 — high confidence]',
    note: 'Niveau de confiance AR6 represente sur une echelle 1-3 (indicatif). Les tempetes, inondations et secheresses sont les moteurs les mieux documentes.',
    chartConfig: {
      type: 'bar',
      data: {
        labels: ['Tempetes / cyclones', 'Inondations', 'Secheresses', 'Stress thermique chronique', 'Montee des eaux (international, actuel)'],
        datasets: [{
          label: 'Niveau de confiance (indicatif)',
          data: [3, 3, 2.5, 2, 1],
          backgroundColor: ['#00ff8899','#00e5ff99','#facc1599','#fb923c99','#ff505099'],
          borderColor:     ['#00ff88',  '#00e5ff',  '#facc15',  '#fb923c',  '#ff5050'  ],
          borderWidth: 1.5,
        }],
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: (c) => ['Faible','','Moyen','','Eleve'][Math.round(c.parsed.x * 2) - 2] + ' (' + c.parsed.x + '/3)' } },
        },
        scales: {
          x: { min: 0, max: 3, ticks: { callback: (v) => ['','Faible','Moyen','Eleve'][v] || '', color: '#94a3b8' }, grid: { color: '#1f2d3d' }, title: { display: true, text: 'Niveau de confiance AR6 (indicatif)', color: '#64748b' } },
          y: { ticks: { color: '#94a3b8', font: { size: 10 } }, grid: { color: '#1f2d3d' } },
        },
      },
    },
  },
  {
    title: '2. Nature des deplacements climatiques (caracterisation AR6)',
    source: '[AR6 WGII, p.2440 — illustration qualitative]',
    note: 'Representation qualitative : l\\'AR6 etablit clairement que les deplacements internes temporaires sont dominants. Les proportions illustrent cette hierarchie, non des donnees statistiques exactes.',
    chartConfig: {
      type: 'doughnut',
      data: {
        labels: ['Internes & temporaires (dominant)', 'Internes & plus durables', 'Internationaux'],
        datasets: [{
          data: [70, 20, 10],
          backgroundColor: ['#00ff8888','#00e5ff66','#ff505066'],
          borderColor:     ['#00ff88',  '#00e5ff',  '#ff5050'  ],
          borderWidth: 2, hoverOffset: 8,
        }],
      },
      options: {
        responsive: true, cutout: '55%',
        plugins: {
          legend: { position: 'bottom', labels: { color: '#94a3b8', font: { size: 11 } } },
          tooltip: { callbacks: { label: (c) => c.label + ' : ' + c.parsed + '% (illustratif)' } },
        },
      },
    },
  },
  {
    title: '3. Le piege de mobilite — vulnerabilite vs capacite a migrer',
    source: '[AR6 WGII, p.1186 &amp; p.1403 — high agreement]',
    note: 'Relation inverse documentee par l\\'AR6 : les populations les plus vulnerables aux aleas climatiques sont aussi les moins capables de migrer. Valeurs illustratives de la relation, non des mesures absolues.',
    chartConfig: {
      type: 'bar',
      data: {
        labels: ['Faible vulnerabilite', 'Vulnerabilite moderee', 'Haute vulnerabilite', 'Tres haute vulnerabilite'],
        datasets: [
          {
            label: 'Exposition aux aleas climatiques',
            data: [1, 2, 3.5, 5],
            backgroundColor: '#ff505066', borderColor: '#ff5050', borderWidth: 1.5,
          },
          {
            label: 'Capacite a migrer (ressources, agentivite)',
            data: [5, 3.5, 2, 1],
            backgroundColor: '#00ff8866', borderColor: '#00ff88', borderWidth: 1.5,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'bottom', labels: { color: '#94a3b8', font: { size: 11 } } },
          tooltip: { mode: 'index', intersect: false },
        },
        scales: {
          x: { ticks: { color: '#94a3b8', font: { size: 10 } }, grid: { color: '#1f2d3d' } },
          y: { min: 0, max: 5.5, ticks: { color: '#94a3b8' }, grid: { color: '#1f2d3d' }, title: { display: true, text: 'Niveau relatif (illustratif)', color: '#64748b' } },
        },
      },
    },
  },
"""

PANEL_CSS = """
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
.panel-content .warn{background:#ff505011;border:1px solid #ff505044;border-radius:6px;padding:8px 10px;color:#fca5a5;font-size:.78rem;margin:0 0 10px}"""

PANEL_HTML = """
\\${commentary ? \\`
<button id="panel-btn" onclick="document.getElementById('side-panel').classList.toggle('open')">&#128203; Analyse GIEC</button>
<aside id="side-panel">
  <button id="panel-close" onclick="document.getElementById('side-panel').classList.remove('open')">&#x2715; Fermer</button>
  <div class="panel-content">\\${commentary}</div>
</aside>\\` : ''}"""

PANEL_JS = """
\\${commentary ? \\`
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') document.getElementById('side-panel').classList.remove('open'); });
\\` : ''}"""

js_content = r"""/**
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
const charts = [];
// ──END-CHARTS──

// ── Point d'entree ────────────────────────────────────────────────────────────

render(
  'output.html',
  'Titre des graphiques',
  'Sources et credits.',
  charts,
  ''
);
"""

# Inject dynamic parts
js_final = js_content

with open(TARGET, 'w', encoding='utf-8') as f:
    f.write(js_final)

print('Etape 1 OK : structure de base ecrite.')
