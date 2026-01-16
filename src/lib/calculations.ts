import { Player, CalculationResults } from '@/types/player';

// Baza danych referencyjnych dla Z-scores (przykładowe dane)
// W rzeczywistej aplikacji powinny być bardziej szczegółowe
const referenceData: Record<number, {
  sprint10m: { mean: number; sd: number };
  sprint30m: { mean: number; sd: number };
  cod: { mean: number; sd: number };
}> = {
  15: { sprint10m: { mean: 1.85, sd: 0.12 }, sprint30m: { mean: 4.35, sd: 0.18 }, cod: { mean: 2.40, sd: 0.15 } },
  16: { sprint10m: { mean: 1.82, sd: 0.11 }, sprint30m: { mean: 4.28, sd: 0.17 }, cod: { mean: 2.35, sd: 0.14 } },
  17: { sprint10m: { mean: 1.80, sd: 0.10 }, sprint30m: { mean: 4.22, sd: 0.16 }, cod: { mean: 2.32, sd: 0.13 } },
  18: { sprint10m: { mean: 1.78, sd: 0.10 }, sprint30m: { mean: 4.18, sd: 0.15 }, cod: { mean: 2.28, sd: 0.12 } },
  19: { sprint10m: { mean: 1.76, sd: 0.09 }, sprint30m: { mean: 4.15, sd: 0.15 }, cod: { mean: 2.25, sd: 0.12 } },
};

/**
 * Oblicza wiek biologiczny na podstawie uproszczonej metody Maturity Offset
 * Bio age = calendar age + maturity offset
 */
export function calculateBioAge(calendarAge: number, height: number, weight: number): {
  bioAge: number;
  maturityOffset: number;
  category: string;
} {
  // Uproszczona aproksymacja - w rzeczywistości wymaga więcej parametrów
  // Dla "late bloomer" używamy stałej -0.7
  let maturityOffset: number;

  // Prosta heurystyka bazująca na proporcjach ciała
  const bmi = weight / ((height / 100) ** 2);
  const heightForAge = height / calendarAge;

  // Jeśli BMI niskie i wzrost względem wieku niski = late bloomer
  if (bmi < 20 && heightForAge < 10.5) {
    maturityOffset = -0.7;
  } else if (bmi > 23 && heightForAge > 11) {
    maturityOffset = 0.5; // early maturer
  } else {
    maturityOffset = -0.2; // average
  }

  const bioAge = calendarAge + maturityOffset;

  let category = 'Średni';
  if (maturityOffset < -0.5) category = 'Late Bloomer';
  else if (maturityOffset > 0.3) category = 'Early Maturer';

  return { bioAge, maturityOffset, category };
}

/**
 * Oblicza Peak Height Velocity na podstawie historii wzrostu
 */
export function calculatePHV(currentHeight: number, previousHeight?: number, monthsBetween: number = 6): number | undefined {
  if (!previousHeight || monthsBetween === 0) return undefined;

  // Tempo wzrostu w cm/rok
  const growthRate = ((currentHeight - previousHeight) / monthsBetween) * 12;

  // PHV to maksymalne tempo wzrostu - w praktyce potrzebujemy historii pomiarów
  // Tu zwracamy aktualne tempo jako aproksymację
  return growthRate;
}

/**
 * Oblicza dostępność zawodnika
 */
export function calculateAvailability(trainingDays: number, injuryDays: number): number {
  if (trainingDays === 0) return 0;
  return ((trainingDays - injuryDays) / trainingDays) * 100;
}

/**
 * Oblicza procent czasu spędzonego w sprincie
 */
export function calculateSprintPercentage(sprintMeters: number, totalDistance: number): number {
  if (totalDistance === 0) return 0;
  return (sprintMeters / totalDistance) * 100;
}

/**
 * Oblicza procent czasu gry
 */
export function calculatePlayingTimePercentage(minutesPlayed: number, matches: number, matchDuration: number = 90): number {
  if (matches === 0) return 0;
  const totalPossibleMinutes = matches * matchDuration;
  return (minutesPlayed / totalPossibleMinutes) * 100;
}

/**
 * Oblicza Z-score dla danego wyniku
 */
export function calculateZScore(value: number, mean: number, sd: number): number {
  if (sd === 0) return 0;
  return (value - mean) / sd;
}

/**
 * Pobiera dane referencyjne dla danego wieku
 */
function getReferenceData(bioAge: number) {
  const age = Math.round(bioAge);
  return referenceData[age] || referenceData[17]; // domyślnie 17 lat
}

/**
 * Interpretuje Z-score
 */
function interpretZScore(zScore: number): string {
  if (zScore > 1.5) return 'Znacznie powyżej średniej';
  if (zScore > 0.5) return 'Powyżej średniej';
  if (zScore > -0.5) return 'Średnia';
  if (zScore > -1.5) return 'Poniżej średniej';
  return 'Znacznie poniżej średniej';
}

/**
 * Główna funkcja obliczająca wszystkie parametry zawodnika
 */
