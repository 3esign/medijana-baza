# Promene i dokazi

## 2026-10-26 — paket 0.33

Polazno stanje: Git `62220c3`, čisto stablo. Inventar: `provere/inventar_pre.json`; početna validacija: `provere/validator_pre.txt`. Početna validacija prijavila je 0 grešaka, ali nije izvršavala četiri kasna bloka.

Prvi pregled: otkriven rani `process.exit`, nedefinisan `DIR`, pogrešni NE ofseti i rastojanje Pod Vinik–kasarna. Otkriveni zastareli profili i zaključci jači od podataka. Revizija ima 11 nalaza u `konsolidacija.json`.

Uređenje: 21 jednokratna skripta premeštena u `istorija/skripte/` uz proveru identičnih bajtova. Stari README, sinteza, validator i izmenjeni podaci sačuvani u `istorija/pre-konsolidacije-v032/`. Podaci ostaju na kompatibilnim putanjama. Dodati su tematska mapa, katalog sa heševima i registar URL-ova. Verzije slojeva zadržane su kao poreklo sadržaja.

Drugi pregled: negativne kontrole proveravaju četiri ranije nedostižna bloka, Manningovu računicu, status istorijskih profila i rad iz drugog direktorijuma. Drugačija numerička visina grebena mora biti dopuštena: validator ne nameće zaključak. Rezultat: `provere/regresija.json`.

Očuvanje: `provere/ocuvanje.json`. Konačna validacija: `provere/validator_posle.txt`. Izvori nisu ponovo mrežno proveravani; sedam istraživačkih ograničenja ostaje otvoreno.
