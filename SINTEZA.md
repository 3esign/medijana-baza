# Medijana — baza podataka v0.13 (2026-10-25)

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

## v0.9 — monografija "Constantine's Villa at Mediana" (2026-10-25)

Proboj: cela monografija (108 str., Vasić/Milošević/Gavrilović Vitas/Crnoglavac, Narodni muzej Niš) iz repozitorijuma Arheološkog instituta ([RAI handle 1539](https://rai.ai.ac.rs/handle/123456789/1539)) + iskopni izveštaj 2010/2011 + rad *Carska ideologija*. Autor potrage popravljen: "Urbanism and Architecture" je Gordana/Goran Milošević, ne Jeremić — i taj rad i dalje nema otvoren pun tekst, ali monografija ga po sadržaju nadmašuje.

**Novo u bazi (18 stubova, 15 izvora):**
- **Situacioni plan sa 9 elemenata** — prvi put ceo kompleks u jednom planu: rezidencijalni kompleks, vila sa oktogonom, horreum, barake, crkve, vila sa konhama, vila sa ogradnim zidom, ogradni zid (geofizika), vodotoranj.
- **Rezidencijalni kompleks raščlanjen:** kapija kao trijumfalna kapija + svečana aleja (~80 m podvlake) + sobe uz kapiju na 30 m razmaka; vestibul 2 m od tremca; južni trem 12 m sa dva masivna pilona; sala za prijem sa podijumom od 3 stepenika; 14 soba oko sale; druga faza: drveni stubovi → mramorni, impluvium, mreža vodovodnih i odvodnih kanala.
- **Vila sa oktogonom datirana: 330–334** (prva faza) — oktagon+krug sa kontraforama, dvorište ~40 m istočno sa kolonadom, mramornim pločama i fontanom; mozaik paneli sa merama (1,70×1,50 i 2,50×5,50 m).
- **Horreum 91×27 potvrđen sa unutrašnjošću:** 2 reda × 11 opekarskih stubova, tri bazena uz zapadni zid, dolia, vino u zapadnom delu; ~150 m od vile. **Konflikt broja horreuma rešen — postoje DVA** (zapadni + istočni sa ~7 ha kompleksom baraka i javnim termama).
- **Barake:** zapadne 4 ha, istočne ~7 ha, prolazi 12 m sa pilonima; freske i mermer i u barakama (potvrda iz monografije).
- **Terme (privatne):** centralna organizacija, frigidarium/tepidarium/caldarium/laconicum; zapadni deo neistražen — ukupna površina nepoznata.
- **Vila sa konhama:** sezonska (bez grejanja), mozaik 15 m², nađen 1975, restavriran 2015, skroman karakter.

**Novi stubovi:** `kapija-aleja`, `javne-terme-istocne`, `vila-ogradni-zid`, `ogradni-zid-geofizika`.

**Otvoreno i dalje:** Jeremićev *Castellum aquae* (sken bez teksta, čeka OCR); rad *Urbanism and Architecture* bez otvorenog punog teksta (Academia iza prijave, RAI ga nema); vodeni izvor (Oblik vs Niška Banja) monografija ne rešava.

## v0.10 — skulpturni program + sonde⇄stubovi (2026-10-25)

Dva nova sloja, oba iz primarnih radova već skinutih sa Arheološkog instituta:

- **`skulpturski_program.json`** (iz Milošević, *Carska ideologija*) — program po lokaciji: forum Naisusa (porfirna kompozicija dijarhije Konstantin–Licinije 311–316; pozlaćena bronzana statua Konstantina, posveta 329 ili 334), **Dea Dardanica na ulazu vile** (~330, dea patriae, veza sa Konstancijem Hlorom), iatrijski par **Eskulap–Higija** kao najbrojnija grupa (porfirne statue sa grčkim natpisima = **uvoz**), Dionis–Herkul–Merkur u istom skupnom nalazu, Artemida/Dijana, bahanantkinje, Afrodita Sosandra, Venera/Dijana. **Pravilo za rekonstrukciju:** skulpture uglavnom dekapitirane — broj glava NI merilo broja statua. Mozaik program sa pozicijama: **Fluvius na ulazu u aulu, Meduza u središnjem delu**, freske 4 SZ prostorije imitiraju parapetne mermerne ploče (nezavisna potvrda mermerne oplate), pozlata kupole zapadnog stibadijuma.
- **`sonde_sloj.json`** (iz Vasić/Milošević/Gavrilović, Starinar 64/2014) — 5 iskopnih sektora; veza sondi na stubove (sonda 42 → hipokaust aule, 45 → prostorija 24a, 46 → ulaz u stibadium B, 88/90 → zgrade oko stibadijuma B); slojevi A–D sa kotama; **tri horizonta**: 1) prve decenije 4. veka — osnovni plan vile (suprotno ranijim mišljenjima), 2) 330–378 — prepravke (stibadijumi A i B), 3) 380–441/443. Novac iz sondi datira NIVOE, ne gradnju.

