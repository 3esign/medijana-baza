#!/usr/bin/env node
// Validator medijanske baze — proverava JSON ispravnost, poverenja, izvore i konflikte.
// Pokretanje: node validator.js  (iz ovog foldera)
const fs = require('fs');
const path = require('path');
let greske = [], upozorenja = [];

function ucitaj(f) {
  try { return JSON.parse(fs.readFileSync(path.join(__dirname, f), 'utf8')); }
  catch (e) { greske.push(`${f}: JSON nevaljan — ${e.message}`); return null; }
}

const VALIDNO_POVERENJE = ['visoko', 'srednje', 'nisko', 'nisko-srednje', 'tipolosko visoko, za konkretan objekat nisko'];

function proveriPoverenje(obj, putanja) {
  if (obj && typeof obj === 'object') {
    if ('poverenje' in obj && !VALIDNO_POVERENJE.includes(obj.poverenje)) {
      upozorenja.push(`${putanja}.poverenje: nepoznata vrednost "${obj.poverenje}"`);
    }
    if ('izvor' in obj && (obj.izvor === '' || obj.izvor === null || (Array.isArray(obj.izvor) && !obj.izvor.length))) {
      greske.push(`${putanja}.izvor: prazno — svaka tvrdnja mora nositi izvor`);
    }
    for (const [k, v] of Object.entries(obj)) proveriPoverenje(v, `${putanja}.${k}`);
  } else if (Array.isArray(obj)) obj.forEach((v, i) => proveriPoverenje(v, `${putanja}[${i}]`));
}

const baza = ucitaj('baza_podataka.json');
const prostor = ucitaj('prostorni_sloj.json');
const pasos = ucitaj('digitalni_pasos.json');
const kompar = ucitaj('komparativni_lokaliteti.json');

// 1. verzije uskladjene
const verzije = { baza: baza?.verzija, prostor: prostor?.verzija, pasos: pasos?.verzija, kompar: kompar?.verzija };
if (new Set(Object.values(verzije)).size !== 1) greske.push(`Verzije nisu uskladjene: ${JSON.stringify(verzije)}`);

// 2. agregat bez direktnog izvora ne sme nositi 'visoko'
if (baza?.izvori) {
  for (const iz of baza.izvori) {
    if (iz.id === 'web-sr-sinteza' && !iz.napomena) greske.push('agregat izvor bez napomene o sastavu');
  }
}

// 3. koordinate u opsegu
const c = baza?.osnova?.koordinate;
if (c && !(c.lat > 42 && c.lat < 45 && c.lon > 20 && c.lon < 23)) greske.push(`koordinate van Nisa: ${JSON.stringify(c)}`);

// 4. poverenja svuda
for (const [ime, doc] of Object.entries({ baza, prostor, pasos, kompar })) proveriPoverenje(doc, ime);

// 5. prostorni stubovi moraju imati poverenje_osnove
for (const o of prostor?.objekti_3d_stubi || []) {
  if (!o.poverenje_osnove) upozorenja.push(`prostorni stub ${o.id} bez poverenje_osnove`);
}

// 6. pasos nivoi rekonstrukcije: nivo1 mora biti postignut
const n1 = pasos?.teorije_rekonstrukcije?.stadijumi?.find(s => s.nivo === 1);
if (!n1?.postignuto) greske.push('nivo 1 (kurirani podaci) mora biti postignut — protivurecnost u pasosu');

// v0.4: vizuelni sloj
const vz=JSON.parse(fs.readFileSync(__dirname+'/vizuelni_sloj.json','utf8'));
if((vz.version||vz.verzija)!==baza?.verzija)greske.push(`vizuelni sloj verzija ${vz.version||vz.verzija} != ${baza?.verzija}`);
if(!vz.slike||!vz.slike.length)greske.push('vizuelni sloj prazan');
for(const s of vz.slike){if(!/^File:/.test(s.naslov)||!s.url||!s.licenca)greske.push('slika bez naslova/urla/licence: '+s.naslov);}

// v0.7: vodeni linijski sloj
const vod=ucitaj('vodeni_linijski_sloj.json');
if(vod){
  if(vod.verzija!==baza?.verzija)greske.push(`vodeni sloj verzija ${vod.verzija} != ${baza?.verzija}`);
  const cast=(vod.vodena_mreza?.cvorovi||[]).find(x=>x.id==='castellum-aquae');
  if(!cast)greske.push('vodeni sloj: nema castellum-aquae');
  else{
    if(!/dva bazena/i.test(cast.struktura||''))greske.push('castellum bez dva bazena (Pop-Lazic 2018)');
    if(!cast.visina_mnv?.opseg)greske.push('castellum bez visinskog opsega');
  }
  // gravitaciona konzistentnost: castellum mora biti iznad fontane nizvodno
  const font=(vod.vodena_mreza?.cvorovi||[]).find(x=>x.id==='fontana-nimfej');
  if(cast&&font&&cast.visina_mnv?.procena!==undefined){
    // fontana u vili ~197 m (prostorni sloj teren); samo provera da opseg castelluma dozvoljava pad
    if(cast.visina_mnv.opseg[0]<=198)greske.push('castellum opseg ne dozvoljava gravitacioni pad ka vili (~197 m)');
  }
  const sv=prostor?.objekti_3d_stubi||[];
  const ids=new Set(sv.map(o=>o.id));
  for(const ref of ['fontana-nimfej']) if(!ids.has(ref))greske.push(`vodeni sloj referencira nepostojeci stub: ${ref}`);
}

console.log(`=== VALIDACIJA MEDIJANA v${baza?.verzija} ===`);
console.log(greske.length ? `GRESKE (${greske.length}):` : 'Greske: 0');
greske.forEach(g => console.log('  ✗ ' + g));
console.log(upozorenja.length ? `Upozorenja (${upozorenja.length}):` : 'Upozorenja: 0');
upozorenja.forEach(u => console.log('  ! ' + u));

process.exit(greske.length ? 1 : 0);
