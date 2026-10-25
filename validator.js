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

// v0.14: mozaicki sloj (mozaici_sloj.json)
const mz = ucitaj('mozaici_sloj.json');
if (mz) {
  if ((mz.verzija || mz.version) !== baza?.verzija) greske.push(`mozaici sloj verzija ${mz.verzija || mz.version} != ${baza?.verzija}`);
  if (!mz.izvor_glavni?.id) greske.push('mozaici sloj: bez glavnog izvora');
  const stubIds = new Set((prostor?.objekti_3d_stubi || []).map(o => o.id));
  const sobaIds = new Set((JSON.parse(fs.readFileSync('sobe_sloj.json', 'utf8')).prostorije || []).map(p => p.id));
  const vidjeni = new Set();
  let zbir = 0;
  for (const m of mz.mozaici || []) {
    if (!m.id) greske.push('mozaici: unos bez id');
    if (vidjeni.has(m.id)) greske.push('mozaici: dupliran id ' + m.id);
    vidjeni.add(m.id);
    if (!m.poverenje) greske.push('mozaici: ' + m.id + ' bez poverenja');
    if (!m.izvor) greske.push('mozaici: ' + m.id + ' bez izvora');
    const veza = m.veza_na_stub || m.veza_na_prostoriju;
    if (!veza && !m.veza_napomena) greske.push('mozaici: ' + m.id + ' bez veze na stub/prostoriju i bez obrazlozenja');
    if (m.veza_na_stub && !stubIds.has(m.veza_na_stub)) greske.push('mozaici: ' + m.id + ' referencira nepostojeci stub: ' + m.veza_na_stub);
    if (m.veza_na_prostoriju && !sobaIds.has(m.veza_na_prostoriju)) greske.push('mozaici: ' + m.id + ' referencira nepostojecu prostoriju: ' + m.veza_na_prostoriju);
    if (typeof m.povrsina_m2 === 'number') zbir += m.povrsina_m2;
    if (typeof m.povrsina_zajedno_sa_moz19_m2 === 'number') zbir += m.povrsina_zajedno_sa_moz19_m2;
  }
  const deklarisano = mz.zbirna_provera?.zbir_pojedinacnih_m2;
  if (typeof deklarisano !== 'number' || Math.abs(zbir - deklarisano) > 0.05)
    greske.push(`mozaici: zbir povrsina (${zbir.toFixed(1)}) ne poklapa se sa deklarisanim (${deklarisano})`);
  // kalibracija: dekodirani brojevi moraju biti oznaceni niskim poverenjem
  for (const m of mz.mozaici || []) {
    if (m.povrsina_napomena && /dekodiran/.test(m.povrsina_napomena) && !/srednje/.test(m.poverenje))
      greske.push('mozaici: ' + m.id + ' dekodirana povrsina bez poverenja srednje');
  }
  if (!mz.figuralni_rezime?.sad?.length) greske.push('mozaici: figuralni rezime prazan');
  // vodeni sloj mora znati za fontanu stibadiuma A (moz-10)
  const vid = new Set((vod.vodena_mreza?.cvorovi || []).map(c => c.id));
  if (!vid.has('fontana-stibadium-A')) greske.push('vodeni sloj: nedostaje fontana-stibadium-A (veza sa moz-10)');
  // sobe moraju znati za w-4 (skulpture iz kataloga monografije)
  if (!sobaIds.has('w-4')) greske.push('sobe: nedostaje w-4 (porfirne skulpture, katalog monografije)');
  console.log(`mozaici: ${(mz.mozaici || []).length} unosa, zbir ${zbir.toFixed(1)} m2`);
}

