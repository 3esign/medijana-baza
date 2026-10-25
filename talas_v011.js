#!/usr/bin/env node
// Talas v0.11 — sonde sektora 2-5 (Starinar 64/2014, tekst): kote po sloju, novac, registar slika Sl. 1-31,
// olovne cevi u prostoriji 12 i e-12 (vodeni sloj), temelj severnog zida 197.94 (prva dubina temelja u bazi)
const fs = require('fs');
function citaj(f){ return JSON.parse(fs.readFileSync(f,'utf8')); }
function pisi(f,o){ fs.writeFileSync(f, JSON.stringify(o,null,1)+'\n','utf8'); console.log(f,'azuriran'); }

// 1. verzije na 0.11
for(const f of ['baza_podataka.json','prostorni_sloj.json','digitalni_pasos.json','komparativni_lokaliteti.json','vodeni_linijski_sloj.json','vizuelni_sloj.json','vizuelni_nalazi.json','sonde_sloj.json','skulpturski_program.json']){
  const o=citaj(f);
  if(o.verzija!==undefined) o.verzija='0.11';
  if(o.version!==undefined) o.version='0.11';
  o.datum='2026-10-25';
  pisi(f,o);
}

// 2. sonde_sloj: popuna sektora 2-5 + stratigrafije + novac + registar slika
const sn=citaj('sonde_sloj.json');
sn.izvor_glavni.napomena='devet meseci iskopavanja; registar svih 31 slike izvucen iz potpisa (slike_zvezda_register); Sl. 1 (plan vile sa sondama) i dalje slika bez tekstualnog sloja — geometrija seka jos nije uvucena';

