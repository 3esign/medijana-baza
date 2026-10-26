#!/usr/bin/env node
// Talas v0.16 — integracija nalaza GLM roja (roj_glm/, sesije 2026-10-25):
//   1. hidraulika_sloj.json   — vodeni sistem po Jeremiću 1988 (Starinar XXXIX) + računica
//   2. numizmaticki_sloj.json — 22 novčana nalaza (Starinar LXIV/2014, Tabela 1a/2a/6/8 + monografija)
//   3. objekti_cd_sloj.json   — status slovnog sistema A-D + 13 skupina mera
//   4. gis_izvori_sloj.json   — prostorni izvori (GIS/DEM/istorijske karte), provereno vs kandidat
//   5. komparativni_lokaliteti.json — +10 lokaliteta korpusa (12 ukupno), tipologija aule, visinska sidra
//   6. vodeni_linijski_sloj.json — korekcije izvora vode i padova (konflikti eksplicitno, istorija se ne briše)
//   7. baza_podataka.json — +3 izvora, +6 konflikata, dopune rupe/nacin rada
// Izvorni materijal roj_glm/ je read-only — slojevi nastaju transformacijom ovde.
// Pokretanje: node talas_v016.js  (iz ovog foldera), pa node validator.js
const fs = require('fs');
const path = require('path');
const citaj = f => JSON.parse(fs.readFileSync(path.join(__dirname, f), 'utf8'));
const pisi = (f, o) => fs.writeFileSync(path.join(__dirname, f), JSON.stringify(o, null, 2) + '\n', 'utf8');
const poruka = [];

const VER = '0.16';
const DATUM = '2026-10-25';
const JEREMIC1988 = 'jeremic-1988-castellum (Miroslav Jeremić, Castellum aquae antičke Medijane, Starinar XXXIX/1988, 59-84; očitano sa lokalnih rendera str. 62-81, roj_glm/vodeni_sistem/starinar39/)';

// --- 0. verzije uskladjene na 0.16 ---
const verzijaFajlovi = [
  'baza_podataka.json', 'prostorni_sloj.json', 'vodeni_linijski_sloj.json',
  'komparativni_lokaliteti.json', 'digitalni_pasos.json', 'vizuelni_sloj.json',
  'vizuelni_nalazi.json', 'skulpturski_program.json', 'sonde_sloj.json',
  'crtezi_sloj.json', 'sobe_sloj.json', 'mozaici_sloj.json', 'geofizika_sloj.json'
];
for (const f of verzijaFajlovi) {
  const o = citaj(f);
  const staro = o.verzija || o.version;
  if (o.version) o.version = VER; else o.verzija = VER;
  if (o.datum) o.datum = DATUM;
  pisi(f, o);
  poruka.push(`verzija ${f}: ${staro} -> ${VER}`);
}

// --- 1. hidraulika_sloj.json (iz roj_glm/vodeni_sistem/hidraulika.json) ---
{
  const hyd = citaj('roj_glm/vodeni_sistem/hidraulika.json');
  hyd.verzija = VER;
  hyd.datum = DATUM;
  hyd.autor = 'Svemir / dr Poturak Semir; očitavanje i računica: GLM roj (Claude Agent SDK, model glm-5.3-flash)';
  hyd.odnos_prema_vodenom_sloju = 'dopuna vodeni_linijski_sloj.json (v0.16): ne menja ga — ovaj sloj je puna hidraulička mreža 27 čvorova sa kotama i računicom; vodeni_linijski_sloj zadržava stavove Pop-Lazića 2018 uz upisane konflikte gde se izvori razilaze';
  pisi('hidraulika_sloj.json', hyd);
  poruka.push(`hidraulika_sloj.json: ${hyd.cvorovi.length} cvorova, ${hyd.konflikti.length} konflikata`);
}

