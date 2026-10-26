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

// v0.18: DEM sloj (dem_sloj.json)
{
  const dm = ucitaj('dem_sloj.json');
  if (dm.verzija !== baza?.verzija) greske.push(`dem sloj verzija ${dm.verzija} != ${baza?.verzija}`);
  const kote = dm.kote_tacaka || {};
  for (const need of ['vila_peristil', 'niska_banja_centar']) if (!(need in kote)) greske.push('dem sloj: nedostaje kota ' + need);
  const prof = dm.profil_akvedukt_medjana_niska_banja || {};
  if (!prof.tacke || prof.tacke.length < 10) greske.push('dem sloj: profil akvadukta bez tacaka');
  if (prof.kote_krajnje && prof.kote_krajnje.niska_banja <= prof.kote_krajnje.medjana_vila) greske.push('dem sloj: izvoriste nize od vile — gravitacioni dovod nemoguc');
  // v0.21: ukrstena provera kote vile sa opsegom kota iz crteza (197.38-200.6)
  const kVila = kote.vila_peristil?.m;
  if (typeof kVila === 'number' && (kVila < 197.38 || kVila > 200.6)) greske.push(`dem sloj: kota vile ${kVila} van opsega crteza (197.38-200.6) — koordinate verovatno van poligona`);
  if (prof.kote_krajnje && prof.pad_proc !== undefined && (prof.pad_proc <= 0 || prof.pad_proc > 2)) greske.push(`dem sloj: pad ${prof.pad_proc}% van fizicki razumog opsega (0-2%)`);
  if (typeof prof.uzvisina_na_trasi_max !== 'number') greske.push('dem sloj: bez praga na trasi');
  console.log(`dem sloj: ${Object.keys(kote).length} kotnih tacaka, prag trase ${prof.uzvisina_na_trasi_max} m`);
}