// --- registar slika (potpisi iz teksta) ---
sn.registar_slika = [
  {sl:1, sadrzaj:'plan vile sa obelezenim sondama istrazenim u 2010. i 2011.', tip:'situacioni plan', status:'slika bez tekstualnog sloja — geometrija nije uvucena', poverenje:'-'},
  {sl:2, sadrzaj:'severni profil sondi 73, 90, 87 (skice 239-250/11)', tip:'profil', poverenje:'visoko'},
  {sl:3, sadrzaj:'zapadni profil sonde 86 (skica 109/11)', tip:'profil', poverenje:'visoko'},
  {sl:4, sadrzaj:'istocni profil sonde 87 (skica 81/10)', tip:'profil', poverenje:'visoko'},
  {sl:5, sadrzaj:'sonda 72, severni deo, nivo rusenja u sloju B-C, snimak sa istoka', tip:'snimak', poverenje:'visoko'},
  {sl:6, sadrzaj:'severozapadni deo vile, van severne fasade', tip:'snimak', poverenje:'visoko'},
  {sl:7, sadrzaj:'istocni profil sonde 103 (skica 241/11)', tip:'profil', poverenje:'visoko'},
  {sl:8, sadrzaj:'istocni profil sonde prostorije w-24 (sonda 46) (skica 33/10)', tip:'profil', poverenje:'visoko'},
  {sl:9, sadrzaj:'severoistocne prostorije: prostorija e-23, kontrolna sonda 1, osnova iskopa, snimak sa zapada', tip:'snimak', poverenje:'visoko'},
  {sl:10, sadrzaj:'severoistocne prostorije: sonda 71, konstrukcija prefurnijuma, sa severa', tip:'snimak', poverenje:'visoko'},
  {sl:11, sadrzaj:'istocni profil sonde 81 (skica 201/11)', tip:'profil', poverenje:'visoko'},
  {sl:12, sadrzaj:'severozapadne prostorije 24 i 24a, snimak sa severa', tip:'snimak', poverenje:'visoko'},
  {sl:13, sadrzaj:'sonda 45, prostorija w-24a, deo sloja rusenja sa fragmentima fresaka, snimak sa istoka', tip:'snimak', poverenje:'visoko'},
  {sl:14, sadrzaj:'deo hipokausta i otvor zatranog prefurnijuma u prostoriji w-22, snimak s juga', tip:'snimak', poverenje:'visoko'},
  {sl:15, sadrzaj:'severozapadni deo vile, van severne fasade, stibadijum B, pogled sa severa', tip:'snimak', poverenje:'visoko'},
  {sl:16, sadrzaj:'detalj ornamenta mozaika iz istocnog dela stibadijuma B', tip:'snimak', poverenje:'visoko'},
  {sl:17, sadrzaj:'sonda 90, blok A, zid z-2', tip:'snimak', poverenje:'visoko'},
  {sl:18, sadrzaj:'severoistocni deo, van severne fasade, ostaci prostorije posle 380. godine; zid pravca sever-jug duzine 17,00 m', tip:'snimak', poverenje:'visoko'},
  {sl:19, sadrzaj:'jugozapadni deo vile, sonda 78 - prostorija w-21 i 81, nivo rusenja', tip:'snimak', poverenje:'visoko'},
  {sl:20, sadrzaj:'sonda 81, jugozapadni ugao vile, nivo rusenja (u pozadini sonda 78)', tip:'snimak', poverenje:'visoko'},
  {sl:21, sadrzaj:'sonda 81, situacija na jugozapadnom uglu vile, snimak sa jugoistoka', tip:'snimak', poverenje:'visoko'},
  {sl:22, sadrzaj:'sonda 82, u toku iskopavanja, snimak sa juga', tip:'snimak', poverenje:'visoko'},
  {sl:23, sadrzaj:'sonda 101, osnova sonde nakon iskopavanja (u drugom planu zapadni deo juznog tremca vile), snimak sa severoistoka', tip:'snimak', poverenje:'visoko'},
  {sl:24, sadrzaj:'sonda 101, baza zapadnog stuba ulaza u vilu, otisak u zidu z-50, snimak sa juga', tip:'snimak', poverenje:'visoko'},
  {sl:25, sadrzaj:'fragment mermarne glave (S-282/11)', tip:'nalaz', poverenje:'visoko'},
  {sl:26, sadrzaj:'fragment porfirne leve sake', tip:'nalaz', poverenje:'visoko'},
  {sl:27, sadrzaj:'marmerni deo leve sake', tip:'nalaz', poverenje:'visoko'},
  {sl:28, sadrzaj:'bronzana drska u obliku poprsja zenske figure', tip:'nalaz', poverenje:'visoko'},
  {sl:29, sadrzaj:'kostani predmet (S-268/11)', tip:'nalaz', poverenje:'visoko'},
  {sl:30, sadrzaj:'marmerna glava Venere (S-4/11)', tip:'nalaz', poverenje:'visoko'},
  {sl:31, sadrzaj:'kasnolatenska fibula s posuvracenom nogom (prerimski nalaz na Medijani)', tip:'nalaz', poverenje:'visoko'}
];

