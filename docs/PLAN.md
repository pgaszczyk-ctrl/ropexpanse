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

## Etap 3 — Drużyna i rozwój — ukończony 08.11.2026

- Drużyna do 3 (zapisana): towarzysze idą w szyku, wojownik walczy wręcz, mag/łucznik/zielarz z dystansu; wrogowie wybierają najbliższego z drużyny, wojownik ściąga ich chętniej. Powalony towarzysz wstaje po walce lub w obozie. Kontrola nad dowolnym członkiem drużyny poza walką (panel drużyny pod portretem). Towarzysze dostają XP za walki, w których biorą udział.
- Profesje: wojownik, mag, łucznik, zielarz (leczy) oraz obozowi drwal, górnik, powroźnik — pracują w obozie, szybciej przy pasującym terenie, nigdy do zera; powroźnik skręca linę z włókna ze Skarbca.
- Rzadkość Wędrowców (ramka w kolorach rzadkości przedmiotów), cecha pasywna z puli klasy (słaba/pełna/mocna), legendy z unikalną cechą i tytułem w formie płci; obóz nigdy nie daje legend.
- Imiona z 12 regionów (zgrubne prostokąty), po 20+20, 1 na 5 z innego regionu, bez powtórzeń. Listy to szkic do sprawdzenia przez osoby z regionów.
- Ratowanie Wędrowców otoczonych przez potwory, od 100 m od bezpiecznego terenu; dołączają za darmo z poziomem strefy, legendy tylko daleko od lin.
- Umiejętności ze sprzętu: miecz szarża, topór wir, młot wstrząs z ogłuszeniem, laska kula ognia (Q); tarcza prowokacja, orb tarcza many (R). Nowe bronie: topór, młot.
- Do zrobienia później: łuk/kusza/różdżka/berło/sierp i pozostałe typy z Arsenału (ikony i modele czekają na grafika), legendarne warianty umiejętności, zdjęcie sprzętu na figurce, animacja pracy postaci obozowych.

## Etap 4 — Wrogowie, biomy, pora dnia, pogoda — ukończony 08.11.2026

- Bestiariusz Europy Słowiańskiej: 23 wrogów w 6 biomach z OSM (las, łąki, woda, cmentarz, miasto, przemysł) + wrogowie pory dnia (ogniki, nietoperze, Nocnica, wilkołak), pogody (topielce w deszczu, lodowy upiór, Płanetnik) i dalecy od lin (Żmij, Licz).
- Archetypy jak w dokumencie: stado (flankuje), szarżownik (czerwona linia, pęd), strzelec, czarownik, zasadzka (ukryta do 4 j.), przywoływacz (sługi swojego biomu), kolos (krąg), złodziej (kradnie i ucieka, oddaje po śmierci), zwodziciel (wybucha), wir (Południca).
- Poziom: świat +1 co 15 km od startu + 1 co 350 m od lin; elitarni rzadko do 300 m od liny.
- Pora dnia liczona lokalnie z prawdziwego słońca; światło dnia, zmierzchu i granatowej nocy; lampa drużyny i ognisko obozu.
- Pogoda z Open-Meteo (bez klucza, co 30 min na kwadrat ~25 km; offline = pogodnie): deszcz, śnieg, mgła, burza z błyskami, wiatr.
- Wygląd wrogów: tymczasowe przebarwione modele; czeka na grafika (znaki Mgły: ubytki voxeli, fiolet). Przyprószenie śniegiem, kałuże, okna świecące nocą — później.

## Etap 5 — Świat 3D: teren i kamera — ukończony 08.11.2026

- Wysokość z AWS Terrain Tiles (Terrarium, bez klucza): tarasy voxelowe, relief mocniej na nizinach, |Δ| ≤ 1 stopień między polami (zawsze da się wejść), woda płaska, budynki na najniższym punkcie z cokołem; drogi, postacie, zasoby, obozy, liny i obrys strefy leżą na terenie; bez danych świat płaski.
- Kamera: gest dwoma palcami, dociąganie do 45° (komputer: , i .), joystick/WASD/celowanie względem ekranu, kompas tylko poza północą.
- Budynki przed drużyną półprzezroczyste + sylwetka bohatera (było wcześniej, działa z obrotem i tarasami).
- Mgła wojny: nieodkryty teren i budynki ~70% szarsze, kolor po odkryciu (siatka ~55 m, zapisywana).
- 5 typów drzew wg terenu (liściaste, świerk, sosna, brzoza, krzew), warianty wielkości i obrotu, korony wg prawdziwej pory roku (półkula południowa odwrócona), zimą liściaste bez koron.
- Do zrobienia później: lekkie falowanie płaskiego terenu, serpentyny szlaków i urwiska z poręczówką liny, piętra roślinności w górach, mgła o świcie w dolinach, pełna paleta mapy z dokumentu (zmiana oprawy — z grafikiem).