// v0.15: geofizicki sloj (geofizika_sloj.json)
const gf = ucitaj('geofizika_sloj.json');
if (gf) {
  if ((gf.verzija || gf.version) !== baza?.verzija) greske.push(`geofizika sloj verzija ${gf.verzija || gf.version} != ${baza?.verzija}`);
  if (!gf.izvor_glavni) greske.push('geofizika sloj: bez glavnog izvora');
  const stubIds = new Set((prostor?.objekti_3d_stubi || []).map(o => o.id));
  const gfIds = new Set();
  for (const s of gf.strukture || []) {
    if (!s.id || !s.naziv) greske.push('geofizika: struktura bez id/naziv');
    if (gfIds.has(s.id)) greske.push('geofizika: dupliran id ' + s.id);
    gfIds.add(s.id);
    if (!s.opis) greske.push('geofizika: ' + s.id + ' bez opisa');
    if (!s.poverenje_osnove || !s.poverenje_visine) greske.push('geofizika: ' + s.id + ' bez obe oznake poverenja (osnove + visine)');
    // geofizika nikad ne daje visoko poverenje osnove bez iskopa
    if (/visoko/.test(s.poverenje_osnove || '')) greske.push('geofizika: ' + s.id + ' osnova ne sme biti visoko (nije iskopano)');
    if (s.vezan_stub && !stubIds.has(s.vezan_stub)) greske.push('geofizika: ' + s.id + ' referencira nepostojeci stub: ' + s.vezan_stub);
    if (!s.interpretacija) greske.push('geofizika: ' + s.id + ' bez interpretacije (makar "nepoznato")');
    if (!s.za_3d) greske.push('geofizika: ' + s.id + ' bez za_3d implikacije');
  }
  if (gfIds.size !== 16) greske.push(`geofizika: ocekivano 16 struktura, nadjeno ${gfIds.size}`);
  // novi stubovi iz geofizike moraju postojati u prostornom sloju
  for (const obavezan of ['horreum-istocni', 'vojni-logor-istocni']) {
    if (!stubIds.has(obavezan)) greske.push('geofizika: prostorni sloj bez stuba ' + obavezan);
  }
  // vila-peristil mora nositi detalje iz 1969
  const vp = (prostor?.objekti_3d_stubi || []).find(o => o.id === 'vila-peristil');
  if (vp && !vp.detalji_1969) greske.push('geofizika/vila: nedostaju detalji_1969 (Zotovic-Petrovic)');
  // istorijat otkrica mozaika mora postojati od v0.15
  if (mz && !(mz.istorijat_otkrica || []).length) greske.push('mozaici: nedostaje istorijat_otkrica (1969)');
  console.log(`geofizika: ${gfIds.size} struktura`);
}

// v0.16: hidraulicki sloj (hidraulika_sloj.json, Jeremić 1988)
const hyd = ucitaj('hidraulika_sloj.json');
if (hyd) {
  if ((hyd.verzija || hyd.version) !== baza?.verzija) greske.push(`hidraulika sloj verzija ${hyd.verzija || hyd.version} != ${baza?.verzija}`);
  const n = (hyd.cvorovi || []).length;
  if (n < 25) greske.push(`hidraulika: ocekivano >=25 cvorova, ima ${n}`);
  const vidi = new Set();
  for (const c of hyd.cvorovi || []) {
    if (!c.id || !c.poverenje) greske.push('hidraulika: cvor bez id/poverenja');
    if (vidi.has(c.id)) greske.push('hidraulika: dupliran id ' + c.id);
    vidi.add(c.id);
    const k = c.kota_mnm;
    const proveriKotu = v => { if (typeof v === 'number' && (v < 194 || v > 212)) greske.push(`hidraulika: kota van opsega (${v} u ${c.id})`); };
    if (typeof k === 'number') proveriKotu(k);
    else if (Array.isArray(k)) k.forEach(proveriKotu);
    if (typeof c.izvor_url !== 'string' || !c.izvor_url) greske.push(`hidraulika: ${c.id} bez izvora`);
  }
  if ((hyd.konflikti || []).length < 6) greske.push(`hidraulika: ocekivano >=6 konflikata, ima ${(hyd.konflikti || []).length}`);
  if (!(hyd.ogranicenja || []).length) greske.push('hidraulika: bez ogranicenja');
  if (!hyd.racunica?.nivo_linije?.delta_H_m) greske.push('hidraulika: bez racunice nivoa linije (pad 8,87 m)');
  console.log(`hidraulika: ${n} cvorova, ${(hyd.konflikti || []).length} konflikata`);
}

