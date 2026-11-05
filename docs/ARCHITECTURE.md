# Architektura bazy

## Stos

TypeScript w trybie strict, Vite, Three.js. Jeden punkt wejścia index.html. Minimalny zestaw zależności obejmuje silnik 3D i narzędzia deweloperskie; brak Phaser, Supabase, usług kont i backendu. Node >=22.18, zalecany 24.

## Pliki

| Plik | Odpowiedzialność |
|---|---|
| src/combat3d/main.ts | Scena, mapa, kolizje, pętla, stan, walka, AI, interfejs i wejście |
| src/combat3d/models.ts | Proceduralne modele, materiały i animacje |
| src/combat3d/rules.ts | Reguły oraz czyste funkcje geometrii i XP |
| src/combat3d/style.css | HUD, drążki, poziomy układ mobilny i komunikaty |
| public/combat3d/lublin.json | Gotowy fragment danych przestrzennych |
| scripts/build-combat3d-map.mjs | Opcjonalny import lokalnego surowego wyciągu OSM |
| scripts/export-combat3d.mjs | Eksport z dist do jednego HTML z mapą |
| scripts/tests/ | Testy reguł oraz integracyjne Playwright |

main.ts pozostaje dużym plikiem prototypowym. To celowo zachowany, działający punkt startu. Przy dodawaniu właściwego ekwipunku oddziel stan gry i logikę walki od renderowania; nie przepisuj wszystkiego na raz.

## Mapa

Origin 51.2482,22.5681; promień wejściowy 560 m, przelicznik 0.18 jednostki/m. To skala techniczna lokalnego testu, nie ostateczna skala całej Ziemi. Lokalna projekcja ma wystarczać do małego obszaru. Globalna podróż, kafelkowanie i poziomy szczegółowości nie są zaimplementowane.

Budynki są ekstrudowanymi poligonami OSM, nie sprite'ami. Drogi i elementy statyczne są scalane, drzewa instancjonowane, a przeszkody indeksowane przestrzennie. Modele gracza i przeciwników są zbudowane kodem z brył.

## Stan i zapis

localStorage: exp-lore:combat3d:v1. Zapis jest lokalny dla origin przeglądarki, bez konta i synchronizacji. Na innym hostingu/urządzeniu nie pojawi się automatycznie. Przy rozbudowie schematu dodaj wersjonowanie i migrację. Obecnie nie istnieje przepływ logowania.

## Urządzenia mobilne

Tryb coarse pointer domyślnie zmniejsza obciążenie GPU, wyłącza AA i cienie, ogranicza pixel ratio do 1. Parametr quality=safe zamienia materiały na prostsze. Diagnostyka sprawdza piksele renderera oraz obsługuje utratę i przywrócenie kontekstu WebGL. Przycisk startu żąda fullscreen; odmowa nie powinna blokować gry. Blokada orientacji jest próbą, nie gwarancją przeglądarki.

Są testy emulowanego telefonu, lecz problem białego ekranu przy content:// na fizycznym Androidzie nie został odtworzony. Najbliższa kontrola powinna odbyć się na tym urządzeniu przez HTTPS z rejestrowaniem widocznego komunikatu diagnostycznego.

## Testy i tryb QA

Parametr qa=1 udostępnia window.__combat3d z kontrolowanymi scenariuszami testowymi. Bez parametru te haki nie powinny być dostępne. Testy sprawdzają walkę, drążki, pauzę, śmierć, zapis, obraz, utratę kontekstu i orientację. Haki QA nie mogą w przyszłości służyć do potwierdzania transakcji ani rankingów.

## HUD steampunk

`hud.ts` zawiera własne wektorowe ikony instrumentów i walki. CSS korzysta z palety starego `erpeg/src/ui/hudTeleskop.ts` i `hud.ts`: ciepły mosiądz, ciemne szkło, oprawy portretu, nity i łączniki. Interfejs powstał w HTML/CSS/SVG, bez przenoszenia zależności starego HUD-u. Portret jest umownym wektorowym wizerunkiem obecnego modelu, nie kreatorem postaci.

