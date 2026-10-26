// talas v0.31 — lanac relativnih polozaja: zamena aproksimacija tr-03/tr-04 tackastim sidrom OSM
// Sidro: track way 108165624 (Gornjomatejevacka, severoistocni kraj), lanac iz saopstenja ZZSK 12.09.2025
const fs = require('fs');
const DIR = __dirname;

const sidro = { lon: 21.9291714, lat: 43.3408125 }; // NE kraj track way 108165624 ("kraj ulice", tr-03)

// pomeraj po azimutu 45° (ka severoistoku, uzbrdo ka izvoru)
function ofset(lon, lat, metara) {
  const dLat = metara * Math.cos(Math.PI / 4) / 111320;
  const dLon = metara * Math.sin(Math.PI / 4) / (111320 * Math.cos(lat * Math.PI / 180));
  return [+lon.toFixed(7), +(lat + dLat).toFixed(7)];
}

const lanac = {
  version: '0.31',
  datum: '2026-10-26',
  sloj: 'akvadukt_koordinate_v031',
  metod: 'lanac relativnih polozaja: ZZSK saopstenje 12.09.2025 daje medjusobne razdaljine gradilista; sidro je severoistocni kraj OSM track way 108165624 (Gornjomatejevacka), ostale tacke izvedene ofsetom po azimutu 45° (ka severoistoku, uzbrdo ka izvoru)',
  nalaz: {
    greska_tr04_otkrivena: 'tr-04 (Ardija) u v0.26 geokodiran na centar Panteleja [21.9158,43.3400], ~950 m zapadno od tr-03; saopstenje kaze Ardija je 150 m severoistocno od gradilista Gornjomatejevacka 2025 -> stara koordinate pogresna za ~1 km',
    sidro: { osm_way: 108165624, koordinate: [sidro.lon, sidro.lat], opis: 'severnoistocni kraj track way Gornjomatejevacka (nastavak residential way 293286423)', utemeljenje: 'ZZSK: decembar 2024. drugo gradiliste na kraju istoimene ulice' },
    gradilista: [
      { id: 'tr-03', lokalitet: 'Rimski akvadukt - Gornjomatejevacka (dec 2024)', koordinate: [sidro.lon, sidro.lat], metod: 'SIDRO (OSM geometrija, ne aproksimacija)', kota_srtm90m: 248 },
      { id: 'tr-06', lokalitet: 'Rimski akvadukt - Gornjomatejevacka (sep 2025, >90 m)', koordinate: ofset(sidro.lon, sidro.lat, 100), metod: 'ofset 100 m ka severoistoku od sidra (saopstenje: dec 2024 gradiliste ~100 m jugozapadno = 2025 je 100 m severoistocno)', kota_srtm90m: 248 },
      { id: 'tr-04', lokalitet: 'Rimski akvadukt - Ardija (maj 2025, ~40 m)', koordinate: ofset(sidro.lon, sidro.lat, 250), metod: 'ofset 250 m ka severoistoku od sidra (100 m do 2025 + 150 m ka Ardiji)', kota_srtm90m: 256, korekcija: 'zamenjuje v0.26 koordinate [21.9158347,43.340042] (centar Panteleja) — bila ~1 km zapadnije' }
    ],
    sanity_dem: 'SRTM 90 m: Ardija 256 > Gornjomatejevacka 248 > kasarna Knjaz Mihailo 206 — monoton silazak ka gradu, smer lanca ka severoistoku je uzbrdo ka izvoru (saglasno trasi)',
    ostalo_bez_promene: 'tr-01 (Podvinik), tr-02 (Prevalac/gasovod), tr-05 (kasarna) zadrzavaju v0.26/v0.29 koordinate; njihove medjusobne razdaljine saopstenje ne daje'
  },
  nesigurnost: 'azimut 45° je pretpostavka (saopstenje kaze samo severoistočno/jugozapadno); stvarni azimut trase ide uz padinu, greska do ~30% razdaljine poprecno na trasu; kota SRTM 90 m gruba na padini',
  sukob_vinik_banja: 'otvoren (nepromenjen); odlucuje iskop spoja/ustave',
  izvori: [
    { naziv: 'ZZSK Nis — Rimski akvadukt Gornjomatejevacka (saopstenje 12.09.2025, relativne razdaljine gradilista)', url: 'https://www.zzsknis.rs/zai-rimski-akvadukt-gornjomatejevacka.php' },
    { naziv: 'sveoarheologiji.com — otkrice 90 m segmenta (13.09.2025)', url: 'https://sveoarheologiji.com/otkrice-u-nisu-ostaci-rimskog-akvadukta' },
    { naziv: 'OSM way 108165624 (track Gornjomatejevacka) — sidro geometrije, Nominatim', url: 'https://www.openstreetmap.org/way/108165624' },
    { naziv: 'OpenTopoData SRTM 90 m — kote lanca', url: 'https://api.opentopodata.org/v1/srtm90m?locations=43.3408,21.9292' }
  ]
};

// 1. novi sloj
fs.writeFileSync(DIR + '/akvadukt_koordinate_v031.json', JSON.stringify(lanac, null, 1));

