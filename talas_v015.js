#!/usr/bin/env node
// Talas v0.15 — geofizicki sloj (16 struktura, Milošević/Peters/Wendling, Starinar 61/2011)
// + Zotović–Petrović 1969 (Arheološki pregled 11) primarni izveštaj o palati.
// Pokretanje: node talas_v015.js  (iz ovog foldera), pa node validator.js
const fs = require('fs');
const path = require('path');
const citaj = f => JSON.parse(fs.readFileSync(path.join(__dirname, f), 'utf8'));
const pisi = (f, o) => fs.writeFileSync(path.join(__dirname, f), JSON.stringify(o, null, 2) + '\n', 'utf8');
const poruka = [];

const VER = '0.15';
const DATUM = '2026-10-25';
const GEOF_IZVOR = 'geofizika-2011 (Milosevic G., Peters, Wendling, Geophysical Survey at Late Roman Mediana, Starinar LXI/2011, 275-284, DOI 10.2298/STA1161275M)';
const AP11_IZVOR = 'ap11-zotovic-1969 (Lj. Zotović i N. Petrović, Medijana, Brzi Brod, Niš — antička carska palata, Arheološki pregled 11, Beograd 1969, 185-186)';

// --- verzije uskladjene na 0.15 ---
const verzijaFajlovi = [
  'baza_podataka.json', 'prostorni_sloj.json', 'vodeni_linijski_sloj.json',
  'komparativni_lokaliteti.json', 'digitalni_pasos.json', 'vizuelni_sloj.json',
  'vizuelni_nalazi.json', 'skulpturski_program.json', 'sonde_sloj.json',
  'crtezi_sloj.json', 'sobe_sloj.json', 'mozaici_sloj.json'
];
for (const f of verzijaFajlovi) {
  const o = citaj(f);
  const staro = o.verzija || o.version;
  if (o.version) o.version = VER; else o.verzija = VER;
  if (o.datum) o.datum = DATUM;
  pisi(f, o);
  poruka.push(`verzija ${f}: ${staro} -> ${VER}`);
}