**19. 3D stub:** `zgrade-oko-stibadiuma-B` — temelji od oblutaka, kruna zida 199.13 m, sokl 198.65 m (sonde 88 i 90) — drugi objekat uz stibadium B sa stvarnim kotama.

**Konflikti rešeni (3):**
- *Početak istraživanja* → **1864, Feliks Kanic** (150 godina 2014) — 1803/04 bez primarnog izvora, greška agregata.
- *Datum bronzane ograde* → tri datuma jedan predmet: izrada pre 325, postavka **361** (boravak Julijana), zakop **378**.
- *Hronologija vile* → horizont 1 (osnova pre 330, na mestu starija izdužena građevina — pretorium?) + prepravka oko 330 + horizont 2.

**Digitalni pasoš:** + porfir (uvoz dokazan natpisima), + uticaji: carski adventus i ceremonijal Dioklecijana (kapija-slavoluk → salutatorium → peristil → consitorium, proskineza), solarni kult uz dvorsko hrišćanstvo, dardanska dinastijska ideologija.

Validator: **0 grešaka / 0 upozorenja.** Otvoreno: sonde sektora 2–5 u tekstu još nisu izvučene; Sl. 1–5 (plan sa sondama + profili) čekaju uvlačenje iz PDF-a.

## v0.11 — sonde sektora 2-5, izmerena vertikala vile (Starinar 64/2014, tekst)

- **Sektor 2 (severoistocno):** sonde 71, 97, 98, 103, 104. Temelj severnog zida ukopan do **197,94** — prva dubina temelja u bazi; sokl 198,02; prefurnijum za prostorije 22/23 (nije bio zabelezen 1978-79): podloga 198,54 ka 198,36; zid 7d od oblutaka, kruna ~198,8; jama u sondi 103 do 197,38 sa srednjovekovnom keramikom.
- **Sektor 3 (severozapadne prostorije):** sonde 45, 46; prostorije w-1, w-22, w-24, w-24a. Podovi 198,70-198,81. Glava Venere na 199,12; vrh koplja na 199,14; fresko in situ na 199,33. **Proslojak zapecene zemlje 0,05 m preko poda w-1 = dokaz medjuspratne konstrukcije** (novi konflikt "spratnost" — delimicno resen).
- **Sektor 4 (severoistocne prostorije, revizija):** e-22, e-23, e-24. Dvostruke podnice e-23 (198,95 preko 198,82) — hipokaust negiran pa novi pod; potvrdjeni tubulusima (zidno grejanje).
- **Sektor 5 (jugozapad + ulaz):** jedini sektor bez podova — nabijena zemlja; novac iz zatvorene celine 364-375 → rusenje **378**. **Olovna cev** kota 198,49 (sonda 107) koja **prolazi kroz osnovu zida 59** (198,40) — voda uvadjena u zid. Kada 1,6x1,5 m i bunar do 196,05 (najniza kota baze, kasni srednji vek). Stubovi tremca od opeke na kamenim bazama; otisak stuba u zidu z-50 (sonda 101).
- **Novac pre vile:** 271-275 (sonda 75) i 294-307 (sonda 104) — aktivnost na Medijani pre prve decenije 4. veka.
- **Kota-DEM veza:** sve izmerene kote (197,94-200,6) potvrdjuju DEM opseg 195-199 za vilu; castellum ~206 i dalje iznad — gravitacija vazi.
- **Registar slika Sl. 1-31** popisan iz potpisa; Sl. 1 (situacioni plan sa sondama) i dalje bez geometrije.
- Prerimski nalaz: **kasnolatenska fibula** (sl. 31) — zivot na Medijani pre Rima.

