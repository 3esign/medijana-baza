const fs=require('fs'),path=require('path'),crypto=require('crypto');
const root=path.resolve(__dirname,'..');
const read=f=>JSON.parse(fs.readFileSync(path.join(root,f),'utf8'));
const hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const baseline=read('provere/inventar_pre.json');
const migration=read('konsolidacija.json');
const counts={nepromenjeno:0,premesteno:0,original_u_istoriji:0};
const failures=[],rows=[];
for(const item of baseline.fajlovi){
  const dest=migration.premestanja.find(x=>x.iz===item.putanja)?.u;
  const candidates=[['nepromenjeno',item.putanja],['premesteno',dest],['original_u_istoriji','istorija/pre-konsolidacije-v032/'+item.putanja]].filter(([,p])=>p);
  const match=candidates.find(([,p])=>fs.existsSync(path.join(root,p))&&hash(path.join(root,p))===item.sha256);
  if(match){counts[match[0]]++;rows.push({original:item.putanja,sacuvan:match[1],status:match[0],sha256:item.sha256});}
  else failures.push(item.putanja);
}
const report={at:new Date().toISOString(),baseline_head:baseline.head,original_files:baseline.fajlovi.length,original_bytes:baseline.fajlovi.reduce((s,x)=>s+x.bajtova,0),counts,failures,files:rows};
fs.writeFileSync(path.join(root,'provere/ocuvanje.json'),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({originals:report.original_files,counts,failures}));
process.exitCode=failures.length?1:0;
