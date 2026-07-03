---

# Synthèse GIEC AR6 — earthBalance — 2026-07-01

## Vue d'ensemble

L'application earthBalance présente une cohérence AR6 **globalement satisfaisante sur les valeurs terminales** (température 2100, seuils de points de bascule, tendances qualitatives des indicateurs sociétaux et écologiques), mais souffre d'**une incohérence critique systémique** affectant l'ensemble de la simulation : la trajectoire d'émissions CO₂ de référence est fondamentalement incompatible avec le scénario SSP2-4.5 qu'elle prétend représenter. Deux autres problèmes critiques ont été identifiés — la classification erronée de la glace arctique comme point de bascule irréversible, et l'absence de référentiel temporel explicite sur l'indicateur de montée du niveau des mers. Par ailleurs, une dizaine d'avertissements récurrents appellent des corrections ciblées avant tout déploiement public.

---

## Points validés (consolidés)

- **Scénario SSP2-4.5 comme baseline** : choix méthodologiquement fondé, conforme au cadre narratif AR6 WGI (Cross-Chapter Box 1.4).
- **Température 2100 : +2.70°C** — valeur centrale validée par CEDA SPM.8 (mean 2.748°C à 2099) et Table SPM.1 AR6 (best estimate 2.7°C pour 2081-2100). [AR6 WGI, Table SPM.1, chunk `AR6_WG1_00049`]
- **Structure des jalons near/mid/long-term** (+1.5°C / +2.0°C / +2.7°C) correctement mappée sur la Table 1 de Cross-Section Box TS.1. [AR6 WGI, p.80, chunk `AR6_WG1_00174`]
- **Série niveau marin observée (1990–2020)** : écart inférieur à 5 mm par rapport aux données CEDA SPM.8 — excellente calibration. [CEDA Archive, CC-BY-4.0]
- **CO₂ atmosphérique 2024 : 421 ppm** — cohérent avec les observations (Mauna Loa) et la trajectoire AR6. [AR6 WGI, Ch.2, chunk `AR6_WG1_00904`]
- **Trajectoire croisement seuil 1.5°C au début des années 2030** — conforme à AR6 WGI. [AR6 WGI, Ch.4, p.599, chunk `AR6_WG1_01895`]
- **Niveau marin 2100 = 415 mm** (référence 1995-2014) — dans la fourchette probable AR6 pour SSP2-4.5 (330-610 mm). [AR6 WGI, Ch.9, chunk `AR6_WG1_04465`]
- **Points de bascule — seuils principaux** : permafrost (>1.5°C), récifs coralliens (>1.5°C, absence de `deltaTemp` correcte), AMOC (>3.0°C conservatif) — cohérents avec AR6. [AR6 WGI, p.1877-1878, chunk `AR6_WG1_06465`]
- **Acidification des océans** : tendance et valeurs pré-industrielles cohérentes avec AR6. [AR6 WGI, p.1807, chunk `AR6_WG1_06218`]
- **Ozone stratosphérique** : profil déclin → récupération partielle conforme au récit AR6. [AR6 WGI, p.322-323, chunk `AR6_WG1_00913`]
- **Accès eau potable 71% (2024)** : validé par AR6 WGII citant 2.2 milliards sans accès en 2017. [AR6 WGII, p.570, chunk `AR6_WG2_01967`]
- **Migrations climatiques** : direction de la dégradation cohérente avec 20M+ déplacés/an depuis 2008. [AR6 WGII, TS.B.6, p.64]
- **Émissions CO₂-FFI 2020 = 34.8 GtCO₂/an** : cohérent avec la chute COVID documentée dans AR6. [AR6 WGIII, p.243-244, chunk `AR6_WG3_02023`]
- **Architecture de cascade des points de bascule** : logique conforme à la notion d'interactions entre éléments de bascule d'AR6. [AR6 WGI, Box TS.9, chunk `AR6_WG1_00286`]
- **Concept pédagogique de la taxe carbone** : fondé dans AR6 WGIII. [AR6 WGIII, Ch.13, chunk `AR6_WG3_04756`]

---

## Points nécessitant attention (consolidés, priorisés)

1. **Température 2030 au 95e percentile au lieu de la médiane** *(simulateur, bilan, overview, SimProjectionCharts, HubNodeChart)* : valeur codée 1.70°C vs médiane CEDA 1.483°C. La valeur reste dans la fourchette "likely" AR6 mais représente systématiquement le tail chaud. Préconisation : aligner sur la médiane (~1.50°C) ou documenter explicitement "borne haute AR6 (95e percentile)". [CEDA SPM.8]

