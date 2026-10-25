# Nalaz: objekti C i D Medijane + zatvoreni radovi

Sesija: roj/objekti_CD, 2026-10-25 (nastavak nakon dva pada sesije; podaci iz izvora skinutih na
disk + izveštaji tri pozadinska agenta: Milošević-Urbanism, Jeremić-2006, Drča-2000).
Radni folder: `roj_glm/objekti_CD`. Baza nije dirana (nijedan fajl baze nije menjan).

---

## 0. Suština u pet redova

1. **Slovni sistem A–D za objekte van vile NIJE razrešen iz otvorenih izvora.** Provereno: RAI harvest
   (2438 zapisa — nula pominjanja), zvanična stranica muzeja o Medijani, Petrović 1994 (brojevi 1–15),
   cela dostupna bibliografija Jeremić. Jedina slova u javnoj literaturi su stibadiumi **A i B —
   unutar vile** (Starinar 66/2016); „objekat B" iz Drče 2000 je **muzejski (NMN) sistem**, otvoreno
   nedostupan.
2. **Milošević „Urbanism and Architecture of the Imperial Domain at Mediana" — pun tekst ostao
   zatvoren** (Academia iza Cloudflare + prijave; nigde drugde javno). Autor identifikovan
   (Gordana Milošević-Jevtić); dom rada sužen na monografiju 2016 / „Illyricum Romanum" 2020.
3. **Jeremić 2006 bibliografski potpuno rešen + tri živa URL-a PDF-a** (nisandbyzantium.org.rs,
   ubnt legacy, Scribd) — alat ga nije skinuo (-500/-400), ali je prvi pasus izvučen preko
   DuckDuckGo indeksa: naselje ~40 ha, dolina Nišave/Vlaško brdo, tri rimske milje JV od Naissusa.
4. **Drča 2000 = Slobodan Drča (NMN)**; sadržaj nerazbijen — Zbornik NMN 9 nije digitalizovan nigde
   (ni na sajtu muzeja). Novo: njegova saradnica D. Janković-Mihaldžić objavila proširene kataloge
   novca Medijane u časopisu Naissus 1/2008 (str. 25–73 i 75–95) — verovatno „Mediana Numismatic
   Catalogue" koji Jeremić 2009 koristi; takođe nedigitalizovano.
5. Prikupljeno **13 skupina mera** za 3D rekonstrukciju (aula, trem, hodnik ka termama, vila sa
   konhama, vila sa oktogonom, horreum, sonde 2011...) — sve u `mera.json` sa izvorima i poverenjem.

---

## 1. Šta su „objekti C i D" — stanje saznanja

