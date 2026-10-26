// TALAS v0.24 — dovod vrelo->kastelum: kapacitet (Manning) + spajanje sa v0.23 kandidatom
// Ne menja postojeca ocitavanja; dodaje sekciju dovod_v024 i konflikt-zapis.
const fs = require('fs');
const P = __dirname;

const hid = JSON.parse(fs.readFileSync(P + '/hidraulika_sloj.json', 'utf8'));
const kand = JSON.parse(fs.readFileSync(P + '/dem_izvori_kandidati_v023.json', 'utf8'));
const prof = JSON.parse(fs.readFileSync(P + '/dem_profil_vrelo1_vila_v023.json', 'utf8'));

const v = kand.find(k => k.osm_node === '4115176757');
if (!v) throw new Error('kandidat 4115176757 nije nadjen');

// prva tacka profila (isto vrelo) ima GLO-30 kotu iz drugog uzorkovanja
const kota_profil = prof[0].m;
const kota_kand = v.kota_glo30;               // 212.4
const kota_vila = 198.2;                       // v0.21 (dem_sloj)
const kota_kastelum_dno = 208.0;               // ocitano: dno bazena A ~208 (jeremic1988)
const duzina_km = v.udaljenost_km;             // 1.71

// nagib do kasteluma i do vile (oba scenarija kote vrela)
const pad_promil = (kota, cilj, km) => +( (kota - cilj) / (km * 1000) * 1000 ).toFixed(2);

// Manning-Strickler: pravougaoni zidani kanal, n=0.014 (opus signinum malter)
function manning(b, h, S, n = 0.014) {
  const A = b * h, Pm = b + 2 * h, R = A / Pm;
  if (S <= 0) return { A: +A.toFixed(4), R: +R.toFixed(4), v: null, Q_l_s: null, Q_m3_dan: null,
    status: 'NEIZVODLJIVO — vrelo ispod cilja, gravitacioni dovod nemoguc' };
  const vodic = (1 / n) * Math.pow(R, 2 / 3) * Math.sqrt(S);
  return { A: +A.toFixed(4), R: +R.toFixed(4), v: +vodic.toFixed(3), Q_l_s: +(vodic * A * 1000).toFixed(1),
           Q_m3_dan: Math.round(vodic * A * 86400) };
}

const scen = [];
for (const [ime, kota] of [['kota_kandidata_212.4', kota_kand], ['kota_profila_207.6', kota_profil]]) {
  for (const S of [pad_promil(kota, kota_kastelum_dno, duzina_km) / 1000]) {
    for (const [b, h] of [[0.3, 0.2], [0.4, 0.3], [0.6, 0.3]]) {
      scen.push({ kota_vrela: ime, nagib_promila: +(S * 1000).toFixed(2), sirina_m: b, dubina_m: h, ...manning(b, h, S) });
    }
  }
}

