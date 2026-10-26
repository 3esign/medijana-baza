# Medijana — baza podataka za 3D rekonstrukciju

Baza znanja o **Medijani** (Naissus / Niš, rezidencija Konstantina Velikog), građena talasima:
svaka tvrdnja nosi **izvor, nivo poverenja i konflikte** — ništa se ne glatka pod tepih.
Cilj: iz dostupnih podataka rekonstruisati što precizniji 3D model i **digitalni pasoš** vile —
materijali, uticaji, graditelji, alati, voda, dekor — tako da se objekat može izgraditi iz teksta.

## Struktura

| Fajl | Sadržaj |
|---|---|
| `baza_podataka.json` | hronologija 269–8. vek, objekti, nalazi, genetika — jezgro baze (v0.10) |
| `prostorni_sloj.json` | 19 objekata kao 3D stubovi: `poverenje_osnove` visoko, `poverenje_visina` samo gde postoji dokaz |
| `vodeni_linijski_sloj.json` | castellum aquae → vodovod → nimfej: mreža čvorova + pravila gravitacione konzistentnosti |
| `komparativni_lokaliteti.json` | kalibracija: Felix Romuliana, Villa del Casale — pravila pozajmljivanja proporcija |
| `digitalni_pasos.json` | vila znanja: materijali, uticaji, graditelji/alati; merilo ka teoretskom idealu rekonstrukcije |
| `vizuelni_sloj.json` | 45 strukturno vrednih slika sa Wikimedia Commonsa (URL, licenca, datum) |
| `vizuelni_nalazi.json` | pregled slika po slici: šta potvrđuje, šta opovrgava, šta ne sme da se koristi |
| `skulpturski_program.json` | program skulptura, mozaika i fresaka po lokaciji (forum Naisusa / ulaz / vila) — v0.10 |
| `sonde_sloj.json` | sonde iskopa 2010/2011 ⇄ stubovi, stratigrafija A–D sa kotama, tri horizonta |
| `crtezi_sloj.json` | situacioni plan Sl. 1 (numeracija W/E) + profili sa kotama, očitano sa renderovanih crteža — v0.12 |
| `sobe_sloj.json` | soba-po-soba sloj: svaka prostorija sa sondama, zidovima, kotama i nalazima — jedinica 3D modela — v0.13 |
| `mozaici_sloj.json` | katalog mozaika iz monografije: 25 unosa sa povrsinama, tehnikama i vezom na stubove/prostorije; figuralni program (Leda, rečni bog, Meduza) — v0.14 |
| `geofizika_sloj.json` | strukture 1–16 iz geomagnetne prospekcije 2010 (16 ha istočno od vile): mere, interpretacije, veze na stubove — prvi sloj neiskopanog prostora — v0.15 |
| `hidraulika_sloj.json` | vodeni sistem po Jeremiću 1988 (Starinar XXXIX): 28 čvorova sa kotama (bazeni A/B, kanali C/D/E/F, ustave, cevi), računica protoka i pritiska, 6 konflikata — v0.16 |
| `numizmaticki_sloj.json` | 22 novčana nalaza po sondama/slojevima/kotama (Starinar LXIV/2014): vertikalna kontrola horizonta 1–3, najmlađi datum 425–450 — v0.16 |
| `objekti_cd_sloj.json` | status slovnog sistema A–D (negativni nalaz + ključevi), 13 skupina mera za 3D, konflikti površina — v0.16 |
| `gis_izvori_sloj.json` | prostorni izvori (GIS, DEM, istorijske karte, aerofoto): 27 izvora sa oštro razdvojenim [PROVERENO] vs kandidat statusom — v0.16 |
| `SINTEZA.md` | ljudski pregled i spisak otvorenih konflikata |
| `dem_izvorista_v021.json` | korekcija korekcije: kote sidrene na OSM/Nominatim pozicije (vila 198,2 m — obe prethodne kote bile uzorkovane ~2,5 km van poligona); profil vrelo Banja→vila 5,09 km, pad 1,09% — v0.21 |
| `validator.js` | provera celog paketa: `node validator.js` — verzije, izvori, koordinate, poverenja, voda, sobe |
| `slike/` | 8 ključnih kadrova (nimfej I–VII, vila oktogonalnog oblika), CC BY / CC BY-SA, atribucija u `vizuelni_sloj.json` |
| `crtezi/` | renderovane strane Starinara 64/2014 sa crtežima (Sl. 1–31) — izvor za `crtezi_sloj.json` |

