#!/usr/bin/env node
// Talas v0.14 — mozaicki katalog monografije vezan na stubove i prostorije,
// porfirne skulpture iz sobe w-4, bronzana ograda — precizniji polozaj.
// Pokretanje: node talas_v014.js  (iz ovog foldera), pa node validator.js
const fs = require('fs');
const path = require('path');
const citaj = f => JSON.parse(fs.readFileSync(path.join(__dirname, f), 'utf8'));
const pisi = (f, o) => fs.writeFileSync(path.join(__dirname, f), JSON.stringify(o, null, 2) + '\n', 'utf8');
const poruka = [];

const VER = '0.14';

// --- verzije uskladjene na 0.14 ---
const verzijaFajlovi = [
  'baza_podataka.json', 'prostorni_sloj.json', 'vodeni_linijski_sloj.json',
  'komparativni_lokaliteti.json', 'digitalni_pasos.json', 'vizuelni_sloj.json',
  'vizuelni_nalazi.json', 'skulpturski_program.json', 'sonde_sloj.json',
  'crtezi_sloj.json', 'sobe_sloj.json'
];
for (const f of verzijaFajlovi) {
  const o = citaj(f);
  const staro = o.verzija || o.version;
  if (o.version) o.version = VER; else o.verzija = VER;
  if (o.datum) o.datum = '2026-10-25';
  pisi(f, o);
  poruka.push(`verzija ${f}: ${staro} -> ${VER}`);
}

// --- 1. sobe: prostorija w-4 sa tri porfirne skulpture ---
const sobe = citaj('sobe_sloj.json');
if (!sobe.prostorije.find(p => p.id === 'w-4')) {
  sobe.prostorije.push({
    id: 'w-4',
    trakt: 'zapadni',
    sonde: [],
    zidovi: [],
    pod: null,
    napomena_osnove: 'prostorija istrazivana starijim iskopima (1971); u sondama 2010/2011 nije bila obuhvacena — postoji u numeraciji Sl. 1 (crtezi_sloj) i ovde kao nosilac nalaza',
    nalazi: [
      {
        tip: 'skulptura',
        opis: 'porfirna statua boga Asklepija, h 43 cm, inv. 985/R; bez glave i desne ruke, kontrapost, himatij; na pravougaonom postolju sa grckim posvetnim natpisom: "Asklepiju Spasitelju, Roimetalk i supruga mu Filipa zahvalno podizaju spomenik"',
        period: '2. pol. 2. - poc. 4. v.',
        izvor: 'monografija-vila-2011, katalog skulptura br. 1 (iskopi 1971)'
      },
      {
        tip: 'skulptura',
        opis: 'porfirna statua boginje Higije, h 49 cm, inv. 986/R; bez glave, hiton i himatij, u levoj ruci patera, oko desne ruke zmija; na postolju sa grckim natpisom: "Higiji, Roimetalk diasemotatos i supruga mu Filipa..."',
        period: '2. pol. 3. - poc. 4. v.',
        izvor: 'monografija-vila-2011, katalog skulptura br. 2 (iskopi 1971)'
      },
      {
        tip: 'skulptura',
        opis: 'skulpturna grupa Asklepije sa sinom Telesforom (porfir); glava delomicno sacuvana — duga kosa, kratka brada; na postolju sa grckim natpisom: "Asklepiju Spasitelju, Sim[...]a svestenik"; telesfor (dete sa kukulom (oglavljem)) nije sacuvan',
        period: 'kasna antika (analogni datiraju 3. v.)',
        izvor: 'monografija-vila-2011, katalog skulptura br. 3 (iskopi 1971)'
      }
    ],
    tumacenje: 'tri kultne statue istog poklonika (Roimetalka) u jednoj prostoriji — monografija izvodi mogucnost postojanja svetista (sacrarium) leciteljskih bozanstava u delu vile; za 3D: soba sa postoljima i statue, neobicno za stambeni trakt',
    poverenje: 'visoko'
  });
  poruka.push('sobe_sloj: dodata prostorija w-4 sa 3 porfirne skulpture');
}
pisi('sobe_sloj.json', sobe);