// --- 1. novi sloj: geofizika_sloj.json ---
// Sve strukture iz geomagnetne prospekcije april 2010 (16 ha, istočno od vile).
// Poverenje osnove: srednje — geomagnetna anomalija, ne iskop; dimenzije su procene iz mape anomalija.
const geofizika = {
  svrha: 'struktura 1-16 detektovane geomagnetnom prospekcijom (RGK DAI + Arheološki institut + Univerzitet u Beogradu, april 2010, preko 16 ha, uglavnom istočno od vile sa peristilom); prvi celovit situacioni sloj istočnog dela Medijane; osnova za prostor van iskopanih zona',
  verzija: VER,
  datum: DATUM,
  autor: 'Svemir (dr Poturak Semir)',
  izvor_glavni: GEOF_IZVOR,
  pravila_poverenja: [
    'geomagnetna anomalija ≠ osnova objekta: unutrašnja struktura vidljiva samo kod jakih anomalija; dimenzije su procene sa mape, ne merenje na terenu',
    'funkcija (vila / kupatilo / baraka / logor) je uvek interpretacija autora istraživanja, označena kao takva',
    'struktura bez iskopane paralele (npr. 16-objekat) ne sme nasleđivati funkciju analogije (crkva) bez iskopa'
  ],
  faze_lokaliteta: {
    izvor: GEOF_IZVOR + ' (potvrđeno iskopima Arheološkog instituta)',
    faza_1: 'instalacije podignute direktno na praistorijskom supstratu, moguće ~317, uništene tokom 330-ih',
    faza_2: 'glavni period — masa monumentalnih zgrada, uništen u gotskim upadima 378',
    faza_3: 'malo ruralno naselje unutar ranijih zgrada, sa malom apsidalnom crkvom i nekropolom',
    napomena: 'faze se poklapaju sa horizonata 1-3 iz sonde_sloj (nezavisna potvrda geofizika vs stratigrafija)'
  },
  strukture: [
    {
      id: 'geof-01',
      naziv: 'Istočni horeum',
      polozaj: '~180 m istočno od peristila',
      dimenzije_m: { sirina_zapadna_fronta: 27 },
      opis: 'osnova identična zapadnom horeumu: pravougaono dvorište podeljeno uzdužno u tri broda sa dva reda stubova/stubova-pilona; negativne anomalije uz severni i južni zid = ležišta dolia/pithosa; jaki amplitudi na zapadnom kraju = rezervoari za tečnost (ulje/vino) sa masivnim temeljima kao u zapadnom horeumu; trem sa malim stubovima duž centralnog dela južne fronte; niz kvadratnih soba zapadno od trema; ulaz u sredini zapadne fronte; dva pilona uz ulaz — možda nosači posvetnih natpisa ili oltara',
      interpretacija: 'žitnica/ložionica analogna zapadnom horeumu (Petrović 1994, 91-96)',
      vezan_stub: 'horreum',
      poverenje_osnove: 'srednje (geomagnetna anomalija, unutrašnja struktura jasna)',
      poverenje_visine: 'nisko (bez iskopa)',
      za_3d: 'drugi horeum u paru sa zapadnim — potvrda da je reč o planskom privrednom krilu sa obe strane kompleksa'
    },
    {
      id: 'geof-02',
      naziv: 'Gradska vila (urbanog tipa)',
      polozaj: '~60 m južno od istočnog horeuma',
      dimenzije_m: { sirina: 16, duzina: 45 },
      opis: 'zapadni deo slabo vidljiv (drvena podloga na vodoravnim gredama ili opljačkani temeljni rovovi); duž zapadne fronte male pravougaone i kvadratne prostorije (fauces); kvadratna prostorija ~15 m sa centralnim kvadratom 5-6 m (atrijum?); preko poprečnog reda malih odaja otvoreno dvorište ~20 m (peristil u zadnjem delu); istočni deo prekriven sipinom građevinskog materijala — kamen',
      interpretacija: 'tipična gradska rimska vila: fauces + atrijum + tablinium/triclinium + zadnji peristil; hipotetski domus za podređene članove carske administracije ili vojske (npr. Aurelius Ampelius, tribunus Batavorum — Mirković 1982)',
      analogija: 'vila iskopana 1975 ispod modernog puta ka Niškoj Banji (istocna orijentacija, konhe, peristil ~12 m) — vila-konhe u bazi',
      vezan_stub: 'vila-konhe',
      poverenje_osnove: 'srednje',
      poverenje_visine: 'nisko',
      za_3d: 'jedina struktura sa unutrašnjom organizacijom " gradske kuće" — kalibracija za domus sloj'
    },
    {
      id: 'geof-03',
      naziv: 'Dve kamene osnove istočno',
      polozaj: 'istočno od geof-02, delimično van obuhvata prospekcije',
      dimenzije_m: null,
      opis: 'ostaci najmanje dve kamene osnove, delom izvan snimljenog područja',
      interpretacija: 'nepoznato',
      vezan_stub: null,
      poverenje_osnove: 'nisko',
      poverenje_visine: 'nisko',
      za_3d: 'samo marker " ovde nešto ima" — bez oblika'
    },
    {
      id: 'geof-04',
      naziv: 'Istočne barake sa portikom',
      polozaj: 'severno i istočno od istočnog horeuma, ukupna dužina ~400 m',
      dimenzije_m: { ukupna_duzina_niza: 400, prostija: [8, 4.5] },
      opis: 'uski izduženi objekti uz severnu i istočnu stranu prostora sa horeumom u sredini; unutrašnja podela na prostorije ~8×4,5 m; portikom duž unutrašnjeg dvorišta (verovatno čitavim obimom) koji ograđuje dvorište od ~6 ha; pukotina od 5 m sredinom severnog niza = ulaz; severni niz odgovara formi i veličini severozapadnog niza; južni masivniji objekt pomerен ~6 m zapadnije, podeljen unutra na više delova, trem duž cele istočne fasade — možda prva faza objekta poravnatog sa severnim barakama, kasnije uklonjenog i zamenjenog; mali linearni objekti (zidovi, odvodi, jarkovi, možda vodovodne cevi) vire sa severnog kraja',
      interpretacija: 'barake za lokalno poslugu, stražu i podređene članove carskog dvora, ili kancelarije i servisne prostorije vezane za žitnicu (paralela: barake zapadno od peristila iskopane 1994)',
      vezan_stub: 'barake-istocne',
      poverenje_osnove: 'srednje (geofizika) + potvrda formata iz zapadnih baraka (iskop)',
      poverenje_visine: 'nisko',
      za_3d: 'dvorište 6 ha sa portikom — najveći pojedinačni prostor kompleksa; prostorija 8×4,5 m = modul'
    },
    {
      id: 'geof-05',
      naziv: 'Malo apsidalno kupatilo',
      polozaj: 'neposredno uz severni niz baraka',
      dimenzije_m: { osnovna_kvadratna_sekcija: [8, 8], apsida_istupa: '5-6 m' },
      opis: 'apsida ističe 5-6 m sa zapadne fasade kvadratnog glavnog dela 8×8 m, u jugozapadnom uglu objekta',
      interpretacija: 'oprezno — malo kupatilo',
      vezan_stub: null,
      poverenje_osnove: 'srednje',
      poverenje_visine: 'nisko',
      za_3d: 'apsida-na-kvadratu modul; ako kupatilo — natkriveno, sa hipokaustom'
    },
    {
      id: 'geof-06',
      naziv: 'Kuća 6',
      polozaj: 'istočno od ograđenog prostora, uz dve moderne vodovodne cevi',
      dimenzije_m: { duzina: 14 },
      opis: 'pravougaone skoro kvadratne kamene zgrade sličnog rasporeda, okrenute ka istoku; izdužena prostorija (ili trem) na istočnoj strani, odvojena od male kvadratne sobe u jugoistočnom uglu; zadnji deo podeljen poprečno',
      interpretacija: 'manja vila / kuća — po formi i veličini odgovara "vili sa ogradnim zidom" (iskop 1975)',
      vezan_stub: 'vila-ogradni-zid',
      poverenje_osnove: 'srednje',
      poverenje_visine: 'nisko',
      za_3d: 'par: geof-06 i geof-07 = dveju istočnih vila istog tipa'
    },
    {
      id: 'geof-07',
      naziv: 'Kuća 7',
      polozaj: 'istočno od ograđenog prostora',
      dimenzije_m: { duzina: 'nešto manje od 14' },
      opis: 'isti raspored kao Kuća 6, nešto manja',
      interpretacija: 'manja vila istog tipa',
      vezan_stub: 'vila-ogradni-zid',
      poverenje_osnove: 'srednje',
      poverenje_visine: 'nisko',
      za_3d: 'serijska gradnja — isti projekat ponovljen'
    },
    {
      id: 'geof-08',
      naziv: 'Dve manje strukture (gospodarske)',
      polozaj: 'zapadno od kuća 6-7',
      dimenzije_m: [12, 7],
      opis: 'dve manje zapadne strukture 12×7 m; unutrašnja organizacija slabo čitljiva',
      interpretacija: 'možda pomoćni objekti (outhouse) glavnih vila',
      vezan_stub: null,
      poverenje_osnove: 'nisko-srednje',
      poverenje_visine: 'nisko',
      za_3d: 'bez unutrašnjosti — volumeni'
    },
    {
      id: 'geof-09',
      naziv: 'Objekat na jugoistočnom kraju',
      polozaj: 'krajnji jugoistočni ugao snimljenog područja, uz put ka Naissusu',
      dimenzije_m: [17, 15],
      opis: 'skoro kvadratan, dve isturene anomalije na severnoj strani; dipolne magnetne signature unutar objekta maskiraju složenu unutrašnju organizaciju',
      interpretacija: 'kupatilo ili druga vila; jake anomalije sugerišu razaranje požarom (dokazano za obližnju "vilu sa ogradnim zidom")',
      vezan_stub: null,
      poverenje_osnove: 'nisko-srednje (unutrašnjost maskirana)',
      poverenje_visine: 'nisko',
      za_3d: 'kvadratni volumen sa dva istaka na severu'
    },
    {
      id: 'geof-10',
      naziv: 'Rimski vojni logor (nedovršen?)',
      polozaj: 'istočna ivica snimljenog područja, tranšeja NNE–SSW koja se na severu oštro savija ka zapadu',
      dimenzije_m: { stranica_kvadrata: 160 },
      opis: 'linearna tranšejama slična struktura; kvadratan logor stranice ~160 m; bez tragova kamenog zida ili temelja — najverovatnije zasuti jarak logora; trajna drvena fortifikacija malo verovatna za 3-4. vek → privremena ili nedovršena struktura; kapija istočno od centra: dve okrugle/ovalne strukture povezane pravougaonim srednjim delom; slično i sredina zapadne strane (smetnje: vodovodne cevi i pumpe); okrugle kule Severovog tipa (konveksna spoljna lica) — 3. vek, ali paralele i u 4-5. veku (Karataš-Diana, Čezava-Novae); dioklecijanski kontekst moguć, paralele i valentinijanske; mogući posternji ulaz na severu kapije',
      interpretacija: 'privremeni/nedovršeni vojni logor — možda prethodno (ranije) naselje na lokacitetu; " offers an encouraging prospect for future research on the early history of Mediana"',
      vezan_stub: null,
      poverenje_osnove: 'srednje (konture jarka čitljive, unutrašnjost prazna)',
      poverenje_visine: 'nisko (drveno/nedovršeno)',
      za_3d: 'marker ranije faze: jarak 160×160 m sa kapijama istočno/zapadno; VAŽNO za hronologiju — moguće objašnjenje faze 1 (~317)'
    },
    {
      id: 'geof-11',
      naziv: 'Paljene strukture / peći u jugozapadnom uglu logora',
      polozaj: 'jugozapadni ugao geof-10',
      dimenzije_m: null,
      opis: 'jake anomalije — možda spaljene građevinske strukture, ali možda i peći ili peći za hleb',
      interpretacija: 'paralela Pontes: peći za hleb uz intervallum početkom 4. veka',
      vezan_stub: null,
      poverenje_osnove: 'nisko',
      poverenje_visine: 'nisko',
      za_3d: 'tačkasti izvori topline/dima, ne objekat'
    },
    {
      id: 'geof-12',
      naziv: 'Okrugle jame preko logora',
      polozaj: 'preko geof-10, sastaju se sa Objektom 8 sa juga',
      dimenzije_m: { precnik: [2, 5] },
      opis: 'niz okruglih struktura prečnika 2-5 m, iste magnetna intenziteta kao jarak',
      interpretacija: 'skladišne jame kasnije zatrpane otpadom; ne mogu se datirati — ili deo istočnog logora ili zapadnih baraka',
      vezan_stub: null,
      poverenje_osnove: 'nisko',
      poverenje_visine: 'nisko',
      za_3d: 'udubljenja, ne nadzemni objekti'
    },
    {
      id: 'geof-13',
      naziv: 'Jame između baraka',
      polozaj: 'između istočnog i severnog niza baraka',
      dimenzije_m: null,
      opis: 'ekvivalentne jame kao geof-12; paralela Pontes — silosi početkom 4. veka; veza sa ruralnim naseljem poslednje faze (kraj 4-5. veka) ne isključuje',
      interpretacija: 'skladišne jame',
      vezan_stub: 'barake-istocne',
      poverenje_osnove: 'nisko',
      poverenje_visine: 'nisko',
      za_3d: 'udubljenja'
    },
    {
      id: 'geof-14',
      naziv: 'Objekat 14 (drven?)',
      polozaj: 'pored Kuće 6, poravnat sa severnim jarkom',
      dimenzije_m: [13, 7],
      opis: 'nizak magnetna intenzitet — možda drvena gradnja; nepravilan raspored sa tačkastim i linearnim anomalijama',
      interpretacija: 'nepoznato (možda drveni)',
      vezan_stub: null,
      poverenje_osnove: 'nisko',
      poverenje_visine: 'nisko',
      za_3d: 'volumen bez unutrašnjosti'
    },
    {
      id: 'geof-15',
      naziv: 'Struktura preko istočnog jarka logora',
      polozaj: 'preko istočnog jarka geof-10',
      dimenzije_m: [14, 10],
      opis: 'jedva vidljiva pravougaona struktura; nejasna hronološka i funkcionalna veza sa logorom',
      interpretacija: 'nepoznato',
      vezan_stub: null,
      poverenje_osnove: 'nisko',
      poverenje_visine: 'nisko',
      za_3d: 'volumen'
    },
    {
      id: 'geof-16',
      naziv: 'Apsidalni objekat kod rezervoara',
      polozaj: 'severno od modernog vodnog rezervoara, zapadno od horeuma i iskopanih baraka',
      dimenzije_m: [10, 5],
      opis: 'izolovan objekat sa dve prostorije i pridruženim zidovima; istočni deo sa zaobljenim uglovima — utisak apsidalnog završetka',
      interpretacija: 'ISTI oblik i dimenzije kao objekat iskopan 2001. i definisan kao crkva kasnog 4. veka (Vasić 2007, 106-107) — ali funkcija se NE SME pretpostaviti samo iz geofizike i spoljne sličnosti',
      vezan_stub: 'crkva-juzna',
      poverenje_osnove: 'nisko-srednje',
      poverenje_visine: 'nisko',
      za_3d: 'kandidat za još jednu crkvu — za 3D samo kao apsidalna dvoprostorijcka zgrada dok se ne iskopa'
    }
  ],
  zapadni_deo: 'teren zapadno od iskopanog horeuma i baraka delimično snimljen — bez podzemnih struktura; samo geof-16 kod modernog rezervoara',
  perspektiva: 'buduća prospekcija ka Nišavi će dopuniti plan; konkretna iskopavanja se sada mogu ciljati na pojedinačne strukture (npr. kapije logora)',
  otvoreno: [
    'tačne konture struktura su na Sl. 2 (mosaik anomalija) u PDF-u — vektorski sloj za GIS i dalje nije izdvojiv iz PDF-a alatima na sistemu',
    'hronologija logora (geof-10) prema kapiji i kulama je samo okvirna: 3. vek do valentinijanski'
  ]
};
pisi('geofizika_sloj.json', geofizika);
poruka.push('geofizika_sloj.json: 16 struktura');