2. **Concentration CO₂ 2100 sous-estimée** *(simulateur, bilan, SimProjectionCharts, HubNodeChart)* : valeur codée 549 ppm vs ~600-603 ppm attendu pour SSP2-4.5 (Meinshausen et al. 2020/CMIP6) — écart de ~9%. Préconisation : corriger vers ~600 ppm à 2100. ⚠️ *[Connaissance générale — valeur exacte Meinshausen non couverte par les chunks indexés]*

3. **Attribution de source incorrecte pour les émissions CO₂** *(simulateur, HubNodeChart)* : les commentaires citent "Figure 4.19 SSP2-4.5 projection" pour les émissions annuelles GtCO₂/an, or la Figure 4.19 de WGI Ch.4 représente des projections de température, non d'émissions. Source correcte : Figure SPM.4. Préconisation : corriger les références bibliographiques.

4. **AMOC `deltaTemp` positif (+0.2°C) physiquement incorrect** *(basculement)* : l'affaiblissement de l'AMOC produit un refroidissement régional en Atlantique Nord, non un réchauffement global. Préconisation : mettre `deltaTemp` à 0 ou négatif. [AR6 WGI, p.303, chunk `AR6_WG1_00857`]

5. **Seuils des limites planétaires non issus directement d'AR6** *(limites, RadarChart)* : tous les seuils quantitatifs (350 ppm CO₂, 10 E/MSY, 62 Tg N/an, etc.) proviennent de Rockström et al. (2009) / Steffen et al. (2015), cités mais non endossés comme seuils primaires par AR6. L'interface devrait le mentionner explicitement pour éviter confusion. [AR6 WGIII, p.511, chunk `AR6_WG3_01577`]

6. **Utilisation d'eau douce potentiellement sous-estimée** *(limites, RadarChart)* : 2 600 km³/an correspond aux estimations d'usage consommatif ~2009, tandis que les prélèvements totaux actuels atteignent ~3 900-4 600 km³/an selon FAO AQUASTAT. Préconisation : clarifier la définition exacte de l'indicateur. ⚠️ *[Connaissance générale — non sourcée AR6]*

7. **Nombreuses sources "TODO" non complétées** *(limites, EcologicalIndicators, SocietalIndicators)* : indicateurs `foodSecurity`, `waterAccess`, `globalHealth`, `inequality`, et les 9 limites planétaires manquent de sources. Préconisation : documenter avant déploiement public.

8. **Couverture forestière 58% : confusion seuil planétaire vs état observé** *(SimProjectionCharts, HubNodeChart)* : Steffen et al. (2015) définit 58% comme le seuil à ne pas franchir, non l'état actuel. L'interface devrait clarifier cette distinction.

9. **Label "Émissions CO₂ mondiales" sans précision "fossile & industrie"** *(dashboard, EcologicalIndicators)* : la série couvre uniquement CO₂-FFI (~38 GtCO₂ en 2019), sous-estimant le total GES de ~35%. Préconisation : ajouter "(fossile & industrie)" dans le label. [AR6 WGIII, p.72, chunk `AR6_WG3_00161`]

10. **Plage de taxe carbone (135-5500 $/tCO₂) sans nuance temporelle** *(simulateur)* : la fourchette couvre 2030-2050 combinés selon les modèles IAM. Sans précision temporelle, elle est susceptible d'être mal interprétée. [AR6 WGIII, Ch.3, p.374, chunk `AR6_WG3_01067`]

11. **Seuil AMOC (3°C) non fixé précisément dans le SPM AR6** *(SimProjectionCharts)* : AR6 ne donne pas de seuil numérique unique, la littérature post-AR6 mentionne 1.4-8°C (Armstrong McKay et al. 2022). Préconisation : reformuler le label en "risque croissant > 2°C". ⚠️ *[Connaissance générale post-AR6]*

12. **Sources des indicateurs azote/phosphore non-AR6** *(limites)* : ces indicateurs sont exclusivement issus de Steffen 2015. Préconisation : citer explicitement Steffen (2015, Science) plutôt qu'AR6.

---

## Incohérences critiques (consolidées)

### 🔴 CRITIQUE 1 — Trajectoire des émissions CO₂ incompatible avec SSP2-4.5

**Scopes affectés** : simulateur, overview, SimProjectionCharts, HubNodeChart (4 scopes sur 11)

La baseline d'émissions CO₂ annuelles (`BASELINE_CO2_9PT` / `BASELINE_CO2_10PT`) affiche une croissance **monotone** de 37.4 GtCO₂/an (2024) jusqu'à 59-59.5 GtCO₂/an en 2100. Les données CEDA publiées avec la Figure SPM.4 d'AR6 WGI montrent pour SSP2-4.5 un **plateau puis un déclin fort** :

