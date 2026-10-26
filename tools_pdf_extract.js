// Grubo vađenje teksta iz PDF-a (bez spoljnih zavisnosti)
const fs = require('fs');
const zlib = require('zlib');
const file = process.argv[2];
const buf = fs.readFileSync(file);
let streams = [];
let idx = 0;
while (true) {
  const s = buf.indexOf('stream', idx); if (s < 0) break;
  const e = buf.indexOf('endstream', s); if (e < 0) break;
  let data = buf.slice(s + 7, e);
  while (data.length && (data[0] === 13 || data[0] === 10)) data = data.slice(1);
  try { streams.push(zlib.inflateSync(data)); } catch (_) {}
  idx = e + 9;
}
const text = Buffer.concat(streams).toString('latin1');
const re = /\(((?:\\.|[^()\\])*)\)/g;
let m; const parts = [];
while ((m = re.exec(text))) parts.push(m[1]);
let joined = parts.join('').replace(/\\(\d{3})/g, (x, o) => String.fromCharCode(parseInt(o, 8)));
fs.writeFileSync(file + '.txt', joined);
console.log('stream bytes:', text.length, '| extracted:', joined.length);
