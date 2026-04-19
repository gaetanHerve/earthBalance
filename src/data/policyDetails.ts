import type { IpccReference } from '@/types/index'

export interface PolicyDetail {
  summary: string
  ipccReference: IpccReference
}

const AR6_SYR_URL = 'https://www.ipcc.ch/report/ar6/syr/'
const AR6_REPORT  = 'IPCC AR6 — Rapport de synthèse (SYR), 2023'

export const policyDetails: Record<string, PolicyDetail> = {

  'dec-42-07': {
    summary: `La tarification du carbone est l'un des instruments les plus efficaces pour orienter l'économie vers une trajectoire bas-carbone. Une taxe universelle à 150 $/tCO₂ placerait le signal-prix au niveau requis par les scénarios 1,5°C du GIEC pour 2030. Elle génère en parallèle des recettes publiques redistribuables vers les pays en développement et vers la reconversion des travailleurs des secteurs carbonés.`,
    ipccReference: {
      report: AR6_REPORT,
      section: 'Section 4.2 / WGIII SPM E.6',
      sectionTitle: 'Instruments économiques et tarification du carbone',
      excerpt: 'Carbon pricing policies can be cost-effective and have shown some effectiveness in reducing emissions. Prices that are consistent with 1.5°C pathways are in the range of USD 18–220/tCO₂ in 2030, rising to USD 63–365/tCO₂ in 2050, with higher values in pathways that limit warming to 1.5°C (>50%) with no or limited overshoot.',
      url: AR6_SYR_URL,
    },
  },

  'dec-42-06': {
    summary: `Les forêts primaires constituent des puits de carbone irremplaçables — leur destruction libère des stocks accumulés sur des siècles tout en détruisant la biodiversité. Un moratoire contraignant permettrait de stabiliser les émissions du secteur AFOLU (Agriculture, Forêts, Usage des terres) et de préserver des écosystèmes dont la restauration est impossible à l'échelle humaine. Le GIEC classe la protection des forêts existantes parmi les options d'atténuation au coût le plus faible et au co-bénéfice le plus élevé.`,
    ipccReference: {
      report: AR6_REPORT,
      section: 'Section 4.5.4 / WGIII SPM B.4',
      sectionTitle: 'Systèmes terrestres — AFOLU : forêts et usage des terres',
      excerpt: 'Conservation of existing ecosystems (e.g., forests, peatlands, savannahs, wetlands and coastal ecosystems) is often more cost-effective than restoration after ecosystem degradation or loss, and it also has multiple biodiversity and other ecosystem service co-benefits. Reducing deforestation and forest degradation, and maintaining carbon-dense forests, offer large mitigation benefits.',
      url: AR6_SYR_URL,
    },
  },

  'dec-42-05': {
    summary: `Le charbon est la source d'énergie la plus carbonée : sa combustion sans captage émet environ deux fois plus de CO₂ par kWh que le gaz naturel. Les scénarios C1 (1,5°C) du GIEC exigent une réduction de 67 % de la production électrique charbonnière mondiale entre 2019 et 2030. Les pays développés, dotés des alternatives renouvelables matures, peuvent et doivent mener cette transition en premier. Le coût des renouvelables a chuté de 85 % (solaire) et 55 % (éolien) depuis 2010, rendant la substitution économiquement viable dans la quasi-totalité des régions.`,
    ipccReference: {
      report: AR6_REPORT,
      section: 'Section 4.5.1 / WGIII SPM C.3',
      sectionTitle: 'Systèmes énergétiques — décarbonation et sortie du charbon',
      excerpt: 'Net zero CO₂ energy systems entail a substantial reduction in overall fossil fuel use, minimal use of unabated fossil fuels, and use of Carbon Capture and Storage in the remaining fossil fuel systems. Pathways limiting warming to 1.5°C (C1) imply a 67% [46–86%] reduction in coal-based electricity generation by 2030 relative to 2019 levels.',
      url: AR6_SYR_URL,
    },
  },

  'dec-42-04': {
    summary: `Le méthane est un gaz à effet de serre 80 fois plus puissant que le CO₂ sur 20 ans. Contrairement au CO₂, sa durée de vie atmosphérique courte (≈12 ans) signifie que des réductions rapides se traduisent en refroidissement perceptible dans la décennie suivante. Les scénarios 1,5°C du GIEC imposent une réduction de 34 % des émissions mondiales de CH₄ d'ici 2030. Les principales sources sont l'agriculture (élevage, riziculture), les combustibles fossiles (fuites gazières) et les déchets — toutes accessibles à des politiques ciblées.`,
    ipccReference: {
      report: AR6_REPORT,
      section: 'Section 4.1 / WGIII SPM C.1.2',
      sectionTitle: 'Urgence de l\'action — réductions des émissions non-CO₂',
      excerpt: 'In pathways that limit warming to 1.5°C (>50%) with no or limited overshoot, global CH₄ (methane) emissions are reduced by 34 [21 to 57]% below 2019 levels by 2030, and by 44 [31 to 63]% in 2040. Strong, rapid and sustained reductions in methane emissions can limit peak warming levels.',
      url: AR6_SYR_URL,
    },
  },

  'dec-42-03': {
    summary: `Les forêts tropicales abritent plus de 50 % de la biodiversité terrestre et stockent 250 milliards de tonnes de carbone. Leur déforestation représente environ 10 % des émissions mondiales annuelles. Arrêter la destruction et restaurer 350 Mha d'ici 2030 permettrait de séquestrer 1,5 à 3 GtCO₂/an supplémentaires. Ces mesures sont classées parmi les plus rentables par le GIEC, avec un coût inférieur à 20 USD/tCO₂ pour la protection des forêts existantes.`,
    ipccReference: {
      report: AR6_REPORT,
      section: 'Section 4.5.4 / WGIII SPM C.9',
      sectionTitle: 'Systèmes terrestres — AFOLU : forêts tropicales et restauration',
      excerpt: 'In modelled pathways, emissions from land-use, land-use change and forestry reach net zero CO₂ emissions earlier than the buildings, industry and transport sectors. Ecosystem restoration including reforestation and reduced deforestation delivers large mitigation benefits at costs below USD 20 per tCO₂-eq in many regions.',
      url: AR6_SYR_URL,
    },
  },

  'dec-42-02': {
    summary: `Les systèmes alimentaires sont responsables de 21 à 37 % des émissions mondiales de GES. Une transition vers des régimes moins riches en protéines animales — notamment la viande bovine — constitue l'option de demande au plus grand potentiel d'atténuation selon le GIEC. Elle réduit simultanément la pression foncière sur les forêts tropicales, les émissions de méthane agricole et les risques de maladies chroniques liées à l'alimentation.`,
    ipccReference: {
      report: AR6_REPORT,
      section: 'Section 4.5.4 / WGIII SPM C.9.3',
      sectionTitle: 'Alimentation durable — régimes alimentaires et demande',
      excerpt: 'Balanced, sustainable diets including a shift towards plant-based foods present a major opportunity for mitigation. Adoption of plant-rich diets, particularly by richer populations, could reduce global GHG emissions by 0.7–8 GtCO₂-eq/yr by 2050, with significant co-benefits for biodiversity and human health.',
      url: AR6_SYR_URL,
    },
  },

  'dec-42-01': {
    summary: `Les transports terrestres représentent environ 12 % des émissions mondiales de CO₂. La combinaison de l'électrification des véhicules et de la décarbonation du réseau électrique offre le chemin le plus direct vers des transports zéro émission. L'éolien et le solaire ayant rendu l'électricité moins chère que l'essence dans de nombreuses régions, le coût total de possession des véhicules électriques est désormais compétitif. Le GIEC identifie cette option comme à la fois techniquement mature et soutenue par le public.`,
    ipccReference: {
      report: AR6_REPORT,
      section: 'Section 4.5.3 / WGIII SPM C.7',
      sectionTitle: 'Transports — électrification et mobilités durables',
      excerpt: 'Electric vehicles (EVs) are increasingly competitive with internal combustion engine vehicles. In modelled pathways consistent with 1.5°C, the share of EVs in road transport grows rapidly. Combining electrification with low-carbon electricity supply can reduce transport emissions by 50–70% by 2050 compared to 2019 levels.',
      url: AR6_SYR_URL,
    },
  },

  'dec-42-08': {
    summary: `Le solaire et l'éolien sont aujourd'hui les sources d'électricité les moins chères dans la majorité des régions du monde, après une baisse de coûts sans précédent (−85 % pour le solaire, −55 % pour l'éolien depuis 2010). Un système électrique 100 % décarboné est la colonne vertébrale de toute stratégie net-zéro : il rend vertueux l'électrification des transports, du chauffage et de l'industrie. Le GIEC classe le solaire et l'éolien parmi les options d'atténuation à la fois les moins chères, les plus matures et les plus acceptées socialement.`,
    ipccReference: {
      report: AR6_REPORT,
      section: 'Section 4.5.1 / Figure 4.4',
      sectionTitle: 'Systèmes énergétiques — solaire, éolien et décarbonation',
      excerpt: 'Solar and wind energy are increasingly cost-competitive. From 2010 to 2019, sustained decreases occurred in the unit costs of solar energy (by ~85%), wind energy (by ~55%), and lithium-ion batteries (by ~85%), with large increases in their deployment. Electricity from solar PV and wind is now cheaper than electricity from fossil sources in many regions.',
      url: AR6_SYR_URL,
    },
  },

  'dec-42-09': {
    summary: `Les bâtiments représentent environ 21 % de la consommation mondiale d'énergie finale. L'efficacité thermique est l'option d'atténuation la plus rentable dans ce secteur : une rénovation profonde peut réduire les besoins de chauffage de 50 à 90 %. Combinée à l'électrification (pompes à chaleur) et à la décarbonation du réseau, elle permet d'atteindre des bâtiments à énergie positive. Le GIEC souligne que la rénovation présente également des co-bénéfices majeurs pour la santé, le confort et la précarité énergétique.`,
    ipccReference: {
      report: AR6_REPORT,
      section: 'Section 4.5.3 / WGIII SPM C.6',
      sectionTitle: 'Bâtiments — efficacité énergétique et décarbonation',
      excerpt: 'Buildings can achieve net-zero emissions through a combination of energy efficiency measures, electrification of heating and cooling, and the use of renewable energy. Integrated design in construction and retrofit of buildings has led to increasing examples of zero energy or zero carbon buildings. Deep renovation can reduce energy demand by 50–90%.',
      url: AR6_SYR_URL,
    },
  },

  'dec-42-10': {
    summary: `L'industrie est responsable d'environ 24 % des émissions mondiales de GES, dont une part difficile à décarboner (procédés à haute température, émissions de process). L'économie circulaire — réduire, réutiliser, recycler — diminue la demande de matières premières énergivores et donc les émissions amont. Le GIEC estime que l'efficacité matière et l'économie circulaire pourraient réduire les émissions industrielles de 40 % d'ici 2050, en complément de l'électrification et du CCS.`,
    ipccReference: {
      report: AR6_REPORT,
      section: 'Section 4.5.2 / WGIII SPM C.5',
      sectionTitle: 'Industrie — efficacité matière et économie circulaire',
      excerpt: 'Circular economy strategies, including material efficiency, product lifetime extension, and enhanced recycling, can reduce industrial GHG emissions. Demand-side mitigation options across industry could reduce emissions by up to 40–70% in end-use sectors by 2050 compared to current trajectories. Energy-intensive industries are among the hardest to abate and require multiple technology approaches.',
      url: AR6_SYR_URL,
    },
  },

  'dec-42-11': {
    summary: `Certaines industries — acier, ciment, chimie, raffinage — produisent des émissions de procédé impossibles à éliminer par la seule électrification. Le captage et stockage du carbone (CCS) est le seul outil permettant de décarboner ces secteurs à court-moyen terme. Le GIEC indique que les scénarios limitant le réchauffement à 2°C recourent quasi-universellement au CCS pour l'industrie lourde. Le défi est l'échelle : aujourd'hui, les capacités mondiales de captage représentent moins de 0,1 % du volume nécessaire en 2050.`,
    ipccReference: {
      report: AR6_REPORT,
      section: 'Section 4.5.2 / WGIII SPM C.5.2',
      sectionTitle: 'Industrie — captage et stockage du carbone (CCS)',
      excerpt: 'Carbon capture and storage (CCS) has limited diffusion. Barriers to wider adoption include costs, availability of geological storage, physical leakage risk, and public acceptance. All global modelled pathways that limit warming to 2°C (>67%) or lower by 2100 involve the use of CCS in the energy and industrial sectors, in combination with other mitigation options.',
      url: AR6_SYR_URL,
    },
  },

  'dec-42-12': {
    summary: `L'énergie nucléaire produit de l'électricité avec des émissions de cycle de vie comparables à l'éolien (4–16 gCO₂eq/kWh). Le GIEC la reconnaît comme option d'atténuation à faibles émissions, bien que sa faisabilité soit contrainte par les coûts d'investissement élevés, les délais de construction et la gestion des déchets. Dans les scénarios 1,5°C, le nucléaire joue un rôle variable : certaines trajectoires tablent sur une expansion, d'autres sur son maintien ou son recul au profit des renouvelables.`,
    ipccReference: {
      report: AR6_REPORT,
      section: 'Section 4.5.1 / Figure 4.4',
      sectionTitle: 'Systèmes énergétiques — nucléaire comme énergie de base bas-carbone',
      excerpt: 'Nuclear power is included as a mitigation option with low lifecycle GHG emissions. Nuclear power can contribute to the low-carbon electricity transition, but faces constraints including high investment costs, long lead times, public acceptance, and waste management challenges. Its role varies significantly across mitigation pathways.',
      url: AR6_SYR_URL,
    },
  },

  'dec-42-13': {
    summary: `Les gaz fluorés (HFC, PFC, SF₆, NF₃) sont des GES dont le potentiel de réchauffement global dépasse 1 000 à 25 000 fois celui du CO₂. Ils représentent environ 2,5 % des émissions mondiales mais leur croissance est rapide. L'Amendement de Kigali (2016) engage les pays à réduire les HFC de 85 % d'ici 2047 — des alternatives existent pour la quasi-totalité des usages actuels.`,
    ipccReference: {
      report: AR6_REPORT,
      section: 'Section 4.5.2 / WGIII SPM C.11',
      sectionTitle: 'Industrie — réduction des gaz fluorés',
      excerpt: 'Fluorinated gases (F-gases) including HFCs, PFCs, SF₆, and NF₃ are among the most potent GHGs. Reducing F-gas emissions represents one of the near-term mitigation opportunities with significant potential. Options include alternatives in refrigeration, air conditioning, and industrial processes, supported by the Kigali Amendment to the Montreal Protocol.',
      url: AR6_SYR_URL,
    },
  },

  'dec-42-14': {
    summary: `Un tiers de la nourriture produite dans le monde est perdue ou gaspillée — représentant 8 à 10 % des émissions mondiales de GES. Réduire ce gaspillage de 50 % d'ici 2030 (ODD 12.3) éliminerait 2 à 4 GtCO₂eq/an sans nécessiter de changement technologique majeur. C'est l'une des options d'atténuation les plus rentables identifiées par le GIEC, avec des co-bénéfices sur la sécurité alimentaire mondiale.`,
    ipccReference: {
      report: AR6_REPORT,
      section: 'Section 4.5.4 / WGIII SPM C.9.4',
      sectionTitle: 'Alimentation — gaspillage alimentaire et chaînes de valeur',
      excerpt: 'Demand-side mitigation options, including reduction of food waste and loss, could reduce global GHG emissions by 0.8–4.5 GtCO₂-eq/yr by 2050. Reducing food loss and waste is among the options with the lowest costs and highest co-benefits for sustainable development, supporting SDG 12.3.',
      url: AR6_SYR_URL,
    },
  },

  'dec-42-15': {
    summary: `L'agroforesterie intègre des arbres dans les systèmes agricoles, créant des synergies entre production alimentaire, séquestration du carbone et biodiversité. Les sols agricoles dégradés représentent un potentiel de séquestration de 0,9 à 1,85 GtCO₂/an si gérés durablement. Ces pratiques s'inscrivent dans les options AFOLU (Agriculture, Forêts, Usages des terres) que le GIEC identifie comme complémentaires indispensables aux mesures énergétiques.`,
    ipccReference: {
      report: AR6_REPORT,
      section: 'Section 4.5.4 / WGIII SPM B.4.3',
      sectionTitle: 'Agriculture et usage des terres — séquestration et agroforesterie',
      excerpt: 'Agroforestry, reforestation, afforestation, improved forest management and agricultural practices that improve soil carbon (e.g., reduced tillage, cover crops, organic amendments) can contribute significantly to emission reductions and removals. Carbon sequestration in agriculture and agroforestry is assessed at 2.3 GtCO₂-eq/yr by 2030.',
      url: AR6_SYR_URL,
    },
  },

  'dec-42-16': {
    summary: `La restauration des écosystèmes dégradés — forêts, tourbières, zones humides, mangroves — constitue une priorité urgente tant pour le climat que pour la biodiversité. Les tourbières stockent à elles seules deux fois plus de carbone que toutes les forêts du monde, malgré leur faible surface. La décennie ONU pour la restauration des écosystèmes (2021–2030) vise 350 Mha restaurés. Le GIEC souligne que la protection des écosystèmes existants est systématiquement moins chère et plus efficace que leur restauration après dégradation.`,
    ipccReference: {
      report: AR6_REPORT,
      section: 'Section 4.5.4 / Figure 4.4',
      sectionTitle: 'Restauration des écosystèmes naturels et séquestration',
      excerpt: 'Ecosystem restoration including reforestation, afforestation, and the restoration of peatlands, wetlands and coastal ecosystems provides significant mitigation potential (1.5–3.04 GtCO₂-eq/yr). Conservation of existing ecosystems is often more cost-effective than restoration after degradation, and provides multiple biodiversity and ecosystem service co-benefits.',
      url: AR6_SYR_URL,
    },
  },

  'dec-42-17': {
    summary: `La bioénergie avec captage et stockage du carbone (BECCS) génère de l'énergie à partir de biomasse tout en captant et stockant le CO₂ émis, produisant ainsi des émissions négatives nettes. La quasi-totalité des scénarios 1,5°C y recourent pour compenser les émissions résiduelles incompressibles. Toutefois, le GIEC souligne des risques majeurs : concurrence avec les terres agricoles et la biodiversité, disponibilité de l'eau, faisabilité à grande échelle encore incertaine.`,
    ipccReference: {
      report: AR6_REPORT,
      section: 'Section 4.6 / WGIII SPM D.1.5',
      sectionTitle: 'Élimination du CO₂ atmosphérique (CDR) — BECCS',
      excerpt: 'Carbon dioxide removal (CDR) is necessary to achieve net zero and net negative CO₂ emissions. BECCS is included in most modelled pathways consistent with 1.5°C, but large-scale deployment of land-based CDR creates risks for land, food, energy, water, and biodiversity. The feasibility and sustainability of BECCS at the scale required is uncertain.',
      url: AR6_SYR_URL,
    },
  },
}
