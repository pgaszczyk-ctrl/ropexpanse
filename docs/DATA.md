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

## Strumieniowanie świata

Źródło główne (od 07.11.2026, decyzja właściciela): mapa świata Protomaps — jeden niezmienny plik PMTiles z kaflami wektorowymi OpenStreetMap, ten sam, którego używa erpeg. `src/combat3d/osmTiles.ts` czyta z niego zapytaniami HTTP Range tylko kafle zoom 15 pod kaflem gry, przycina je do granic kafla (bez podwójnych dachów na styku) i zamienia na elementy, które rozumie `convertElements`. Odczytane kafle trzymamy w pamięci (48 ostatnich) i w IndexedDB (96 kafli gry, tylko elementy sięgające danego kafla).

Adres pliku: parametr `?world=<url>` (testy), zmienna `VITE_WORLD_URL` przy budowaniu, w przeciwnym razie archiwum erpeg (`world-20261103.pmtiles`). Gra tylko czyta; nazwa archiwum jest przypięta, więc podmiana pliku przez nowy build nie zmienia mapy w trakcie gry.

Bezpieczeństwo i ograniczenia:

- Hosting gry musi być dopuszczony w ustawieniach CORS kubełka R2 (dziś ustawionym dla exp-lore.app). Bez tego przeglądarka odrzuci odczyt i gra przejdzie na Overpass.
- Overpass (`https://overpass.private.coffee/api/interpreter`, https://wiki.openstreetmap.org/wiki/Overpass_API) zostaje wyłącznie jako zapas przy błędzie archiwum: zapytania sekwencyjne, co najmniej 3 s odstępu, odrzucanie częściowych odpowiedzi.
- Zmiana źródła podniosła `WORLD_VERSION` do 2: stare kafle z Overpass w IndexedDB są pobierane ponownie (inne identyfikatory obiektów).
- Testy: `scripts/tests/osm-tiles.mjs` i `browser-world.mjs` na próbce `scripts/tests/fixtures/lublin.pmtiles` (Protomaps 4.15, wycinek Lublina z erpeg, build 20261011, ~3,9 MB). Nie wymagają sieci.

Cała Ziemia nie jest dołączana do repo. Dane nadal podlegają ODbL i wymagają widocznej atrybucji (© OpenStreetMap contributors; Protomaps).