// --- 2. numizmaticki_sloj.json (iz roj_glm/numizmatika/novac.json) ---
{
  const novac = citaj('roj_glm/numizmatika/novac.json');
  const sloj = {
    svrha: 'Monetarna hronologija Medijane: novac po sondama/slojevima/kotama iz Tabela Starinara LXIV/2014 + monografije; vertikalna kontrola slojeva A-E i horizonta 1-3; najmlađi numizmatički datum baze 425-450 (skrivnica, 198,89)',
    verzija: VER,
    datum: DATUM,
    autor: 'Svemir / dr Poturak Semir; korpust i analiza: GLM roj (numizmatika)',
    izvor_glavni: 'Starinar LXIV/2014, 231-263 (Milošević i dr., Iskopavanja Medijane u 2010. i 2011. godini, Tabele 1a, 2a, 6, 8; lokalno pdf/milosevic_iskopi.txt)',
    metod: {
      korpus: 'milosevic_iskopi.txt (tabele novca), milosevic_vila.txt (monografija, FINDS OF ROMAN COINS), stibadium.txt (Starinar LXVI/2016), pop_lazic.txt, ap11_zotovic.txt, evidencija baze',
      skala_poverenja: 'visoko = podatak sa sondom/kotom iz iskopnog izveštaja; srednje = preko fusnote/monografije bez kataloga ili bez sonde; nisko = opšti okvir bez potvrde'
    },
    novac,
    konflikti: [
      {
        id: 'vicennalia-vs-tricennalia',
        status: 'OTVOREN (num-005)',
        obrazlozenje: 'Zatvorena celina w-9 sloj B (198,75) sa novcem 335-336 saglasna je sa Tricennalijskim horizontom (335/6, VOT XXX) i fazom 2 (330-378); da bi revers bio VOT XX, podovi bi se pomerili deset godina ranije. Izvučeni tekst ne citira reversnu legendu — rešenje je u katalogu Janković-Mihaldžić 2008 (Naissus I, 25-73); jedini citirani broj Starinara LXIV/2014 je br. 111/448 = Valens 366-367.'
      },
      {
        id: 'rusenje-378-vs-tpq-375',
        status: 'DELIČNO REŠENO',
        obrazlozenje: 'Zatvorena celina trema (num-014) daje terminus post quem 375, ne godinu rušenja; 378 je istorijska interpretacija autora iskopavanja (Hadrijanopol). Numizmatički se jednako dobro uklapa bilo koja godina 375-382. Preporuka za bazu: rušenje upisivati kao "posle 375, najverovatnije 376-382 (istorijski: 378)".'
      },
      {
        id: 'konzervacija-1970e-vs-novac-364-375',
        status: 'OTVOREN (num-022)',
        obrazlozenje: 'U prijemnom delu (mozaici, konzervacija 1970-ih) nije nađen novac mlađi od 350 — u napetosti sa novcem 364-375 u prostorijama istog dela (num-010/011/014). Verovatno različiti konteksti nalazenja (konzervacija vs iskop), ne stratigrafija; tražiti primarni spisak.'
      },
      {
        id: '378-vs-zivot-do-441',
        status: 'REŠENO HORIZONTIMA',
        obrazlozenje: '378 = kraj reprezentativne funkcije (slojevi B/C); horizont 3 (posle 383) traje do hunskog rušenja 441/443 — novac to potkrepljuje (num-016/017/018/019, ostava u horreumu num-020).'
      }
    ],
    ostave: [
      'ostava novca u horreumu — monografija njome datuje poslednji horizont (maksimum cirkulacije pada 441); sastav, broj primeraka i muzejska lokacija nisu u dostupnim izvodima (num-020)',
      'ostava delova bronzane ograde sa 4 herme (~250 m SZ, zakop 378) — metal, ne novac; Julijanov novac 360-361 (num-009) numizmatičko je okruženje postavke iz 361',
      'pop_lazic.txt ~red 1638 i ~red 2304 pominju ostave bez pročitanog konteksta — samo pointer, ne koristiti bez konteksta'
    ],
    ogranicenja: [
      'web istraživanje blokirano roju: doiserbia ID Starinara LXIV/2014 nepotvrđen; svi URL-ovi iz evidencije baze ili označeni kao nepotvrđeni',
      'kovnice i denominacije nisu u dostupnim izvodima; "očekivane kovnice Moezije" (Siscia, Thessalonica, Constantinopolis, Rome, Heraclea) su opšti okvir, NE nalaz — poverenje nisko',
      'sastav ostave iz horreuma nepročitan (ćirilni OCR monografije pokvaren)',
      'brojevi prebrojani iz tabela — moguće manje razlike'
    ],
    za_3d: 'faza 1: pre 330 (TPQ Krisp 324-330); faza 2: 330-378; faza 3: posle 383-441/443; kote novca 198,41-199,47 u opsegu vertikale baze — direktna veza na sobe w-9, w-10, w-21, w-24a, trem i stibadium B'
  };
  pisi('numizmaticki_sloj.json', sloj);
  poruka.push(`numizmaticki_sloj.json: ${novac.length} unosa, ${sloj.konflikti.length} konflikata`);
}

