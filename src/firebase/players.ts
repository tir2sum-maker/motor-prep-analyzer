'use client';

import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { db } from './config';
import { Player } from '@/types/player';

const PLAYERS_COLLECTION = 'players';

/**
 * Pobiera wszystkich zawodników
 */
export async function getAllPlayers(): Promise<Player[]> {
  try {
    const playersQuery = query(
      collection(db, PLAYERS_COLLECTION),
      orderBy('dataAktualizacji', 'desc')
    );
    const snapshot = await getDocs(playersQuery);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Player[];
  } catch (error) {
    console.error('Błąd pobierania zawodników:', error);
    return [];
  }
}

/**
 * Pobiera jednego zawodnika po ID
 */
export async function getPlayerById(id: string): Promise<Player | null> {
  try {
    const docRef = doc(db, PLAYERS_COLLECTION, id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
      } as Player;
    }
    return null;
  } catch (error) {
    console.error('Błąd pobierania zawodnika:', error);
    return null;
  }
}

/**
 * Dodaje nowego zawodnika
 */
export async function addPlayer(playerData: Omit<Player, 'id'>): Promise<string> {
  try {
    const now = new Date().toISOString();
    const docRef = await addDoc(collection(db, PLAYERS_COLLECTION), {
      ...playerData,
      dataUtworzenia: now,
      dataAktualizacji: now,
    });
    return docRef.id;
  } catch (error) {
    console.error('Błąd dodawania zawodnika:', error);
    throw error;
  }
}

/**
 * Aktualizuje dane zawodnika
 */
export async function updatePlayer(id: string, playerData: Partial<Player>): Promise<void> {
  try {
    const docRef = doc(db, PLAYERS_COLLECTION, id);
    await updateDoc(docRef, {
      ...playerData,
      dataAktualizacji: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Błąd aktualizacji zawodnika:', error);
    throw error;
  }
}

/**
 * Usuwa zawodnika
 */
export async function deletePlayer(id: string): Promise<void> {
  try {
    const docRef = doc(db, PLAYERS_COLLECTION, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Błąd usuwania zawodnika:', error);
    throw error;
  }
}
