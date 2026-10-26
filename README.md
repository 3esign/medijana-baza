# Mediana research database

Evidence for reconstructing Roman Mediana near Niš: buildings, excavations, decoration, water systems and comparative sites. Research and data curation: Semir Poturak with AI assistance. This is a working research dataset, not a surveyed reconstruction or an institutional publication.

**Package 0.33 — consolidation, 26 October 2026.** Start with the [current synthesis in Serbian](SINTEZA.md), the [complete dataset map](INDEKS.md), and the [review findings](konsolidacija.json).

| Entry | Purpose |
|---|---|
| [SINTEZA.md](SINTEZA.md) | Current state, limits and priorities |
| [INDEKS.md](INDEKS.md) | All root JSON datasets grouped by topic |
| [KATALOG.json](KATALOG.json) | Inventory, counts and SHA-256 hashes |
| [IZVORI_REGISTAR.json](IZVORI_REGISTAR.json) | Recorded URLs with exact locations in the data |
| [konsolidacija.json](konsolidacija.json) | 11 review findings and reversible migration map |
| [KNOWLEDGE.md](KNOWLEDGE.md) | Methods and lessons |
| [LOG.md](LOG.md) | Change record and verification |

Core holdings include 21 building records, 21 rooms, 25 mosaic entries, 16 geophysical structures, 28 hydraulic nodes, 22 coin records, 9 inscriptions and 13 comparative sites. Counts describe records, not independently verified objects. Datasets retain historical content versions; package 0.33 does not imply renewed source verification.

## Verification

Requires Node.js; no new dependencies.

~~~sh
node validator.js
node alati/regresija.cjs
~~~

After editing data, rebuild the derived catalogue and URL register:

~~~sh
node alati/paket.cjs --build
node validator.js
~~~

The validator reports structural errors separately from unresolved research issues. A successful run is not proof of historical accuracy. Seven research limitations remain visible. Regression controls cover late validation blocks, coordinate consistency and hydraulic arithmetic.

## Evidence and history

Original data and source media remain available. Single-use migration scripts are in `istorija/skripte/`; do not run them against current data. Pre-review copies of edited documents are in `istorija/pre-konsolidacije-v032/`. Worker deliveries remain in `roj_glm/` as research drafts.

The v0.27–30 route calculations are historical: their coordinates and scope do not support a current route verdict. Modern OSM points are not identified ancient intakes. DEM/DSM elevations are not surveyed channel or water elevations. Assumed channel capacity is not measured spring discharge. The current review takes precedence over older narrative conclusions in historical fields.

PDFs, downloaded texts, rasters and worker logs are local research materials; availability is not permission to republish them. Image licensing and attribution are recorded in the visual layer. Some repository assets predate this consolidation; their publication rights were not audited here. No blanket license is asserted over third-party materials.

Data prose is Serbian Latin; source quotations and raw responses preserve their original language and script.
