# Plan prac według dokumentu projektowego (Tab 1)

Źródło: dokument właściciela „ROPExpanse — dokument projektowy”, zakładka Tab 1 (stan z 06.11.2026). To ustalenia właściciela, mają pierwszeństwo przed starszym docs/NEXT_STEPS.md. Plan powstał 07.11.2026.

Baza: gałąź `feat/camps-world` (otwarty PR #1: obozy, lina, rekrutacja, strumieniowanie OSM). Sekcja „Poprawki obecnej wersji” w dokumencie opisuje właśnie tę wersję, nie `main`.

Zasada z dokumentu: każda zmiana upraszcza. Zamiast tekstów pomocniczych poprawiamy układ. Każdy tekst w dwóch językach (PL/EN).

## Budżet i pauzy

Pracuję etapami. Po każdym etapie: build, testy, commit, push i krótki raport. Nie widzę licznika tygodniowego limitu tokenów, więc po każdym etapie zatrzymuję się, żeby właściciel mógł sprawdzić zużycie (limit właściciela: pauza przy 20% tygodnia).

## Etap 1 — Poprawki obecnej wersji — ukończony 07.11.2026

Kolejność według dokumentu, od najważniejszego.

| # | Problem | Poprawka | Uwagi |
|---|---|---|---|
| 1.1 | Mapa wisi na „Wczytywanie mapy…” / „Mapa niedostępna · ponów” (publiczny Overpass) | Kafelki wektorowe PMTiles (Protomaps), cache kafli jak w erpeg; Overpass tylko awaryjnie | Wykonane 07.11.2026 (docs/DATA.md). Do sprawdzenia: CORS kubełka R2 dla hostingu gry |
| 1.2 | Pole złota w rekrutacji od 0 („050”), klawiatura | Suwak lub przyciski +10/+50 | Wykonane: suwak i ±10/±50 |
| 1.3 | Okno oferty w stylu systemowym | Okno w stylu HUD gry | Wykonane (też ekwipunek i skarbiec) |
| 1.4 | Brak statystyk przedmiotów, 5 min bez informacji | Statystyki przy przedmiocie, powiadomienie o kandydacie | Wykonane: liczba mocy na ikonie, lista z atakiem/obroną, pasek postępu; komunikat o zgłoszeniach już był. Powiadomienia systemowe — etap AFK |
| 1.5 | Menu obozu jako biała lista | Menu z ikonami w stylu gry | Wykonane |
| 1.6 | „Brak miejsca na obóz” | Podświetlenie na mapie, gdzie można postawić | Wykonane: do 3 zielonych kręgów zamiast komunikatu |
| 1.7 | Liczby obrażeń nachodzą na „+XP” | Osobne miejsca, rozsuwanie napisów | Wykonane |
| 1.8 | Małe paski HP, postacie za budynkami | Większe paski, sylwetka przez ściany, półprzezroczyste przeszkody | Wykonane: paski ~1,5×, sylwetka bohatera. Półprzezroczyste budynki — etap 5 (kamera) |
| 1.9 | Dużo wrogów przy obozie | Mniej spawnów przy obozach, skalowanie od odległości od lin | Wykonane: 15% przy granicy → 100% po 300 m |
| 1.10 | HUD przeciążony, „Wędrowiec ▾” | Mniej przycisków, rzadkie akcje w menu | Wykonane: pełny ekran i dźwięk w menu ☰, zmiana postaci tapnięciem portretu |
| 1.11 | „Akcja” długo nieaktywna | Ukryta bez akcji, pojawia się z nazwą akcji | Wykonane |
| 1.12 | Komunikat przeglądarki o pełnym ekranie | PWA (manifest, display fullscreen) | Wykonane: manifest i ikony; po instalacji gra nie prosi o pełny ekran |

## Etap 2 — Rdzeń pętli: lina, obozy, kręgi, surowce — ukończony 07.11.2026

- Wspólny Skarbiec: drewno, ruda, włókno, zioła, lina (metry); złoto i odłamki zostają przy postaci. Wykonane.
- Lina jest surowcem: rozciąganie zużywa metry ze Skarbca, odcinek ograniczony zapasem. Obóz kosztuje drewno. Wykonane.
- Skręcanie liny z włókna w Skarbcu — zastępstwo powroźnika do etapu 3.
- Zasoby na mapie wg OSM (główne gęsto, zastępcze rzadko, deterministyczna siatka), komplet czterech przy pierwszym obozie, zbieranie ciosem/czarem, rozpad na kostki, odrastanie 10 min (20 w kręgu). Wykonane.
- Kręgi produkują wg powierzchni i terenu z OSM, także gdy gra jest zamknięta; limit 10 h; „Zbierz z kręgów” w Skarbcu. Wykonane.
- Wyziewy: od 150 m od bezpiecznego terenu, częściej dalej; fala 4–9 potworów, potem jeden cios wbija pal z latarnią; skrzynia: złoto, odłamki, ruda, przedmiot. Zamknięte zostają na zawsze. Wykonane.
- Wartości (tempo produkcji, szanse, nagrody) są startowe do strojenia. Woda i boje — razem z łodziami (później).

## Etap 3 — Drużyna i rozwój

- Drużyna do 3, reszta sterowana przez AI, zmiana postaci tapnięciem portretu (dziś nieaktywne postacie nie walczą).
- Profesje bojowe (wojownik, mag, łucznik, zielarz) i obozowe (drwal, górnik, powroźnik).
- Poziom = tylko statystyki; umiejętności z broni i drugiej ręki (tabela Arsenał). Sloty (decyzja właściciela 07.11.2026): broń, druga ręka, zbroja, hełm, buty — wykonane.
- Rzadkość przedmiotów i Wędrowców (ramki), cecha pasywna, imiona z kraju (pliki JSON), tytuły legendarnych.
- Rekrutacja na mapie: uratowany Wędrowiec dołącza za darmo.

## Etap 4 — Wrogowie, biomy, pora dnia, pogoda

- Archetypy walki (stado, szarżownik, strzelec, zasadzka, przywoływacz, kolos, złodziej, zwodziciel); czerwony kształt = jedyne ostrzeżenie.
- Bestiariusz Europy Słowiańskiej według biomów OSM; skalowanie +1 poziom co ~15 km i od odległości od lin.
- Pora dnia z suncalc, pogoda z Open-Meteo, wrogowie zależni od pory i pogody.
- Znaki Mgły na wrogach (ubytki voxeli, fiolet), rozpad na kostki.

## Etap 5 — Świat 3D: teren i kamera

- Wysokość z AWS Terrain Tiles (Terrarium), tarasy voxelowe, przesadzony relief na nizinach.
- Obrót kamery dwoma palcami z dociąganiem do 45°, kompas, joystick względem ekranu.
- Mgła wojny jako desaturacja, paleta mapy dnia, 5 typów drzew, pory roku.

## Etap 6 — AFK, Kotwice, sezony

- AFK liczone lokalnie: produkcja do Skarbca (ok. 10% aktywnej gry), zajęcia Wędrowców (trening, wyprawa 1/4/8 h), ekran „Gdy cię nie było”.
- Kotwice z OSM (wikidata + zabytek), obrys budynku, punktacja według kolejności w mieście i odległości, komplet miasta, Kronika.
- Sezony, ranking (jedna tabela), Przypływ Mgły — dopiero po sprawdzeniu pętli. Monetyzacja na końcu, tylko kosmetyki i wygoda.

## Pytania do właściciela

Rozstrzygnięte 07.11.2026: mapa z archiwum erpeg (bezpiecznie, tylko odczyt, Overpass jako zapas), praca na PR #1, buty zostają (5 slotów).

1. **Grafika voxel chibi** — czekamy na ilustracje grafika (wojownik jako wzorzec). Do tego czasu zostają modele z brył.
2. **CORS** — kubełek R2 erpeg musi dopuszczać adres, pod którym działa ROPExpanse; inaczej gra użyje zapasowego Overpass.