// --- 3. objekti_cd_sloj.json (iz roj_glm/objekti_CD/{mera.json, nalaz.md}) ---
{
  const mere = citaj('roj_glm/objekti_CD/mera.json');
  const sloj = {
    svrha: 'Objekti van vile (muzejska slova A-D) i skup mera za 3D: stanje saznanja o slovnom sistemu, 13 skupina mera sa izvorima, konflikti i status zatvorenih radova',
    verzija: VER,
    datum: DATUM,
    autor: 'Svemir / dr Poturak Semir; istraživanje: GLM roj (objekti_CD + tri pozadinska agenta: Milošević-Urbanism, Jeremić-2006, Drča-2000)',
    izvor_glavni: 'roj_glm/objekti_CD/nalaz.md (RAI harvest 2438 zapisa, DuckDuckGo indeksi, lokalni izvodi) + mera.json',
    status_slovnog_sistema: {
      negativni_nalaz: 'Slovni sistem A-D za objekte van vile NIJE razrešen iz otvorenih izvora: RAI harvest 2438 zapisa — nula pominjanja; zvanična stranica muzeja opisuje kompleks bez slova; Petrović 1994 (str. 22) koristi brojeve 1-15 (1 vila sa peristilom, 2 terme, 3 nimfej, 4 horreum, 5 vodotoranj, 6 tvrđava, 7 vila sa konhama, 8 vila sa ogradnim zidom, 9 vila, 10 vila sa centralnim koridorom, 11 horreum II, 12-13 sakralni objekti, 14 vicus, 15 nekropola)',
      jedina_javna_slova: 'stibadiumi A i B — unutar vile (Starinar LXVI/2016); "objekat B" iz Drče 2000 je muzejski (NMN) sistem, otvoreno nedostupan',
      kljucevi: 'Zbornik Narodnog muzeja Niš 9/2000 i 10/2001 (fizička kopija — nigde digitalizovani), monografija Constantine\'s Villa at Mediana 2016 (openAccess PDF bitstream_4423), Naissus 1/2008 (Janković-Mihaldžić katalog — nedigitalizovan)',
      vruca_trag_nepouzdan: 'u obfuskovanom Scribd tekst-sloju Jeremić 2006 (~str. 149/150) slovo "C" stoji kao oznaka objekta u pasusu o ekonomskom delu (vivarium/parcus po Valtneru) — sloj šifrovan rotirajućom substitucijom, cifre progutane; NE preuzimati bez otvaranja PDF-a (poverenje nisko)',
      prethodna_speculacija: 'pretpostavka roditeljske sesije da su A-D građevine istočno od vile — nepotvrđena'
    },
    mere,
    konflikti: [
      { id: 'povrsina-vile-6500-vs-6800', tema: 'površina vile sa peristilom', a: '~6.500 m² (FASTI/AUS 2011)', b: '6.800 m² (sr-wiki → Jeremić 2006)', status: 'otvoreno — upisano, ne rešavati na silu' },
      { id: 'povrsina-naselja-40-vs-80-ha', tema: 'površina naselja', a: '~40 ha (Jeremić 2006, prvi pasus verbatim: "Prostire se na površini od oko 40 hektara")', b: '~80 ha (FASTI 2011; Jeremić 2017)', status: 'otvoreno; ~80 građevina (Drča 2004, SANU) je BROJ OBJEKATA, ne hektara — ne mešati' },
      { id: 'datacija-mozaika-tetrarhija-vs-tpq', tema: 'datacija mozaika', a: '"Tetrarhija" (starija literatura)', b: 'novac Konstancija II 341-346 ispod mozaika severnog trema = TPQ (Jeremić 2009); Jeremić 2017: 40-e/50-e 4. veka', status: 'rešeno u korist TPQ; reversni detalji u katalogu 2008' },
      { id: 'pocetak-gradnje', tema: 'početak gradnje vile', a: 'posle 317-330 (Vasić 2005)', b: 'kraj 3 / početak 4. veka (Vasić 2013 → Petrović 1994, 22)', status: 'otvoreno' }
    ],
    bibliografija_status: [
      { id: 'jeremic-2006-mozaici', status: 'bibliografski potpuno rešen; tri živa URL-a PDF-a (nisandbyzantium.org.rs, ubnt legacy, Scribd); prvi pasus verbatim izvučen preko DDG indeksa — naselje ~40 ha utvrđeno izvorom; pun tekst skinuti ručno iz browsera (webReader -500/-400)' },
      { id: 'milosevic-urbanism', status: 'PUN TEKST ZATVOREN (Academia iza Cloudflare+prijave — nije zaobilažen); autor identifikovan: Gordana Milošević-Jevtić; hipoteze doma rada: monografija 2016 (open) ili Illyricum Romanum 2020 (restricted, RAI 1184); najbliži javni pandan: Milošević-Gavrilović 2013 "Carska ideologija" (RAI 1555, openAccess)' },
      { id: 'drca-2000-objekat-b', status: 'autor potvrđen: Slobodan Drča (NMN); sadržaj nerazbijen — Zbornik NMN 9 nije digitalizovan nigde; jedina putanja fizička kopija' },
      { id: 'naissus-1-2008', status: 'Janković-Mihaldžić: "Pojedinačni nalazi rimskog novca na Mediani" 25-73 + "Skupni nalaz rimskog bronzanog novca iz Mediane" 75-95, Naissus 1/2008, ISSN 1820-9025 — verovatno "Mediana Numismatic Catalogue" iz Jeremić 2009; nedigitalizovano; COBISS.SR-ID 157322252 i 157323532' },
      { id: 'aus2015', status: 'PDF na disku (skinuto/aus2015.pdf, str. 77-85, stibadium B grejanje "definisano 2015") — nečitljiv bez poplera; prvi za ručno čitanje' },
      { id: 'aus2019-terme', status: 'terme 2019, rukovodilac Gavrilović-Vitas; publikovano sv. 35 (2019), 65-83 — časopis neidentifikovan (ćirilica ošišana u txt)' },
      { id: 'negativni-2016', status: '2016. Ministarstvo kulture nije finansirala iskopavanja na Medijani — nema izveštaja za 2016' }
    ],
    zamka_zenica: 'mere "objekat A 17,20×14,60 m / objekat B 20,30×14,18 / objekat C delimično" su iz Mlinčića-Tisine kod Zenice (D. i C. Trajković, Arheološki pregled 11), NE sa Medijane — ne uvoziti (čuvati verbatim iz v0.15)',
    ogranicenja: [
      'MCP webReader rate-limitovan na RAI i -500 na ubnt/nisandbyzantium — nijedan novi online dokument nije skinut ovog segmenta; sadržaj iz DDG indeksa i lokalnih izvoda',
      'Scribd tekst-sloj Jeremić 2006 obfuskovan rotirajućom substitucijom — cifre (mere) nepročitljive',
      'Academia (Cloudflare+prijava) nije zaobilažen; Google Books kvota; HathiTrust 403; IA šum; SCIndeks 404; Fasti API ne podržava pretragu (fasti_mediana.json = errors)',
      'neproverena mesta: Semantic Scholar, ResearchGate, CORE, Zenodo, Google Scholar cluster',
      'fasti_mediana.json u roj_glm/objekti_CD je odgovor API-ja na grešku ("does not support the search resource") — dokumentovanje blokade, ne podatak'
    ]
  };
  pisi('objekti_cd_sloj.json', sloj);
  poruka.push(`objekti_cd_sloj.json: ${mere.length} skupina mera, ${sloj.konflikti.length} konflikata`);
}

