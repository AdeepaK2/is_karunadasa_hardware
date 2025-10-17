'use client';

import { useEffect } from 'react';
import { useApp } from '@/contexts/AppContext';

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme } = useApp();

  useEffect(() => {
    // Apply theme class to html element
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  return <>{children}</>;
}
