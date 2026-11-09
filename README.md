# ROPExpanse — samodzielna gra 3D

Samodzielny prototyp RPG fantasy/steampunk na rzeczywistej mapie. Gracz porusza postacią na telefonie lub komputerze — fizyczne chodzenie i GPS nie są wymagane. Repozytorium `pgaszczyk-ctrl/ropexpanse` rozwija ROPExpanse niezależnie od erpeg. Punkt startowy: `pgaszczyk-ctrl/exp-lore`, gałąź `geohorde`, commit `00ae76cbae9351a142b7a8ff5cdcc359bf738245`. Nie przeniesiono historii ani zaplecza starej gry.

## Uruchomienie

Node.js >=22.18 (zalecany 24), npm:

```sh
npm ci
npm run dev
```

Otwórz adres wyświetlony przez Vite. Telefon i komputer muszą widzieć ten sam serwer; do pełnego testu użyj hostingu HTTPS. Pełny ekran jest żądany po kliknięciu „Wyrusz”, a jego dostępność zależy od przeglądarki. Telefon: poziomo.

```sh
npm run build
npm test
npx playwright install chromium
npm run test:browser
```

Test przeglądarkowy uruchamia własny podgląd Vite na 127.0.0.1:4178; najpierw wykonaj build. Domyślnie używa dołączonego wycinka (`?map=local`), więc nie wymaga sieci; `TILES=1 npm run test:browser` sprawdza też prawdziwe kafelki. Opcjonalne zmienne `BROWSER_EXECUTABLE` i `PLAYWRIGHT_MODULE` wskazują istniejącą przeglądarkę i moduł Playwright. Zrzuty testów trafiają do `work/combat3d/`.

Po buildzie `npm run export:offline` zapisuje pojedynczy HTML do `work/combat3d/EXP-LORE_proba_walki_3D.html`. To pomocnicza forma testowa, nie docelowy sposób dystrybucji.

## Co działa

- Mapa z wektorowych kafelków OSM (OpenFreeMap): przed startem wczytuje się 2,5 km wokół postaci (ok. 16 kafelków, ~20 tys. brył w Lublinie). Bez sieci gra używa dołączonego wycinka Starego Miasta.
- Obóz (przycisk lub C, poza walką): animacja wbijania palików i rozkładania namiotu z plecaka; w tym czasie doczytują się kolejne kilometry mapy, a obóz staje się nowym schronieniem.
- Przeciwnicy pojawiają się i odradzają tylko poza kadrem kamery.
- Proceduralne modele postaci, wilków i łuczników; animacje i zapowiedzi ataków.
- Miecz, magia, sweep, mikstura, regeneracja, HP, XP, prosty cel sześciu zabójstw.
- Klawiatura/mysz i dwa drążki dotykowe; pauza (P/Esc, automatycznie po wyjściu z karty; wznowienie dotknięciem), obsługa zmiany orientacji.
- Lokalny zapis, odrodzenie w schronieniu, utrata złota z plecaka i części XP.
- Pełny ekran po starcie, lżejszy tryb mobilny i komunikaty błędów WebGL.

Nie ma jeszcze sklepu, ekwipunku z prawdziwymi przedmiotami, kampanii, kont ani synchronizacji. Biały ekran na fizycznym telefonie użytkownika pozostaje do ponownego sprawdzenia — testy emulowane nie potwierdzają zgodności konkretnego urządzenia.

## Dokumentacja

- [Aktualny stan i przekazanie kontekstu](docs/STATE.md)
- [Kierunek i zakres](docs/PROJECT.md)
- [Architektura i ograniczenia](docs/ARCHITECTURE.md)
- [Pierwszy etap](docs/NEXT_STEPS.md)
- [Źródła danych i atrybucja](docs/DATA.md)
- [Instrukcje dla Codexa i Claude Code](AGENTS.md)

Kod wybrano z prototypu w `pgaszczyk-ctrl/erpeg`, commit `97cdb24`. Nie przeniesiono Supabase, sekretów, kont graczy, danych osobowych, starej historii Git ani prywatnych notatek operacyjnych. Nie nadano projektowi licencji open source. Dane OSM mają odrębne warunki opisane w docs/DATA.md.