HP jest stale widoczne i czerwone; XP ma bursztynowy pasek oraz pierścień przy portrecie. Wybór broni ma stan aria-pressed, paski zdrowia i XP opisane wartości dostępności. Nie dodano pozornie działających przycisków plecaka, aparatu czy pojazdu, których ten prototyp jeszcze nie obsługuje. Na telefonie GUI ma mniejsze panele i zachowuje dolne strefy sterowania.

## Rozszerzenie obozów i świata (05.11.2026)

- `campaign.ts`: własność przedmiotów, postacie, obozy, oferty, rezerwacje, kandydaci, rosnące progi XP i walidacja zapisu. BALANCE zbiera koszty i limity. Przedmiot jest w dokładnie jednym plecaku, slocie sprzętu, skarbcu lub ofercie.
- `rope.ts`: niezależna od Three.js geometria odcinków, trasa liny, narożniki i odwijanie. Wizualny zwis nie zmienia reguł kolizji ani długości.
- `world.ts`: projekcja geograficzna, pasy kafli z szerokością zależną od szerokości geograficznej, konwersja OSM z łączeniem pierścieni relacji, IndexedDB oraz kolejka pojedynczych zapytań. Wersja generatora i geograficzne identyfikatory stabilizują spotkania. Pamięć aktywna jest ograniczona sąsiedztwem; cache trwały do 96 kafli.
- `expedition.ts`: prezentacja obozów, liny i wspólnego komponentu siatki oraz obsługa menu/postaci/ofert. HTML dialog przejmuje fokus; stan symulacji jest zatrzymany podczas panelu. Rekrutacja korzysta z zegara ściennego, więc upływa także przy otwartym panelu i po zamknięciu gry.
- `main.ts`: integracja tych reguł z istniejącą walką. Teren jest w osobnej grupie, usuwane geometrie zwalniane, odlegli przeciwnicy usuwani. Zmiana mapy pobiera dane przed zmianą zapisanej kampanii. Brak kafla jest przeszkodą, nie pustą mapą.

Zapis v2 zachowuje położenia wszystkich postaci i obozów względem zapisanego origin. Rebase przelicza całą kampanię, w tym trasy połączeń; nie zapisuje współrzędnych ekranu. Stare v1 jest tylko źródłem migracji, nie współdzielonym zapisem z erpeg. Zapis nie jest usługą kont ani zabezpieczeniem przed modyfikacją lokalnych danych.


## Terytorium i pogranicze (05.11.2026)

`territory-rules.ts` udostępnia ukończone trasy, planarny graf odcinków (podział na przecięciach, obchód ograniczonych ścian), cache wnętrz pętli oraz odległość od bezpiecznego terenu. `invalidateTerritory` jest wywoływane po zmianie sieci i rebase. `territory.ts` używa tych samych wnętrz do triangulacji wypełnienia i wycinania wewnętrznych obrysów. Dodatkowe połączenia istniejących obozów są w opcjonalnym `Campaign.connections`; stare drzewa pozostają w `Camp.parentId/route`.

`recruitment.ts` oddziela profil prawdopodobieństwa/klasy/poziomu od zapisanego rozstrzygnięcia. `null` oznacza oczekiwanie, `[]` brak zgłoszeń, niepusta tablica kandydatów — wynik. Zasoby pozostają w escrow do zatrudnienia albo wycofania. Metadane poziomu, rzadkości i afiliacji są opcjonalne i walidowane.

`encounters.ts` wyznacza stabilne i oddzielne rzuty zagęszczenia, elit i bossów oraz presję odległości od bazy i granicy strefy. Zmiana obozów nie leczy istniejącego przeciwnika; wykluczone punkty są usuwane, pozostałe statystyki zmieniają się dopiero przy odrodzeniu.
