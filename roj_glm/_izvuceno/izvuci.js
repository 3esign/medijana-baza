const fs = require('fs');
const path = require('path');
const base = 'C:/Svemir/data/sessions/c1792946760393lb6a/medijana_baza/roj_glm';
const d = process.argv[2];
const lines = fs.readFileSync(path.join(base, d, 'izvrsavanje.log'), 'utf8').split('\n').filter(Boolean);
const writes = [];
let lastText = '';
for (const l of lines) {
  let j; try { j = JSON.parse(l); } catch (e) { continue; }
  if (j.type !== 'assistant' || !j.message || !Array.isArray(j.message.content)) continue;
  for (const c of j.message.content) {
    if (c.type === 'tool_use' && c.name === 'Write' && c.input && c.input.file_path && c.input.content) {
      writes.push({ path: c.input.file_path, content: c.input.content });
    }
    if (c.type === 'text' && c.text && c.text.length > 500) lastText = c.text;
  }
}
fs.writeFileSync(path.join(base, '_izvuceno', d + '.writes.json'), JSON.stringify(writes, null, 1));
fs.writeFileSync(path.join(base, '_izvuceno', d + '.lasttext.txt'), lastText);
console.log(d, 'writes:', writes.length, 'lastText:', lastText.length);
