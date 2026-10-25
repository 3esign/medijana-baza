// Talas v0.9 — monografija "Constantine's Villa at Mediana" (Vasic, Milosevic, Gavrilovic Vitas, Crnoglavac; Narodni muzej Nis, RAI repo)
// + iskopni izvestaj 2010/2011 + "Carska ideologija" — novi stubovi, azuriranje postojecih, mere.
const fs = require('fs');

const V = '0.9';
const D = '2026-10-25';

// ---------- baza_podataka.json ----------
const b = JSON.parse(fs.readFileSync('baza_podataka.json', 'utf8'));
b.verzija = V;
b.datum = D;

const noviIzvori = [
  {
    id: 'monografija-vila-2011',
    naziv: "Constantine's Villa at Mediana (Vasic, Milosevic, Gavrilovic Vitas, Crnoglavac)",
    izdavac: 'Narodni muzej Nis',
    strana: 108,
    url: 'https://rai.ai.ac.rs/handle/123456789/1539',
    jezik: 'en',
    tip: 'monografija',
    pristup: D,
    napomena: 'puni tekst izvucen lokalno: pdf/milosevic_vila.txt (161.700 znakova); nosi situacioni plan sa 9 elemenata i osnovu rezidencijalnog kompleksa'
  },
  {
    id: 'iskopi-2010-2011',
    naziv: 'Iskopavanja Medijane u 2010. i 2011. godini (Vasic, Milosevic, Gavrilovic)',
    url: 'https://rai.ai.ac.rs/handle/123456789/210',
    jezik: 'sr',
    tip: 'iskopni izvestaj',
    pristup: D,
    napomena: 'pdf/milosevic_iskopi.txt; 9 meseci iskopavanja, plan vile sa sondama'
  },
  {
    id: 'carska-ideologija',
    naziv: 'Carska ideologija u arhitekturi, umetnosti i skulpturi rimske vile na Medijani (Milosevic)',
    url: 'https://rai.ai.ac.rs/handle/123456789/1555',
    jezik: 'sr',
    tip: 'rad',
    pristup: D,
    napomena: 'pdf/milosevic_ideologija.txt; bronzana ograda sa hermama, skulpturski program'
  }
];
for (const i of noviIzvori) if (!b.izvori.some(x => x.id === i.id)) b.izvori.push(i);

// hronologija: 330-334 prva faza vile sa oktogonom
if (!b.hronologija.some(h => h && h.dogadjaj && h.dogadjaj.includes('oktagon') && String(h.period || h.godina || '').includes('330'))) {
  b.hronologija.push({
    period: '330-334',
    dogadjaj: 'prva gradjevinska faza vile sa oktogonom (datiranje iz monografije; mozaik sobe 2 isto iz te faze)',
    izvor: 'monografija-vila-2011',
    poverenje: 'B (datiranje iz literature, bez strugaturije u tekstu)'
  });
}

// rupe: osnova objekata C-D delimicno popunjena iz situacionog plana monografije
if (Array.isArray(b.rupe_za_rekonstrukciju)) {
  b.rupe_za_rekonstrukciju = b.rupe_za_rekonstrukciju.map(r => {
    const t = typeof r === 'string' ? r : (r.opis || r.rupa || JSON.stringify(r));
    if (t.includes('A–D') || t.includes('A-D')) {
      return typeof r === 'string'
        ? r + ' [v0.9: delimicno popunjeno — situacioni plan monografije daje raspored 9 elemenata; numericke mere za C-D i dalje bez javne osnove]'
        : r;
    }
    return r;
  });
}

