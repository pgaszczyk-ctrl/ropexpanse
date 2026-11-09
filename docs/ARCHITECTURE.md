# Architektura bazy

## Stos

TypeScript w trybie strict, Vite, Three.js. Jeden punkt wejścia index.html. Minimalny zestaw zależności obejmuje silnik 3D i narzędzia deweloperskie; brak Phaser, Supabase, usług kont i backendu. Node >=22.18, zalecany 24.

## Pliki

| Plik | Odpowiedzialność |
|---|---|
| src/combat3d/main.ts | Scena, pętla, stan, walka, AI, obóz, interfejs i wejście |
| src/combat3d/world.ts | Załadowana mapa: scalone siatki, siatka kolizji, wygaszanie budynków, kolejka kafelków |
| src/combat3d/tiles.ts, tile-worker.ts | Pobieranie i dekodowanie kafelków wektorowych (w Web Workerze) |
| src/combat3d/region.ts | Tablice wierzchołków: bryły w kawałkach 48×48, ziemia, drogi, drzewa |
| src/combat3d/geo.ts | Typy mapy, lokalna projekcja, matematyka kafelków, przycinanie |
| src/combat3d/models.ts | Proceduralne modele, materiały i animacje |
| src/combat3d/rules.ts | Reguły oraz czyste funkcje geometrii i XP |
| src/combat3d/style.css | HUD, drążki, poziomy układ mobilny i komunikaty |
| public/combat3d/lublin.json | Gotowy fragment danych przestrzennych |
| scripts/build-combat3d-map.mjs | Opcjonalny import lokalnego surowego wyciągu OSM |
| scripts/export-combat3d.mjs | Eksport z dist do jednego HTML z mapą |
| scripts/tests/ | Testy reguł oraz integracyjne Playwright |

main.ts pozostaje dużym plikiem prototypowym. To celowo zachowany, działający punkt startu. Przy dodawaniu właściwego ekwipunku oddziel stan gry i logikę walki od renderowania; nie przepisuj wszystkiego na raz.

## Mapa

Origin 51.2482,22.5681, przelicznik 0.18 jednostki/m (zgodny ze starymi zapisami). Projekcja równoodległościowa wokół originu wystarcza na dziesiątki kilometrów; dalekie podróże będą wymagały przesuwania originu.

Źródło: kafelki wektorowe OpenMapTiles z OpenFreeMap, zoom 14 (ok. 1,5 km). Dekodowanie wzorowane na world.ts z erpeg (`@mapbox/vector-tile` + `pbf`). Archiwum PMTiles erpeg leży na prywatnym kubełku właściciela, więc go nie podpięto; `?tiles=<adres z {z}/{x}/{y}>` pozwala podmienić źródło. `?map=local` wymusza dołączony wycinek.

Zasada ładowania: przed startem cały promień 2,5 km jest pobierany, dekodowany i zamieniany na siatki w workerach. Podczas gry nic się nie doczytuje. Kolejne kilometry wczytuje dopiero obóz (promień 2,5 km wokół obozu); kafelki dalsze niż ok. 4,2 km są wtedy zwalniane. Poza wczytanym obszarem teren jest ciemniejszy i nieprzechodni, a gra podpowiada rozbicie obozu.

Wydajność: budynki są scalone w kawałki 48×48 jednostek z kolorami wierzchołków i jednym wspólnym materiałem (zamiast osobnej siatki i dwóch materiałów na budynek). Kafelek centrum Lublina to ok. 26 tys. trójkątów brył; scena rysuje ok. 30 wywołań zamiast ~350. Zasłanianie postaci liczone jest analitycznie (odcinek kamera–postać kontra obrys), a zasłaniający budynek wygasza się wzorem rastrowym w shaderze, bez przezroczystości. Mapa cieni jest statyczna i przerysowuje się, gdy postać przejdzie ok. 20 jednostek.

Kafelki przy z14 łączą przylegające budynki w kwartały, więc bryły są większe niż w surowym OSM.

## Stan i zapis

localStorage: exp-lore:combat3d:v1 (opcjonalne pola hx/hz: pozycja ostatniego obozu). Zapis jest lokalny dla origin przeglądarki, bez konta i synchronizacji. Na innym hostingu/urządzeniu nie pojawi się automatycznie. Przy rozbudowie schematu dodaj wersjonowanie i migrację. Obecnie nie istnieje przepływ logowania.

## Urządzenia mobilne

Tryb coarse pointer domyślnie zmniejsza obciążenie GPU, wyłącza AA i cienie, ogranicza pixel ratio do 1. Parametr quality=safe zamienia materiały na prostsze. Diagnostyka sprawdza piksele renderera oraz obsługuje utratę i przywrócenie kontekstu WebGL. Przycisk startu żąda fullscreen; odmowa nie powinna blokować gry. Blokada orientacji jest próbą, nie gwarancją przeglądarki.

Są testy emulowanego telefonu, lecz problem białego ekranu przy content:// na fizycznym Androidzie nie został odtworzony. Najbliższa kontrola powinna odbyć się na tym urządzeniu przez HTTPS z rejestrowaniem widocznego komunikatu diagnostycznego.

## Testy i tryb QA

Parametr qa=1 udostępnia window.__combat3d z kontrolowanymi scenariuszami testowymi. Bez parametru te haki nie powinny być dostępne. Testy sprawdzają walkę, drążki, pauzę, śmierć, zapis, obraz, utratę kontekstu i orientację. Haki QA nie mogą w przyszłości służyć do potwierdzania transakcji ani rankingów.

## HUD steampunk

`hud.ts` zawiera własne wektorowe ikony instrumentów i walki. CSS korzysta z palety starego `erpeg/src/ui/hudTeleskop.ts` i `hud.ts`: ciepły mosiądz, ciemne szkło, oprawy portretu, nity i łączniki. Interfejs powstał w HTML/CSS/SVG, bez przenoszenia zależności starego HUD-u. Portret jest umownym wektorowym wizerunkiem obecnego modelu, nie kreatorem postaci.

HP jest stale widoczne i czerwone; XP ma bursztynowy pasek oraz pierścień przy portrecie. Wybór broni ma stan aria-pressed, paski zdrowia i XP opisane wartości dostępności. Nie dodano pozornie działających przycisków plecaka, aparatu czy pojazdu, których ten prototyp jeszcze nie obsługuje. Na telefonie GUI ma mniejsze panele i zachowuje dolne strefy sterowania.
