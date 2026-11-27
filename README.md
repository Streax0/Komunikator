# Baśka Message

**Baśka Message** is a web-based messaging app built with PHP and MariaDB/MySQL.
It currently includes account registration and login, plus an early version of
the application interface.

![Baśka Message logo](logo.png)

> **Project status:** This project is unfinished and under active development.
> One-to-one text chat uses WebRTC data channels with PHP/MySQL polling for
> connection setup. Messages are not stored; the project is not ready for
> production use.

## Contents

- [Polski](#polski)
- [English](#english)

---

## Polski

### Funkcje

- Rejestracja użytkownika z walidacją formularza i unikalnym adresem e-mail.
- Logowanie e-mailem i hasłem; hasła są haszowane przez `password_hash()` i
  sprawdzane przez `password_verify()`.
- Ochrona głównej strony i ustawień przez sesję oraz wylogowywanie.
- Tworzenie pokoi i zapisywanie ich kodów w bazie danych.
- Jednoosobowy czat tekstowy P2P przez WebRTC; wiadomości nie są zapisywane.
- [Opis działania skryptów czatu P2P](./OPIS-CZATU-P2P.md).
- Responsywne widoki logowania i rejestracji.
- Ustawienia są nadal w trakcie rozwoju.

### Technologie

- PHP 8 lub nowszy, z rozszerzeniem `mysqli`
- MariaDB 10.4+ lub MySQL 8+
- Apache (np. z XAMPP), HTML, CSS i JavaScript

### Uruchomienie lokalne

1. Sklonuj repozytorium i przejdź do katalogu projektu:

   ```bash
   git clone https://github.com/Streax0/Komunikator.git
   cd Komunikator
   ```

2. Uruchom Apache i MySQL/MariaDB, np. z panelu XAMPP.
3. W phpMyAdmin utwórz bazę `message_database`, a następnie zaimportuj
   [`baza.sql`](baza.sql). Skrypt tworzy tabele `uzytkownicy` i `pokoje`.
4. Zaimportuj również [`db/p2p.sql`](db/p2p.sql), aby utworzyć tabele
   uczestników pokoi i sygnalizacji WebRTC. Przy istniejącej bazie importuj
   tylko ten plik — nie importuj ponownie całego `baza.sql`.
5. Umieść katalog projektu w katalogu dokumentów Apache, np.
   `C:\xampp\htdocs\Komunikator`.
6. Otwórz `http://localhost/Komunikator/`.

Możesz też wejść bezpośrednio na stronę rejestracji:
`http://localhost/Komunikator/rejestracja.php`.

### Pierwsze użycie

Utwórz konto, podając e-mail, imię, nazwisko, datę urodzenia i hasło (co
najmniej 8 znaków, wpisane dwukrotnie). Następnie zaloguj się na
`http://localhost/Komunikator/logowanie.php`.

### Konfiguracja bazy danych

Ustawienia połączenia znajdują się obecnie bezpośrednio w
[`db/db.php`](db/db.php):

```php
$host = "localhost";
$username = "root";
$password = "";
$dbname = "message_database";
```

Zmień je zgodnie z lokalną konfiguracją MySQL/MariaDB. Chociaż `.env` jest
wykluczony z Gita, aplikacja **nie wczytuje obecnie zmiennych środowiskowych**
ani pliku `.env`. Nie wpisuj haseł produkcyjnych do kodu ani do repozytorium;
przed wdrożeniem skonfiguruj bezpieczne zarządzanie sekretami i HTTPS.

### Struktura projektu

```text
Komunikator/
├── db/                 # Połączenie z bazą i strona błędu bazy
├── scripts/            # Skrypty JavaScript
├── styles/             # Arkusze stylów
├── baza.sql            # Schemat bazy danych
├── index.php           # Główny widok po zalogowaniu
├── logowanie.php       # Logowanie
├── rejestracja.php     # Rejestracja
├── settings.php        # Widok ustawień
└── wyloguj.php         # Wylogowanie
```

### Kontrybucje i testowanie

Kontrybucje są mile widziane. Przed zgłoszeniem zmian:

1. Utwórz branch dla swojej zmiany.
2. Opisz zakres i sposób ręcznego sprawdzenia w pull requeście.
3. Sprawdź dotknięte ścieżki w lokalnym środowisku PHP i MySQL/MariaDB.
   W szczególności sprawdź rejestrację, logowanie, dostęp do stron wymagających
   sesji oraz wylogowanie, jeśli zmiana ich dotyczy.

Automatyczne testy jednostkowe, integracyjne i **E2E są planowane**, ale nie są
jeszcze skonfigurowane w repozytorium. Nie przedstawiaj ich jako obecnie
dostępnych ani nie zakładaj, że istnieje automatyczna kontrola CI.

### Planowane prace

- Wysyłanie, odbieranie i historia wiadomości.
- Czaty prywatne i grupowe oraz aktualizacje w czasie rzeczywistym.
- Dokończenie ustawień i funkcji konta.
- Testy automatyczne, w tym E2E, oraz CI.
- Bezpieczna konfiguracja środowiskowa przed wdrożeniem.

### Licencja

Repozytorium nie określa jeszcze licencji. Ustal i dodaj licencję przed
ponownym wykorzystaniem lub dystrybucją projektu.

---

## English

### Features

- User registration with form validation and unique email addresses.
- Email-and-password login; passwords are hashed with `password_hash()` and
  checked with `password_verify()`.
- Session-protected main and settings pages, plus logout.
- Room creation with room codes saved in the database.
- One-to-one P2P text chat using WebRTC; messages are not stored.
- [Explanation of the P2P chat scripts](./OPIS-CZATU-P2P.md).
- Responsive login and registration screens.
- Settings are still under development.

### Tech stack

- PHP 8 or later with the `mysqli` extension
- MariaDB 10.4+ or MySQL 8+
- Apache (for example, through XAMPP), HTML, CSS, and JavaScript

### Local setup

1. Clone the repository and enter the project directory:

   ```bash
   git clone https://github.com/Streax0/Komunikator.git
   cd Komunikator
   ```

2. Start Apache and MySQL/MariaDB, for example from the XAMPP Control Panel.
3. In phpMyAdmin, create a database named `message_database`, then import
   [`baza.sql`](baza.sql). The script creates the `uzytkownicy` and `pokoje`
   tables.
4. Also import [`db/p2p.sql`](db/p2p.sql) to create the room-participant and
   WebRTC signaling tables. If the database already exists, import only this
   file—do not re-import all of `baza.sql`.
5. Place the project directory in Apache's document root, for example
   `C:\xampp\htdocs\Komunikator`.
6. Open `http://localhost/Komunikator/`.

You can also open the registration page directly:
`http://localhost/Komunikator/rejestracja.php`.

### First use

Create an account with your email address, first and last name, date of birth,
and password (at least 8 characters, entered twice). Then sign in at
`http://localhost/Komunikator/logowanie.php`.

### Database configuration

Connection settings are currently defined directly in
[`db/db.php`](db/db.php):

```php
$host = "localhost";
$username = "root";
$password = "";
$dbname = "message_database";
```

Update them to match your local MySQL/MariaDB setup. Although `.env` is
excluded from Git, the application **does not currently load environment
variables or a `.env` file**. Do not put production credentials in source code
or the repository; configure secure secret management and HTTPS before
deployment.

### Project structure

```text
Komunikator/
├── db/                 # Database connection and database error page
├── scripts/            # JavaScript
├── styles/             # Stylesheets
├── baza.sql            # Database schema
├── index.php           # Main view after login
├── logowanie.php       # Login
├── rejestracja.php     # Registration
├── settings.php        # Settings view
└── wyloguj.php         # Logout
```

### Contributing and testing

Contributions are welcome. Before submitting a change:

1. Create a branch for your change.
2. Describe the scope and how you checked it manually in the pull request.
3. Test the affected paths in a local PHP and MySQL/MariaDB environment.
   For relevant changes, check registration, login, access to session-protected
   pages, and logout.

Automated unit, integration, and **E2E tests are planned**, but are not yet
configured in this repository. Do not describe them as currently available or
assume automated CI checks are in place.

### Planned work

- Sending, receiving, and storing message history.
- Private and group chats, with real-time updates.
- Completing account and settings features.
- Automated tests, including E2E, and CI.
- Secure environment-based configuration before deployment.

### License

No license has been specified in this repository yet. Choose and add a license
before reusing or distributing the project.
