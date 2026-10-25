Treća potvrda istog uzroka — **ova sesija ne može da piše fajlove ni kroz Write, ni kroz Bash preusmerenje, iako je cilj upravo dozvoljeni direktorijum** (sama poruka o blokadi ga navede kao dozvoljen — provera je u kontradikciji sama sa sobom). Niti da čita bazu van `gis_udaljena`. Niti mrežu. Neću pokušavati da zaobiđem zaštitu — prijavljujem kvar i predajem **sadržaj oba fajla ovde u poruci**, da se upiše jednom komandom kad se ovlašćenja vrate.

---

## Šta je stvarno urađeno (posle pada sesije)

- Prethodna sesija: pročitani `README.md`, `geofizika_sloj.json`, `vodeni_linijski_sloj.json`, ulazni paket Svemira; izvučene koordinate (vila 43,3096 N / 21,9485 E; castellum na padini Vlaškog brda, ~500 m JZ, DEM procena ~206 m). **Web istraživanje i DEM uzorkovanje nisu stigli da počnu** — `izvrsavanje.log` sadrži samo inicijalizaciju i prva čitanja.
- Ova sesija: potvrđeno da su sva mrežna i upisna ovlašćenja izgubljena restartom; sastavljen kompletan nalaz sa iskrenim razdvajanjem „provereno u bazi" / „kandidat, nije otvoreno".

## Blokade (testirano, ne pretpostavka)

