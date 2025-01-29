'use client';

import {
  CircleDollarSign,
  ComputerIcon,
  Handshake,
  Car,
  LogOut,
} from 'lucide-react';
import Link from 'next/link';
import { Separator } from '../ui/separator';
import { ModeToggle } from '../theme/mode-toggle';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/Auth';

interface Props {
  activeTab: 'card' | 'proposta' | 'financeiras';
}

export function Header({ activeTab }: Props) {
  const { logout } = useAuth();

  const [greeting, setGreeting] = useState('');
  const [currentTime, setCurrentTime] = useState({
    hours: '',
    minutes: '',
    seconds: '',
  });

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting('Bom dia!');
    } else if (hour < 18) {
      setGreeting('Boa tarde!');
    } else {
      setGreeting('Boa noite!');
    }

    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const seconds = now.getSeconds().toString().padStart(2, '0');
      setCurrentTime({ hours, minutes, seconds });
    };

    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col items-center w-[100%]">
      <div className="mt-6 flex justify-between items-center w-[100%]">
        <div>
          <h3 className="text-xl color-gray-200">Olá, {greeting}</h3>
          <div className="flex space-x-1 mt-1">
            <div className="bg-gray-200 text-gray-800 py-1 px-3 min-h-9 min-w-11 rounded-lg text-lg">
              {currentTime.hours}
            </div>
            <div className="bg-gray-200 text-gray-800 py-1 px-3 min-h-9 min-w-11 rounded-lg text-lg">
              {currentTime.minutes}
            </div>
            <div className="bg-gray-200 text-gray-800 py-1 px-3 min-h-9 min-w-11 rounded-lg text-lg">
              {currentTime.seconds}
            </div>
          </div>{' '}
        </div>

        <button
          onClick={logout}
          className="flex items-center gap-2 text-red-500 hover:text-red-700"
        >
          <LogOut className="h-6 w-6" />
        </button>
      </div>

      <div className="flex items-center mt-6 mb-6 text-3xl w-[100%]">
        <div className="flex items-center justify-between space-x-3 items-center w-[100%]">
          <div className="w-10"></div>

          <div className="flex items-center">
            <Avatar className="w-24 h-24">
              <AvatarImage src="./ngs.png" className="" />
              <AvatarFallback>NGS</AvatarFallback>
            </Avatar>

            <h1 className="ml-3 text-3xl font-medium tracking-tight">
              NGS Backoffice
            </h1>
          </div>

          <ModeToggle />
        </div>
      </div>

      <div className="border-b w-[100%] flex justify-center">
        <div className="flex items-center gap-6 px-6">
          <Car className="h-8 w-8" />

          <Separator orientation="vertical" />

          <nav className="flex items-center lg:space-x-6">
            <Link
              href="/proposta"
              className="flex items-center lg:space-x-6 text-xl gap-2 py-2"
              style={
                activeTab === 'proposta'
                  ? { borderBottom: '4px solid #1D4ED8' }
                  : {}
              }
            >
              <Handshake className="h-6 w-6" />
              Proposta
            </Link>

            <Link
              href="/card"
              className="flex items-center lg:space-x-6 text-xl gap-2 py-2"
              style={
                activeTab === 'card'
                  ? { borderBottom: '4px solid #1D4ED8' }
                  : {}
              }
            >
              <ComputerIcon className="h-6 w-6" />
              Trello
            </Link>

            <Link
              href="/financeiras"
              className="flex items-center lg:space-x-6 text-xl gap-2 py-2"
              style={
                activeTab === 'financeiras'
                  ? { borderBottom: '4px solid #1D4ED8' }
                  : {}
              }
            >
              <CircleDollarSign />
              Financeiras
            </Link>
          </nav>

          <div className="ml-auto flex items-center gap-2"></div>
        </div>
      </div>
    </div>
  );
}
