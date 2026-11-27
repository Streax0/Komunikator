# Czat P2P — objaśnienie kodu linia po linii

Ten dokument objaśnia aktualne wersje skryptów. Numery odnoszą się do numerów
wierszy w plikach. Puste wiersze pomijam; otwierające i zamykające nawiasy
klamrowe wskazują początek i koniec opisanego bloku.

## `scripts/room.js`

### Widok i elementy strony

- **1–15** — `roompage` przechowuje HTML w pokoju. Element `.room` wyświetla
  kod, a formularz pod nim zawiera status, listę wiadomości i pole tekstowe.
  Identyfikatory `p2p-status`, `p2p-messages`, `p2p-chat-form` i
  `p2p-message` są później używane przez `peer.js`.
- **17** — wyszukuje główny element `<main>`, do którego skrypt wstawi widok
  pokoju.
- **18–21** — pobiera z HTML przyciski tworzenia/dołączania, pole kodu oraz
  pole statusu. Dzięki temu kod JavaScript może reagować na kliknięcia i
  zmieniać tekst na stronie.

### Tworzenie pokoju

- **23** — uruchamia funkcję asynchroniczną po kliknięciu przycisku tworzenia.
- **24** — generuje nowy kod pokoju.
- **25** — wysyła do PHP akcję `create` i kod; `await` czeka na odpowiedź.
- **27** — sprawdza, czy odpowiedź istnieje i czy PHP potwierdziło sukces.
- **28** — pokazuje widok pokoju i uruchamia przygotowanie połączenia P2P.
- **29** — wyświetla informację, że pokój czeka na drugiego użytkownika.
- **30–32** — gdy utworzenie się nie uda, pokazuje komunikat błędu.
- **33** — kończy obsługę kliknięcia.

### Dołączanie do pokoju

- **35** — uruchamia obsługę przycisku dołączania.
- **36** — pobiera kod z pola, usuwa białe znaki na brzegach i zamienia litery
  na wielkie.
- **37–40** — sprawdza, czy kod ma dokładnie osiem wielkich liter lub cyfr.
  Przy nieprawidłowym kodzie wyświetla komunikat i kończy tę funkcję przez
  `return`.
- **42** — wysyła PHP akcję `join` wraz z wpisanym kodem.
- **43–45** — po sukcesie pokazuje pokój, po czym informuje o rozpoczęciu
  łączenia.
- **46–48** — pokazuje komunikat, gdy PHP odrzuci dołączenie.
- **49** — kończy obsługę kliknięcia.

### Wyświetlenie pokoju i komunikacja z PHP

- **51** — definiuje funkcję pokazującą pokój.
- **52** — wstawia zapisany wcześniej HTML do `<main>`.
- **53** — wpisuje kod zwrócony przez PHP do elementu `room-code`.
- **54** — przekazuje odpowiedź PHP do funkcji `startP2PChat` z `peer.js`.
- **55** — kończy funkcję wyświetlającą pokój.
- **57** — definiuje asynchroniczną funkcję wysyłającą żądanie do PHP.
- **58–59** — rozpoczyna blok obsługi błędów i wysyła żądanie do
  `scripts/room.php`.
- **60–64** — ustawia metodę `POST`, treść żądania jako JSON i nagłówek
  informujący PHP o formacie JSON.
- **65** — zamyka konfigurację żądania `fetch`.
- **66** — odczytuje odpowiedź PHP jako JSON.
- **67–69** — jeśli HTTP zwrócił błąd, zgłasza wyjątek z komunikatem PHP.
- **70** — zwraca prawidłową odpowiedź do miejsca, które wywołało funkcję.
- **71–74** — przechwytuje błąd, zapisuje go w konsoli i zwraca `null`.
- **75** — kończy funkcję wysyłającą żądanie.

### Generowanie kodu

- **77** — definiuje funkcję tworzącą kod pokoju.
- **78** — ustala dozwolone znaki kodu.
- **79** — tworzy tablicę ośmiu losowych bajtów.
- **80** — wypełnia ją losowością z przeglądarkowego API `crypto`.
- **81** — zamienia bajty na znaki z listy i łączy je w jeden ciąg.
- **82** — kończy funkcję.

## `scripts/room.php`

### Początek żądania i walidacja