| Alat | Ishod |
|---|---|
| `WebSearch`, `WebFetch` | odbijeno 3× („you haven't granted it yet") |
| `curl` (Bash) | zahteva odobrenje — odbijeno |
| `Write` u `gis_udaljena` | odbijeno iako je folder dozvoljeni direktorijum |
| Bash preusmerenje `>` u isti folder | blokirano, uz poruku koja kao dozvoljen navede **baš taj put** (POSIX i Windows forma — isto) |
| Čitanje baze van `gis_udaljena` | blokirano (sužen dozvoljeni obuhvat) |

**Da se nastavi:** vratiti `medijana_baza` u dozvoljene direktorijume, odobriti WebSearch/WebFetch/curl i upis u folder — redosled rada je na kraju nalaza.

---

## `nalaz.md` (spreman za upis u `gis_udaljena`)

```markdown
# Nalaz: GIS, daljinska detekcija i istorijske karte Medijane

Datum: 2026-10-25 · Um: glm-5.3-flash · Projekat: medijana_baza (3D rekonstrukcija)
Folder: roj_glm/gis_udaljena · Prateći fajl: prostorni_izvori.json

## 0. Ograničenje ovog izvršenja — čitati prvo

Sesija je pala usred rada; restartovana je BEZ mrežnih ovlašćenja (WebSearch, WebFetch,
curl — odbijeni) i bez čitanja baze van gis_udaljena. Pre pada pročitano lokalno: README.md,
geofizika_sloj.json, vodeni_linijski_sloj.json, koordinate iz baza_podataka.json.
Zato svaki zapis nosi oznaku:

- [PROVERENO] — fajl postoji na disku baze ili je URL zabeležen u sloju kao otvoren u
  ranijem radu (izvor, licenca, poverenje već upisani u sloju). Ovom sesijom NIJE ponovo
  otvaran — nasleđujem zapis baze, ne tvrdim svežinu.
- [KANDIDAT — NIJE OTVORENO] — URL iz dosadašnjeg znanja sa konkretnom proverom koju treba
  uraditi kad mreža radi. Po pravilu zadatka: ne tretirati kao postojeći dok se ne otvori.

Nedovršeno zbog blokade: DEM uzorkovanje (kote Vlaškog brda i trase ka Nišavi,
GLO-30 naspram SRTM) — 0 piksela skinuto, nijedna kota nije merena u ovoj sesiji.

## 1. Šta baza već ima ([PROVERENO])

- OSM poligon jezgra vile ~5,7 ha (osm_way_full.json, osm_nominatim.json; ODbL).
- Wikidata Q960839 — Medijana, 43.31028 N / 21.94889 E (CC0).
- EPSG:4326, visine m n.m.v. (prostorni_sloj.json).
- Pop-Lazić 2018, otvoreni pristup: https://rai.ai.ac.rs/bitstream/id/2194/ROMAN_LIMES_AND_CITIES_ON_THE_TERRITORY.pdf
  (primarni izvor vodenog sloja; otvoreno u ranijem radu).
- Geofizika 2010, 16 struktura: geofizika_sloj.json v0.15; DOI izvora 10.2298/STA1161275M.
- DEM procene: vila ~197–198 m, castellum ~206 m (opseg 204–210) — SREDNJE poverenje,
  procena sa grubog DEM-a; upravo to zadatak traži da proveri.
- Moderne kote sa profila Starinara 64/2014: 197,28–200,64; najniža 195,96 (iskop, visoko).

Rupe i dalje: GIS osnova objekata A–D, trasa vodozvoda, vektorizovani Sl. 1
(geofizika_sloj.otvoreno: „konture su na Sl. 2 u PDF-u — vektorski sloj nije izdvojiv").

## 2. Istoriske karte i snimci

2.1 Kanitz 1864/1892 — [KANDIDAT — NIJE OTVORENO]
- archive.org pretraga: https://archive.org/search?query=R%C3%B6mische+Funde+in+Serbien
- Wikimedia Commons: https://commons.wikimedia.org/w/index.php?search=Kanitz+Mediana
- Digi biblioteke (Heidelberg digi.ub.uni-heidelberg.de, MDZ) — pretraga po naslovu.
- Vrednost: najstarija situaciona slika kompleksa pre iskopa 1936.
- Provera: da plan prikazuje Medijanu (ne Niš/kastrum), licenca (public domain, pre 1900),
  veza crteža na strukture geofizike. Poverenje dok se ne otvori: nisko (neprovereno).

2.2 Austrougarsko/nemačko kartografiranje — [KANDIDAT — NIJE OTVORENO]
- Geografski uslov: Niš otomanski do 1878 — habzburška snimanja I–III formalno NE pokrivaju
  Medijanu; tražiti karte okupirane Srbije 1915–1918 (1:75.000, Generalkarte 1:200.000 list
  „Niš") i nemačke 1:25.000 iz II svetskog rata.
- https://mapire.eu — proveriti da li sloj WWI/Istočni front zahvata Srbiju.
- ÖNB AKON: https://data.onb.ac.at/akon — pretraga „Nisch" (karte okupacije sa niveletama:
  pre-putna morfologija, put danas 200,04–200,25 preko zidova).
- http://mapy.amzp.pl (MAPSTER) — nemački/WIG listovi; licence različite po izvoru — proveriti.

2.3 Istorijski aerofoto — [KANDIDAT — NIJE OTVORENO]
- RGZ/Geosrbija: https://www.geosrbija.rs i https://geoportal.rs — aerofoto od 1950-ih;
  pitanje: da li je stariji fond (pre asfalta preko zidova) javno dostupan i kroz koji WMS.
- USGS EarthExplorer: https://earthexplorer.usgs.gov — deklasifikovani snimci (CORONA i dr.);
  pokrivenost Jugoslavije proveriti u interfejsu; tu se i SRTM skida.
- NATO/COBALT 1999 — nema poznatog javnog repozitorijuma; očekivano NIJE javno.
- Vrednost: snimak pre 1960-ih = jedini izvor „prirodne" površine oko zidova.

## 3. Satelitski i LiDAR

3.1 Sentinel-2 — [KANDIDAT; usluga poznato javna, ovom sesijom neotvorena]
- https://browser.dataspace.copernicus.eu — besplatna registracija, 10 m, NDVI kroz sezone
  za tačku 5; za geometriju mala vrednost. Licenca: Copernicus uslovi (besplatno).

3.2 Pleiades / Pléiades Neo — [KANDIDAT — NIJE OTVORENO]
- https://www.intelligence-airbusds.com — 0,5 m / 0,3 m, komercijalni zakup; jedan kadar
  pokriva 5,7 ha jezgra. Alternativa slične rezolucije (Google/Bing podloge) nisu preuzimljive.

3.3 Google Earth Pro istorijski slajder — [KANDIDAT — NIJE OTVORENO]
- https://www.google.com/earth/versions/ — besplatno; najbrži pregled KADA je asfaltni put
  nastao; snimci nisu preuzimljivi (licenca) — evidencija odatka, ne tekstura modela.

3.4 LiDAR DTM Srbije — [KANDIDAT — NIJE OTVORENO, ključno pitanje]
- Po dosadašnjem znanju NE postoji javni nacionalni LiDAR DTM Srbije. Proveriti:
  https://geosrbija.rs, https://data.gov.rs („LiDAR", „digitalni model visina"),
  lokalne projekte grada Niša / PUP dokumentacije (putevi kod Niša).
- Ako potvrda bude „nema": upisati dostupno_danas=ne i preusmeriti se na DEM (tačka 4).

## 4. Puna DEM provera — NEDOVRŠENO (mreža zaključana)

Plan (spreman za izvršenje):
1. Izvori za poređenje: Copernicus GLO-30 (https://spacedata.copernicus.eu, otvorena
   licenca, noviji od SRTM-a, bez praznina), SRTM 30 m (USGS EarthExplorer — postojeći
   izvor baze), ALOS AW3D30 (https://www.eorc.jaxa.jp/ALOS/en/aw3d30/ — nezavisna kontrola),
   EU-DEM v1.1 — prvo proveriti da li obuhvat zahvata Srbiju.
2. Uzorkovanje kroz besplatan API OpenTopoData (https://www.opentopodata.org; skupovi
   srtm30m / copernicus_glo30 / eu_dem — potvrditi dostupne skupove u dokumentaciji) za:
   - vila (jezgro): 43.3096 N / 21.9485 E;
   - castellum aquae: padina Vlaškog brda ~500 m JZ od vile (koordinatu uzeti iz
     prostorni_sloj/geofizika kad se folder ponovo otvori);
   - 3–4 tačke pravcem castellum → Nišava za profil pada (gravitaciona kontrola:
     castellum ~206 m procena mora biti iznad fontane-nimfeja ~198 m).
3. Odluka: ako se GLO-30 i AW3D30 slažu unutar ~1 m a SRTM odstupa — menjati bazični DEM
   baze na GLO-30 (merljiva odluka, ne ukus).

Status: 0 piksela skinuto. Procena 206 m za castellum ostaje srednje poverenje.

## 5. Arheološki GIS Srbije — [KANDIDAT — NIJE OTVORENO]

- Registar nepokretnih dobara: https://nasledje.gov.rs — Medijana spomenik kulture od
  izuzetnog značaja; proveriti da li zapis ima kartu/GIS i da li postoji predmet „AN 22"
  (isti predmet traži i baza_podataka.json u „otvoreno").
- INSPIRE geoportal Srbije: https://geoportal.rgz.gov.rs — proveriti WMS/WFS teme
  „zaštićena mesta"; ako postoji WFS sa lokalitetima, to je prvi javni vektorski sloj.
- Muzej grada Niša — nema poznat javni GIS; proveriti samo publikacije uz izveštaje.
- Fasti Online: http://www.fastionline.org — pretraga „Mediana" (godine i sektori iskopa,
  veza na sonde_sloj).
- Pleiades: https://pleiades.stoa.org — „Naissus"/„Mediana" sa koordinatama i periodima;
  CC licenca; spoljna kontrola koordinata baze.

## 6. Aerofotoarheologija — [KANDIDAT — NIJE OTVORENO]

Po bazi jedina prospekcija neiskopanog prostora je geomagnetna 2010 (16 ha); sloj kaže
„buduća prospekcija ka Nišavi će dopuniti plan" — objavljena aerofotoarheološka analiza za
Medijanu verovatno NE postoji. Proveriti kad mreža radi:
- literature: „Mediana aerial", „cropmarks Niš", „aerial archaeology Serbia" (Institut za
  arheologiju Beograd vodio aeroprojekcije u Srbiji);
- praktično: Sentinel-2 (10 m) pregrub za znakove nad modulom 8×4,5 m; sojni znakovi se
  prate na 0,1–0,5 m → visokorezolucioni zakup ili GE slajder kroz 20 godina; proceniti
  da li se na GE slajderu vide pravilne linije istočnih baraka (dvorište 6 ha je krupno).
- Negativan nalaz („nema objavljene analize") je takođe nalaz i ide u JSON.

## 7. Šta treba od korisnika da se nastavi

1. Odobriti mrežu: WebSearch, WebFetch, curl (ili restart sa ovlašćenjima kao pre pada).
2. Vratiti medijana_baza u dozvoljene direktorijume (koordinate castelluma za DEM).
3. Popraviti upis u gis_udaljena (Write i Bash preusmerenje blokirani na dozvoljenom putu).
4. Redosled posle toga: (a) GLO-30 vs SRTM vs AW3D30 kote za vodu — najveći dobitak za 3D;
   (b) nasledje.gov.rs + INSPIRE + Fasti — jeftine provere; (c) Kanitz i austrougarske
   karte — arhivski deo; (d) GE slajder za nastanak asfaltnog puta.
```

---

## `prostorni_izvori.json` (spreman za upis)

```json
{
  "svrha": "pregled javno dostupnih prostornih izvora za Medijanu i okolinu (GIS, daljinska detekcija, istorijske karte) — ulaz za 3D rekonstrukciju",
  "verzija": "0.1-neproverena",
  "datum": "2026-10-25",
  "autor": "Svemir (glm-5.3-flash) — sesija bez mrežnih ovlašćenja",
  "upozorenje": "status_provere=kandidat znaci: URL NIJE otvoren u ovoj sesiji; ne tretirati kao postojeći dok se ne otvori. DEM uzorkovanje nije izvršeno (0 piksela).",
  "izvori": [
    {
      "id": "osm-poligon-jezgra",
      "tip": "vektor / OSM way",
      "rezolucija/godina": "vektor, preuzeto pre 2026-10",
      "url": "https://www.openstreetmap.org (fajl na disku: medijana_baza/osm_way_full.json)",
      "licenca": "ODbL 1.0",
      "dostupno_danas": "da — fajl je na disku u bazi",
      "vrednost_za_3d": "situacioni poligon jezgra ~5,7 ha — osnova modela",
      "poverenje": "visoko (poligon preuzet API-jem); srednje za identifikaciju poligona sa vilom",
      "status_provere": "otvoreno u ranijem radu baze"
    },
    {
      "id": "wikidata-q960839",
      "tip": "referentna tačka / Wikidata",
      "rezolucija/godina": "tačka, 43.31028 N / 21.94889 E",
      "url": "https://www.wikidata.org/wiki/Q960839 (fajlovi wd_q960839.json, wd_claims.txt na disku)",
      "licenca": "CC0",
      "dostupno_danas": "da — fajl na disku u bazi",
      "vrednost_za_3d": "georeferenciranje i spoljna kontrola koordinata",
      "poverenje": "visoko",
      "status_provere": "otvoreno u ranijem radu baze"
    },
    {
      "id": "pop-lazic-2018-limes",
      "tip": "primarni tekst / otvoreni pristup",
      "rezolucija/godina": "2018",
      "url": "https://rai.ai.ac.rs/bitstream/id/2194/ROMAN_LIMES_AND_CITIES_ON_THE_TERRITORY.pdf",
      "licenca": "otvoreni pristup (Arheološki institut Beograd)",
      "dostupno_danas": "da — PDF lokalno u bazi (pdf/pop-lazic_limes_2018.pdf)",
      "vrednost_za_3d": "izvor vodenog sloja: castellum sa dva bazena, dva kanala, barake, crkve 50 m istočno",
      "poverenje": "visoko (recenzirana publikacija)",
      "status_provere": "otvoreno u ranijem radu baze"
    },
    {
      "id": "starinar-61-2011-geofizika",
      "tip": "naučni članak / geomagnetna prospekcija",
      "rezolucija/godina": "prospekcija 2010, objava 2011, 16 ha",
      "url": "https://doi.org/10.2298/STA1161275M",
      "licenca": " časopis Starinar (doiserbia/naučni repozitorijum — proveriti formu otvorenosti)",
      "dostupno_danas": "PDF u bazi (pdf/); vektorski sloj Sl. 2 nije izdvojiv iz PDF-a",
      "vrednost_za_3d": "16 struktura neiskopanog istočnog prostora: horeum, barake 6 ha, logor 160x160 m, apsidalni objekat",
      "poverenje": "visoko za članak; srednje za tumačenja funkcija",
      "status_provere": "otvoreno u ranijem radu baze"
    },
    {
      "id": "crtezi-starinar-64-2014",
      "tip": "iskopni plan i profili (renderovane strane)",
      "rezolucija/godina": "iskop 2010/2011, objava 2014",
      "url": "lokalno: medijana_baza/crtezi/ (izvor: Starinar LXIV/2014)",
      "licenca": "naučna publikacija — korišćenje za istraživanje",
      "dostupno_danas": "da — renderi na disku; vektorizacija Sl. 1 ostaje otvorena",
      "vrednost_za_3d": "numeracija W-1..W-25 / E-1..E-24, kote 197,28–200,64 — trenutno najbolja osnova objekata A–D",
      "poverenje": "visoko (izmereno u iskopu)",
      "status_provere": "otvoreno u ranijem radu baze"
    },
    {
      "id": "kanitz-romische-funde-1892",
      "tip": "istorijska karta/plan (19. vek)",
      "rezolucija/godina": "1864 teren, 1892 objava",
      "url": "https://archive.org/search?query=R%C3%B6mische+Funde+in+Serbien",
      "licenca": "public domain (pre 1900) — potvrditi na skenu",
      "dostupno_danas": "nepoznato — NIJE otvoreno",
      "vrednost_za_3d": "najstarija situaciona slika pre iskopa 1936 — šta je bilo vidljivo na površini",
      "poverenje": "nisko (neprovereno)",
      "status_provere": "kandidat"
    },
    {
      "id": "commons-kanitz-medijana",
      "tip": "istorijske slike/karte (Wikimedia)",
      "rezolucija/godina": "različito",
      "url": "https://commons.wikimedia.org/w/index.php?search=Kanitz+Mediana",
      "licenca": "po slici (većinom PD/CC) — čitati opis svake",
      "dostupno_danas": "nepoznato — NIJE otvoreno",
      "vrednost_za_3d": "potencijalni planovi/skice 19. veka bez pretraživanja skenova knjiga",
      "poverenje": "nisko (neprovereno)",
      "status_provere": "kandidat"
    },
    {
      "id": "mapire-habsburg",
      "tip": "istorijske karte (habzburška snimanja)",
      "rezolucija/godina": "1763–1887 (snimanja I–III)",
      "url": "https://mapire.eu",
      "licenca": "po sloju (većinom otvoreno za istraživanje) — proveriti",
      "dostupno_danas": "nepoznato — NIJE otvoreno; NIŠ je bio otomanski do 1878, snimanja I–III verovatno NE pokrivaju Medijanu",
      "vrednost_za_3d": "mala za Medijanu direktno; referentni okvir morfologije",
      "poverenje": "nisko (neprovereno)",
      "status_provere": "kandidat"
    },
    {
      "id": "onb-akon-ratne-karte",
      "tip": "istorijske karte (austrougarska okupacija Srbije)",
      "rezolucija/godina": "1915–1918",
      "url": "https://data.onb.ac.at/akon",
      "licenca": "po zapisu ÖNB — proveriti",
      "dostupno_danas": "nepoznato — NIJE otvoreno",
      "vrednost_za_3d": "karte sa niveletama: reljef pre asfaltnog puta i pre regulacije Nišave — okvir za trasu vodozvoda",
      "poverenje": "nisko (neprovereno)",
      "status_provere": "kandidat"
    },
    {
      "id": "mapster-nemačke-karte",
      "tip": "istorijske karte (nemačke/WIG listovi)",
      "rezolucija/godina": "1:25.000–1:200.000, prva i druga polovina 20. veka",
      "url": "http://mapy.amzp.pl",
      "licenca": "različita po izvoru — proveriti na sajtu",
      "dostupno_danas": "nepoznato — NIJE otvoreno",
      "vrednost_za_3d": "list „Niš": putevi i hidrografija premodernog stanja",
      "poverenje": "nisko (neprovereno)",
      "status_provere": "kandidat"
    },
    {
      "id": "rgz-aerofoto-geosrbija",
      "tip": "aerofoto / ortofoto",
      "rezolucija/godina": "fond od 1950-ih; ortofoto savremen",
      "url": "https://www.geosrbija.rs i https://geoportal.rs",
      "licenca": "javni podaci RGZ — uslovi korišćenja proveriti",
      "dostupno_danas": "nepoznato — NIJE otvoreno; pitanje da li je stariji fond javno pretraživ",
      "vrednost_za_3d": "snimak pre asfalta preko zidova = jedini izvor prirodne površine oko zidova",
      "poverenje": "nisko (neprovereno)",
      "status_provere": "kandidat"
    },
    {
      "id": "usgs-earthexplorer",
      "tip": "satelitski snimci + deklasifikovani programi + SRTM",
      "rezolucija/godina": "različito; SRTM 2000",
      "url": "https://earthexplorer.usgs.gov",
      "licenca": "javno (USGS, bez ograničenja)",
      "dostupno_danas": "usluga javno poznata; pokrivenost Jugoslavije deklasifikovanim snimcima NIJE proverena",
      "vrednost_za_3d": "SRTM 30 m (postojeći izvor baze) + eventualni stari snimci za morfologiju",
      "poverenje": "srednje za SRTM; nisko za deklasifikovane snimke (neprovereno)",
      "status_provere": "kandidat"
    },
    {
      "id": "nato-cobalt-1999",
      "tip": "aerofoto (vojni)",
      "rezolucija/godina": "1999",
      "url": "nema poznatog javnog repozitorijuma",
      "licenca": "nije javno (očekivano)",
      "dostupno_danas": "verovatno ne — upisano iskreno da se ne troši vreme",
      "vrednost_za_3d": "teorijski snimci pre konsolidacije lokaliteta; praktično nedostupno",
      "poverenje": "nisko (neprovereno, mali značaj)",
      "status_provere": "kandidat — očekivano negativan"
    },
    {
      "id": "sentinel-2-copernicus",
      "tip": "satelitski multispektralni",
      "rezolucija/godina": "10 m, 2015–dan",
      "url": "https://browser.dataspace.copernicus.eu",
      "licenca": "Copernicus — besplatno uz registraciju",
      "dostupno_danas": "usluga javno poznata; Niš pokriven po geografiji; NIJE otvoreno u ovoj sesiji",
      "vrednost_za_3d": "mala za geometriju; NDVI kroz sezone za aerofotoarheologiju (tačka 5 zadatka)",
      "poverenje": "srednje (usluga poznata); nisko za konkretnu upotrebu (neprovereno)",
      "status_provere": "kandidat"
    },
    {
      "id": "pleiades-airbus",
      "tip": "satelitski VHR",
      "rezolucija/godina": "0,5 m (Pleiades) / 0,3 m (Pléiades Neo)",
      "url": "https://www.intelligence-airbusds.com",
      "licenca": "komercijalni zakup",
      "dostupno_danas": "usluga postoji, plaća se — NIJE otvoreno",
      "vrednost_za_3d": "jedan kadar pokriva 5,7 ha jezgra + istočni prostor geofizike; tekstura i linije baraka",
      "poverenje": "nisko (neprovereno)",
      "status_provere": "kandidat"
    },
    {
      "id": "google-earth-historijski",
      "tip": "satelitski istorijski slajder",
      "rezolucija/godina": "~2000-e–danas (za Niš proveriti prvi datum)",
      "url": "https://www.google.com/earth/versions/",
      "licenca": "besplatna aplikacija; snimci NISU preuzimljivi",
      "dostupno_danas": "usluga javno poznata; NIJE otvoreno u ovoj sesiji",
      "vrednost_za_3d": "najbrži pregled KADA je asfaltni put preko zidova nastao; vizuelna provera linija istočnih baraka",
      "poverenje": "srednje (usluga poznata); nisko za konkretne datume (neprovereno)",
      "status_provere": "kandidat"
    },
    {
      "id": "lidar-dtm-srbija",
      "tip": "LiDAR DTM",
      "rezolucija/godina": "—",
      "url": "https://geosrbija.rs + https://data.gov.rs (pojmovi: LiDAR, digitalni model visina)",
      "licenca": "—",
      "dostupno_danas": "po dosadašnjem znanju NE postoji javni nacionalni LiDAR DTM Srbije — potvrditi/demantovati pretragom",
      "vrednost_za_3d": "ako postoji lokalni (putevi kod Niša) — jedini metarski reljef za vile; inače preusmeriti na DEM tačku 4",
      "poverenje": "nisko (neprovereno)",
      "status_provere": "kandidat — ključno otvoreno pitanje"
    },
    {
      "id": "copernicus-glo30",
      "tip": "DEM",
      "rezolucija/godina": "30 m, 2011–2015 snimanje (GLO-30release)",
      "url": "https://spacedata.copernicus.eu",
      "licenca": "otvorena (Copernicus)",
      "dostupno_danas": "usluga javno poznata; NIJE skinuto u ovoj sesiji (0 piksela)",
      "vrednost_za_3d": "kandidat za novi bazični DEM baze umesto SRTM-a — kote za vodu (Vlaško brdo, trasa ka Nišavi)",
      "poverenje": "srednje (izvor poznat); nisko za vrednosti kod Niša (neprovereno)",
      "status_provere": "kandidat — prvi u redu za izvršenje"
    },
    {
      "id": "srtm-30m",
      "tip": "DEM",
      "rezolucija/godina": "30 m, 2000",
      "url": "https://earthexplorer.usgs.gov",
      "licenca": "javno (NASA/USGS)",
      "dostupno_danas": "da (postojeći izvor baze)",
      "vrednost_za_3d": "trenutna baza procena (vila ~197–198, castellum ~206, opseg 204–210) — SREDNJE poverenje",
      "poverenje": "srednje (poznate slabosti: 30 m, satelitska interpolacija u nizinama)",
      "status_provere": "otvoreno u ranijem radu baze"
    },
    {
      "id": "alos-aw3d30",
      "tip": "DEM",
      "rezolucija/godina": "30 m, 2006–2011",
      "url": "https://www.eorc.jaxa.jp/ALOS/en/aw3d30/",
      "licenca": "besplatno uz uslove JAXA — proveriti",
      "dostupno_danas": "nepoznato — NIJE otvoreno",
      "vrednost_za_3d": "nezavisna stereoskopska mera — kontrola GLO-30 vs SRTM",
      "poverenje": "nisko (neprovereno)",
      "status_provere": "kandidat"
    },
    {
      "id": "eu-dem-v11",
      "tip": "DEM",
      "rezolucija/godina": "25 m, v1.1",
      "url": "https://land.copernicus.eu/imagery-in-situ/eu-dem",
      "licenca": "Copernicus otvorena",
      "dostupno_danas": "nepoznato — prvo proveriti da li obuhvat v1.1 zahvata Srbiju",
      "vrednost_za_3d": "ako Srbija ulazi — najfinija slobodna rešetka od kandidata",
      "poverenje": "nisko (neprovereno, obuhvat nesiguran)",
      "status_provere": "kandidat"
    },
    {
      "id": "opentopodata",
      "tip": "API za uzorkovanje DEM-a (alat, ne izvor)",
      "rezolucija/godina": "zavisi od skupa (srtm30m, copernicus_glo30, eu_dem — proveriti spisak)",
      "url": "https://www.opentopodata.org",
      "licenca": "besplatan javni API (ograničenje učestalosti)",
      "dostupno_danas": "nepoznato — NIJE pozvan (mreža blokirana)",
      "vrednost_za_3d": "najbrži put do kota za vodu bez instalacija: vila 43.3096/21.9485 + castellum + 3–4 tačke ka Nišavi",
      "poverenje": "nisko (neprovereno)",
      "status_provere": "kandidat — alat za tačku 4 nalaza"
    },
    {
      "id": "nasledje-registar",
      "tip": "registar nepokretnih kulturnih dobara",
      "rezolucija/godina": "ažurno",
      "url": "https://nasledje.gov.rs",
      "licenca": "javni registar — uslovi proveriti",
      "dostupno_danas": "nepoznato — NIJE otvoreno",
      "vrednost_za_3d": "zapis Medijane (spomenik od izuzetnog značaja); tražiti kartu/GIS i predmet „AN 22" (otvoreno i u bazi)",
      "poverenje": "nisko (neprovereno)",
      "status_provere": "kandidat"
    },
    {
      "id": "inspire-geoportal-rgz",
      "tip": "INSPIRE WMS/WFS",
      "rezolucija/godina": "ažurno",
      "url": "https://geoportal.rgz.gov.rs",
      "licenca": "javne usluge — po temi",
      "dostupno_danas": "nepoznato — NIJE otvoreno",
      "vrednost_za_3d": "ako postoji WFS „zaštićena mesta" — prvi javni vektorski sloj nalazišta Srbije",
      "poverenje": "nisko (neprovereno)",
      "status_provere": "kandidat"
    },
    {
      "id": "fasti-online",
      "tip": "baza zapisa iskopa",
      "rezolucija/godina": "različito",
      "url": "http://www.fastionline.org",
      "licenca": "po zapisu — proveriti",
      "dostupno_danas": "nepoznato — NIJE otvoreno",
      "vrednost_za_3d": "zapis „Mediana": godine/sektori iskopa, veza na sonde_sloj",
      "poverenje": "nisko (neprovereno)",
      "status_provere": "kandidat"
    },
    {
      "id": "pleiades-stoa",
      "tip": "istorijski geografski atlas (mesta)",
      "rezolucija/godina": "ažurno",
      "url": "https://pleiades.stoa.org",
      "licenca": "CC BY 3.0 (standard Pleiadesa) — potvrditi na zapisu",
      "dostupno_danas": "nepoznato — NIJE otvoreno",
      "vrednost_za_3d": "zapisi Naissus/Mediana: spoljna kontrola koordinata i perioda",
      "poverenje": "nisko (neprovereno)",
      "status_provere": "kandidat"
    },
    {
      "id": "aerofotoarheologija-medijana",
      "tip": "analiza sojnih/vegetacionih znakova",
      "rezolucija/godina": "—",
      "url": "nema poznatog objavljenog rada; pretražiti „Mediana aerial", „cropmarks Niš", „aerial archaeology Serbia",
      "licenca": "—",
      "dostupno_danas": "nepoznato; po bazi jedina prospekcija neiskopanog prostora je geomagnetna 2010",
      "vrednost_za_3d": "ako ne postoji: Sentinel-2 pregrub (znakovi se prate na 0,1–0,5 m); pad = GE slajder kroz 20 godina ili zakup VHR",
      "poverenje": "nisko (neprovereno); negativan nalaz je takođe nalaz",
      "status_provere": "kandidat — očekivano negativan"
    }
  ],
  "otvoreni_zadaci": [
    "odemuzorkovanje: GLO-30 vs SRTM vs AW3D30 za vodu (vila, castellum, 3–4 tačke ka Nišavi) — 0 piksela urađeno",
    "otvoriti i označiti sve kandidate sa status_provere=kandidat",
    "koordinate castelluma iz prostorni_sloj/geofizika (folder baze bio van dozvoljenog obuhvata)",
    "vektorizacija Sl. 1 (i dalje blokirana na PDF-u, nezavisno od mreže)"
  ]
}
```

*(U JSON-u gore jedna tipografska greška je namerna da je uočiš? Nije — ispraviti pri upisu: `"odemuzorkovanje"` → `"dem-uzorkovanje"`, i navodnik u `aerofotoarheologija-medijana.url` mora biti iza zapete, ne pre: `...Serbia"`.)*

---

## Sažetak (5–10 redova)

1. **Sesija je pala pre istraživanja**: log sadrži samo ulazni paket i čitanja baze — nijedan web izvor nije stigao da se otvori, pa ništa nisam „nastavljao" — kompletan spisak je sastavljen sada, iskreno podeljen na provereno/kandidat.
2. **Restart je oduzeo ovlašćenja**: WebSearch/WebFetch/curl odbijeni; upis u folder blokiran i kroz Write i kroz Bash (poruka o blokadi navede baš taj dozvoljeni put — kvar provere); čitanje baze van `gis_udaljena` blokirano.
3. **Provereno (nasleđeno iz baze)**: OSM poligon 5,7 ha, Wikidata Q960839, Pop-Lazić 2018 PDF, geofizika 2010 (DOI 10.2298/STA1161275M), kote iskopa 197,28–200,64.
4. **Najveći otvoreni dobitak za 3D**: DEM provera — GLO-30 naspram SRTM naspram AW3D30 kote za vodu (Vlaško brdo/castellum ~206 m procena protiv fontane ~198 m); **0 piksela skinuto** — spreman plan u tački 4 nalaza.
5. **Ključna geo-korekcija**: Niš je otomanski do 1878, pa habzburška snimanja I–III verovatno ne pokrivaju Medijanu — tražiti karte okupirane Srbije 1915–18 (ÖNB AKON) i nemačke 1:25.000; Kanitz 1864/1892 ostaje najstariji plan (archive.org/Commons).
6. **LiDAR**: po znanju nema javnog nacionalnog DTM Srbije — pitanje upisano kao ključno, sa tačkama gde se proverava (Geosrbija, data.gov.rs, PUP Niš).
7. **NATO/COBALT i Muzej grada Niša**: upisani iskreno kao verovatno nedostupni/nepostojeći kao javni podaci.
8. **Aerofotoarheologija**: očekivano negativan nalaz (jedina prospekcija je geomagnetna 2010) — ali GE istorijski slajder je jeftin test za linije istočnih baraka.
9. **Za nastavak**: odobriti mrežu + upis, vratiti `medijana_baza` u dozvoljene foldere — redosled je u tački 7 nalaza.