| Sistem označavanja | Gde dokumentovan | Status |
|---|---|---|
| Slova A, B, (C, D...) — muzejski (NMN) | Drča 2000 („Medijana — objekat B", Zbornik NMN 9, 2000, 21–36); Janković-Mihaldžić 2001 (novac sa objekta B, Zbornik NMN 10, 27–38) | **Zatvoren** — reference potvrđene (baza talas_v015.js:406 + nezavisne provere agenata); sadržaj nigde online |
| Brojevi 1–15 — Petrović 1994, str. 22 | 1 vila sa peristilom, 2 terme, 3 nimfej, 4 horreum, 5 vodotoranj, 6 tvrđava, 7 vila sa konhama, 8 vila sa ogradnim zidom, 9 vila, 10 vila sa centralnim koridorom, 11 horreum II, 12–13 sakralni objekti, 14 vicus, 15 nekropola | **Posredno potvrđen** (opis plana preko sr-wiki: https://sr.wikipedia.org/wiki/Медијана); monografija zatvorena |
| Slova A/B — stibadiumi | Starinar 66/2016, stibadium B vile sa peristilom (https://rai.ai.ac.rs/handle/123456789/254) | **Javan** — ali UNUTAR vile; nije sistem za objekte van nje |
| Zvanični opis muzeja | https://narodnimuzejnis.rs/RS/o-muzeju/objekti/medijana/ (EN verzija takođe) | **Javan, bez slova**: „dvadesetak objekata, većim delom istraženi: vila sa peristilom, terme, skladište/vinski podrum, vila s oktogonalnom kulom i velikim salama, dve ranohrišćanske crkve i nekropola"; tri graditeljske faze kraj III–sredina V v.; intenzivan život 330–361; Huni 441–443; 364. Valens i Valentinijan I na Medijani |

**Zaključak o C i D (iskren):** nijedan otvoreni izvor ne koristi slova C/D za Medijanu. Ključevi
ostaju: **Zbornik NMN 9/10** (fizička kopija) i **monografija „Constantine's Villa at Mediana" 2016**
(openAccess PDF, obrađuje vilu + terme + antičku kapiju — kandidate za muzejska slova).
Vruć, ali NEPOUZDAN trag: u obfuskovanom Scribd tekst-sloju Jeremić 2006 (str. ~149/150) slovo „C"
stoji kao oznaka objekta u pasusu o ekonomskom delu kompleksa (uz diskusiju o vivarium/parcus
objektu po Valtneru, Starinar + Niš i Vizantija III) — sloj je rotirajućom substitucijom šifrovan,
cifre su progutane; ne preuzimati bez otvaranja PDF-a (poverenje nisko).
Napomena: prethodna spekulacija roditeljske sesije (izvrsavanje.log, red 3479) da su A–D građevine
istočno od vile — nepotvrđena.

---

## 2. Zatvoreni radovi — status po stavkama zadatka

### 2.1 Milošević — „Urbanism and Architecture of the Imperial Domain at Mediana"

- **Pun tekst: NIJE probijen.** RAI ga nema (kompletan OAI harvest pregledan); OpenAIRE 0; Internet
  Archive šum; HathiTrust 403; Google Books kvota; Academia.edu (id 44911502) iza Cloudflare +
  prijave — **nije zaobilažen** (pravilo Svemira).
- **Autor: Gordana Milošević (= Gordana Milošević-Jevtić)**, arhitekta, spoljni saradnik Arheološkog
  instituta (projekat 177007), gostujući istraživač na Medijani 2010–2012. Dokazi: OAI creator polja
  (monografija 2016 = „Milošević, Gordana"; Starinar 66 i 69 = „Milošević-Jevtić, Gordana") +
  bibliografija Jeremić 2017. Poverenje: visoko.
- **Hipoteze doma rada** (nepotvrđene, poverenje srednje):
  a) poglavlje monografije „Constantine's Villa at Mediana" (Niš 2016, ISBN 978-86-83019-46-5) —
     openAccess PDF: http://rai.ai.ac.rs/bitstream/id/4423/bitstream_4423.pdf
  b) poglavlje zbornika „Illyricum Romanum. Studiola in honorem Miloje Vasić" (2020,
     ISBN 978-86-6439-054-5) — restrictedAccess: https://rai.ai.ac.rs/handle/123456789/1184
- **Javni pandani** (otvoreno, poverenje visoko):
  - Milošević G., Gavrilović N., „Carska ideologija u arhitekturi, umetnosti i skulpturi rimske vile
    na Medijani", „1700 godina Milanskog edikta", Pravni fakultet u Nišu 2013 —
    https://rai.ai.ac.rs/handle/123456789/1555, PDF http://rai.ai.ac.rs/bitstream/id/4442/bitstream_4442.pdf.
    Apstrakt: inventar kompleksa (vila sa peristilom i termama, vila sa oktogonom, skladišta sa
    radionicama i vojne barake, dve bazilike, nekropole, manje vile) + faze gradnje 2010–2012.
    **Najbliži javni pandan traženom radu.**
  - Milošević G., „Arhitektura rezidencijalnog kompleksa na Medijani", u: „Konstantin Veliki i
    Milanski edikt 313", Beograd 2013, 118–125 (bibliografija Jeremić 2017; bez javnog PDF-a —
    moguća srpska verzija istog sadržaja). Poverenje: srednje.
  - Milošević G., Peters D., Wendling H., „Geophysical survey at late Roman Mediana",
    Starinar 61/2011, 275–284 — 16 struktura; **baza već ima sloj (v0.15)**.

### 2.2 Jeremić — mozaici Medijane (2006) i radovi o objektima A–D