## Šta je lokalno, a nije u repozi

`pdf/` — preuzeti PDF-ovi i izvučeni puni tekstovi tuđih radova (Starinar, Pop-Lazić, Gavrilović-Vitas i dr.)
ostaju na disku lokalno: objavljivanje celih radova nije naše, a njihovi **stabilni URL-ovi su već zabeleženi
u samoj bazi**, pa je sloj reproduktivan.

## Jezik i terminologija

Srpski, **latinica**. Strukovno: **osnova** (pojedinačni objekat, parter), **situacioni plan**
(celi kompleks), **presek** (vertikalni rez). Zvanične oznake iz izvora transliterovane
(АН 22 → AN 22); sirovi izlazi API-ja i izvorni tekst čuvaju se netaknuti kao dokaz.

## Stanje (v0.16)

- Validator: 0 grešaka / 0 upozorenja (proširen proverama za hidrauliku, numizmatiku, objekte C–D, GIS izvore i komparativni korpus).
- **v0.16 — integracija nalaza GLM roja:** četiri nova sloja (hidraulika, numizmatika, objekti C–D, GIS izvori) + komparativni korpus na 13 lokaliteta sa tipologijom aule i visinskim sidrima.
- **Vodeni sistem rešen u smeru** (Jeremić 1988, Starinar XXXIX): vodovod Medijane NIJE ogranak vodovoda Naissusa — dovodni kanal prilazi sa istoka, izvorište u pravcu Niške Banje (~4,5 km, trasa neiskopana); pad linije 8,87 m na ~500 m ≈ 1,8% (ne 2% po terenu); kastelum posle iskopavanja premešten — sve kote su originalne pozicije 1988. "Oblik" ostaje bez primarnog izvora (konflikt rešen u korist Niške Banje, tačna kaptaza otvorena).
- **Numizmatička hronologija** (22 nalaza, 271–450): horizont 1 pre 330 (Krisp), horizont 2 330–378 (celine w-9/w-10/w-21/trem), horizont 3 posle 383 do 441/443 (Teodosije, Arkadije/Honorije, skrivnica 425–450); rušenje preporučeno upisivati kao "posle 375, najverovatnije 376–382 (istorijski: 378)".
- **Objekti C–D:** slovni sistem A–D za objekte van vile NEREŠEN iz otvorenih izvora (negativni nalaz; ključevi: Zbornik NMN 9/10, monografija 2016, Naissus 1/2008); 13 skupina mera upisano (aula 19,6×12 m sa apsidom 5,2 m — Jeremić 2017; vila 98,6×63,0 m — Jeremić 2006).
- **GIS izvori:** 27 izvora sa statusom [PROVERENO] vs kandidat (21 kandidat — ne tretirati kao postojeće dok se ne otvore); dem-uzorkovanje GLO-30/SRTM/AW3D30 ostaje 0 piksela (prvi u redu).
- 19 3D stubova + 21 prostorija + 16 geofizičkih struktura (v0.15); opseg kota za 3D: 197,28–200,64 m n.m.v.; najniža kota baze 195,96 (kasnosrednjovekovni bunar, van modela).
- Otvoreno: tačna kaptaza i trasa akvadukta; danasnja pozicija premeštenog kasteluma; Vicennalia vs Tricennalia (rešenje u katalogu Janković-Mihaldžić 2008); osnova objekata C–D (fizičke kopije); zapis AN 22 (nasledje.gov.rs); vektori Sl. 1 za GIS uvoz; epigrafika roja još u radu (njen sloj nije u ovom talasu).

## Autorstvo

Istraživanje i obrada: **Svemir** (sistem dr Poturak Semira). Svi izvori povezani na mestu tvrdnje;
slike su tuđa dela pod CC licencama sa zabeleženim autorima.