// --- sektor 2: severoistocno od severne fasade ---
const s2=sn.sektori.find(x=>x.id==='sektor-2-severoistocno');
s2.sonde=['71','97','98','103','104'];
s2.prostor='istočno od istočne fasade zgrade Muzeja i severni deo fasade vile';
s2.napomena='nasuti sloj ranijih iskopavanja + bastavrt i voćnjak porodice Milic; stratigrafija jednostavnija nego u sektoru 1';
s2.veze_na_stubove=['vila-peristil','zgrade-oko-stibadiuma-B'];
s2.poverenje='visoko';
s2.kljucevi_nalazi=[
  'temelj severnog zida vile ispitan: ukopan do kote 197.94 — PRVA DUBINA TEMELJA u bazi',
  'sokl severne fasade na koti 198.02',
  'prefurnijum za prostorije 22 i 23 (nije zabelezen u iskopavanjima 1978-1979, konzervacijom negiran): malterna podloga 198.54 (sever) → 198.36 (jug, otvori hipokausta)',
  'zid 7d od oblutaka vezanih blatom, prolazi kroz sonde 97, 98, 104, kruna ~198.8 — odgovara zidovima 2 i 3 (sonde 72/3, 88, 90) i zidu u sondi 91',
  'jama za otpatke u sondi 103: 198.76 → dno 197.38, srednjovekovna keramika — kasnoanticki horizonti 2 i 3 sastaju se sa srednjim vekom na istom nivou'
];
s2.novac=[
  {sonda:'97', sloj:'C', kota_m_nmv:198.86, dateranje:'355-361'},
  {sonda:'97', sloj:'C', kota_m_nmv:198.91, dateranje:'364-375'},
  {sonda:'98', sloj:'C', kota_m_nmv:198.84, dateranje:'4. vek'},
  {sonda:'98', sloj:'C', kota_m_nmv:198.76, dateranje:'355-361'},
  {sonda:'103', sloj:'C', kota_m_nmv:198.85, dateranje:'330-335'},
  {sonda:'104', sloj:'C', kota_m_nmv:198.81, dateranje:'294-307 (najstariji novac sektora 2)'}
];
s2.slike=['sl.7','sl.10','sl.18'];

// --- sektor 3: severozapadne prostorije ---
const s3=sn.sektori.find(x=>x.id==='sektor-3-severozapadne-prostorije');
s3.sonde=['45','46'];
s3.prostorije=['w-1','w-22','w-24','w-24a','deo w-25'];
s3.napomena='sve prostorije imaju podove od opeka ili maltera; na podove padala konstrukcija tavanice pa krovna konstrukcija; u w-24a, delu w-24 i w-22 rusenje racisceno do podova, drugde ostavljeno kao gazna povrsina horizonta 3';
s3.veze_na_stubove=['vila-peristil','stibadium-B'];
s3.poverenje='visoko';
s3.podovi_m_nmv={'w-1':198.70,'w-22':198.70,'w-24 istok':198.79,'w-24 zapad':198.78,'w-24a':198.81};
s3.kljucevi_nalazi=[
  'w-1: baza stuba peristila u sekundarnoj upotrebi (kota 199.33) i glava mramorne skulpture Venere (S-4/11, sl. 30) polozena na desni obraz, lice ka severu, kota 199.12',
  'w-1: gvozdeni vrh koplja (C-2) na koti 199.14; ostaci fresko-maltera in situ na licu zidova 29, 32 i 41 na koti 199.33',
  'w-1: proslojak zapecene zemlje 0,05 m preko poda — ostatak medjuspratne konstrukcije stradale u pozaru (DOKAZ SPRATNOSTI)',
  'w-22: kruna zida 33 na 199.56, zida 32 na 199.66; hipokaust probijan i koriscen, u ukopu srednjovekovna keramika',
  'w-24/24a: sloj D sadrzi nivo intenzivnog rusenja sa obrasenim krovnim opekama, malternom podnicom i fragmentima mramorne obloge (zona 1) + velike kolicine mozaickih kockica'
];
s3.slojevi_tabela3_sonda46_p22_24=[
  {sloj:'humus+A', od_m_nmv:200.6},
  {sloj:'B', od_m_nmv:199.99, do_m_nmv:199.79},
  {sloj:'C', od_m_nmv:199.99, do_m_nmv:199.09},
  {sloj:'D', do_m_nmv:198.8},
  {sloj:'E', do_m_nmv:198.7}
];
s3.slojevi_tabela4_sonda45_p24_24a=[
  {sloj:'humus+A', od_m_nmv:200.46, do_m_nmv:200.13},
  {sloj:'B', od_m_nmv:200.13, do_m_nmv:199.63},
  {sloj:'C', od_m_nmv:199.63, do_m_nmv:199.43},
  {sloj:'zapečena zemlja', do_m_nmv:198.84}
];
s3.slike=['sl.8','sl.12','sl.13','sl.14'];

