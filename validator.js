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

const VALIDNO_POVERENJE = ['visoko', 'srednje', 'nisko', 'nisko-srednje', 'srednje-visoko', 'tipolosko visoko, za konkretan objekat nisko'];

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

// v0.10: skulpturni program
const sk=ucitaj('skulpturski_program.json');
if(sk){
  if(sk.verzija!==baza?.verzija)greske.push(`skulpturni program verzija ${sk.verzija} != ${baza?.verzija}`);
  const programi=sk.program_po_lokaciji||{};
  let broj=0;
  for(const [lok, unos] of Object.entries(programi)){
    for(const s of Array.isArray(unos)?unos:[unos]){
      broj++;
      if(!s.id)greske.push(`skulpturni program ${lok}: unos bez id`);
      if(!s.poverenje)upozorenja.push(`skulpturni predmet ${s.id||'?'} bez poverenja`);
      if(!s.izvor&&!sk.izvor_glavni)greske.push(`skulpturni predmet ${s.id} bez izvora`);
    }
  }
  if(broj<8)greske.push(`skulpturni program premalen (${broj} predmeta) — ocekivano >=8`);
}

// v0.10: sonde⇄stubovi sloj
const sn=ucitaj('sonde_sloj.json');
if(sn){
  if(sn.verzija!==baza?.verzija)greske.push(`sonde sloj verzija ${sn.verzija} != ${baza?.verzija}`);
  if(!sn.hronologija_horizonti||sn.hronologija_horizonti.length!==3)greske.push('sonde sloj: ocekivana 3 horizonta');
  const ids=new Set((prostor?.objekti_3d_stubi||[]).map(o=>o.id));
  for(const s of sn.sektori||[]){
    for(const ref of s.veze_na_stubove||[]){
      if(!ids.has(ref))greske.push(`sonde sloj: sektor ${s.id} referencira nepostojeci stub: ${ref}`);
    }
  }
  // kote stibadiuma B moraju se poklapati sa prostornim slojem (198.92 temelj)
  const st=(prostor?.objekti_3d_stubi||[]).find(o=>o.id==='stibadium-B');
  const s46=(sn.sonde_sa_vezom||[]).find(x=>x.sonda==='46');
  if(st&&s46&&st.visine_m_nmv&&st.visine_m_nmv.temelj_dno!==198.92)greske.push('stibadium B temelj 198.92 izgubljen — poklapanje sonde sloja i prostornog sloja naruseno');
  if(!s46)greske.push('sonde sloj: nema sonde 46 (ulaz u stibadium B)');
}


// v0.11: sektori 2-5 popunjeni, kote u fizickom opsegu, veza kota⇄DEM
{
  for(const s of sn.sektori||[]){
    if(!Array.isArray(s.sonde)||s.sonde.length===0)greske.push('sonde sloj: sektor '+(s.id||'?')+' i dalje bez sondi');
  }
  // kote u fizickom opsegu Niske kotline (~196-212)
  const kote=[];
  const seti=(o)=>{ if(typeof o==='number')return; if(Array.isArray(o)){o.forEach(seti);return;} if(o&&typeof o==='object'){for(const [k,v] of Object.entries(o)){ if(/kota|m_nmv/.test(k)&&typeof v==='number')kote.push({gde:k,v}); else seti(v);} } };
  seti(sn); seti(vod);
  for(const {gde,v} of kote){
    if(v<194||v>212)greske.push('kota van opsega ('+v+' m u '+gde+') — proveri jedinicu');
  }
  // vila: izmerena vertikala mora postojati i slaziti se sa sektorom 2
  const vp=(prostor?.objekti_3d_stubi||[]).find(o=>o.id==='vila-peristil');
  if(!vp||!vp.izmerene_kote_m_nmv)greske.push('vila-peristil bez izmerenih kota (v0.11)');
  else{
    const tk=vp.izmerene_kote_m_nmv;
    if(tk.temelj_severnog_zida_dno!==197.94)greske.push('temelj severnog zida mora biti 197.94 (sonde sektor 2 ⇄ prostorni sloj)');
    if(tk.sokl_severne_fasade!==198.02)greske.push('sokl severne fasade mora biti 198.02');
    if(!(tk.temelj_severnog_zida_dno < tk.podovi_prostorija.opseg[0]))greske.push('vertikalna logika: temelj mora biti ispod najnizeg poda');
  }
  // vodeni sloj: fizicke olovne cevi + kada + bunar
  const vid=new Set((vod.vodena_mreza?.cvorovi||[]).map(c=>c.id));
  for(const need of ['olovna-cev-prostorija-12','kada-e-12','bunar-e-12']) if(!vid.has(need))greske.push('vodeni sloj: nedostaje cvor '+need);
  // registar slika
  if(!sn.registar_slika||sn.registar_slika.length!==31)greske.push('registar slika mora imati 31 unos (Sl. 1-31)');
}

