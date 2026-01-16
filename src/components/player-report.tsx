'use client';

import { Player, CalculationResults } from '@/types/player';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatCard } from '@/components/stat-card';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { formatNumber } from '@/lib/utils';

interface PlayerReportProps {
  player: Player;
  calculations: CalculationResults;
  onExportPDF: () => void;
}

export function PlayerReport({ player, calculations, onExportPDF }: PlayerReportProps) {
  const getZScoreColor = (zScore?: number) => {
    if (!zScore) return 'text-gray-600';
    if (zScore > 1) return 'text-green-600';
    if (zScore > -0.5) return 'text-gray-600';
    return 'text-red-600';
  };

  const getZScoreText = (zScore?: number) => {
    if (!zScore) return 'Brak danych';
    if (zScore > 1.5) return 'Znakomite';
    if (zScore > 0.5) return 'Powyżej średniej';
    if (zScore > -0.5) return 'Średnie';
    if (zScore > -1.5) return 'Poniżej średniej';
    return 'Wymaga poprawy';
  };

  return (
    <div className="space-y-6" id="player-report">
      {/* Nagłówek raportu */}
      <Card className="bg-primary text-primary-foreground">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-3xl">
                {player.imie} {player.nazwisko}
              </CardTitle>
              <p className="text-lg mt-2">{player.pozycja}</p>
              {player.wKlubieOd && <p className="text-sm mt-1">W klubie od {player.wKlubieOd}</p>}
            </div>
            <Button onClick={onExportPDF} variant="secondary" className="no-print">
              <Download className="mr-2 h-4 w-4" />
              Eksportuj PDF
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Wiek i dojrzałość */}
      <Card>
        <CardHeader>
          <CardTitle>Analiza dojrzałości biologicznej</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <StatCard
              label="Wiek kalendarzowy"
              value={formatNumber(player.wiekKalendarzowy, 1)}
              unit="lat"
              variant="stat"
            />
            <StatCard
              label="Wiek biologiczny"
              value={formatNumber(calculations.wiekBiologiczny, 1)}
              unit="lat"
              variant="stat"
            />
            <StatCard
              label="Maturity Offset"
              value={formatNumber(calculations.maturityOffset, 2)}
              unit="lat"
              trend={calculations.maturityOffset < 0 ? 'down' : 'up'}
              variant="stat"
            />
          </div>
          {calculations.maturityOffset < -0.5 && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-sm text-blue-800">
                <strong>Late Bloomer:</strong> Zawodnik jest w fazie opóźnionego dojrzewania.
                Spodziewany jest znaczący rozwój fizyczny w najbliższych latach.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Parametry fizyczne */}
      <Card>
        <CardHeader>
          <CardTitle>Parametry fizyczne</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <StatCard
              label="Wzrost"
              value={formatNumber(player.wzrost, 1)}
              unit="cm"
              trend={
                player.wzrostPoprzedni && player.wzrost > player.wzrostPoprzedni
                  ? 'up'
                  : player.wzrostPoprzedni
                  ? 'down'
                  : undefined
              }
              trendValue={
                player.wzrostPoprzedni
                  ? `${formatNumber(player.wzrost - player.wzrostPoprzedni, 1)} cm`
                  : undefined
              }
              variant="stat"
            />
            <StatCard
              label="Waga"
              value={formatNumber(player.waga, 1)}
              unit="kg"
              trend={
                player.wagaPoprzednia && player.waga > player.wagaPoprzednia
                  ? 'up'
                  : player.wagaPoprzednia
                  ? 'down'
                  : undefined
              }
              trendValue={
                player.wagaPoprzednia
                  ? `${formatNumber(player.waga - player.wagaPoprzednia, 1)} kg`
                  : undefined
              }
              variant="stat"
            />
            {player.tkankaTluszczowa && (
              <StatCard
                label="Tkanka tłuszczowa"
                value={formatNumber(player.tkankaTluszczowa, 1)}
                unit="%"
                variant="stat"
              />
            )}
            {calculations.phv && (
              <StatCard
                label="PHV"
                value={formatNumber(calculations.phv, 1)}
                unit="cm/rok"
                variant="stat"
              />
            )}
          </div>
        </CardContent>
      </Card>

      {/* Statystyki wydajności */}
      <Card>
        <CardHeader>
          <CardTitle>Statystyki wydajności</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <StatCard
              label="Dostępność"
              value={formatNumber(calculations.dostepnosc, 0)}
              unit="%"
              variant="stat"
            />
            <StatCard
              label="Mecze / Minuty"
              value={`${player.mecze || 0} / ${player.minuty || 0}`}
              variant="stat"
            />
            <StatCard
              label="% czasu gry"
              value={formatNumber(calculations.procentCzasu, 0)}
              unit="%"
              variant="stat"
            />
          </div>
          {player.dystans && player.sprintMetry && (
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              <StatCard
                label="Dystans"
                value={player.dystans.toLocaleString()}
                unit="m"
                variant="stat"
              />
              <StatCard
                label="Sprint"
                value={player.sprintMetry.toLocaleString()}
                unit="m"
                variant="stat"
              />
              <StatCard
                label="% sprintu"
                value={formatNumber(calculations.procentSprintu, 1)}
                unit="%"
                trend={calculations.procentSprintu > 12 ? 'up' : calculations.procentSprintu < 8 ? 'down' : 'neutral'}
                variant="stat"
              />
            </div>
          )}
          {player.dniKontuzji && player.dniKontuzji > 0 && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-800">
                Zawodnik opuścił <strong>{player.dniKontuzji} dni</strong> z powodu kontuzji.
              </p>
            </div>
          )}
          {calculations.procentSprintu > 12 && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
              <p className="text-sm text-green-800">
                <strong>Wysoka wydajność fizyczna:</strong> Procent sprintów powyżej średniej.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Zdolności motoryczne i testy prędkości */}
      <Card>
        <CardHeader>
          <CardTitle>Zdolności motoryczne i testy prędkości</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {player.sprint10m && (
                <div>
                  <StatCard
                    label="Sprint 10m"
                    value={formatNumber(player.sprint10m, 2)}
                    unit="s"
                    variant="stat"
                  />
                  <div className="mt-2">
                    <p className={`text-sm font-semibold ${getZScoreColor(calculations.zScore10m)}`}>
                      Ocena: {getZScoreText(calculations.zScore10m)}
                    </p>
                    {calculations.zScore10m && (
                      <p className="text-xs text-muted-foreground">
                        Z-score: {formatNumber(calculations.zScore10m, 2)}
                      </p>
                    )}
                  </div>
                </div>
              )}
              {player.sprint30m && (
                <div>
                  <StatCard
                    label="Sprint 30m"
                    value={formatNumber(player.sprint30m, 2)}
                    unit="s"
                    variant="stat"
                  />
                  <div className="mt-2">
                    <p className={`text-sm font-semibold ${getZScoreColor(calculations.zScore30m)}`}>
                      Ocena: {getZScoreText(calculations.zScore30m)}
                    </p>
                    {calculations.zScore30m && (
                      <p className="text-xs text-muted-foreground">
                        Z-score: {formatNumber(calculations.zScore30m, 2)}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {player.codLewy && (
                <div>
                  <StatCard
                    label="COD Lewy"
                    value={formatNumber(player.codLewy, 2)}
                    unit="s"
                    variant="stat"
                  />
                  <div className="mt-2">
                    <p className={`text-sm font-semibold ${getZScoreColor(calculations.zScoreCodLewy)}`}>
                      Ocena: {getZScoreText(calculations.zScoreCodLewy)}
                    </p>
                    {calculations.zScoreCodLewy && (
                      <p className="text-xs text-muted-foreground">
                        Z-score: {formatNumber(calculations.zScoreCodLewy, 2)}
                      </p>
                    )}
                  </div>
                </div>
              )}
              {player.codPrawy && (
                <div>
                  <StatCard
                    label="COD Prawy"
                    value={formatNumber(player.codPrawy, 2)}
                    unit="s"
                    variant="stat"
                  />
                  <div className="mt-2">
                    <p className={`text-sm font-semibold ${getZScoreColor(calculations.zScoreCodPrawy)}`}>
                      Ocena: {getZScoreText(calculations.zScoreCodPrawy)}
                    </p>
                    {calculations.zScoreCodPrawy && (
                      <p className="text-xs text-muted-foreground">
                        Z-score: {formatNumber(calculations.zScoreCodPrawy, 2)}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Refleksja Mid-Season i sugestie */}
      <Card>
        <CardHeader>
          <CardTitle>Refleksja Mid-Season</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Ocena ogólna</h4>
              <p className="text-lg">{calculations.ocenaOgolna}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Sugestie treningowe</h4>
              <ul className="list-disc list-inside space-y-1">
                {calculations.sugestieTreningowe.map((suggestion, index) => (
                  <li key={index} className="text-sm">
                    {suggestion}
                  </li>
                ))}
              </ul>
            </div>
            {player.notatki && (
              <div>
                <h4 className="font-semibold mb-2">Notatki trenera</h4>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{player.notatki}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
