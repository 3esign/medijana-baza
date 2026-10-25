#!/usr/bin/env node
// Talas v0.10 — skulpturni program (Carska ideologija) + sonde⇄stubovi (Iskopavanja 2010/2011)
const fs = require('fs');
function citaj(f){ return JSON.parse(fs.readFileSync(f,'utf8')); }
function pisi(f,o){ fs.writeFileSync(f, JSON.stringify(o,null,1)+'\n','utf8'); console.log(f,'azuriran'); }

// 1. verzije na 0.10
for(const f of ['baza_podataka.json','prostorni_sloj.json','digitalni_pasos.json','komparativni_lokaliteti.json','vodeni_linijski_sloj.json','vizuelni_sloj.json','vizuelni_nalazi.json']){
  const o=citaj(f);
  if(o.verzija!==undefined) o.verzija='0.10';
  if(o.version!==undefined) o.version='0.10';
  o.datum='2026-10-25';
  pisi(f,o);
}

// 2. baza: konflikt "pocetak istrazivanja" RESEN (1864 Kanic), novi konflikti reseni, istrazivanja, nalazi
const b=citaj('baza_podataka.json');
const k=b.konflikti_izmedju_izvora.find(x=>x.tema==='pocetak istrazivanja');
if(k){ k.resenje='RESENO: iskopavanja zapoceta 1864. (Feliks Kanic) — 150 godina navrseno 2014 (Vasic/Milosevic/Gavrilovic, Starinar 64/2014, uvodni pasus); 1803/04 ostaje bez primarnog izvora i tretira se kao greska agregata'; k.status='resen'; k.izvor='iskopi-2010-2011'; }
b.konflikti_izmedju_izvora.push({
  tema:'datum bronzane ograde sa hermama',
  a:'oko 324 (Vasic, Bronze Railing — datum izrade)',
  b:'izrada pre 325, postavka na Medijanu 361 (boravak Julijana u Nisu), zakopana 378 pred Gote (Milosevic, Carska ideologija, fusnota 21)',
  resenje:'RESENO: tri datuma, jedan predmet — izrada (~324) nije postavka (361) ni zakop (378); stub u vodenom sloju azuriran',
  status:'resen', poverenje:'visoko'
});
b.konflikti_izmedju_izvora.push({
  tema:'hronologija vile sa peristilom',
  a:'vila nastala reorganizacijom oko 330 (monografija: prepravka i prosirenje trema zapoceta oko 330)',
  b:'osnovni plan vile u horizontu 1 = prve decenije 4. veka, "suprotno ranijim misljenjima" (Starinar 64/2014)',
  resenje:'RESENO: dve faze — pre reorganizacije oko 330 na mestu je bila monumentalna zgrada jednostavne izduzene forme sa velikim dvoristem (pretorium?), verovatno iz vremena dvovlasca Konstantin i Licinije; oko 330 velika prepravka; horizont 2 (330-378) prepravke stibadijumi A i B',
  status:'resen', poverenje:'visoko', izvor:'iskopi-2010-2011 + carska-ideologija'
});
if(!b.istrazivanja.some(x=>String(x.godina).includes('1864'))){
  b.istrazivanja.unshift({godina:1864, opis:'prva iskopavanja — Feliks Kanic; 150 godina istrazivackih radova navrseno 2014', izvor:'iskopi-2010-2011 (Starinar 64/2014, uvod)', poverenje:'visoko', resava:'konflikt pocetak istrazivanja (1803/04)'});
}
if(!b.istrazivanja.some(x=>String(x.godina).includes('2010'))){
  const i=b.istrazivanja.findIndex(x=>String(x.godina).includes('2011'));
  b.istrazivanja.splice(i>=0?i:0,0,{godina:'2010-2011', opis:'devet meseci iskopavanja vile sa peristilom — sonde 42/2004-91, pet sektora, tri horizonta', izvor:'iskopi-2010-2011 (Starinar 64/2014, 231-263)', poverenje:'visoko'});
}
b.nalazi.push(
  {nalaz:'porfirna glava (deo) — kompozicija dijarhije Konstantin i Licinije, Iovii et Herculii', kontekst:'hram na forumu Naisusa, NE Medijana', hronologija:'311-316 (decenija vladavine 315)', izvor:'carska-ideologija', poverenje:'srednje', napomena_poverenja:'identifikacija stilski argumentovana; "dvojna herma?" hipoteza autora'},
  {nalaz:'Dea Dardanica — statua na ulazu u vilu', znacaj:'dea patriae; poreklo dinastije (Konstancije Hlor, Dardanac)', hronologija:'pripisana prepravci oko 330', izvor:'carska-ideologija', poverenje:'srednje-visoko'},
  {nalaz:'skulpture uglavnom DEKAPITIRANE (netrpeljivost hriscana prema paganskim kultovima)', znacaj:'broj ocuvanih glava NI merilo broja statua — pravilo za rekonstrukciju opreme', izvor:'carska-ideologija', poverenje:'visoko'},
  {nalaz:'skulpturni program vile medju najbogatijim u celom carstvu (mermer + porfir)', izvor:'Vasic 1975 (Starinar n.s. XXIV-XXV, 58-60) preko carska-ideologija', poverenje:'visoko'}
);
pisi('baza_podataka.json',b);

