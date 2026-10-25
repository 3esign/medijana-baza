# Zadatak: vodeni sistem Medijane — izvor, akvadukt, hidraulika

Ti si istraživački um Svemira. Projekat: baza podataka za 3D rekonstrukciju carske vile
Medijana (Niš, 4. vek). Baza je u `C:\Svemir\data\sessions\c1792946760393lb6a\medijana_baza\` —
prvo pročitaj `README.md` i `vodeni_linijski_sloj.json`. Ne menjaj postojeće fajlove baze.

**Šta baza zna:** castellum aquae je kula sa dva bazena na padini Vlaškog brda (Jeremić,
Starinar 39/1988), gravitacioni pad ~10 m na ~500 m do vile (~198 m n.m.v.); u fontani
nimfeja heksagonalni bazen sa olovnim cevima; olovna cev na 198,49 uvučena kroz osnovu zida
59; dva bunara kasnosrednjovekovna. **Otvoreni konflikt:** izvor vode — Oblik vs Niška Banja
(možda dva sistema).

**Cilj:** zaokružiti hidraulični linijski model za 3D:
1. Reši ili produbi konflikt izvora: književnost o akvaduktu Naissusa (Oblik, Niška Banja);
   rimske akvaduktske trase u Dardaniji/Moeziji.
2. Tipologija castellum aquae (poređenja: Pompeji, Nîmes, Konstantinopolj) — da li dvobazen
   model stoji.
3. Hidraulika provera: pad 10 m / 500 m ≈ 2% — da li to daje dovoljan pritisak za fontane?
   Rimske olovne cevi (fistulae) standardni prečnici, protok; koliko l/s realno?
4. Oluci i odvodnja vile — šta književnost kaže za Medijanu (bazeni horreuma 1,40 m, terme).
5. Vodeni sistem kao deo reprezentacije: fontane, nimfej — paralele u vilama istog ranga.

**Izlaz:** u ovom folderu `nalaz.md` (analiza po tačkama) i `hidraulika.json` — niz čvorova
za vodeni sloj: `{id, tip, opis, kota_mnm ako ima, izvor_url, poverenje}` plus računica
protoka. Na kraju poruke: sažetak 5–10 redova.

**Pravila:** srpski, latinica; terminologija: **osnova**, **situacioni plan**, **presek** —
nikad „tlocrt"; svaka tvrdnja sa URL izvorom i poverenjem; konflikti se upisuju; bez npm
instalacija; ne komituju; ograničenja upisati iskreno.