// --- sektor 4: severoistocne prostorije (revizija) ---
const s4=sn.sektori.find(x=>x.id==='sektor-4-severoistocne-prostorije');
s4.sonde=['e-22 kontrolna 1','e-22 kontrolna 2','e-23 kontrolna 1','e-23 kontrolna 2','70'];
s4.prostorije=['e-22','e-23','e-24'];
s4.napomena='prostorije iskopavane u ranijim istrazivanjima — 2010/11 samo reviziona iskopavanja; potvrdjen hipokaustni sistem podnog i zidnog grejanja tubulusima';
s4.veze_na_stubove=['vila-peristil'];
s4.poverenje='visoko';
s4.kote_m_nmv={
  'e-22 malterni pod':198.94,
  'e-22 proslojak podnice (?)':198.60,
  'e-22 podnica ispod hipokausta':198.29,
  'e-22 ks-2 poplocanje jug':198.77,
  'e-22 ks-2 podnica istok':198.75,
  'e-23 zid Z7':198.67,
  'e-23 supstrukcija poda':198.63,
  'e-23 opeka in situ (originalni pod)':198.70,
  'e-23 ks-2 gornja maltarna podnica':198.95,
  'e-23 ks-2 donja podnica od opeka':198.82,
  'e-24 sonda 70 pod od opeka / zuta podnica':198.90
};
s4.kljucevi_nalazi=[
  'DVOSTRUKE PODNICE u e-23 (malmerna 198.95 preko opeka 198.82) — hipokaust u jednom trenutku negiran, na stariji postavljen novi pod; sloj sut izmedju njih = supstrukcija',
  'e-22: stariji pod od opeka lezi na DVA paralelna zida sa stubicima izmedju — hipokaustna konstrukcija',
  'e-24 (sonda 70): sut sa krupnim fragmentima kamena, opeke i maltera = ostaci gradnje muzejske zgrade 1936; sonde dimenzije AB 3,20 / CD 3,07 / AC 7,70 / BD 7,53 m'
];
s4.slike=['sl.9','sl.10'];

