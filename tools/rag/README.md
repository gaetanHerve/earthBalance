# RAG local (dev only)

Ce dossier contient uniquement les outils de retrieval local pour le développement.
Aucun fichier de ce dossier n'est chargé par l'application frontend en production.

## Index GIEC (IPCC AR6)

### Fichiers

- `build-ipcc-index.mjs` : chunke les chunks IPCC et construit l'index BM25
- `search.mjs` : recherche BM25 dans l'index GIEC (ou RGAA avec `--index` / `--chunks`)
- `examples/ipcc_chunks.example.jsonl` : exemple de format de chunks

### Usage

1. Place tes chunks réels dans `tools/rag/chunks/ipcc_chunks.jsonl` (fichier ignoré par git).
2. Lance :

```bash
npm run rag:build-index
```

3. Les artefacts sont écrits dans `tools/rag/index/` (ignoré par git).

### Schéma chunk minimal

```json
{
  "id": "AR6-WG3-03-001",
  "report": "AR6 WGIII",
  "section": "3.2",
  "pageStart": 123,
  "chunkText": "..."
}
```

---

## Index RGAA 4.1.2 (accessibilité)

### Fichiers

- `build-rgaa-index.mjs` : lit `data_sources/RGAA-v4.1.2.txt`, chunke par critère (106 chunks), construit l'index BM25

### Usage

Le fichier source est versionné — l'index se reconstruit depuis zéro après chaque clone :

```bash
npm run rag:build-index:rgaa
```

Les artefacts sont écrits dans `tools/rag/index/` :
- `rgaa_index.json` — index BM25
- `rgaa_chunks.jsonl` — 106 chunks (1 par critère RGAA)

### Recherche

```bash
npm run rag:search:rgaa -- "canvas image role img aria-label" --top 3
npm run rag:search:rgaa -- "contraste couleur texte ratio" --top 5
npm run rag:search:rgaa -- "formulaires étiquettes champs" --top 3
```

---

## Recherche GIEC

```bash
npm run rag:search -- "carbon tax emissions reduction" --top 5
npm run rag:search -- "temperature projections SSP2 2100" --top 8 --format json
```