// --- 2. prostorni sloj: povezi postojeih stubova sa geofizikom + novi stubovi ---
const prost = citaj('prostorni_sloj.json');
const dodajStub = s => { if (!prost.objekti_3d_stubi.find(x => x.id === s.id)) prost.objekti_3d_stubi.push(s); };

// horreum: nezavisna potvrda istocnog iz geofizike
const hor = prost.objekti_3d_stubi.find(s => s.id === 'horreum');
if (hor && !hor.povezanost_geofizika) {
  hor.povezanost_geofizika = 'istočni horeum (geof-01, 180 m istočno) ima identičnu unutrašnju organizaciju: tri broda, dva reda stubova, ležišta dolia, rezervoari na zapadnom kraju — nezavisna potvrda da su oba horeuma istog projekta; ' + GEOF_IZVOR;
}
// barake-istocne: potvrda formata
const bar = prost.objekti_3d_stubi.find(s => s.id === 'barake-istocne');
if (bar && !bar.povezanost_geofizika) {
  bar.povezanost_geofizika = 'geof-04: prostorije ~8×4,5 m, portik uz unutrašnje dvorište ~6 ha, ukupan niz ~400 m, ulaz kroz pukotinu od 5 m na severu; ' + GEOF_IZVOR;
}
// vila-ogradni-zid: paralela geof-06/07
const voz = prost.objekti_3d_stubi.find(s => s.id === 'vila-ogradni-zid');
if (voz && !voz.povezanost_geofizika) {
  voz.povezanost_geofizika = 'kuće 6 i 7 (geof-06/07, ~14 m, okrenute ka istoku) odgovaraju formi i veličini vili sa ogradnim zidom — serijska gradnja istog tipa na istoku; ' + GEOF_IZVOR;
}

