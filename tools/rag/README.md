# RAG local (dev only)

Ce dossier contient uniquement les outils de retrieval local pour le developpement.
Aucun fichier de ce dossier n'est charge par l'application frontend en production.

## Fichiers

- `build-ipcc-index.mjs` : construit un index BM25 local
- `examples/ipcc_chunks.example.jsonl` : exemple de format de chunks

## Usage

1. Place tes chunks reel dans `tools/rag/chunks/ipcc_chunks.jsonl` (fichier ignore par git).
2. Lance :

```bash
npm run rag:build-index
```

3. Les artefacts sont ecrits dans `tools/rag/index/` (ignore par git).

## Schema chunk minimal

```json
{
  "id": "AR6-WG3-03-001",
  "report": "AR6 WGIII",
  "section": "3.2",
  "pageStart": 123,
  "chunkText": "..."
}
```
