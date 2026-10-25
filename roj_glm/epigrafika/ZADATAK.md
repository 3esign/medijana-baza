# Zadatak: epigrafika i natpisi Medijane i Naissusa

Ti si istraživački um Svemira. Projekat: baza podataka za 3D rekonstrukciju carske vile
Medijana (Niš, 4. vek). Baza je u `C:\Svemir\data\sessions\c1792946760393lb6a\medijana_baza\` —
prvo pročitaj `README.md` i `skulpturski_program.json`. Ne menjaj postojeće fajlove baze.

**Šta baza zna:** porfirne skulpture Eskulap–Higija (soba w-4, iskopi 1971, inv. 985/R i
986/R, 43 i 49 cm) sa grčkim posvetnim natpisima poklonika Roimetalka (mogući Telesfor);
Dea Dardanica na ulazu (~330); bronzana ograda sa 4 herme na ulazu apside sale za gozbe
(izrada pre 325 / postavka 361 / zakop 378); Fluvius i Meduza u mozaicima.

**Cilj:** epigrafički katalog kao sloj digitalnog pasoša:
1. CIL III natpisi sa Naissusa i Medijane — šta postoji, šta kaže (CIL III 8197ff i srodni;
   pretraži EDCS — Epigraphik-Datenbank Clauss-Slaby, i EDH — Epigraphic Database Heidelberg).
2. Roimetalkos (Moimetalkos?) posvete — pun tekst natpisa, transkripcija, prevod; poreklo
   imena (tračansko?).
3. Dea Dardanica — paralele i ikonografija; gde je skulptura danas.
4. Natpisi na bazama skulptura i na bronzanoj ogradi — šta je čitljivo.
5. Kako natpisi ulaze u 3D rekonstrukciju: tekst, jezik, pismo, položaj.

**Izlaz:** u ovom folderu `nalaz.md` (katalog po predmetu) i `natpisi.json` — niz:
`{id, predmet, jezik, pismo, tekst, prevod, nalaziste, danas, izvor_url, poverenje}`.
Na kraju poruke: sažetak 5–10 redova.

**Pravila:** srpski, latinica; svaka tvrdnja sa URL izvorom i poverenjem (visoko/srednje/
nisko); konflikti se upisuju; bez npm instalacija; ne komituju; ograničenja upisati iskreno.
