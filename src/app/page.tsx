'use client';

import { useEffect, useState } from 'react';
import { Player } from '@/types/player';
import { getAllPlayers, addPlayer } from '@/firebase/players';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, UserCircle } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newPlayer, setNewPlayer] = useState({
    imie: '',
    nazwisko: '',
    pozycja: '',
  });

  useEffect(() => {
    loadPlayers();
  }, []);

  const loadPlayers = async () => {
    setLoading(true);
    const data = await getAllPlayers();
    setPlayers(data);
    setLoading(false);
  };

  const handleAddPlayer = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Walidacja pozycji
    if (!newPlayer.pozycja) {
      alert('Wybierz pozycję zawodnika');
      return;
    }
    
    try {
      const playerData: Omit<Player, 'id'> = {
        ...newPlayer,
        wiekKalendarzowy: 17,
        wzrost: 175,
        waga: 65,
        dataUtworzenia: new Date().toISOString(),
        dataAktualizacji: new Date().toISOString(),
      };
      await addPlayer(playerData);
      setDialogOpen(false);
      setNewPlayer({ imie: '', nazwisko: '', pozycja: '' });
      loadPlayers();
    } catch (error) {
      console.error('Błąd dodawania zawodnika:', error);
      alert('Wystąpił błąd podczas dodawania zawodnika');
    }
  };

  return (
    <div className="space-y-6">
      {/* Nagłówek */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-primary">Lista zawodników</h2>
          <p className="text-muted-foreground mt-1">Zarządzaj profilami zawodników i monitoruj ich rozwój</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Dodaj zawodnika
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Dodaj nowego zawodnika</DialogTitle>
              <DialogDescription>
                Wprowadź podstawowe dane zawodnika. Resztę danych można uzupełnić później w profilu.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddPlayer} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="imie">Imię</Label>
                <Input
                  id="imie"
                  value={newPlayer.imie}
                  onChange={(e) => setNewPlayer({ ...newPlayer, imie: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nazwisko">Nazwisko</Label>
                <Input
                  id="nazwisko"
                  value={newPlayer.nazwisko}
                  onChange={(e) => setNewPlayer({ ...newPlayer, nazwisko: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pozycja">Pozycja</Label>
                <Select
                  value={newPlayer.pozycja}
                  onValueChange={(value) => setNewPlayer({ ...newPlayer, pozycja: value })}
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
                {/* Ukryte pole do walidacji Select */}
                <input
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  style={{ opacity: 0, height: 0, position: 'absolute' }}
                  value={newPlayer.pozycja}
                  onChange={() => {}}
                  required
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Anuluj
                </Button>
                <Button type="submit">Dodaj</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Lista zawodników */}
      {loading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Ładowanie...</p>
        </div>
      ) : players.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <UserCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-semibold mb-2">Brak zawodników</p>
            <p className="text-sm text-muted-foreground mb-4">
              Dodaj pierwszego zawodnika, aby rozpocząć monitorowanie rozwoju
            </p>
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Dodaj zawodnika
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {players.map((player) => (
            <Link key={player.id} href={`/player/${player.id}`}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <UserCircle className="h-5 w-5" />
                    <span>
                      {player.imie} {player.nazwisko}
                    </span>
                  </CardTitle>
                  <CardDescription>{player.pozycja}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1 text-sm">
                    <p className="text-muted-foreground">
                      Wiek: <span className="font-medium text-foreground">{player.wiekKalendarzowy} lat</span>
                    </p>
                    {player.wKlubieOd && (
                      <p className="text-muted-foreground">
                        W klubie od: <span className="font-medium text-foreground">{player.wKlubieOd}</span>
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