## Etap 6 — Poprawki z przeglądu 8 listopada (przed AFK) — ukończony 08.11.2026

Źródło: Tab 1, podsekcja „Przegląd z 8 listopada: teren, HUD, loot, kolory”. Plan z 08.11.2026. Pięć paczek, po każdej build, testy, zrzuty z gry (komputer + telefon poziomo), commit i pauza.

| # | Paczka | Co zmieniamy | Pliki | Uwagi z kodu |
|---|---|---|---|---|
| 6.1 | Teren: łagodne fale | Ciągła wysokość zamiast zaokrąglania do voxeli; siatka wygładzona (rozmycie 2–3 wierzchołki), wygładzone normalne; szum ±1–2 m na płaskim, wygasa przy drogach, budynkach i wodzie; fundament budynków wpuszczony w grunt | `terrain.ts`, `world.ts`, `main.ts` | Dekodowanie Terrarium (R·256+G+B/256−32768) i próbkowanie dwuliniowe już są. Schodki robi `voxelsFor` (Math.round) i ograniczenie ≤1 stopień. Zasadę „zawsze da się wejść” zastępuje limit nachylenia przy wygładzaniu |
| 6.1 ✔ | **Wykonane 08.11.2026** | Wysokości ciągłe (bez zaokrąglania), limit nachylenia 0,5 j./komórkę, rozmycie 2 komórki, falowanie ±1,5 m wygasające 3 komórki od dróg/budynków/wody, gładka siatka z wygładzonymi normalnymi, drogi jako taśmy po terenie, fundament 0,5 j. w gruncie. Przy okazji (zgłoszenie właściciela): drzewa przypięte do stałej siatki mapy zamiast losowania wokół postaci; przerysowania świata łączone (nowe kafle + wysokości = jedno przerysowanie, brak przerysowań na stojąco) | | Test: `scripts/tests/terrain.mjs`, `browser-terrain.mjs` |
| 6.2 | HUD | Usunąć nazwę gry, przełącznik Miecz/Magia i przyciski testowe; prawy dół jako łuk wokół dużego Ataku: specjalny aktywnej postaci, mikstura, Obóz nad nimi; przycisk specjalny bierze ikonę, nazwę i cooldown z bohatera (Cięcie / Kula ognia / Salwa); portret przełącza postać | `index.html`, `hud.ts`, `style.css`, `skills.ts`, `main.ts` | Dziś w HUD: `.brand`, `data-weapon` Miecz/Magia, stała etykieta „CIĘCIE”. Klawisze 1/2 przejmie broń z ekwipunku |
| 6.2 ✔ | **Wykonane 08.11.2026** | Bez nazwy gry i przełącznika Miecz/Magia: sposób ataku wynika z broni w ekwipunku (kostur = magia). „Świat” (beta przenoszenia) w menu ☰, Plecak okrągłym przyciskiem obok ☰. Przyciski wokół Ataku układane kodem na równym łuku (specjalny, druga ręka, mikstura; Obóz nad Atakiem), promień rośnie, żeby się nie stykały. Przycisk specjalny bierze ikonę, nazwę i czas odnowienia z aktywnej postaci; łucznik dostał Salwę (5 pocisków wachlarzem) | | Test: `browser-hud.mjs` (komputer + telefon) |
| 6.3 | Waluta: tix | „zł”/„złoto” → tix wszędzie (rekrutacja, skrzynie, Skarbiec, stare zapisy); pasek „40 tix · 0 odł. · 40 drewna · 500 m liny” | `expedition.ts`, `main.ts`, `wayfarers.ts`, `bestiary.ts`, `index.html` | Zapis: przemianowanie pola z migracją, wartości bez zmian |
| 6.3 ✔ | **Wykonane 08.11.2026** | Wszystkie widoczne „zł”/„złoto” → tix (pasek, Skarbiec, oferta rekrutacji, skrzynie wyziewów, złodziej, kradzież). Pola zapisu (`coins`, `gold`) bez zmian, więc stare zapisy działają bez migracji | | |
| 6.4 | Tabela łupów + VFX | Zwierzęta: tix i materiały (skóry, kły), nigdy broń/pancerz; humanoidy: broń i pancerz. Wypadanie łukiem z odbiciem; monety tix po 0,4 s lecą do postaci, licznik pulsuje; aury rzadkości (krąg + iskry / słup / wyższy słup, zwolnienie i dźwięk); cenne przedmioty podnosi się podejściem z błyskiem | `bestiary.ts`, `main.ts`, `models.ts` | Nowe materiały: skóra, kieł (ikony tymczasowe z kodu) |
| 6.4 ✔ | **Wykonane 08.11.2026** | `loot.ts`: zwierzęta → tix + skóra (35%) / kieł (20%), elitarne obie, nigdy broń; humanoidy → broń/pancerz (słabi 25%, średni 35%, elitarni 100%, boss 2 szt. rzadkie+), rzadkość losowana wg rangi (moc +0/+2/+4/+7). W grze łup wyskakuje łukiem, odbija się raz i obraca; tix to kilka monet lecących po 0,4 s do postaci i do licznika (puls); pospolite rzeczy lecą same, cenne czekają na podejście i wpadają z błyskiem w kolorze rzadkości; aury: krąg + iskry / słup / wyższy słup + zwolnienie i własny dźwięk. Skrzynia wyziewu też wysypuje łup. Ramki rzadkości w plecaku. Łup na ziemi nie jest zapisywany (znika po odświeżeniu strony) | | Testy: `loot.mjs`, `browser-loot.mjs` |
| 6.5 | Kolory świata | Dachy terakota ~#C8643C, ściany kremowe, trawa ~#7DAA4A, drogi jasne i ciepłe; ciepłe światło z lewej góry, chłodne cienie, lekka okluzja w narożnikach; korekcja +15% nasycenia i trochę kontrastu | `world.ts`, `sky.ts`, `main.ts` | Mgła wojny i noc muszą dalej działać na nowych kolorach |
| 6.5 ✔ | **Wykonane 08.11.2026** | Paleta `WORLD_COLORS`: dachy terakota, ściany kremowe, trawa soczysta, drogi jasne i ciepłe, woda nasycona. Mapowanie tonów ACES (odbarwiało kolory) → Neutral; korekcja nasycenia wpisana w paletę zamiast osobnego filtra (taniej na telefonach). Ciepłe słońce z lewej, chłodniejsze cienie; ściany ciemnieją przy gruncie (okluzja). Naprawiony błąd: słońce i cienie były przypięte do środka mapy i znikały ~55 j. dalej — teraz idą za drużyną | | Zrzuty dzień/noc w work/terrain/ |

