import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';

type FavPlayer = {
  idPlayer: string;
  strPlayer: string;
  strThumb?: string;
  strPosition?: string;
  strTeam?: string;
};

type Ctx = {
  favorites: Record<string, FavPlayer>;
  isFavorite: (id: string) => boolean;
  add: (p: FavPlayer) => void;
  remove: (id: string) => void;
  toggle: (p: FavPlayer) => void;
  ready: boolean;
};

const STORAGE_KEY = 'favorites:players:v1';
const FavoritesContext = createContext<Ctx | null>(null);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<Record<string, FavPlayer>>({});
  const [ready, setReady] = useState(false);


  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) setFavorites(JSON.parse(raw));
      } finally {
        setReady(true);
      }
    })();
  }, []);


  useEffect(() => {
    if (!ready) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  }, [favorites, ready]);

  
  const api = useMemo<Ctx>(
    () => ({
      favorites,
      ready,
      isFavorite: (id) => !!favorites[id],
      add: (p) => setFavorites((prev) => ({ ...prev, [p.idPlayer]: p })),
      remove: (id) =>
        setFavorites((prev) => {
          const copy = { ...prev };
          delete copy[id];
          return copy;
        }),
      toggle: (p) =>
        setFavorites((prev) => {
          const copy = { ...prev };
          if (copy[p.idPlayer]) delete copy[p.idPlayer];
          else copy[p.idPlayer] = p;
          return copy;
        }),
    }),
    [favorites, ready]
  );

  return (
    <FavoritesContext.Provider value={api}>
      {children}
    </FavoritesContext.Provider>
  );
}


export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error('useFavorites must be used within FavoritesProvider');
  return ctx;
}