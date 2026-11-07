# ROPExpanse — stan projektu

Aktualizacja: 07.11.2026.

Plan prac według dokumentu projektowego właściciela: docs/PLAN.md (etap 1 ukończony: mapa z PMTiles, 5 slotów sprzętu, okna w stylu gry, zielone miejsca na obóz, czytelna walka, prostszy HUD, PWA). Testy przeglądarkowe działają z Chromium w /opt/pw-browsers (`BROWSER_EXECUTABLE=/opt/pw-browsers/chromium npm run test:browser`).

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
