import type { ThemeMode } from '../types';

export const THEME_OPTIONS: Array<{ value: ThemeMode; label: string }> = [
  { value: 'white', label: 'Branco' },
  { value: 'black', label: 'Preto' },
  { value: 'gray', label: 'Cinza' },
];

export const buildCopyrightText = (appName: string, year: number) =>
  `© ${year} ${appName}. Todos os direitos reservados.`;

