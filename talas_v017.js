#!/usr/bin/env node
// Talas v0.17 — epigrafski sloj (roj_glm/epigrafika/, sesija glm-medijana-4, 4 pada, nalaz
// izvucen iz transkripta): epigrafski_sloj.json iz natpisi.json + uskladjene verzije.
// Pokretanje: node talas_v017.js && node validator.js
const fs = require('fs');
const path = require('path');
const citaj = f => JSON.parse(fs.readFileSync(path.join(__dirname, f), 'utf8'));
const pisi = (f, o) => fs.writeFileSync(path.join(__dirname, f), JSON.stringify(o, null, 2) + '\n', 'utf8');
const poruka = [];
const VER = '0.17';
const DATUM = '2026-10-26';

// --- 0. verzije na 0.17 ---
const verzijaFajlovi = [
  'baza_podataka.json', 'prostorni_sloj.json', 'vodeni_linijski_sloj.json',
  'komparativni_lokaliteti.json', 'digitalni_pasos.json', 'vizuelni_sloj.json',
  'vizuelni_nalazi.json', 'skulpturski_program.json', 'sonde_sloj.json',
  'crtezi_sloj.json', 'sobe_sloj.json', 'mozaici_sloj.json', 'geofizika_sloj.json',
  'hidraulika_sloj.json', 'numizmaticki_sloj.json', 'objekti_cd_sloj.json', 'gis_izvori_sloj.json'
];
for (const f of verzijaFajlovi) {
  const o = citaj(f);
  const staro = o.verzija || o.version;
  if (o.version) o.version = VER; else o.verzija = VER;
  if (o.datum) o.datum = DATUM;
  pisi(f, o);
  poruka.push(`verzija ${f}: ${staro} -> ${VER}`);
}

// --- 1. epigrafski_sloj.json ---
{
  const n = citaj('roj_glm/epigrafika/natpisi.json');
  const sloj = {
    svrha: 'Epigrafski sloj Medijane — natpisi sa lokaliteta sa statusom dokaza; dvojezicki grcko-latinski program vile',
    verzija: VER,
    datum: DATUM,
    autor: 'Svemir (za dr Poturak Semira)',
    izvor_glavni: {
      id: 'glm-epigrafika',
      rad: 'GLM sesija glm-medijana-4-epigrafika (2026-10-25/26); nalaz iz transkripta posle 4 pada procesa',
      fajl: 'roj_glm/epigrafika/nalaz.md'
    },
    metod_poverenja: n.metod,
    natpisi: n.natpisi,
    korpusne_veze: n.korpuse || n.korpusi,
    otvoreni_zadaci: n.otvoreni_zadaci,
    sinteza: [
      'najmanje 8 natpisnih spomenika; grcki (carski/velikaski krug: Roimetalkes diasemotatos, Telesfor) + latinski (vojno-administrativni: Ampelius tribunus Batavorum, ob dedicationem domus)',
      'Roimetalkes "diasemotatos" = tracka kraljevska titula na porfirnoj bazi — ista poruka porekla dinastije kao Dea Dardanica na ulazu (dardansko-tracki identitet)',
      'ZO[HN] na zabi u vodenom kontekstu — votivni zivot, vezuje se uz iatrijski kult Eskulapa/Higije',
      'KORPUSNA RUPA: CIL III/IMS/AE brojevi nisu web-verifikovani; EDCS/EDH/LSA obrasci potvrdjeni i spremni za sledeci talas'
    ],
    veze_sa_slojevima: [
      'epi-001/002 -> skulpturski_program.json: porfirni par Eskulap/Higija',
      'epi-006 -> vodeni_linijski_sloj.json / hidraulika_sloj.json: vodeni kontekst nimfeja',
      'epi-007 -> objekti_cd_sloj.json: horreum'
    ]
  };
  pisi('epigrafski_sloj.json', sloj);
  poruka.push(`epigrafski_sloj.json: ${sloj.natpisi.length} natpisa, korpusne veze + 4 sinteze`);
}

// --- 2. baza: izvori + napredak ---
{
  const b = citaj('baza_podataka.json');
  if (Array.isArray(b.izvori) && !b.izvori.some(i => i.id === 'glm-epigrafika')) {
    b.izvori.push({ id: 'glm-epigrafika', rad: 'GLM roj: epigrafika Medijane (nalaz iz transkripta)', put: 'roj_glm/epigrafika/nalaz.md', tip: 'primarni-pregled', datum: DATUM });
  }
  const kljuc = 'napredak_v017';
  if (!b[kljuc]) b[kljuc] = [
    'v0.17: epigrafski sloj — 9 natpisa sa statusima dokaza; korpusni brojevi (CIL III/IMS/AE) ostaju OTVORENA RUPA sa potvrdjenim EDCS/EDH/LSA obrascima za sledeci talas'
  ];
  pisi('baza_podataka.json', b);
  poruka.push('baza_podataka.json: +1 izvor, +napredak v0.17');
}

console.log(poruka.join('\n'));