// --- 4. gis_izvori_sloj.json (iz roj_glm/gis_udaljena/prostorni_izvori.json) ---
{
  const gis = citaj('roj_glm/gis_udaljena/prostorni_izvori.json');
  gis.verzija = VER;
  gis.datum = DATUM;
  gis.autor = 'Svemir / dr Poturak Semir; prikupljanje: GLM roj (gis_udaljena — sesija bez mrežnih ovlašćenja)';
  // ispravke koje je sam nalaz naveo za upis
  gis.otvoreni_zadaci = gis.otvoreni_zadaci.map(z => z.replace('odemuzorkovanje', 'dem-uzorkovanje'));
  for (const iz of gis.izvori) {
    if (iz.licenca) iz.licenca = iz.licenca.replace(/^\s+/, '');
    if (iz.id === 'aerofotoarheologija-medijana') {
      iz.url = 'nema poznatog objavljenog rada; pretražiti "Mediana aerial", "cropmarks Niš", "aerial archaeology Serbia"';
    }
  }
  pisi('gis_izvori_sloj.json', gis);
  const kandidata = gis.izvori.filter(i => (i.status_provere || '').startsWith('kandidat')).length;
  poruka.push(`gis_izvori_sloj.json: ${gis.izvori.length} izvora (${kandidata} kandidata, ${gis.izvori.length - kandidata} provereno u ranijem radu)`);
}

// --- 5. komparativni_lokaliteti.json: +korpus (12 lokaliteta), tipologija aule, visinska sidra ---
{
  const kompar = citaj('komparativni_lokaliteti.json');
  const korpus = citaj('roj_glm/komparativni_korpus/korpus.json');
  let dodanih = 0, obogaćenih = 0;
  for (const k of korpus) {
    const postoji = kompar.lokaliteti.find(l => l.id === k.id);
    if (postoji) {
      // obogaćujemo postojeći: mere korpusa idu uz postojeće stavke, istorija se ne briše
      postoji.korpus_v016 = {
        region: k.region,
        period: k.period,
        tip: k.tip,
        mere: k.mere,
        konflikti_korpusa: k.konflikti,
        relevantnost_za_medijanu: k.relevantnost_za_medijanu
      };
      obogaćenih++;
    } else {
      kompar.lokaliteti.push({
        id: k.id,
        naziv: k.ime,
        period: k.period,
        mere: k.mere,
        konflikti: k.konflikti,
        relevantnost_za_medijanu: k.relevantnost_za_medijanu,
        izvor: k.mere.map(m => m.izvor_url)
      });
      dodanih++;
    }
  }
  kompar.tipologija_aule = {
    izvor: 'GLM roj komparativni korpus (2026-10-25)',
    pojas: [
      { objekat: 'Trier, aula palatina', osnova_m: [26.05, 67], odnos: '2,6:1', visina_m: 33, status_visine: 'očuvano — visoko' },
      { objekat: 'Solun, aula palate', osnova_m: [24, 67], odnos: '2,8:1', visina_m: 30, status_visine: 'rekonstrukcija — nisko' },
      { objekat: 'Rim, Bazilika Maksencija (brod)', osnova_m: [25, 80], odnos: '3,2:1', visina_m: 35, status_visine: 'rekonstrukcija — nisko' },
      { objekat: 'Nikomedija / Antiohija', osnova_m: null, odnos: null, visina_m: null, status_visine: 'književno — nisko' }
    ],
    pravilo: 'aula Medijane (z-38/z-39, sa apsidom, podijum od 3 stepenika, Fluvius na ulazu, Meduza u sredini) modelovati po proporciji 2,6-3,2:1 iz ovog pojasa; visinu izvesti kao frakciju Trier/Solun (~30-33 m) sa poverenjem nisko; apsidu i podijum iz vlastitih izvora baze (monografija + Starinar 64/2014), ne iz analogije'
  };
  kompar.visinska_sidra = {
    ocuvano_visoko: ['Trier aula 33 m', 'Solun rotunda — kupola na 30 m, zid >6 m', 'luk Galerija — prolazi 12,5 / 6,5 m'],
    delimicno_srednje: ['kula 10 Šarkamena 6-8 m (2. etaža)', 'mauzolej Šarkamena ~3 m', 'zidovi Casalea 2-8 m', 'bočni brod Maksencijeve bazilike 24,5 m'],
    rekonstrukcija_nisko: ['Solun aula ~30 m', 'Solun oktogon 29 m + kupola Ø 23 m', 'Maksencije 35/39 m']
  };
  kompar.kalibraciona_pravila.push(
    'v0.16: aula — proporcija 2,6-3,2:1 iz pojasa Trier/Solun/Maksencije; visina aule vile kao frakcija (40-60%) sidra 33 m, poverenje nisko.',
    'v0.16: oktogon vile sa oktogonom (330-334) — kupola prema Solunu (Ø 23 m / visina 29 m), obe nisko.',
    'v0.16: odsustvo bedema na Medijani ima pozitivan komparativni dokaz — Timacum Minus (bedem 3 m, ~2 ha), Romuliana, Split i Šarkamen svi imaju bedeme; geofizika 16 ha takav zid NIJE pokazala → Medijana = otvorena rezidencija, ne neistražena.'
  );
  pisi('komparativni_lokaliteti.json', kompar);
  poruka.push(`komparativni_lokaliteti: +${dodanih} novih, ${obogaćenih} obogaćenih, tipologija aule + visinska sidra`);
}

