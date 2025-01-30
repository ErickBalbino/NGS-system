"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { usePocketBase } from "@/lib/Pocketbase";

import { User } from "@/types/User";
import { AuthProps } from "@/types/Auth";
import { RecordModel } from "pocketbase";

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  login: (user: AuthProps) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const pb = usePocketBase();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authData = pb?.authStore?.model;

        if (authData) {
          setUser(authData as unknown as User);
        }
      } catch (error) {
        console.error("Erro ao verificar o authStore:", error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [pb]);

  const login = (userData: AuthProps) => {
    setUser(userData.record);
    pb?.authStore.save(
      userData.token,
      userData.record as unknown as RecordModel
    );
    router.push("/proposta");
  };

  const logout = () => {
    setUser(null);
    pb?.authStore.clear();
    window.location.reload();
    router.push("/login");
  };

  const isLoggedIn = !!user;

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
