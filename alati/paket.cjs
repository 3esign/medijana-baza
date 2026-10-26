const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const root = path.resolve(__dirname, '..');
const groups = {
  'Osnova i prostor': ['baza_podataka.json','prostorni_sloj.json','digitalni_pasos.json','sobe_sloj.json','sonde_sloj.json','crtezi_sloj.json','geofizika_sloj.json','objekti_cd_sloj.json'],
  'Nalazi i poređenja': ['mozaici_sloj.json','skulpturski_program.json','numizmaticki_sloj.json','epigrafski_sloj.json','komparativni_lokaliteti.json','vizuelni_sloj.json','vizuelni_nalazi.json'],
  'Voda i reljef': ['vodeni_linijski_sloj.json','hidraulika_sloj.json','dem_sloj.json','gis_izvori_sloj.json','akvadukt_trasa_v026.json','vodosnabdevanje_naisusa_v028.json','akvadukt_koordinate_v031.json','podvinik_bulevar_v032.json'],
  'Istorijski proračuni — nisu aktuelna trasa': ['vinik_trasa_fizika_v027.json','pantelej_kasarna_gravitacija_v029.json','treca_kota_vrela_v030.json'],
  'Sačuvana DEM očitavanja': ['dem_izvorista_v021.json','dem_izvori_kandidati_v023.json','dem_profil_vrelo1_vila_v023.json','dem_izvor_ukrstteni_v025.json']
};
const derived = new Set(['KATALOG.json','IZVORI_REGISTAR.json']);
// Text catalogue hashes are portable across Git CRLF/LF checkouts. Preservation hashes are raw bytes.
const hash = p => crypto.createHash('sha256').update(fs.readFileSync(p,'utf8').replace(/\r\n/g,'\n')).digest('hex');
function scan(dir) {
  return fs.readdirSync(dir).filter(f=>f.endsWith('.json')&&!derived.has(f)).sort().map(f=>{
    const d=JSON.parse(fs.readFileSync(path.join(dir,f),'utf8'));
    const group=Object.entries(groups).find(([,a])=>a.includes(f))?.[0] || (f==='konsolidacija.json'?'Revizija i otvorena pitanja':'Sirovi odgovori servisa');
    return {putanja:f,grupa:group,sha256:hash(path.join(dir,f)),verzija_sadrzaja:d.verzija||d.version||null,
      status:group.startsWith('Istorijski')?'istorijski':group.startsWith('Sirovi')||group.startsWith('Sačuvana')?'sacuvani_izvor':'radni_sloj_sa_ogranicenjima',
      nizovi:Object.fromEntries(Object.entries(d).filter(([,v])=>Array.isArray(v)).map(([k,v])=>[k,v.length]))};
  });
}
function sources(dir, rows) {
  const out=new Map();
  function walk(v,loc,f) {
    if (typeof v==='string') {
      for(const match of v.matchAll(/https?:\/\/[^\s<>"\[\]]+/g)) {
        const u=match[0].replace(/[.,;]+$/,'');
        if(!out.has(u))out.set(u,{url:u,status:'zabelezen_u_bazi_nije_ponovo_otvoren',pojavljivanja:[]});
        out.get(u).pojavljivanja.push({fajl:f,polje:loc});
      }
    } else if(v&&typeof v==='object') for(const [k,x] of Object.entries(v))walk(x,loc+'/'+k,f);
  }
  for(const r of rows.filter(r=>r.status==='radni_sloj_sa_ogranicenjima' && r.putanja!=='konsolidacija.json')) walk(JSON.parse(fs.readFileSync(path.join(dir,r.putanja),'utf8')),'',r.putanja);
  return [...out.values()].sort((a,b)=>a.url.localeCompare(b.url));
}
function validate(dir) {
  const errors=[];let rows=[];
  try { rows=scan(dir); } catch(e){errors.push(e.message);return {errors,files:0};}
  for(const files of Object.values(groups))for(const f of files)if(!fs.existsSync(path.join(dir,f))) errors.push('Katalog: nedostaje '+f);
  try {
    const catalog=JSON.parse(fs.readFileSync(path.join(dir,'KATALOG.json'),'utf8'));
    const expected=JSON.stringify(rows),actual=JSON.stringify(catalog.fajlovi);
    if(expected!==actual)errors.push('Katalog je zastareo: node alati/paket.cjs --build');
    const src=JSON.parse(fs.readFileSync(path.join(dir,'IZVORI_REGISTAR.json'),'utf8'));
    if(JSON.stringify(src.izvori)!==JSON.stringify(sources(dir,rows)))errors.push('Registar izvora je zastareo');
  }catch(e){errors.push('Katalog/izvori: '+e.message);}
  // Referential checks across the two coordinate layers.
  const read=f=>JSON.parse(fs.readFileSync(path.join(dir,f),'utf8'));
  try {
    const a=read('akvadukt_trasa_v026.json'),b=read('akvadukt_koordinate_v031.json');
    for(const p of b.nalaz.gradilista){
      const q=a.segmenti.find(x=>x.id===p.id);
      if(!q||JSON.stringify(q.koordinate)!==JSON.stringify(p.koordinate))errors.push('Koordinate slojeva se razlikuju: '+p.id);
    }
    const h=read('hidraulika_sloj.json').dovod_v025;
    for(const x of h.kapacitet_manning_v025.scenariji){
      const A=x.sirina_m*x.dubina_m,R=A/(x.sirina_m+2*x.dubina_m);
      const v=1/0.014*Math.pow(R,2/3)*Math.sqrt(x.nagib_promila/1000);
      if(Math.abs(x.A-A)>0.0001||Math.abs(x.R-R)>0.0001||Math.abs(x.v-v)>0.003||Math.abs(x.Q_l_s-A*v*1000)>0.3||Math.abs(x.Q_m3_dan-A*v*86400)>35)errors.push('Manning racun nije reprodukovan: '+x.sirina_m+'x'+x.dubina_m);
    }
    for(const n of ['vinik_trasa_fizika_v027.json','pantelej_kasarna_gravitacija_v029.json','treca_kota_vrela_v030.json'])if(!read(n).revizija_v033)errors.push('Nedostaje status istorijskog proracuna: '+n);
  }catch(e){errors.push('Povezane provere: '+e.message);}
  return {errors,files:rows.length};
}
if(require.main===module){
  if(process.argv.includes('--build')){
    const rows=scan(root),src=sources(root,rows);
    const save=(f,d)=>fs.writeFileSync(path.join(root,f),JSON.stringify(d,null,2)+'\n','utf8');
    save('KATALOG.json',{izdanje:'0.33',hash_format:'SHA256 UTF-8 text with CRLF normalized to LF; preservation audit uses original raw bytes.',pravilo:'Verzija sadrzaja je istorijska; izdanje paketa ne znaci novu proveru izvora.',fajlovi:rows});
    save('IZVORI_REGISTAR.json',{napomena:'Jedinstveni URL zapisi sa mestom pojavljivanja. Broj URL-ova nije broj nezavisnih izvora; dostupnost i bibliografska ispravnost nisu ovde proverene.',izvori:src});
    let md='# Mapa projekta\n\nIzdanje 0.33. [Važeća sinteza](SINTEZA.md) · [Revizija](konsolidacija.json) · [Registar URL-ova](IZVORI_REGISTAR.json).\n\n';
    for(const group of [...new Set(rows.map(x=>x.grupa))]){
      md+='## '+group+'\n\n| Fajl | Nizovi / broj zapisa |\n|---|---|\n';
      for(const r of rows.filter(x=>x.grupa===group))md+=`| [${r.putanja}](${r.putanja}) | ${Object.entries(r.nizovi).map(([k,v])=>k+': '+v).join('; ')} |\n`;
      md+='\n';
    }
    md+='## Prilozi i istorija\n\n- `slike/`: fotografski prilozi; atribucija je u vizuelnom sloju.\n- `crtezi/`: renderi publikovanih crteža.\n- `pdf/`, `izvori_pdf/`, `dem/`: lokalni izvori i rasteri.\n- `roj_glm/`: originalne isporuke i tokovi radnika, istraživački nacrti.\n- `istorija/skripte/`: jednokratne migracije; ne pokretati nad aktuelnom bazom.\n- `istorija/pre-konsolidacije-v032/`: tačne kopije dokumenata pre revizije.\n- `provere/`: inventar, provere očuvanja i regresija.\n\nPodaci ostaju na stabilnim putanjama zbog postojećih referenci. Dokumenti u istoriji mogu navoditi stare relativne putanje; razrešavaju se prema izvornom korenu projekta.\n';
    fs.writeFileSync(path.join(root,'INDEKS.md'),md,'utf8');
    console.log(`${rows.length} JSON fajlova; ${src.length} jedinstvenih URL zapisa.`);
  } else {const r=validate(root);console.log(JSON.stringify(r));process.exitCode=r.errors.length?1:0;}
}
module.exports={validate};
