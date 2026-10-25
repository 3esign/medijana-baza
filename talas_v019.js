// v0.19 — dopuna mozaickog sloja radom Gordane Jeremic 2017 (Meduza na mozaickom podu u Medijani)
const fs = require('fs');
const f = 'mozaici_sloj.json';
const d = JSON.parse(fs.readFileSync(f, 'utf8'));

d.verzija = '0.19';
d.datum = '2026-10-26';

d.meduza_2017 = {
  izvor: {
    id: 'jeremic-meduza-2017',
    rad: 'Representation of Medusa on a mosaic floor in Mediana',
    autor: 'Gordana Jeremic',
    zbornik: 'Ante portam auream. Studia in honorem professoris Aleksandara Jovanovica, ur. M. B. Vujovic',
    izdavac: 'Filozofski fakultet Univerziteta u Beogradu',
    godina: 2017,
    strane: '251-262',
    pdf_lokalno: 'pdf/jeremic_meduza_2017.pdf',
    url: 'https://www.joycerain.com/uploads/2/3/2/0/23207256/05_ante_portam_auream_2017_representation_of_medusa_on_a_mosaic_floor.pdf',
    academia: 'https://www.academia.edu/37672696/Representation_of_Medusa_on_a_mosaic_floor_in_Mediana'
  },
  ograda_izvora: 'Tekstualni sloj PDF-a je ostecen (podskupni fontovi bez ToUnicode mape — dijakritika i vecina slova ispadaju). Za bazu su korisceni: citljivi fragmenti (reference, godine, UDC 904:738.5.032.042(497.11)), bibliografski podaci sa Academia.edu i VIZUELNA analiza 10 ugradjenih ploca. Sadrzajni nalazi iz teksta ostaju [NEPROVERENO] do pristupa citljivom izdanju.',
  povezani_unos: 'moz-07',
  ploce_izvucene: [
    { fajl: 'pdf/meduza_slike/img_00_2008x1546.jpg', opis: 'Glava Meduze — emblema u mozaickom podu (glavna ploca rada)', vizuelno_potvrdjeno: 'meduza sa zmijama u kosi, kruzni okvir, okolina od tesera' },
    { fajl: 'pdf/meduza_slike/img_01_1099x824.jpg', opis: 'Detalj mozaika (druga ploca)', vizuelno_potvrdjeno: false },
    { fajl: 'pdf/meduza_slike/img_02_1038x874.jpg', opis: 'Detalj mozaika (treca ploca)', vizuelno_potvrdjeno: false },
    { fajl: 'pdf/meduza_slike/img_03_693x951.jpg', opis: 'Stranica teksta rada', vizuelno_potvrdjeno: false },
    { fajl: 'pdf/meduza_slike/img_04_992x660.jpg', opis: 'Poredbeni mozaik (komparativni korpus)', vizuelno_potvrdjeno: false },
    { fajl: 'pdf/meduza_slike/img_05_992x660.jpg', opis: 'Poredbeni mozaik (komparativni korpus)', vizuelno_potvrdjeno: false },
    { fajl: 'pdf/meduza_slike/img_06_272x217.jpg', opis: 'Mala ploca (detalj/paralela)', vizuelno_potvrdjeno: false },
    { fajl: 'pdf/meduza_slike/img_07_758x762.jpg', opis: 'Plan vile sa peristilom', vizuelno_potvrdjeno: 'osnova vile, peristil sa fontanom u dvoristu' },
    { fajl: 'pdf/meduza_slike/img_08_1973x1317.jpg', opis: 'Aerofotografija lokaliteta Medijana', vizuelno_potvrdjeno: 'celokupna osnova vile sa peristilom iz vazduha' },
    { fajl: 'pdf/meduza_slike/img_09_1720x1509.jpg', opis: 'Fotografija lokaliteta/iskopa', vizuelno_potvrdjeno: false }
  ],
  fragmenti_citljivi_iz_teksta: {
    udc: '904:738.5.032.042(497.11)',
    reference_uocljive: ['2010, 106-108', '2002, 206-241', '2005, 119-130', 'Starinar LXI 2011, 275-284', 'Arheoloski pregled 11 1969, 185-186', '1954, 209-221', '1894, 569-614', '1938, 199-204'],
    napomena: 'referencni paralela iz kasnoantickog korpusa; puna imena autora izgubljena u ekstrakciji'
  },
  nove_niti: [
    'uporediti meduzu Medijane sa poredbenim mozaicima sa ploca img_04/img_05 kad se identifikuju',
    'pribaviti citljivo izdanje zbornika za datiranje i konzervaciju embleme'
  ],
  poverenje: 'srednje (vizuelno potvrđene ploce: visoko za identifikaciju, nisko za tvrdnje iz teksta)'
};

// azuriranje istorijata
d.istorijat_otkrica.push({
  godina: 2017,
  opis: 'Gordana Jeremic objavljuje posveceni rad o meduzi sa mozaickog poda Medijane (Ante portam auream, 251-262); PDF u bazi, 10 ploca izvuceno',
  izvor: 'jeremic-meduza-2017',
  poverenje: 'visoko (bibliografija), sadrzaj neproveren (ostecena ekstrakcija)'
});

fs.writeFileSync(f, JSON.stringify(d, null, 1), 'utf8');
console.log('mozaici_sloj.json -> v0.19, meduza_2017 dodata');