## v0.12 — crtezi iz Starinara 64/2014 iscrtani i ocitani (Sl. 1-4, 7, 8, 11)

Vektorski crtezi nemaju tekstualni sloj, pa su strane renderovane u PNG (200 dpi, `crtezi/`) i citane vizuelno; kote prepisane sa izdavackih crteza (autor crteza: I. Bjelic, N. Stankovic, J. Pesic). Novi fajl **`crtezi_sloj.json`**.

**Sl. 1 — prvi puni situacioni plan vile u bazi:**
- Numeracija prostorija: **W-1..W-25** (zapadni trakt) i **E-1..E-24** (+ E-16a, E-24a) (istocni trakt) — do sada prostorije nisu imale pojedinacne ID-jeve; sada vezuju sve nalaze (kote, fresko, novac) na konkretne sobe u 3D.
- Zidovi z-22..z-53; z-38/z-39 aula sa apsidom, z-50 baza zapadnog stuba ulaza.
- Sonde po godinama na jednom planu: 1959, 1969, 1972, 1976, 1978-1979, 1980, 2003-2005, 2008, 2010, 2011.

**Profili sa kotama (R=1:25):**
- **Sl. 2** (severni, sonde 73/90/87): krune zidova **198,40-198,46**, a **recentni asfaltni put preko profila na 200,04-200,25** — moderni put direktno nad antickim zidovima, ~1,7 m zembelja. Rizik po nalaziste, upisano.
- **Sl. 3** (zapadni, sonda 86): zid kruzne gradjevine (stibadium B) sa horizontale 199,56 — graficka potvrda kruzne osnove O ~7 m.
- **Sl. 4** (istocni, sonda 87): apsida i zid 1; rusevinski sloj pada 199,2 ka 198,80.
- **Sl. 7** (istocni, sonda 103): jama od 199,73 do **197,38** (zdravica na dnu) — poklapa se sa tekstom iz v0.11.
- **Sl. 8** (sonda 46, w-24): horizontala 199,58; Tabela 3: put +/-200,6, kraj puta +/-200,17 — **200,64 najvisa kota baze** (humus+A).
- **Sl. 11** (sonda 81, juzni trem): trasa zida Z-50a, juzni zid trema, dno profila **197,28**; slojevi I-V.

**Provera:**
- Kote iz teksta str. 236-237 (w-1 pod 198,70, Venera 199,12, koplje 199,14, fresko 199,33) poklapaju se sa sektorom 3 iz v0.11 — nezavisna provera prosla.
- Opseg svih kota crteza **197,28-200,64** — temelji i jame idu u zdravicu; 3D osnova ostaje na 198; asfalt/put je recentni horizont i NE ulazi u 3D.
- Stibadium B sada potvrdjen iz **tri nezavisna profila** (86 zapadni, 87 istocni, 73/90 severni).
- Slojevna oznaka A/B/C/D/E konzistentna kroz sonde 46, 81, 103 — vertikalna stratigrafija spremana za slojevni 3D model.

Validator prosiren (crtezi sloj: verzija, profili, kote u opsegu, veze na stubove, opseg 197,38-200,6, numeracija W/E): **0 gresaka / 0 upozorenja.**

