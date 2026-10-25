// Živi most v2: rad GLM uma struji u panel sesiju kao NIZ DISKRETNIH poruka —
// svaki poziv alata i svaki ispis uma je zasebna poruka, kao u običnom razgovoru.
// Ništa se ne prepravlja: novo = nova poruka. Most je otporan na pad (stanje na disk).
const fs = require('fs');
const path = require('path');

const ROJ = 'C:/Svemir/data/sessions/c1792946760393lb6a/medijana_baza/roj_glm';
const SESS = 'C:/Svemir/data/sessions';
const INDEX = 'C:/Svemir/data/chats/index.json';
const STATE_F = path.join(ROJ, 'sync_state.json');
const INTERVAL_MS = 10000;
const MODEL = { 1: 'glm/glm-5.3', 2: 'glm/glm-5.3', 3: 'glm/glm-5.3-flash', 4: 'glm/glm-5.3-flash', 5: 'glm/glm-5.3-flash', 6: 'glm/glm-5.3-flash' };

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

function loadEvents(sessDir) {
  const evF = path.join(SESS, sessDir, 'events.jsonl');
  let lines = [];
  try { lines = fs.readFileSync(evF, 'utf8').split('\n').filter(Boolean); } catch (e) {}
  return { evF, ev: lines.map(l => { try { return JSON.parse(l); } catch (e) { return null; } }).filter(Boolean) };
}

function appendMessages(m, ev, evF, msgs) {
  if (!msgs.length) return;
  for (const text of msgs) {
    const now = Date.now() + ev.length;
    const mid = 'm-glmzivo-' + m.dir + '-' + now;
    ev.push({
      id: 'e-glmzivo-' + m.dir + '-' + now, seq: ev.length + 1, at: new Date(now).toISOString(),
      type: 'message-added', messageId: mid,
      message: { id: mid, role: 'assistant', ts: now, model: MODEL[m.dir.match(/-(\d)-/)[1]] || 'glm/glm-5.3', text }
    });
  }
  fs.writeFileSync(evF, ev.map(e => JSON.stringify(e)).join('\n') + '\n');
  // registar + session.json da panel diše
  const sjF = path.join(SESS, m.dir, 'session.json');
  const sj = readJSON(sjF, {});
  sj.updated = new Date().toISOString();
  sj.messageCount = ev.length;
  fs.writeFileSync(sjF, JSON.stringify(sj, null, 2));
  const idx = readJSON(INDEX, []);
  const e2 = idx.find(x => x.id === m.dir);
  if (e2) {
    e2.messageCount = ev.length;
    e2.updated = new Date().toISOString();
    e2.lastMessageAt = Date.now();
    e2.dataBytes = fs.statSync(evF).size;
  }
  fs.writeFileSync(INDEX, JSON.stringify(idx, null, 2));
}