// konflikti: nove stavke iz monografije
const noviKonflikti = [
  {
    tema: 'vodeni izvor — Niška Banja',
    opis: 'monografija put via publica opisuje "od Nais do termalnih izvora Niške Banje" kao mikro-klimatski povoljan pojas, ali NE tvrdi da vodovod vodi iz Banje; konflikt Oblik vs Niška Banja ostaje otvoren',
    izvor: 'monografija-vila-2011',
    status: 'otvoren'
  },
  {
    tema: 'broj horreuma',
    opis: 'ranije baza: jedan horreum 91x27 m; monografija: DVA — zapadni (150 m od vile, centar dvorista) i istocni (u istocnom kompleksu baraka, sa javnim termama)',
    izvor: 'monografija-vila-2011',
    status: 'resen (dva objekta)'
  }
];
for (const k of noviKonflikti) if (!b.konflikti_izmedju_izvora.some(x => x.tema === k.tema)) b.konflikti_izmedju_izvora.push(k);

fs.writeFileSync('baza_podataka.json', JSON.stringify(b, null, 2));

// ---------- prostorni_sloj.json ----------
const p = JSON.parse(fs.readFileSync('prostorni_sloj.json', 'utf8'));
p.verzija = V;
p.datum = D;

const azuriraj = (id, izmene) => {
  const s = p.objekti_3d_stubi.find(x => x.id === id);
  if (!s) { console.error('NEDOSTAJE stub', id); return; }
  Object.assign(s, izmene);
};

// vila sa oktogonom — 330-334, oktagon+krug, dvoriste 40 m istocno
azuriraj('villa-oktagon', {
  poverenje_osnove: 'srednje-visoko (iskop + monografija: raspored soba 1, 1a, 2, 2a; oktagon sa kontraforama; dvoriste ~40 m istocno sa kolonadom, mramornim plocama i fontanom na jugu; trem "prostor 3" spaja dvoriste i oktagon)',
  detalji_osnove: {
    zapadni_deo: 'oktagon + krug probijeni jedan u drugi, zid-delilac na preseku; kontrafore; soba 1 (prohodna, triclinijum) + soba 1a (zapadna, privatnija)',
    istocno_dvoriste: '~40 m istočno; soba sa kružnom osnovom; dvorište sa kolonadom, sredina popločana mramornim pločama, fontana na jugu; trem (prostor 3) kao veza',
    mozaik_paneli: [
      { mere: '1,70 x 1,50 m', motiv: 'zvonoliki motivi u sinusoidi' },
      { mere: '2,50 x 5,50 m', motiv: 'mreza oktagona sa peltama sa krstom' }
    ],
    rekonstrukcija_sobe_2: 'sredina mramorne ploce sa fontanom, tri strane mozaik pravougaonici sa geometrijskim okvirima, heksalna rozeta (jug), mreza kvadrata i cetvorouckastih rombova (zapad)'
  },
  datiranje: 'prva faza 330-334; soba 2 mozaik iz iste faze',
  izvor: 'Pop-Lazic 2018 + monografija-vila-2011'
});

// horreum zapadni
azuriraj('horreum', {
  poverenje_osnove: 'visoko (91x27 m potvrdjeno u monografiji; unutrasnja organizacija opisana detaljno)',
  detalji_osnove: {
    poloza: '~150 m zapadno od vile sa peristilom, izduzena pravougaona osnova, smer SZ-JI',
    glavna_sala: 'tripartitna podela sa DVA reda po 11 opekarskih stubova; dolia (zrnni sudovi) uz istocni zid; TRI bazena uz zapadni zid',
    juzni_trem: 'dubok trem, po dve manje sobe u uglovima; stepenice na zapadnom delu tremca; vojni put na sredini juznog zida',
    zapadni_deo: 'samostalna celina, 6 soba u dva reda, masivni prag na zapadnom zidu; kasnije podeljen zidovima — svrha vezana za proizvodnju vina',
    krov: 'dvodnevni (gable) krov na masivnim zidovima, stubovima i stupovima tremca; velika visina sale omogucila sobe u uglovima tremca'
  },
  izvor: 'monografija-vila-2011 + Pop-Lazic 2018'
});

