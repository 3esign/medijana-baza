const fs = require('fs');
const path = require('path');
const base = 'C:/Svemir/data/sessions/c1792946760393lb6a/medijana_baza/roj_glm';

// vodeni_sistem: nalaz.md sekcija u završnom tekstu, između naslova i kraja bloka
{
  const t = fs.readFileSync(path.join(base, '_izvuceno', 'vodeni_sistem.lasttext.txt'), 'utf8');
  const start = t.indexOf('# `nalaz.md`');
  const fenceStart = t.indexOf('```', start);
  const fenceEnd = t.indexOf('```', fenceStart + 3);
  if (start >= 0 && fenceStart >= 0 && fenceEnd > fenceStart) {
    let body = t.slice(fenceStart + 3, fenceEnd);
    body = body.replace(/^[a-z]*\n/, ''); // skini jezik oznaku
    fs.writeFileSync(path.join(base, 'vodeni_sistem', 'nalaz.md'), body);
    console.log('vodeni nalaz.md:', body.length);
  } else console.log('vodeni: blok nije nadjen', { start, fenceStart, fenceEnd });
}

// numizmatika: nalaz.md posle novac.json bloka
{
  const t = fs.readFileSync(path.join(base, '_izvuceno', 'numizmatika.lasttext.txt'), 'utf8');
  const m = t.match(/nalaz\.md[^\n]*\n+(```[a-z]*\n([\s\S]*?)```)/);
  if (m) {
    fs.writeFileSync(path.join(base, 'numizmatika', 'nalaz.md'), m[2]);
    console.log('numizmatika nalaz.md:', m[2].length);
  } else console.log('numizmatika: blok nije nadjen');
}