Otvoreno: Sl. 1 u vektorskom obliku (za GIS uvoz) postoji samo u PDF-u koji nema vektorsku ekstrakciju linija — ostaje rutina; vezivanje nalaza (novac, fresko, keramika) na nove W/E ID-jeve prostorija je sledeci prirodni talas.

## v0.13 — soba-po-soba sloj: nalazi vezani na prostorije W/E

Novi fajl `sobe_sloj.json` — prostorija postaje jedinica 3D modela: sonde, zidovi, kote i nalazi po sobi (iz sekcija 3-5 i tabela novca Starinara 64/2014).

**Veze sonda ⇄ prostorija — sada eksplicitne iz teksta rada:**
- Jugozapadne prostorije: **w-21 (sonda 78), w-9 (75), w-10 (76), w-11 (77), zapadni deo w-12 (79)**.
- Jugoistocne: **srednji deo prostorije 12 (107)** i **istocni deo prostorije 12 = e-12 (80)** — prostorija 12 se deli na w-12 i e-12; dvoumice iz crteza razresene.
- Severozapadne: **sonda 45 = prostorije 24 i 24a**, **sonda 46 = w-24** (ulaz u stibadium B), **sonda 42 = aula/triklinijum** (z-38/39).
- Severoistocne: **e-22, e-23, e-24 (sonda 70)** — kontrolne sonde 1 i 2.
- Trem/ulaz: **sonda 81 (juzni trem), 101 (ulaz, zid z-50a), 105 (istocni portik)**.

**Nalazi po prostorijama (20 prostorija upisano, prazne takodje):**
- **w-1**: Venera (C-4, 199,12), koplje (C-2, 199,14), baza stuba (AR-1, 199,33), proslojak pozara = dokaz spratnosti.
- **w-9**: novac **271-275** (pre vile) i 335-336; **w-10**: 4 novca 355-361; **w-21**: 364-375; **w-24**: 382-389 (posle rusenja); **w-24a**: 364-367.
- **e-12**: kada 1,6x1,5 m (zidovi z-17/z-19/z-59, horizont 3) + bunar 196,05; **w-12**: olovna cev 198,49 kroz osnovu zida z-59.
- **e-22**: pod 198,94, hipokaust na ulazu, podnica ispod hipokausta **198,29**; **e-23**: dvostruke podnice 198,95/198,82, prefurnijum (sonda 71).
- **trem**: novac 364-375 u zatvorenoj celini ispod rusevine krova => rusenje 378 (Goti, Hadrijanopol) vezano na konkretne sonde.

**Nova najniza kota baze: 195,96** (dno bunara jama 5, sonda 105) — prevojila 196,05 (bunar u e-12); oba bunara kasnosrednjovekovna. Opseg za 3D ostaje **197,28-200,64** (bunari ne ulaze u model).

**Ispravke:** `sonde_sloj` i `vodeni_sloj` — 196,05 vise nije najniza (napomena dopisana); `crtezi_sloj` — W-24a dopisan u numeraciju; vizuelni sloj — polje `version` uskladjeno na 0.13.

**Validator prosiren (v0.13):** svaki nalaz mora imati tip + (opis ili period) + izvor; kote u opsegu; id prostorije mora postojati u W/E numeraciji sa Sl. 1 ili u slobodnim oznakama (aula, trem, ulaz, portik); veza sonda ⇄ prostorija mora postojati u sonde_sloj; najniza kota mora biti 195,96. Posle tri korigovane greske: **0 gresaka / 0 upozorenja**.

**Iskreno stanje:** novac iz tabula SZ sektora (sonde 42/45 zona) i ne-sektorskih sondi (97-104) ostaje u `sonde_sloj` bez pojedinacne prostorije — tabela ne vezuje ga po sobi; prostorije E-1..E-21 bez sondi 2010/11 jos nemaju nalaze. Sledeci talas: vezati nalaze monografije (mozaici, skulpture, porfir) na W/E prostorije, i vektori Sl. 1 za GIS uvoz.

