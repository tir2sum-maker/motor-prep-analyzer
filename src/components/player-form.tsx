'use client';

import { useState } from 'react';
import { Player } from '@/types/player';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface PlayerFormProps {
  player?: Partial<Player>;
  onSubmit: (data: Partial<Player>) => void;
  onCancel?: () => void;
}

export function PlayerForm({ player, onSubmit, onCancel }: PlayerFormProps) {
  const [formData, setFormData] = useState<Partial<Player>>(
    player || {
      imie: '',
      nazwisko: '',
      pozycja: '',
      wiekKalendarzowy: 17,
      wzrost: 175,
      waga: 65,
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const updateField = (field: keyof Player, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Dane podstawowe */}
      <Card>
        <CardHeader>
          <CardTitle>Dane podstawowe</CardTitle>
          <CardDescription>Informacje identyfikacyjne zawodnika</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="imie">Imię</Label>
            <Input
              id="imie"
              value={formData.imie}
              onChange={(e) => updateField('imie', e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="nazwisko">Nazwisko</Label>
            <Input
              id="nazwisko"
              value={formData.nazwisko}
              onChange={(e) => updateField('nazwisko', e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pozycja">Pozycja</Label>
            <Select
              value={formData.pozycja}
              onValueChange={(value) => updateField('pozycja', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Wybierz pozycję" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Bramkarz">Bramkarz</SelectItem>
                <SelectItem value="Obrońca">Obrońca</SelectItem>
                <SelectItem value="Pomocnik">Pomocnik</SelectItem>
                <SelectItem value="Napastnik">Napastnik</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="wiekKalendarzowy">Wiek kalendarzowy</Label>
            <Input
              id="wiekKalendarzowy"
              type="number"
              step="0.1"
              value={formData.wiekKalendarzowy}
              onChange={(e) => updateField('wiekKalendarzowy', parseFloat(e.target.value))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="wKlubieOd">W klubie od (rok)</Label>
            <Input
              id="wKlubieOd"
              type="number"
              value={formData.wKlubieOd || ''}
              onChange={(e) => updateField('wKlubieOd', parseInt(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="wyksztalcenie">Wykształcenie</Label>
            <Input
              id="wyksztalcenie"
              value={formData.wyksztalcenie || ''}
              onChange={(e) => updateField('wyksztalcenie', e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Parametry fizyczne */}
      <Card>
        <CardHeader>
          <CardTitle>Parametry fizyczne</CardTitle>
          <CardDescription>Pomiary antropometryczne</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="wzrost">Wzrost (cm)</Label>
            <Input
              id="wzrost"
              type="number"
              step="0.1"
              value={formData.wzrost}
              onChange={(e) => updateField('wzrost', parseFloat(e.target.value))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="wzrostPoprzedni">Wzrost poprzedni (cm)</Label>
            <Input
              id="wzrostPoprzedni"
              type="number"
              step="0.1"
              value={formData.wzrostPoprzedni || ''}
              onChange={(e) => updateField('wzrostPoprzedni', parseFloat(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="waga">Waga (kg)</Label>
            <Input
              id="waga"
              type="number"
              step="0.1"
              value={formData.waga}
              onChange={(e) => updateField('waga', parseFloat(e.target.value))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="wagaPoprzednia">Waga poprzednia (kg)</Label>
            <Input
              id="wagaPoprzednia"
              type="number"
              step="0.1"
              value={formData.wagaPoprzednia || ''}
              onChange={(e) => updateField('wagaPoprzednia', parseFloat(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tkankaTluszczowa">Tkanka tłuszczowa (%)</Label>
            <Input
              id="tkankaTluszczowa"
              type="number"
              step="0.1"
              value={formData.tkankaTluszczowa || ''}
              onChange={(e) => updateField('tkankaTluszczowa', parseFloat(e.target.value))}
            />
          </div>
        </CardContent>
      </Card>

      {/* Statystyki boiskowe */}
      <Card>
        <CardHeader>
          <CardTitle>Statystyki boiskowe</CardTitle>
          <CardDescription>Występy i wydajność</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="dniTreningowe">Dni treningowe</Label>
            <Input
              id="dniTreningowe"
              type="number"
              value={formData.dniTreningowe || ''}
              onChange={(e) => updateField('dniTreningowe', parseInt(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dniKontuzji">Dni kontuzji</Label>
            <Input
              id="dniKontuzji"
              type="number"
              value={formData.dniKontuzji || ''}
              onChange={(e) => updateField('dniKontuzji', parseInt(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="mecze">Mecze</Label>
            <Input
              id="mecze"
              type="number"
              value={formData.mecze || ''}
              onChange={(e) => updateField('mecze', parseInt(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="minuty">Minuty</Label>
            <Input
              id="minuty"
              type="number"
              value={formData.minuty || ''}
              onChange={(e) => updateField('minuty', parseInt(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dystans">Dystans (m)</Label>
            <Input
              id="dystans"
              type="number"
              value={formData.dystans || ''}
              onChange={(e) => updateField('dystans', parseInt(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sprintMetry">Sprint (m)</Label>
            <Input
              id="sprintMetry"
              type="number"
              value={formData.sprintMetry || ''}
              onChange={(e) => updateField('sprintMetry', parseInt(e.target.value))}
            />
          </div>
        </CardContent>
      </Card>

      {/* Testy motoryczne */}
      <Card>
        <CardHeader>
          <CardTitle>Testy motoryczne</CardTitle>
          <CardDescription>Wyniki testów prędkości i zwinności</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="sprint10m">Sprint 10m (s)</Label>
            <Input
              id="sprint10m"
              type="number"
              step="0.01"
              value={formData.sprint10m || ''}
              onChange={(e) => updateField('sprint10m', parseFloat(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sprint30m">Sprint 30m (s)</Label>
            <Input
              id="sprint30m"
              type="number"
              step="0.01"
              value={formData.sprint30m || ''}
              onChange={(e) => updateField('sprint30m', parseFloat(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="codLewy">COD Lewy (s)</Label>
            <Input
              id="codLewy"
              type="number"
              step="0.01"
              value={formData.codLewy || ''}
              onChange={(e) => updateField('codLewy', parseFloat(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="codPrawy">COD Prawy (s)</Label>
            <Input
              id="codPrawy"
              type="number"
              step="0.01"
              value={formData.codPrawy || ''}
              onChange={(e) => updateField('codPrawy', parseFloat(e.target.value))}
            />
          </div>
        </CardContent>
      </Card>

      {/* Notatki */}
      <Card>
        <CardHeader>
          <CardTitle>Notatki</CardTitle>
          <CardDescription>Dodatkowe uwagi i obserwacje</CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            id="notatki"
            rows={4}
            value={formData.notatki || ''}
            onChange={(e) => updateField('notatki', e.target.value)}
            placeholder="Wpisz dodatkowe uwagi..."
          />
        </CardContent>
      </Card>

      {/* Przyciski */}
      <div className="flex justify-end space-x-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Anuluj
          </Button>
        )}
        <Button type="submit">Zapisz</Button>
      </div>
    </form>
  );
}