| Année | Valeur codée (GtCO₂/an) | AR6 SSP2-4.5 CEDA | Écart |
|---|---|---|---|
| 2030 | 41.8 | 43.5 | −4% (acceptable) |
| 2040 | 49.0 | 44.3 | **+11%** |
| 2050 | 54.5 | 43.5 | **+25%** |
| 2060 | 57.0 | 40.2 | **+42%** |
| 2074 | 59.0 | ~31 | **+90%** |
| 2100 | 59.5 | 9.7 | **+514%** |

La trajectoire codée est cohérente avec SSP3-7.0 (qui atteint ~63 GtCO₂ en 2050), non SSP2-4.5. Elle crée également une **incohérence physique interne** : des émissions de 59 GtCO₂/an en 2100 devraient produire une concentration atmosphérique de 700-900 ppm, non 549 ppm. De plus, un commentaire du code indique "(stabilisation post-2050)" alors que la trajectoire continue de croître jusqu'en 2100.

**Correction suggérée** : remplacer les tableaux par une interpolation des données CEDA SPM.4 SSP2-4.5 : approximativement [37.4, 38.5, 40.0, 43.5, 44.1, 44.3, 43.5, 40.2, 31.0, 9.7] GtCO₂/an pour [2024, 2026, 2028, 2030, 2034, 2040, 2050, 2060, 2074, 2100]. Si le choix éditorial est de montrer un scénario sans action, utiliser SSP3-7.0 et l'étiqueter explicitement.

[IPCC AR6 WGI, Figure SPM.4 — CEDA Archive, CC-BY-4.0]

---

### 🔴 CRITIQUE 2 — `tp-arctic` classifié comme point de bascule irréversible, contredit par AR6 avec haute confiance

**Scope affecté** : basculement

