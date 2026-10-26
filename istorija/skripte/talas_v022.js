// v0.22 — komparativni korpus Meduza/gorgoneion mozaika (gradi se posebno, pošteno o granicama dokaza).
// Izvori: WebSearch (z.ai pretraga 2026-10-26) + muzejbitola.mk + Getty + ARTnews; sve stavke nose status.
const fs=require('fs');
const R=f=>JSON.parse(fs.readFileSync(f,'utf8'));
const W=(f,d)=>fs.writeFileSync(f,JSON.stringify(d,null,1)+'\n');

const moz=R('mozaici_sloj.json');
moz.komparativni_korpus={
 svrha:'Poređenje medijanske Meduze (moz-07 / meduza_2017) sa drugim mozaicima sa glavom Meduze/Gorgone; utvrđivanje tipa, hronologije i radionica.',
 nacin:'Web pretraga (otvoreni izvori) 2026-10-26; nijedan primerak nije viđen uživo ni u primarnoj publikaciji — sve su tipološke/reference tvrdnje.',
 stavke:[
  {
   id:'kmz-01',
   lokalitet:'Heraclea Lyncestis (Bitola, Severna Makedonija)',
   objekat:'peristilska vila izvan zidina (profani kompleks villa + thermae)',
   sadrzaj:'glava Meduze (gorgoneion) u figuralnom panelu, uz prizore lova i životinja',
   hronologija:'4. vek (muzej: profani mozaici „dated to the 4th century A.D.")',
   tehnika:'opus tessellatum/sygninum/sectile (muzej: raznovrsne tehnike)',
   iskop:'1964 [NEPROVERENO — samo WebSearch]',
   status:'NAJBLIZI POREDBENI PRIMER — profana peristilska vila, isti vek, ista apotropaic funkcija',
   izvori:[
    'https://muzejbitola.mk/en/mosaic-nartex [PROVERENO — stranica muzeja potvrđuje villa+thermae, 4. vek, tehnike; NE pominje Meduzu eksplicitno]',
    'https://helenmilesmosaics.org/ancient-mosaics/heraclea-lyncestis-mosaics/ [NEPROVERENO]',
    'G. Cvetković-Tomašević 2002 (detaljna prezentacija mozaika Herakleje) [NEPROVERENO — citat posredan]',
    'https://www.academia.edu/43882278/ (The Mosaics of ancient Heraclea Lyncestis) [NEPROVERENO]'
   ],
   poverenje:'srednje'
  },
  {
   id:'kmz-02',
   lokalitet:'Villa of the Antonines, Rim (Via Appia)',
   objekat:'kružna soba (⌀ 21 m), niše u zidu',
   sadrzaj:'dva mozaika sa glavom Meduze, otkrivena 2023',
   hronologija:'2. vek',
   status:'poredbena tačka za „prelepu" (classicizing) Meduzu; ne panel poda nego niša',
   izvori:[
    'https://www.artnews.com/art-news/news/ancient-mosaics-of-medusa-discovered-in-roman-villa-1234663310/ [NEPROVERENO]',
    'https://www.jpost.com/archaeology/article-738757 [NEPROVERENO]'
   ],
   poverenje:'nisko-srednje'
  },
  {
   id:'kmz-03',
   lokalitet:'J. Paul Getty Museum (Villa), kolekcija',
   objekat:'podni mozaik (kolekcijski predmet, bez lokaliteta)',
   sadrzaj:'Medusa poprsje u centru štita od koncentričnih krugova — klasičan apotropaic gorgoneion raspored',
   hronologija:'115–150',
   status:'tipološki paradigma: medaljon-štit oko glave — ista shema kao medijanski oktagonalni panel sa medaljonom (vizuelni nalaz v0.21: ploče img_04/05)',
   izvori:['https://www.getty.edu/art/collection/object/103SQK [NEPROVERENO]'],
   poverenje:'nisko-srednje'
  },
  {
   id:'kmz-04',
   lokalitet:'Felix Romuliana (Gamzigrad, Srbija)',
   sadrzaj:'gorgoneion potvrđen na arhitektonskom/kamenom elementu, NE kao mozaik [NEPROVERENO — negativan mozaik nalaz je samo izostanak pogotka]',
   status:'isključen iz mozaik korpusa (za sada)',
   izvori:['WebSearch 2026-10-26, bez primarne publikacije'],
   poverenje:'nisko'
  },
  {
   id:'kmz-05',
   lokalitet:'Stobi (Severna Makedonija)',
   sadrzaj:'nema potvrđenog mozaika sa Meduzom u dostupnim izvorima [NEGATIVAN NALAZ]',
   status:'isključen; poznati mozaici su bazilike/Theodosian palace, drugi program',
   izvori:['https://en.wikipedia.org/wiki/Stobi [NEPROVERENO]','https://helenmilesmosaics.org/blog/stobi-mosaics [NEPROVERENO]'],
   poverenje:'nisko'
  }
 ],
 sudar_tvrdnji:{
  pitanje:'Jeremić 2017 tvrdi da je medijanska Meduza „jedini nalaz ove mitološke figure u mozaiku u Centralnom Balkanu". Heraclea Lyncestis ima mozaik Meduze iz 4. veka.',
  resenje:'Nema pravog sudara — Herakleja je Makedonija, van Jeremićevog „Centralnog Balkana" (Srbija). Ali važno upozorenje: ako korpus širimo na Balkan u celini, tvrdnja jedinstvenosti Medijane pada na „jedinstvena u Srbiji".',
  status:'[PROVERENO kao logičko razjašnjenje; sama klasifikacija regiona je konvencija autora]'
 },
 zakljucak:'Medijanska Meduza ostaje unikatna u Srbiji kao podni mozaik; najsrodniji poredbeni primer u regionu je Heraclea Lyncestis (profana peristilska vila, 4. vek) — paralela koja podržava datovanje medijanskog poda u isti horizont.',
 poverenje:'srednje'
};
moz.verzija='0.22'; moz.datum='2026-10-26';
W('mozaici_sloj.json',moz);

// verzije uskladjene na 0.22
for(const f of ['baza_podataka.json','prostorni_sloj.json','digitalni_pasos.json','komparativni_lokaliteti.json','crtezi_sloj.json','dem_sloj.json','epigrafski_sloj.json','geofizika_sloj.json','gis_izvori_sloj.json','hidraulika_sloj.json','numizmaticki_sloj.json','objekti_cd_sloj.json','skulpturski_program.json','sobe_sloj.json','sonde_sloj.json','vizuelni_sloj.json','vodeni_linijski_sloj.json']){
 const d=R(f); d.verzija='0.22'; if('datum' in d) d.datum='2026-10-26'; W(f,d);
}
const izv=R('dem_izvorista_v021.json'); izv.verzija='0.22'; W('dem_izvorista_v021.json',izv);
console.log('v0.22: komparativni korpus upisan (5 stavki), verzije uskladjene');