// barake — mere i prolazi
azuriraj('barake-zapadne', {
  poverenje_osnove: 'srednje-visoko (4 ha potvrdjeno; uzak izduzeni objekti sa drvenim tremom na duzoj strani; granici sa zapadnim ogradnim zidom rezidencije)',
  izvor: 'monografija-vila-2011 + Pop-Lazic 2018'
});
azuriraj('barake-istocne', {
  poverenje_osnove: 'srednje (kompleks ~7 ha sa horreumom; prolazi 12 m siroki na severnom i istocnom kompleksu, ugaono ucvrseni pilonima; uz njih javne terme za vojsku)',
  izvor: 'monografija-vila-2011 + Pop-Lazic 2018'
});

// terme — privatne, centralna organizacija
azuriraj('terme', {
  poverenje_osnove: 'srednje (zapadni deo neistrazen — ukupna povrsina NEPOZNATA; centralna organizacija: hladne i tople sobe severno/juzno od zajednicke sredine; frigidarium, tepidarium, caldarium, laconicum; originalni ulaz istocno; kasnije hodnik ka SZ sobama vile i novi ulaz na juznom zidu JI sobe)',
  izvor: 'monografija-vila-2011'
});

// vila sa konhama
azuriraj('vila-konhe', {
  poverenje_osnove: 'srednje (poznat samo juzni deo: apsidalna soba-triklinijum, dve cetvrtaste sobe, deo dvorista i peristila; ulaz istocno, uzduzna osnova I-J; BEZ grejanja — sezonska upotreba; mozaik 15 m2 opus tessellatum belo/oker/crveno, mreza rombova + loza, nadjen 1975, restavriran 2015; skroman karakter)',
  izvor: 'monografija-vila-2011'
});

// vila sa peristilom — vestibulum, piloni, 14 soba, podijum
azuriraj('vila-peristil', {
  poverenje_osnove: 'visoko (monografija: izduzena osnova ~6000 m2, orijentacija SZ sa blagim otklonom severnog dela ka istoku; centralno dvoriste sa peristilom i impluviumom; sobe u dva niza istocno i zapadno; ulazi u dve male cetvrtaste sobe na zapadnom i istocnom kraju tremca; sredisnji deo juznog tremca 12 m sirok; ulaz oznacen sa DVA masivna pilona, deo monumentalne polukruzne strukture; 2 m juznije na ulaznoj osi cetvrtasta sporedna soba — vestibul; naspram ulaza na severu sala za prijem sa podijumom od 3 stepenika; istocno i zapadno od sale 14 soba; druga faza: trem obnovljen, drveni stubovi zamenjeni mramornima, impluvium, mreza vodovodnih i odvodnih kanala)',
  izvor: 'monografija-vila-2011 + Pop-Lazic 2018 + Stibadium B 2016'
});

// novi stubovi
const noviStubovi = [
  {
    id: 'kapija-aleja',
    naziv: 'monumentalna kapija i sveca aleja',
    opis: 'kapija u obliku trijumfalne kapije sa pratecim prijemnim sobama; podvlaga aleje ~80 m dugacka, juzno i zapadno od kapije; sobe na JZ i JI kraju kapije na ~30 m medjusobnog razmaka, organizacijom slicne vojnim barakama; aleja deli severno i juzno dvoriste',
    poverenje_osnove: 'srednje (opis monografije, bez numericke osnove osim 80 m i 30 m)',
    poverenje_visina: 'nisko',
    izvor: 'monografija-vila-2011'
  },
  {
    id: 'javne-terme-istocne',
    naziv: 'javne terme (istočni kompleks)',
    opis: 'ostaci vecih termi javnog karaktera u JZ delu istocnog kompleksa vojnih baraka; namenjene stacioniranoj vojsci i sluzbi Medijane',
    poverenje_osnove: 'nisko (samo pominjanje "probably belong" — bez osnove)',
    poverenje_visina: 'nisko',
    izvor: 'monografija-vila-2011'
  },
  {
    id: 'vila-ogradni-zid',
    naziv: 'vila sa ogradnim zidom (elemenat 7 situacionog plana)',
    opis: 'posebna vila sa ogradnim zidom, oznacena na situacionom planu monografije kao elemenat 7; u tekstu bez posebnog poglavlja — postojanje potvrdjeno samo planom',
    poverenje_osnove: 'nisko (samo pozicija na planu, bez mera i opisa)',
    poverenje_visina: 'nisko',
    izvor: 'monografija-vila-2011'
  },
  {
    id: 'ogradni-zid-geofizika',
    naziv: 'ogradni zid kompleksa (geofizicka snimanja)',
    opis: 'zid ograde koji deli rezidencijalni kompleks od baraka i skladista; potvrdjen geofizickim snimanjima (elemenat 8 situacionog plana); teodolitski oblik: rezidencija u centru, dva monumentalna dvorista zapadno i istocno sa horreumima u sredini',
    poverenje_osnove: 'srednje (geofizika — kontinuitet zida, bez osnove u metrima)',
    poverenje_visina: 'nisko',
    izvor: 'monografija-vila-2011'
  }
];
for (const s of noviStubovi) if (!p.objekti_3d_stubi.some(x => x.id === s.id)) p.objekti_3d_stubi.push(s);

