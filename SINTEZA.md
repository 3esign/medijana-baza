# Medijana — baza podataka v0.2 (2026-10-25)

Svemir / dr Poturak Semir. Cilj: ozbiljna baza za poređenje izvora i rekonstrukciju samo iz dostupnih podataka.

**Struktura:** `baza_podataka.json` — svaka tvrdnja nosi izvor + nivo poverenja (visoko/srednje/nisko) + konflikt ako izvori ne slažu.

## Novo u v0.2 — strojno čitljiv sloj
- **Wikidata Q960839** (`wd_q960839.json`): koordinate 43.31028/21.94889, tip archaeological site (Q839954), oznaka zaštite **AN 22** (P4245), Commons kategorija, sr label Medijana.
- **OSM way 296184228** (`osm_way_full.json`): poligon sa 6 čvorova, **~5,7 ha jezgro** (od 40 ha zone), `archaeological_site=roman_villa`, **datum upisa 1981-12-19**, ime zaštite „Bresje-Medijana. Brzi Brod", telefon +381 18 550 433, radno vreme.
- **Srpska Wikipedia** uvučena kao pun izvor (ranije samo agregat) — puno novih brojki.

## Šta baza drži
- **Osnova:** 43.3103/21.9489, ~40 ha, preko 80 otkrivenih objekata, lesna terasa 35 m, 3,5 rimske milje od Naisa.
- **Zaštita — sada tri nivoa, svi datirani:** 1949-02-09 (rešenje br. 220/49) → 1979-03-29 (br. 29) → 1981-12-19 (dobro od izuzetnog značaja, AN 22). Konflikt „1949 vs 1979" **rešen**.
- **Hronologija:** 18 tačaka, 269–8. vek (dodati: 269 Klaudije II, požar kraj 4. v + obnova posle 386, Huni 441, Sloveni 548–551, prestanak života 7/8. vek).
- **Objekti (8):** vila sa peristilom (98.6×63 m, 6.000–6.800 m², **945 m² ukupno mozaika** od toga 450 trem + 100 hodnik + 55 triklinijum), terme (7 prostorija), vila sa oktogonom (3.150 m² istraženo, Kanic), **vila sa konhama (32,5 m, 1975)**, horreum (91×27 m, iskop 1936, dolii ~2 m), castellum aquae (500 m JZ, 2 bazena-filtera, novac Aurelijana–Konstancija II), dve bazilike, nimfej; + Muzej (1936, nad triklinijumom) i „carski ulaz" (2006).
- **Mozaici — motivi:** geometrijski (oktogoni, rombovi, propeler) + figuralni: **Leda i labud, Fluvius, Medusa**.
- **Nalazi:** + bronzana glava Konstantina (**1900**, kod mosta), grupa mermera i porfira (**1972**, hipoteza hram Asklepija/Higijeje); novac iz 1970-ih — nijedan mlađi od **350.** godine.
- **Genetika:** Olalde 2021 — I-Z141 + H5b / H41a.
- **Moderno:** park ~10 godina zatvoren, otvoren **krajem decembra 2022**.

## Konflikti (upoređeno, 7)
1. Zaštita → **rešeno**: tri datirana nivoa (1949/1979/1981).
2. Površina vile: 6.000 (en) vs 6.800 (sr) m² → otvoreno, ~13% razlike.
3. Kvadratura mozaika → **rešeno**: 450 je trem, 945 ukupno.
4. Bazilike: posle 378 vs 361–425 → otvoreno.
5. Početak istraživanja 1803/04 → traži primarni izvor.
6. Vodovod: brdo Oblik vs termalni izvori Niške Banje → otvoreno (možda dva sistema).
7. Granica: 40 ha zona vs 5,7 ha OSM jezgro → zona vs fizički lokalitet.

## Rupe (ono što rekonstruišemo tek)
Nema javnog GIS-a objekata A–D, punih dimenzija vile sa oktogonom, ikonografije figuralnih mozaika, trase vodozvoda, 3D modela, spiska nalaza po muzejima. **nasledje.gov.rs bio van mreže 2026-10-25** — ponoviti za zvanične granice.

**Sledeći korak:** vizuelni sloj sa Commonsa (P18: Medijana mozaik.jpg) + iskopni planovi iz publikacija Arheološkog instituta.

