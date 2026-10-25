# Zadatak: GIS, daljinska detekcija i istorijske karte Medijane

Ti si istraživački um Svemira. Projekat: baza podataka za 3D rekonstrukciju carske vile
Medijana (Niš, 4. vek). Baza je u `C:\Svemir\data\sessions\c1792946760393lb6a\medijana_baza\` —
prvo pročitaj `README.md` i `geofizika_sloj.json`. Ne menjaj postojeće fajlove baze.

**Šta baza zna:** OSM poligon jezgra ~5,7 ha; DEM procene (vila ~197–198 m, vodotoranj
~206 m); geofizika 2010 (16 ha istočno: istočni horreum, barake 6 ha, vojni logor 160×160 m,
apsidalni objekat); moderne kote 197,28–200,64; recentni asfaltni put ide direktno nad
antičkim zidovima. **Rupe:** GIS osnova objekata A–D, trasa vodozvoda, vektorizovani
situacioni plan (Sl. 1 iz Starinara 64/2014).

**Cilj:** pronaći sve javno dostupne prostorne izvore za Medijanu i okolinu:
1. **Istoriske karte i snimci:** Kanic (Kanitz) 1864 — planovi/skice Medijane; staro
   austrougarsko kartografiranje; istorijski aerofoto (ARCHIVE.org, srpski geodetski zavod,
   NATO/COBALT snimci?).
2. **Satelitski i LiDAR:** dostupnost visoke rezolucije za Niš (Sentinel-2, Pleiades,
   Google Earth Pro istorijski slajderi); postoji li javni LiDAR DTM za Srbiju (Geosrbija /
   RGZ otvoreni podaci)?
3. **Puna DEM provera:** precizniji DEM izvor od trenutnog (SRTM 30 m vs Copernicus GLO-30)
   — skini kote za vodu: Vlaško brdo, trasa ka Nišavi.
4. **Arheološki GIS Srbije:** postoji li javni ARHIV GIS nalazišta (INSPIRE, RGZ, Muzej
   grada Niša), predmeti „AN 22" i „Medijana"?
5. **Aerofotoarheologija:** postoji li analiza vegetacijskih/sovnih znakova za neiskopane
   delove kompleksa?

**Izlaz:** u ovom folderu `nalaz.md` (pregled izvora sa URL i dostupnošću) i
`prostorni_izvori.json` — niz: `{id, tip, rezolucija/godina, url, licenca, dostupno_danas,
vrednost_za_3d, poverenje}`. Na kraju poruke: sažetak 5–10 redova.

**Pravila:** srpski, latinica; svaka tvrdnja sa URL izvorom i poverenjem; ne pretpostavljaj
da izvor postoji ako ga nisi otvorio; bez npm instalacija; ne komituju; ograničenja upisati
iskreno.