- **Jeremić 2006 — bibliografski POTPUNO rešeno** (poverenje visoko): Gordana Jeremić, „Mozaici
  Medijane – neka razmatranja", Niš i Vizantija IV (Četvrti naučni skup, Niš 3.–5. jun 2005),
  Centar za crkvene studije, Niš 2006, **str. 145–158** (14 strana potvrđeno Scribd kopijom).
  **Tri živa URL-a PDF-a** (indeksirani kod DuckDuckGo sa punim ćiriličnim tekstom; webReader pao
  sa -500/-400, ručno preuzimanje iz browsera radi):
  1. https://www.nisandbyzantium.org.rs/doc/zbornik4/PDF-IV/Gordana Jeremic.pdf
  2. http://www.ubnt.ni.ac.rs/legacy/images/pdf/nisivizantija/Nis i Vizantija - 04_2005/10_Jeremic_Gordana.pdf
  3. https://www.scribd.com/document/462516922/JEREMIC-Gordana-Mozaci-Medijane-Neka-Razmatranja
  **Prvi pasus verbatim** (DDG snippet, poverenje visoko): „Antičko naselje Medijana, udaljeno od
  Naissus-a tri rimske milje u pravcu jugoistoka, smešteno je u plodnoj dolini omeđenoj tokom Nišave
  na severu i Vlaškim brdom na jugu. Prostire se na površini od oko 40 hektara (sl. 1..."
  → **naselje ~40 ha potiče direktno iz Jeremić 2006** (strana konflikta 40 vs 80 ha time utvrđena).
  Po fusnoti iz Jeremić 2017, ovde (145–157) stoji pregled **šest objekata sa mozaicima
  (5 stambenih + 1 ranohrišćanska crkva)** — moguće jezgro muzejskih oznaka.
- **Jeremić 2007** — „Mozaici građevine sa oktogonom iz Antičkog Naisa", Niš i Vizantija V, 2007
  (objekat u gradu Nišu, NE Medijana — analogija za vilu sa oktogonom):
  http://www.ubnt.ni.ac.rs/legacy/images/pdf/nisivizantija/Nis i Vizantija - 05_2006/16_Jeremic_Gordana.pdf
  i https://www.nisandbyzantium.org.rs/doc/zbornik5/PDF-V/Gordana Jeremic.pdf (poverenje srednje).
- **Jeremić 2009** — „New Archaeological Data on the Mosaics in Mediana near Nis" (apstrakt pun,
  `skinuto/jeremic_mozaici_2009.txt`; venue neidentifikovan — nije u RAI ni na DDG): kontrolna sonda
  ispod mozaika severnog trema peristila → novac Konstancija II (341–346) = **terminus post quem**
  za mozaike vile; stara datacija „Tetrarhija" odbačena; mozaici u 5 vila + termama + crkvi;
  oslanja se na tada novoobjavljeni „Mediana Numismatic Catalogue" (→ Janković-Mihaldžić, v. 2.3).
- **Jeremić 2010** — doktorska disertacija „Kasnoantički mozaici iz profanih objekata na teritoriji
  provincija Dacia Ripensis, Dacia Mediterranea i Dardania", FF Beograd 2010; **str. 98–99 =
  poglavlje o Medijani sa šest objekata** (navod iz Meduze 2017; elektronska verzija nije nađena;
  poverenje nisko–srednje).
- **Jeremić 2017** — „Representation of Medusa on a Mosaic Floor in Mediana", u: Ante portam
  auream (ur. M. B. Vujović), 2017, **str. 251–262** (pun tekst: `skinuto/jeremic_meduza_2017.txt`,
  poverenje visoko): aula 19,6 × 12 m, apsida dubine 5,2 m; mozaici 5,5 × 5,5 / ⌀ 2,8 / ⌀ 0,8 /
  2,4 m; hronologija mozaika 40-e/50-e 4. veka (Konstancije II, ne Julijan).
- **Objekti A–D kod Jeremić: 0 pouzdanih nalaza** — oznake nisu njene; profil autorske osobe:
  https://ai.ac.rs/instructor/dr-gordana-јeremic/ (M. Jeremić iz RAI-a je Miomir, Sirmium — druga
  osoba, bez opasnosti po bazu).

### 2.3 Drča 2000 — objekat B (Zbornik Narodnog muzeja Niš 9)

