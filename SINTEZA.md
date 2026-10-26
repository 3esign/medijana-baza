# Medijana — važeća sinteza

Izdanje paketa **0.33**, 26.10.2026. Cilj je rekonstrukcija iz dostupnih dokaza, sa razdvojenim opažanjem, tumačenjem i pretpostavkom. Ovaj pregled zamenjuje niz ranijih izveštaja; njihov pun tekst ostaje u [istoriji](istorija/pre-konsolidacije-v032/SINTEZA.md).

## Šta je složeno

| Celina | Sadržaj baze | Glavna granica |
|---|---|---|
| Arhitektura | 21 zapis objekata, 21 prostorija, 13 skupina mera | Osnove nisu sve georeferencirane; visine nisu kompletno dokumentovane |
| Iskopi | 5 sektora, 31 potpis slike, 6 profila | Kote iz iskopa i današnji raster nisu isti tip merenja |
| Geofizika | 16 struktura | Interpretacija anomalije nije potvrđena funkcija objekta |
| Dekoracija | 25 mozaika, skulpturski program, 45 kataloških fotografija | Zbir 780,9 m² kataloških unosa nije zamena za literaturni ukupni obuhvat |
| Numizmatika i epigrafika | 22 novčana nalaza, 9 natpisa | Datum novca nije automatski datum gradnje; korpusni identifikatori ostaju delom neprovereni |
| Poređenja | 13 lokaliteta, 5 stavki poređenja Meduze | Analogija ne daje izmerenu visinu Medijane; neki motivi su kandidati |
| Voda | 28 hidrauličkih čvorova, 6 tačaka gradske trase | Tačke nisu šest precizno lociranih iskopnih segmenata: jedna je hipoteza terminusa |

[Mapa slojeva](INDEKS.md) daje stabilne putanje i brojeve. [Registar izvora](IZVORI_REGISTAR.json) objedinjuje 137 jedinstvenih URL zapisa; to nisu 137 nezavisnih potvrđenih izvora.

## Šta se menja posle revizije

1. **Validator je imao nedostižne provere.** Završavao se pre v0.24, v0.25 i v0.31–32. Posle uklanjanja ranog izlaska pronađene su tri greške koje prethodni uspešan izveštaj nije mogao da vidi. Popravljen je i nedostajući `DIR`.
2. **Ofseti 100/250 m NE bili su pogrešno izračunati.** Koordinate su se pomerale samo na sever, približno 71/177 m. Sada geodetski račun daje zadate udaljenosti pri pretpostavljenom azimutu 45°. Azimut i identifikacija uličnog kraja sa iskopom ostaju hipoteze. Stare DEM kote pomerenih tačaka izdvojene su kao zastarele.
3. **Pod Vinik je nepotvrđen položaj.** Rastojanje radne tačke od kasarne je oko 1,88 km, a ne 1,2 km. Imena okolnih ulica ne dokazuju koridor. Procena greške od 300 m nije geodetski utvrđena.
4. **Proračuni v0.27–30 nisu aktuelna trasa.** Koriste napuštene koordinate Pod Vinika, a ponegde i Ardije. Dve uzorkovane trase ne dokazuju da svi koridori zahtevaju tunel. Procena dužine potrebnog tunela nije odbranjena ovim podacima.
5. **Medijanska kaptaza nije pronađena.** Node 4115176757 je kandidat modernog izvora. Kota 209,5 m je odabrani scenario, dok sačuvani raspon 202,284439–211 m prelazi ispod dna bazena od 208 m. Nesigurnost nije razrešena. Različiti servisi nad istim rasterom nisu nezavisna merenja.
6. **Kapacitet ne dokazuje snabdevanje.** Manningova računica za pretpostavljene dimenzije je reprodukovana; nema merenja izdašnosti izvora. Rastojanje vrelo–vila korišćeno je za dovod do kasteluma bez potvrđene dužine te deonice. Nivo uliva i gubici nedostaju.
7. **Gradski i medijanski vodovod nisu dve suprotstavljene strane.** Različiti smerovi mogu istovremeno biti tačni. Veza sistema ostaje zasebno pitanje. Prepreka na gradskom kandidatu ne potvrđuje medijanski kandidat.

Još dve granice: Nominatim tačka arheološkog lokaliteta nije geodetska tačka vile; neproveren mozaik Meduze i nedefinisana regionalna granica ne rešavaju pitanje regionalne jedinstvenosti.

Lokatori, statusi i sledeće provere su u [11 nalaza revizije](konsolidacija.json). Istorijske brojke i citati nisu izbrisani. Polja `revizija_v033` i ovaj pregled imaju prednost nad starim zaključcima.

## Dalji rad po prioritetu

1. **Prostorna osnova:** georeferencirati plan vile i pronaći iskopne koordinate/katastarske parcele gradskih segmenata. Do tada nema izvoza ovih tačaka kao precizne arheološke geometrije.
2. **Vodosnabdevanje:** vezati svako DEM očitavanje za koordinatu, raster, uzorkovanje, vertikalni datum i sirovi odgovor. Ponoviti profile posle potvrde tačaka; odvojiti teren, dno kanala i nivo vode.
3. **Primarni dokazi:** dopuniti stranicu/tablu za ključne mere, natpise i komparativne mozaike. Odsustvo pogotka beležiti kao ograničenu potragu.
4. **Rekonstrukcija:** potom izrađivati geometriju po fazama, sa opsezima za nedokumentovane visine. „21 stub“ označava podatkovne zapise, ne završen 3D model.

## Dokaz i granice

Inventarisano je 279 izvornih projektnih fajlova (662.650.758 logičkih bajtova, bez `.git`). Svaka premeštena skripta ima izvor, odredište i SHA-256. Prilozi, rasteri i tokovi radnika ostaju sačuvani. Provera očuvanja i regresione kontrole su u `provere/`.

Ovo je lokalna revizija strukture, računice i zaključivanja. Primarne publikacije nisu sve ponovo pročitane, URL-ovi nisu ponovo otvarani i nove terenske kote nisu merene. Nula strukturnih grešaka ide zajedno sa sedam otvorenih istraživačkih ograničenja.