// --- sektor 5: jugozapadne prostorije + ulaz ---
const s5=sn.sektori.find(x=>x.id==='sektor-5-jugozapadne-prostorije');
s5.sonde=['78 (w-21)','75 (w-9)','76 (w-10)','77 (w-11)','79 (w-12 zapad)','107 (sredina 12)','80 (e-12)','81','83','84','86','101 (ulaz)','82 (revizija)','105 (revizija)'];
s5.napomena='jedini sektor BEZ podova od opeka ili maltera — nabijena zemlja (gornji nivo sloja D); novac iz ZATVORENE celine (sloj C preko sloja D) vecina 364-375 → rusenje vile 378 (provala Gota posle hadrijanopolske bitke) — najjaca hronoloska sidra u bazi';
s5.veze_na_stubove=['vila-peristil','kapija-aleja'];
s5.poverenje='visoko';
s5.kljucevi_nalazi=[
  'olovna vodovodna cev u prostoriji 12 (sonda 107): kota 198.49, provlaci se kroz sondu 80 — DRUGA fizicka tacka olovnog vodovoda u bazi (posle fontane nimfej)',
  'sonda 80 (e-12): cev u blagom luku ~5 m, pravac SZ-JI, PROLAZI KROZ OSNOVU zida 59 → postavljena u toku izgradnje zida; osnova zida na 198.40',
  '"kada" izmedju zidova 17, 19 i 59: 1,6 × 1,5 m, obloga od krecnog maltera vezana za sva tri zida; pripada medijanskom horizontu 3 (posle 380); presecena bunarom',
  'bunar: gornja ivica 198.2, dno 196.05 — NAJNIZA KOTA U CEOJ BAZI; dubina ~2,15 m, gornji precnik 1,35 m; na dnu cetiri nagorele daske (kvadratna konstrukcija); kasnosrednjovekovna zelenglasana keramika u gornjim slojevima',
  'juzni tremca: stubovi od OPEKE na kamenim bazama sacuvanim duz juznog zida; prvobitni tremca bio PROSIREN prema jugu (od starijeg sacuvan temelj)',
  'sonda 101 (ulaz u vilu): baza zapadnog stuba ulaza + OTISAK stuba u zidu z-50 — direktno merilo preseka stuba'
];
s5.slojevi_tabela5=[
  {sloj:'put (recentni)', od_m_nmv:199.6},
  {sloj:'humus+A', od_m_nmv:199.37},
  {sloj:'B', od_m_nmv:199.43, do_m_nmv:198.55},
  {sloj:'C', od_m_nmv:198.55, do_m_nmv:198.39},
  {sloj:'D', od_m_nmv:198.39, do_m_nmv:197.45}
];
s5.novac=[
  {sonda:'78', prostorija:'w-21/22', sloj:'sokl', kota_m_nmv:198.59, dateranje:'364-375'},
  {sonda:'75', prostorija:'w-9', sloj:'B', kota_m_nmv:198.75, dateranje:'335-336'},
  {sonda:'75', prostorija:'w-9', sloj:'C', kota_m_nmv:198.49, dateranje:'271-275 (najstariji novac u celoj bazi — pre vile)'},
  {sonda:'76', prostorija:'w-10', sloj:'B', kota_m_nmv:198.52, dateranje:'355-361'},
  {sonda:'76', prostorija:'w-10', sloj:'B', kota_m_nmv:198.54, dateranje:'355-361'},
  {sonda:'w-21', prostorija:'w-21', sloj:'D', kota_m_nmv:198.45, dateranje:'364-375 (2011, vise primeraka 198.45-198.52)'},
  {sonda:'w-21', prostorija:'w-21', sloj:'D', kota_m_nmv:198.52, dateranje:'360-361'}
];
s5.slike=['sl.11','sl.19','sl.20','sl.21','sl.22','sl.23','sl.24'];

// --- veza kota ⇄ DEM ---
sn.kota_dem_veza={
  metod:'izmerene kote (n.m.v.) iz iskopavanja 2010/2011 proveravaju DEM procene iz v0.3',
  potvrde:[
    'stibadium B temelj dno 198.92 (v0.8) — u opsegu DEM vile 195-199',
    'severni zid vile temelj dno 197.94, sokl 198.02 — dno temelja ISPOD srednje DEM vrednosti (~197-198): temelji idu u zdravicu, 3D osnova mora kreniti sa 198, ne sa terenom',
    'podovi prostorija vile 198.70-198.94 (sek. 3 i 4) — uz板 ~0,7-0,9 m iznad dna temelja',
    'castellum aquae procena 206 m (DEM, srednje) ostaje iznad svih kota vile — gravitaciona konzistentnost vodenog sloja i dalje vazi'
  ],
  najniza_kota_baze:{vrednost_m_nmv:196.05, sta:'dno bunara u e-12 (kasni srednji vek)', napomena:'nije anticka konstrukcija — ne ulazi u 3D vile'},
  najvisa_kota_baze:{vrednost_m_nmv:200.6, sta:'recentni put iznad sonde 46 (sektor 3)'}
};
pisi('sonde_sloj.json',sn);