Kolejność: 6.1 → 6.2 → 6.3 → 6.4 → 6.5. Teren i HUD najbardziej zmieniają odczucie gry; tix przed lootem, bo loot pokazuje tix; kolory na końcu, żeby oceniać je na gotowym terenie.

## Etap 6b — Uwagi właściciela z 8 listopada (wieczór) — wykonane 08.11.2026

| Uwaga | Zmiana | Pliki |
|---|---|---|
| Atak ze strefy bezpiecznej jest za mocny | W strefie (obóz, pas liny, wnętrze pętli) cios tylko zbiera surowce i nikogo nie rani; Salwa/umiejętności broni się nie odpalają; towarzysze nie atakują ze strefy. Przycisk Atak blednie, komunikat „W strefie bezpiecznej nie walczysz” | `main.ts` |
| Wrogowie kręcą się za blisko obozu | Pas 50 m od granicy strefy bez punktów spotkań (potem 15% → 100% przy 300 m); bezczynni wrogowie trzymają się ~30 m od stref | `encounters.ts`, `main.ts` |
| Odradzanie 5× za szybkie | Odrodzenie w miejscu 30 s → 150 s; blokada punktu po zabiciu 45 s → 225 s | `main.ts` |
| Rekrutacja z dowolnego obozu | Jedna wspólna oferta dla całej sieci: widać ją i obsługuje się z każdego obozu; zatrudniony staje w obozie, w którym go przyjmujesz | `campaign.ts`, `expedition.ts` |
| Max 4 liny z jednego obozu | Limit przy „Rozciągnij linę” i przy łączeniu obozów | `travel.ts`, `expedition.ts` |
| Podróż po linach | Tapnięcie (klik) w dowolne miejsce liny: żółta strzałka na linie w stronę dalszego obozu, dymek z odległością i kosztem (100 tix/km, min. 1), ⇄ odwraca kierunek. Drużyna musi stać na tej linie lub przy jej obozie, poza walką i bez prowadzonej liny; płaci aktywna postać. Przejazd: krótka zasłona, wczytanie mapy przy celu, towarzysze obok | `travel.ts`, `expedition.ts`, `main.ts` |
| Gra „skacze” | Przyczyna: przebudowa całego świata co ~30 j. marszu (okno wysokości) i przy każdym nowym kaflu. Okno wysokości szersze (r 130) i przesuwane dopiero po 55 j.; przy rozstawianiu obozu i po przejeździe wczytuje się blok 5×5 kafli wokół obozu (trzymany, dopóki drużyna nie odejdzie ~4 kafle), a przebudowa dzieje się pod animacją (namiot wyrasta z ziemi, „Rozstawiam obóz…”) | `world.ts`, `main.ts`, `expedition.ts` |
| HUD | Wygląd z makiety: nasycone kolory, gruby ciemny obrys, bez mosiężnych ramek; niebieski półprzezroczysty joystick, duży czerwony Atak, żółty specjalny, fioletowy drugiej ręki, zielona Mikstura, pierścienie odnowienia; Akcja niebieska z etykietą „Rozstaw obóz” / „Połącz obozy” / „Otwórz obóz” (wyszarzona, gdy tu nie można); wskaźnik „Strefa bezpieczna” / „Dzicz” / „Walka” | `style.css`, `main.ts`, `expedition.ts` |

