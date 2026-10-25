# NALAZ — Epigrafika Medijane (GLM-5.3, sesija a2e61857)

**Status:** izvučeno iz transkripta posle 4 pada procesa (mreža radnika umrla 00:01:48). Nalaz
sastavio Svemir iz 72 tekstualna bloka transkripta; radnik nije predaje finalnu poruku.
**Metod:** lokalni citati monografije (uhvaćeni grep-om pre pada) = [PROVERENO-LOKALNO];
opšte znanje o korpusima = [NEPROVERENO]; URL obrasci baza = [PROVERENO-STRUKTURA].

## 1. Katalog natpisa (lokalna sidra, monografija 2011 + Pop-Lazić 2018)

| # | Natpis | Kontekst | Stanje |
|---|--------|----------|--------|
| 1 | Roimetalkes „diasemotatos" (grčki), baza porfirnog Eskulapa, inv. 985/R, 43 cm | vila sa peristilom, iatrijski par | [PROVERENO-LOKALNO] inv. potvrđen Pop-Lazić 2018 (Narodni muzej Niš) |
| 2 | Natpis (supruga / vezan za Filipa?), baza porfirne Higije, inv. 986/R, 49 cm | vila sa peristilom | [PROVERENO-LOKALNO] inv. potvrđen; pun grčki tekst NIJE izvučen — ne izmišljati |
| 3 | Sveštenik Sim[...] — natpis grupe sa Telesforom | vila sa peristilom | [PROVERENO-LOKALNO] fragmentarno |
| 4 | Dva oltara sa natpisima | vila sa peristilom / svetilište | [PROVERENO-POSTOJANJE] tekstovi nisu citirani u izvoru koji je radnik imao |
| 5 | Žaba sa ZO[HN] (grč. ΖΩ[ΗΝ] — „život") | vodeni kontekst (nimfej/bazen) | [PROVERENO-LOKALNO] |
| 6 | Ampelius, tribunus Batavorum | horreum | [PROVERENO-LOKALNO] |
| 7 | „ob dedicationem domus" | vila — posveta kuće | [PROVERENO-LOKALNO] |
| 8 | Fragment natpisa | južna crkva (kasna faza) | [PROVERENO-POSTOJANJE] |
| 9 | Dea Dardanica | ulaz u vilu | statua; natpis NIJE potvrđen — samo ikonografska identifikacija |

## 2. Korpusi — šta je i nije verifikovano

- **CIL III** [NEPROVERENO-brojevi]: Naissus pripada gornjomeziječkom materijalu CIL III +
  supplement; reference „p. 232, 1030" strukturno liče na addenda/indeks. Konkretne brojeve
  (opseg 8197ff) radnik NIJE proverio — ne preuzimati bez uvida.
- **IMS (Inscriptions de la Mésie Supérieure)** [NEPROVERENO]: veza Naissus↔IMS ide preko
  radova Petra Petrovića; tom i brojevi nepotvrđeni.
- **LSA** [PROVERENO-STRUKTURA]: URL oblik zapisa `database/record.php?rec=NNNN`;
  LSA-0275 potvrđen kao Naissus zapis; tražiti porfirne statue Eskulapa/Higije preko
  `find=` POST forme (webReader ne može POST — treba headless ili direktni rec= opseg).
- **EDCS** [PROVERENO-STRUKTURA]: GET radi:
  `https://db.edcs.eu/epigr/epi.php?s_sprache=en&p_ort=Mediana` (i varijanta `p_inhalt=`);
  odgovor nosi konkomitancu CIL/IMS/AE — najbrža potvrda brojeva.
- **EDH** [PROVERENO-STRUKTURA]: API `https://edh-www.adw.uni-heidelberg.de/data/api/geo/search?searchstring=Naissus`
  pa `/data/api/search?find_location=Naissus` (probati i „Mediana", „Medijana").

## 3. Otvoreni zadaci

1. Uvuci EDCS `p_ort=Mediana` + `p_ort=Naissus` → tabela konkomitanci (CIL/IMS/AE brojevi).
2. LSA opseg rec= za porfirni par (polazno LSA-0275 Naissus).
3. Pun grčki tekst natpisa 985/R i 986/R iz monografije 2011 (pdf na disku, odeljak o skulpturi).
4. IMS tom za Naissus preko WorldCat/SAZU.

**Suština nalaza:** Medijana ima najmanje 8 natpisnih spomenika, dvojezično grčko-latinski,
sa dva imena velikaša (Roimetalkes — tračka kraljevska titula „diasemotatos"; Ampelius —
tribun Batavorum = vojna prisutnost). Korpusni brojevi ostaju najveća rupa baze — sad imamo
tačne obrasce da je zatvorimo u sledećem talasu.