// 3. prostorni sloj: vila dobija IZMERENU vertikalu (temelji, soklovi, podovi)
const p=citaj('prostorni_sloj.json');
const vila=p.objekti_3d_stubi.find(o=>o.id==='vila-peristil');
vila.izmerene_kote_m_nmv={
  izvor:'Vasic/Milosevic/Gavrilovic, Starinar 64/2014 (iskopi 2010-2011, sektori 2-5)',
  temelj_severnog_zida_dno:197.94,
  sokl_severne_fasade:198.02,
  sokl_severna_fasada_sektor_1:198.6,
  podovi_prostorija:{opseg:[198.70,198.94], detalj:'w-1 198,70; w-22 198,70; w-24 198,78-198,79; w-24a 198,81; e-22 198,94; e-23 198,82-198,95 (dvostruka podnica); e-24 198,90'},
  prefurnijum_podloga:{sever:198.54, jug_ka_hipokaustu:198.36},
  poverenje:'visoko (izmereno)'
};
vila.poverenje_visina='nadzemne visine i dalje NISKO (analogija Casale); vertikala u zemlji od v0.11 IZMERENA — temelj dno 197.94, sokl 198.02, podovi 198.70-198.94';
vila.izvor='monografija-vila-2011 + Pop-Lazic 2018 + Stibadium B 2016 + iskopi-2010-2011 (Starinar 64/2014)';
pisi('prostorni_sloj.json',p);

// 4. vodeni sloj: fizicke olovne cevi u prostoriji 12 / e-12 + kada + bunar
const vod=citaj('vodeni_linijski_sloj.json');
const mreza=vod.vodena_mreza;
if(!mreza.cvorovi.some(c=>c.id==='olovna-cev-prostorija-12')){
  mreza.cvorovi.push({
    id:'olovna-cev-prostorija-12',
    tip:'linija-fizicki-dokaz',
    opis:'olovna vodovodna cev u prostoriji 12: sonda 107 kota 198.49, nastavlja se kroz sondu 80; u sonda 80 luk ~5 m pravac SZ-JI i PROLAZI KROZ OSNOVU zida 59 (postavljena pri gradnji zida), osnova 198.40',
    izvor:'Starinar 64/2014, sektor 5 (5.1.1 i 5.2.1)',
    poverenje:'visoko (izmereno, iskop)',
    veza_3d:'druga fizicka tacka olovnog vodovoda posle fontane-nimfej (v0.6, kadrovi VI-VII) — trasa unutar vile dobija dva zemljista tacaka'
  });
}
if(!mreza.cvorovi.some(c=>c.id==='kada-e-12')){
  mreza.cvorovi.push({
    id:'kada-e-12',
    tip:'krajnji-cvor',
    opis:'"kada" 1,6 x 1,5 m izmedju zidova 17, 19 i 59, obloga kreznak malterom; autori pitaju "za kupanje? kada?"; pripada medijanskom horizontu 3 (posle 380); presecena bunarom',
    izvor:'Starinar 64/2014, 5.2.1',
    poverenje:'visoko (dimenzije), srednje (funkcija)'
  });
}
if(!mreza.cvorovi.some(c=>c.id=='bunar-e-12')){
  mreza.cvorovi.push({
    id:'bunar-e-12',
    tip:'kasnosrednjovekovni-ukop',
    opis:'bunar presecen sa "kada": gornja ivica 198.2, dno 196.05 (najniza kota u bazi), dubina ~2,15 m, precnik 1,35 m, kvadratna drvena konstrukcija na dnu; kasnosrednjovekovna zelenglasana keramika',
    izvor:'Starinar 64/2014, 5.2.1',
    poverenje:'visoko',
    napomena_3d:'NE ulazi u 3D antickog kompleksa — dokaz nastavka zivota na rusevinama'
  });
}
vod.novi_citativni_dokazi=(vod.novi_citativni_dokazi||[]).concat([
  'olovna cev kroz osnovu zida 59 (sektor 5) — voda uvadjena u zid, ne preko: argument za skrivene vodove u zidovima vile (3D: cevi ne idu po podovima)',
  'kada 1,6 x 1,5 m u e-12 na garezi nad slojem D — vodeni program horizonta 3 i posle rusenja 378'
]);
pisi('vodeni_linijski_sloj.json',vod);