## v0.14 — mozaicki katalog monografije + porfirne skulpture sobe w-4

Novi fajl `mozaici_sloj.json` — 25 unosa iz kataloga podova monografije *Constantine's Villa at Mediana*, svaki vezan na stub ili prostoriju.

**Katalog:** peristil moz-01..06 (238+18,4+5+38+2,5+215 = 516,9 m2), aula moz-07..08 (centar ~47 m2, 50% in situ + apsida), stibadium A moz-09..13 (~68 m2, unisten 1936 — granica), stibadium B moz-14..17 (45 m2, konzerviran 2015), trem ka termama moz-18/19 (104 m2), terme moz-20, vila sa oktogonom moz-21/22, vila sa konhama moz-23.

**Konflikt 945 vs 1000 RESEN** — tri recenice o istoj stvari: 450 m2 (en-wiki) je sacuvani peristil, 945 m2 (sr-wiki) zbir kompleksa, monografija kaze 'oko 1.000 m2'; zbir katalogizovanih 780,9 m2 + apsida + terme + vile popunjava do ~1.000.

**Figuralni mozaici — rupa iz digitalnog pasosova popunjena:** Leda sa labudom i recni bog na podijumu ulaza u aulu (moz-03); **glava Meduze** u medaljonu centra aule (moz-07, potvrda ranijeg nalaza iz skulpturskog programa); ptice sa biljnim ukrasima po uglovima aule; **morski crv na postolju mermerne fontane** stibadiuma A (moz-10) — nova tacka vodenog sloja (fontana-stibadium-A).

**Porfirne skulpture — nalaziste vezano na prostoriju w-4** (iskopi 1971, katalog monografije): Asklepije 43 cm (inv. 985/R), Higija 49 cm (inv. 986/R), grupa Asklepije sa Telesforom — sve tri sa grckim posvetnim natpisima poklonika Roimetalka; moguce svetiste leciteljskih bozanstava (sacrarium). Sobni sloj: **21 prostorija**. Bronzana ograda: monografija precizira polozaj — prohod ka auli, deljenje na dve polovine; ostava 250 m SZ (2000).

**Kalibracija dekodiranja:** srpski deo dvoyazicnog izdanja u PDF ekstrakciji ima zamenjene glifove cifara; kalibrisano po datumima (1974-1976, 1978-1979) — dekodirane povrsine (47 aule, 68 stibadiuma A) nose poverenje 'srednje' dok se ne provere u stampanom izdanju.

**Validator prosiren (v0.14):** id jedinstven, poverenje i izvor obavezni, veza na postojeci stub/prostoriju ili obrazlozena granica, zbir povrsina mora poklapati deklarisani (780,9), dekodirane povrsine moraju nositi nisko/srednje poverenje, vodeni sloj mora znati fontanu stibadiuma A, sobe moraju znati w-4. **0 gresaka / 0 upozorenja.**

**Iskreno stanje:** povrsine terme i apside aule nečitljive u ekstrakciji; dekodirane povrsine (47, 68) za proveru; srpski deo monografije citljiv teksto u stampanom izdanju. Otvoreno i dalje: objekti C-D bez osnove, vektori Sl. 1 za GIS, Vicennalia/Tricennalia, izvor vode (Oblik vs Niska Banja), zapis AN 22.

## v0.15 — geofizicki sloj (16 struktura) + Zotovic-Petrovic 1969

**Novi fajl `geofizika_sloj.json`** — geomagnetna prospekcija april 2010 (RGK DAI + Arheoloski institut + Arhitektonski fakultet, Starinar 61/2011): preko 16 ha, uglavnom istocno od vile, 16 struktura sa merama i interpretacijama.