// novi stub: istočni horeum
dodajStub({
  id: 'horreum-istocni',
  naziv: 'Istočni horeum (geof-01)',
  dimenzije_m: { sirina_zapadne_fronte: 27 },
  osa: 'Z-I',
  poverenje_osnove: 'srednje (geomagnetna prospekcija 2010; unutrašnja organizacija jasna: tri broda, dva reda stubova, dolia ležišta, rezervoari, trem, administrativni deo sa pilonima na ulazu)',
  poverenje_visina: 'nisko (neiskopano)',
  izvor: GEOF_IZVOR,
  veza: 'identičan projekat kao zapadni horeum (iskopan 1980-82) — plansko privredno krilo na obe strane kompleksa',
  za_3d: 'kopirati tipologiju zapadnog horeuma (91×27 m) sa oprezom; samo zapadna fronta 27 m je izmerena anomalija'
});

// novi stub: vojni logor
dodajStub({
  id: 'vojni-logor-istocni',
  naziv: 'Vojni logor (geof-10)',
  dimenzije_m: { stranica: 160 },
  osa: 'kvadrat',
  poverenje_osnove: 'srednje (jarak kvadrata 160 m čitljiv; kapije sa okruglim kulama na E i W strani; bez kamenog zida — privremeno ili nedovršeno)',
  poverenje_visina: 'nisko (drveno ili nikad završeno)',
  izvor: GEOF_IZVOR,
  hronologija: 'kule okruglog Severovog tipa = 3. vek; paralele i 4-5. vek (Diana, Novae); dioklecijanski kontekst moguć — autori rada vide mogući odgovor za ranu fazu Medijane (možda fazu 1, ~317)',
  za_3d: 'faza pre/preko kompleksa: samo jarak i kapije, bez unutrašnjosti; ne uklapati se sa barakama dok se ne reši hronologija'
});
pisi('prostorni_sloj.json', prost);
poruka.push('prostorni_sloj: +2 stuba (horreum-istocni, vojni-logor-istocni), 3 geofizika povezi');

