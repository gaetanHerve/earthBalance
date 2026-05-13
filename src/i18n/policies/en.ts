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

  // ─── dec-18 — Green hydrogen ──────────────────────────────────────────────
  'dec-18': {
    title: 'Green hydrogen for heavy industry and transport',
    description: `Hydrogen produced by electrolysis using renewable electricity (**green hydrogen**) offers a decarbonisation pathway for sectors that are hard to electrify directly: steelmaking, chemicals, cement, long-distance heavy freight. IPCC AR6 WGIII identifies low-carbon hydrogen as a high-potential option for "hard-to-abate" sectors, with a reduction potential of **1.5 to 2.5 GtCO₂/year** by 2050 globally. This decision proposes funding a global programme for renewable electrolysis deployment at **$150 billion/year** by 2030.`,
    narratives: {
      optimistic: {
        label:   'Optimistic Scenario',
        horizon: '+10 yrs',
        text: 'By 2034, **45 GW** of electrolysers are operational worldwide. Green hydrogen costs have fallen below **$2/kg**, reaching parity with grey hydrogen in Europe. The first hydrogen-based blast furnaces are operating in Sweden (HYBRIT) and Germany. Heavy freight accounts for 8% of global clean hydrogen consumption.',
      },
      moderate: {
        label:   'Moderate Scenario',
        horizon: '+20 yrs',
        text: 'By 2044, green hydrogen covers **12%** of global heavy industry energy needs. Geopolitical tensions around hydrogen export corridors (North Africa → Europe, Australia → Japan) slow deployment. Industrial emissions fall **18%** from 2024. Long-distance shipping progressively integrates green ammonia.',
      },
      pessimistic: {
        label:   'Pessimistic Scenario',
        horizon: '+50 yrs',
        text: 'By 2074, insufficient investment means green hydrogen covers only **5%** of global industrial needs. Widespread "hydrogen washing" — relying on blue hydrogen with incomplete CCS — has diluted climate benefits. The net climate contribution remains marginal: **–0.03°C**.',
      },
    },
  },

  // ─── dec-19 — Smart grids & storage ──────────────────────────────────────
  'dec-19': {
    title: 'Smart electricity grids and energy storage',
    description: `The large-scale deployment of renewable energy is constrained by solar and wind intermittency and the rigidity of existing grid infrastructure. **Smart grids** coupled with storage systems (batteries, pumped hydro, hydrogen, gravity) enable renewable penetration rates above **80%** in the electricity mix. IPCC AR6 estimates the reduction potential of this pillar at **1 to 2 GtCO₂/year** by 2050 by unlocking renewable integration. This decision mandates a global investment of **$80 billion/year** in grid modernisation and utility-scale storage.`,
    narratives: {
      optimistic: {
        label:   'Optimistic Scenario',
        horizon: '+10 yrs',
        text: 'By 2034, **25 million km** of transmission and distribution lines have been modernised. Renewable penetration exceeds **65%** of the global electricity mix. Stationary storage systems reach **3,000 GWh** of installed capacity. Demand flexibility (V2G electric vehicles, smart water heaters) avoids the construction of **200 GW** of gas peaker plants.',
      },
      moderate: {
        label:   'Moderate Scenario',
        horizon: '+20 yrs',
        text: 'By 2044, smart grids have enabled **55%** renewables in the global electricity mix. Bottlenecks persist in South Asia and sub-Saharan Africa. Long-duration seasonal storage remains expensive and underdeployed. Net reduction reaches **–0.8 GtCO₂/year**.',
      },
      pessimistic: {
        label:   'Pessimistic Scenario',
        horizon: '+50 yrs',
        text: 'By 2074, ageing infrastructure and cybersecurity concerns have slowed modernisation in fragile economies. Grid failures from poorly managed renewable integration have created political resistance. The net reduction remains positive (**–0.04°C**) but well below the theoretical potential.',
      },
    },
  },

  // ─── dec-20 — Geothermal & hydro ─────────────────────────────────────────
  'dec-20': {
    title: 'Next-generation geothermal and hydropower',
    description: `Deep geothermal (Enhanced Geothermal Systems, EGS) and run-of-river micro-hydropower represent **dispatchable, zero-carbon** electricity sources complementary to solar and wind. EGS can theoretically power the entire planet without emissions, but remains to be demonstrated at scale. IPCC AR6 estimates that existing and new hydropower can contribute **0.5 to 1 GtCO₂/year** of reduction. This decision funds geothermal exploration in 40 countries and the construction of **500 GW** of small and medium hydropower by 2050, subject to strict environmental standards.`,
    narratives: {
      optimistic: {
        label:   'Optimistic Scenario',
        horizon: '+10 yrs',
        text: 'By 2034, **15 EGS projects** are commercially operational worldwide (Kenya, Iceland, Indonesia, USA). Geothermal provides **500 TWh/year** of round-the-clock electricity. 200 GW of small hydro are built in South-East Asia and Africa with environmental standards ensuring ecological flow continuity.',
      },
      moderate: {
        label:   'Moderate Scenario',
        horizon: '+20 yrs',
        text: 'By 2044, EGS geothermal has met its technical promise but deep-drilling costs remain high. Hydropower is facing **water stress** in several river basins, reducing effective output. Net contribution reaches **–0.6 GtCO₂/year**.',
      },
      pessimistic: {
        label:   'Pessimistic Scenario',
        horizon: '+50 yrs',
        text: 'By 2074, climate-driven persistent drought has reduced global hydropower output by **15%**. Large dams built in high water-stress zones have generated transboundary conflicts. Geothermal has partially compensated, but the net emissions benefit remains limited to **–0.03°C**.',
      },
    },
  },

  // ─── dec-21 — Zero-carbon building codes ─────────────────────────────────
  'dec-21': {
    title: 'Mandatory zero-carbon standards for new construction',
    description: `Buildings account for **~21% of global GHG emissions** (heating, cooling, hot water). IPCC AR6 WGIII estimates the building sector's mitigation potential at **3 to 5 GtCO₂/year** by 2050. This decision requires all new construction to meet net-zero-emission standards (operational and embodied carbon) from entry into force. It includes building energy performance standards, a ban on fossil fuel boilers in new buildings, and an international "Climate-Ready Building" certification framework with third-party auditing.`,
    narratives: {
      optimistic: {
        label:   'Optimistic Scenario',
        horizon: '+10 yrs',
        text: 'By 2034, **100% of building permits** in OECD countries require zero-carbon compliance. Heat pumps represent 80% of heating systems in new builds. Low-carbon materials (CLT, geopolymer concrete, bio-based insulation) are mainstream. New buildings consume **70% less energy** than the average existing stock.',
      },
      moderate: {
        label:   'Moderate Scenario',
        horizon: '+20 yrs',
        text: 'By 2044, zero-carbon standards apply in **65 countries** representing 70% of new global construction. Effective reductions depend on the turnover rate of existing stock (50–80-year building lifespans). Net reduction reaches **–0.7 GtCO₂/year**, but full impact on the total stock will not arrive until 2060–2070.',
      },
      pessimistic: {
        label:   'Pessimistic Scenario',
        horizon: '+50 yrs',
        text: 'By 2074, rapid urbanisation in South Asia and Africa has led to hundreds of millions of poorly insulated dwellings being built, despite standards adopted on paper. Existing stock inertia and weak enforcement in emerging countries limited the reduction to **–0.04°C**.',
      },
    },
  },

  // ─── dec-22 — Appliance efficiency standards ─────────────────────────────
  'dec-22': {
    title: 'Minimum energy performance standards for electrical appliances and lighting',
    description: `Inefficient electrical appliances (refrigerators, air conditioners, industrial motors, lighting) account for roughly **10% of global energy-related emissions**. Minimum Energy Performance Standards (MEPS) are among the most **cost-effective** options in the mitigation portfolio: the IEA estimates that eliminating the least efficient appliances would avoid **1,400 TWh/year** of electricity consumption by 2030. This decision establishes global MEPS for the 10 most energy-intensive appliance categories, with a convergence mechanism towards best-available technology.`,
    narratives: {
      optimistic: {
        label:   'Optimistic Scenario',
        horizon: '+10 yrs',
        text: 'By 2034, global MEPS have eliminated the **20% least efficient appliances** from world markets. LED lighting represents 95% of the market. Next-generation air conditioners consume **45% less** than in 2024. Electricity bill savings reach **$450 billion/year** for global households.',
      },
      moderate: {
        label:   'Moderate Scenario',
        horizon: '+20 yrs',
        text: 'By 2044, MEPS have reduced appliance electricity consumption by **18%** from 2024, but demand growth (air conditioning in hot countries, proliferation of connected devices) has partially offset the gains. Net reduction reaches **–0.5 GtCO₂/year**.',
      },
      pessimistic: {
        label:   'Pessimistic Scenario',
        horizon: '+50 yrs',
        text: 'By 2074, appliance stock growth in emerging economies (+3 billion households entering the middle class) has nearly fully offset efficiency gains. The "rebound effect" — energy savings reinvested in additional consumption — has reduced the net climate benefit to **–0.02°C**.',
      },
    },
  },

  // ─── dec-23 — Public transport & active mobility ─────────────────────────
  'dec-23': {
    title: 'Public transport, active mobility and urban planning',
    description: `Road transport accounts for **12% of global GHG emissions**. Expanding public transport (metro, BRT, commuter rail) and cycling/pedestrian infrastructure reduces car dependency while improving public health and urban air quality. IPCC AR6 WGIII highlights that **urban densification** combined with active mobility can reduce transport emissions by **0.8 to 1.8 GtCO₂/year** by 2050. This decision commits **$120 billion/year** to global low-carbon transport infrastructure.`,
    narratives: {
      optimistic: {
        label:   'Optimistic Scenario',
        horizon: '+10 yrs',
        text: 'By 2034, **500 cities** have adopted sustainable mobility plans integrating BRT, bike-sharing and low-emission zones. Public transport modal share exceeds **40%** in covered urban areas. Urban air pollution mortality has fallen **22%**. Urban transport emissions drop **18%** from 2024.',
      },
      moderate: {
        label:   'Moderate Scenario',
        horizon: '+20 yrs',
        text: 'By 2044, the transition to sustainable mobility is well under way in OECD countries, but persistent urban sprawl in emerging cities limits results. Sector emissions fall **0.7 GtCO₂/year**. Political resistance to parking reduction and congestion pricing has slowed ambitions.',
      },
      pessimistic: {
        label:   'Pessimistic Scenario',
        horizon: '+50 yrs',
        text: 'By 2074, urbanisation in the Global South has produced megacities with high car dependency. Public transport built has been underused due to insufficient urban densification. Net climate benefit is limited to **–0.03°C**, but health co-benefits in covered areas remain significant.',
      },
    },
  },

  // ─── dec-24 — Decarbonising freight, shipping & aviation ─────────────────
  'dec-24': {
    title: 'Decarbonising heavy freight, international shipping and aviation',
    description: `International shipping and aviation together account for **~2.5% of global emissions**, but their decarbonisation is technically challenging (long distances, high energy density requirements). IPCC AR6 WGIII identifies alternative fuels — **green ammonia, green methanol, SAF (Sustainable Aviation Fuel)** — as the primary pathway. This decision establishes progressive blending mandates (10% low-carbon fuels by 2030, 50% by 2040, 100% by 2050) for international shipping and aviation, and funds green bunkering infrastructure at the 50 largest ports.`,
    narratives: {
      optimistic: {
        label:   'Optimistic Scenario',
        horizon: '+10 yrs',
        text: 'By 2034, **15% of the global shipping fleet** runs on green ammonia or methanol. SAF represents **8%** of aviation fuel consumed. Twenty major ports (Rotterdam, Singapore, Shanghai) have green fuel bunkering infrastructure. Cost premiums are partially absorbed by the international maritime carbon tax.',
      },
      moderate: {
        label:   'Moderate Scenario',
        horizon: '+20 yrs',
        text: 'By 2044, transition progresses but high alternative fuel costs have limited adoption beyond strictly regulated routes. Shipping reaches **35%** green fuels, aviation **18%**. Global air cargo demand has continued to grow, partially offsetting efficiency gains. Net reduction reaches **–0.5 GtCO₂/year**.',
      },
      pessimistic: {
        label:   'Pessimistic Scenario',
        horizon: '+50 yrs',
        text: 'By 2074, competition between green ammonia for shipping and green hydrogen for industry has created supply tensions. Aviation has multiplied traffic 2.5× since 2024, erasing efficiency and SAF gains. Net climate benefit remains at **–0.03°C** despite mandates.',
      },
    },
  },

  // ─── dec-25 — Industrial heat electrification ─────────────────────────────
  'dec-25': {
    title: 'Electrification of industrial heat and high-temperature heat pumps',
    description: `Industrial heat accounts for **~20% of global GHG emissions**. Most industrial processes requiring less than **200°C** (fine chemicals, food processing, laundries, drying) can be electrified via **high-temperature heat pumps** (2–5× more efficient than electric resistance heating). For high-temperature processes (steel, cement, glass), electric arc and plasma technologies are under development. This decision funds the electrification of **30% of industrial thermal processes** by 2040 through conversion subsidies and soft loans.`,
    narratives: {
      optimistic: {
        label:   'Optimistic Scenario',
        horizon: '+10 yrs',
        text: 'By 2034, **8,000 high-temperature industrial heat pumps** are operational in the EU, Japan and South Korea. European food and beverage industry has cut thermal emissions by **38%**. Biomass dryers and paper mills run on renewable electricity. Average heat pump electricity cost is below gas in high-renewable regions.',
      },
      moderate: {
        label:   'Moderate Scenario',
        horizon: '+20 yrs',
        text: 'By 2044, electrification covers **20%** of global industrial heat. Transition is rapid below 100°C but slow for high-temperature processes (glass, cement, metallurgy). Residual gas dependency persists for high-temperature process heat. Net reduction: **–1.0 GtCO₂/year**.',
      },
      pessimistic: {
        label:   'Pessimistic Scenario',
        horizon: '+50 yrs',
        text: 'By 2074, high-temperature industrial processes (>500°C) still resist electrification due to lack of mature commercial solutions. Industrial growth in emerging countries offsets OECD gains. Net reduction remains positive but insufficient: **–0.04°C**.',
      },
    },
  },

  // ─── dec-26 — Carbon capture & utilisation ────────────────────────────────
  'dec-26': {
    title: 'Carbon capture and utilisation (CCU) in cement and chemicals',
    description: `The **cement** (~8% of global emissions) and **chemicals** (~4%) industries generate so-called "process emissions" — linked to fundamental chemical reactions, not just combustion. Carbon Capture and Utilisation (CCU) transforms captured CO₂ into feedstocks (methanol, e-fuels, mineral aggregates). IPCC AR6 WGIII estimates the industrial CCU potential at **0.3 to 1.3 GtCO₂/year** by 2050. This decision funds demonstration of 50 industrial CCU projects and establishes a certified carbon credit market for utilised CO₂.`,
    narratives: {
      optimistic: {
        label:   'Optimistic Scenario',
        horizon: '+10 yrs',
        text: 'By 2034, **25 cement plants** operate with integrated carbon capture in Europe, Japan and North America. Captured CO₂ is valorised as mineralised concrete and synthetic methanol. Low-carbon cement production cost is only **15% higher** than conventional. An ISO "certified zero-carbon cement" standard is adopted.',
      },
      moderate: {
        label:   'Moderate Scenario',
        horizon: '+20 yrs',
        text: 'By 2044, cement/chemicals CCU captures **200 MtCO₂/year** — significant but below potential. Low-carbon electricity supply constraints limit deployment in countries with a still-carbonised grid. Net reduction reaches **–0.3 GtCO₂/year**.',
      },
      pessimistic: {
        label:   'Pessimistic Scenario',
        horizon: '+50 yrs',
        text: 'By 2074, CCU has struggled to scale beyond demonstration level in emerging economies, which produce 70% of global cement. The CCU credit market has suffered from certification and double-counting problems. Net climate benefit remains at **–0.02°C**.',
      },
    },
  },

  // ─── dec-27 — Energy sufficiency & lifestyle change ───────────────────────
  'dec-27': {
    title: 'Energy sufficiency and lifestyle changes',
    description: `IPCC AR6 WGIII dedicates a full chapter for the first time to **lifestyle and behavioural changes** as a mitigation option. Low-carbon diets, reduced air travel, smaller living spaces, product sharing and food waste reduction have a combined potential of **1.5 to 2.5 GtCO₂/year** by 2030. This decision proposes policies incentivising sufficiency: carbon taxation of high-emission behaviours, active mobility subsidies, carbon nutrition labels, public education campaigns and social norm reform.`,
    narratives: {
      optimistic: {
        label:   'Optimistic Scenario',
        horizon: '+10 yrs',
        text: 'By 2034, diets have shifted: red meat consumption has fallen **28%** in OECD countries. Short-haul air passenger numbers drop **22%** thanks to taxation and rail expansion. Carbon footprint labelling is mandatory on all products in Europe. Emissions from wealthy household consumption fall **18%**.',
      },
      moderate: {
        label:   'Moderate Scenario',
        horizon: '+20 yrs',
        text: 'By 2044, sufficiency advances but runs into structural inequalities: lower-income households have little sufficiency margin, while wealthier ones compensate efforts with other consumption. Net reduction reaches **–1.0 GtCO₂/year** — less than theoretical potential, but with significant health co-benefits.',
      },
      pessimistic: {
        label:   'Pessimistic Scenario',
        horizon: '+50 yrs',
        text: 'By 2074, sufficiency campaigns have hit systematic rebound effects: savings reinvested in new consumption. Growing global middle class has amplified overall consumption. Net climate benefit remains positive (**–0.04°C**) but health and quality-of-life co-benefits in pioneer areas are substantial.',
      },
    },
  },

  // ─── dec-28 — International climate finance ──────────────────────────────
  'dec-28': {
    title: 'International climate finance: $100 billion/year to developing countries',
    description: `The pledge of **$100 billion per year** in climate finance made by developed countries in 2009 (Copenhagen Accord) was never fully met. The New Collective Quantified Goal (NCQG) now sets the target at **$300 billion/year** by 2035. IPCC AR6 emphasises that without adequate financing, developing countries — responsible for less than 1 tonne of CO₂ per capita — cannot accelerate their transition. This decision enshrines and operationalises a binding mechanism for low-carbon capital transfer.`,
    narratives: {
      optimistic: {
        label:   'Optimistic Scenario',
        horizon: '+10 yrs',
        text: 'By 2034, **$280 billion** in climate finance flows annually to developing countries via transparent and binding mechanisms. Sub-Saharan Africa installs **150 GW** of decentralised solar, leapfrogging centralised fossil fuel grids. Thirty low-income countries have achieved **50%** renewables in their electricity mix.',
      },
      moderate: {
        label:   'Moderate Scenario',
        horizon: '+20 yrs',
        text: 'By 2044, climate finance has enabled accelerated transitions in **40 middle-income countries**. Least-developed countries remain underfinanced due to limited institutional absorption capacity. Net reduction reaches **–0.7 GtCO₂/year**. Development co-benefits (energy access, employment) are considerable.',
      },
      pessimistic: {
        label:   'Pessimistic Scenario',
        horizon: '+50 yrs',
        text: 'By 2074, part of the finance was diverted or poorly allocated. Excessive donor conditionality slowed disbursements. Developing countries, whose emissions represent the majority of global emissions growth, followed partly fossil trajectories. Net reduction: **–0.03°C** despite committed amounts.',
      },
    },
  },

  // ─── dec-29 — Coastal ecosystems ─────────────────────────────────────────
  'dec-29': {
    title: 'Protection and restoration of coastal ecosystems (mangroves, seagrasses, wetlands)',
    description: `Coastal ecosystems — **mangroves, seagrasses, salt marshes** — sequester carbon at rates up to **5× higher** than terrestrial forests and store it in sediments for millennia. This is known as **blue carbon**. These ecosystems also serve as storm barriers, fish nurseries and biodiversity refuges. Yet 50% of the world's mangroves have disappeared since 1950. This decision funds the protection of **100% of remaining mangroves** and restoration of **5 million hectares** by 2040.`,
    narratives: {
      optimistic: {
        label:   'Optimistic Scenario',
        horizon: '+10 yrs',
        text: 'By 2034, **100% of existing mangroves** are under international legal protection. 2 million hectares are restored in South-East Asia, West Africa and Central America. Seagrass cover in marine protected areas has increased by **35%**. Adjacent coral reefs benefit from reduced eutrophication. Coastal communities report enhanced resilience to storms.',
      },
      moderate: {
        label:   'Moderate Scenario',
        horizon: '+20 yrs',
        text: 'By 2044, restoration covers **3.5 million hectares** but intensive aquaculture and coastal development continue to threaten mangroves in several countries. Sea-level rise compromises restoration in the most exposed areas. Net sequestration reaches **–0.35 GtCO₂/year**.',
      },
      pessimistic: {
        label:   'Pessimistic Scenario',
        horizon: '+50 yrs',
        text: 'By 2074, 60–100 cm sea-level rise has submerged part of the restored areas. Coastal population pressure in tropical countries has resumed encroachment on mangroves despite legal protections. Blue carbon delivers only a fraction of its initial potential: **–0.02°C**.',
      },
    },
  },

  // ─── dec-30 — Agricultural N₂O & enteric methane ─────────────────────────
  'dec-30': {
    title: 'Reducing agricultural N₂O and livestock enteric methane',
    description: `Agriculture is responsible for **~10% of global GHG emissions**, a large share from **enteric methane** (produced by ruminant digestion) and **nitrous oxide (N₂O)** from nitrogen fertilisers. These gases have a warming potential 28 to 265× higher than CO₂. IPCC AR6 estimates the reduction potential at **1.0 to 1.5 GtCO₂e/year** by 2050 through **feed additives** (Bovaer, red algae), new fertiliser formulations and precision agriculture practices.`,
    narratives: {
      optimistic: {
        label:   'Optimistic Scenario',
        horizon: '+10 yrs',
        text: 'By 2034, **60% of cattle livestock** in OECD countries receive methane-reducing feed additives. Nitrification-inhibitor fertilisers are mandatory for large farms in Europe and North America. Agricultural GHG emissions fall **18%** from 2024. Atmospheric methane begins to stabilise.',
      },
      moderate: {
        label:   'Moderate Scenario',
        horizon: '+20 yrs',
        text: 'By 2044, additives are widespread in developed countries but remain inaccessible to farmers in low-income countries. Global beef demand continues to grow in emerging economies. Net reduction reaches **–0.7 GtCO₂e/year** — significant, but partially offset by global herd growth.',
      },
      pessimistic: {
        label:   'Pessimistic Scenario',
        horizon: '+50 yrs',
        text: 'By 2074, resistance from agricultural sectors and fertiliser industry lobbying has slowed adoption in emerging economies. Global herd growth (+40%) has cancelled much of the efficiency gains. Net reduction remains positive (**–0.03°C**) but agriculture remains a net emissions sector.',
      },
    },
  },

  // ─── dec-31 — Landfill & wastewater methane ───────────────────────────────
  'dec-31': {
    title: 'Methane capture from landfills and wastewater treatment',
    description: `Solid waste and wastewater are responsible for **~3.2% of global GHG emissions**, mainly as methane from anaerobic decomposition in landfills and lagoons. These emissions are among the **cheapest to reduce**: captured biogas can turn landfills into renewable energy sources. IPCC AR6 estimates the potential at **0.3 to 0.8 GtCO₂e/year** by 2050. This decision mandates flaring or valorisation of methane from the world's 500 largest landfills and aerobic treatment of industrial wastewater in signatory countries.`,
    narratives: {
      optimistic: {
        label:   'Optimistic Scenario',
        horizon: '+10 yrs',
        text: 'By 2034, **350 of the 500 largest landfills** have biogas capture and valorisation systems, generating **25 TWh/year** of renewable electricity. Waste-origin atmospheric methane falls **12%**. New landfills (where still permitted) integrate capture by design. Industrial wastewater treated aerobically in 30 countries avoids **200 MtCO₂e/year**.',
      },
      moderate: {
        label:   'Moderate Scenario',
        horizon: '+20 yrs',
        text: 'By 2044, biogas capture is widespread in high- and middle-income countries, but least-developed countries struggle to finance the infrastructure. Growing waste volumes in emerging cities have created new unequipped landfills. Net reduction reaches **–0.35 GtCO₂e/year**.',
      },
      pessimistic: {
        label:   'Pessimistic Scenario',
        horizon: '+50 yrs',
        text: 'By 2074, rapid urbanisation in Africa and South Asia has multiplied informal dumpsites outside any capture system. Recycling has progressed but total waste volume has doubled. Net reduction remains positive (**–0.02°C**) thanks to improvements in developed countries, but the global potential has been underexploited.',
      },
    },
  },
}
