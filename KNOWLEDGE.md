# Metod i pouke

26.10.2026 — konsolidacija 0.33.

- Završna presuda dolazi posle svih provera. Negativna kontrola sa namerno pogrešnim podatkom dokazuje da se pravilo izvršava.
- Validator proverava račun, strukturu, veze i status dokaza. Ne sme zahtevati željeni zaključak poput „sve trase su neizvodljive“.
- Promena koordinate poništava primenljivost stare kote i zavisnog profila. Staro očitavanje ostaje vezano za staru tačku.
- Ulična geometrija, moderni izvor i centroid naselja nisu izmereni antički objekti. Precizne decimale nisu precizno lociranje.
- DEM/DSM, geodetska kota poda, dno kanala i nivo vode imaju različito značenje. Servisi nad istim rasterom nisu nezavisne potvrde.
- Model protoka čuva presek, hrapavost, nagib, jedinice i pretpostavke. Kapacitet kanala nije izdašnost izvora.
- Dve polilinije nisu iscrpna potraga za trasom.
- Nula rezultata opisuje samo taj upit, vreme i obuhvat; ne dokazuje nepostojanje stvari.
- Stari izveštaj čuvati celovit u istoriji, a ulaz održavati kao jedan kratak važeći pregled. Verzija paketa nije nova verifikacija svakog izvora.

Nastavak: [SINTEZA.md](SINTEZA.md). Provera: `node validator.js`; negativne kontrole: `node alati/regresija.cjs`.