// v0.16: numizmaticki sloj (numizmaticki_sloj.json, Starinar LXIV/2014)
const num = ucitaj('numizmaticki_sloj.json');
if (num) {
  if (num.verzija !== baza?.verzija) greske.push(`numizmaticki sloj verzija ${num.verzija} != ${baza?.verzija}`);
  if (!num.izvor_glavni) greske.push('numizmaticki sloj: bez glavnog izvora');
  const unosa = (num.novac || []).length;
  if (unosa < 20) greske.push(`numizmaticki sloj: ocekivano >=20 unosa, ima ${unosa}`);
  const vidi = new Set();
  for (const u of num.novac || []) {
    if (!u.id || !u.carevi_period) greske.push('numizmaticki sloj: unos bez id/carevi_period');
    if (vidi.has(u.id)) greske.push('numizmaticki sloj: dupliran id ' + u.id);
    vidi.add(u.id);
    if (typeof u.izvor_url !== 'string' || !u.izvor_url) greske.push(`numizmaticki sloj: ${u.id} bez izvora`);
    if (!u.poverenje) greske.push(`numizmaticki sloj: ${u.id} bez poverenja`);
    if (!u.znacaj_za_hronologiju) greske.push(`numizmaticki sloj: ${u.id} bez znacaja za hronologiju`);
  }
  if ((num.konflikti || []).length < 3) greske.push('numizmaticki sloj: ocekivano >=3 konflikta');
  if (!num.ogranicenja?.length) greske.push('numizmaticki sloj: bez ogranicenja');
  console.log(`numizmatika: ${unosa} unosa, ${(num.konflikti || []).length} konflikata`);
}

// v0.16: objekti C-D sloj (objekti_cd_sloj.json)
const ocd = ucitaj('objekti_cd_sloj.json');
if (ocd) {
  if (ocd.verzija !== baza?.verzija) greske.push(`objekti_cd sloj verzija ${ocd.verzija} != ${baza?.verzija}`);
  if (!ocd.izvor_glavni) greske.push('objekti_cd sloj: bez glavnog izvora');
  if (!ocd.status_slovnog_sistema?.negativni_nalaz) greske.push('objekti_cd sloj: bez statusa slovnog sistema');
  const m = (ocd.mere || []).length;
  if (m < 12) greske.push(`objekti_cd sloj: ocekivano >=12 skupina mera, ima ${m}`);
  const vidi = new Set();
  for (const x of ocd.mere || []) {
    if (!x.id || !x.opis) greske.push('objekti_cd sloj: mera bez id/opisa');
    if (vidi.has(x.id)) greske.push('objekti_cd sloj: dupliran id ' + x.id);
    vidi.add(x.id);
    if (typeof x.izvor !== 'string' || !x.izvor) greske.push(`objekti_cd sloj: ${x.id} bez izvora`);
    if (!x.poverenje) greske.push(`objekti_cd sloj: ${x.id} bez poverenja`);
  }
  if ((ocd.konflikti || []).length < 3) greske.push('objekti_cd sloj: ocekivano >=3 konflikta');
  if (!/Zenice/.test(ocd.zamka_zenica || '')) greske.push('objekti_cd sloj: zamka Zenica mora ostati upisana');
  console.log(`objekti_cd: ${m} skupina mera, ${(ocd.konflikti || []).length} konflikata`);
}

// v0.16: GIS izvori sloj (gis_izvori_sloj.json) — kandidati moraju ostati vidljivo neprovereni
const gis = ucitaj('gis_izvori_sloj.json');
if (gis) {
  if (gis.verzija !== baza?.verzija) greske.push(`gis izvori sloj verzija ${gis.verzija} != ${baza?.verzija}`);
  if (!gis.upozorenje) greske.push('gis izvori sloj: bez upozorenja o neproverenim kandidatima');
  const n = (gis.izvori || []).length;
  if (n < 25) greske.push(`gis izvori sloj: ocekivano >=25 izvora, ima ${n}`);
  const vidi = new Set();
  for (const iz of gis.izvori || []) {
    if (!iz.id || !iz.status_provere) greske.push('gis izvori sloj: izvor bez id/status_provere');
    if (vidi.has(iz.id)) greske.push('gis izvori sloj: dupliran id ' + iz.id);
    vidi.add(iz.id);
    if (!iz.vrednost_za_3d) greske.push(`gis izvori sloj: ${iz.id} bez vrednost_za_3d`);
    // kandidat ne sme nositi visoko poverenje
    if (/^kandidat/.test(iz.status_provere) && /^visoko/.test(iz.poverenje || ''))
      greske.push(`gis izvori sloj: kandidat ${iz.id} ne sme nositi visoko poverenje`);
  }
  if (!(gis.otvoreni_zadaci || []).length) greske.push('gis izvori sloj: bez otvorenih zadataka');
  const kand = (gis.izvori || []).filter(i => /^kandidat/.test(i.status_provere)).length;
  console.log(`gis izvori: ${n} izvora (${kand} kandidata, ${n - kand} provereno ranije)`);
}

