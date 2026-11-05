# Zasady pracy nad ROPExpanse

Na początku sesji czytaj docs/STATE.md, README.md i docs/PROJECT.md, potem docs/ARCHITECTURE.md i docs/NEXT_STEPS.md. To nowa baza projektu; nie odtwarzaj starego silnika Phaser ani zaplecza serwerowego bez potrzeby.

## Kierunek

- RPG solo, fantasy/steampunk na realnej mapie, sterowane wirtualnie. Nie wymaga fizycznego spaceru.
- Trwała postać; krótkie, konkretne cele i możliwość dłuższych wypraw.
- Real time, czytelne zapowiedzi ataków, wygodne sterowanie poziome na telefonie.
- Zachowaj charakter i bryłę wilków. Nie wymieniaj oprawy całej gry przy okazji drobnej poprawki.
- Dokumenty odróżniają ustalone decyzje od hipotez. Nie traktuj burzy mózgów jako zatwierdzonego backlogu.

## Zakres i bezpieczeństwo danych

- Pracuj wyłącznie w tym repo. Stara gra `pgaszczyk-ctrl/erpeg` jest odrębnym projektem.
- Właściciel zlecił przeniesienie aktualnego prototypu do publicznego repo `pgaszczyk-ctrl/ropexpanse`. Dalsze prace prowadź tutaj; nie kopiuj prywatnych identyfikatorów hostingu ani danych operacyjnych innych projektów.
- Nie kopiuj sekretów, .env, kont graczy, starej historii ani wewnętrznych raportów starego repo.
- Nie dodawaj zależności serwerowych, telemetrycznych ani płatności do etapu lokalnego prototypu.
- Nie wprowadzaj licencji udzielającej praw do kodu bez decyzji właściciela. Zachowuj atrybucję OSM i licencje zależności.

## Weryfikacja zmian

- `npm ci`, `npm run build`, `npm test`.
- Przy zmianie walki, sterowania, renderowania lub HUD: `npm run test:browser` po buildzie. Testy wymagają Chromium (`npx playwright install chromium`).
- Sprawdź komputer oraz telefon poziomo; portret powinien zatrzymywać grę i pokazywać prośbę obrotu.
- Nie deklaruj testu na fizycznym urządzeniu, jeśli użyto wyłącznie emulacji.
- Przy zmianach grafiki sprawdź rzeczywisty obraz, nie tylko brak błędów JS. Zapisuj lokalne zrzuty w work/.
- Przy zmianie przepływu startu pamiętaj, że requestFullscreen musi nastąpić bezpośrednio po interakcji użytkownika.

Dla większych zmian używaj osobnej gałęzi i opisz wynik oraz testy w PR. Aktualizuj docs/NEXT_STEPS.md, jeśli zamykasz etap lub odkrywasz istotny problem. Nie dodawaj plików builda, node_modules, zrzutów testowych ani lokalnych logów do Git.
