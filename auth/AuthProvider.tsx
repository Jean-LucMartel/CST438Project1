import * as SecureStore from "expo-secure-store";
import React, { createContext, useContext, useEffect, useState } from "react";

type User = { id: number; username: string; email: string };

type AuthContextType = {
  user: User | null;
  login: (user: User) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // Load saved user from SecureStore when app starts
  useEffect(() => {
    (async () => {
      const stored = await SecureStore.getItemAsync("user");
      if (stored) setUser(JSON.parse(stored));
    })();
  }, []);

  async function login(user: User) {
    setUser(user);
    await SecureStore.setItemAsync("user", JSON.stringify(user));
  }

  async function logout() {
    setUser(null);
    await SecureStore.deleteItemAsync("user");
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
}
