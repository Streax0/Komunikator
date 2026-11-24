# Komunikator Message

**Komunikator Message** to lekka aplikacja webowa stworzona w PHP i MariaDB/MySQL. Projekt zawiera ekran logowania i rejestracji oraz podstawowy interfejs aplikacji po zalogowaniu.

![Logo aplikacji](logo.png)

## Funkcje

- rejestracja użytkownika z walidacją formularza,
- logowanie za pomocą adresu e-mail i hasła,
- bezpieczne haszowanie haseł przez `password_hash()`,
- sprawdzanie danych logowania przez `password_verify()`,
- ochrona stron wymagających sesji,
- wylogowywanie użytkownika,
- responsywne strony logowania i rejestracji,
- podgląd interfejsu głównego i ustawień.

> Obecna wersja jest prototypem. Panele czatu i ustawień to głównie interfejsy demonstracyjne; wysyłanie i pobieranie wiadomości nie jest jeszcze zaimplementowane.

## Technologie

- PHP 8+
- MariaDB lub MySQL
- rozszerzenie PHP `mysqli`
- HTML5 i CSS3
- JavaScript

## Wymagania

- PHP 8 lub nowszy,
- MariaDB 10.4+ lub MySQL 8+,
- Apache lub inny serwer obsługujący PHP,
- XAMPP — opcjonalnie, aby uruchomić projekt w środowisku Windows.

## Instalacja lokalna

### 1. Pobierz repozytorium

```bash
git clone https://github.com/Streax0/Komunikator.git
cd Komunikator
```

### 2. Uruchom serwer i bazę danych

Uruchom Apache oraz MySQL/MariaDB, na przykład z panelu XAMPP.

### 3. Utwórz bazę danych

W phpMyAdmin utwórz bazę o nazwie:

```text
message_database
```

Następnie zaimportuj plik [`baza.sql`](baza.sql).

Plik tworzy tabelę `uzytkownicy` z danymi: identyfikatorem, imieniem, nazwiskiem, datą urodzenia, hasłem oraz adresem e-mail.

### 4. Skonfiguruj połączenie z bazą

Domyślne ustawienia są zdefiniowane w [`db/db.php`](db/db.php):

```php
$username = "root";
$password = "";
$dbname = "message_database";
$host = "localhost";
```

Zmień dane według konfiguracji lokalnego serwera MySQL/MariaDB.

### 5. Umieść projekt w katalogu serwera

W typowej instalacji XAMPP skopiuj katalog projektu do:

```text
C:\xampp\htdocs\Komunikator
```

Na stronie uruchom:

```text
http://localhost/Komunikator/
```

Alternatywnie w Windows możesz uruchomić [`uruchom-xampp.bat`](uruchom-xampp.bat). Skrypt wykrywa typowe lokalizacje XAMPP i dodaje Alias Apache `/komunikator`.

## Użytkowanie

1. Otwórz stronę rejestracji:
   `http://localhost/Komunikator/rejestracja.php`
2. Podaj adres e-mail, imię, nazwisko i hasło.
3. Zaloguj się na stronie:
   `http://localhost/Komunikator/logowanie.php`
4. Po poprawnym logowaniu zostaniesz przekierowany do `index.php`.

Hasło musi mieć co najmniej 8 znaków, a adres e-mail musi być unikalny.

## Struktura projektu

```text
Komunikator/
├── db/
│   └── db.php                 # Połączenie z bazą danych
├── scripts/
│   └── index.js               # Skrypt strony głównej
├── styles/
│   ├── style.css              # Strona po zalogowaniu
│   ├── login.css              # Formularz logowania
│   ├── register.css           # Formularz rejestracji
│   └── ustawienia.css         # Widok ustawień
├── baza.sql                   # Zrzut bazy MariaDB/MySQL
├── index.php                  # Strona główna po zalogowaniu
├── logowanie.php              # Logowanie
├── rejestracja.php            # Rejestracja
├── settings.php               # Ustawienia
├── wyloguj.php                # Wylogowanie
└── uruchom-xampp.bat          # Konfiguracja Apache w XAMPP
```

## Bezpieczeństwo i konfiguracja

- Nie commituj prawdziwego hasła do pliku [`db/db.php`](db/db.php) ani danych produkcyjnej bazy.
- Nie udostępniaj zrzutu bazy zawierającego dane użytkowników.
- Przed wdrożeniem należy dodać konfigurację środowiskową i ograniczenia sesji PHP.
- Najlepszym docelowym rozwiązaniem jest `php.ini` wraz z HTTPS, ale w środowisku lokalnym `session.cookie_secure` należy włączyć dopiero po konfiguracji HTTPS.

## Możliwe kierunki rozwoju

- wysyłanie i historia wiadomości,
- czaty prywatne i grupowe,
- komunikacja w czasie rzeczywistym przez WebSocket lub Server-Sent Events,
- odzyskiwanie i zmiana hasła,
- edycja profilu i ustawień,
- listy znajomych i statusy obecności,
- powiadomienia,
- kontrola sesji i zmiana mechanizmu połączenia z bazą,
- testy automatyczne i wdrożenie CI.

## Licencja

W repozytorium nie określono jeszcze licencji. Przed ponownym wykorzystaniem, dystrybucją lub rozprowadzeniem projektu należy ustalić i dodać odpowiednią licencję.
