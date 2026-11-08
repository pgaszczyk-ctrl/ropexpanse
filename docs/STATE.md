# ROPExpanse — stan projektu

Aktualizacja: 08.11.2026 (plan poprawek dopisany po południu). Ta sekcja jest aktualna; niżej („Historia”) zostają starsze notatki, częściowo nieaktualne.

## Przekazanie do nowego wątku

- **Źródło ustaleń:** dokument właściciela „ROPExpanse — dokument projektowy”, zakładka Tab 1 (Claude Docs, artefakt `7afef21a-5678-46ff-9a61-a845ad16d2a4`). Plan etapów i stan: `docs/PLAN.md`.
- **Gdzie praca:** PR #1, gałąź `feat/camps-world` (od 08.11.2026 właściciel zgodził się na wysyłanie tam z `ccr-df7caf8e-cfao1s`) (właściciel: „pracuj na PR #1”). Te same commity są na `ccr-b863d83f-6161ta`. `main` jest za nimi.
- **Etapy 1–6 ukończone** (szczegóły w `docs/PLAN.md`; etap 6 = poprawki z przeglądu 8 listopada: łagodny teren, HUD na łuku, waluta tix, tabela łupów z wypadaniem, kolory świata; przy okazji drzewa przypięte do mapy i łączenie przerysowań). **Następny: etap 7 AFK**, potem etap 8 Kotwice. Pierwotny opis „etapu 6”: AFK (ekran „Gdy cię nie było”, zajęcia Wędrowców: trening, wyprawy 1/4/8 h, 3 powiadomienia), Kotwice (zabytki z OSM wikidata, obrys, punktacja wg kolejności w mieście × odległość, komplet miasta, Kronika), sezony i ranking (dopiero po sprawdzeniu pętli), monetyzacja na końcu.
- **Rytm pracy ustalony z właścicielem:** etapami; po każdym etapie raport i pauza, żeby właściciel sprawdził tygodniowy limit (umowa: pauza przy 20% tygodnia; asystent nie widzi licznika). Właściciel nie programuje: odpowiedzi po polsku, prosto.
- **Podgląd gry:** https://pgaszczyk-ctrl.github.io/ropexpanse/ — workflow `.github/workflows/pages.yml` publikuje każdy push do `main` i `feat/camps-world` na gałąź `gh-pages`. Właściciel musi raz włączyć Settings → Pages → Deploy from a branch → `gh-pages` / root (nie potwierdzono, czy włączył).
- **Do sprawdzenia przez właściciela:** CORS kubełka R2 erpeg musi dopuszczać `https://pgaszczyk-ctrl.github.io` (inaczej mapa spoza Lublina idzie wolnym Overpass); listy imion regionów (szkic) do weryfikacji przez osoby z regionów; test na fizycznym telefonie.
- **Grafika:** właściciel zamawia modele voxel chibi u grafika. Uwagi do pierwszej próbki (ciało bazowe): głowa ~40% wysokości, poza w gotowości, rzuty ortograficzne w jednej skali, 5–6 kolorów, potem pełny wojownik jako wzorzec. Wszystkie obecne modele (postacie, wrogowie, broń, zasoby, wyziewy) są tymczasowe z kodu — do podmiany na GLB, gdy przyjdą.

## Co jest w grze (skrót)

