// radna skripta grane objekti_CD: izdvaja tekst poruka iz JSONL transkripta pale sesije
const fs = require('fs');
const lines = fs.readFileSync(__dirname + '/izvrsavanje.log', 'utf8').split('\n');
const out = [];
for (const l of lines) {
  if (!l.trim()) continue;
  try {
    const o = JSON.parse(l);
    if (o.type === 'assistant' && o.message && o.message.content) {
      for (const c of o.message.content) {
        if (c.type === 'text' && c.text.trim()) {
          out.push('--- [' + (o.timestamp || '').slice(11, 19) + ']\n' + c.text.slice(0, 700));
        }
      }
    }
  } catch (e) { /* preskoci ne-json linije */ }
}
fs.writeFileSync(__dirname + '/_transkript_tekstovi.txt', out.join('\n'), 'utf8');
console.log('zapisa: ' + out.length + ' -> _transkript_tekstovi.txt');
