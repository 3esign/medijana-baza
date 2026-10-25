# Zadatak: komparativni korpus — palatna arhitektura 4. veka

Ti si istraživački um Svemira. Projekat: baza podataka za 3D rekonstrukciju carske vile
Medijana (Niš, 4. vek). Baza je u `C:\Svemir\data\sessions\c1792946760393lb6a\medijana_baza\` —
prvo pročitaj `README.md` i `komparativni_lokaliteti.json` (postoji, ali tanak). Ne menjaj
postojeće fajlove baze.

**Cilj:** izgraditi debeo komparativni korpus (mere i tipologija) za kalibraciju 3D
rekonstrukcije Medijane — samo objekti iz 3.–4. veka, po mogućstvu ilirsko-dunavski prostor
ili carske rezidencije tetrarhijsko-konstantinovskog doba:

1. **Felix Romuliana (Gamzigrad)** — mere palate, aule, portala, kula; izvori: UNESCO,
   Starinar, monografije.
2. **Šarkamen** (carska rezidencija kod Negotina) — mere, plan.
3. **Sirmium** — carska palata.
4. **Solun (Thessaloniki)** — Galerijev kompleks: palata, oktogonalna crkva, rotunda, luk.
5. **Villa Romana del Casale (Piazza Armerina)** — mere ključnih sala (aula trilobata,
   peristil, basilica) — za razmeru dekoracije.
6. **Trier** — Konstantinova bazilika (aula palatina): dimenzije sale; palata.
7. **Antiohija / Nikomedija / Sirmium** — aula typology i presedan za sala za prijem.
8. Bilo koja villa rustica / palata u Moeziji, Dardaniji, Trakiji sa merama (Justiniana
   Prima, Viminacium, Diana, Ravna...).

**Izlaz:** u ovom folderu `nalaz.md` (pregled po lokalitetu) i `korpus.json` — niz lokaliteta:
`{id, ime, region, period, tip, mere: [{element, sirina_m, duzina_m, visina_m, izvor_url,
poverenje}], relevantnost_za_medijanu}`. Visine posebno obeleži: uglavnom su rekonstrukeije
pa nose nisko poverenje. Na kraju poruke: sažetak 5–10 redova.

**Pravila:** srpski, latinica; terminologija: **osnova**, **situacioni plan**, **presek** —
nikad „tlocrt"; svaka mera sa URL izvorom i poverenjem; konflikti između izvora se upisuju;
bez npm instalacija; ne komituju; ograničenja upisati iskreno.
