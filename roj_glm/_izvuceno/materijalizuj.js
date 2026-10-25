const fs = require('fs');
const path = require('path');
const base = 'C:/Svemir/data/sessions/c1792946760393lb6a/medijana_baza/roj_glm';
for (const d of ['numizmatika', 'objekti_CD', 'vodeni_sistem']) {
  const ws = JSON.parse(fs.readFileSync(path.join(base, '_izvuceno', d + '.writes.json'), 'utf8'));
  for (const w of ws) {
    let p = w.path.split('\\').join('/');
    if (p.includes('roj_glm')) {
      p = p.split('roj_glm')[1].replace(/^\//, '');
    } else {
      p = path.join(d, path.basename(w.path)).split('\\').join('/');
    }
    const full = path.join(base, p);
    fs.mkdirSync(path.dirname(full), { recursive: true });
    fs.writeFileSync(full, w.content);
    console.log(d, '->', p, w.content.length);
  }
}