// 3. prostorni sloj: novi stub zgrade oko stibadiuma B + hronologija vile
const p=citaj('prostorni_sloj.json');
if(!p.objekti_3d_stubi.some(s=>s.id==='zgrade-oko-stibadiuma-B')){
  p.objekti_3d_stubi.push({
    id:'zgrade-oko-stibadiuma-B',
    naziv:'Zgrade oko stibadijuma B (severno od njega)',
    tip:'mikrotvorba — stambene/pratece zgrade',
    polozaj:'severno od stibadiuma B, sonde 88 i 90 (sektor 1)',
    konstrukcija:'temelji od oblutaka vezanih blatom, ukopani u sloj D',
    visine_m_nmv:{kruna_zida:199.13, sokl:198.65, izvor:'Vasic/Milosevic/Gavrilovic 2014, sonde 88 i 90'},
    hronologija:'nakon stibadijuma B; gornji nivo sloja D stambeni nivo; krovovi u sloju C (posle ~380, horizont 3)',
    poverenje_osnove:'visoko (iskop 2010-2011, sonde 88 i 90)',
    poverenje_visina:'srednje-visoko (stvarne kote krune i sokla — samo visine temelja, ne nadzemnih zidova)',
    izvor:'iskopi-2010-2011 (Starinar 64/2014)'
  });
}
const vp=p.objekti_3d_stubi.find(s=>s.id==='vila-peristil');
vp.hronologija='horizont 1 (prve decenije 4. veka): osnovni plan, suprotno ranijim misljenjima; pre toga na mestu monumentalna zgrada izduzene forme sa velikim dvoristem (pretorium?, vreme dvovlasca Konstantin-Licinije); oko 330 velika prepravka (trem, piloni, vestibul, dva triklinijuma, mermer umesto drveta, impluvium, vodovod); horizont 2 (330-378): prepravke — stibadijumi A i B; horizont 3 (380-441/443): kraj funkcije vile, nove zgrade';
vp.izvor='monografija-vila-2011 + Pop-Lazic 2018 + Stibadium B 2016 + iskopi-2010-2011';
pisi('prostorni_sloj.json',p);

// 4. vodeni sloj: ograda — precizna hronologija
const v=citaj('vodeni_linijski_sloj.json');
const lista=v.dokazane_tvrdnje||v.tvrdnje||[];
const og=lista.find(x=>x.id==='broncana-ograda-324');
if(og){
  og.id='broncana-ograda-herme';
  og.tvrdnja='Bronzana ograda (cancelli) sa plocama i hermama; ukupno 4 herme sa bistovima (Asklepijos, Higija, Sol, Luna — Higija i Sol nadjenu nisu); potvrdjene biste Eskulapa i Lune (nalaz 2000); IZRADA pre 325, POSTAVKA na Medijanu 361 tokom boravka Julijana u Nisu, ZAKOP 378 pred gotsku invaziju; stajala na ulazu apside sale za gozbe';
  og.izvor='Vasic, Bronze Railing from Mediana (Starinar LIII-LIV/2003-2004) + Milosevic, Carska ideologija, fusnota 21';
}
pisi('vodeni_linijski_sloj.json',v);

// 5. digitalni pasos: materijali, uticaji, graditelji
const d=citaj('digitalni_pasos.json');
if(!JSON.stringify(d.materijali).includes('porfir')){
  d.materijali.push({stavka:'porfir (glava kompozicije dijarhije; porfirne statue boga i boginje sa grckim natpisima na bazama — UVOZENA dela umesnih skulptora visokog kvaliteta)', potvrda:'Milosevic, Carska ideologija; Vasic 1975', poverenje:'visoko'});
}
if(!JSON.stringify(d.uticaji).includes('adventus')){
  d.uticaji.push(
    {uticaj:'carski adventus i dvorski ceremonijal Dioklecijana', dokaz:'prilazni svecani put: kapija-slavoluk -> salutatorium -> peristil -> consitorium i triclinium; zavrsavao se proskinezom; arhitektura podredjena ceremonijalu', izvor:'carska-ideologija', poverenje:'visoko'},
    {uticaj:'solarni kult (Sol Invictus) uz dvorsko hriscanstvo — dualizam', dokaz:'ograda sa hermama Sol/Eskulap; Fluvius i Meduza u auli; ikonografija cara sa radialnom krunom (slavoluk u Rimu, novac)', izvor:'carska-ideologija', poverenje:'visoko'},
    {uticaj:'dardanska dinastijska ideologija', dokaz:'Dea Dardanica na ulazu — poreklo dinastije od Konstancija Hlora, Dardanca', izvor:'carska-ideologija', poverenje:'srednje-visoko'}
  );
}
if(!JSON.stringify(d.graditelji_alati).includes('skulptor')){
  d.graditelji_alati.push({stavka:'uvezene radionice skulptora visokog kvaliteta (porfirne statue sa grckim natpisima na bazama) — imena nepoznata, uvoz dokazan natpisima', poverenje:'srednje-visoko'});
}
if(d.teorije_rekonstrukcije&&d.teorije_rekonstrukcije.stadijumi){
  const s5=d.teorije_rekonstrukcije.stadijumi.find(x=>x.nivo===5);
  if(s5&&!s5.napomena_v010) { s5.napomena_v010='dekorativni sloj dobio prvi program: skulpturni program (skulpturski_program.json) + mozaicki motivi Fluvius i Meduza sa pozicijama'; }
}
pisi('digitalni_pasos.json',d);
console.log('talas v0.10 primenjen');