// v0.16: komparativni korpus prosiren
if (kompar) {
  if ((kompar.lokaliteti || []).length < 12) greske.push(`komparativni sloj: ocekivano >=12 lokaliteta posle v0.16, ima ${(kompar.lokaliteti || []).length}`);
  if (!kompar.tipologija_aule?.pojas?.length) greske.push('komparativni sloj: bez tipologije aule (v0.16)');
  if (!kompar.visinska_sidra?.ocuvano_visoko?.length) greske.push('komparativni sloj: bez visinskih sidara (v0.16)');
  const trogirani = (kompar.lokaliteti || []).filter(l => l.id === 'trier-aula-palatina' || l.korpus_v016).length;
  console.log(`komparativni sloj: ${(kompar.lokaliteti || []).length} lokaliteta`);
}

// v0.16: vodeni sloj mora znati za novonastale cvorove i korekcije
if (vod) {
  const vid = new Set((vod.vodena_mreza?.cvorovi || []).map(c => c.id));
  for (const need of ['kanal-e-distributivni', 'tocno-mesto-kadijunica-terme', 'premestanje-kasteluma', 'fontana-oktagon'])
    if (!vid.has(need)) greske.push('vodeni sloj: nedostaje cvor ' + need + ' (v0.16)');
  const cast = (vod.vodena_mreza?.cvorovi || []).find(c => c.id === 'castellum-aquae');
  if (cast && !cast.premestanje_posle_iskopa) greske.push('vodeni sloj: castellum bez napomene o premeštanju posle iskopavanja (v0.16)');
  if (!vod.hidraulika_v016?.pad_linije) greske.push('vodeni sloj: bez hidraulickog rezimea v0.16 (pad linije 8,87 m)');
}

// v0.17: epigrafski sloj (epigrafski_sloj.json)
{
  const ep = ucitaj('epigrafski_sloj.json');
  if (ep.verzija !== baza?.verzija) greske.push(`epigrafski sloj verzija ${ep.verzija} != ${baza?.verzija}`);
  if (!Array.isArray(ep.natpisi) || ep.natpisi.length < 8) greske.push(`epigrafski sloj: ocekivano >=8 natpisa, ima ${Array.isArray(ep.natpisi) ? ep.natpisi.length : 0}`);
  const epi = new Set((ep.natpisi || []).map(n => n.id));
  for (const need of ['epi-001', 'epi-006', 'epi-007']) if (!epi.has(need)) greske.push('epigrafski sloj: nedostaje ' + need);
  for (const n of (ep.natpisi || [])) if (!n.status_dokaza && !n.poverenje) greske.push('epigrafski sloj: natpis bez poverenja/statusa: ' + (n.id || '?'));
  if (!ep.korpusne_veze || !ep.korpusne_veze.EDCS) greske.push('epigrafski sloj: bez korpusnih veza (EDCS obrazac)');
  console.log(`epigrafski sloj: ${(ep.natpisi || []).length} natpisa`);
}

console.log(`=== VALIDACIJA MEDIJANA v${baza?.verzija} ===`);
console.log(greske.length ? `GRESKE (${greske.length}):` : 'Greske: 0');
greske.forEach(g => console.log('  ✗ ' + g));
console.log(upozorenja.length ? `Upozorenja (${upozorenja.length}):` : 'Upozorenja: 0');
upozorenja.forEach(u => console.log('  ! ' + u));

process.exit(greske.length ? 1 : 0);