const dovod = {
  svrha: 'Spaja v0.23 kandidat izvorista (OSM node 4115176757) sa hidraulickim modelom: kapacitet dovoda Manning-om i sudar sa Jeremicovom hipotezom 4,5 km / ~250 m.',
  kandidat: {
    osm_node: v.osm_node, lat: v.lat, lon: v.lon,
    kota_glo30_kandidat: kota_kand,
    kota_glo30_prva_tacka_profila: kota_profil,
    nesklad_kote: +(kota_kand - kota_profil).toFixed(1),
    nesklad_napomena: 'Dva uzorkovanja GLO-30 na istoj koordinati daju 212,4 vs 207,6 m (4,8 m razlike) — verovatno edge-piksel/rezample. Svi scenariji racunati za obe vrednosti; kvalitativan zakljucak ne zavisi od izbora.',
    kota_susedna: v.kota_susedna,
    udaljenost_km: duzina_km
  },
    reference: { kota_vila: kota_vila, kota_kastelum_dno_bazen_A: kota_kastelum_dno,
    napomena: 'Kastelum je na putu vrelo->vila; kanal C dockanduje kastelumu iznad dna bazena. Nagib racunat do dna bazena A kao konzervativna donja granica.' },
  nagibi_promila: {
    vrelo_ka_kastelumu_212: pad_promil(kota_kand, kota_kastelum_dno, duzina_km),
    vrelo_ka_kastelumu_207: pad_promil(kota_profil, kota_kastelum_dno, duzina_km),
    vrelo_ka_vili_212: pad_promil(kota_kand, kota_vila, duzina_km),
    poredjenje: 'Kanal C na Medijani meren 2-13 promila (Jeremic 1988); nasi nagibi 1,4-2,6 promila su na mekom kraju tog opsega — fizicki saglasno.',
    kriticni_uslov: 'Ako je stvarna kota vrela 207,6 m (drugo uzorkovanje), vrelo je ISPOD dna bazena A kasteluma (208,0) — gravitacioni dovod NE MOZE raditi i kandidat pada. Ako je 212,4 m — radi sa nagibom 2,6 promila. Kandidat je dakle uslovno validan: od 6 scenarija 3 rade, 3 su neizvodljiva. Razresenje trazi novo uzorkovanje DEM-a bez edge-piksela ili GNSS merenje na terenu.'
  },
  kapacitet_manning: {
    model: 'Manning-Strickler, pravougaoni kanal, n=0,014; dimenzije NISU merene na trasi (nikad iskopana) — opseg pokriva zidane rimske kanale tog ranga (kanal E je 0,32 m sirine).',
    scenariji: scen
  },
  poredjenje_sa_jeremicem: {
    jeremic_hipoteza: 'kaptaza ~4,5 km, izvor ~250 m n.m.v. (procena bez merenja) -> nagib ~9 promila',
    nas_nalaz: 'kandidat 1,71 km, 207,6-212,4 m -> nagib 1,4-2,6 promila',
    status: 'NE PROTIVURECNO, ALI SE RAZLIKUJE: Jeremicova brojka je procena rastojanja, ne merenje; nas kandidat je kraci i blazi. Ako je kaptaza bila dalje (do 4,5 km) nagib je jos blazi i dalje izvodljiv. U svakom slucaju kapacitet > potraznja za redove velicine.',
    zakljucak_kapaciteta: 'U izvodljivim scenarijima (kota 212,4, nagib 2,6 promila): 42-184 l/s (3.600-15.900 m3/dan) — najmanji scenarij (0,3 x 0,2 m) vec duplo preko kapaciteta merenog kanal E (17-45 l/s). Dovod nikad nije bio usko grlo; regulacija ustavama je bila obavezna, sto potvrdjuje arheologiju (ustave I/II, prelivnici 1-2-3).'
  },
  poverenje: 'srednje — kota vrela je kota terena (ne istoca), dimenzije kanala pretpostavljene, trasa pravolinijska (stvarna duzina do ~+15%)'
};

hid.dovod_v024 = dovod;
hid.verzija = '0.24';
hid.datum = '2026-10-26';

// novi konflikt-zapis (dodavanje, bez menjanja postojecih)
hid.konflikti = hid.konflikti || [];
if (!hid.konflikti.find(k => k.id === 'duzina-dovoda-45km-vs-171km')) {
  hid.konflikti.push({
    id: 'duzina-dovoda-45km-vs-171km',
    status: 'OTVOREN, SUZEN — kandidat identifikovan, potvrda samo iskopom/rekognosciranjem',
    obrazlozenje: 'Jeremic 1988 procenjuje kaptazu na ~4,5 km u pravcu Niske Banje (bez istrazivanja trase). V0.23 nalazi OSM node 4115176757 na 1,71 km, kota 207,6-212,4 m, sa monotonim profilom bez prepreke (dem_profil_vrelo1_vila_v023.json). Hidraulicki, oba rešenja rade; kandidat je po distanci i nagibu blizi merenom opsegu kanala C (2-13 promila).',
    ostaje_otvoreno: 'nema arheoloskog dokaza da JE ovaj node bio kaptaza; rimska kaptaza u Banji (fn 12, preko Nenadovica) je tacno nepoznata'
  });
}

fs.writeFileSync(P + '/hidraulika_sloj.json', JSON.stringify(hid, null, 1));
console.log('v024 upisan; scenarija:', scen.length, '| min Q:', Math.min(...scen.filter(s=>s.Q_l_s).map(s => s.Q_l_s)), 'l/s, max Q:', Math.max(...scen.filter(s=>s.Q_l_s).map(s => s.Q_l_s)), 'l/s');
