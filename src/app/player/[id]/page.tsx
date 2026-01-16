'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Player } from '@/types/player';
import { getPlayerById, updatePlayer, deletePlayer } from '@/firebase/players';
import { calculatePlayerMetrics } from '@/lib/calculations';
import { PlayerForm } from '@/components/player-form';
import { PlayerReport } from '@/components/player-report';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function PlayerPage() {
  const params = useParams();
  const router = useRouter();
  const [player, setPlayer] = useState<Player | null>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    loadPlayer();
  }, [params.id]);

  const loadPlayer = async () => {
    setLoading(true);
    const data = await getPlayerById(params.id as string);
    setPlayer(data);
    setLoading(false);

    // Jeśli brak danych motorycznych, włącz tryb edycji
    if (data && !data.sprint10m && !data.sprint30m && !data.codLewy && !data.codPrawy) {
      setEditMode(true);
    }
  };

  const handleUpdate = async (data: Partial<Player>) => {
    try {
      await updatePlayer(params.id as string, data);
      setEditMode(false);
      loadPlayer();
    } catch (error) {
      console.error('Błąd aktualizacji:', error);
      alert('Wystąpił błąd podczas aktualizacji danych');
    }
  };

  const handleDelete = async () => {
    try {
      await deletePlayer(params.id as string);
      router.push('/');
    } catch (error) {
      console.error('Błąd usuwania:', error);
      alert('Wystąpił błąd podczas usuwania zawodnika');
    }
  };

  const handleExportPDF = async () => {
    const reportElement = document.getElementById('player-report');
    if (!reportElement) return;

    try {
      // Ukryj przyciski przed eksportem
      const buttons = reportElement.querySelectorAll('.no-print');
      buttons.forEach((btn) => ((btn as HTMLElement).style.display = 'none'));

      const canvas = await html2canvas(reportElement, {
        scale: 2,
        logging: false,
        backgroundColor: '#ffffff',
      });

      // Przywróć przyciski
      buttons.forEach((btn) => ((btn as HTMLElement).style.display = ''));

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;
      }

      pdf.save(`${player?.imie}_${player?.nazwisko}_raport.pdf`);
    } catch (error) {
      console.error('Błąd eksportu PDF:', error);
      alert('Wystąpił błąd podczas eksportu PDF');
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Ładowanie...</p>
      </div>
    );
  }

  if (!player) {
    return (
      <div className="text-center py-12">
        <p className="text-lg font-semibold mb-2">Nie znaleziono zawodnika</p>
        <Link href="/">
          <Button>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Powrót do listy
          </Button>
        </Link>
      </div>
    );
  }

  const calculations = calculatePlayerMetrics(player);

  return (
    <div className="space-y-6">
      {/* Nagłówek */}
      <div className="flex items-center justify-between">
        <Link href="/">
          <Button variant="ghost">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Powrót do listy
          </Button>
        </Link>
        <div className="flex space-x-2 no-print">
          <Button variant="outline" onClick={() => setEditMode(!editMode)}>
            <Edit className="mr-2 h-4 w-4" />
            {editMode ? 'Anuluj edycję' : 'Edytuj dane'}
          </Button>
          <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Usuń zawodnika
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Potwierdź usunięcie</DialogTitle>
                <DialogDescription>
                  Czy na pewno chcesz usunąć zawodnika {player.imie} {player.nazwisko}? Tej operacji nie można
                  cofnąć.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                  Anuluj
                </Button>
                <Button variant="destructive" onClick={handleDelete}>
                  Usuń
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Treść */}
      {editMode ? (
        <PlayerForm player={player} onSubmit={handleUpdate} onCancel={() => setEditMode(false)} />
      ) : (
        <PlayerReport
          player={player}
          calculations={calculations as any}
          onExportPDF={handleExportPDF}
        />
      )}
    </div>
  );
}