p.prostorne_implikacije_3d = p.prostorne_implikacije_3d || [];
p.prostorne_implikacije_3d.push(
  'v0.9: rezidencijalni kompleks ima SLOZEN SASTAV — kapija + aleja (80 m) + vestibul + peristil + sala sa podijumom + 2 stibadija + officium + terme, sve unutar ogradnog zida; to je osnova za 3D odvajanje javnog od privatnog sloja',
  'v0.9: simetrija severnog dela — rezidencija u centru, horreum u sredini svakog od dva dvorista (zapad/istok), barake na ivicama; centricnost je planer princip, ne slucajnost',
  'v0.9: prolazi 12 m izmedju baraka ucvrseni pilonima — jedina dokumentovana sirina komunikacija u vojnom delu'
);

fs.writeFileSync('prostorni_sloj.json', JSON.stringify(p, null, 2));

// ---------- digitalni_pasos.json ----------
const d = JSON.parse(fs.readFileSync('digitalni_pasos.json', 'utf8'));
d.verzija = V;
d.datum = D;
d.materijali = (d.materijali || []).map(m => {
  const t = JSON.stringify(m);
  if (t.includes('stubov') && !t.includes('mramorni stubovi druge faze vile')) {
    if (typeof m === 'string') return m + ' [v0.9: drveni stubovi tremca vile sa peristilom zamenjeni MRAMORNIMA u drugoj fazi (monografija)]';
  }
  return m;
});
if (!JSON.stringify(d).includes('okolne ploce sobe 2')) {
  d.nalazi = d.nalazi || [];
  d.nalazi.push({
    tekst: 'mozaik sobe 2 vile sa oktogonom: sredina mramorne ploce sa fontanom — kombinacija mramor + mozaik + voda u jednoj sobi (v0.9, monografija)',
    poverenje: 'B'
  });
}
d.uticaji = d.uticaji || [];
if (!JSON.stringify(d.uticaji).includes('carska ideologija')) {
  d.uticaji.push('carska ideologija Konstantina I u arhitekturi Medijane — kapija kao trijumfalna kapija, dinasticki program urodjen u Naisu (v0.9, monografija + rad "Carska ideologija")');
}
fs.writeFileSync('digitalni_pasos.json', JSON.stringify(d, null, 2));

// ---------- ostale verzije ----------
for (const f of ['vizuelni_nalazi.json', 'vodeni_linijski_sloj.json', 'komparativni_lokaliteti.json']) {
  const j = JSON.parse(fs.readFileSync(f, 'utf8'));
  j.verzija = V; j.datum = D;
  fs.writeFileSync(f, JSON.stringify(j, null, 2));
}

console.log('v0.9 upisana. Stubova sada:', p.objekti_3d_stubi.length, '| izvora:', b.izvori.length, '| hronologija:', b.hronologija.length);
