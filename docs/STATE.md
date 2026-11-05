# ROPExpanse — stan projektu

Aktualizacja: 05.11.2026.

Samodzielna gra w `pgaszczyk-ctrl/ropexpanse`. Three.js, TypeScript, Vite; bez zależności od erpeg i bez zaplecza kont.

## Nowa pętla

- Obóz: namiot, tablica i palik. Jedno menu: rozciągnij linę, skarbiec, rekrutuj.
- Lina prowadzona przez postać, trasa po narożnikach obrysów, odwijanie i wizualny zwis. Nowy obóz kosztuje 30 zł, wymaga odstępu 18 jednostek, miejsca o promieniu 3,6 jednostki i braku walki. Długość liny 65 jednostek. Esc anuluje; E/LPM wbija palik. Poza liną LPM nadal atakuje lub otwiera kliknięty obóz.
- 24 miejsca w plecaku, broń/zbroja/hełm/buty, realny loot i wspólny skarbiec (przedmioty oraz złoto).
- Oferty rekrutacyjne rezerwują zasoby. Po pięciu minutach czasu rzeczywistego powstają zapisani, deterministyczni kandydaci. Jedna oferta zatrudnia jedną postać; anulowanie zwraca zasoby do skarbca.
- Wiele postaci ma oddzielne XP, HP, plecaki, wyposażenie, położenie i cooldowny. Zmiana przez górne menu jest dostępna w obozie, poza walką i bez prowadzonej liny. Nieaktywne postacie czekają; nie walczą automatycznie.
- Rosnąca krzywa XP. Pięć zachowań przeciwników: wilk, napastnik, łucznik, mag, ciężki. Warianty ubiorów, włosów i skóry. Poziom wrogów zależy od dystansu do korzenia wyprawy; kolejne połączone obozy nie obniżają go. Daleko od dowolnego obozu rośnie udział elit.
- Joystick odsunięty od lewej krawędzi. Ekwipunek z delikatną sylwetką, jasną siatką i szczegółami po wybraniu przedmiotu.

## Świat

Strumieniowanie geograficznych kafli OSM w dowolnym miejscu Ziemi, obsługa południka 180°, szerokości geograficznych i przesuwania początku współrzędnych. W pamięci pozostaje sąsiedztwo do dziewięciu kafli, w IndexedDB do 96. Nie pobieramy planety naraz. Geometria budynków, dróg, wód i zieleni pochodzi z OSM, a nie z wymyślonych zamienników. Nie ma modelu wysokości terenu ani kompletnej warstwy oceanów/wybrzeży.

Startowy Lublin jest dołączony i działa offline. Poza nim wymagane są dane z Overpass. Brak danych blokuje przejście, pokazuje stan i pozwala ponowić. Menu Świat pozwala wybrać miasto lub współrzędne; obecnie to beta narzędzie przeniesienia aktywnej postaci i założenia korzenia wyprawy, bez kosztu podróży. Nie jest to ukończony system transportu.

Zapis `ropexpanse:campaign:v2`, walidacja własności przedmiotów, migracja pojedynczej postaci z `exp-lore:combat3d:v1`. Nadal lokalnie w przeglądarce, bez synchronizacji między urządzeniami.

## Weryfikacja i ograniczenia

Testy reguł obejmują ekwipunek, escrow, kandydatów, zatrudnianie, wycofanie, zapis, XP, trasę liny, projekcję, multipoligony i obsługę błędów strumieniowania. UI ekwipunku sprawdzono osobno w przeglądarce bez WebGL.

Pełny test gry 3D i fizycznego telefonu pozostaje otwarty: przeglądarka tej sesji nie tworzy kontekstu WebGL, a instalator Chromium do Playwright otrzymał niepoprawne archiwum. Nie przedstawiać tego jako zaliczonego testu 3D. Próby rzeczywistego pobrania Overpass w środowisku wykonawczym zakończyły się HTTP 406 / timeout; ścieżkę sieciową sprawdzono deterministycznie na kontrolowanych odpowiedziach, nie na działającym publicznym serwerze.

Publiczny Overpass nie daje gwarancji dostępności. Przed szerokim udostępnieniem globalnej gry potrzebny jest kontrolowany dostawca danych lub własny cache serwerowy. Obecna wersja jest lokalną betą, nie ukończonym globalnym zapleczem produkcyjnym.


## Korekta bezpieczeństwa liny i AI (05.11.2026)

Zapisane połączenia między obozami chronią pas po 3 metry od liny, według skali mapy (0,54 jednostki w obecnej skali). Ochrona obejmuje zakręty i końce, regenerację, odporność na obrażenia oraz przerwanie ataku wrogów. Prowadzona, niezatwierdzona lina nie tworzy ruchomej strefy ochronnej. HUD odróżnia obóz od bezpiecznej liny. Wrogowie losują krótkie trasy i postoje wokół miejsca pojawienia także podczas odpoczynku gracza. Omijają bezpieczne obszary; przeciwnik objęty nowym połączeniem może z niego wyjść.

Build i testy reguł zaliczone; dodano test patrolowania w przeglądarce. Pełny test przeglądarkowy nadal wymaga dostępnego Chromium.

## Czytelność bezpiecznego terenu (05.11.2026)

`territory.ts` rysuje wspólny obrys kół obozów i pasów ukończonej liny: ciemna podkładka, jasny turkusowy rdzeń oraz szersza poświata. Podłoże jest zabarwione. Obrys jest geometrią powierzchniową, więc zachowuje szerokość także na telefonach ograniczających linie WebGL do jednego piksela. Wewnętrzne granice nachodzących stref są wycinane; geometria jest przebudowywana przy zmianie obozów/mapy, nie co klatkę. Używa tych samych promieni co ochrona. Prowadzona lina nie wyznacza bezpiecznego terenu.

Build i testy reguł zaliczone. Test przeglądarkowy uruchomiony, ale zablokowany brakiem Chromium; instalator ponownie otrzymał uszkodzone archiwum. Ocena rzeczywistego obrazu 3D pozostaje niepotwierdzona.