// v0.12: crtezi sloj (kote iscitane sa vektorskih crteza Starinara 64/2014)
const cr=ucitaj('crtezi_sloj.json');
if(cr){
  if(cr.verzija!==baza?.verzija)greske.push(`crtezi sloj verzija ${cr.verzija} != ${baza?.verzija}`);
  const brProfila=(cr.profili||[]).length;
  if(brProfila<6)greske.push(`crtezi sloj: ocekivano >=6 profila, ima ${brProfila}`);
  const stubIds=new Set((prostor?.objekti_3d_stubi||[]).map(o=>o.id));
  for(const p of cr.profili||[]){
    if(!p.id||!p.naslov||!p.poverenje)greske.push(`crtezi: profil bez id/naslov/poverenje`);
    for(const ref of p.stub_veza||[]){
      if(!stubIds.has(ref))greske.push(`crtezi: profil ${p.id} referencira nepostojeci stub: ${ref}`);
    }
    for(const k of [...(p.kote||[]), ...(p.kote_zapadna_strana||[]), ...(p.kote_istocna_strana||[])]){
      if(typeof k.kota!=='number'||k.kota<194||k.kota>212)greske.push(`crtezi: kota van opsega (${k.kota} u ${p.id})`);
    }
  }
  // opseg kota mora pokrivati i dno jame i asfalt
  const op=cr.kota_dem_veza?.opseg_svih_kota_crteza;
  if(!op||op[0]>197.38||op[1]<200.6)greske.push('crtezi: opseg kota ne pokriva jamu 197.38 ni asfalt 200.6');
  // numeracija prostorija W/E mora postojati
  if(!cr.plan_vile_sl1?.prostorije_zapadni?.u_planu?.length||!cr.plan_vile_sl1?.prostorije_istocni?.u_planu?.length)
    greske.push('crtezi: nedostaje numeracija prostorija W/E sa Sl. 1');
}

// v0.13: soba-po-soba sloj (sobe_sloj.json)
{
  const sb=JSON.parse(fs.readFileSync('sobe_sloj.json','utf8'));
  if(!sb.prostorije?.length)greske.push('sobe: nema prostorija');
  const dozvoljene=new Set();
  (cr.plan_vile_sl1?.prostorije_zapadni?.u_planu||[]).forEach(x=>dozvoljene.add(x.toLowerCase()));
  (cr.plan_vile_sl1?.prostorije_istocni?.u_planu||[]).forEach(x=>dozvoljene.add(x.toLowerCase()));
  const slobodne=new Set(['aula-triklinijum','trem-juzni','ulazni-deo-trema','portik-juzni-istocni-deo','prostorija-bez-broja-ulaz-peristil','prostorija-23-jug']);
  for(const p of sb.prostorije||[]){
    if(!p.id||!p.poverenje)greske.push('sobe: prostorija bez id/poverenja');
    for(const n of p.nalazi||[]){
      if(!n.tip||!(n.opis||n.period)||!n.izvor)greske.push('sobe: '+p.id+' nalaz bez tip/opis-ili-period/izvor');
      if(typeof n.kota==='number'&&(n.kota<194||n.kota>212))greske.push('sobe: '+p.id+' kota van opsega ('+n.kota+')');
      if(n.kote&&typeof n.kote==='object')for(const [kk,vv] of Object.entries(n.kote)){
        if(typeof vv==='number'&&(vv<194||vv>212))greske.push('sobe: '+p.id+' kota '+kk+' van opsega ('+vv+')');
        if(vv&&typeof vv==='object')for(const [k2,v2] of Object.entries(vv)){
          if(typeof v2==='number'&&(v2<194||v2>212))greske.push('sobe: '+p.id+' kota '+kk+'.'+k2+' van opsega ('+v2+')');
        }
      }
    }
    if(!dozvoljene.has(p.id)&&!slobodne.has(p.id))greske.push("sobe: id '"+p.id+"' nije ni u W ni u E numeraciji ni u slobodnim oznakama");
  }
  const sondaIds=new Set((sn.sonde_sa_vezom||[]).map(s=>String(s.sonda||s.id)));
  (sn.sektori||[]).forEach(sek=>(sek.sonde||[]).forEach(sd=>{const m=String(sd).match(/\d+/);if(m)sondaIds.add(m[0]);}));
  for(const vsp of sb.veza_sonda_prostorija||[]){
    if(typeof vsp.sonda==='number'&&!sondaIds.has(String(vsp.sonda)))greske.push('sobe: veza referencira sondu koja nije u sonde_sloj: '+vsp.sonda);
    if(!vsp.poverenje)greske.push('sobe: veza bez poverenja');
  }
  if(sb.kote_ekstremi?.najniza?.vrednost!==195.96)greske.push('sobe: najniza kota mora biti 195.96 (bunara jama 5, sonda 105)');
}

console.log(`=== VALIDACIJA MEDIJANA v${baza?.verzija} ===`);
console.log(greske.length ? `GRESKE (${greske.length}):` : 'Greske: 0');
greske.forEach(g => console.log('  ✗ ' + g));
console.log(upozorenja.length ? `Upozorenja (${upozorenja.length}):` : 'Upozorenja: 0');
upozorenja.forEach(u => console.log('  ! ' + u));

process.exit(greske.length ? 1 : 0);
