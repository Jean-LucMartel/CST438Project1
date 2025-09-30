import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDb, type User } from './db';

interface UserContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const db = useDb();

  useEffect(() => {
    loadStoredUser();
  }, []);

  async function loadStoredUser() {
    try {
      const storedUserId = await AsyncStorage.getItem('currentUserId');
      if (storedUserId) {
        const user = await db.getFirstAsync<User>(
          `SELECT id, username, created_at, email FROM users WHERE id = ?`,
          [parseInt(storedUserId)]
        );
        if (user) {
          setCurrentUser(user);
        }
      }
    } catch (error) {
      console.error('Error loading stored user:', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function updateCurrentUser(user: User | null) {
    setCurrentUser(user);
    if (user) {
      await AsyncStorage.setItem('currentUserId', user.id!.toString());
    } else {
      await AsyncStorage.removeItem('currentUserId');
    }
  }

  async function logout() {
    await AsyncStorage.removeItem('currentUserId');
    setCurrentUser(null);
  }

  return (
    <UserContext.Provider value={{
      currentUser,
      setCurrentUser: updateCurrentUser,
      logout,
      isLoading
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}