// --- 6. vodeni_linijski_sloj.json: korekcije uz eksplicitne konflikte ---
{
  const vod = citaj('vodeni_linijski_sloj.json');
  const cvorovi = vod.vodena_mreza.cvorovi;
  const nadi = id => cvorovi.find(c => c.id === id);

  const oblik = nadi('izvor-hipoteza-oblik');
  if (oblik) {
    oblik.status = 'nepotvrdjeno — Pop-Lazic ne navodi izvor; Jeremić 1988 (str. 64) u očitanom delu (str. 62-81) Oblik NE POMINJE — tvrdnja ostaje bez poznatog primarnog izvora';
    oblik.konflikt = 'KONFLIKT REŠEN U KORIST NISKE BANJE (smer), v0.16 — Jeremić 1988: vodovod Medijane nije ogranak vodovoda Naissusa, dovodni kanal C prilazi SA ISTOKA, izvorište tražiti u pravcu Niške Banje (~4,5 km); v. hidraulika_sloj.json konflikt izvor-vode-oblik-vs-niska-banja';
  }
  const banja = nadi('izvor-hipoteza-niska-banja');
  if (banja) {
    banja.opis = 'vodozahvat pravcem Niske Banje — POTVRDJEN U SMERU (v0.16): Jeremić 1988 (str. 64) — gravitacioni kanal C svojim pravcem i padom pokazuje izvorište u pravcu Niške Banje (~4,5 km; trasa nikad istraživana); sloj kalcinacije u bazenu B = duga protočnost tvrde krečnjačke vode (kraško-termalno zaleđe Suve planine/Niške Banje)';
    banja.poverenje = 'visoko (smer dovoda, izmereno — Jeremić 1988); nisko (tačna kaptaza)';
    banja.izvor = 'jeremic-1988-castellum (Starinar XXXIX/1988, 59-84, str. 64)';
  }
  const cast = nadi('castellum-aquae');
  if (cast) {
    cast.premestanje_posle_iskopa = {
      opis: 'NEPOSREDNO POSLE iskopavanja kastelum je ISECEN NA KOMADE i premešten nekoliko stotina metara ka severozapadu na niži plato (gradnja fabrike katodnih cevi EI); današnja lokacija reasembliranog objekta nije identifikovana',
      izvor: 'jeremic-1988-castellum (str. 81 + francuski rezime)',
      za_3d: 'sve kote u bazi su kote ORIGINALNE pozicije (dokumentacija 1988), ne današnjeg spomenika; u GIS-u obavezno odvojiti originalnu i današnju poziciju'
    };
    cast.detalji_1988 = 'bazen A: 37,20 m unutrašnje dužine, pod 207,06 (jug) → 205,98 (sever), maks. nivo 208,05, 584 m³, opus signinum + filter-sloj, verovatno nepokriven; bazen B: 5,28×4,74 m, pod 206,39 (50 cm iznad poda A), maks. nivo 207,60, 30,2 m³, bojeni sokl 45 cm = oznaka minimalnog nivoa; višeprostorni lanac taloženje→filtriranje→distribucija (paralele: Lion, Béziers, Sens, Fabretti 1690); Vitruvije VIII.6 — ista šema; puna mreža: hidraulika_sloj.json';
  }
  const kg = nadi('kanal-glavni');
  if (kg) {
    kg.konflikt = 'KONFLIKT dva-kanala-dovod-vs-odvod (v0.16): Pop-Lazić 2018 opisuje IZLAZNU stranu (glavni + revizioni ka naselju); Jeremić 1988 dokumentuje DVA DOVODNA kanala (C glavni + D negirani, sa fazama) i izlazne: E distributivni, F drenažni, cev G. Nije protivrečje nego različita strana posmatranja; za 3D: 2 dovodne + 1 glavna izlazna + 1 drenažna linija kod kasteluma. Detalji: hidraulika_sloj.json';
  }
  const kr = nadi('kanal-revizioni');
  if (kr) {
    kr.konflikt = 'v. kanal-glavni — Pop-Lazićeva "reviziona" linija po Jeremiću odgovara kanalu E (jedini distributivni izlaz) uz prelivnike 1-2-3 i revizioni šaht H (dno 205,24)';
  }
  // novi čvorovi (kote u fizičkom opsegu, 194-212)
  const dodaj = c => { if (!nadi(c.id)) cvorovi.push(c); };
  dodaj({
    id: 'kanal-e-distributivni',
    tip: 'linija-glavna-distributivna',
    opis: 'JEDINI kanal kasteluma koji je naselje snabdevao pročišćenom vodom: polazi iz srednjeg dela severnog zida bazena B (prelivnik 3, dno na startu 207,36), skreće ka istoku 23° do revizionog šahta H (dno 205,24), pa naglo još 38° prema palati; sačuvano 26 m; širina dna 32 cm; mereni pad 2,4‰',
    kota_mnv: { dno_start: 207.36, dno_saht: 205.24 },
    izvor: 'jeremic-1988-castellum (str. 74-76, sl. 2, 21-23, 25)',
    poverenje: 'visoko (nalaz i kote), nisko (trasa ka vili — neiskopana, u 3D isprekidano)'
  });
  dodaj({
    id: 'tocno-mesto-kadijunica-terme',
    tip: 'krajnji-cvor',
    opis: 'DRUGO poznato točno mesto sistema (uz srednji deo nimfeja): zapadni zid sporedne kadijunice (vruće prostorije) TERME — voda uvođena direktno u zid, analogno olovnoj cevi kroz osnovu zida 59 u palati; hidraulička veza castellum → terme do sada nije bila eksplicitna u bazi',
    izvor: 'jeremic-1988-castellum (str. 64)',
    poverenje: 'visoko (točno mesto); kota nepoznata (terme nije vertikalno merena u bazi)'
  });
  dodaj({
    id: 'sekundarni-vodotoranji',
    tip: 'hipoteza-mreze',
    opis: 'Jeremić 1988 (str. 80): u naselju se mogu očekivati tragovi SEKUNDARNIH VODOTORANJEVA (castella secundaria) kojima su regulisani pritisak i količina vode ka točnim mestima; na sl. 1 mala kvadratna struktura na trasi između kasteluma i palate — kandidat, ne identifikacija',
    izvor: 'jeremic-1988-castellum (str. 80, sl. 1)',
    poverenje: 'nisko (hipoteza izvora), srednje (tipološka očekivanost — paralela Pompeji)'
  });
  dodaj({
    id: 'premestanje-kasteluma',
    tip: 'sudbinska-cinjenica',
    opis: 'kastelum posle iskopavanja isečen na komade i premešten nekoliko stotina metara ka SZ na niži plato (fabrika katodnih cevi EI); 1980. zabeležena i nelegalna gradnja preko dela terena; današnja lokacija spomenika neidentifikovana — KOTE U BAZI SU KOTE ORIGINALNE POZICIJE (1988)',
    izvor: 'jeremic-1988-castellum (str. 81 + francuski rezime, fn 13, 14, 19)',
    poverenje: 'visoko (da je premešten); nisko (gde je danas)',
    napomena_3d: '3D model kasteluma na originalnu poziciju (padina Vlaškog brda, sl. 1), ne na današnju lokaciju'
  });
  dodaj({
    id: 'fontana-oktagon',
    tip: 'fontana',
    opis: 'vila sa oktogonom: dvorište ~40 m istočno sa kolonadom, mermernim pločama i fontanom; fontana i u sobi 2 — druga i treba fontana kompleksa pored nimfeja; oktagonalni objekat potvrđen i od Jeremića (odvodni zidani kanali "oktagonalnom objektu")',
    izvor: 'monografija-vila-2011; jeremic-1988-castellum (str. 64)',
    poverenje: 'visoko (postojanje), nisko (dimenzije/polozaj fontane)'
  });
  // hidraulicki rezime
  vod.hidraulika_v016 = {
    pad_linije: '8,87 m na ~500 m ≈ 17,7‰ (~1,8%) — dno kanala E 207,36 → olovna cev u vili 198,49 (voda putuje po dnu kanala, ne po terenu; terenska razlika ~10,00 m nije linijski pad)',
    protok_kanala_e: '~17,5 l/s (dubina 0,10 m) do 44,8 l/s (0,20 m) ≈ 1.510-3.870 m³/dan (Manning, n=0,014, S=2,4‰) — kapacitet >> potražnja; ustave I/II i prelivnici 1-2-3 su glavna regulacija (višak, ne manjak)',
    pritisak_fontane: 'statika ~8,9-9,3 m (~0,9 bar) — pritisak dostatan sa rezervom za fontane 1-3 m mlaza; pravi problem je VIŠAK protoka i pritiska',
    jeremicevi_brojevi: '8,2 i 31 l/s su PRAŽNJENJE (drenaža cevi B→F Ø 95 i A→G Ø 155), ne dnevna potrošnja',
    izvor: 'jeremic-1988-castellum; puna računica: hidraulika_sloj.json (racunica)'
  };
  // otvorena pitanja — ne brišemo, dopisujemo status
  vod.otvorena_pitanja = vod.otvorena_pitanja.map(p => {
    if (p.startsWith('izvor vode: Oblik vs Niska Banja')) return p + ' [v0.16: SMER REŠEN — Jeremić 1988: nije ogranak Naissusa, dovod sa istoka, pravac Niške Banje ~4,5 km; tačna kaptaza i dalje otvorena]';
    if (p.startsWith("'trideset godina vladavine'")) return p + ' [v0.16: konflikt ostaje OTVOREN — novac 335-336 (num-005) saglasan sa Tricennalijom; presudan revers iz kataloga Janković-Mihaldžić 2008]';
    if (p.includes('Starinar 39 (1988)')) return 'Starinar 39 (1988) Jeremić Castellum aquae — štamp. str. 62-81 OČITANE sa rendera (v0.16, hidraulika_sloj.json); uvodne str. 59-61 nisu renderovane; tačan deep-link na viminacium.org.rs i dalje nerazrešen (206 strana bez tekstualnog sloja)';
    return p;
  });
  vod.otvorena_pitanja.push(
    'danasnja pozicija kasteluma — gde je reasemblirani spomenik (premešten nekoliko stotina m ka SZ posle iskopavanja); za GIS odvojiti originalnu (1988) i današnju poziciju',
    'trasa kanala C od kaptaze i E ka vili nikad iskopana — u 3D isprekidano'
  );
  pisi('vodeni_linijski_sloj.json', vod);
  poruka.push('vodeni_linijski_sloj: izvor vode rešen u smeru, +5 čvorova (kanal-E, kadijunica, vodotoranji, premeštanje, fontana-oktagon), hidraulički rezime');
}