// --- 3. Zotović–Petrović 1969: događaji + detalji ---
const baza = citaj('baza_podataka.json');

// novi izvori
const noviIzvori = [
  { id: 'geofizika-2011', url: 'https://doiserbia.nb.rs/ft.aspx?id=0350-02411161275M', jezik: 'en+sr', tip: 'clanak (Starinar LXI/2011, 275-284)', pristup: DATUM, napomena: 'Gordana Milosevic (Arhitektonski fakultet) + RGK DAI (Peters, Wendling); geomagnetna prospekcija april 2010, 16 ha; DOI 10.2298/STA1161275M' },
  { id: 'ap11-zotovic-1969', url: 'https://files.catbox.moe/0j6r0o.pdf', jezik: 'sr', tip: 'iskopni izvestaj (Arheoloski pregled 11, 1969, 185-186)', pristup: DATUM, napomena: 'Lj. Zotovic i N. Petrovic; iskopavanja 1969: severni deo peristila, juzni deo centralne sale, ekonomske prostorije; konzervacija termi iz 1967' }
];
for (const iz of noviIzvori) if (!baza.izvori.find(i => i.id === iz.id)) baza.izvori.push(iz);

// istrazivanja: 1969
if (!baza.istrazivanja.find(i => i.godina === 1969)) {
  baza.istrazivanja.push({
    godina: 1969,
    opis: 'Zotović i Petrović (Arheološki institut + SO Niš, 45.000 dinara): severni deo peristila atrijuma, južni deo centralne sale, ekonomske prostorije; ~50 m² mozaika otkriveno; PRVI figuralni mozaici na Medijani (mitološke teme, centralna sala); konzervacija severnog dela termi (otkrivene 1967) — utvrđena TRI nivoa poda = faze kupatila',
    izvor: 'ap11-zotovic-1969',
    poverenje: 'visoko'
  });
  baza.istrazivanja.sort((a, b) => (a.godina || 0) - (b.godina || 0));
}

