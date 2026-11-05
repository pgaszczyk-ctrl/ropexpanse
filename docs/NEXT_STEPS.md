# Następne kroki po rozszerzeniu obozów

## Wykonane

Obozy i połączenia liną, kontekstowa akcja, prawdziwe przedmioty i wyposażenie, skarbiec, rekrutacja oraz wiele postaci. Wersjonowany zapis i kontrola własności. Geograficzne strumieniowanie OSM z ograniczonym cache, współrzędnymi świata i powtarzalną generacją spotkań. Docelowy zakres geograficzny obejmuje świat; dane są pobierane fragmentami.

## Wymagane sprawdzenie grywalnej bety

1. Uruchomić pełne `npm run test:browser` w środowisku z działającym Chromium/SwiftShader. W obecnej sesji instalacja przeglądarki jest zablokowana niepoprawnym pobranym archiwum; cloud browser nie ma działającego WebGL.
2. Na fizycznym telefonie sprawdzić renderowanie, położenie joysticka, równoczesny ruch/atak, czytelność obozu i brak nakładania HUD.
3. Sprawdzić rzeczywisty Overpass z hostingu, zmianę miasta, przejście między kaflami i wznowienie po odłączeniu internetu. W tej sesji usługa nie odpowiedziała poprawnie; testy sieci mają kontrolowane odpowiedzi.
4. Przejść jedną pełną pętlę: wyposażyć postać → walczyć → skarbiec → obejść budynek z liną → założyć obóz → wystawić ofertę → zatrudnić → przełączyć postać → ponownie otworzyć grę.
5. Zmierzyć rzeczywiste tempo awansów i dostroić `campaign.ts` oraz spotkania. Zmiana krzywej jest wdrożona, docelowe czasy awansu pozostają hipotezą.

## Przed otwartą produkcją

Własny serwer kafli/cache lub zakontraktowany dostawca OSM, zamiast uzależnienia od publicznego endpointu. Następnie transport między regionami, pełniejsze obszary wodne/wybrzeża i ewentualna synchronizacja zapisów. Nie dodawać gospodarki MMO ani usług kont przy okazji naprawy obecnej pętli.