// 2. ispravka u akvadukt_trasa_v026.json
const ak = JSON.parse(fs.readFileSync(DIR + '/akvadukt_trasa_v026.json', 'utf8'));
for (const s of ak.segmenti) {
  if (s.id === 'tr-03') {
    s.koordinate = [sidro.lon, sidro.lat];
    s.geokod = 'SIDRO OSM way 108165624 NE kraj (v0.31, ranije centroid istog way-a)';
    s.koordinate_v031 = 'tacna geometrija ulice';
  }
  if (s.id === 'tr-04') {
    s.koordinate = ofset(sidro.lon, sidro.lat, 250);
    s.geokod = 'KOREKCIJA v0.31: ofset 250 m NE od tr-03 po relativnim razdaljinama ZZSK (staro: centar Panteleja, ~1 km zapadnije)';
    s.korekcija_v031 = 'stara koordinate [21.9158347,43.340042] bila kod centra Panteleja; saopstenje: Ardija 150 m NE od gradilista 2025';
  }
}
ak.segmenti.push({
  id: 'tr-06', lokalitet: 'Rimski akvadukt - Gornjomatejevacka (gradiliste 2025)', godina: 2025,
  napomena: 'parcela Highland invest doo, >90 m akvadukta, sep 2025; ukupno ~300 m na celoj trasi',
  koordinate: ofset(sidro.lon, sidro.lat, 100),
  geokod: 'ofset 100 m NE od tr-03 (v0.31, lanac relativnih polozaja)',
  kota_srtm90m: 248
});
ak.geokodiranje_v031 = 'tr-03 sidro OSM geometrija; tr-04 korigovan; tr-06 novi; vidi akvadukt_koordinate_v031.json';
fs.writeFileSync(DIR + '/akvadukt_trasa_v026.json', JSON.stringify(ak, null, 1));

// 3. validator blok
const val = fs.readFileSync(DIR + '/validator.js', 'utf8');
const blok = `
// --- v0.31: lanac relativnih polozaja akvadukta ---
try {
  const lk = JSON.parse(fs.readFileSync(path.join(DIR, 'akvadukt_koordinate_v031.json'), 'utf8'));
  const ak2 = JSON.parse(fs.readFileSync(DIR + '/akvadukt_trasa_v026.json', 'utf8'));
  const sidroK = lk.nalaz.sidro.koordinate;
  const g = id => ak2.segmenti.find(s => s.id === id);
  if (!g('tr-06')) greske.push('v031: segment tr-06 (gradiliste 2025) fali u trasi');
  // tr-03 mora biti tacno sidro
  if (Math.abs(g('tr-03').koordinate[0] - sidroK[0]) > 1e-9 || Math.abs(g('tr-03').koordinate[1] - sidroK[1]) > 1e-9) greske.push('v031: tr-03 nije na sidru OSM way 108165624');
  // tr-04/tr-06 moraju biti severoistocno od tr-03 (stara greska: ~1 km zapadno)
  const t3 = g('tr-03').koordinate, t4 = g('tr-04').koordinate, t6 = g('tr-06').koordinate;
  if (!(t4[0] > t3[0] && t4[1] > t3[1])) greske.push('v031: tr-04 Ardija mora biti NE od tr-03 (relativni polozaj iz saopstenja)');
  if (!(t6[0] > t3[0] && t6[1] > t3[1])) greske.push('v031: tr-06 mora biti NE od tr-03');
  // razdaljine ~100 i ~250 m (tolerancija azimuta)
  const dist = (a, b) => 111320 * Math.hypot((a[0]-b[0]) * Math.cos(a[1]*Math.PI/180), a[1]-b[1]);
  const d36 = dist(t3, t6), d34 = dist(t3, t4);
  if (d36 < 60 || d36 > 160) greske.push('v031: razdaljina tr-03 -> tr-06 van opsega 100 m (+-azimut): ' + d36.toFixed(0));
  if (d34 < 150 || d34 > 400) greske.push('v031: razdaljina tr-03 -> tr-04 van opsega 250 m (+-azimut): ' + d34.toFixed(0));
  if (d36 >= d34) greske.push('v031: Ardija (150 m od 2025) mora biti dalje od tr-03 nego gradiliste 2025 (100 m)');
  // monoton silazak ka gradu
  const ko = lk.nalaz.gradilista;
  const kArd = ko.find(x => x.id === 'tr-04').kota_srtm90m, kSid = ko.find(x => x.id === 'tr-03').kota_srtm90m;
  if (!(kArd >= kSid)) greske.push('v031: Ardija mora biti na koti >= Gornjomatejevacka (uzbrdo ka izvoru na severoistoku)');
  if (!lk.sukob_vinik_banja || !/otvoren/i.test(lk.sukob_vinik_banja)) greske.push('v031: sukob vinik-vs-banja mora ostati otvoren');
  for (const i of lk.izvori) if (!/^https?:\\/\\//.test(i.url)) greske.push('v031: izvor bez URL: ' + i.naziv);
} catch (e) { greske.push('v031: ' + e.message); }
`;
fs.writeFileSync(DIR + '/validator.js', val + blok);
console.log('v0.31 upisan; pokrecem validator...');