// ključni nalazi 1969 u bazu (objekti/nalazi)
if (baza.objekti && !baza.objekti.ostava_zito_1969) {
  baza.objekti.ostava_zito_1969 = {
    naziv: 'Ostava za žitarice u zapadnom krilu palate',
    opis: 'u malternom podu kružna ležišta za pitose prečnika 1,50 m',
    izvor: 'ap11-zotovic-1969',
    poverenje: 'visoko',
    za_3d: 'pod sa kružnim udubljenjima Ø 1,50 m + pitosi u zapadnom krilu'
  };
}
if (baza.konflikti_izmedju_izvora && !baza.konflikti_izmedju_izvora.find(k => k.id === 'zidovi-pre-1930')) {
  baza.konflikti_izmedju_izvora.push({
    id: 'zidovi-pre-1930',
    tema: 'kada su zidovi palate razoreni',
    varijante: [
      { stavka: 'zidovi palate povađeni do nivoa temelja još PRE 1930. godine (nerazjašnjeno ko; temelji mestimično uopšte ne postoje, mozaici na nivou iznad ostataka zidova nezaštićeni)', izvor: 'ap11-zotovic-1969' },
      { stavka: 'iskopavanja počela 1933/34 (Oršić-Slavetić)', izvor: 'geofizika-2011, f. 3' },
      { stavka: 'Muzej podignut 1936 (bazen sa mozaikom preko koga je podignut muzej = sastavni deo palate)', izvor: 'sr-wiki + ap11-zotovic-1969' }
    ],
    status: 'otvoreno: razaranje pre 1930 + gradnja muzeja 1936 preko bazena — delovi palate uništeni pre i tokom prvih istraživanja; za 3D: nadzemni zidovi palate NE SMEJU se rekonstruisati kao sačuvani'
  });
}
pisi('baza_podataka.json', baza);
poruka.push('baza: +2 izvora, +1969 istrazivanje, +ostava-zito-1969, +konflikt zidovi-pre-1930');