Sources: [Wikipedia (sr) — Medijana (Niš)](https://sr.wikipedia.org/wiki/Medijana_(Niš)) · [Wikipedia (en) — Mediana](https://en.wikipedia.org/wiki/Mediana) · [Wikidata Q960839](https://www.wikidata.org/wiki/Q960839) · [OSM way 296184228](https://www.openstreetmap.org/way/296184228)

## v0.3 (25.10.2026, drugi telo) — prostorni sloj, komparativni korpus, digitalni pasoš

- `prostorni_sloj.json` — koordinate, poligon 5,7 ha, DEM procene visina (vila ~197 m, castellum ~206 m → potvrda gravitacionog vodovoda), 3D stubovi za 7 objekata sa poverenjem po osi (osnova visoko / visina nisko).
- `komparativni_lokaliteti.json` — Felix Romuliana (UNESCO 1253, 4,5/17,9 ha) i Villa del Casale (3.500 m² mozaika, peristil 40×30, hodnik lova 60 m) kao kalibracija za visine i ikonografiju.
- `digitalni_pasos.json` — vila znanja: materijali (mermer, olovo, bronza, mozaik), uticaji, graditelji/alati (inferencija, označena), 8 nivoa rekonstrukcije — nivoi 1–4 postignuti, 5–7 otvoreni.
- `validator.js` — 0 grešaka, 0 upozorenja. Agregat izvor i složena poverenja normalizovana.
- Rupe (iduće): vizuelni izvori sa Commons, GIS osnova A–D, Starinar PDF-ovi (prvo preuzimanje palo).


## v0.4 — vizuelni sloj (25.10.2026)
- Wikimedia Commons kategorija **Mediana**: 200 fajlova popisano (vizuelni_commons_popis.txt), 45 strukturno vrednih sa metapodacima u vizuelni_sloj.json.
- Veza slika na objekte: nimfej 7, vila sa konhama 2 (+ sala za gozbe), vila sa oktogonom 1, peristil/mozaici 1, zidine 2, opšte 32.
- nasledje.gov.rs: sajt vraća HTTP 200 ali svi putanje daju 404-stranicu — zapis AN 22 i dalje netaknut, ostaje otvorena stavka.
- Starinar: i dalje nedostupan sa ovog tela.

## v0.7 (2026-10-25) — vodeni linijski sloj + primarni tekst

Lom u lovu na izvore: Starinar 39 (1988, Jeremić, Castellum aquae) postoji na viminacium.org.rs ali je sken bez tekstualnog sloja (206 str.) — nema OCR alata na sistemu. Umesto njega, iz repozitorijuma Arheološkog instituta (rai.ai.ac.rs) uvučen Pop-Lazić 2018 (Roman Limes and Cities in Serbia, 392 str., tekstualni sloj, sr+en) — odlomak o Medijani daje čvrste nove dokaze.

Novo (sve visoko poverenje, citativno):
- castellum aquae: DVA bazena (taloženje + distribucija), kraj III v., padina Vlaškog brda; sa severne strane kule voda ide GLAVNIM + REVIZIONIM kanalom → novo datoteka vodeni_linijski_sloj.json sa čvorovima, pravilima gravitacione konzistentnosti i validator proverom.
- Konflikt površine (6.000 vs 6.800 m²) REŠEN: to su dve građevine — vila sa peristilom vs vila sa oktogonom (istraženo ~2000 m²). Novi stub villa-oktagon.
- Novi stubovi: 2 ranohrišćanske crkve (50 m ist. od vile, spolije+drvo, Hristogram u južnoj), zapadne barake (4 ha, mermer+freske), istočne barake. Ukupno 13 3D stubova.
- Bronzana ograda sa 4 herme (~324) na ulazu apside sale za gozbe; porfirne skulpture 1972 imenovane (Asclepius, Hygieia, Afrodita Sosandra, Herkul, Merkur, Dionis+triada); Dea Dardanica na ulazu.
- Otvoreno: 'trideset godina vladavine' — Vicennalia (325/6) vs Tricennalia (335/6); izvor vode (Oblik vs Niška Banja) i dalje nikad potvrđen primarno.

Validator v0.7: 0 grešaka / 0 upozorenja (sada uključuje vodeni sloj i gravitacionu proveru castellum→vila).

## v0.8 — osnova objekata A–B (parter) (prvi pravi arhitektonski merenja)
Izvor: Gavrilović-Vitas, Milošević Jevtić, Crnoglavac 2016, *Stibadium B of villa with peristyle at Mediana*, Starinar LXVI, 81–102 (DOI 10.2298/STA1666081G, open access, lokalno `pdf/stibadium_B_gavrilovic_2016.pdf`).
- **Novi stub `stibadium-B`** (ukupno 14): kružna sala Ø ~7 m, aneksi 2,10×2,9 i 2,15×3,2 m, hodnik 1,65×2,60 m, praefurnium 1,05×0,5 m, grejni kanal zid 0,20 m / sačuvan 0,45 m.
- **Prvi apsolutni visinski nivoi u bazi:** dno temelja 198,92 m n.m.v., poklopac grejnog kanala 198,73 m, dno kanala 198,32 m — potvrđuju DEM procenu vile (197 m, opseg 195–199). Sada stub sa najjačim poverenjem za visine u celoj bazi.
- **Dekor sa dokazom:** polukalota pozlaćenim staklenim mozaikom, mermerne oplata (bela/zuto-oker), fresko bela-plava-crvena, opus sectile listoliki mermer, prozorsko staklo, staklene tesere sa zlatnom folijom. Hronologija: druga faza vile **AD 330–378**.
- **Stibadium A uništio Muzej 1936** — veza ka severnom delu vile trajno negirana; to je fizička granica rekonstrukcije, ne rupa u istraživanju.
- Kalibracija ponašanja: polukalota + kružni pod + grejanje → organizacija gozbe po tetrarhijskom modelu (klinai u aneksima = hipoteza, označeno).
