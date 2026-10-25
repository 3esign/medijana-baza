// Živi most: roj_glm rad → panel sesije (events.jsonl + index.json).
const fs = require('fs');
const path = require('path');

const ROJ = 'C:/Svemir/data/sessions/c1792946760393lb6a/medijana_baza/roj_glm';
const SESS = 'C:/Svemir/data/sessions';
const INDEX = 'C:/Svemir/data/chats/index.json';
const STATE_F = path.join(ROJ, 'sync_state.json');

const MAP = [
  { dir: 'glm-medijana-1-objekti-cd', pravac: 'objekti_CD', naziv: 'Objekti C–D i zatvoreni radovi' },
  { dir: 'glm-medijana-2-komparativni', pravac: 'komparativni_korpus', naziv: 'Komparativni korpus palata' },
  { dir: 'glm-medijana-3-vodeni', pravac: 'vodeni_sistem', naziv: 'Vodeni sistem kraj-do-kraja' },
  { dir: 'glm-medijana-4-epigrafika', pravac: 'epigrafika', naziv: 'Epigrafika (CIL III, Roimetalk)' },
  { dir: 'glm-medijana-5-numizmatika', pravac: 'numizmatika', naziv: 'Numizmatika — novac po sondama' },
  { dir: 'glm-medijana-6-gis', pravac: 'gis_udaljena', naziv: 'GIS i daljinska detekcija' },
];

function stamp() { return new Date().toISOString(); }
function readJSON(f, d) { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch (e) { return d; } }

function snapshot(pravacDir) {
  const p = path.join(ROJ, pravacDir);
  if (!fs.existsSync(p)) return { files: [], log: '' };
  const out = { files: [], log: '' };
  for (const f of fs.readdirSync(p)) {
    const fp = path.join(p, f);
    const st = fs.statSync(fp);
    if (st.isFile()) out.files.push([f, st.size, st.mtimeMs]);
  }
  out.files.sort();
  const log = path.join(p, 'izvrsavanje.log');
  if (fs.existsSync(log)) out.log = fs.readFileSync(log, 'utf8').slice(-400);
  // nalaz.md je najvažniji — uključi veličinu posebno
  const nalaz = path.join(p, 'nalaz.md');
  if (fs.existsSync(nalaz)) out.nalazSize = fs.statSync(nalaz).size;
  return out;
}

function describe(m, snap, prev) {
  const L = [];
  const newFiles = snap.files.filter(f => !prev || !prev.files.some(g => g[0] === f[0] && g[1] === f[1]));
  const nalaz = path.join(ROJ, m.pravac, 'nalaz.md');
  if (snap.nalazSize && (!prev || prev.nalazSize !== snap.nalazSize) && fs.existsSync(nalaz)) {
    const txt = fs.readFileSync(nalaz, 'utf8');
    // uvuci prvi značajniji deo nalaza (do 700 znakova)
    const body = txt.split('\n').filter(l => l.trim() && !l.startsWith('#')).join(' ').slice(0, 700);
    L.push(`**Predat nalaz** (${snap.nalazSize} B) — uvod:\n\n> ${body}…`);
  }
  if (newFiles.length) {
    L.push(`Novi fajlovi u radnom folderu: ${newFiles.map(f => '`' + f[0] + '` (' + f[1] + ' B)').join(', ')}`);
  }
  if (snap.log && (!prev || prev.log !== snap.log)) {
    const tailLines = snap.log.trim().split('\n').slice(-2).join(' | ').slice(0, 300);
    L.push(`Log izvršavanja (rep): ${tailLines}`);
  }
  if (!L.length) return null;
  const status = snap.nalazSize ? 'GOTOV — nalaz predat' : (newFiles.length ? 'RADI — piše na disk' : 'RADI');
  return `**[${status}]** ${m.naziv} — ${stamp().slice(11, 19)} UTC\n\n` + L.join('\n\n') +
    `\n\n_(živi most roj_glm → panel; rad um traje u \`roj_glm/${m.pravac}/\`)_`;
}

function appendMessage(sessDir, text, model) {
  const evF = path.join(SESS, sessDir, 'events.jsonl');
  const ev = fs.readFileSync(evF, 'utf8').trim().split('\n').map(l => JSON.parse(l));
  const seq = ev.length + 1;
  const now = Date.now();
  const mid = 'm-glmziv-' + sessDir + '-' + now;
  ev.push({
    id: 'e-' + mid, seq, at: new Date(now).toISOString(), type: 'message-added', messageId: mid,
    message: { id: mid, role: 'assistant', text, ts: now, model: model || 'glm/glm-5.3' }
  });
  fs.writeFileSync(evF, ev.map(e => JSON.stringify(e)).join('\n') + '\n');
  // session.json
  const sjF = path.join(SESS, sessDir, 'session.json');
  const sj = readJSON(sjF, {});
  sj.updated = new Date(now).toISOString();
  sj.messageCount = ev.length;
  fs.writeFileSync(sjF, JSON.stringify(sj, null, 2));
  return ev.length;
}

function updateIndex(sessDir, count) {
  const idx = readJSON(INDEX, []);
  const e = idx.find(x => x.id === sessDir);
  if (e) {
    e.messageCount = count;
    e.updated = new Date().toISOString();
    e.lastMessageAt = Date.now();
    e.dataBytes = fs.statSync(path.join(SESS, sessDir, 'events.jsonl')).size;
  }
  fs.writeFileSync(INDEX, JSON.stringify(idx, null, 2));
}

let state = readJSON(STATE_F, {});
let changed = 0;
for (const m of MAP) {
  const snap = snapshot(m.pravac);
  if (!snap.files.length) continue;
  const prev = state[m.dir];
  const sig = JSON.stringify([snap.files, snap.log, snap.nalazSize]);
  if (prev && prev.sig === sig) continue;
  const text = describe(m, snap, prev);
  if (!text) { state[m.dir] = { sig }; continue; }
  const count = appendMessage(m.dir, text);
  updateIndex(m.dir, count);
  state[m.dir] = { sig, at: stamp() };
  changed++;
  console.log(`[${stamp()}] ${m.dir}: +poruka (ukupno ${count})`);
}
fs.writeFileSync(STATE_F, JSON.stringify(state, null, 2));
console.log(`[${stamp()}] sync gotov, promena: ${changed}`);
