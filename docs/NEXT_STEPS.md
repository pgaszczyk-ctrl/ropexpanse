# Pierwszy etap: dziesięć dobrych minut

## 1. Sprawdzić bazę na rzeczywistym telefonie

Uruchom prywatny podgląd przez HTTPS. Potwierdź obraz, drążki, pełny ekran i czytelność HP. Na komputerze potwierdź zachowanie dotychczasowego czucia walki. Testy emulacji są pomocnicze. To pierwszy punkt, zanim rozbudujemy grę.

## 2. Domknąć jedną wyprawę

Mały obszar Lublina: schronienie → pobliski hunt wilków → silniejszy przeciwnik → powrót z łupem → sprzedaż lub użycie zdobyczy. Obecny cel „pokonaj 6” jest placeholderem. Gracz powinien wiedzieć po co wychodzi, co zdobył i co może spróbować zrobić dalej.

Do wykonania: kilka rzeczywistych przedmiotów, prosty plecak, jeden sprzedawca, czytelna informacja o łupie i ograniczona progresja. Szansa rzadkiego dropu i wartość ekonomiczna wymagają dostrojenia; nie obiecuj ulepszenia po każdej dziesięciominutowej sesji.

## 3. Dodać drugi cel w tej samej okolicy

Opcjonalny silniejszy przeciwnik z czytelną zapowiedzią zagrożenia i konkretną zdobyczą. Lepsza broń daje odczuwalną, umiarkowaną przewagę; jej wpływ sprawdź w tej samej walce przed i po zmianie. Najpierw ustalić podstawę 10% kary XP i dopasować zapis.

## 4. Sprawdzić tożsamość oprawy

Zachowaj sylwetkę wilków. Zaproponuj nowy wygląd strażnika/łucznika i kilka odmian gracza. Na niewielkiej liczbie budynków sprawdź prefabrykaty dachów, kominów i mosiężnych detali z zachowaniem przejść i czytelności walki.

## Kryterium gotowości

Nowy gracz potrafi bez objaśnień rozpocząć wyprawę, walczyć, wrócić z łupem i wskazać następny cel. Sesja nie składa się z pustego marszu. Zamknięcie i ponowne otwarcie zachowuje postęp. Zebrane obserwacje z prawdziwych prób mają pierwszeństwo przed symulowanymi ankietami.

## Dopiero potem

Większy obszar, sensowny model podróży, kolejne lokalne historie i biomy. Backend, konta, handel, rankingi i monetyzacja dopiero po sprawdzeniu podstawowej pętli.

## Bieżący stan interfejsu (23.10.2026)

Wykonano pierwszy HUD steampunk inspirowany starym EXP-LORE: mosiężne obramowania, nity, ciemne szkło, portret z pierścieniem XP, czerwone HP, wektorowe ikony broni, mikstury i cięcia. Funkcje walki pozostają dotychczasowe. Kolejna ocena: użytkownik sprawdza czytelność i charakter GUI na komputerze oraz rzeczywistym telefonie. Nadal otwarty jest test renderowania na jego Androidzie.

## Mobilny HUD (08.11.2026)

Mosiężny HUD zastąpiono mobilnym układem w stylu czytelnych gier arenowych: nasycone kolory, duże ikony, gruby ciemny obrys, bez złotych ramek. Mechaniki walki bez zmian.

- Lewy górny róg: mały awatar z pierścieniem XP i poziomem; otwiera kartę postaci (pauzuje grę jak menu).
- Pasek HP w HTML przypięty nad postacią (zastąpił pasek 3D bohatera; paski wrogów bez zmian).
- Górna krawędź: liczniki odłamków i złota, wskaźnik strefy (Strefa bezpieczna / Dzicz / Walka), skrócony cel.
- Prawy górny róg: przełącznik Miecz/Magia, pauza, menu (dźwięk i pełny ekran przeniesiono do menu).
- Lewy dół: półprzezroczysty niebieski joystick. Prawy dół: duży czerwony Atak (przeciągnięcie nadal celuje), żółta Salwa (dawne „Cięcie”) i zielona Mikstura z pierścieniami odnowienia.
- Miejsce nad grupą bojową i po lewej nad joystickiem zostawiono na przycisk Akcja i dymki łupu.

Otwarte: w tym repo nie ma jeszcze liny, palików, obozów, drewna ani przedmiotów z rzadkością. Przycisk Akcja, liczniki drewna/liny, dymki łupu i legendarną kartę wdrożyć, gdy te mechaniki będą w kodzie lub zostaną ustalone ich zasady. Wygląd sprawdzono w emulacji telefonu poziomo (844×390) i na komputerze; test na fizycznym telefonie nadal do wykonania.
