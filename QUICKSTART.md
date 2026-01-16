# Quick Start Guide - MotorPrep Analyzer

Ten przewodnik pomoże Ci szybko uruchomić aplikację MotorPrep Analyzer.

## Krok 1: Instalacja zależności

```bash
cd motor-prep-analyzer
npm install
```

Instalacja może potrwać kilka minut.

## Krok 2: Konfiguracja Firebase (wymagane)

### Opcja A: Pełna konfiguracja Firebase (zalecane dla produkcji)

1. Przejdź do [Firebase Console](https://console.firebase.google.com/)
2. Kliknij "Dodaj projekt"
3. Podaj nazwę projektu (np. "motor-prep-analyzer")
4. Postępuj zgodnie z instrukcjami (możesz wyłączyć Google Analytics)
5. Po utworzeniu projektu, kliknij ikonę `</>` (Web) aby dodać aplikację
6. Zarejestruj aplikację (nickname: "MotorPrep Web")
7. Skopiuj konfigurację Firebase (obiekt `firebaseConfig`)

#### Konfiguracja Firestore

1. W menu bocznym wybierz "Firestore Database"
2. Kliknij "Utwórz bazę danych"
3. Wybierz tryb produkcyjny ("production mode")
4. Wybierz lokalizację (np. "europe-west3" dla Europy)
5. Przejdź do zakładki "Reguły"
6. Skopiuj zawartość pliku `firestore.rules` z projektu

#### Konfiguracja Authentication

1. W menu bocznym wybierz "Authentication"
2. Kliknij "Get started"
3. Włącz "Anonymous" jako metodę logowania
4. (Opcjonalnie) Włącz "Email/Password" dla właściwych kont trenerów

#### Utwórz plik .env.local

```bash
cp .env.local.example .env.local
```

Edytuj `.env.local` i wklej swoje wartości z Firebase:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
```

### Opcja B: Szybki start bez Firebase (tylko na potrzeby testowania UI)

Jeśli chcesz tylko przetestować interfejs bez konfiguracji Firebase:

1. Utwórz plik `.env.local` z przykładowymi wartościami:
   ```bash
   cp .env.local.example .env.local
   ```

2. **UWAGA**: Dane nie będą zapisywane. Otrzymasz błąd przy próbie dodania zawodnika.

## Krok 3: Uruchomienie aplikacji

```bash
npm run dev
```

Aplikacja uruchomi się na `http://localhost:3000`

## Krok 4: Pierwsze użycie

1. Otwórz `http://localhost:3000` w przeglądarce
2. Kliknij "Dodaj zawodnika"
3. Wypełnij formularz podstawowych danych:
   - Imię: Jan
   - Nazwisko: Kowalski
   - Pozycja: Napastnik
4. Kliknij "Dodaj"
5. Kliknij na kartę zawodnika
6. Kliknij "Edytuj dane"
7. Uzupełnij wszystkie sekcje (możesz użyć przykładowych danych poniżej)
8. Kliknij "Zapisz"
9. Sprawdź automatycznie wygenerowany raport
10. Kliknij "Eksportuj PDF" aby pobrać raport

### Przykładowe dane testowe

**Dane podstawowe:**
- Imię: Jan
- Nazwisko: Kowalski
- Pozycja: Napastnik
- Wiek kalendarzowy: 17.2
- W klubie od: 2020

**Parametry fizyczne:**
- Wzrost: 178.5 cm
- Wzrost poprzedni: 176.0 cm
- Waga: 68.5 kg
- Waga poprzednia: 66.0 kg
- Tkanka tłuszczowa: 10.5%

**Statystyki boiskowe:**
- Dni treningowe: 150
- Dni kontuzji: 12
- Mecze: 18
- Minuty: 1320
- Dystans: 95000 m
- Sprint: 12000 m

**Testy motoryczne:**
- Sprint 10m: 1.78 s
- Sprint 30m: 4.15 s
- COD Lewy: 2.30 s
- COD Prawy: 2.28 s

**Notatki:**
```
Zawodnik wykazuje bardzo dobry postęp w parametrach fizycznych.
Wysoka dostępność treningowa. Kontuzja kostki w grudniu (10 dni).
Dynamiczny rozwój w II rundzie sezonu.
```

## Krok 5: Zbudowanie wersji produkcyjnej

```bash
npm run build
npm run start
```

Aplikacja produkcyjna uruchomi się na `http://localhost:3000`

## Rozwiązywanie problemów

### Błąd: "Cannot find module..."
```bash
rm -rf node_modules package-lock.json
npm install
```

### Błąd: "Firebase: Missing or insufficient permissions"
- Sprawdź czy reguły Firestore są poprawnie skonfigurowane
- Upewnij się, że Authentication > Anonymous jest włączone
- Sprawdź console przeglądarki pod kątem szczegółów błędu

### Błąd: "Failed to fetch"
- Sprawdź połączenie internetowe
- Sprawdź czy wartości w `.env.local` są poprawne
- Sprawdź czy Firebase projekt jest aktywny

### PDF nie generuje się
- Odśwież stronę i spróbuj ponownie
- Sprawdź console przeglądarki pod kątem błędów JavaScript
- Upewnij się, że przeglądarka nie blokuje pobierania plików

### Aplikacja jest wolna
- W trybie deweloperskim (`npm run dev`) aplikacja może być wolniejsza
- Użyj `npm run build && npm run start` dla lepszej wydajności
- Sprawdź połączenie internetowe (Firebase wymaga dostępu do sieci)

## Następne kroki

1. **Dodaj więcej zawodników** - Przetestuj aplikację z wieloma profilami
2. **Eksportuj raporty PDF** - Sprawdź jakość generowanych raportów
3. **Dostosuj kolory** - Edytuj `src/app/globals.css` aby dopasować do swoich preferencji
4. **Dodaj trenerów** - W Firebase Console > Authentication, dodaj konta dla innych trenerów
5. **Dostosuj normy** - Edytuj `referenceData` w `src/lib/calculations.ts` dla swoich grup wiekowych

## Pomoc i wsparcie

- Przeczytaj pełną dokumentację w `README.md`
- Sprawdź przewodnik dla programistów w `CLAUDE.md`
- W razie problemów, sprawdź console przeglądarki (F12)

## Ważne uwagi bezpieczeństwa

- **Nie udostępniaj** pliku `.env.local` nikomu
- **Nie commituj** `.env.local` do systemu kontroli wersji (Git)
- Regularnie **kopiuj backup** danych z Firebase Console
- Ustaw **silne hasła** dla kont trenerów w Firebase Authentication

---

**Powodzenia!** 🚀⚽
