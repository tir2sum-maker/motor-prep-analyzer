# MotorPrep Analyzer

Aplikacja webowa do monitorowania rozwoju zawodników piłki nożnej, analiz przygotowania motorycznego i generowania raportów mid-season.

## Funkcjonalności

- 📊 **Analiza biologiczna** - Obliczanie wieku biologicznego, Maturity Offset, PHV
- 🏃 **Testy motoryczne** - Sprint 10m/30m, COD (Change of Direction), Z-scores
- 📈 **Statystyki wydajności** - Dostępność, dystans, sprinty, obciążenie
- 📄 **Raporty PDF** - Profesjonalne raporty z wizualizacjami
- 🔥 **Firebase** - Przechowywanie danych w chmurze, współpraca wielu trenerów
- 📱 **Responsywny design** - Działa na desktopie i urządzeniach mobilnych

## Technologie

- **Frontend:** Next.js 14, React, TypeScript, Tailwind CSS
- **UI Components:** Radix UI, Lucide Icons
- **Backend:** Firebase (Firestore, Authentication)
- **PDF Export:** jsPDF, html2canvas
- **Wykresy:** Chart.js (opcjonalnie)

## Instalacja

### 1. Zainstaluj zależności

```bash
npm install
```

### 2. Konfiguracja Firebase

1. Utwórz projekt w [Firebase Console](https://console.firebase.google.com/)
2. Dodaj aplikację webową i skopiuj konfigurację
3. Utwórz plik `.env.local` na podstawie `.env.local.example`:

```bash
cp .env.local.example .env.local
```

4. Uzupełnij wartości w `.env.local` danymi z Firebase Console

### 3. Konfiguracja reguł Firestore

W Firebase Console > Firestore Database > Rules, ustaw:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /players/{playerId} {
      // Odczyt wymaga uwierzytelnienia
      allow read: if request.auth != null;
      // Zapis wymaga uwierzytelnienia
      allow write: if request.auth != null;
    }
  }
}
```

### 4. Uruchom aplikację

```bash
# Tryb deweloperski
npm run dev

# Build produkcyjny
npm run build

# Start produkcyjny
npm run start
```

Aplikacja będzie dostępna pod adresem `http://localhost:3000`

## Struktura projektu

```
motor-prep-analyzer/
├── src/
│   ├── app/                    # Strony Next.js (App Router)
│   │   ├── layout.tsx         # Główny layout
│   │   ├── page.tsx           # Dashboard - lista zawodników
│   │   └── player/[id]/       # Profil zawodnika
│   ├── components/            # Komponenty React
│   │   ├── ui/               # Podstawowe komponenty UI
│   │   ├── player-form.tsx   # Formularz danych zawodnika
│   │   ├── player-report.tsx # Raport zawodnika
│   │   └── stat-card.tsx     # Karta statystyki
│   ├── firebase/             # Konfiguracja Firebase
│   │   ├── config.ts         # Inicjalizacja Firebase
│   │   └── players.ts        # CRUD operacje na zawodnikach
│   ├── lib/                  # Biblioteki i utilities
│   │   ├── calculations.ts   # Obliczenia (Bio Age, Z-scores)
│   │   └── utils.ts          # Funkcje pomocnicze
│   └── types/               # TypeScript types
│       └── player.ts         # Typy dla zawodnika
├── public/                   # Pliki statyczne
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.js
```

## Użytkowanie

### Dodawanie zawodnika

1. Kliknij "Dodaj zawodnika" na stronie głównej
2. Wprowadź podstawowe dane (imię, nazwisko, pozycja)
3. Kliknij "Dodaj"

### Uzupełnianie danych

1. Kliknij na kartę zawodnika
2. Kliknij "Edytuj dane"
3. Uzupełnij wszystkie sekcje formularza:
   - Dane podstawowe
   - Parametry fizyczne
   - Statystyki boiskowe
   - Testy motoryczne
   - Notatki
4. Kliknij "Zapisz"

### Generowanie raportu

1. Otwórz profil zawodnika
2. Sprawdź automatycznie obliczone parametry
3. Kliknij "Eksportuj PDF" aby pobrać raport

## Wzory i obliczenia

### Wiek biologiczny (Bio Age)

```
Maturity Offset = uproszczona aproksymacja bazująca na BMI i wzroście
Bio Age = Wiek kalendarzowy + Maturity Offset
```

Kategorie:
- **Late Bloomer:** Maturity Offset < -0.5
- **Average:** -0.5 ≤ Maturity Offset ≤ 0.3
- **Early Maturer:** Maturity Offset > 0.3

### PHV (Peak Height Velocity)

```
PHV = (Wzrost obecny - Wzrost poprzedni) / Miesiące * 12
```

### Dostępność

```
Dostępność = (Dni treningowe - Dni kontuzji) / Dni treningowe * 100%
```

### Procent sprintu

```
% Sprintu = (Metry sprintu / Dystans całkowity) * 100%
```

### Z-Score (testy motoryczne)

```
Z-Score = -(Wynik zawodnika - Średnia dla bio-age) / Odchylenie standardowe
```

Nota: Znak minus, bo niższy czas = lepszy wynik

Interpretacja:
- **Z > 1.5:** Znacznie powyżej średniej
- **0.5 < Z ≤ 1.5:** Powyżej średniej
- **-0.5 ≤ Z ≤ 0.5:** Średnia
- **-1.5 ≤ Z < -0.5:** Poniżej średniej
- **Z < -1.5:** Znacznie poniżej średniej

## Współpraca wielu trenerów

Aplikacja wykorzystuje Firebase, co umożliwia:

1. **Centralne przechowywanie danych** - Wszyscy trenerzy widzą te same, aktualne dane
2. **Synchronizacja w czasie rzeczywistym** - Zmiany są natychmiast widoczne dla wszystkich
3. **Uwierzytelnianie** - Tylko autoryzowani użytkownicy mają dostęp do danych
4. **Historia zmian** - Firebase przechowuje metadane o utworzeniu i aktualizacji

### Dodawanie trenerów

1. W Firebase Console > Authentication
2. Dodaj nowych użytkowników (Email/Password)
3. Prześlij im dane logowania

## Dostosowanie

### Zmiana kolorystyki

Edytuj plik `src/app/globals.css` - sekcja `:root` zawiera wszystkie zmienne kolorów.

### Zmiana danych referencyjnych

Edytuj obiekt `referenceData` w pliku `src/lib/calculations.ts` aby dostosować wartości średnich i odchyleń standardowych dla różnych grup wiekowych.

### Dodanie nowych testów

1. Dodaj pola w `src/types/player.ts`
2. Dodaj pola formularza w `src/components/player-form.tsx`
3. Dodaj logikę obliczeń w `src/lib/calculations.ts`
4. Dodaj wyświetlanie w `src/components/player-report.tsx`

## Troubleshooting

### Firebase: "Missing or insufficient permissions"

- Sprawdź reguły Firestore w Firebase Console
- Upewnij się, że użytkownik jest zalogowany (domyślnie anonimowo)

### PDF nie generuje się poprawnie

- Sprawdź console przeglądarki pod kątem błędów
- Upewnij się, że element z id="player-report" istnieje
- Niektóre przeglądarki mogą blokować pobieranie plików

### Dane nie synchronizują się

- Sprawdź połączenie internetowe
- Sprawdź konfigurację Firebase w `.env.local`
- Sprawdź console przeglądarki pod kątem błędów

## Licencja

Projekt prywatny - wszystkie prawa zastrzeżone.

## Wsparcie

W razie problemów lub pytań, skontaktuj się z zespołem rozwoju aplikacji.
