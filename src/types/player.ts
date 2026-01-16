export interface Player {
  id: string;
  // Dane podstawowe
  imie: string;
  nazwisko: string;
  wiekKalendarzowy: number; // np. 17.5
  wiekBiologiczny?: number; // obliczany automatycznie
  pozycja: string; // np. "Napastnik", "Obrońca"
  wKlubieOd: number; // rok, np. 2015
  wyksztalcenie?: string;

  // Parametry fizyczne
  wzrost: number; // cm
  wzrostPoprzedni?: number; // do obliczania PHV
  waga: number; // kg
  wagaPoprzednia?: number;
  phv?: number; // Peak Height Velocity
  tkankaT

luszczowa?: number; // %

  // Statystyki boiskowe
  dniTreningowe?: number;
  dniKontuzji?: number;
  dostepnosc?: number; // % (obliczany)
  mecze?: number;
  minuty?: number;
  procentCzasu?: number; // % czasu gry (obliczany)
  dystans?: number; // metry
  sprintMetry?: number; // metry
  ocena?: string; // "Wystarczająco", "Dobrze", itp.

  // Testy motoryczne
  sprint10m?: number; // sekundy
  sprint30m?: number; // sekundy
  codLewy?: number; // Change of Direction - lewy
  codPrawy?: number; // Change of Direction - prawy
  ocenaKlubowa10m?: number; // 1-10
  ocenaKlubowa30m?: number; // 1-10

  // Z-scores (obliczane)
  zScore10m?: number;
  zScore30m?: number;
  zScoreCodLewy?: number;
  zScoreCodPrawy?: number;

  // Dodatkowe
  notatki?: string;
  dataUtworzenia: string;
  dataAktualizacji: string;
}

export interface PlayerFormData extends Omit<Player, 'id' | 'dataUtworzenia' | 'dataAktualizacji'> {}

export interface CalculationResults {
  wiekBiologiczny: number;
  maturityOffset: number;
  phv?: number;
  dostepnosc: number;
  procentSprintu: number;
  procentCzasu: number;
  zScore10m?: number;
  zScore30m?: number;
  zScoreCodLewy?: number;
  zScoreCodPrawy?: number;
  ocenaOgolna: string;
  sugestieTreningowe: string[];
}
