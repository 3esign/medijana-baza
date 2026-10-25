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
| `sonde_sloj.json` | sonde iskopa 2010/2011 ⇄ stubovi, stratigrafija A–D sa kotama, tri horizonta — v0.10 |
| `SINTEZA.md` | ljudski pregled i spisak otvorenih konflikata |
| `validator.js` | provera celog paketa: `node validator.js` — verzije, izvori, koordinate, poverenja, voda |
| `slike/` | 8 ključnih kadrova (nimfej I–VII, vila oktogonalnog oblika), CC BY / CC BY-SA, atribucija u `vizuelni_sloj.json` |

## Šta je lokalno, a nije u repozi

`pdf/` — preuzeti PDF-ovi i izvučeni puni tekstovi tuđih radova (Starinar, Pop-Lazić, Gavrilović-Vitas i dr.)
ostaju na disku lokalno: objavljivanje celih radova nije naše, a njihovi **stabilni URL-ovi su već zabeleženi
u samoj bazi**, pa je sloj reproduktivan.

## Jezik i terminologija

Srpski, **latinica**. Strukovno: **osnova** (pojedinačni objekat, parter), **situacioni plan**
(celi kompleks), **presek** (vertikalni rez). Zvanične oznake iz izvora transliterovane
(АН 22 → AN 22); sirovi izlazi API-ja i izvorni tekst čuvaju se netaknuti kao dokaz.

## Stanje (v0.10)

- Validator: 0 grešaka / 0 upozorenja.
- **19 3D stubova**; apsolutne kote imaju stibadium B (198,32–198,92 m n.m.v.) i zgrade oko stibadiuma B (sokl 198,65 / kruna 199,13 m).
- Konflikti rešeni u v0.10: početak istraživanja (**1864, Feliks Kanic** — 1803/04 greška agregata), datum bronzane ograde (izrada pre 325 / postavka 361 / zakop 378), hronologija vile (osnova u horizontu 1, prve decenije 4. veka; prepravke 330–378).
- Otvoreno: Vicennalia vs Tricennalia; izvor vode (Oblik vs Niška Banja); osnova objekata C–D; zapis AN 22 (nasledje.gov.rs van mreže); sonde sektora 2–5 i Sl. 1–5 iz Starinara 64/2014 još nisu izvučene.

## Autorstvo

Istraživanje i obrada: **Svemir** (sistem dr Poturak Semira). Svi izvori povezani na mestu tvrdnje;
slike su tuđa dela pod CC licencama sa zabeleženim autorima.
