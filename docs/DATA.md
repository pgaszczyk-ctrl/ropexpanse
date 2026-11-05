# Dane i pochodzenie

## OpenStreetMap

public/combat3d/lublin.json zawiera przetworzony wyciąg OpenStreetMap: 947 obrysów budynków, 1518 odcinków dróg oraz obszary terenu. Wybrany obszar: Stare Miasto w Lublinie i okolice, origin 51.2482,22.5681, promień 560 m. Dane odziedziczono z pliku data/lublin-osm.geojsonseq.gz projektu pgaszczyk-ctrl/erpeg. Surowego archiwum nie dołączono. Dokładna data pierwotnego pobrania wyciągu wymaga potwierdzenia.

Atrybucja: © OpenStreetMap contributors.

- https://www.openstreetmap.org/copyright
- https://opendatacommons.org/licenses/odbl/1-0/

Dane OSM podlegają ODbL; prywatność repo nie zmienia ich warunków. Zachowaj widoczną atrybucję i sprawdź wymagania dotyczące pochodnej bazy przy dystrybucji. Nie obejmuj danych własną licencją do kodu.

## Opcjonalny ponowny import

Gotowy JSON wystarcza do uruchomienia i builda. Jeżeli dysponujesz lokalnym wyciągiem OSM w gzip GeoJSON Sequence:

```sh
npm run map:import -- /path/to/lublin-osm.geojsonseq.gz
```

Importer ma ustalony origin i promień lokalnej próby; nie jest jeszcze generatorem całego świata. Surowego wyciągu nie pobiera z sieci.

## Kod i modele

Wybrane pliki prototypu pochodzą z pgaszczyk-ctrl/erpeg, commit 97cdb24; skopiowano kod, nie historię repo. Modele w models.ts są proceduralne. Projekt nie otrzymuje w tym etapie licencji open source. Three.js, Vite, TypeScript i Playwright mają własne licencje dystrybuowane z pakietami npm.

CSS korzysta opcjonalnie z Google Fonts. Eksport jednoplikowy usuwa import zewnętrznych fontów. Do docelowej wersji prywatnej lub offline można dołączyć font lokalnie wraz z jego licencją.