**Najvaznije za situacioni plan:**
- **geof-01 istočni horeum** (180 m istocno, zapadna fronta 27 m): identicna unutrasnja organizacija kao zapadni (iskopan 1980-82) — tri broda, dva reda stubova, lezista dolia, rezervoari, piloni na ulazu. Nezavisna potvrda 'dva horeuma' iz v0.7; novi stub `horreum-istocni`.
- **geof-04 istocne barake**: prostorije ~8x4,5 m, portik uz unutrasnje dvoriste od ~6 ha, niz ~400 m, ulaz kroz 5 m pukotinu na severu.
- **geof-10 vojni logor**: kvadrat 160 m, jarak bez kamenog zida, kapije sa okruglim kulama (Severov tip, 3. vek; paralele do 5. veka) — privremen ili nedovrsen; autori vide moguci odgovor za fazu 1 (~317). Novi stub `vojni-logor-istocni`.
- **geof-16 apsidalni objekat 10x5 m** kod modernog rezervoara: isti oblik kao crkva iskopana 2001 (kraj 4. veka) — ali funkcija se ne nasledjuje iz analogije; kandidat, ne tvrdnja.
- **geof-02 gradska vila** 16x45 m (fauces + atrijum 5-6 m + zadnji peristil ~20 m) i **geof-06/07** dve kuce tipa 'vile sa ogradnim zidom' (~14 m) — serijska gradnja na istoku.
- Faze iz geofizike (317/330-ih; 378; ruralno naselje sa apsidalnom crkvom) poklapaju se sa horizonata 1-3 iz stratigrafije — nezavisna potvrda metoda.

**Zotovic-Petrovic 1969 (Arheoloski pregled 11, 185-186)** — primarni izvestaj sa iskopavanja:
- **Stepeniste sala-peristil:** pravougaoni ispad podnog dela u sredini juzne strane centrale sale; silazak na nizi nivo peristila preko stepenika sa TRI strane ispada, tesani kameni blokovi — direktan ulaz za 3D kretanje nivoa.
- **Prvi figuralni mozaici na Medijani otkriveni 1969** (centralna sala, mitoloske teme, ~50 m2 te godine) — upisano u `istorijat_otkrica` mozaickog sloja.
- **Ostava zitara u zapadnom krilu** sa kruznim lezistima za pitose Ø 1,50 m.
- **Terme: TRI nivoa poda = faze** (severnoistocno odeljenje) — 3D model terme mora u slojevima.
- **Bazen sa mozaikom preko koga je podignut Muzej (1936) sastavni deo palate**; zidovi palace povadjeni do temelja jos PRE 1930 — novi konflikt `zidovi-pre-1930` (razaranje pre prvih iskopavanja; nadzemni zidovi se ne rekonstruisu kao sacuvani).

**Zamka iz pretrage zabelezena:** 'objekat A 17,20x14,60 m / B 20,30x14,18 / C delimicno' je iz Mlincica-Tisine kod Zenice (Arheoloski pregled 11), NE sa Medijane — upisano kao upozorenje da se ne uveze.

**Validator prosiren (v0.15):** 16 struktura obavezno, dupli id-i, obe oznake poverenja, osnova iz geofizike nikad 'visoko', vezan_stub mora postojati, interpretacija i za_3d obavezni, novi stubovi obavezni u prostornom sloju, detalji_1969 na vili, istorijat otkrica u mozaicima. **0 gresaka / 0 upozorenja.**

**Iskreno stanje:** konture struktura su na Sl. 2 PDF-a (mozaik anomalija) — vektorizacija za GIS i dalje nije izvodljiva alatima na sistemu; hronologija logora okvirna (3. vek do valentinijanski); vizuelni_sloj zaostajao na 0.13 pa uskladen. Nove reference za lov: Petrovic 1994 (monografija), Drca 2000 (objekat B, Zbornik NMN 9), Jeremic G. 2006 (mozaici, Nis i Vizantija 4), Vasic 2005/2007.