- **Mapa:** kafle Protomaps PMTiles z archiwum erpeg (R2, odczyt Range, cache), Overpass tylko awaryjnie; dołączony fragment Lublina offline (`src/combat3d/osmTiles.ts`, `world.ts`).
- **Teren:** AWS Terrain Tiles → tarasy voxelowe, ≤1 stopień między polami, woda płaska, budynki z cokołem; kamera obracana (2 palce / , .), dociąganie 45°, kompas; mgła wojny; 5 typów drzew z porami roku (`terrain.ts`, `explore.ts`).
- **Pętla:** obozy połączone liną (lina = surowiec w metrach, obóz kosztuje drewno), kręgi produkujące wg OSM (także offline, limit 10 h), wspólny Skarbiec (drewno, ruda, włókno, zioła, lina), zasoby na mapie zbierane ciosem, wyziewy (fala → pal z latarnią → skrzynia) (`campaign.ts`, `resources.ts`, `production.ts`, `vents.ts`).
- **Drużyna:** do 3, towarzysze AI, profesje (wojownik, mag, łucznik, zielarz; obozowi drwal/górnik/powroźnik), rzadkość + cecha pasywna + imię z regionu, legendy z tytułem, ratowanie Wędrowców na mapie, umiejętności ze sprzętu (Q broń, R druga ręka), 5 slotów: broń, druga ręka, zbroja, hełm, buty (`wayfarers.ts`, `skills.ts`).
- **Wrogowie:** bestiariusz słowiański wg biomów OSM + pora dnia + pogoda + dalecy od lin, archetypy walki; poziom +1 co 15 km od startu + odległość od lin (`bestiary.ts`, `encounters.ts`).
- **Niebo:** pora dnia z prawdziwego słońca (`sky.ts`), pogoda z Open-Meteo (`weather.ts`); `?time=` i `?weather=` wymuszają.
- **Interfejs:** okna w stylu HUD, menu obozu z ikonami, zielone miejsca na obóz, czytelna walka (osobne tory liczb), menu ☰ (pełny ekran, dźwięk), portret = panel drużyny, PWA (manifest, ikony).

## Testy

- `npm ci`, `npm run build`, `npm test` (14 testów reguł w Node, bez sieci).
- `BROWSER_EXECUTABLE=/opt/pw-browsers/chromium npm run test:browser` po buildzie (8 plików: walka, świat/PMTiles, wyziewy+ratowanie, drużyna, umiejętności, bestiariusz, kamera). Testy przeglądarkowe blokują kafle wysokości i pogodę (świat płaski, offline); zrzuty w `work/`.
- Tryb QA: `?qa=1` → `window.__combat3d` (snapshot + skróty testowe: fixture, travel, companion, spawnSpecies, equipTemplate, vent, rescue, production, setHp…).
- Gra w headless Chromium biegnie wolniej niż zegar: w testach czekać na czas gry (`snapshot().time`), nie na sekundy.
- Fixtury: `scripts/tests/fixtures/lublin.pmtiles` (Protomaps, ~3,9 MB), `scripts/tests/fixtures/terrarium/12/` (9 kafli Lublina).

## Znane ograniczenia

- Testowano tylko emulację; brak testu na fizycznym telefonie.
- Towarzysze nie omijają budynków (dołączają skokiem, gdy utkną).
- Wartości balansu (produkcja, nagrody, poziomy, szanse) są startowe.
- Zmiana sterowanej postaci przez panel pod portretem; dokument chce tapnięcia w portret towarzysza (do dodania z HUD).
- Prettier przeformatował przy okazji kilka starych plików (bez zmian działania).

## Historia (starsze notatki)

Samodzielna gra w `pgaszczyk-ctrl/ropexpanse`. Three.js, TypeScript, Vite; bez zależności od erpeg i bez zaplecza kont.

## Nowa pętla

- Obóz: namiot, tablica i palik. Jedno menu: rozciągnij linę, skarbiec, rekrutuj.
- Lina prowadzona przez postać, trasa po narożnikach obrysów, odwijanie i wizualny zwis. Nowy obóz kosztuje 30 zł, wymaga odstępu 18 jednostek, miejsca o promieniu 3,6 jednostki i braku walki. Długość liny 65 jednostek. Esc anuluje; E/LPM wbija palik. Poza liną LPM nadal atakuje lub otwiera kliknięty obóz.
- 24 miejsca w plecaku, broń/zbroja/hełm/buty, realny loot i wspólny skarbiec (przedmioty oraz złoto).
- Oferty rekrutacyjne rezerwują zasoby. Po pięciu minutach czasu rzeczywistego oferta może przynieść 0–4 zapisanych kandydatów; wynik nie jest losowany ponownie po odświeżeniu. Jedna oferta zatrudnia jedną postać; anulowanie zwraca zasoby do skarbca.
- Wiele postaci ma oddzielne XP, HP, plecaki, wyposażenie, położenie i cooldowny. Zmiana przez górne menu jest dostępna w obozie, poza walką i bez prowadzonej liny. Nieaktywne postacie czekają; nie walczą automatycznie.
- Rosnąca krzywa XP. Pięć zachowań przeciwników: wilk, napastnik, łucznik, mag, ciężki. Warianty ubiorów, włosów i skóry. Poziom wrogów zależy od dystansu do korzenia wyprawy i do najbliższego bezpiecznego terenu. Nowe obozy łagodzą okolicę; daleka dzicz zwiększa presję i szansę bossów.
- Joystick odsunięty od lewej krawędzi. Ekwipunek z delikatną sylwetką, jasną siatką i szczegółami po wybraniu przedmiotu.

