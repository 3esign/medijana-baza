// popravke posle prvog valja validatora v0.13
const fs = require('fs');

// 1) vizuelni_sloj koristi 'version' — uskladi oba polja
let vz = JSON.parse(fs.readFileSync('vizuelni_sloj.json', 'utf8'));
if ('version' in vz) { vz.version = '0.13'; fs.writeFileSync('vizuelni_sloj.json', JSON.stringify(vz, null, 2) + '\n'); }
console.log('vizuelni: version =', JSON.parse(fs.readFileSync('vizuelni_sloj.json', 'utf8')).version);

// 2) crtezi: W-24a postoji u schemi (napomena), dodaj u u_planu
let cr = JSON.parse(fs.readFileSync('crtezi_sloj.json', 'utf8'));
const zp = cr.plan_vile_sl1.prostorije_zapadni.u_planu;
if (!zp.includes('W-24a')) { zp.splice(zp.indexOf('W-24') + 1, 0, 'W-24a'); fs.writeFileSync('crtezi_sloj.json', JSON.stringify(cr, null, 2) + '\n'); }
console.log('crtezi: W-24a u planu =', JSON.parse(fs.readFileSync('crtezi_sloj.json', 'utf8')).plan_vile_sl1.prostorije_zapadni.u_planu.includes('W-24a'));

// 3) validator: novac ima period+sloj+kota umesto opis; sonde id iz SVIH sektora
let v = fs.readFileSync('validator.js', 'utf8');
v = v.replace(
  "if(!n.tip||!n.opis||!n.izvor)greske.push('sobe: '+p.id+' nalaz bez tip/opis/izvor');",
  "if(!n.tip||!(n.opis||n.period)||!n.izvor)greske.push('sobe: '+p.id+' nalaz bez tip/opis-ili-period/izvor');"
);
v = v.replace(
  "const sondaIds=new Set((sn.sonde_sa_vezom||[]).map(s=>String(s.sonda||s.id)));",
  "const sondaIds=new Set((sn.sonde_sa_vezom||[]).map(s=>String(s.sonda||s.id)));\n  (sn.sektori||[]).forEach(sek=>(sek.sonde||[]).forEach(sd=>String(sd).split('/').forEach(x=>sondaIds.add(x.trim()))));"
);
fs.writeFileSync('validator.js', v);
console.log('validator: novac-period + sonde-iz-sektora popravljeno');
