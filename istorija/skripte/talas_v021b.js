const fs=require('fs');
const R=f=>JSON.parse(fs.readFileSync(f,'utf8'));
const W=(f,d)=>fs.writeFileSync(f,JSON.stringify(d,null,1)+'\n');
const dem=R('dem_sloj.json'), izv=R('dem_izvorista_v021.json');
dem.kote_tacaka={
 vila_peristil:{naziv:'Vila s peristilom (OSM way centroid)',lon:21.94854,lat:43.30957,m:izv.vila.m,provera:['GLO-30 tiff 198.2','Open-Meteo 198.0'],poverenje:'PROVERENO'},
 niska_banja_centar:{naziv:'Niška Banja (Nominatim centroid naselja)',lon:22.0072312,lat:43.2933122,m:izv.vrelo.m,provera:['GLO-30 tiff'],poverenje:'PROVERENO'}
};
dem.profil_akvedukt_medjana_niska_banja={
 ...dem.profil_akvedukt_medjana_niska_banja,
 kote_krajnje:{niska_banja:izv.vrelo.m,medjana_vila:izv.vila.m},
 uzvisina_na_trasi_max:izv.max_prag_na_trasi_m
};
W('dem_sloj.json',dem);
const vz=R('vizuelni_sloj.json');vz.verzija='0.21';W('vizuelni_sloj.json',vz);
console.log('kote object + prag upisani, vizuelni na 0.21');