## Świat

Strumieniowanie geograficznych kafli OSM w dowolnym miejscu Ziemi, obsługa południka 180°, szerokości geograficznych i przesuwania początku współrzędnych. W pamięci pozostaje sąsiedztwo do dziewięciu kafli, w IndexedDB do 96. Nie pobieramy planety naraz. Geometria budynków, dróg, wód i zieleni pochodzi z OSM, a nie z wymyślonych zamienników. Nie ma modelu wysokości terenu ani kompletnej warstwy oceanów/wybrzeży.

Startowy Lublin jest dołączony i działa offline. Poza nim wymagane są dane z Overpass. Brak danych blokuje przejście, pokazuje stan i pozwala ponowić. Menu Świat pozwala wybrać miasto lub współrzędne; obecnie to beta narzędzie przeniesienia aktywnej postaci i założenia korzenia wyprawy, bez kosztu podróży. Nie jest to ukończony system transportu.

Zapis `ropexpanse:campaign:v2`, walidacja własności przedmiotów, migracja pojedynczej postaci z `exp-lore:combat3d:v1`. Nadal lokalnie w przeglądarce, bez synchronizacji między urządzeniami.

## Weryfikacja i ograniczenia

Testy reguł obejmują ekwipunek, escrow, kandydatów, zatrudnianie, wycofanie, zapis, XP, trasę liny, projekcję, multipoligony i obsługę błędów strumieniowania. UI ekwipunku sprawdzono osobno w przeglądarce bez WebGL.

Pełny test gry 3D i fizycznego telefonu pozostaje otwarty: przeglądarka tej sesji nie tworzy kontekstu WebGL, a instalator Chromium do Playwright otrzymał niepoprawne archiwum. Nie przedstawiać tego jako zaliczonego testu 3D. Próby rzeczywistego pobrania Overpass w środowisku wykonawczym zakończyły się HTTP 406 / timeout; ścieżkę sieciową sprawdzono deterministycznie na kontrolowanych odpowiedziach, nie na działającym publicznym serwerze.

Publiczny Overpass nie daje gwarancji dostępności. Przed szerokim udostępnieniem globalnej gry potrzebny jest kontrolowany dostawca danych lub własny cache serwerowy. Obecna wersja jest lokalną betą, nie ukończonym globalnym zapleczem produkcyjnym.


## Pierwsza korekta bezpieczeństwa liny i AI (historyczna, zastąpiona poniżej)

Zapisane połączenia między obozami chronią pas po 3 metry od liny, według skali mapy (0,54 jednostki w obecnej skali). Ochrona obejmuje zakręty i końce, regenerację, odporność na obrażenia oraz przerwanie ataku wrogów. Prowadzona, niezatwierdzona lina nie tworzy ruchomej strefy ochronnej. HUD odróżnia obóz od bezpiecznej liny. Wrogowie losują krótkie trasy i postoje wokół miejsca pojawienia także podczas odpoczynku gracza. Omijają bezpieczne obszary; przeciwnik objęty nowym połączeniem może z niego wyjść.

Build i testy reguł zaliczone; dodano test patrolowania w przeglądarce. Pełny test przeglądarkowy nadal wymaga dostępnego Chromium.

## Czytelność bezpiecznego terenu (05.11.2026)

`territory.ts` rysuje wspólny obrys kół obozów i pasów ukończonej liny: ciemna podkładka, jasny turkusowy rdzeń oraz szersza poświata. Podłoże jest zabarwione. Obrys jest geometrią powierzchniową, więc zachowuje szerokość także na telefonach ograniczających linie WebGL do jednego piksela. Wewnętrzne granice nachodzących stref są wycinane; geometria jest przebudowywana przy zmianie obozów/mapy, nie co klatkę. Używa tych samych promieni co ochrona. Prowadzona lina nie wyznacza bezpiecznego terenu.

