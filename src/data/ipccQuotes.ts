export interface IpccQuote {
  id:         string
  text:       { fr: string; en: string }
  source:     string
  confidence: { fr: string; en: string }
}

export const ipccQuotes: IpccQuote[] = [
  {
    id: 'q01',
    text: {
      fr: "Les activités humaines, principalement par les émissions de gaz à effet de serre, ont causé sans équivoque le réchauffement climatique mondial, avec une température de surface atteignant 1,1 °C au-dessus de 1850–1900 sur la période 2011–2020.",
      en: "Human activities, principally through emissions of greenhouse gases, have unequivocally caused global warming, with global surface temperature reaching 1.1°C above 1850–1900 in 2011–2020.",
    },
    source:     'AR6 SYR — Section 2.1',
    confidence: { fr: 'haute confiance', en: 'high confidence' },
  },
  {
    id: 'q02',
    text: {
      fr: "La température de surface mondiale a augmenté plus rapidement depuis 1970 que pendant toute autre période de 50 ans au cours des 2 000 dernières années au moins.",
      en: "Global surface temperature has increased faster since 1970 than in any other 50-year period over at least the last 2000 years.",
    },
    source:     'AR6 SYR — Section 2.1.1',
    confidence: { fr: 'haute confiance', en: 'high confidence' },
  },
  {
    id: 'q03',
    text: {
      fr: "Les concentrations de CH₄ et de N₂O ont atteint des niveaux sans précédent depuis au moins 800 000 ans.",
      en: "Concentrations of CH₄ and N₂O have increased to levels unprecedented in at least 800,000 years.",
    },
    source:     'AR6 SYR — Section 2.1.1',
    confidence: { fr: 'très haute confiance', en: 'very high confidence' },
  },
  {
    id: 'q04',
    text: {
      fr: "Le réchauffement des océans représente 91 % de la chaleur accumulée dans le système climatique, le réchauffement des terres, la perte de glace et le réchauffement de l'atmosphère représentant environ 5 %, 3 % et 1 % respectivement.",
      en: "Ocean warming accounted for 91% of the heating in the climate system, with land warming, ice loss and atmospheric warming accounting for about 5%, 3% and 1%, respectively.",
    },
    source:     'AR6 SYR — Section 2.1.2',
    confidence: { fr: 'haute confiance', en: 'high confidence' },
  },
  {
    id: 'q05',
    text: {
      fr: "Les vagues de chaleur marines ont approximativement doublé en fréquence depuis les années 1980.",
      en: "Marine heatwaves have approximately doubled in frequency since the 1980s.",
    },
    source:     'AR6 SYR — Section 2.1.2',
    confidence: { fr: 'haute confiance', en: 'high confidence' },
  },
  {
    id: 'q06',
    text: {
      fr: "Entre 2010 et 2020, la mortalité humaine due aux inondations, aux sécheresses et aux tempêtes était 15 fois plus élevée dans les régions hautement vulnérables que dans les régions à très faible vulnérabilité.",
      en: "Between 2010 and 2020, human mortality from floods, droughts and storms was 15 times higher in highly vulnerable regions, compared to regions with very low vulnerability.",
    },
    source:     'AR6 SYR — Section 2.1.2',
    confidence: { fr: 'haute confiance', en: 'high confidence' },
  },
  {
    id: 'q07',
    text: {
      fr: "Les communautés vulnérables qui ont historiquement le moins contribué au changement climatique actuel sont touchées de manière disproportionnée.",
      en: "Vulnerable communities who have historically contributed the least to current climate change are disproportionately affected.",
    },
    source:     'AR6 SYR — Section 2.1',
    confidence: { fr: 'haute confiance', en: 'high confidence' },
  },
  {
    id: 'q08',
    text: {
      fr: "De 2010 à 2019, les coûts unitaires de l'énergie solaire ont diminué de 85 %, ceux de l'éolien de 55 % et ceux des batteries lithium-ion de 85 %, avec une multiplication par plus de 10 du déploiement solaire.",
      en: "From 2010 to 2019, there have been sustained decreases in the unit costs of solar energy (by 85%), wind energy (by 55%), and lithium-ion batteries (by 85%), and large increases in their deployment.",
    },
    source:     'AR6 SYR — Section 2.2.2',
    confidence: { fr: 'haute confiance', en: 'high confidence' },
  },
  {
    id: 'q09',
    text: {
      fr: "La hausse du niveau de la mer est inévitable pendant des siècles à des millénaires en raison du réchauffement continu des océans profonds et de la fonte des calottes glaciaires, et le niveau de la mer restera élevé pendant des milliers d'années.",
      en: "Sea level rise is unavoidable for centuries to millennia due to continuing deep ocean warming and ice sheet melt, and sea levels will remain elevated for thousands of years.",
    },
    source:     'AR6 SYR — Section 3.1.3',
    confidence: { fr: 'haute confiance', en: 'high confidence' },
  },
  {
    id: 'q10',
    text: {
      fr: "Les risques liés aux points de bascule — instabilité des calottes glaciaires, perte des forêts tropicales — passent à un niveau élevé entre 1,5 °C et 2,5 °C de réchauffement mondial.",
      en: "Risks associated with large-scale tipping points, such as ice sheet instability or ecosystem loss from tropical forests, transition to high risk between 1.5°C and 2.5°C of global warming.",
    },
    source:     'AR6 SYR — Section 3.1.3',
    confidence: { fr: 'confiance moyenne', en: 'medium confidence' },
  },
  {
    id: 'q11',
    text: {
      fr: "Il existe une fenêtre d'opportunité qui se rétrécit rapidement pour garantir un avenir viable et durable pour tous.",
      en: "There is a rapidly closing window of opportunity to secure a liveable and sustainable future for all.",
    },
    source:     'AR6 SYR — Section 3.4',
    confidence: { fr: 'très haute confiance', en: 'very high confidence' },
  },
  {
    id: 'q12',
    text: {
      fr: "Les flux financiers publics et privés en faveur des combustibles fossiles demeurent supérieurs à ceux consacrés à l'adaptation et à l'atténuation des changements climatiques.",
      en: "Public and private finance flows for fossil fuels are still greater than those for climate adaptation and mitigation.",
    },
    source:     'AR6 SYR — Section 2.3.3',
    confidence: { fr: 'haute confiance', en: 'high confidence' },
  },
]
