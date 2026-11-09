# ROPExpanse — stan projektu

Aktualizacja: 05.11.2026.

- Samodzielna gra rozwijana w repozytorium `pgaszczyk-ctrl/ropexpanse`.
- Punkt startowy: gałąź `geohorde` repozytorium `pgaszczyk-ctrl/exp-lore`, commit `00ae76cbae9351a142b7a8ff5cdcc359bf738245`.
- Stos: Three.js, TypeScript, Vite. Działa lokalny fragment Lublina z OSM, proceduralne bryły budynków, postać, wilki i walka czasu rzeczywistego.
- Modele postaci i wilków są składane z brył w kodzie; ten prototyp nie używa dla nich GLB.
- ROPExpanse i erpeg pozostają niezależnymi grami. Z erpeg można w przyszłości skopiować mechanizm pobierania i przygotowania danych mapy; nie przenosimy questów, ekwipunku, kont ani systemu walki.
- 09.11.2026: mapa z kafelków OpenFreeMap — przed startem 2,5 km wokół postaci, kolejne kilometry przy rozbijaniu obozu (animacja). Bryły scalone w kawałki; rysowanie klatki ok. 4× szybsze w pomiarze SwiftShader. Wrogowie pojawiają się tylko poza kadrem, odradzają po 60 s. Usunięto przycisk pauzy. Przelicznik bez zmian: 0,18 jednostki sceny na metr.
- Aktualny podgląd gry pozostaje osobnym wdrożeniem; samo skopiowanie kodu nie zmienia hostingu.
- Weryfikacja przed przeniesieniem: `npm run build` i `npm test` zakończone powodzeniem. Test na fizycznym telefonie pozostaje do wykonania.

Czytaj również README.md, docs/ARCHITECTURE.md i docs/DATA.md. Starszy plan w docs/NEXT_STEPS.md jest punktem odniesienia; nowe ustalenia właściciela mają pierwszeństwo.