// --- 7. prostorni_sloj.json: mere 2006 na vili, premeštanje na castellumu ---
{
  const prost = citaj('prostorni_sloj.json');
  const vila = prost.objekti_3d_stubi.find(s => s.id === 'vila-peristil');
  if (vila && !vila.mere_jeremic_2006) {
    vila.mere_jeremic_2006 = {
      duzina_m: 98.6,
      sirina_m: 63.0,
      izvor: 'jeremic-2006-mozaici (Niš i Vizantija IV, 145-158; preneto preko sr-wiki)',
      napomena: 'površina 6.800 m² (isti izvor) vs ~6.500 m² (FASTI/AUS 2011) — konflikt povrsina-vile-6500-vs-6800 upisan u objekti_cd_sloj.json'
    };
  }
  const cast = prost.objekti_3d_stubi.find(s => s.id === 'castellum');
  if (cast && !cast.premestanje_posle_iskopa) {
    cast.premestanje_posle_iskopa = {
      opis: 'posle iskopavanja kastelum isečen na komade i premešten nekoliko stotina metara ka SZ na niži plato (fabrika katodnih cevi EI); današnja lokacija neidentifikovana',
      izvor: 'jeremic-1988-castellum (str. 81)',
      za_3d: 'stub i kote odnose se na originalnu poziciju na padini Vlaškog brda'
    };
  }
  pisi('prostorni_sloj.json', prost);
  poruka.push('prostorni_sloj: vila-peristil +mere 2006 (98,6x63), castellum +premeštanje');
}