## v0.16 — integracija nalaza GLM roja: hidraulika, numizmatika, objekti C-D, GIS izvori, komparativni korpus

Integracija pet istraživačkih grana roja (vodeni_sistem, numizmatika, objekti_CD, gis_udaljena, komparativni_korpus) kao verzija v0.16. Skripta: `talas_v016.js` (čita roj_glm/ kao izvorni materijal — roj je read-only; slojevi nastaju transformacijom).

**Novi fajlovi (4):**

- `hidraulika_sloj.json` — puna hidraulička mreža po **Jeremić 1988 (Starinar XXXIX, 59-84)**, očitano sa lokalnih rendera str. 62-81: 28 čvorova sa kotama (izvorište ~4,5 km, kanal C dovodni 208,92-209,50 sa konkavnim dnom, ustave I/II, kanal D negirani, bazen A 37,20 m / 584 m³ / pod 207,06→205,98, bazen B 30,2 m³ / pod 206,39 / bojeni sokl 45 cm, kanal E distributivni, šaht H dno 205,24, kanal F drenažni, cevi G Ø 155 i B Ø 95), računica (Manning/Darcy): pad linije **8,87 m ≈ 17,7‰ (~1,8%)**, protok E 17,5-44,8 l/s, statika za fontane 8,9-9,3 m (~0,9 bar) — **pritisak dostatan sa rezervom; pravi problem je VIŠAK** (rešen ustavama i prelivnicima); Jeremićevi 8,2/31 l/s su PRAŽNJENJE, ne potrošnja. 6 konflikata + ograničenja upisana.
- `numizmaticki_sloj.json` — 22 novčana nalaza (271-450) po sondama/slojevima/kotama iz Tabela Starinara LXIV/2014: horizont 1 pre 330 (Krisp 324-330 TPQ), horizont 2 330-378 (zatvorene celine w-9 335-336, w-10 355-361, w-21 364-375, trem 364-375), horizont 3 posle 383 do 441/443 (Teodosije 382-389, Arkadije/Honorije 404-406, 404-450, **skrivnica 425-450, kota 198,89 — najmlađi numizmatički datum baze**). Konflikti: Vicennalia vs Tricennalia OTVOREN (presudan revers iz kataloga Janković-Mihaldžić 2008); rušenje = TPQ 375, "najverovatnije 376-382 (istorijski: 378)"; konzervacija 1970-e vs novac 364-375 OTVOREN; 378 vs život do 441 REŠENO horizontima.
- `objekti_cd_sloj.json` — status slovnog sistema A-D: **NEREŠEN iz otvorenih izvora** (RAI harvest 2438 zapisa — 0 pominjanja; muzej opisuje bez slova; Petrović 1994 koristi brojeve 1-15; jedina javna slova = stibadiumi A/B unutar vile; "objekat B" Drče 2000 = muzejski NMN sistem, Zbornik NMN 9 nigde digitalizovan). 13 skupina mera (aula 19,6×12 m + apsida 5,2 m — Jeremić 2017 pun tekst; vila 98,6×63,0 / 6.800 m² — Jeremić 2006 preko wiki-a; konhe 32,5 m; oktagon 3.150 m²; sonde 95/96/97...). Konflikti: 6.500 vs 6.800 m²; 40 vs 80 ha; mozaici "tetrarhija" vs TPQ 341-346; početak gradnje. Zamka Zenica preneta verbatim.
- `gis_izvori_sloj.json` — 27 prostornih izvora sa **oštro razdvojenim statusom**: 6 [PROVERENO — otvoreno u ranijem radu baze] naspram 21 kandidat (URL NIJE otvoren — ne tretirati kao postojeći): Kanitz 1864/1892, ÖNB AKON 1915-18, MAPSTER list "Niš", Geosrbija/EarthExplorer aerofoto, Sentinel-2, Pleiades, GE slajder, LiDAR pitanje, DEM kandidati (GLO-30 prvi u redu) + OpenTopoData API, nasledje.gov.rs / INSPIRE / Fasti / Pleiades. Dem-uzorkovanje: 0 piksela (mreža roju bila zaključana).

