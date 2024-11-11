'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';

import { useAuth } from '@/context/Auth';

import { AuthStore } from '@/types/AuthStore';
import { JwtProps } from '@/types/JwtProps';

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { loading, isLoggedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const store: AuthStore = JSON.parse(
      localStorage.getItem('pocketbase_auth') as string
    );

    if (!store) {
      router.push('/login');
    } else {
      const decoded: JwtProps = jwtDecode(store.token);
      const isUserValid = decoded && decoded.id === store.model.id;

      if (!loading && !isLoggedIn && !isUserValid) {
        router.push('/login');
      }
    }
  }, [loading, isLoggedIn, router]);

  if (loading) {
    return <div></div>; // pode ser um spinner de carregamento enquanto verifica se o usuario está logado
  }

  return <>{children}</>;
};

export default PrivateRoute;