export function calculatePlayerMetrics(player: Partial<Player>): Partial<CalculationResults> {
  const results: Partial<CalculationResults> = {};

  // 1. Wiek biologiczny
  if (player.wiekKalendarzowy && player.wzrost && player.waga) {
    const bioAgeResult = calculateBioAge(player.wiekKalendarzowy, player.wzrost, player.waga);
    results.wiekBiologiczny = bioAgeResult.bioAge;
    results.maturityOffset = bioAgeResult.maturityOffset;
  }

  // 2. PHV
  if (player.wzrost && player.wzrostPoprzedni) {
    results.phv = calculatePHV(player.wzrost, player.wzrostPoprzedni);
  }

  // 3. Dostępność
  if (player.dniTreningowe !== undefined && player.dniKontuzji !== undefined) {
    results.dostepnosc = calculateAvailability(player.dniTreningowe, player.dniKontuzji);
  }

  // 4. Procent sprintu
  if (player.sprintMetry !== undefined && player.dystans !== undefined) {
    results.procentSprintu = calculateSprintPercentage(player.sprintMetry, player.dystans);
  }

  // 5. Procent czasu gry
  if (player.minuty !== undefined && player.mecze !== undefined) {
    results.procentCzasu = calculatePlayingTimePercentage(player.minuty, player.mecze);
  }

  // 6. Z-scores dla testów motorycznych
  if (results.wiekBiologiczny) {
    const refData = getReferenceData(results.wiekBiologiczny);

    if (player.sprint10m) {
      // Dla czasu: niższy = lepszy, więc odwracamy znak
      results.zScore10m = -calculateZScore(player.sprint10m, refData.sprint10m.mean, refData.sprint10m.sd);
    }

    if (player.sprint30m) {
      results.zScore30m = -calculateZScore(player.sprint30m, refData.sprint30m.mean, refData.sprint30m.sd);
    }

    if (player.codLewy) {
      results.zScoreCodLewy = -calculateZScore(player.codLewy, refData.cod.mean, refData.cod.sd);
    }

    if (player.codPrawy) {
      results.zScoreCodPrawy = -calculateZScore(player.codPrawy, refData.cod.mean, refData.cod.sd);
    }
  }

  // 7. Ocena ogólna
  const avgZScore = [
    results.zScore10m,
    results.zScore30m,
    results.zScoreCodLewy,
    results.zScoreCodPrawy
  ].filter(z => z !== undefined).reduce((sum, z) => sum + (z || 0), 0) / 4;

  results.ocenaOgolna = interpretZScore(avgZScore);

  // 8. Sugestie treningowe
  results.sugestieTreningowe = generateTrainingSuggestions(player, results);

  return results;
}

/**
 * Generuje sugestie treningowe na podstawie danych i obliczeń
 */
function generateTrainingSuggestions(player: Partial<Player>, results: Partial<CalculationResults>): string[] {
  const suggestions: string[] = [];

  // Sugestie bazujące na maturity offset
  if (results.maturityOffset && results.maturityOffset < -0.5) {
    suggestions.push('Late bloomer - skup się na technice i taktyce, rozwój fizyczny nadejdzie później');
    suggestions.push('Priorytet: trening siłowy z własną masą ciała');
  } else if (results.maturityOffset && results.maturityOffset > 0.3) {
    suggestions.push('Early maturer - zwróć uwagę na kontrolę wagi i proporcje ciała');
  }

  // Sugestie bazujące na sprintach
  if (results.zScore10m && results.zScore10m < -0.5) {
    suggestions.push('Popraw przyspieszenie - trening pliometryczny i eksplozywność');
  }

  if (results.zScore30m && results.zScore30m < -0.5) {
    suggestions.push('Popraw maksymalną prędkość - treningi sprintowe 30-60m');
  }

  // Sugestie bazujące na zmianach kierunku
  if (results.zScoreCodLewy && results.zScoreCodPrawy) {
    const avgCod = (results.zScoreCodLewy + results.zScoreCodPrawy) / 2;
    if (avgCod < -0.5) {
      suggestions.push('Popraw zwinność - ćwiczenia ze zmianą kierunku i koordynacją');
    }

    if (Math.abs(results.zScoreCodLewy - results.zScoreCodPrawy) > 0.5) {
      suggestions.push('Asymetria w zmianach kierunku - praca nad słabszą stroną');
    }
  }

  // Sugestie bazujące na dostępności
  if (results.dostepnosc && results.dostepnosc < 80) {
    suggestions.push('Niska dostępność - praca prewencyjna, wzmocnienie i regeneracja');
  }

  // Sugestie bazujące na intensywności
  if (results.procentSprintu && results.procentSprintu > 12) {
    suggestions.push('Wysoka intensywność sprintów - monitoruj obciążenie i regenerację');
  } else if (results.procentSprintu && results.procentSprintu < 8) {
    suggestions.push('Niska intensywność sprintów - zwiększ wolumen pracy o wysokiej intensywności');
  }

  // Jeśli brak szczególnych uwag
  if (suggestions.length === 0) {
    suggestions.push('Kontynuuj obecny program treningowy');
    suggestions.push('Regularnie monitoruj postępy');
  }

  return suggestions;
}

/**
 * Generuje komentarze do raportu
 */
export function generateReportComments(player: Player, results: CalculationResults): string[] {
  const comments: string[] = [];

  if (player.dniKontuzji && player.dniKontuzji > 0) {
    comments.push(`Opuścił ${player.dniKontuzji} dni z powodu kontuzji`);
  }

  if (results.procentSprintu > 12) {
    comments.push('Wysoka wydajność fizyczna');
  }

  if (results.zScore10m && results.zScore10m > 1) {
    comments.push('Przyspieszenie powyżej średniej dla wieku biologicznego');
  }

  if (results.maturityOffset < -0.5) {
    comments.push('Late bloomer - potencjał wzrostu fizycznego');
  }

  return comments;
}