Testy: `scripts/tests/travel.mjs` (limit lin, koszt, kierunek, jazda tylko z liny, wspólna oferta), `frontier.mjs` (pas 50 m), `browser-terrain.mjs` (przebudowa po 60 j.). Przebieg lina → obóz → tapnięcie w linę → przejazd sprawdzony w emulacji telefonu poziomo (zrzuty w `work/rope/`). Do strojenia: koszt 100 tix/km, szerokość pasa 50 m, czasy odrodzenia.

## Etap 7 — AFK

1. Zajęcia Wędrowców w obozie (jedno tapnięcie): trening (powolne XP) albo wyprawa 1/4/8 h. Wyprawa wraca z lootem i surowcami z biomu obozu, nie da się na niej zginąć, najlepszy loot zostaje dla aktywnej walki.
2. Produkcja AFK ok. 10% aktywnej gry: stałe stawki skalibrowane z typowego tempa zbierania; Skarbiec z limitem 8–12 h (dziś 10 h).
3. Obóz żyje: postacie obozowe w pętli przy ognisku (tymczasowe animacje z brył), zielarz robi mikstury z ziół.
4. Ekran „Gdy cię nie było”: ikony i liczby dla każdego obozu i wyprawy, jeden przycisk „Zbierz”; pełny Skarbiec pulsuje na mapie.
5. Powiadomienia (Skarbiec pełny, wyprawa wróciła, kandydat), najwyżej 2 dziennie — patrz pytanie 4.

## Etap 8 — Kotwice i Kronika

1. Dane: skrypt (workflow GitHub) wyciąga zabytki z tagiem wikidata i typem zabytku, przypisuje gminę (admin_level=8), zapisuje małe pliki na kwadrat mapy. Najpierw Lublin i okolice, cały świat (plik ~80 GB) dopiero później.
2. W grze: obrys budynku Kotwicy (niezdobyta / zdobyta), ikona zwrócona do kamery, zdobycie po dojściu.
3. Punktacja: 100/30/10/5 wg kolejności w mieście × mnożnik odległości od startu; komplet miasta (min. 3) = odznaka + 20 pkt/Kotwicę, max 10.
4. Kronika: album zdobytych Kotwic z krótkimi opisami (PL/EN).

## Później (po sprawdzeniu pętli)

Sezony i Przypływ Mgły, ranking (jedna tabela), na końcu monetyzacja: tylko wygląd i wygoda.

## Pytania do właściciela

Rozstrzygnięte 07.11.2026: mapa z archiwum erpeg (bezpiecznie, tylko odczyt, Overpass jako zapas), praca na PR #1, buty zostają (5 slotów).

1. **Grafika voxel chibi** — czekamy na ilustracje grafika (wojownik jako wzorzec). Do tego czasu zostają modele z brył.
2. **CORS** — kubełek R2 erpeg musi dopuszczać adres, pod którym działa ROPExpanse; inaczej gra użyje zapasowego Overpass.
3. **Teren (08.11.2026)** — sekcja „Teren i kamera” w dokumencie nadal opisuje tarasy voxelowe, a przegląd z 8 listopada chce łagodnych fal. Przyjmuję nowszy przegląd; sekcję „Teren” warto poprawić w dokumencie.
4. **Powiadomienia AFK** — na stronie/PWA powiadomienie przy zamkniętej grze wymaga serwera wysyłającego (Web Push), a dokument zakłada brak serwera. Propozycja: na razie znaczniki w grze i ekran „Gdy cię nie było”, prawdziwe powiadomienia razem z aplikacją natywną albo małym serwerem.
5. **Tix** — czy tix zastępuje też „Złoto” w tabeli Surowce i czy po angielsku też „tix”? Przyjmuję: tak i tak.
6. **Gałąź** — plan leży na `ccr-df7caf8e-cfao1s` (z `feat/camps-world`). Podgląd na GitHub Pages publikuje tylko `main` i `feat/camps-world`; do wypchnięcia poprawek na PR #1 potrzebna zgoda.
