// English translations for mitigation policy content.
// Fields not listed here fall back to the French originals in mitigationPolicies.ts / policyDetails.ts.

export interface PolicyNarrative {
  label:   string
  horizon: string
  text:    string
}

export interface PolicyI18n {
  title:        string
  description?: string
  summary?:     string       // from policyDetails
  sectionTitle?: string      // from policyDetails.ipccReference
  resources?:   Array<{ title: string; excerpt: string }>
  narratives?:  Record<string, PolicyNarrative>
}

export const policyI18n: Record<string, PolicyI18n> = {

  // ─── dec-07 — Global carbon tax ─────────────────────────────────────────
  'dec-07': {
    title: 'Global carbon tax at $150/tonne within 6 years?',
    description: `This proposal aims to establish a universal carbon tax of **$150/tonne of CO₂** applicable to all Paris Agreement signatories within 6 years. Revenues would be redistributed: 60% to developing countries to finance the energy transition, and 40% to a global climate adaptation fund. Key issues: industrial competitiveness, climate justice, and effectiveness of emissions reduction.`,
    summary: `Carbon pricing is one of the most effective instruments for steering economies towards a low-carbon trajectory. A universal tax at $150/tCO₂ would place the price signal at the level required by IPCC 1.5°C scenarios for 2030. It simultaneously generates public revenues redistributable to developing countries and to workers in carbon-intensive sectors undergoing transition.`,
    sectionTitle: 'Economic instruments and carbon pricing',
    resources: [
      {
        title: 'IPCC AR6 Report — Climate Change Mitigation',
        excerpt: 'Carbon taxes between $135 and $5,500/tCO₂ are required to limit warming to 1.5°C.',
      },
      {
        title: 'IMF — Carbon Pricing: Why, How, and How Much?',
        excerpt: 'A universal $75/tonne tax would reduce global emissions by 35% by 2030.',
      },
      {
        title: 'Carbon Pricing Dashboard — World Bank',
        excerpt: 'Global overview of carbon pricing mechanisms in effect in 2024.',
      },
    ],
    narratives: {
      optimistic: {
        label:   'Optimistic Scenario',
        horizon: '+10 yrs',
        text: 'By 2034, the global carbon tax has reduced global emissions by **22%**. Renewables now represent **51%** of the global energy mix. Developing countries have received $2.4 trillion to finance their transition. Deforestation has slowed by **35%**. Energy-related geopolitical conflicts have declined significantly.',
      },
      moderate: {
        label:   'Moderate Scenario',
        horizon: '+20 yrs',
        text: 'By 2044, despite industrial resistance, emissions have fallen **38%** from 2024 levels. Global temperature stabilises at **+1.7°C**. Tensions persist in hydrocarbon-dependent regions. Access to clean water reaches **79%** of the world population.',
      },
      pessimistic: {
        label:   'Pessimistic Scenario',
        horizon: '+50 yrs',
        text: 'By 2074, if major powers fail to comply, emissions fall by only **12%**. Temperature reaches **+2.8°C**, triggering major extreme climate events. 800 million additional people face food insecurity. Geopolitical conflicts over water and arable land intensify.',
      },
    },
  },

  // ─── dec-06 — Primary forest moratorium ──────────────────────────────────
  'dec-06': {
    title: 'Global moratorium on primary deforestation',
    description: 'Ban all primary forest logging within 1 year through a binding international treaty.',
    summary: `Primary forests are irreplaceable carbon sinks — their destruction releases stocks accumulated over centuries while destroying biodiversity. A binding moratorium would stabilise emissions from the AFOLU sector and preserve ecosystems whose restoration is impossible on a human timescale. The IPCC ranks protection of existing forests among the lowest-cost, highest co-benefit mitigation options.`,
    sectionTitle: 'Land systems — AFOLU: forests and land use',
  },

  // ─── dec-05 — Coal phase-out ─────────────────────────────────────────────
  'dec-05': {
    title: 'Coal phase-out in developed countries\' electricity sector within 6 years',
    description: `Planned closure of all coal-fired power plants without CO₂ capture in Annex I countries (OECD + EU) within the first 6 years. The transition would be supported by a retraining plan for mining communities and a compensation mechanism for still-dependent countries. According to AR6 WGIII, coal accounts for ~30% of global energy-related CO₂ emissions; developed countries contribute ~45%. This measure aligns with C1 (1.5°C) pathways requiring a **67%** [46–86%] reduction in global coal electricity generation within 6 years.`,
    summary: `Coal is the most carbon-intensive energy source: its combustion without capture emits roughly twice as much CO₂ per kWh as natural gas. IPCC C1 (1.5°C) scenarios require a 67% reduction in global coal electricity generation between 2019 and 2030. Developed countries, with mature renewable alternatives, can and must lead this transition. The cost of renewables has fallen by 85% (solar) and 55% (wind) since 2010, making substitution economically viable in almost all regions.`,
    sectionTitle: 'Energy systems — decarbonisation and coal phase-out',
    resources: [
      {
        title: 'IPCC AR6 SYR — Section 4.5: Short-term mitigation options',
        excerpt: 'C1 (1.5°C) pathways require a 67% [46–86%] reduction in unabated coal electricity generation between 2019 and 2030.',
      },
      {
        title: 'IEA — Coal in Net Zero Transitions',
        excerpt: 'Developed countries must end unabated coal power generation by 2030 to remain on a Net Zero 2050 pathway.',
      },
    ],
    narratives: {
      optimistic: {
        label:   'Optimistic Scenario',
        horizon: '+10 yrs',
        text: 'By 2034, the last coal plant in developed countries has closed. The **1,800 TWh** annual output has been replaced by solar and wind. Air quality in former industrial basins has improved dramatically — a **42%** reduction in cardiovascular hospitalisations in formerly coal-heavy areas. Annual global emissions have fallen by **2.4 GtCO₂**.',
      },
      moderate: {
        label:   'Moderate Scenario',
        horizon: '+20 yrs',
        text: 'By 2044, the decision has avoided **~27 GtCO₂** cumulated since 2025 — roughly **0.12°C** less warming vs. the reference trajectory. Mining regions have undergone a difficult transition: some basins have reconverted 70% of jobs, others remain fragile. Natural gas has partially compensated for coal in several countries, limiting net gains.',
      },
      pessimistic: {
        label:   'Pessimistic Scenario',
        horizon: '+50 yrs',
        text: 'By 2074, if the coal phase-out has been delayed by 10–15 years due to industrial lobbying, cumulative avoided emissions fall to **~12 GtCO₂**. Global temperature is **0.05°C** lower than the reference — a barely perceptible difference. Former coal regions face long-term economic marginalisation.',
      },
    },
  },

  // ─── dec-04 — Methane reduction ──────────────────────────────────────────
  'dec-04': {
    title: '34% global methane emissions reduction within 6 years',
    description: `Methane is a greenhouse gas **80 times more potent** than CO₂ over 20 years. Unlike CO₂, its short atmospheric lifetime (~12 years) means rapid reductions translate into measurable cooling within the following decade. IPCC 1.5°C pathways require a 34% reduction in global CH₄ emissions within 6 years. Main sources — agriculture (livestock, rice), fossil fuels (gas leaks) and waste — are all amenable to targeted policies.`,
    summary: `Methane is a greenhouse gas 80 times more potent than CO₂ over 20 years. Unlike CO₂, its short atmospheric lifetime (~12 years) means that rapid reductions translate into measurable cooling within the following decade. IPCC 1.5°C scenarios require a 34% reduction in global CH₄ emissions within 6 years. The main sources are agriculture (livestock, rice), fossil fuels (gas leaks) and waste — all amenable to targeted policies.`,
    sectionTitle: 'Urgency of action — non-CO₂ emission reductions',
    narratives: {
      optimistic: {
        label:   'Optimistic Scenario',
        horizon: '+10 yrs',
        text: 'By 2034, global methane emissions have been cut by **34%**. The near-term cooling effect — measurable within a decade — has limited peak warming by approximately **0.3°C** compared to a no-action baseline. Agricultural practices have been reformed in 80% of OECD countries. Gas leaks from fossil fuel infrastructure are down by **60%**.',
      },
      moderate: {
        label:   'Moderate Scenario',
        horizon: '+20 yrs',
        text: 'By 2044, methane reductions have stabilised atmospheric concentrations at 2024 levels. The cumulative avoided warming is estimated at **0.2°C** by 2050. Agriculture remains the most resistant sector. Methane monitoring via satellite has improved enforcement significantly, but emerging economies lag in implementation.',
      },
      pessimistic: {
        label:   'Pessimistic Scenario',
        horizon: '+50 yrs',
        text: 'By 2074, without binding methane commitments, emissions have increased by **15%** above 2024 levels. The lost opportunity cost in warming is **+0.4°C** compared to the optimal scenario. Global food systems have been disrupted, increasing pressure on land-use change and accelerating a vicious cycle of agricultural emissions.',
      },
    },
  },

  // ─── dec-03 — Deforestation halt ─────────────────────────────────────────
  'dec-03': {
    title: 'Halt tropical deforestation and restore forests within 6 years',
    description: `Tropical forests harbour over 50% of terrestrial biodiversity and store 250 billion tonnes of carbon. Their deforestation accounts for approximately 10% of annual global emissions. Halting destruction and restoring 350 Mha within 6 years could sequester an additional **1.5–3 GtCO₂/year**. These measures rank among the most cost-effective in the IPCC catalogue, at less than **$20/tCO₂** for protecting existing forests.`,
    summary: `Tropical forests harbour more than 50% of terrestrial biodiversity and store 250 billion tonnes of carbon. Deforestation accounts for approximately 10% of annual global emissions. Halting destruction and restoring 350 Mha within 6 years could sequester an additional 1.5–3 GtCO₂/year. These measures rank among the most cost-effective identified by the IPCC, at less than $20/tCO₂ for protecting existing forests.`,
    sectionTitle: 'Land systems — AFOLU: tropical forests and restoration',
    narratives: {
      optimistic: {
        label:   'Optimistic Scenario',
        horizon: '+10 yrs',
        text: 'By 2034, deforestation of primary tropical forests has dropped by **90%** from 2024 levels. An area equivalent to France and Germany is under active restoration. Land carbon sinks have absorbed an additional **18 GtCO₂** cumulated since 2025. Biodiversity hotspots are stabilising across the Amazon, Congo Basin and Southeast Asia.',
      },
      moderate: {
        label:   'Moderate Scenario',
        horizon: '+20 yrs',
        text: 'By 2044, deforestation has been reduced by **60%**, and restoration programmes cover 200 Mha. Agricultural pressures continue in key tropical regions. Cumulative carbon benefits amount to **~12 GtCO₂**, but sovereignty tensions around forest governance have slowed progress in several key countries.',
      },
      pessimistic: {
        label:   'Pessimistic Scenario',
        horizon: '+50 yrs',
        text: 'By 2074, without binding enforcement, deforestation has been reduced by only **20%**. An additional **1.5 million km²** of primary forest has been lost — an irreversible loss for biodiversity. The land sink has weakened significantly, accelerating the carbon feedback loop and adding **+0.2°C** to the global trajectory.',
      },
    },
  },

  // ─── dec-02 — Plant-based diets ──────────────────────────────────────────
  'dec-02': {
    title: 'Global transition towards plant-based sustainable diets',
    description: `Food systems are responsible for **21–37%** of global GHG emissions. A transition towards diets lower in animal protein — particularly beef — represents the demand-side option with the greatest mitigation potential according to the IPCC. It simultaneously reduces land-use pressure on tropical forests, agricultural methane emissions, and risks of diet-related chronic diseases.`,
    summary: `Food systems are responsible for 21–37% of global GHG emissions. A transition towards diets lower in animal protein — particularly beef — represents the demand-side option with the greatest mitigation potential according to the IPCC. It simultaneously reduces land-use pressure on tropical forests, agricultural methane emissions, and chronic disease risks associated with diet.`,
    sectionTitle: 'Sustainable food — diets and demand',
    narratives: {
      optimistic: {
        label:   'Optimistic Scenario',
        horizon: '+10 yrs',
        text: 'By 2034, plant-based diets represent **35%** of global food consumption in OECD countries. Beef consumption has fallen by **25%**. Agricultural land freed from livestock has enabled the restoration of 80 Mha of forests and grasslands. Food system emissions are down by **2 GtCO₂eq/year** globally.',
      },
      moderate: {
        label:   'Moderate Scenario',
        horizon: '+20 yrs',
        text: 'By 2044, dietary shifts have been concentrated in high-income countries. Global meat consumption has declined by **15%** overall, but increased by 40% in emerging economies due to rising incomes. Net agricultural GHG savings reach **~1 GtCO₂eq/year**. Cultural and economic barriers slow broader adoption.',
      },
      pessimistic: {
        label:   'Pessimistic Scenario',
        horizon: '+50 yrs',
        text: 'By 2074, absent strong demand-side policies, global meat consumption has increased by **30%** relative to 2024. Food system emissions now represent **28%** of the global total. Land-use pressures have driven an additional **500,000 km²** of deforestation, amplifying the climate crisis and biodiversity collapse.',
      },
    },
  },

  // ─── dec-01 — Transport electrification ──────────────────────────────────
  'dec-01': {
    title: 'Electrification of land transport and sustainable mobility within 26 years',
    description: `Land transport accounts for approximately **12%** of global CO₂ emissions. Combining vehicle electrification with decarbonisation of the electricity grid offers the most direct path to zero-emission transport. With solar and wind making electricity cheaper than petrol in many regions, the total cost of ownership of EVs is now competitive. The IPCC identifies this option as technically mature and publicly supported.`,
    summary: `Land transport accounts for approximately 12% of global CO₂ emissions. The combination of vehicle electrification and decarbonisation of the electricity grid offers the most direct path to zero-emission transport. With wind and solar making electricity cheaper than petrol in many regions, the total cost of ownership of electric vehicles is now competitive. The IPCC identifies this option as both technically mature and publicly supported.`,
    sectionTitle: 'Transport — electrification and sustainable mobility',
    narratives: {
      optimistic: {
        label:   'Optimistic Scenario',
        horizon: '+10 yrs',
        text: 'By 2034, EVs represent **55%** of new vehicle sales globally. Urban air quality has improved dramatically in major cities. Transport emissions have fallen by **1.8 GtCO₂/year**. Shared mobility and public transport have reduced overall vehicle numbers by **20%** in OECD metropolises.',
      },
      moderate: {
        label:   'Moderate Scenario',
        horizon: '+20 yrs',
        text: 'By 2044, EV penetration reaches **70%** of the global fleet. However, growing demand for transport in emerging economies offsets some gains. Net transport emissions are down by **40%** from 2024 levels. Battery raw material supply chains remain a geopolitical concern.',
      },
      pessimistic: {
        label:   'Pessimistic Scenario',
        horizon: '+50 yrs',
        text: 'By 2074, if grid decarbonisation has not kept pace with electrification, EVs charged on fossil fuel electricity provide only marginal emissions savings. Transport demand has more than doubled globally, and congestion has fragmented urban productivity. Net CO₂ savings from the policy reach only **15%** of the projected optimum.',
      },
    },
  },

  // ─── dec-08 — Solar + Wind ────────────────────────────────────────────────
  'dec-08': {
    title: 'Massive deployment of solar and wind: 100% decarbonised electricity within 26 years',
    description: `Solar and wind are now the cheapest sources of electricity in the majority of the world's regions, after unprecedented cost declines (−85% for solar, −55% for wind since 2010). A fully decarbonised electricity system is the backbone of any net-zero strategy: it makes electrification of transport, heating and industry climate-positive. The IPCC ranks solar and wind among the lowest-cost, most mature, and most socially accepted mitigation options.`,
    summary: `Solar and wind are today the cheapest sources of electricity in the majority of the world's regions, after an unprecedented cost decline (−85% for solar, −55% for wind since 2010). A 100% decarbonised electricity system is the backbone of any net-zero strategy: it makes electrification of transport, heating and industry virtuous. The IPCC ranks solar and wind among the lowest-cost, most mature and most socially accepted mitigation options.`,
    sectionTitle: 'Energy systems — solar, wind and decarbonisation',
    narratives: {
      optimistic: {
        label:   'Optimistic Scenario',
        horizon: '+10 yrs',
        text: 'By 2034, solar and wind supply **55%** of global electricity, up from ~14% in 2024. Annual installations exceed **500 GW**. Electricity costs have dropped by a further **40%**, accelerating the electrification of transport and heating. Energy-related CO₂ emissions have peaked and are declining steeply.',
      },
      moderate: {
        label:   'Moderate Scenario',
        horizon: '+20 yrs',
        text: 'By 2044, renewable electricity reaches **75%** of global generation. Grid stability challenges have driven innovation in long-duration storage and smart demand management. Fossil fuel power has been largely retired in developed economies, but coal remains significant in South and Southeast Asia.',
      },
      pessimistic: {
        label:   'Pessimistic Scenario',
        horizon: '+50 yrs',
        text: 'By 2074, without major grid infrastructure investment and permitting reform, renewable deployment has plateaued at **60%** of electricity — far short of the net-zero requirement. Stranded fossil fuel assets have created economic and political instability in producing regions. The 1.5°C target has been exceeded by 2040.',
      },
    },
  },

  // ─── dec-09 — Building renovation ────────────────────────────────────────
  'dec-09': {
    title: 'Universal deep energy retrofit of buildings within 26 years: zero fossil fuels',
    description: `Buildings account for approximately **21%** of global final energy consumption. Thermal efficiency is the most cost-effective mitigation option in this sector: a deep retrofit can reduce heating needs by **50–90%**. Combined with electrification (heat pumps) and grid decarbonisation, it enables positive-energy buildings. The IPCC highlights that retrofitting also presents major co-benefits for health, comfort and energy poverty.`,
    summary: `Buildings account for approximately 21% of global final energy consumption. Thermal efficiency is the most cost-effective mitigation option in this sector: a deep retrofit can reduce heating needs by 50–90%. Combined with electrification (heat pumps) and grid decarbonisation, it enables positive-energy buildings. The IPCC highlights that retrofitting also presents major co-benefits for health, comfort and energy poverty.`,
    sectionTitle: 'Buildings — energy efficiency and decarbonisation',
    narratives: {
      optimistic: {
        label:   'Optimistic Scenario',
        horizon: '+10 yrs',
        text: 'By 2034, **3%** of the global building stock undergoes deep renovation annually. 200 million households have switched from gas boilers to heat pumps. Building sector emissions are down by **30%** from 2024 levels. Energy bills for renovated households have fallen by an average of **60%**, reducing energy poverty by half in OECD countries.',
      },
      moderate: {
        label:   'Moderate Scenario',
        horizon: '+20 yrs',
        text: 'By 2044, renovation rates have improved but remain below the required pace in emerging economies. Fossil fuel heating has been phased out in new construction globally. Building sector emissions have declined by **50%** from 2024 levels. Workforce shortages in the renovation sector remain a binding constraint.',
      },
      pessimistic: {
        label:   'Pessimistic Scenario',
        horizon: '+50 yrs',
        text: 'By 2074, without sufficient public financing, renovation has stalled at **1% of stock per year**. Most pre-2000 buildings remain energy inefficient, continuing to consume fossil fuels for heating. The building sector still contributes **12%** of global emissions. The urban heat island effect has worsened conditions in inefficiently cooled buildings in tropical regions.',
      },
    },
  },

  // ─── dec-10 — Circular economy ───────────────────────────────────────────
  'dec-10': {
    title: 'Circular economy and material efficiency in global industry',
    description: `Industry accounts for approximately **24%** of global GHG emissions, including a hard-to-abate share (high-temperature processes, process emissions). The circular economy — reduce, reuse, recycle — cuts demand for energy-intensive raw materials and thus upstream emissions. The IPCC estimates that material efficiency and the circular economy could reduce industrial emissions by **40%** within 26 years, complementing electrification and CCS.`,
    summary: `Industry is responsible for approximately 24% of global GHG emissions, including a hard-to-abate share (high-temperature processes, process emissions). The circular economy — reduce, reuse, recycle — reduces demand for energy-intensive raw materials and thus upstream emissions. The IPCC estimates that material efficiency and the circular economy could reduce industrial emissions by 40% within 26 years, in addition to electrification and CCS.`,
    sectionTitle: 'Industry — material efficiency and circular economy',
    narratives: {
      optimistic: {
        label:   'Optimistic Scenario',
        horizon: '+10 yrs',
        text: 'By 2034, material recycling rates for steel, aluminium and plastics have doubled globally. Product lifespans have extended by **40%** on average through right-to-repair legislation. Industrial material demand is **15%** lower than the 2024 baseline despite continued economic growth. Secondary raw materials now supply **30%** of industrial inputs.',
      },
      moderate: {
        label:   'Moderate Scenario',
        horizon: '+20 yrs',
        text: 'By 2044, circular economy principles are embedded in product design regulations across 60% of global GDP. Industrial GHG intensity has fallen by **35%**, but overall output growth has offset half the gains. Material efficiency has proven more tractable than process emissions reduction, which still relies heavily on future CCS deployment.',
      },
      pessimistic: {
        label:   'Pessimistic Scenario',
        horizon: '+50 yrs',
        text: 'By 2074, without harmonised product standards and extended producer responsibility, circular economy adoption has remained fragmented. Global material consumption has increased by **80%** from 2024 levels, driven by infrastructure build-out in the Global South. Industrial emissions remain the most intractable sector for decarbonisation.',
      },
    },
  },

  // ─── dec-11 — Industrial CCS ─────────────────────────────────────────────
  'dec-11': {
    title: 'Deployment of carbon capture and storage (CCS) for heavy industry within 26 years',
    description: `Some industries — steel, cement, chemicals, refining — produce process emissions impossible to eliminate through electrification alone. Carbon capture and storage (CCS) is the only near-to-medium-term tool to decarbonise these sectors. The IPCC indicates that pathways limiting warming to 2°C almost universally deploy CCS for heavy industry. The challenge is scale: today, global capture capacities represent less than **0.1%** of the volume needed within 26 years.`,
    summary: `Some industries — steel, cement, chemicals, refining — produce process emissions impossible to eliminate through electrification alone. Carbon capture and storage (CCS) is the only tool to decarbonise these sectors in the short-to-medium term. The IPCC indicates that pathways limiting warming to 2°C almost universally deploy CCS for heavy industry. The challenge is scale: today, global capture capacities represent less than 0.1% of the volume needed within 26 years.`,
    sectionTitle: 'Industry — carbon capture and storage (CCS)',
    narratives: {
      optimistic: {
        label:   'Optimistic Scenario',
        horizon: '+10 yrs',
        text: 'By 2034, industrial CCS capacity reaches **500 MtCO₂/year**, up from ~45 Mt in 2024. Steel and cement sectors have integrated CCS at 30% of their output. CO₂ transport and storage infrastructure is emerging as a new strategic industry. Public-private investment in CCS hubs has surpassed $200 billion.',
      },
      moderate: {
        label:   'Moderate Scenario',
        horizon: '+20 yrs',
        text: 'By 2044, CCS captures **1.5 GtCO₂/year** from industrial facilities — significant but below the 3–4 Gt needed by 2050. High capital costs and long lead times have slowed deployment. Geological storage capacity is proving adequate, but public acceptance near storage sites varies widely by region.',
      },
      pessimistic: {
        label:   'Pessimistic Scenario',
        horizon: '+50 yrs',
        text: 'By 2074, CCS has delivered only **0.5 GtCO₂/year** due to persistent cost overruns, lack of regulatory certainty, and competition for subsurface storage with other uses. Heavy industry remains the largest unabated source of GHG emissions globally. The gap between actual CCS deployment and net-zero requirements has become the defining failure of the 2024–2074 climate transition.',
      },
    },
  },

  // ─── dec-12 — Nuclear ────────────────────────────────────────────────────
  'dec-12': {
    title: 'Nuclear expansion as decarbonised baseload: double capacity within 26 years',
    description: `Nuclear energy generates electricity with lifecycle emissions comparable to wind **(4–16 gCO₂eq/kWh)**. The IPCC recognises it as a low-emission mitigation option, though its feasibility is constrained by high investment costs, long construction timelines and waste management. In 1.5°C scenarios, nuclear plays a variable role: some pathways assume expansion, others maintenance or decline in favour of renewables.`,
    summary: `Nuclear energy generates electricity with lifecycle emissions comparable to wind (4–16 gCO₂eq/kWh). The IPCC recognises it as a low-emission mitigation option, though its feasibility is constrained by high investment costs, long construction timelines and waste management. In 1.5°C scenarios, nuclear plays a variable role: some pathways assume expansion, others maintenance or decline in favour of renewables.`,
    sectionTitle: 'Energy systems — nuclear as low-carbon baseload',
    narratives: {
      optimistic: {
        label:   'Optimistic Scenario',
        horizon: '+10 yrs',
        text: 'By 2034, new modular reactor (SMR) designs have reduced construction timelines from 15 to 7 years. Thirty countries have committed to nuclear expansion programmes. Baseload decarbonisation has accelerated in regions with low renewable potential (high latitudes, dense urban grids). Global nuclear capacity has increased by **80 GW**.',
      },
      moderate: {
        label:   'Moderate Scenario',
        horizon: '+20 yrs',
        text: 'By 2044, nuclear capacity has increased by **150 GW** globally. However, cost overruns have continued in Western projects while China and India have delivered on schedule. Nuclear provides stable baseload in variable-renewable-heavy grids. Public acceptance remains divided, with Germany and Japan still in phase-out mode.',
      },
      pessimistic: {
        label:   'Pessimistic Scenario',
        horizon: '+50 yrs',
        text: 'By 2074, without a dramatic reduction in construction costs, nuclear expansion has stalled at **+60 GW** globally — a fraction of what was planned. Aging plants have retired faster than new ones came online. Nuclear\'s share of global electricity has fallen below **8%**. Battery storage and long-distance transmission have filled the gap at lower cost.',
      },
    },
  },

  // ─── dec-13 — Fluorinated gases ──────────────────────────────────────────
  'dec-13': {
    title: 'Global phase-out of fluorinated greenhouse gases (extended Kigali Amendment)',
    description: `Fluorinated gases — HFCs, PFCs, SF₆ — are GHGs with **global warming potential 1,000 to 23,000 times** that of CO₂. Principally used in refrigeration, air conditioning, insulating foams and semiconductors, they represent ~1.5 GtCO₂eq/year (2024). The Kigali Amendment (2016) targets an 80% reduction in HFCs by 2050, but this decision goes further: (1) accelerated timeline — **85% reduction within 12 years**, (2) extension to uncovered PFCs and SF₆, (3) technology transfer for substitutes (HFOs, natural CO₂, ammonia) to developing countries. This is one of the most **cost-effective** measures in the entire catalogue.`,
    summary: `Fluorinated gases (HFCs, PFCs, SF₆, NF₃) are GHGs with a global warming potential 1,000 to 25,000 times that of CO₂. They represent approximately 2.5% of global emissions but are growing rapidly. The Kigali Amendment (2016) commits countries to reduce HFCs by 85% by 2047 — alternatives exist for virtually all current uses.`,
    sectionTitle: 'Industry — reduction of fluorinated gases',
    narratives: {
      optimistic: {
        label:   'Optimistic Scenario',
        horizon: '+10 yrs',
        text: 'By 2034, HFC production has fallen by **70%** globally. Natural refrigerants (CO₂, ammonia, propane) dominate new equipment sales in OECD markets. Illegal HFC trade has been curtailed by satellite monitoring. This single measure has avoided the equivalent of **10 GtCO₂** cumulated since 2025.',
      },
      moderate: {
        label:   'Moderate Scenario',
        horizon: '+20 yrs',
        text: 'By 2044, HFC emissions have been cut by **80%** in developed countries but only **40%** globally due to growing cooling demand in tropical regions. SF₆ reductions in the power sector have been slower due to lack of substitutes for high-voltage switchgear. Total F-gas emissions are down **60%** from 2024 levels.',
      },
      pessimistic: {
        label:   'Pessimistic Scenario',
        horizon: '+50 yrs',
        text: 'By 2074, without effective enforcement and technology transfer, global F-gas emissions have only declined by **30%** despite the Kigali tightening. Explosive cooling demand in South Asia and Africa — driven by rising temperatures — has partially offset HFC substitution gains. The missed potential represents **20 GtCO₂eq** of avoidable warming.',
      },
    },
  },

  // ─── dec-14 — Food waste ──────────────────────────────────────────────────
  'dec-14': {
    title: '50% reduction in global food waste and loss within 6 years (SDG 12.3)',
    description: `**One-third** of the world's food production is lost or wasted — representing 8–10% of global GHG emissions. Reducing this waste by **50% within 6 years** (SDG 12.3) would eliminate 2–4 GtCO₂eq/year without requiring major technological change. It is one of the most cost-effective mitigation options identified by the IPCC, with co-benefits for global food security.`,
    summary: `One-third of the world's food production is lost or wasted — representing 8–10% of global GHG emissions. Reducing this waste by 50% within 6 years (SDG 12.3) would eliminate 2–4 GtCO₂eq/year without requiring major technological change. It is one of the most cost-effective mitigation options identified by the IPCC, with co-benefits for global food security.`,
    sectionTitle: 'Food systems — food waste and value chains',
    narratives: {
      optimistic: {
        label:   'Optimistic Scenario',
        horizon: '+10 yrs',
        text: 'By 2034, food waste at retail and consumer level has been halved in OECD countries through mandatory labelling, date reform, and redistribution infrastructure. Post-harvest losses in developing countries have been reduced by **30%** via cold-chain investment. Global food system emissions are down by **1.5 GtCO₂eq/year**, equivalent to removing 300 million cars from the road.',
      },
      moderate: {
        label:   'Moderate Scenario',
        horizon: '+20 yrs',
        text: 'By 2044, global food waste reduction has reached **35%** — short of the SDG 12.3 target but significant. Supply chain digitalisation has improved inventory management. Consumer behaviour change has been the most tractable element; post-harvest losses in low-income countries remain stubbornly high due to infrastructure gaps.',
      },
      pessimistic: {
        label:   'Pessimistic Scenario',
        horizon: '+50 yrs',
        text: 'By 2074, without structural changes in food retail and agricultural supply chains, food waste has declined by only **15%** globally. Growing middle-class consumption patterns have partially offset efficiency gains. The missed mitigation potential represents **~60 GtCO₂eq** of cumulative emissions since 2025 — the equivalent of 3 years of global total emissions.',
      },
    },
  },

  // ─── dec-15 — Agroforestry ────────────────────────────────────────────────
  'dec-15': {
    title: 'Global agroforestry and carbon sequestration in agricultural soils',
    description: `Agroforestry integrates trees into agricultural systems, creating synergies between food production, carbon sequestration and biodiversity. Degraded agricultural soils represent a sequestration potential of **0.9–1.85 GtCO₂/year** if sustainably managed. These practices are part of the AFOLU options that the IPCC identifies as essential complements to energy-sector measures.`,
    summary: `Agroforestry integrates trees into agricultural systems, creating synergies between food production, carbon sequestration and biodiversity. Degraded agricultural soils represent a sequestration potential of 0.9–1.85 GtCO₂/year if sustainably managed. These practices are part of the AFOLU options that the IPCC identifies as essential complements to energy-sector measures.`,
    sectionTitle: 'Agriculture and land use — sequestration and agroforestry',
    narratives: {
      optimistic: {
        label:   'Optimistic Scenario',
        horizon: '+10 yrs',
        text: 'By 2034, agroforestry systems cover **500 Mha** globally — up from ~180 Mha in 2024. Soil carbon content has increased measurably in 40% of enrolled farmland. Smallholder farmers in tropical regions have seen income increase by **25%** thanks to diversified agroforestry products. Annual sequestration reaches **1.2 GtCO₂/year**.',
      },
      moderate: {
        label:   'Moderate Scenario',
        horizon: '+20 yrs',
        text: 'By 2044, agroforestry has been adopted on **350 Mha**, driven primarily by co-benefits for food security and resilience. Carbon sequestration delivers **0.8 GtCO₂/year** on average — below potential due to the time lag for trees to mature. Monitoring, reporting and verification (MRV) systems have improved but remain resource-intensive.',
      },
      pessimistic: {
        label:   'Pessimistic Scenario',
        horizon: '+50 yrs',
        text: 'By 2074, without long-term land tenure security and carbon finance, agroforestry adoption has stagnated at **200 Mha**. Many early-adopter trees have been harvested or died without replacement. The sequestration sink amounts to only **0.3 GtCO₂/year** — insufficient to offset the agricultural sector\'s emissions.',
      },
    },
  },

  // ─── dec-16 — Ecosystem restoration ──────────────────────────────────────
  'dec-16': {
    title: 'Global ecosystem restoration: reforestation, peatlands and wetlands',
    description: `Restoring degraded ecosystems — forests, peatlands, wetlands, mangroves — is an urgent priority for both climate and biodiversity. Peatlands alone store **twice as much carbon** as all the world's forests, despite their small surface area. The UN Decade on Ecosystem Restoration (2021–2030) targets 1 billion hectares restored. This decision mandates: (1) a **$200 billion/year** fund for restoration in tropical forest countries, (2) immediate protection of all intact peatlands, (3) a global mangrove and seagrass restoration programme (Blue Carbon).`,
    summary: `Restoring degraded ecosystems — forests, peatlands, wetlands, mangroves — is an urgent priority for both climate and biodiversity. Peatlands alone store twice as much carbon as all the world's forests combined, despite their small surface area. The UN Decade on Ecosystem Restoration (2021–2030) targets 350 Mha restored. The IPCC consistently shows that protecting existing ecosystems is cheaper and more effective than restoration after degradation.`,
    sectionTitle: 'Natural ecosystem restoration and sequestration',
    narratives: {
      optimistic: {
        label:   'Optimistic Scenario',
        horizon: '+10 yrs',
        text: 'By 2034, **400 Mha** of degraded ecosystems are under active restoration globally. All intact peatlands are under legal protection. Restored mangroves cover **30%** more coastline than in 2024, providing co-benefits for storm protection and fisheries. Nature-based solutions are sequestering **2.5 GtCO₂/year** collectively.',
      },
      moderate: {
        label:   'Moderate Scenario',
        horizon: '+20 yrs',
        text: 'By 2044, ecosystem restoration covers **280 Mha** — significant but below the UN Decade target. Financing has been the key bottleneck. Restored forests are now net carbon sinks, but peatland restoration has been slower due to technical complexity and land-use conflicts. Annual sequestration reaches **1.8 GtCO₂/year**.',
      },
      pessimistic: {
        label:   'Pessimistic Scenario',
        horizon: '+50 yrs',
        text: 'By 2074, without sustained financing and governance, restoration has covered only **80 Mha** — much of it low-quality monoculture plantations with limited carbon and biodiversity value. Continued peatland drainage for agriculture has turned this biome from a net sink into a net source. The land system has added **+0.3°C** of additional warming pressure.',
      },
    },
  },

  // ─── dec-17 — BECCS ──────────────────────────────────────────────────────
  'dec-17': {
    title: 'Large-scale deployment of bioenergy with carbon capture and storage (BECCS)',
    description: `Bioenergy with carbon capture and storage (BECCS) generates energy from biomass while capturing and storing the CO₂ emitted, producing **net negative emissions**. Almost all 1.5°C scenarios deploy it to offset irreducible residual emissions. However, the IPCC highlights major risks: competition with agricultural land and biodiversity, water availability, and large-scale feasibility that **remains uncertain**.`,
    summary: `Bioenergy with carbon capture and storage (BECCS) generates energy from biomass while capturing and storing the CO₂ emitted, producing net negative emissions. Almost all 1.5°C scenarios deploy it to offset irreducible residual emissions. However, the IPCC highlights major risks: competition with agricultural land and biodiversity, water availability, and large-scale feasibility that remains uncertain.`,
    sectionTitle: 'Carbon dioxide removal (CDR) — BECCS',
    narratives: {
      optimistic: {
        label:   'Optimistic Scenario',
        horizon: '+10 yrs',
        text: 'By 2034, BECCS plants are operational in 15 countries, capturing **200 MtCO₂/year**. Sustainable biomass sourcing from agricultural residues and purpose-grown energy crops on degraded land has avoided land-use conflicts. The technology has achieved cost parity with DAC (direct air capture). First geological CO₂ storage sites have been certified.',
      },
      moderate: {
        label:   'Moderate Scenario',
        horizon: '+20 yrs',
        text: 'By 2044, BECCS captures **0.5 GtCO₂/year** — well below the 1–3 Gt assumed in many 1.5°C pathways. Land competition has emerged as the main constraint: the biomass required has displaced food crops in several regions, triggering food price spikes. The technology is real but its net carbon benefit has been contested by life-cycle analyses.',
      },
      pessimistic: {
        label:   'Pessimistic Scenario',
        horizon: '+50 yrs',
        text: 'By 2074, BECCS has proven unable to scale beyond **0.3 GtCO₂/year** globally without unacceptable land-use impacts. The over-reliance on negative emissions technologies in 2020s–2030s climate pledges has proven a moral hazard, delaying urgent emissions cuts. The carbon overshoot that BECCS was supposed to offset has locked in **+1.8°C** of warming.',
      },
    },
  },
}