// --- 8. baza_podataka.json: izvori, konflikti, rupe, nacin rada ---
{
  const baza = citaj('baza_podataka.json');

  const noviIzvori = [
    { id: 'jeremic-1988-castellum', url: 'https://viminacium.org.rs (arhiva Starinara — sken bez tekstualnog sloja)', jezik: 'sr+fr', tip: 'monografska iskopna obrada (Starinar XXXIX/1988, 59-84)', pristup: DATUM, napomena: 'M. Jeremić, Castellum aquae antičke Medijane; očitano vizuelno sa rendera str. 62-81 (starinar39/); jedina monografska obrada kasteluma sa merenjima i kotama' },
    { id: 'jeremic-2006-mozaici', url: 'https://www.nisandbyzantium.org.rs/doc/zbornik4/PDF-IV/Gordana Jeremic.pdf', jezik: 'sr', tip: 'članak (Niš i Vizantija IV, 2006, 145-158)', pristup: DATUM, napomena: 'G. Jeremić, Mozaici Medijane — neka razmatranja; bibliografski rešen, tri živa URL-a PDF-a; prvi pasus (naselje ~40 ha) verbatim preko DDG indeksa; pun tekst skinuti ručno' },
    { id: 'jankovic-mihaldzic-2008', url: 'https://bibliografije.nb.rs/bibliografija/tekuca/clanci/serijaA/y2007/zapisi027.html', jezik: 'sr', tip: 'katalog (Naissus 1/2008, 25-73 i 75-95, ISSN 1820-9025; COBISS.SR-ID 157322252, 157323532)', pristup: DATUM, napomena: 'D. Janković-Mihaldžić, Pojedinačni nalazi rimskog novca na Mediani + Skupni nalaz — verovatno "Mediana Numismatic Catalogue"; nedigitalizovano; ključ za zatvaranje Vicennalia/Tricennalia i datovanje po objektima' }
  ];
  for (const iz of noviIzvori) if (!baza.izvori.find(i => i.id === iz.id)) baza.izvori.push(iz);

  const noviKonflikti = [
    {
      id: 'izvor-vode-oblik-vs-niska-banja',
      tema: 'izvor vodovoda Medijane',
      varijante: [
        { stavka: 'Oblik (wiki-sr) — bez poznatog primarnog izvora; u Jeremiću se ne pominje', izvor: 'wiki-sr' },
        { stavka: 'NIJE ogranak vodovoda Naissusa; dovodni kanal C prilazi sa istoka; izvorište u pravcu Niške Banje, ~4,5 km; kalcinacija u bazenu B = tvrda kraško-termalna voda', izvor: 'jeremic-1988-castellum (str. 64)' }
      ],
      status: 'REŠENO ZA SMER (v0.16): Niška Banja (visoko — jedini iskopni izvor); tačna kaptaza otvorena (trasa nikad iskopana); prethodni otvoreni konflikti o izvoru vode ostaju zabeleženi',
      izvor: 'jeremic-1988-castellum'
    },
    {
      id: 'dva-kanala-dovod-vs-odvod',
      tema: 'dva kanala kod kasteluma',
      varijante: [
        { stavka: 'glavni + revizioni kanal PREMA naselju (izlazna strana)', izvor: 'poplazic-2018 / monografija-vila-2011' },
        { stavka: 'DVA DOVODNA kanala (C glavni + D negirani, sa fazama) + izlazni E distributivni + F drenažni + cev G', izvor: 'jeremic-1988-castellum (str. 71-79)' }
      ],
      status: 'RAZLIČIT OPIS, NE PROTIVREČJE — Pop-Lazić opisuje izlaznu, Jeremić dovodnu stranu; za 3D: 2 dovodne + 1 izlazna + 1 drenažna linija',
      izvor: 'jeremic-1988-castellum'
    },
    {
      id: 'pad-vodovoda-2-ili-1-8-posto',
      tema: 'pad vodovodne linije kastelum-vila',
      varijante: [
        { stavka: '~10 m na ~500 m ≈ 2% (procena po terenu, starija baza)', izvor: 'web-sr-sinteza' },
        { stavka: '8,87 m na ~500 m ≈ 17,7‰ (~1,8%) — dno kanala E 207,36 → olovna cev u vili 198,49 (voda putuje po dnu kanala)', izvor: 'jeremic-1988-castellum' }
      ],
      status: 'REŠENO PRECIZNOM KOTOM (v0.16): koristiti 8,9 m pad linije i 2,4‰ lokalni nagib E; strmi linijski nagib = VIŠE dostupne statike, ne problem',
      izvor: 'jeremic-1988-castellum'
    },
    {
      id: 'vicennalia-tricennalia',
      tema: 'Vicennalia (325/6) vs Tricennalia (335/6) kao datum glavne faze',
      varijante: [
        { stavka: 'novac 335-336 u zatvorenoj celini w-9 (sloj B, 198,75) — saglasno Tricennaliji i fazi 2 (330-378)', izvor: 'iskopi-2010-2011' },
        { stavka: 'tekst Pop-Lazića "trideset godina vladavine" uz termin Vicennalia — protivurečje u okviru samog teksta', izvor: 'poplazic-2018' }
      ],
      status: 'OTVORENO — presudan revers zavetnog novca (VOT XX vs VOT XXX) iz kataloga Janković-Mihaldžić 2008; zavetne emisije cirkulišu i po deset godina posle slavlja, pa VOT XX ne bi značio gradnju 325/6',
      izvor: 'numizmaticki_sloj.json (num-005)'
    },
    {
      id: 'povrsina-naselja-40-vs-80-ha',
      tema: 'površina kasnoantičkog naselja Medijana',
      varijante: [
        { stavka: '~40 ha (prvi pasus verbatim: "Prostire se na površini od oko 40 hektara")', izvor: 'jeremic-2006-mozaici' },
        { stavka: '~80 ha', izvor: 'FASTI/AUS 2011; jeremic-2017 (Ante portam auream)' }
      ],
      status: 'OTVORENO — "~80 građevina" (Drča 2004, SANU) je broj objekata, ne hektara; pazi na mešanje ova dva broja',
      izvor: 'jeremic-2006-mozaici'
    },
    {
      id: 'povrsina-vile-6500-vs-6800',
      tema: 'površina vile sa peristilom — suženje postojećeg konflikta 6000/6800',
      varijante: [
        { stavka: '6.800 m² (poziva Jeremić 2006)', izvor: 'wiki-sr → jeremic-2006-mozaici' },
        { stavka: '~6.500 m²', izvor: 'FASTI/AUS 2011' },
        { stavka: '6.000 m² (starija stavka baze)', izvor: 'wiki-en' }
      ],
      status: 'OTVORENO — razlika ~5-13%, verovatno različite definicije obrisa; mere osnove 98,6×63,0 m (Jeremić 2006) upisane na stub vila-peristil',
      izvor: 'jeremic-2006-mozaici'
    }
  ];
  for (const k of noviKonflikti) if (!baza.konflikti_izmedju_izvora.find(x => x.id === k.id)) baza.konflikti_izmedju_izvora.push(k);

  // rupe — ne brišemo, dopisujemo status u zagradama
  baza.rupe_za_rekonstrukciju = baza.rupe_za_rekonstrukciju.map(r => {
    if (typeof r === 'string' && r.startsWith('vodozahvat')) return r + ' [v0.16: smer rešen — pravac Niške Banje ~4,5 km, Jeremić 1988; kaptaza, trasa i kapacitet i dalje otvoreni — hidraulika_sloj.json]';
    if (typeof r === 'string' && r.includes('objekata A-D')) return r + ' [v0.16: slovni sistem A-D i dalje nerešen iz otvorenih izvora — negativni nalaz, ključevi Zbornik NMN 9/10 i monografija 2016; 13 skupina mera upisano u objekti_cd_sloj.json]';
    return r;
  });

  baza.nacin_daljeg_rada = baza.nacin_daljeg_rada || [];
  const noveRef = [
    'Skinuti ručno (browser) tri PDF-a Jeremić 2006 (nisandbyzantium.org.rs / ubnt legacy / Scribd) — otvara šest objekata sa mozaicima i nepouzdani trag "objekta C"',
    'Otvoriti monografiju 2016 (rai.ai.ac.rs/bitstream/id/4423/bitstream_4423.pdf) — proverava hipotezu doma rada Milošević "Urbanism..." + terme i antičku kapiju kao kandidate za muzejska slova',
    'Pročitati skinuto/aus2015.pdf str. 77-85 (bilo kojim čitačem) — stibadium B, grejanje definisano 2015',
    'Nabaviti fizički Zbornik NMN 9/10 + Naissus 1/2008 (Janković-Mihaldžić katalog) — jedini put do sadržaja objekta B i zatvaranja Vicennalia/Tricennalia',
    'GIS: dem-uzorkovanje GLO-30 vs SRTM vs AW3D30 za kote vode (vila, castellum, 3-4 tačke ka Nišavi) — 0 piksela urađeno; redosled u gis_izvori_sloj.json',
    'Identifikovati časopis Gavrilović-Vitas 2019 (sv. 35, 65-83, terme)'
  ];
  for (const r of noveRef) if (!baza.nacin_daljeg_rada.includes(r)) baza.nacin_daljeg_rada.push(r);

  pisi('baza_podataka.json', baza);
  poruka.push('baza: +3 izvora, +6 konflikata, dopune rupe/nacin rada');
}

console.log(poruka.join('\n'));
