// Isolated negative controls. No changes to the live dataset, no external dependencies.
const fs=require('fs'),path=require('path'),cp=require('child_process'),assert=require('assert');
const root=path.resolve(__dirname,'..');
const parent=path.join(root,'provere');fs.mkdirSync(parent,{recursive:true});
const fixture=fs.mkdtempSync(path.join(parent,'regresija-'));
assert(fixture.startsWith(root+path.sep));
fs.mkdirSync(path.join(fixture,'alati'));
for(const f of fs.readdirSync(root).filter(f=>f.endsWith('.json')||f==='validator.js'))fs.copyFileSync(path.join(root,f),path.join(fixture,f));
fs.copyFileSync(path.join(__dirname,'paket.cjs'),path.join(fixture,'alati','paket.cjs'));
const run=(cmd,args,cwd=fixture)=>cp.spawnSync(cmd,args,{cwd,encoding:'utf8'});
const results=[];
function check(name,mutate,expect,pattern){
  for(const f of fs.readdirSync(root).filter(f=>f.endsWith('.json')))fs.copyFileSync(path.join(root,f),path.join(fixture,f));
  const edit=(f,fn)=>{const p=path.join(fixture,f);const d=JSON.parse(fs.readFileSync(p));fn(d);fs.writeFileSync(p,JSON.stringify(d));};
  mutate(edit);
  // Rebuild the catalogue so a scientific-data error is caught by a real rule, not just a stale hash.
  const build=run(process.execPath,['alati/paket.cjs','--build']);assert.strictEqual(build.status,0,build.stderr);
  const r=run(process.execPath,['validator.js']);
  const passed=expect===0?r.status===0:r.status!==0;
  const matched=!pattern||pattern.test(r.stdout+r.stderr);
  results.push({name,expected_exit:expect,actual_exit:r.status,passed:passed&&matched});
  assert(passed&&matched,name+'\n'+r.stdout+r.stderr);
}
try {
  check('baseline',()=>{},0);
  check('v024 negative Q',e=>e('hidraulika_sloj.json',d=>d.dovod_v024.kapacitet_manning.scenariji[0].Q_l_s=-1),1,/Q van/);
  check('v025 DEM mismatch',e=>e('dem_sloj.json',d=>d.korekcija_v025.prihvacena_kota_m=210),1,/ne slaze se sa hidraulikom/);
  check('v031 north instead of northeast',e=>e('akvadukt_trasa_v026.json',d=>d.segmenti.find(x=>x.id==='tr-06').koordinate[0]=d.segmenti.find(x=>x.id==='tr-03').koordinate[0]),1,/tr-06 mora biti NE/);
  check('v032 false distance',e=>e('podvinik_bulevar_v032.json',d=>d.udaljenost_do_kasarne_m=1200),1,/rastojanje ne odgovara/);
  check('Manning arithmetic',e=>e('hidraulika_sloj.json',d=>d.dovod_v025.kapacitet_manning_v025.scenariji[0].Q_l_s=99),1,/Manning racun/);
  check('historical profile status removed',e=>e('vinik_trasa_fizika_v027.json',d=>delete d.revizija_v033),1,/istorijskog profila/);
  check('different terrain maximum is allowed',e=>e('vinik_trasa_fizika_v027.json',d=>d.trasa_1.max_medjukota=400),0);
  const external=run(process.execPath,[path.join(root,'validator.js')],parent);
  results.push({name:'working directory independence',passed:external.status===0,actual_exit:external.status});assert.strictEqual(external.status,0,external.stdout);
} finally {
  fs.writeFileSync(path.join(parent,'regresija.json'),JSON.stringify({at:new Date().toISOString(),results},null,2)+'\n');
  // Exact generated fixture inside the project, checked before recursive removal.
  assert(path.dirname(fixture)===parent && path.basename(fixture).startsWith('regresija-'));
  fs.rmSync(fixture,{recursive:true});
}
console.log(`${results.length}/${results.length} regression controls passed.`);
