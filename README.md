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
| `SINTEZA.md` | ljudski pregled i spisak otvorenih konflikata |
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

## Stanje (v0.14)

- Validator: 0 grešaka / 0 upozorenja.
- **19 3D stubova**; apsolutne kote imaju stibadium B (198,32–198,92 m n.m.v.), zgrade oko stibadiuma B i **21 prostorija** sa sonde-po-sonde vertikalom (od v0.14 uključuje i w-4 sa porfirnim skulpturama).
- **Mozaici katalogizovani** (`mozaici_sloj.json`, v0.14): 25 unosa sa površinama i vezama na stubove/prostorije; zbir 780,9 m² saglasan sa 'oko 1.000 m²' monografije — konflikt 945 vs 1000 rešen; figuralni program imenovan (Leda sa labudom, rečni bog na podijumu, Meduza u sredini aule).
- **Numeracija prostorija W-1..W-25 / E-1..E-24** sa Sl. 1 povezana sa sondama i nalazima (`sobe_sloj.json`); rusenje vile 378 vezano na zatvorene celine novca u tremu, w-9, w-10, w-21.
- Opseg kota za 3D: **197,28–200,64** m n.m.v.; najniža kota baze 195,96 (kasnosrednjovekovni bunar, van modela).
- Otvoreno: dekodirane površine (47, 68) za proveru u štampanom izdanju; Vicennalia vs Tricennalia; izvor vode (Oblik vs Niška Banja); osnova objekata C–D; zapis AN 22 (nasledje.gov.rs); vektori Sl. 1 za GIS uvoz.

## Autorstvo

Istraživanje i obrada: **Svemir** (sistem dr Poturak Semira). Svi izvori povezani na mestu tvrdnje;
slike su tuđa dela pod CC licencama sa zabeleženim autorima.
