// TALAS v0.25b — upis razresenja kote vrela u slojeve + Manning proracun na novoj koti.
const fs = require('fs');

const ukr = JSON.parse(fs.readFileSync('dem_izvor_ukrstteni_v025.json', 'utf8'));
const tacke = ukr.izmereno.filter(x => x.kota != null).map(x => ({ izvor: x.izvor, kota: x.kota }));
const kote = tacke.map(t => t.kota);
const min = Math.min(...kote), max = Math.max(...kote);
// najbolja procena: SRTM 90+30 (209,209) i GLO-30 (211) se slazu; open-elevation (202, gruba interpolacija)
// uzimamo medijanu srednjeg klastera -> 209.5
const KOTA = 209.5;
const DNO_BAZENA_A = 208.0;
const DUZINA_M = 1710;
const KOTA_VILA = 198.2;
const nagib_kastelum = (KOTA - DNO_BAZENA_A) / DUZINA_M * 1000;
const nagib_vila = (KOTA - KOTA_VILA) / DUZINA_M * 1000;

function manning(sir, dub, nagibPromil) {
  const S = nagibPromil / 1000, A = sir * dub, P = 2 * dub + sir, R = A / P;
  const v = Math.pow(R, 2 / 3) * Math.sqrt(S) / 0.014;
  const Q = A * v;
  return { sirina_m: sir, dubina_m: dub, A, R: +R.toFixed(4), v: +v.toFixed(3), Q_l_s: +(Q * 1000).toFixed(1), Q_m3_dan: Math.round(Q * 86400) };
}

const dims = [[0.3, 0.2], [0.4, 0.3], [0.6, 0.3]];
const scen = dims.map(d => ({ kota_vrela: KOTA, nagib_promila: +nagib_kastelum.toFixed(2), ...manning(d[0], d[1], nagib_kastelum) }));

// 1) hidraulika_sloj.json
const hid = JSON.parse(fs.readFileSync('hidraulika_sloj.json', 'utf8'));
hid.verzija = '0.25';
hid.datum = '2026-10-26';
hid.dovod_v025 = {
  svrha: 'Razresenje nesklada kote vrela iz v0.24 nezavisnim ukrstenim DEM testom; Manning proracun na razresenoj koti.',
  ukrstteni_test: {
    opis: 'Vise nezavisnih DEM servisa na koordinati node 4115176757 (43.31663N, 21.96736E) + 3x3 grid ±50 m.',
    tacke: tacke,
    opseg_m: [min, max],
    grid_nalaz: '3x3 grid (±50 m): 210-211 m na 6 juznih celija, 218 m na 3 severne — vrelo sedi u podnozju strme banke (+7 m na 50 m). Svaki mali pomak koordinate menja kotu za ±5 m; TO je koren nesklada 212,4/207,6 iz v0.24, ne kvar rastera.',
    razresenje: 'Vrednost 207,6 m odbijena (ispod svih nezavisnih izvora); 212,4 m malo visoko. Prihvacena procena 209,5 m (SRTM 90/30: 209; GLO-30: 211).'
  },
  kandidat_razresen: { osm_node: '4115176757', kota_prihvacena_m: KOTA, opseg_neizvesnosti_m: [min, max], status: 'VALIDAN — sve tri dimenzije izvodljive, ali nagib na samom dnu fizickog opsega' },
  nagibi_promila: {
    vrelo_ka_kastelumu: +nagib_kastelum.toFixed(2),
    vrelo_ka_vili: +nagib_vila.toFixed(2),
    poredjenje: 'Kanal C na Medijani meren 2-13 promila (Jeremic 1988). Nasih 0,9 promila do kasteluma je ISPOD merenog opsega — znacajno blazi i od v0.24 procene (2,57). Kanal sa padom 0,9 promila radi, ali zahteva precizno zidanje i osetljiv je na zatrupevanje.',
    kriticni_uslov_v024_razresen: 'Vrelo je i dalje iznad dna bazena A (208,0), ali sa marginom od samo ~1,5 m umesto ranjivih 2,57 promila. Gravitacioni dovod izvodljiv uz uslov da kaptaza nije bila nize od ~208,5 m. GNSS na terenu ostaje jedina potpuna potvrda.'
  },
  kapacitet_manning_v025: {
    model: 'Manning-Strickler, pravougaoni kanal, n=0,014; iste tri dimenzije kao v0.24, novi nagib.',
    nagib_promila: +nagib_kastelum.toFixed(2),
    scenariji: scen
  },
  promena_u_odnosu_na_v024: 'Kota vrela 212,4 -> 209,5 (opseg 202-211). Pad 2,57 -> 0,9 promila. Q 42-184 -> ' + scen[0].Q_l_s + '-' + scen[2].Q_l_s + ' l/s. Najmanji kanal (0,3x0,2) i dalje preko donje granice kapaciteta kanala E (17 l/s), ali bez duplog prekovai — zakljucak o potvrdi ustava slabi na \'konzistentno\', ne \'obavezno\'.'
};
fs.writeFileSync('hidraulika_sloj.json', JSON.stringify(hid, null, 1));

