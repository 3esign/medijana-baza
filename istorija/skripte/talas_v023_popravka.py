import json, io

# baza -> 0.23
b = json.load(open('baza_podataka.json', encoding='utf-8'))
b['verzija'] = '0.23'
json.dump(b, open('baza_podataka.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)

v = open('validator.js', encoding='utf-8').read()
marker = 'console.log(`=== VALIDACIJA MEDIJANA v${baza?.verzija} ===`);'
add = '''
// v0.23: kandidati antickog vrela — fizicke provere
if (dm.izvorista_kandidati_v023) {
  const iz = dm.izvorista_kandidati_v023;
  const villaKota = iz.vila_referenca?.kota_glo30;
  if (!(villaKota > 150 && villaKota < 250)) greske.push(`dem: kota vile ${villaKota} van fizickog opsega`);
  for (const k of iz.kandidati || []) {
    if (k.kota_glo30 == null) greske.push(`dem: kandidat ${k.osm_node} bez kote`);
    else if (k.visinska_razlika_m == null || Math.abs(k.visinska_razlika_m - (k.kota_glo30 - villaKota)) > 0.2)
      greske.push(`dem: kandidat ${k.osm_node} visinska razlika ne odgovara kotama`);
  }
  const pk = iz.profil_najbolji_kandidat;
  if (pk) {
    if (pk.kota_glo30 <= villaKota) greske.push('dem: najbolji kandidat nije iznad vile — gravitacioni dovod nemoguc');
    if (!(pk.pad_procenat > 0 && pk.pad_procenat < 2)) greske.push(`dem: pad ${pk.pad_procenat}% van fizicki razumog opsega 0-2%`);
    if (pk.prepreka_iznad_vrela) greske.push('dem: prepreka iznad vrela na profilu najboljeg kandidata');
    const koteProfila = (pk.profil || []).filter(p => p.m != null).map(p => p.m);
    if (koteProfila.length < 5) greske.push('dem: profil kandidata ima manje od 5 tacaka');
    else if (Math.max(...koteProfila) > pk.kota_glo30) greske.push('dem: tacka profila iznad samog vrela — ruta neizvodljiva');
  }
}
console.log(`=== VALIDACIJA MEDIJANA v${baza?.verzija} ===`);'''
assert marker in v, 'marker nije nadjen — validator promenjen od v0.22'
v = v.replace(marker, add)
open('validator.js', 'w', encoding='utf-8').write(v)
print('validator dopunjen, baza 0.23')
