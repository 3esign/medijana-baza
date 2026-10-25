# Medijana — GLM razgranavanje istraživanja (25.10.2026)

Sest pravaca nadovezuje se na otvorene niti baze v0.15 (18+ stubova, 31 sonda, 25 mozaika,
16 geofizickih struktura). Svaki pravac = zasebna GLM sesija (zai most), rezultati u svom
folderu. Integracija u validirane slojeve ostaje glavnom umu (v0.16+).

| # | Pravac | Model | Status | Izlaz |
|---|--------|-------|--------|-------|
| 1 | Objekti C–D, Jeremićev *Urbanism and Architecture*, Drča 2000, Petrović 1994 | glm-5.3 | pokrenut | `objekti_CD/nalaz.md` |
| 2 | Komparativni korpus — palatna arhitektura 4. veka, mere | glm-5.3 | pokrenut | `komparativni_korpus/nalaz.md` + JSON |
| 3 | Vodeni sistem kraj-do-kraja: izvor, akvadukt, hidraulika | glm-5.3-flash | pokrenut | `vodeni_sistem/nalaz.md` |
| 4 | Epigrafika: CIL III, Roimetalkove posvete, Dea Dardanica | glm-5.3-flash | čeka talas 2 | `epigrafika/nalaz.md` |
| 5 | Numizmatika: novac po sondama, Vicennalia/Tricennalia konflikt | glm-5.3-flash | čeka talas 2 | `numizmatika/nalaz.md` |
| 6 | GIS / daljinska detekcija / istorijske karte (Kanic 1864) | glm-5.3-flash | čeka talas 2 | `gis_udaljena/nalaz.md` |

Pravila za sve sesije: srpski latinica; terminologija **osnova / situacioni plan / presek**
(nikad „tlocrt"); svaka tvrdnja sa izvorom + URL + nivo poverenja (visoko/srednje/nisko);
konflikti se upisuju, ne glatu; ne dira se nijedan postojeći sloj baze; bez komitovanja i bez
novih npm zavisnosti; ograničenja (nedostupan izvor) upisati iskreno.