**Izmenjeni fajlovi:**

- `vodeni_linijski_sloj.json` — korekcije uz eksplicitne konflikte (stari stavovi ostaju): izvor vode **REŠEN U SMERU** — Jeremić 1988: vodovod NIJE ogranak Naissusa, dovod sa istoka, izvorište pravac Niške Banje ~4,5 km ("Oblik" bez primarnog izvora); konflikt dva-kanala (Pop-Lazić izlazna strana vs Jeremić dovodna — 2 dovodne + 1 izlazna + 1 drenažna za 3D); pad 8,87 m ≈ 1,8% umesto procene 2%; castellum **PREMEŠTEN posle iskopavanja** (isečen na komade, nekoliko stotina m ka SZ, fabrika EI) — sve kote su originalne pozicije 1988; +5 čvorova (kanal-E-distributivni, točno-mesto-kadijunica-terme, sekundarni-vodotoranji, premestanje-kasteluma, fontana-oktagon).
- `komparativni_lokaliteti.json` — korpus roja: 13 lokaliteta (Romuliana, Šarkamen, Sirmium, Solun, Casale, Trier, Nikomedija/Antiohija, Armira, Split, Maksencijeva bazilika, Viminacium, Timacum Minus, Naissus); **tipologija aule** (Trier 26,05×67×33 m / Solun 24×67 / Maksencije 25×80 — proporcija 2,6-3,2:1 za aulu z-38/39); **visinska sidra** (očuvano: Trier 33 m, rotunda 30 m, luk 12,5/6,5 m; sve rekonstrukcije nisko); novo pravilo: odsustvo bedema na Medijani ima pozitivan dokaz (Timacum Minus 3 m bedema; geofizika 16 ha to nema → otvorena rezidencija).
- `prostorni_sloj.json` — vila-peristil +mere 2006 (98,6×63,0 m; površina u konfliktu), castellum +premeštanje.
- `baza_podataka.json` — +3 izvora (jeremic-1988-castellum, jeremic-2006-mozaici, jankovic-mihaldzic-2008), +6 konflikata sa id (izvor-vode, dva-kanala, pad, vicennalia, 40-vs-80 ha, 6500-vs-6800), dopune rupe (vodozahvat, objekti A-D) i nacin_daljeg_rada (ručna skidan Jeremić 2006, monografija 2016, aus2015.pdf, fizički Zbornik NMN, dem-uzorkovanje).
- Sve verzije usklađene na 0.16 (13 fajlova).

**Validator prosiren (v0.16):** hidraulika (verzija, ≥25 čvorova, jedinstveni id, izvor + poverenje, kote u 194-212, ≥6 konflikata, ograničenja, računica), numizmatika (≥20 unosa, id/izvor/poverenje/značaj, ≥3 konflikta), objekti_cd (status sistema, ≥12 mera, ≥3 konflikta, zamka Zenica obavezna), gis izvori (≥25 izvora, status_provere obavezno, kandidat ne sme nositi visoko poverenje), komparativni (≥12 lokaliteta, tipologija aule, visinska sidra), vodeni sloj (novi čvorovi + premeštanje + hidraulički rezime). **0 grešaka / 0 upozorenja.**

**Iskreno stanje / otvoreno:** tačna kaptaza i trasa akvadukta (nikad iskopana — 3D isprekidano); gde je danas premešteni kastelum (neidentifikovano); uvodne strane Jeremića 59-61 nisu renderovane; Vicennalia/Tricennalia čeka katalog 2008; objekat B čeka fizički Zbornik NMN 9; puni PDF Jeremić 2006 skinuti ručno (webReader pada); fasti_mediana.json = dokumentovan API-kvar, ne podatak; dem-uzorkovanje 0 piksela; epigrafika roja još radi — njen sloj NIJE u ovom talasu.