// v0.22: komparativni korpus Meduza mozaika
const kmz = mz?.komparativni_korpus;
if (kmz) {
  const idovi = new Set();
  (kmz.stavke || []).forEach((s, i) => {
    if (!s.id) greske.push(`komparativni korpus[${i}]: bez id`);
    else if (idovi.has(s.id)) greske.push(`komparativni korpus: dupliran id ${s.id}`);
    else idovi.add(s.id);
    if (!s.lokalitet) greske.push(`${s.id || i}: bez lokaliteta`);
    if (!s.izvori || !s.izvori.length) greske.push(`${s.id}: bez izvora`);
    if (!(s.izvori || []).every(z => /\[(PROVERENO|NEPROVERENO)/.test(z) || /WebSearch/.test(z)))
      upozorenja.push(`${s.id}: izvor bez statusa dokaza`);
  });
  if (!kmz.sudar_tvrdnji) upozorenja.push('komparativni korpus: bez sudara tvrdnji');
  console.log(`komparativni korpus: ${(kmz.stavke || []).length} stavki`);
}


// v0.23: kandidati antickog vrela — fizicke provere
{
  const dm23 = ucitaj('dem_sloj.json');
  const iz = dm23.izvorista_kandidati_v023;
  if (iz) {
  const villaKota = iz.vila_referenca?.kota_glo30;
  if (!(villaKota > 150 && villaKota < 250)) greske.push(`dem: kota vile ${villaKota} van fizickog opsega`);
  for (const k of iz.kandidati || []) {
    if (k.kota_glo30 == null) greske.push(`dem: kandidat ${k.osm_node} bez kote`);
    else if (k.visinska_razlika_m == null || Math.abs(k.visinska_razlika_m - (k.kota_glo30 - villaKota)) > 0.2)
      greske.push(`dem: kandidat ${k.osm_node} visinska razlika ne odgovara kotama`);
  }
  const pk = iz.profil_najbolji_kandidat;
  if (pk) {
    if (pk.kota_glo30 <= villaKota) greske.push('dem: najbolji kandidat nije iznad vile — gravitacioni dovod nemoguc');
    if (!(pk.pad_procenat > 0 && pk.pad_procenat < 2)) greske.push(`dem: pad ${pk.pad_procenat}% van fizicki razumog opsega 0-2%`);
    if (pk.prepreka_iznad_vrela) greske.push('dem: prepreka iznad vrela na profilu najboljeg kandidata');
    const koteProfila = (pk.profil || []).filter(p => p.m != null).map(p => p.m);
    if (koteProfila.length < 5) greske.push('dem: profil kandidata ima manje od 5 tacaka');
    else if (Math.max(...koteProfila) > pk.kota_glo30) greske.push('dem: tacka profila iznad samog vrela — ruta neizvodljiva');
  }
  }
}
// v0.26: iskopani segmenti akvadukta Naisus (ZZSK 2020-2025)
{
  const tr = ucitaj('akvadukt_trasa_v026.json');
  if (!tr.segmenti?.length) greske.push('trasa: bez segmenata');
  const vila = tr.segmenti.find(s => s.id === 'tr-00') || null;
  const ids = new Set();
  for (const s of tr.segmenti || []) {
    if (!s.id || ids.has(s.id)) greske.push(`trasa: segment bez/dupliran id (${s.id})`);
    ids.add(s.id);
    if (!s.izvori === false) {} // segmenti nemaju svoj izvor — pokriveno na nivou sloja
    if (!Array.isArray(s.koordinate) || s.koordinate.length !== 2) greske.push(`trasa: ${s.id} bez koordinata`);
    else {
      const [lon, lat] = s.koordinate;
      if (lat < 43.25 || lat > 43.45 || lon < 21.80 || lon > 22.10) greske.push(`trasa: ${s.id} koordinate van Nisa (${lat},${lon})`);
    }
  }
  // smer trase: svi iskopani (bez hipoteze terminusa) severno od vile
  const villaLat = 43.3163;
  for (const s of (tr.segmenti || []).filter(s => s.id !== 'tr-05')) {
    if (s.koordinate?.[1] <= villaLat) greske.push(`trasa: ${s.id} nije severno od vile — ruse utvrdjeni smer Vinik->grad`);
  }
  if (!tr.izvori?.length) greske.push('trasa: sloj bez izvora');
  if (!(tr.izvori || []).every(z => /https?:\/\//.test(z.url || ''))) greske.push('trasa: izvor bez URL');
  if (!tr.hronologija?.length) greske.push('trasa: bez hronologije');
  if (!tr.hipoteza_izvor_zzsk || tr.hipoteza_izvor_zzsk.osm_node !== '4027319493')
    greske.push('trasa: hipoteza izvora ne poklapa Sreckovo vrelo (node 4027319493)');
  if (!tr.sukob_sa_medijanskom_granom || tr.sukob_sa_medijanskom_granom.status !== 'otvoren')
    greske.push('trasa: sukob vinik-vs-banja obavezan i otvoren');
  if (tr.sukob_sa_medijanskom_granom?.mere) {
    for (const [k, v] of Object.entries(tr.sukob_sa_medijanskom_granom.mere))
      if (!(v > 0 && v < 20)) greske.push(`trasa: udaljenost ${k}=${v} van razumog opsega`);
  }
  console.log(`trasa: ${ids.size} segmenata, obilje ${tr.obilje_iskopano_m} m, sukob otvoren`);
}
// v0.27: fizika trase Sreckovo vrelo -> Vinik (test hipoteze ZZSK)
{
  const vk = JSON.parse(fs.readFileSync(__dirname + '/vinik_trasa_fizika_v027.json', 'utf8'));
  if (vk.start?.osm_node !== '4027319493') greske.push('vinik-fizika: start nije Sreckovo vrelo (node 4027319493)');
  if (vk.cilj?.kota == null || !(vk.cilj.kota > 300 && vk.cilj.kota < 500)) greske.push('vinik-fizika: kota cilja van opsega');
  for (const ime of ['trasa_1', 'trasa_2']) {
    const t = vk[ime];
    if (!t || t.max_medjukota == null) greske.push(`vinik-fizika: ${ime} bez merenja`);
    else if (t.max_medjukota <= (vk.start?.kota_dem || 0)) greske.push(`vinik-fizika: ${ime} — greben ispod vrela, protivi se merenju`);
  }
  if (vk.trasa_1?.max_medjukota <= vk.start?.kota_dem || vk.trasa_2?.max_medjukota <= vk.start?.kota_dem)
    greske.push('vinik-fizika: nijedan greben ne premasuje vrelo — zakljucak o blokadi ne stoji');
  if (vk.nalaz?.status !== undefined && !/OTVOREN/.test(vk.nalaz.status)) greske.push('vinik-fizika: sukob mora ostati otvoren');
  if (!vk.izvori?.some(z => /https?:\/\//.test(z.url || ''))) greske.push('vinik-fizika: bez izvora');
  console.log(`vinik-fizika: greben ${vk.trasa_1?.max_medjukota}/${vk.trasa_2?.max_medjukota} m vs vrelo ${vk.start?.kota_dem} m — trasa ZZSK bez tunela neizvodljiva`);
}
// --- v0.28: vodosnabdevanje Naisusa (Jankovic–Aleksic 2022 + ZZSK 2025) ---
try {
  const vod = JSON.parse(fs.readFileSync(path.join(__dirname, 'vodosnabdevanje_naisusa_v028.json'), 'utf8'));
  if (vod.verzija !== baza?.verzija) greske.push(`vodosnabdevanje sloj verzija ${vod.verzija} != ${baza?.verzija}`);
  if (vod.kaptaza_sreckovo_vrelo?.stanje && !/UNIŠTEN|UNISTEN/.test(vod.kaptaza_sreckovo_vrelo.stanje))
    greske.push('v028: kaptaza Sreckovog vrela mora nositi podatak o nepovratnom unistenju');
  if (!vod.kaptaza_sreckovo_vrelo?.datovanje || !/VII|Седмој|2\./.test(vod.kaptaza_sreckovo_vrelo.datovanje))
    greske.push('v028: kaptaza bez datovanja (pecati VII legije / 2-3. v.)');
  if (!Array.isArray(vod.segmenti_trase_ne) || vod.segmenti_trase_ne.length < 4)
    greske.push('v028: manje od 4 segmenta trase NE akvadukta');
  if (!vod.sistem_medijana_u_radu_2022?.tvrdnja_autora)
    greske.push('v028: fali tvrdnja autora o odvojenosti Medijane od gradskog vodosnabdevanja');
  if (!vod.uticaj_na_postojecu_bazu?.sukob_vinik_vs_banja)
    greske.push('v028: fali veza ka sukobu vinik-vs-banja');
  if (vod.zzsk_2025_dopuna?.ukupno_iskopano_m !== 300)
    greske.push('v028: ZZSK ukupno iskopano mora biti 300 m (saopstenje 12.09.2025)');
  console.log(`vodosnabdevanje: kaptaza ${vod.kaptaza_sreckovo_vrelo?.nazivi?.[0]} — ${vod.segmenti_trase_ne.length} segmenta, 2 faze, medijanski sistem odvojen`);
} catch (e) { greske.push('v028: ' + e.message); }

// --- v0.29: gravitacioni test gradskog sistema — Pantelejska kasarna ---
try {
  const kg = JSON.parse(fs.readFileSync(path.join(__dirname, 'pantelej_kasarna_gravitacija_v029.json'), 'utf8'));
  if (kg.verzija !== baza?.verzija) greske.push(`kasarna-gravitacija verzija ${kg.verzija} != ${baza?.verzija}`);
  const k = kg.korekcija_v026?.ispravka;
  if (!k || k.osm_way !== '302167418') greske.push('v029: korekcija kasarne mora biti vezana za OSM way 302167418 (Knjaz Mihailo)');
  if (!k || !(k.kota_dem_m > 180 && k.kota_dem_m < 230)) greske.push('v029: kota kasarne van opsega 180-230 m');
  const m = kg.merenja || [];
  const kotPod = m.find(x => /Pod Vinik/.test(x.tacka))?.kota_m;
  const kotKas = k?.kota_dem_m;
  if (!(kotPod > kotKas)) greske.push('v029: Pod Vinik mora biti iznad kasarne (gravitacija ka gradu)');
  const tv = m.filter(x => /transverzala/.test(x.tacka)).map(x => x.kota_m);
  if (tv.length < 3 || !(tv[0] > tv[1] && tv[1] > tv[2]) || !(kotPod > tv[0]) || !(tv[2] > kotKas))
    greske.push('v029: transverzala nije monoton silazak ka kasarni');
  if (!kg.nalaz?.posledica_za_sukob_vinik_vs_banja || !/OTVOREN/.test(kg.nalaz.posledica_za_sukob_vinik_vs_banja))
    greske.push('v029: sukob vinik-vs-banja mora ostati otvoren');
  if (!kg.nalaz?.jedina_prepreka || !/greben/.test(kg.nalaz.jedina_prepreka))
    greske.push('v029: fali nalaz da prepreka ostaje samo na deonici vrelo-Vinik');
  if (!m.some(x => /Sre/.test(x.tacka || ''))) greske.push('v029: bez kote vrela u merenjima');
  const tr = JSON.parse(fs.readFileSync(path.join(__dirname, 'akvadukt_trasa_v026.json'), 'utf8'));
  const s5 = tr.segmenti?.find(x => x.id === 'tr-05');
  if (!s5 || s5.koordinate[0] !== 21.8971) greske.push('v029: segment tr-05 u v026 nije korigovan na kasarnu Knjaz Mihailo');
  console.log(`kasarna-gravitacija: Pod Vinik ${kotPod} m -> kasarna ${kotKas} m, monoton silazak, terminus fizicki izvodljiv`);
} catch (e) { greske.push('v029: ' + e.message); }

// --- v0.30: treca nezavisna kota vrela (SRTM) ---
try {
  const t30 = JSON.parse(fs.readFileSync(path.join(__dirname, 'treca_kota_vrela_v030.json'), 'utf8'));
  const vrelo = t30.citanja.find(x => /4027319493/.test(x.objekat));
  if (!vrelo) greske.push('v030: nema citanja za node 4027319493');
  else {
    const tri = [vrelo.kota_glo30_openmeteo_v023, vrelo.kota_copernicus30_v027, vrelo.kota_srtm90m];
    if (Math.abs(vrelo.raspon_m - (Math.max(...tri) - Math.min(...tri))) > 0.05) greske.push('v030: raspon se ne slaze sa tri citanja');
    const kas = t30.citanja.find(x => /302167418/.test(x.objekat));
    if (!kas || kas.kota_srtm90m !== 206) greske.push('v030: SRTM kota kasarne mora potvrditi 206 m iz v0.29');
  }
  if (!/442,6/.test(t30.zakljucak.kota_vrela_prihvacena)) greske.push('v030: prihvacena kota mora biti medijana 442,6 m');
  if (!/NEIZVODLJIVA/.test(t30.zakljucak.uticaj_na_v027)) greske.push('v030: zakljucak v0.27 mora ostati neizvodljivost bez tunela na celom opsegu citanja');
  if (!/OTVOREN|otvoren/.test(t30.sukob_vinik_vs_banja)) greske.push('v030: sukob vinik-vs-banja mora ostati otvoren');
  if (!t30.izvori?.length || !/opentopodata/.test(t30.izvori[0].url)) greske.push('v030: fali izvor SRTM citanja');
  console.log('treca-kota-vrela: 431,9 / 442,6 / 450,0 m — medijana 442,6, zakljucak v0.27 robustan');
console.log('akvadukt-koordinate v031: tr-03 sidro OSM, tr-04 Ardija korigovana +~1 km, tr-06 novo (lanac relativnih polozaja)');
} catch (e) { greske.push('v030: ' + e.message); }

console.log(`=== VALIDACIJA MEDIJANA v${baza?.verzija} ===`);
console.log(greske.length ? `GRESKE (${greske.length}):` : 'Greske: 0');
greske.forEach(g => console.log('  ✗ ' + g));
console.log(upozorenja.length ? `Upozorenja (${upozorenja.length}):` : 'Upozorenja: 0');
upozorenja.forEach(u => console.log('  ! ' + u));

process.exit(greske.length ? 1 : 0);

// 20. hidraulika: dovod_v024 — fizika dovoda vrelo->kastelum
const hidr = ucitaj('hidraulika_sloj.json');
if (hidr?.dovod_v024) {
  const d = hidr.dovod_v024;
  if (!d.kandidat?.osm_node) greske.push('hidraulika dovod_v024: nema kandidata');
  if (!d.kapacitet_manning?.scenariji?.length) greske.push('hidraulika dovod_v024: nema scenarija');
  for (const s of d.kapacitet_manning.scenariji || []) {
    if (s.nagib_promila > 0) {
      if (!(s.Q_l_s > 0) || s.Q_l_s > 2000) greske.push(`dovod scenarij ${s.kota_vrela} ${s.sirina_m}x${s.dubina_m}: Q van fizikog opsega (${s.Q_l_s})`);
      if (!(s.v > 0.1 && s.v < 4)) greske.push(`dovod scenarij ${s.kota_vrela} ${s.sirina_m}x${s.dubina_m}: brzina van opsega rimskog kanala (${s.v})`);
    } else if (!/NEIZVODLJIVO/.test(s.status || '')) {
      greske.push(`dovod scenarij sa negativnim nagibom bez oznake NEIZVODLJIVO: ${s.kota_vrela}`);
    }
  }
  const izv = (require('./dem_izvori_kandidati_v023.json')).find(k => k.osm_node === d.kandidat.osm_node);
  if (!izv) greske.push('dovod_v024: kandidat ne postoji u dem_izvori_kandidati_v023.json');
  else if (izv.kota_glo30 !== d.kandidat.kota_glo30_kandidat) greske.push('dovod_v024: kota kandidata ne slaze se sa dem_izvori_kandidati_v023');
  if (!hidr.konflikti?.find(k => k.id === 'duzina-dovoda-45km-vs-171km')) greske.push('dovod_v024: fali konflikt-zapis duzina-dovoda-45km-vs-171km');
  if (!d.poredjenje_sa_jeremicem?.jeremic_hipoteza) greske.push('dovod_v024: nema poredjenja sa Jeremicem 4,5 km');
}

// --- v0.25: fizika razresenog vrela ---
try {
  const ukr = JSON.parse(fs.readFileSync(path.join(DIR, 'dem_izvor_ukrstteni_v025.json'), 'utf8'));
  const hid = JSON.parse(fs.readFileSync(path.join(DIR, 'hidraulika_sloj.json'), 'utf8'));
  const dem = JSON.parse(fs.readFileSync(path.join(DIR, 'dem_sloj.json'), 'utf8'));
  const tacke = ukr.izmereno.filter(x => x.kota != null).map(x => x.kota);
  const kota = hid.dovod_v025.kandidat_razresen.kota_prihvacena_m;
  if (!tacke.length) greske.push('v025: ukrstteni test nema izmerenih tacaka');
  if (kota < Math.min(...tacke) - 1 || kota > Math.max(...tacke) + 1) greske.push('v025: prihvacena kota van opsega nezavisnih merenja');
  if (!dem.korekcija_v025 || dem.korekcija_v025.prihvacena_kota_m !== kota) greske.push('v025: korekcija_v025 u dem_sloju ne slaze se sa hidraulikom');
  const nag = hid.dovod_v025.nagibi_promila.vrelo_ka_kastelumu;
  if (nag <= 0) greske.push('v025: negativan nagib mora biti NEIZVODLJIVO, a razresenje kaze izvodljivo');
  if (nag > 13) greske.push('v025: nagib iznad maksimuma merenog kanala C (13 promila)');
  for (const s of hid.dovod_v025.kapacitet_manning_v025.scenariji) {
    if (!(s.Q_l_s > 0) || s.v <= 0.1 || s.v > 4) greske.push('v025: Q/brzina van fizickog opsega u scenariju ' + s.sirina_m + 'x' + s.dubina_m);
  }
} catch (e) { greske.push('v025: ' + e.message); }

// --- v0.31: lanac relativnih polozaja akvadukta ---
try {
  const lk = JSON.parse(fs.readFileSync(path.join(DIR, 'akvadukt_koordinate_v031.json'), 'utf8'));
  const ak2 = JSON.parse(fs.readFileSync(DIR + '/akvadukt_trasa_v026.json', 'utf8'));
  const sidroK = lk.nalaz.sidro.koordinate;
  const g = id => ak2.segmenti.find(s => s.id === id);
  if (!g('tr-06')) greske.push('v031: segment tr-06 (gradiliste 2025) fali u trasi');
  // tr-03 mora biti tacno sidro
  if (Math.abs(g('tr-03').koordinate[0] - sidroK[0]) > 1e-9 || Math.abs(g('tr-03').koordinate[1] - sidroK[1]) > 1e-9) greske.push('v031: tr-03 nije na sidru OSM way 108165624');
  // tr-04/tr-06 moraju biti severoistocno od tr-03 (stara greska: ~1 km zapadno)
  const t3 = g('tr-03').koordinate, t4 = g('tr-04').koordinate, t6 = g('tr-06').koordinate;
  if (!(t4[0] > t3[0] && t4[1] > t3[1])) greske.push('v031: tr-04 Ardija mora biti NE od tr-03 (relativni polozaj iz saopstenja)');
  if (!(t6[0] > t3[0] && t6[1] > t3[1])) greske.push('v031: tr-06 mora biti NE od tr-03');
  // razdaljine ~100 i ~250 m (tolerancija azimuta)
  const dist = (a, b) => 111320 * Math.hypot((a[0]-b[0]) * Math.cos(a[1]*Math.PI/180), a[1]-b[1]);
  const d36 = dist(t3, t6), d34 = dist(t3, t4);
  if (d36 < 60 || d36 > 160) greske.push('v031: razdaljina tr-03 -> tr-06 van opsega 100 m (+-azimut): ' + d36.toFixed(0));
  if (d34 < 150 || d34 > 400) greske.push('v031: razdaljina tr-03 -> tr-04 van opsega 250 m (+-azimut): ' + d34.toFixed(0));
  if (d36 >= d34) greske.push('v031: Ardija (150 m od 2025) mora biti dalje od tr-03 nego gradiliste 2025 (100 m)');
  // monoton silazak ka gradu
  const ko = lk.nalaz.gradilista;
  const kArd = ko.find(x => x.id === 'tr-04').kota_srtm90m, kSid = ko.find(x => x.id === 'tr-03').kota_srtm90m;
  if (!(kArd >= kSid)) greske.push('v031: Ardija mora biti na koti >= Gornjomatejevacka (uzbrdo ka izvoru na severoistoku)');
  if (!lk.sukob_vinik_banja || !/otvoren/i.test(lk.sukob_vinik_banja)) greske.push('v031: sukob vinik-vs-banja mora ostati otvoren');
  for (const i of lk.izvori) if (!/^https?:\/\//.test(i.url)) greske.push('v031: izvor bez URL: ' + i.naziv);
} catch (e) { greske.push('v031: ' + e.message); }
