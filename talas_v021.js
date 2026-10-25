// v0.21: korekcija korekcije — sidrenje kota na OSM/Nominatim, profil vrelo→vila, vizuelni nalaz img_04/05
const fs=require('fs');
const R=f=>JSON.parse(fs.readFileSync(f,'utf8'));
const W=(f,d)=>fs.writeFileSync(f,JSON.stringify(d,null,1)+'\n');

// --- 1. dem_sloj ---
const dem=R('dem_sloj.json');
const izv=R('dem_izvorista_v021.json');
dem.verzija='0.21';
dem.kote_tacaka=[
 {id:'vila-peristil',naziv:'Vila s peristilom (OSM way centroid)',lon:izv.vila.lat&&izv.vila.lon,lat:izv.vila.lat,m:izv.vila.m,provera:['GLO-30 tiff','Open-Meteo 198.0'],poverenje:'PROVERENO'},
 {id:'niska-banja-centar',naziv:'Niška Banja (Nominatim centroid naselja)',lon:izv.vrelo.lon,lat:izv.vrelo.lat,m:izv.vrelo.m,provera:['GLO-30 tiff'],poverenje:'PROVERENO'}
];
dem.profil_akvedukt_medjana_niska_banja={
 svrha:'gravitacioni dovod vrelo→vila, sidreno na tačne pozicije (ispravka v0.18 i v0.20)',
 vrelo_m:izv.vrelo.m, vila_m:izv.vila.m, pravolinijski_km:izv.pravolinijski_km,
 pad_m:izv.pad_m, pad_proc:izv.pad_proc, max_prag_na_trasi_m:izv.max_prag_na_trasi_m,
 zakljucak:'pad 1,09% bez prepreke — gravitacioni dovod iz Banje izvodljiv sa velikom marginom; konzistentno sa Jeremić 1988 (izvorište u pravcu Niške Banje)',
 tacke:izv.profil
};
dem.korekcija_v021={
 nadlezno:'poništava i v0.18 i v0.20 vrednosti',
 nalaz:'obe prethodne kote vile bile su uzorkovane sa pogrešnih koordinata (~2,5 km NE od lokaliteta). Prava pozicija: OSM way centroid 43.30957N, 21.94854E → GLO-30 198.2 m, Open-Meteo 198.0 m (slaganje 0.2 m). Kote iz v0.18 (200,6 — blizu) i v0.20 (187,8 — pogrešno) obe su bile uzete van poligona.',
 dokaz:'dem/izvorista? v. dem_izvorista_v021.json; ukršteni test na 6 nezavisnih tačaka (tvrđava 198.7/198.0, aerodrom 192.1/192.0, Suva Planina 597.3/602.0) potvrđuje da TIFF čitanje i Open-Meteo daju iste vrednosti — greška je bila u koordinatama, ne u rasteru.'
};
dem.otvorena_pitanja=(dem.otvorena_pitanja||[]).concat([
 'tačna pozicija antičkog vrela (Glavno vrelo vs. zapadnija antička izvorišta) — nivo 253,6 m je centroid današnjeg naselja, ne samo vrelo'
]);
W('dem_sloj.json',dem);

// --- 2. mozaici_sloj: pošten vizuelni nalaz img_04/05 ---
const moz=R('mozaici_sloj.json');
moz.verzija='0.21';
moz.meduza_2017.vizuelni_pregled_ploca={
 datum:'2026-10-26', metod:'direktan vizuelni pregled izvučenih ploča',
 nalazi:[
  {ploca:'img_04',sadrzaj:'detalj glave Meduze (emblema) — krupni kadar, zmije u kosi vidljive',komparativni:false,napomena:'NIJE poredbeni mozaik iz drugog lokaliteta'},
  {ploca:'img_05',sadrzaj:'isti medaljon u kontekstu poda — oktagonalno polje sa medaljonom u sredini, trougaona (ugonentа) polja oko njega',komparativni:false,napomena:'kontekst istog medijanskog poda — potvrđuje da je emblema bila u medaljonu poligonalnog panela'}
 ],
 zakljucak:'pretpostavka iz v0.19 da ploče img_04/05 nose komparativni materijal je POGREŠNA — obe su Mediana. Komparativni korpus Meduza mozaika (Stobi, Herakleia, Panonija) ostaje otvoren i traži nove izvore.'
};
W('mozaici_sloj.json',moz);

// --- 3. verzije slojeva na 0.21 ---
for(const f of fs.readdirSync('.').filter(x=>x.endsWith('_sloj.json')||['baza_podataka.json','komparativni_lokaliteti.json','skulpturski_program.json'].includes(x))){
 try{const j=R(f);if(j.verzija){j.verzija='0.21';W(f,j);}}catch(e){}
}
console.log('v0.21 upisano. vila m=',dem.profil_akvedukt_medjana_niska_banja.vila_m,'vrelo m=',dem.profil_akvedukt_medjana_niska_banja.vrelo_m);