// 5. baza: stratificirani nalazi + novac pre vile
const b=citaj('baza_podataka.json');
b.nalazi.push(
  {nalaz:'marmerna glava Venere (S-4/11, sl. 30)', kontekst:'prostorija w-1, sloj C, polozena na desni obraz, lice ka severu, kota 199.12', izvor:'iskopi-2010-2011', poverenje:'visoko'},
  {nalaz:'gvozdeni vrh koplja (C-2)', kontekst:'prostorija w-1, sloj C, kota 199.14', izvor:'iskopi-2010-2011', poverenje:'visoko'},
  {nalaz:'dve gvozdene strelce plosnatog trouglastog oblika (S-327/10, S-332/10)', kontekst:'sonda 88, sloj A; analogije Pontes i Ušce Porecke reke', znacaj:'sloj najkasnijeg vadjenja zidova — oruzje u sloju koji zatvara zivot vile', izvor:'iskopi-2010-2011', poverenje:'visoko'},
  {nalaz:'kasnolatenska fibula s posuvracenom nogom (sl. 31)', znacaj:'PRERIMSKI nalaz na Medijani — naselje pre rimskog perioda', izvor:'iskopi-2010-2011', poverenje:'visoko'},
  {nalaz:'novac 271-275 u sloju C sonde 75 (w-9)', znacaj:'najstariji novac u bazi — dokaz aktivnosti PRE izgradnje vile', izvor:'iskopi-2010-2011, tabela 6', poverenje:'visoko'},
  {nalaz:'novac 294-307 u sloju C sonde 104 (sektor 2)', znacaj:'drugi pre-vila novac — potvrda aktivnosti pre prve decenije 4. veka', izvor:'iskopi-2010-2011, tabela 2a', poverenje:'visoko'},
  {nalaz:'proslaak zapecene zemlje 0,05 m preko poda w-1 sa vecim komadima fresaka', znacaj:'DOKAZ MEDJUSPRATNE KONSTRUKCIJE stradale u pozaru — argument za spratnost vile', izvor:'iskopi-2010-2011, 3.1.2', poverenje:'srednje-visoko', napomena_poverenja:'jedan proslojak u jednoj prostoriji; obim spratnosti ostaje otvoren'},
  {nalaz:'bronzana drska u obliku poprsja zenske figure (sl. 28)', kontekst:'pokretni materijal 2010/11', izvor:'iskopi-2010-2011', poverenje:'visoko'}
);
b.nacin_daljeg_rada=(b.nacin_daljeg_rada||[]).map(x=>x).concat([]);
b.konflikti_izmedju_izvora.push({
  tema:'spratnost vile sa peristilom',
  a:'analogija Casale: 1 sprat + moguci termalni sprat (prostorni sloj v0.3, poverenje NISKO)',
  b:'proslojak zapecene zemlje 0,05 m preko poda w-1 tretiran kao ostatak medjuspratne konstrukcije stradale u pozaru (Starinar 64/2014, 3.1.2)',
  status:'delimicno resen', resenje:'postojanje medjuspratne konstrukcije u w-1 sada ima terenski dokaz; opseg spratnosti (deba vile?) ostaje otvoren — poverenje podize se sa nisko na srednje za "barem jedan sprat iznad w-1"',
  poverenje:'srednje'
});
pisi('baza_podataka.json',b);

