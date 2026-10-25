// talas v0.13: soba-po-soba sloj — dopuna validatora, ispravke starijih slojeva, verzije
const fs = require('fs');

// 1) validator: novi blok provera za sobe_sloj.json
let v = fs.readFileSync('validator.js', 'utf8');
if (!v.includes('v0.13')) {
  const dodatak = `
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
      if(!n.tip||!n.opis||!n.izvor)greske.push('sobe: '+p.id+' nalaz bez tip/opis/izvor');
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
  const sondaIds=new Set((sonde.sonde_sa_vezom||[]).map(s=>String(s.sonda||s.id)));
  for(const vsp of sb.veza_sonda_prostorija||[]){
    if(typeof vsp.sonda==='number'&&!sondaIds.has(String(vsp.sonda)))greske.push('sobe: veza referencira sondu koja nije u sonde_sloj: '+vsp.sonda);
    if(!vsp.poverenje)greske.push('sobe: veza bez poverenja');
  }
  if(sb.kote_ekstremi?.najniza?.vrednost!==195.96)greske.push('sobe: najniza kota mora biti 195.96 (bunara jama 5, sonda 105)');
}
`;
  v = v.replace('\nconsole.log(`=== VALIDACIJA MEDIJANA', dodatak + '\nconsole.log(`=== VALIDACIJA MEDIJANA');
  fs.writeFileSync('validator.js', v);
  console.log('validator: blok v0.13 dopisan');
}

// 2) ispravke "najniza kota u bazi" — 196.05 prevazidjena sa 195.96
let ss = fs.readFileSync('sonde_sloj.json', 'utf8');
ss = ss.replace('dno 196.05 — NAJNIZA KOTA U CEOJ BAZI;', 'dno 196.05 — DRUGA NAJNIZA KOTA BAZE (od v0.13 najniza je 195.96, bunara jama 5, sonda 105 — vidi sobe_sloj.json);');
fs.writeFileSync('sonde_sloj.json', ss);
JSON.parse(fs.readFileSync('sonde_sloj.json', 'utf8'));

// vrednost_m_nmv 196.05 ostaje; dodaj napomenu ako postoji objekat
const ssj = JSON.parse(fs.readFileSync('sonde_sloj.json', 'utf8'));
const nadji196 = (o) => {
  if (o && typeof o === 'object') {
    for (const [k, val] of Object.entries(o)) {
      if (k === 'vrednost_m_nmv' && val === 196.05) return true;
      if (nadji196(val)) return true;
    }
  }
  return false;
};
console.log('sonde_sloj: 196.05 i dalje u zapisu:', nadji196(ssj));

let vs = fs.readFileSync('vodeni_linijski_sloj.json', 'utf8');
vs = vs.replace('dno 196.05 (najniza kota u bazi)', 'dno 196.05 (od v0.13 druga najniza — najniza je 195.96, bunara jama 5 u sonda 105, vidi sobe_sloj.json)');
fs.writeFileSync('vodeni_linijski_sloj.json', vs);
JSON.parse(fs.readFileSync('vodeni_linijski_sloj.json', 'utf8'));
console.log('vodeni_sloj: napomena dopisana');

// 3) verzije na 0.13 u svim slojevima
const fajlovi = ['baza_podataka.json','prostorni_sloj.json','komparativni_lokaliteti.json','digitalni_pasos.json','vizuelni_sloj.json','vizuelni_nalazi.json','vodeni_linijski_sloj.json','skulpturski_program.json','sonde_sloj.json','crtezi_sloj.json','sobe_sloj.json'];
for (const f of fajlovi) {
  const j = JSON.parse(fs.readFileSync(f, 'utf8'));
  if (j.verzija) { j.verzija = '0.13'; fs.writeFileSync(f, JSON.stringify(j, null, 2) + '\n'); }
}
console.log('verzije uskladene na 0.13');