- **1–2** — rozpoczyna PHP i deklaruje, że odpowiedź będzie JSON-em w UTF-8.
- **4–6** — uruchamia sesję, jeśli jeszcze nie została uruchomiona.
- **8–13** — `roomResponse` ustawia kod HTTP, zwraca dane JSON i kończy
  skrypt. Jest używane przy sukcesach i błędach.
- **15–17** — blokuje żądanie, gdy sesja nie zawiera identyfikatora zalogowanego
  użytkownika; zwraca HTTP 401.
- **19** — odczytuje treść żądania wysłaną przez JavaScript i dekoduje JSON.
- **20–21** — pobiera z JSON-u akcję (`create` lub `join`) i kod pokoju.
- **23–25** — odrzuca akcję spoza dozwolonej listy.
- **27–29** — odrzuca kod, jeśli nie jest tekstem.
- **31** — usuwa białe znaki z kodu i zamienia go na wielkie litery.
- **32–34** — sprawdza, czy kod ma osiem znaków z dozwolonego zestawu.
- **36** — dołącza konfigurację połączenia z bazą.
- **38** — pobiera ID użytkownika z sesji i zamienia je na liczbę całkowitą.
- **39** — zapamiętuje, czy rozpoczęto transakcję; przy błędzie pozwala
  bezpiecznie ją cofnąć.

### Akcja `create`

- **41–43** — rozpoczyna blok obsługi operacji bazodanowych i transakcję.
- **45** — wybiera gałąź tworzenia pokoju.
- **46–49** — usuwa poprzedni pokój utworzony przez tego użytkownika.
  `?` i `bind_param` przekazują ID bez składania go bezpośrednio w SQL.
- **51–55** — zapisuje nowy kod i ID właściciela. Po `execute` pobiera
  wygenerowane przez bazę ID pokoju.
- **57–62** — dodaje właściciela jako uczestnika z rolą `host`.
- **64** — zatwierdza transakcję, czyli utrwala zmiany.
- **65–71** — zwraca do JavaScriptu sukces, ID i kod pokoju oraz rolę `host`.
  `peer_id` jest pusty, bo host jeszcze nie zna drugiego uczestnika.
- **73** — zamyka blok obsługi tworzenia.

### Akcja `join`

- **74–78** — szuka pokoju po kodzie i blokuje znaleziony wiersz na czas
  transakcji, aby dwa konta nie zajęły go równocześnie.
- **80–84** — jeśli kod nie istnieje, cofa transakcję i zwraca HTTP 404.
- **86–87** — zapisuje ID pokoju i ID jego właściciela do zmiennych.
- **89–93** — odrzuca próbę dołączenia właściciela do własnego pokoju.
- **95–101** — sprawdza, czy pokój ma już uczestnika z rolą `guest`.
- **103–107** — jeśli miejsce zajmuje inne konto, cofa transakcję i zwraca
  HTTP 409.
- **109–116** — jeśli miejsce jest wolne, zapisuje bieżącego użytkownika jako
  `guest`. Jeśli to samo konto dołącza ponownie, nie tworzy duplikatu.
- **118** — zatwierdza dołączenie.
- **119–125** — zwraca kod pokoju, jego ID, rolę `guest` i ID hosta. ID hosta
  będzie odbiorcą sygnałów WebRTC.

### Obsługa błędów bazy

- **126** — przechwytuje wyjątki `mysqli`.
- **127–129** — cofa rozpoczętą transakcję.
- **131** — zapisuje szczegóły techniczne w logu serwera.
- **132–134** — rozpoznaje konflikt unikalności i zwraca HTTP 409.
- **136** — dla pozostałych błędów zwraca ogólną odpowiedź HTTP 500.
- **137** — kończy blok PHP.

## `scripts/peer.js`

### Przygotowanie połączenia

- **1** — udostępnia funkcję `startP2PChat` na obiekcie `window`, aby mógł ją
  wywołać `room.js`.
- **2–5** — pobiera elementy statusu, listy wiadomości i formularza z HTML.
- **6** — odczytuje ID pokoju z odpowiedzi PHP.
- **7** — pobiera ID drugiego użytkownika; dla hosta początkowo go nie ma.
- **8** — ustawia początkowy numer ostatniego odebranego sygnału.
- **9–12** — tworzy zmienne sterujące pollingiem, zamknięciem połączenia,
  kanałem danych i kolejką kandydatów ICE.