`tp-arctic` est codé comme un point de bascule irréversible (seuil >1.5°C, `deltaTemp: +0.3°C` injecté jusqu'en 2100). AR6 WGI Table 4.10 établit explicitement — avec **high confidence** — "Arctic Sea Ice: **no tipping point or threshold beyond which loss of ice becomes irreversible**." Le chunk `AR6_WG1_02058` confirme : "the lack of a tipping point in the reduction of summer Arctic sea ice area has been further substantiated."

**Correction suggérée** : (a) renommer `tp-arctic` en `feedback-arctic-albedo` pour signaler qu'il s'agit d'une rétroaction graduelle, non d'un basculement irréversible ; (b) réduire `deltaTemp` à +0.1°C maximum ; (c) si un événement discret de gameplay est nécessaire, l'étiqueter explicitement "rétroaction amplificatrice — non point de bascule irréversible".

[AR6 WGI, p.1878, chunk `AR6_WG1_06467` ; AR6 WGI, p.651, chunk `AR6_WG1_02058`]

---

### 🔴 CRITIQUE 3 — Incohérence de référentiel pour le niveau des mers entre ticker et graphiques

**Scopes affectés** : dashboard, EcologicalIndicators, SocietalIndicators (3 scopes sur 11)

Le ticker affiche "+22 cm" pour la montée du niveau des mers en 2024 (montée cumulée depuis ~1900, valeur correcte selon AR6 WGI : 0.20 m sur 1901-2018). Le graphique `seaLevel` affiche +78 mm (7.8 cm) pour 2024 avec la convention AR6 de référence 1995-2014. Ces deux affichages représentent la même grandeur physique avec des référentiels différents et **non étiquetés**, créant un écart apparent d'un facteur ×3 pour le même indicateur sur le même dashboard.

**Correction suggérée** : ajouter "(depuis 1900)" dans le ticker et "(depuis 1995-2014)" dans le graphique, ou unifier les deux sur le référentiel 1995-2014 (+7.8 cm pour 2024).

[AR6 WGI, TS, p.94, chunk `AR6_WG1_00212` ; CEDA SPM.8 panel D]

---

## Matrice par scope

| Scope | ✅ Validé | ⚠️ Attention | 🔴 Critique |
|---|---|---|---|
| Page Simulateur | 5 | 7 | 1 |
| Page Limites planétaires | 5 | 6 | 0 |
| Page Dashboard | 6 | 9 | 1 |
| Page Basculement | 5 | 6 | 1 |
| Page Bilan 2100 | 8 | 9 | 0 |
| Page Overview | 4 | 4 | 2 |
| Chart SimProjectionCharts | 4 | 4 | 2 |
| Chart RadarChart | 5 | 6 | 2 |
| Chart HubNodeChart | 7 | 7 | 1 |
| Chart EcologicalIndicators | 7 | 8 | 1 |
| Chart SocietalIndicators | 7 | 7 | 1 |
| **Total** | **63** | **73** | **12*** |

*\* Après dédoublonnage, 3 incohérences critiques distinctes (chacune affectant plusieurs scopes)*

---

## Sources GIEC AR6 citées (union dédupliquée)

**AR6 WGI**
- Table SPM.1, p.31 — `AR6_WG1_00049` : Best estimates température par scénario SSP
- Cross-Section Box TS.1, Table 1, p.80 — `AR6_WG1_00174` : Jalons near/mid/long-term
- Box TS.9, p.123 — `AR6_WG1_00286/00287` : Irréversibilité et tipping points
- Cross-Chapter Box 1.4, p.245-251 — `AR6_WG1_00628/00640/00643` : 5 scénarios SSP illustratifs
- Ch.2, p.317-323 — `AR6_WG1_00898/00904/00913/00914` : CO₂ atmosphérique historique ; ozone
- Ch.3, p.442-454 — `AR6_WG1_01360/01398` : GSAT observé 2010-2020
- Ch.4, p.599 — `AR6_WG1_01895/01896` : Croisement seuil 1.5°C et 2°C
- Ch.5, p.506 — `AR6_WG1_01558` : Acidification des océans, taux de déclin pH
- Ch.9, p.1305/1319 — `AR6_WG1_04421/04465` : Projections niveau marin
- Ch.9, p.94 — `AR6_WG1_00212` : Montée cumulée niveau marin 1901-2018
- Ch.4, p.1877-1878 — `AR6_WG1_06465/06466/06467` : Table tipping points ; **glace arctique pas de tipping point (high confidence)**
- Ch.4, p.651 — `AR6_WG1_02058` : Absence de tipping point glace arctique confirmée
- Ch.4, p.745/790 — `AR6_WG1_02392/02527` : Rétroaction pergélisol CO₂
- Ch.9, p.303-304 — `AR6_WG1_00857/00858` : AMOC affaiblissement et effets régionaux
- Ch.9, p.1807 — `AR6_WG1_06218` : Saturation aragonite et acidification future
- Ch.11, p.1535 — `AR6_WG1_05312` : Facteurs multiplicateurs des extrêmes
- Figure SPM.4 — CEDA Archive, CC-BY-4.0 : **Trajectoire SSP2-4.5 émissions CO₂ (données numériques)**
- Figure SPM.8 — CEDA Archive, CC-BY-4.0 : **Trajectoire SSP2-4.5 température et niveau marin (données numériques)**

**AR6 WGII**
- Technical Summary TS.B.6, p.64 — `AR6_WG2_00153` : Déplacements climatiques 20M+/an
- Ch.2, p.269-292 — `AR6_WG2_00807/00809/00883/00884` : Biodiversité, extinctions
- Ch.4, p.570 — `AR6_WG2_01967` : 2.2 milliards sans eau potable
- Ch.5, p.804 — `AR6_WG2_02787` : Sécurité alimentaire et climat
- Ch.7, p.1072/1083/1100/1114/1186 — `AR6_WG2_03891/04329` : Santé, conflits, inégalités
- CCP7, p.2388-2389 — `AR6_WG2_08756` : Déforestation forêts tropicales
- Ch.16, p.2477-2478 — `AR6_WG2_09069` : Projections migrations climatiques 51-143M

**AR6 WGIII**
- Ch.2, p.72/241 — `AR6_WG3_00161/00162/00662` : GHG totaux 2019 ; CO₂-FFI 38 GtCO₂
- Ch.3, p.326/374 — `AR6_WG3_00938/01067` : Population SSP2 ; prix carbone implicites
- Ch.7, p.822 — `AR6_WG3_02690` : Potentiels mitigation AFOLU par niveau prix carbone
- Ch.13, p.1397-1398 — `AR6_WG3_04752/04753/04755/04756` : Tarification carbone, ETS
- p.511 — `AR6_WG3_01577` : Citation du cadre Limites Planétaires dans AR6

**AR6 SYR**
- p.8-9 — `AR6_SYR_00006` : CO₂ 410 ppm (2019), 415 ppm (2021)
- p.30-31 — `AR6_SYR_00067` : Approche multi-secteurs, Reasons for Concern
- p.43 — `AR6_SYR_00092` : Risques de basculement irréversible croissants
- p.47 — `AR6_SYR_00101` : Niveau marin 2100 par scénario SSP

---

**Priorité de correction recommandée** :

1. 🔴 Recalibrer `BASELINE_CO2_9PT` / `BASELINE_CO2_10PT` sur les données CEDA SSP2-4.5 *(impact systémique sur toute la simulation)*
2. 🔴 Corriger la classification de `tp-arctic` *(erreur factuelle directement contredite par AR6 avec high confidence)*
3. 🔴 Aligner les référentiels temporels du niveau des mers *(source de confusion majeure sur 3 vues)*
4. ⚠️ Corriger la référence bibliographique Figure 4.19 → Figure SPM.4
5. ⚠️ Corriger `deltaTemp` AMOC en valeur nulle ou négative
6. ⚠️ Aligner la température 2030 sur la médiane CEDA (~1.50°C)
7. ⚠️ Compléter les sources "TODO" avant déploiement public