// --- 4. vila-peristil stub: Zotović 1969 detalji + muzejska gradnja preko bazena ---
const vila = prost.objekti_3d_stubi.find(s => s.id === 'vila-peristil');
if (vila && !vila.detalji_1969) {
  vila.detalji_1969 = {
    izvor: AP11_IZVOR,
    stepeniste_sala_peristil: 'centralna sala povezana sa severnim peristilom pravougaonim ispadom podnog dela u sredini južne strane; silazilo se na niži nivo peristila preko nekoliko stepenika koji obuhvataju TRI strane pravougaonog ispada; stepenici od tesanih kamenih blokova, mestimično očuvani',
    figuralni_mozaici: 'u centralnoj sali otkriveni prvi figuralni mozaici na Medijani — mitološke teme (1969); ukupno ~50 m² mozaika te godine; peristil: višebojni geometrijski ornament (kvadratna i romboidna polja, rozete, svastike, meandri, pletenice)',
    istočno_krilo: 'pod od opeka velikim delom očuvan',
    zidovi: 'povađeni do temelja (lomljeni kamen) još pre 1930; freske sa crvenom, plavom i zelenom samo na porušenom malteru',
    glavni_deo: 'prema podacima iz 1969 glavni deo objekta pruža se ka severu; bazen sa mozaikom preko koga je podignut muzej (1936) sastavni je deo palate',
    za_3d: 'prva konkretna veza sala-peristil sa brojem stepenika i tri strane ispada — direktan ulaz za 3D kretanje nivoa (sala viša od peristila za "nekoliko stepenika")'
  };
  pisi('prostorni_sloj.json', prost);
  poruka.push('vila-peristil: +detalji_1969 (stepeniste, figuralni mozaici, muzejski bazen)');
}