- **13–16** — wykrywa brak obsługi WebRTC i wyświetla komunikat zamiast
  kontynuować.
- **18–20** — tworzy `RTCPeerConnection` i podaje publiczny serwer STUN.

### Funkcje pomocnicze interfejsu

- **22–24** — definiuje funkcję aktualizującą tekst statusu.
- **26–29** — definiuje obsługę błędu: zapisuje szczegóły w konsoli i pokazuje
  użytkownikowi ogólny komunikat.
- **31–36** — tworzy element listy wiadomości, wstawia tekst przez
  `textContent` i przewija listę do końca.
- **38–51** — przypisuje obsługę kanału danych: pokazuje status otwarcia
  i zamknięcia oraz wyświetla odebrane teksty.

### Wysyłanie i odbieranie sygnałów

- **53** — definiuje asynchroniczną funkcję wysyłającą sygnał do PHP.
- **54–56** — zgłasza błąd, jeśli nie ma ID drugiego użytkownika.
- **58–70** — wysyła do `signal.php` JSON zawierający akcję `send`, ID pokoju,
  odbiorcę, typ sygnału i jego dane.
- **71–74** — odczytuje odpowiedź i zgłasza błąd, gdy serwer zwróci
  niepowodzenie.
- **77–82** — dodaje kandydatów ICE, którzy przyszli zanim ustawiono zdalny
  opis połączenia.
- **84–88** — rozpoczyna obsługę odebranego sygnału i ustala ID nadawcy, jeśli
  host jeszcze go nie zna.
- **89–97** — host odbiera ofertę, ustawia opis zdalny, dodaje oczekujących
  kandydatów, tworzy odpowiedź i wysyła ją do gościa.
- **98–100** — gość odbiera odpowiedź hosta i ustawia ją jako opis zdalny.
- **101–107** — przetwarza sygnał ICE: dodaje kandydata od razu albo odkłada
  go do kolejki na później.
- **108** — kończy obsługę jednego sygnału.

### Odpytanie serwera o nowe sygnały

- **110–113** — definiuje polling; nie wykonuje równoległego zapytania i
  kończy działanie po zamknięciu strony.
- **115** — oznacza, że zapytanie jest w toku.
- **116–127** — wysyła do PHP żądanie `poll` z ID pokoju i numerem ostatniego
  odebranego sygnału.
- **128–131** — dekoduje odpowiedź i zgłasza błąd HTTP.
- **133–136** — przechodzi po odebranych sygnałach, aktualizuje ich numer i
  przekazuje je do `receiveSignal`.
- **137–138** — obsługuje błędy odpytywania.
- **139–145** — zawsze zwalnia blokadę pollingu i planuje następne pytanie po
  700 ms, o ile połączenie nie zostało zamknięte.

### Zdarzenia WebRTC i formularza

- **147–151** — po wygenerowaniu kandydata ICE wysyła go do drugiej osoby.
- **153–155** — po otrzymaniu kanału danych od hosta konfiguruje go tak samo
  jak kanał utworzony przez gościa.
- **157–163** — reaguje na stan połączenia; pokazuje przerwanie lub informację,
  że może być potrzebny TURN.
- **165–176** — obsługuje wysłanie formularza. Wiadomość jest wysłana tylko,
  gdy kanał jest otwarty; następnie pojawia się lokalnie i pole jest czyszczone.
- **178–181** — przy opuszczaniu strony zatrzymuje polling i zamyka połączenie.

### Oferta i role uczestników

- **183** — definiuje funkcję tworzącą ofertę.
- **184–185** — gość tworzy kanał danych i podpina do niego obsługę zdarzeń.
- **186–187** — tworzy ofertę WebRTC i ustawia ją jako lokalny opis.
- **188–191** — wysyła ofertę do hosta.
- **192** — informuje, że oferta została wysłana.
- **195–196** — gość rozpoczyna tworzenie oferty; błędy trafiają do `showError`.
- **197–199** — host zamiast tworzyć ofertę czeka na gościa.
- **201** — rozpoczyna polling sygnałów.
- **202** — kończy funkcję startującą czat.

## `scripts/signal.php`

### Sesja i wspólna walidacja