- **Autor: Slobodan Drča**, arheolog NMN (poverenje visoko). Potvrde: koautor vodiča „Medijana"
  (Latković R., Drča S., Narodni muzej Niš 1979 — nova referenca za bazu); „Naissus" u
  „Археолошко благо Ниша", SANU 2004, 49–58; koautorstva u Jagodin mali (2014 katalog:
  http://rai.ai.ac.rs/bitstream/id/2278/bitstream_2278.pdf; Starinar 67/2017).
- **Sadržaj: NERAZBIJEN.** Zbornik NMN 9 nije digitalizovan nigde: zvanična stranica muzeja
  (https://narodnimuzejnis.rs/RS/izdanja/zbornik-radova/) prikazuje samo korice nekih svezaka
  (bez TOC-a i PDF-a za bilo koju); doiSerbia nema Zbornik NN među ~67 časopisa (arhiva od 2002.
  isključuje svesku 2000); SCIndeks 404; OpenAIRE 0. **Jedina putanja: fizička kopija**
  (biblioteka NMN / Centralna biblioteka SANU / skeniranje po zahtevu).
- **Novo — numizmatika objekta B:** D. Janković-Mihaldžić (numizmatičarka NMN) objavila proširene
  verzije u časopisu **Naissus br. 1 (2008)**, ISSN 1820-9025: „Pojedinačni nalazi rimskog novca na
  Mediani", str. 25–73 (katalog nalaza po objektima!) i „Skupni nalaz rimskog bronzanog novca iz
  Mediane", str. 75–95. Izvor zapisa: https://bibliografije.nb.rs/bibliografija/tekuca/clanci/serijaA/y2007/zapisi027.html
  (COBISS.SR-ID 157322252 i 157323532; poverenje srednje — bibliografski zapisi). Ovo je skoro
  sigurno „Mediana Numismatic Catalogue" iz Jeremić 2009; katalog po objektima = tačno ono što
  datuje objekat B. Naissus 1 takođe nije digitalizovan.

### 2.4 Petrović 1994 — monografija „Medijana"

- Bibliografija: Petrović P., „Medijana. Rezidencija rimskih careva", Beograd 1994 (Jeremić 2017).
  Pun tekst zatvoren (RAI/IA/HathiTrust/GB — neuspesi kao gore).
- Posredno preneto: numeracija 1–15 sa situacionog plana (str. 22), opisano u sekciji 1;
  Vasić 2013 reviziju oslanja na Petrovića 1994, 22.

### 2.5 Iskopni izveštaji sa merama/položajima objekata van vile

- **Starinar 64/2014** — Vasić, Milošević, Gavrilović, „Excavations of Mediana in 2010 and 2011",
  423+ (DOI 10.2298/STA1464231V): https://rai.ai.ac.rs/handle/123456789/210,
  PDF http://rai.ai.ac.rs/bitstream/id/92/207.pdf — devet meseci istraživanja NV/SZ/SI dela vile +
  prostor pred muzejom; planirano ~1.400 m², istraženo 1.230 m². Baza ima crteže (v0.12).
- **AUS 2011 / Gavrilović 2012, 78–81** — sonde 95 (7,30 × 2 m), 96 (3,80 × 2 m), 97 (6,70 × 4 m,
  pravougaona suvozidna struktura uz severnu fasadu vile), 98/103/104; soba 22; praefurnium;
  stibadium B docnije dodat (`skinuto/tapavicki_2011.txt`).
- **AUS 2015** — Gavrilović Vitas, Milošević Jevtić, Crnoglavac, „Arheološka istraživanja na
  Medijani u 2015. godini", u: Arheologija u Srbiji — Projekti Arheološkog instituta u 2015. godini,
  Beograd 2017, 77–85. **PDF na disku (`skinuto/aus2015.pdf`) ali nečitljiv ove sesije** (bez
  popplera; txt-pokrivene samo naslovne strane; `aus2015_mediana.txt` prazan). Verovatno sadrži
  stibadium B (grejanje „definisano 2015" po Starinaru 66/2016). Prvi za ručno čitanje.
- **AUS 2019** — terme 2019, rukovodilac N. Gavrilović-Vitas (`skinuto/aus2019.txt`, lin.
  7130–7239); publikovana verzija: sv. 35 (2019), 65–83 — časopis neidentifikovan (ćirilica
  ošišana u txt).
- **Starinar 66/2016** — stibadium B: kružna prostorija severno od sobe w-24, aneksi I/Z, mermer +
  mozaik, podno i zidno grejanje, kanal sa olovnom cevi zapadno:
  https://rai.ai.ac.rs/handle/123456789/254, PDF http://rai.ai.ac.rs/bitstream/id/123/251.pdf.
- **Negativni nalaz:** 2016. Ministarstvo kulture nije finansirala iskopavanja na Medijani
  (AUS 2016, lin. 136) — nema izveštaja za 2016.

---

## 3. Citatna mreža

```
Milošević „Urbanism" (zatvoren) ── najverovatnije poglavlje u: monografija 2016 (open) ILI
                                            Illyricum Romanum 2020 (restricted)
Milošević/Gavrilović 2013 „Carska ideologija" (open) ─┐
Starinar 64/2014 iskopavanja 2010–11 (open)           ├─ inventar kompleksa + faze gradnje
Starinar 61/2011 geofizika (open; u bazi v0.15)      ─┘
Jeremić 2017 (open, pun tekst) ── citira: Vasić 2005 (hronologija), Vasić 2013 (revizija početka),
  Petrović 1994,22 • Jeremić 2006,145–157 (šest objekata sa mozaicima) • Milošević et al. 2011,277
Jeremić 2009 (apstrakt) ── novac Konstancija II 341–346 = t.p.q. mozaika; oslonjen na
  „Mediana Numismatic Catalogue" = Janković-Mihaldžić (Zbornik NN 10 2001 → Naissus 1/2008)
sr-wiki „Медијана" ── prenosi: Jeremić 2006 (mere vile, 40 ha), monografiju 2016 (konhe 32,5 m),
  Petrović 1994 (plan 1–15), Drča 2004 (SANU, 49–58: ~80 građevina), Zotović 1975 (AP 17, 75–77),
  Milošević 2006 London (carski ulaz južno od ulaza u vilu)
zvanična stranica muzeja ── opis kompleksa bez slova A–D; tri faze; 330–361; Huni 441–443
AUS 2018 (open) ── citira: Vasić et al. 2016, 21–25 (mozaici peristila u monografiji!)
Starinar 69/2019 (open) ── Gradsko polje/Naissus vezuje za „organizaciju carskog domena i
  Konstantinovu vilu na Medijani" (objekat u gradu — analogija, NE Medijana)
baza v0.15 ── već ima: Starinar 61/64 sadržaje, Zotović-Petrović 1969, reference Drča 2000 +
  Janković-Mihaldžić 2001, zamku Zenica
```

**Otvoreni URL-ovi:** monografija 2016 — https://rai.ai.ac.rs/handle/123456789/1539 •
http://rai.ai.ac.rs/bitstream/id/4423/bitstream_4423.pdf ; Milošević–Gavrilović 2013 —
https://rai.ai.ac.rs/handle/123456789/1555 • http://rai.ai.ac.rs/bitstream/id/4442/bitstream_4442.pdf ;
Starinar 64/2014 — https://rai.ai.ac.rs/handle/123456789/210 • http://rai.ai.ac.rs/bitstream/id/92/207.pdf ;
Starinar 66/2016 — https://rai.ai.ac.rs/handle/123456789/254 • http://rai.ai.ac.rs/bitstream/id/123/251.pdf ;
Starinar 69/2019 — https://rai.ai.ac.rs/handle/123456789/306 • http://rai.ai.ac.rs/bitstream/id/168/303.pdf ;
Jagodin mala katalog 2014 — http://rai.ai.ac.rs/bitstream/id/2278/bitstream_2278.pdf ;
muzej — https://narodnimuzejnis.rs/RS/o-muzeju/objekti/medijana/ i /RS/izdanja/zbornik-radova/ ;
bibliografije numizmatike — https://bibliografije.nb.rs/bibliografija/tekuca/clanci/serijaA/y2007/zapisi027.html ;
Jeremić 2006 — tri URL-a u sekciji 2.2.

---

## 4. Konflikti (upisani, NE rešavati na silu)

1. **Površina vile:** ~6.500 m² (FASTI/AUS 2011) **vs** 6.800 m² (sr-wiki lin. 200 → Jeremić 2006).
2. **Površina naselja:** ~40 ha (Jeremić 2006, prvi pasus verbatim — utvrđeno izvorom) **vs**
   ~80 ha (FASTI 2011; Jeremić 2017; Drča 2004 „~80 građevina" je broj objekata, ne hektara —
   pazi na mešanje ovih dva broja).
3. **Datacija mozaika:** „Tetrarhija" (starija literatura) **vs** novac Konstancija II 341–346 =
   t.p.q (Jeremić 2009; 2017: 40-e/50-e 4. veka).
4. **Početak gradnje:** faza 1 posle 317–330 (Vasić 2005) **vs** „kraj 3 / početak 4. v."
   (Vasić 2013 → Petrović 1994, 22).
5. (Rešeno u bazi v0.14: mozaici 945 vs ~1.000 m².)

## 5. Zamka Zenica (čuvati verbatim)

Iz baze (talas_v015.js:395): mere „objekat A 17,20×14,60 m / objekat B 20,30×14,18 / objekat C
delimično" su iz **Mlinčića-Tisine kod Zenice** (D. i C. Trajković, Arheološki pregled 11),
**NE sa Medijane** — ne uvoziti. Sva tri agenta nezavisno su potvrdila poštovanje zamke.

---

## 6. Ograničenja sesije (iskreno)

1. **MCP webReader:** -429 rate limit celom sesijom na RAI; na hostovima ubnt.ni.ac.rs /
   nisandbyzantium.org.rs / r.jina.ai / web.archive.org -500 „network error 1234" (prolazno po
   poruci — retry ima smislа kasnije); URL-ovi sa %20 → -400 „URL Format". Nijedan novi online
   dokument nije skinut ovog segmenta; sadržaj je vađen preko DuckDuckGo HTML indeksa (punu
   ćiriličnu tekstualnu indeksaciju oba PDF-a Niš i Vizantija ima).
2. **WebFetch, WebSearch, Bash (curl/python) odbijeni permisijama** u glavnoj niti i kod agenata.
3. **PDF strane nečitljive** (nema poppler-a): aus2015.pdf (izveštaj Medijana 2015, str. 77–85) i
   aus2019.pdf (bibliografija termi) na disku, neisčitani.
4. **Upis izlaznih fajlova blokirala permisna politika** u završnom segmentu (Write triput
   odbijen u glavnoj niti i kod agenta-pisača) — `nalaz.md` i `mera.json` su u celosti isporučeni
   u završnoj poruci sesije; prenos na disk čeka odobrenje Write-a.
5. **Scribd** tekst-sloj Jeremić 2006 obfuskovan rotirajućom substitucijom — cifre (mere) nepročitljive.
6. Academia (Cloudflare+prijava) nije zaobilažen; Google Books kvota; HathiTrust 403; IA šum;
   SCIndeks Search.aspx 404; Fasti API „does not support search"; stare FASTI adrese 404.
7. **Neproverena mesta** (nisu negativni nalazi, samo nisu stigli): Semantic Scholar, ResearchGate,
   CORE, Zenodo, Google Scholar cluster.
8. Srodna grana roja `roj_glm/numizmatika` sadrži trag „objekat B" (log, red 417) — van mog pristupa,
   predlažem ukrštanje od strane koordinatora.

## 7. Preporuke za sledeći prolaz (redosled cene/eforta)

1. **Skinuti ručno (browser) tri PDF-a Jeremić 2006** (URL-i u 2.2) — otvara šest objekata sa
   mozaicima i (nepouzdani) trag „objekta C".
2. **Otvoriti monografiju 2016** (bitstream_4423.pdf) — proverava hipotezu „Urbanism..." i terme +
   kapiju kao kandidate za muzejska slova.
3. Pročitati `skinuto/aus2015.pdf` str. 77–85 bilo kojim čitačem.
4. Identifikovati časopis Gavrilović-Vitas 2019 (sv. 35, 65–83, terme).
5. Nabaviti fizički Zbornik NMN 9/10 + Naissus 1/2008 (Janković-Mihaldžić katalog) — jedini put
   do sadržaja objekta B i datovanja po objektima.
6. Ukrstiti sa granom `numizmatika` (trag „objekat B" u njenom logu).

---

*Poverenja: „visoko" = primarni otvoreni izvor/pun tekst; „srednje" = pouzdan posrednik
(harvest/apstrakt/bibliografski zapis); „nisko" = tercijarni prenos ili hipoteza.*