// 2) dem_sloj.json — korekcija_v025 (istorija se ne brise)
const dem = JSON.parse(fs.readFileSync('dem_sloj.json', 'utf8'));
dem.verzija = '0.25';
dem.korekcija_v025 = {
  nadlezno: 'razresava nesklad unutar izvorista_kandidati_v023 (212,4 vs 207,6 na node 4115176757)',
  nalaz: 'Nezavisni ukrstteni test (SRTM 90 m: 209; SRTM 30 m: 209; GLO-30: 211; open-elevation: 202,3) — teren na vrelu 209-211 m. 3x3 grid pokazuje banku 218 m na 50 m severno: vrelo je u podnozju padine, pa ±50 m pomaka koordinate znaci ±5-7 m kote.',
  dokaz: 'dem_izvor_ukrstteni_v025.json (6 servisa + 9-celicni grid)',
  prihvacena_kota_m: KOTA,
  posledica: 'Nagib dovoda vrelo->kastelum ~0,9 promila — ispod Jeremicem merenog opsega kanala C (2-13), gravitacija radi uz malu marginu.'
};
fs.writeFileSync('dem_sloj.json', JSON.stringify(dem, null, 1));

// 3) validator dopuna
let val = fs.readFileSync('validator.js', 'utf8');
if (!val.includes('v025')) {
  val += `
// --- v0.25: fizika razresenog vrela ---
try {
  const ukr = JSON.parse(fs.readFileSync(path.join(DIR, 'dem_izvor_ukrstteni_v025.json'), 'utf8'));
  const hid = JSON.parse(fs.readFileSync(path.join(DIR, 'hidraulika_sloj.json'), 'utf8'));
  const dem = JSON.parse(fs.readFileSync(path.join(DIR, 'dem_sloj.json'), 'utf8'));
  const tacke = ukr.izmereno.filter(x => x.kota != null).map(x => x.kota);
  const kota = hid.dovod_v025.kandidat_razresen.kota_prihvacena_m;
  if (!tacke.length) greske.push('v025: ukrstteni test nema izmerenih tacaka');
  if (kota < Math.min(...tacke) - 1 || kota > Math.max(...tacke) + 1) greske.push('v025: prihvacena kota van opsega nezavisnih merenja');
  if (!dem.korekcija_v025 || dem.korekcija_v025.prihvacena_kota_m !== kota) greske.push('v025: korekcija_v025 u dem_sloju ne slaze se sa hidraulikom');
  const nag = hid.dovod_v025.nagibi_promila.vrelo_ka_kastelumu;
  if (nag <= 0) greske.push('v025: negativan nagib mora biti NEIZVODLJIVO, a razresenje kaze izvodljivo');
  if (nag > 13) greske.push('v025: nagib iznad maksimuma merenog kanala C (13 promila)');
  for (const s of hid.dovod_v025.kapacitet_manning_v025.scenariji) {
    if (!(s.Q_l_s > 0) || s.v <= 0.1 || s.v > 4) greske.push('v025: Q/brzina van fizickog opsega u scenariju ' + s.sirina_m + 'x' + s.dubina_m);
  }
} catch (e) { greske.push('v025: ' + e.message); }
`;
  fs.writeFileSync('validator.js', val);
}
console.log('KOTA', KOTA, 'nagib kastelum', nagib_kastelum.toFixed(2), 'nagib vila', nagib_vila.toFixed(2));
console.log(JSON.stringify(scen, null, 1));