- **1–2** — rozpoczyna PHP i ustawia odpowiedź JSON.
- **4–6** — uruchamia sesję.
- **8–13** — `signalResponse` zwraca JSON z kodem HTTP i kończy obsługę żądania.
- **15–17** — wymaga zalogowanego użytkownika.
- **19** — dekoduje JSON z przeglądarki.
- **20–21** — pobiera akcję i sprawdza, czy ID pokoju jest liczbą całkowitą.
- **23–25** — odrzuca akcję inną niż `send` lub `poll` oraz błędne ID pokoju.
- **27** — dołącza plik połączenia z bazą.
- **29–40** — sprawdza, czy użytkownik należy do pokoju; w przeciwnym razie
  zwraca HTTP 403.

### Akcja `send`

- **43** — wybiera ścieżkę wysyłania sygnału.
- **44–46** — odczytuje ID odbiorcy, typ sygnału i jego dane.
- **48–51** — dopuszcza tylko innego uczestnika pokoju, typ `offer`, `answer`
  lub `ice` oraz dane w formie obiektu.
- **53–56** — zamienia dane na JSON i ogranicza ich rozmiar do 16 000 bajtów.
- **58–64** — sprawdza, czy zarówno nadawca, jak i odbiorca są uczestnikami
  tego samego pokoju.
- **66–68** — odrzuca odbiorcę spoza pokoju.
- **70** — przy wysyłaniu usuwa sygnały starsze niż doba.
- **72–77** — zapisuje sygnał w tabeli `sygnaly_p2p`.
- **79** — potwierdza zapis HTTP 201.

### Akcja `poll`

- **82–85** — odczytuje numer ostatniego odebranego sygnału i go waliduje.
- **87–92** — przygotowuje zapytanie o maksymalnie 50 nowszych sygnałów
  skierowanych do bieżącego użytkownika w tym pokoju.
- **93–95** — wykonuje zapytanie i przygotowuje pustą listę wyników.
- **97–104** — dla każdego rekordu tworzy element odpowiedzi z ID, nadawcą,
  typem i zdekodowanym JSON-em.
- **106** — zamyka zapytanie.
- **107** — zwraca listę sygnałów.
- **108–111** — przechwytuje błędy `mysqli`, zapisuje szczegóły w logu i
  zwraca ogólny błąd HTTP 500.

## `db/p2p.sql`

- **1–11** — tworzy tabelę `uczestnicy_pokoju`.
- **2** — przechowuje ID pokoju.
- **3** — przechowuje ID użytkownika.
- **4** — rozróżnia rolę `host` i `guest`.
- **5** — automatycznie zapisuje czas dołączenia.
- **6** — para pokoju i użytkownika jest kluczem głównym, więc ten sam
  użytkownik nie może być dwa razy w jednym pokoju.
- **7** — ogranicza pokój do jednego hosta i jednego gościa.
- **8** — dodaje indeks wyszukiwania po użytkowniku.
- **9–10** — łączą uczestników z pokojami i kontami; usunięcie pokoju lub
  konta usuwa również powiązany wpis uczestnika.
- **11** — kończy definicję tabeli i wybiera silnik InnoDB.
- **13–26** — tworzy tabelę `sygnaly_p2p`, czyli tymczasową skrzynkę na dane
  negocjacji WebRTC.
- **14** — nadaje każdemu sygnałowi automatyczne ID.
- **15–17** — zapisuje pokój, nadawcę i odbiorcę.
- **18** — ogranicza typ sygnału do `offer`, `answer` albo `ice`.
- **19** — przechowuje dane sygnału jako tekst JSON.
- **20** — zapisuje czas utworzenia.
- **21–22** — definiuje klucz główny i indeks używany przez polling odbiorcy.
- **23–25** — tworzy relacje do pokoju, nadawcy i odbiorcy; powiązane sygnały
  są usuwane po usunięciu odpowiedniego rekordu.
- **26** — kończy definicję tabeli.

## Kolejność uruchamiania

[index.php](./index.php) wczytuje najpierw `peer.js`, a potem `room.js`.
Najpierw zaloguj się na jednym koncie i utwórz pokój, następnie otwórz drugą
przeglądarkę lub profil i zaloguj się na innym koncie. Host nie może dołączyć
do własnego pokoju. Dla istniejącej bazy zaimportuj [db/p2p.sql](./db/p2p.sql)
po utworzeniu tabel z `baza.sql`.