// Novi bajtovi stream-json loga → diskretne poruke ( jedna po događaju ).
function tickLog(m, state) {
  const logF = path.join(ROJ, m.pravac, 'izvrsavanje.log');
  if (!fs.existsSync(logF)) return;
  const size = fs.statSync(logF).size;
  const st = state[m.dir] || {};
  if (st.logSize == null) { state[m.dir] = { ...st, logSize: size, files: st.files || '' }; return; } // prvi prolaz samo beleži
  if (st.logSize === size) return;
  const fd = fs.openSync(logF, 'r');
  const buf = Buffer.alloc(Math.max(0, size - st.logSize));
  fs.readSync(fd, buf, 0, buf.length, st.logSize);
  fs.closeSync(fd);
  state[m.dir] = { ...st, logSize: size };
  const chunk = buf.toString('utf8');
  const msgs = [];
  let thinking = 0, thinkingTokens = 0;
  for (const line of chunk.split('\n')) {
    if (!line.trim().startsWith('{')) continue;
    let j; try { j = JSON.parse(line); } catch (e) { continue; }
    if (j.type === 'system' && j.subtype === 'thinking_tokens') { thinking++; thinkingTokens = j.estimated_tokens || thinkingTokens; continue; }
    const t = new Date(j.timestamp || stamp());
    const hh = t.toISOString().slice(11, 19);
    if (j.type === 'assistant' && j.message && Array.isArray(j.message.content)) {
      for (const c of j.message.content) {
        if (c.type === 'text' && c.text && c.text.trim())
          msgs.push(c.text.trim().slice(0, 4000));
        else if (c.type === 'tool_use') {
          const inp = JSON.stringify(c.input || {});
          msgs.push('🔧 **' + c.name + '** `' + (inp.length > 300 ? inp.slice(0, 300) + '…' : inp) + '`');
        }
      }
    } else if (j.type === 'user' && j.message && j.message.content) {
      const c = j.message.content;
      const txt = typeof c === 'string' ? c : (Array.isArray(c) ? c.filter(x => x.type === 'text').map(x => x.text).join(' ') : '');
      const toolRes = Array.isArray(c) ? c.filter(x => x.type === 'tool_result') : [];
      if (toolRes.length) {
        const r = toolRes[0].content;
        const s = typeof r === 'string' ? r : JSON.stringify(r || '');
        msgs.push('📄 _rezultat alata:_ ' + s.replace(/\s+/g, ' ').slice(0, 500));
      } else if (txt.trim())
        msgs.push('👤 ' + txt.trim().slice(0, 500));
    } else if (j.type === 'result' && j.result) {
      msgs.push('✅ **Rezultat daha:** ' + String(j.result).replace(/\s+/g, ' ').slice(0, 1200));
    }
  }
  if (msgs.length) {
    const { evF, ev } = loadEvents(m.dir);
    appendMessages(m, ev, evF, msgs.slice(0, 12)); // max 12 poruka po ciklusu, da ne potopi
    console.log(`[${stamp()}] ${m.dir}: +${msgs.length} poruka toka`);
  } else if (thinking > 0) {
    // um tiho razmišlja — otkucaj srca najviše na 60 s, da panel vidi da diše
    const last = stamp().slice(0, 16);
    const stt = state[m.dir] || {};
    if (stt.hb !== last) {
      state[m.dir] = { ...stt, hb: last };
      const { evF, ev } = loadEvents(m.dir);
      appendMessages(m, ev, evF, ['💭 _um razmišlja… (≈' + thinkingTokens + ' tokena mišljenja ovog daha)_']);
    }
  }
}

// Promene fajlova u radnom folderu → poruka "sta je um napravio".
function tickFiles(m, state) {
  const dir = path.join(ROJ, m.pravac);
  if (!fs.existsSync(dir)) return;
  const st = state[m.dir] || {};
  const files = fs.readdirSync(dir).filter(f => f !== 'izvrsavanje.log').map(f => {
    const s = fs.statSync(path.join(dir, f));
    return f + ':' + s.size;
  }).sort().join('|');
  if (st.files === undefined) { state[m.dir] = { ...st, files }; return; }
  if (st.files === files) return;
  const old = new Set((st.files || '').split('|'));
  const cur = new Set(files.split('|'));
  const fresh = [...cur].filter(x => !old.has(x));
  state[m.dir] = { ...st, files };
  const nalaz = fresh.find(x => x.startsWith('nalaz.md:'));
  if (nalaz) {
    const { evF, ev } = loadEvents(m.dir);
    appendMessages(m, ev, evF, ['🏁 **GOTOV — nalaz predat** (`nalaz.md`, ' + nalaz.split(':')[1] + ' bajtova). Integracija u bazu sledi u glavnoj sesiji.']);
  } else if (fresh.length) {
    const { evF, ev } = loadEvents(m.dir);
    appendMessages(m, ev, evF, ['📂 **Novi fajlovi u radnom folderu:**\n' + fresh.map(x => '- `' + x.split(':').slice(0, -1).join(':') + '` (' + x.split(':').pop() + ' B)').join('\n')]);
  }
}

function main() {
  const state = readJSON(STATE_F, {});
  for (const m of MAP) {
    try { tickLog(m, state); } catch (e) { console.error(`[${stamp()}] log ${m.dir}: ${e.message}`); }
    try { tickFiles(m, state); } catch (e) { console.error(`[${stamp()}] files ${m.dir}: ${e.message}`); }
  }
  fs.writeFileSync(STATE_F, JSON.stringify(state, null, 2));
}

console.log(`[${stamp()}] živi most v2 start, ciklus ${INTERVAL_MS / 1000}s`);
main();
setInterval(main, INTERVAL_MS);
setInterval(() => process.stdout.write(''), 60000); // drži stdout živim