// --- 5. terme: tri nivoa poda = faze ---
const terme = prost.objekti_3d_stubi.find(s => s.id === 'terme');
if (terme && !terme.faze_1969) {
  terme.faze_1969 = {
    izvor: AP11_IZVOR,
    opis: 'konzervacija severnog dela termi (otkriven 1967): u severoistočnom odeljenju TRI nivoa poda povezana sa odgovarajućim zidovima — objašnjavaju pregradnje i dogradnje kupatila; prepravke nisu rađene u velikom vremenskom razmaku; konačna hronologija tek sa potpunim otkrivanjem',
    za_3d: 'terme imaju najmanje tri poda jedan preko drugog — 3D model treba slojeve, ne jedan pod'
  };
  pisi('prostorni_sloj.json', prost);
  poruka.push('terme: +faze_1969 (tri nivoa poda)');
}

// --- 6. mozaici sloj: potvrda figuralnih iz 1969 ---
const mozaici = citaj('mozaici_sloj.json');
if (!mozaici.istorijat_otkrica) {
  mozaici.istorijat_otkrica = [
    { godina: 1969, opis: 'prvi figuralni mozaici na Medijani otkriveni u centralnoj sali — mitološke teme; ~50 m² mozaika te godine; peristil sa geometrijskim ornamentom', izvor: 'ap11-zotovic-1969', poverenje: 'visoko' }
  ];
  pisi('mozaici_sloj.json', mozaici);
  poruka.push('mozaici: +istorijat_otkrica 1969');
}

// --- 7. upozorenje na zamku sa pretrage (Zenica, ne Medijana) ---
baza.rupe_za_rekonstrukciju = baza.rupe_za_rekonstrukciju || [];
if (!baza.rupe_za_rekonstrukciju.find(r => (r.id || '') === 'zenica-zamka')) {
  baza.rupe_za_rekonstrukciju.push({
    id: 'zenica-zamka',
    tema: 'zamka pri pretrazi: "objekat A 17,20×14,60 m, objekat B 20,30×14,18, objekat C delimično" je iz Mlinčića-Tisina kod Zenice (D. i C. Trajković, Arheološki pregled 11), NE sa Medijane — ne uvoziti u bazu',
    status: 'zabeleženo da se ne ponovi'
  });
  pisi('baza_podataka.json', baza);
  poruka.push('baza: +zenica-zamka upozorenje');
}

// --- 8. nove reference za lov (iz geofizika bibliografije) ---
baza.nacin_daljeg_rada = baza.nacin_daljeg_rada || [];
const noveRef = [
  'Petrović P. 1994, Mediana — rezidencija rimskih careva, Beograd — standardna monografija, tražiti pun tekst',
  'Drča S. 2000, Medijana — objekat B, Zbornik Narodnog muzeja Niš 9, 21-36 + Janković-Mihaldžić 2001 (novac sa objekta B), Zbornik NN 10, 27-38',
  'Jeremić G. 2006, Mozaici Medijane — neka razmatranja, Niš i Vizantija 4, 145-158',
  'Vasić M. 2007, Mediana — Die kaiserliche Villa bei Niš, u: Roms Erbe auf dem Balkan, Mainz, 96-107',
  'Vasić M. 2005, Mediana — domaine impérial ou bien privé?, Beograd, 167-176'
];
for (const r of noveRef) if (!baza.nacin_daljeg_rada.includes(r)) baza.nacin_daljeg_rada.push(r);
pisi('baza_podataka.json', baza);

console.log(poruka.join('\n'));
