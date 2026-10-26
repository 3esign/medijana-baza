// TALAS v0.25 — razrešenje kote vrela node 4115176757 nezavisnim DEM-ovima.
// Problem iz v0.24: dva GLO-30 uzorka na istoj koordinati daju 212,4 vs 207,6 m
// (razlika 4,8 m odlučuje da li gravitacioni dovod postoji). Nezavisni ukršteni test:
// više DEM servisa + 3x3 grid oko tačke (edge-pixel dijagnoza).
const https = require('https');
const http = require('http');
const fs = require('fs');

const LAT = 43.31663, LON = 21.96736; // vrelo kandidat (OSM node 4115176757)
const D = 0.00045; // ~50 m korak za grid

function fetchJSON(url, opts = {}) {
  return new Promise((res, rej) => {
    const mod = url.startsWith('http://') ? http : https;
    const req = mod.get(url, { headers: { 'Accept': 'application/json', 'User-Agent': 'medijana-baza/0.25' }, timeout: 25000, ...opts }, r => {
      let b = '';
      r.on('data', c => b += c);
      r.on('end', () => { try { res(JSON.parse(b)); } catch (e) { rej(new Error('parse: ' + b.slice(0, 200))); } });
    });
    req.on('error', rej);
    req.on('timeout', () => { req.destroy(); rej(new Error('timeout')); });
  });
}

async function openMeteo(lat, lon) {
  const j = await fetchJSON(`https://api.open-meteo.com/v1/elevation?latitude=${lat}&longitude=${lon}`);
  return { izvor: 'open-meteo (Copernicus GLO-30)', kota: j.elevation[0] };
}
async function openTopoData(model, lat, lon) {
  const j = await fetchJSON(`https://api.opentopodata.org/v1/${model}?locations=${lat},${lon}`);
  return { izvor: model, kota: j.results[0].elevation };
}
async function openElevation(lat, lon) {
  const j = await fetchJSON(`https://api.open-elevation.com/api/v1/lookup?locations=${lat},${lon}`);
  return { izvor: 'open-elevation (SRTM)', kota: j.results[0].elevation };
}

(async () => {
  const izmereno = [];

  // 1) nezavisni servisi na tačnoj koordinati vrela
  const ciljevi = [
    () => openMeteo(LAT, LON),
    () => openTopoData('srtm90m', LAT, LON),
    () => openTopoData('srtm30m', LAT, LON),
    () => openTopoData('ned10m', LAT, LON),
    () => openTopoData('aster30m', LAT, LON),
    () => openElevation(LAT, LON),
  ];
  for (const c of ciljevi) {
    try { izmereno.push(await c()); } catch (e) { izmereno.push({ izvor: '??', greska: e.message.slice(0, 80) }); }
  }

  // 2) 3x3 grid Open-Meteo (podržava do 100 tačaka u jednom pozivu)
  const pts = [];
  for (let dy = -D; dy <= D; dy += D) for (let dx = -D; dx <= D; dx += D) pts.push([LAT + dy, LON + dx]);
  try {
    const j = await fetchJSON(`https://api.open-meteo.com/v1/elevation?latitude=${pts.map(p => p[0]).join(',')}&longitude=${pts.map(p => p[1]).join(',')}`);
    const grid = j.elevation.map((e, i) => ({ lat: +pts[i][0].toFixed(6), lon: +pts[i][1].toFixed(6), kota: e }));
    izmereno.push({ izvor: 'open-meteo 3x3 grid (±50 m)', grid });
  } catch (e) { izmereno.push({ greska: 'grid: ' + e.message.slice(0, 80) }); }

  fs.writeFileSync('dem_izvor_ukrstteni_v025.json', JSON.stringify({
    opis: 'v0.25 ukršteni test kote vrela node 4115176757 (razrešenje nesklada 212,4/207,6 iz v0.24)',
    lat: LAT, lon: LON, izmereno, datum: '2026-10-26'
  }, null, 2));
  console.log(JSON.stringify(izmereno, null, 1));
})();