// 6. digitalni pasos: izmerena vertikala + tehnike
const d=citaj('digitalni_pasos.json');
d.nalazi.push(
  {nalaz:'tubulusima — zidno grejanje potvrdjeno revizionim iskopavanjima sektora 4', izvor:'iskopi-2010-2011', poverenje:'visoko', '3d_hint':'sistem cevi u debeljini zidova, paralelno sa hipokaustom poda'},
  {nalaz:'dvostruke podnice e-23 (malmerna 198.95 preko opeka 198.82)', znacaj:'rekonstrukcija faza: stariji hipokaust negiran, novi pod preko', izvor:'iskopi-2010-2011', poverenje:'visoko'},
  {nalaz:'stubovi juznog tremca od OPEKE na kamenim bazama; baza zapadnog stuba ulaza u sondi 101 sa otiskom u zidu z-50', znacaj:'prvi materijal i presek stubova vile iz terena', izvor:'iskopi-2010-2011', poverenje:'visoko'}
);
const n5=d.teorije_rekonstrukcije.stadijumi.find(s=>s.nivo===5);
n5.napomena_v011='registar svih 31 slike Starinara 64/2014 popisan iz potpisa (sonde_sloj.registar_slika): profili sondi 2,3,4,7,8,11 + situacioni plan Sl. 1 — slike i dalje bez geometrije, samo opisi';
const n6=d.teorije_rekonstrukcije.stadijumi.find(s=>s.nivo===6);
n6.napomena_v011='temelj severnog zida 197.94 + sokl 198.02 + podovi 198.70-198.94 (v0.11): vertikalna osnova vile sada izmerena i povezana sa DEM';
pisi('digitalni_pasos.json',d);

// 7. SINTEZA.md — dodaj sekciju v0.11
const sint=fs.readFileSync('SINTEZA.md','utf8');
if(!sint.includes('## v0.11')){
  fs.appendFileSync('SINTEZA.md','\n## v0.11 — sonde sektora 2-5, izmerena vertikala vile (Starinar 64/2014, tekst)\n\n'+
  '- **Sektor 2 (severoistocno):** sonde 71, 97, 98, 103, 104. Temelj severnog zida ukopan do **197,94** — prva dubina temelja u bazi; sokl 198,02; prefurnijum za prostorije 22/23 (nije bio zabelezen 1978-79): podloga 198,54 ka 198,36; zid 7d od oblutaka, kruna ~198,8; jama u sondi 103 do 197,38 sa srednjovekovnom keramikom.\n'+
  '- **Sektor 3 (severozapadne prostorije):** sonde 45, 46; prostorije w-1, w-22, w-24, w-24a. Podovi 198,70-198,81. Glava Venere na 199,12; vrh koplja na 199,14; fresko in situ na 199,33. **Proslojak zapecene zemlje 0,05 m preko poda w-1 = dokaz medjuspratne konstrukcije** (novi konflikt "spratnost" — delimicno resen).\n'+
  '- **Sektor 4 (severoistocne prostorije, revizija):** e-22, e-23, e-24. Dvostruke podnice e-23 (198,95 preko 198,82) — hipokaust negiran pa novi pod; potvrdjeni tubulusima (zidno grejanje).\n'+
  '- **Sektor 5 (jugozapad + ulaz):** jedini sektor bez podova — nabijena zemlja; novac iz zatvorene celine 364-375 → rusenje **378**. **Olovna cev** kota 198,49 (sonda 107) koja **prolazi kroz osnovu zida 59** (198,40) — voda uvadjena u zid. Kada 1,6x1,5 m i bunar do 196,05 (najniza kota baze, kasni srednji vek). Stubovi tremca od opeke na kamenim bazama; otisak stuba u zidu z-50 (sonda 101).\n'+
  '- **Novac pre vile:** 271-275 (sonda 75) i 294-307 (sonda 104) — aktivnost na Medijani pre prve decenije 4. veka.\n'+
  '- **Kota-DEM veza:** sve izmerene kote (197,94-200,6) potvrdjuju DEM opseg 195-199 za vilu; castellum ~206 i dalje iznad — gravitacija vazi.\n'+
  '- **Registar slika Sl. 1-31** popisan iz potpisa; Sl. 1 (situacioni plan sa sondama) i dalje bez geometrije.\n'+
  '- Prerimski nalaz: **kasnolatenska fibula** (sl. 31) — zivot na Medijani pre Rima.\n');
  console.log('SINTEZA.md dopunjen');
}

console.log('TALAS v0.11 GOTOV');