Build i testy reguł zaliczone. Test przeglądarkowy uruchomiony, ale zablokowany brakiem Chromium; instalator ponownie otrzymał uszkodzone archiwum. Ocena rzeczywistego obrazu 3D pozostaje niepotwierdzona.


## Zamknięte terytoria, rekrutacja i pogranicze (05.11.2026)

Bieżące reguły zastępują wcześniejsze wartości i ustalenie, że obozy nie łagodzą trudności:

- Lina chroni po **10 metrów z obu stron** (1,8 jednostki sceny). Koła obozów pozostają bez zmian.
- Prowadząc linę do istniejącego obozu, podejdź do jego środka (do 2,4 jednostki) i użyj **Połącz obozy** / E. Łączenie nie tworzy nowego obozu ani nie pobiera jego kosztu; nadal obowiązuje zasięg i omijanie przeszkód. Wnętrze domkniętej pętli jest bezpieczne, z regeneracją i blokadą wrogów. Otwarta sieć nie wypełnia obszaru. Odcinki są dzielone na przecięciach; uwzględniane są figury wklęsłe i wiele pętli. Nie wyznaczamy otoczki wypukłej obozów.
- W pasie **100 m poza granicą bezpiecznego terenu** pozostaje statystycznie połowa dotychczasowych punktów spotkań. Osobny stabilny hash zapobiega zmianie wyniku po odświeżeniu. Punkty objęte nowym bezpiecznym terenem znikają; redukcja działa również na startowym fragmencie offline.
- Trudność rośnie z pierwiastkiem odległości od regionalnej bazy i z odległością od granicy bezpieczeństwa. Bliska sieć obozów osłabia pierwszy składnik, lecz go nie zeruje. Poziomy 1–40 są wartościami początkowymi do balansu. Bossy mogą wystąpić dopiero >=1000 m od bazy i >=250 m od bezpiecznego terenu, z szansą 0,5–8% na punkt; mają większą sylwetkę, czerwony pasek, więcej HP/obrażeń i nagrodę. Żywy przeciwnik nie odzyskuje zdrowia przy postawieniu obozu; profil jest wyznaczany przy pojawieniu i odrodzeniu.
- Szansa zgłoszenia zależy od złota, wartości i rzadkości oferty oraz niewielkiego wpływu zabudowy; zawsze może nie być zgłoszeń. Przedmiot z afiliacją klasy lub ikoną broni zwiększa względny udział danej klasy (miecz → wojownik, kostur/magiczne łuski → mag, łuk → łucznik). Poziom rekruta zależy od wartości oferty, poziomu i rzadkości oferowanej broni oraz poziomu **aktywnej** postaci zapamiętanego przy wystawieniu. Panel pokazuje szanse i przedział poziomów.
- Brak zgłoszeń jest trwałym wynikiem, nie pustym oczekiwaniem. **Odbierz ofertę** zwraca wszystkie przedmioty i złoto do skarbca. Przeładowanie ani ponowne przetworzenie tej samej oferty nie zmienia wyniku.
- Przedmioty obsługują opcjonalne `level`, `rarity`, `affinity` i slot materiałów. Stare zapisy przyjmują wartości domyślne; stare oferty z kandydatami pozostają rozstrzygnięte. To przygotowanie pod przyszłe unikalne przedmioty; sposób dostarczania lootu pozostaje zadaniem kolejnym.

Testy reguł obejmują pętle/figury wklęsłe/przecięcia, zapis i migrację, geometrię wypełnienia Three.js, rozkład zagęszczenia, trudność/bossów i rekrutację (sukces, brak zgłoszeń, profil klasy, limit poziomu, zwroty). Build oraz npm test zaliczone. Test przeglądarkowy zaktualizowany o brak zgłoszeń i zwrot; uruchomienie nadal blokuje brak Chromium. Nie potwierdzono obrazu 3D ani fizycznego telefonu.