// --- 2. skulpturski program: nova lokacija soba-w-4 + precizniji polozaj bronze ograde ---
const sk = citaj('skulpturski_program.json');
sk.program_po_lokaciji['soba-w-4'] = {
  id: 'kultne-skulpture-w-4',
  lokacija: 'soba w-4 vile sa peristilom',
  nalaz: 'iskopi 1971',
  predmeti: [
    'porfirna statua Asklepija (43 cm, inv. 985/R) sa natpisom Roimetalka i Filipa',
    'porfirna statua Higije (49 cm, inv. 986/R) sa natpisom Roimetalka i Filipa',
    'porfirna grupa Asklepije sa Telesforom, natpis "svestenik Sim[...]"'
  ],
  tumacenje: 'uvozni radovi (porfir) sa grckim posvetnim natpisima; moguce svetiste leciteljskih bozanstava u rezidencijalnom delu — potvrdjuje nalaz iz Carske ideologije da su porfirne statue uvoz',
  poverenje: 'visoko',
  izvor: 'monografija-vila-2011'
};
const ograda = sk.program_po_lokaciji['broncana_ograda'];
if (ograda) {
  ograda.polozaj_v014 = 'monografija precizira: ograda je stajala u prohodu ka sali za prijem (auli) i delila ga na dve polovine — herme su nosile ploce (cancelli); raniji zapis (ulaz apside sale za gozbe) zadrzan kao ranija interpretacija';
  ograda.nalaz_lokacija = 'ostava pronadjena oko 250 m SZ od vile sa peristilom (2000)';
  poruka.push('skulpturski_program: soba-w-4 + precizniji polozaj ograde');
}
pisi('skulpturski_program.json', sk);

// --- 3. vodeni sloj: fontana u stibadiumu A ---
const vod = citaj('vodeni_linijski_sloj.json');
const cvorovi = vod.vodena_mreza.cvorovi;
if (!cvorovi.find(c => c.id === 'fontana-stibadium-A')) {
  cvorovi.push({
    id: 'fontana-stibadium-A',
    tip: 'fontana',
    opis: 'mermerna fontana na postolju ukrasenom morskim crvom, u sredini sestoougaone centralne sale stibadijuma A (podni mozaik 10); druga fontana u kompleksu pored nimfeja i sobe 2 vile sa oktogonom',
    poverenje: 'visoko (postojanje); polozaj unutar sale visoko; prikljucak na vodovod nepoznat',
    status: 'objekat unisten 1936 — rekonstrukcija samo iz literature i crteza Bratanica iz 1936',
    izvor: 'monografija-vila-2011'
  });
  poruka.push('vodeni_sloj: cvor fontana-stibadium-A');
}
pisi('vodeni_linijski_sloj.json', vod);

// --- 4. digitalni pasos: figuralni mozaici popunjeni, zbirna povrsina ---
const pa = citaj('digitalni_pasos.json');
pa.figuralni_dekor = {
  dopuna: 'v0.14 — ikonografija figuralnih mozaika, do tada otvorena rupa, delimicno popunjena iz monografije',
  scene: [
    'Leda sa labudom i recni bog — podijum ulaza u aulu (moz-03)',
    'glava Meduze u kruznom medaljonu — centar aule (moz-07)',
    'ptice sa biljnim ukrasima — uglovi aule (moz-07)',
    'morski crv — postolje mermerne fontane stibadijuma A (moz-10)'
  ],
  poruka_programa: 'mitoloski+apotropejski program na hoda-osi posetioca: ulaz (Leda, recni bog) -> centar (Meduza) -> trpezarija (fontana sa morskim crvom)',
  poverenje: 'visoko',
  izvor: 'monografija-vila-2011'
};
pisi('digitalni_pasos.json', pa);

// --- 5. baza: konflikt 945 vs ~1000 resen + motivi potvrdjeni nezavisno ---
const ba = citaj('baza_podataka.json');
const temaMozaik = 'ukupna povrsina mozaika';
let k = ba.konflikti_izmedju_izvora.find(x => x.tema === temaMozaik);
if (!k) {
  ba.konflikti_izmedju_izvora.push({
    tema: temaMozaik,
    a: '945 m2 (wiki-sr)',
    b: '450 m2 (wiki-en, samo peristil) i "oko 1.000 m2" (monografija)',
    resenje: 'RESENO v0.14: to su tri recenice o istoj stvari — 450 m2 je sacuvani deo peristila, 945 m2 wiki-sr zbir za kompleks, monografija kaze "oko 1.000 m2"; zbir pojedinacnih katalogizovanih povrsina iz monografije 780,9 m2 + apsida aule + terme (povrsine ne citljive) + vila sa oktogonom/konhama popunjava do ~1.000',
    poverenje: 'visoko',
    detalji: 'mozaici_sloj.json, zbirna_provera'
  });
  poruka.push('baza: konflikt 945 vs 1000 upisan kao resen');
}
const mm = ba.mozaici_motivi;
if (mm) {
  mm.figuralni_izvor_v014 = 'svi motivi potvrdjeni nezavisno u monografiji-vila-2011 (ranije samo wiki-sr); novi: ptice sa biljnim ukrasima (uglovi aule), morski crv (postolje fontane stibadiuma A), ptica u mozaiku 6 peristila';
  mm.zbirna_povrsina_m2 = { monografija: 'oko 1000', zbir_kataloga: 780.9, napomena: 'bez apside aule, terme i vila sa oktogonom/konhama' };
}
pisi('baza_podataka.json', ba);

console.log(poruka.map(p => '  - ' + p).join('\n'));
console.log('talas_v014: JSON dopune gotove.');
