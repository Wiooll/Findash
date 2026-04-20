import type { ReactNode } from 'react';
import {
  BrainCircuit,
  Circle,
  CircleDollarSign,
  CreditCard,
  Landmark,
  LayoutDashboard,
  Moon,
  ReceiptText,
  Repeat,
  Sun,
  Tags,
  Target,
  Wallet,
} from 'lucide-react';
import type { ThemeMode } from '../types';
import { useFinance } from '../context/FinanceContext';
import { useAuth } from '../context/AuthContext';
import { APP_NAME, APP_VERSION } from '../constants/app';
import { cn } from '../utils/lib';
import { MobileBottomNav } from './MobileBottomNav';
import { buildCopyrightText } from '../utils/uiPreferences';

interface LayoutProps {
  children: ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Layout = ({ children, activeTab, setActiveTab }: LayoutProps) => {
  const { config, setThemeMode } = useFinance();
  const { user, logout } = useAuth();
  const currentTheme = config.themeMode || (config.isDarkMode ? 'black' : 'white');
  const currentYear = new Date().getFullYear();
  const copyrightText = buildCopyrightText(APP_NAME, currentYear);
  const handleThemeChange = (value: string) => {
    void setThemeMode(value as ThemeMode);
  };
  const themeButtons: Array<{ value: ThemeMode; label: string; icon: typeof Sun }> = [
    { value: 'white', label: 'Tema branco', icon: Sun },
    { value: 'black', label: 'Tema preto', icon: Moon },
    { value: 'gray', label: 'Tema cinza', icon: Circle },
  ];

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'transactions', label: 'Transações', icon: ReceiptText },
    { id: 'loans', label: 'Empréstimos', icon: CircleDollarSign },
    { id: 'accounts', label: 'Contas', icon: Landmark },
    { id: 'credit-cards', label: 'Cartões', icon: CreditCard },
    { id: 'insights', label: 'Insights', icon: BrainCircuit },
    { id: 'recurring', label: 'Recorrências', icon: Repeat },
    { id: 'categories', label: 'Categorias', icon: Tags },
    { id: 'goals', label: 'Metas', icon: Target },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row font-sans transition-colors duration-300">
      <aside className="w-full md:w-64 bg-card border-r border-border p-4 flex flex-col shadow-sm z-10 hidden md:flex">
        <div className="flex items-center gap-2 mb-8 px-2">
          <div className="bg-primary text-primary-foreground p-2 rounded-lg">
            <Wallet size={24} />
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
            {APP_NAME}
          </h1>
        </div>

        <nav className="flex-1 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  'w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all text-sm font-medium',
                  activeTab === item.id
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground',
                )}
              >
                <Icon size={17} />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="mt-auto pt-4 border-t border-border">
          <div className="px-4 pb-3 space-y-1">
            <p className="text-xs text-muted-foreground truncate">
              {user?.email || 'Usuário autenticado'}
            </p>
            <p className="text-xs text-muted-foreground">Versão {APP_VERSION}</p>
          </div>
          <div className="w-full flex items-center justify-between px-4 py-2 rounded-lg text-muted-foreground gap-2">
            <span className="text-sm font-medium">Tema</span>
            <div className="flex items-center gap-1 rounded-lg border border-input bg-background p-1">
              {themeButtons.map((item) => {
                const Icon = item.icon;
                const active = currentTheme === item.value;
                return (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => handleThemeChange(item.value)}
                    aria-label={item.label}
                    aria-pressed={active}
                    className={cn(
                      'h-8 w-8 inline-flex items-center justify-center rounded-md transition-colors',
                      active
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-secondary hover:text-foreground',
                    )}
                  >
                    <Icon size={15} />
                  </button>
                );
              })}
            </div>
          </div>
          <button
            onClick={() => void logout()}
            className="mt-2 w-full px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-all text-left"
          >
            Sair da conta
          </button>
        </div>
      </aside>

      <div className="md:hidden flex items-center justify-between bg-card p-4 border-b border-border z-10 sticky top-0">
        <div className="flex items-center gap-2">
          <Wallet size={20} className="text-primary" />
          <h1 className="text-lg font-bold">{APP_NAME}</h1>
        </div>
        <div className="flex items-center gap-1 rounded-lg border border-input bg-background p-1">
          {themeButtons.map((item) => {
            const Icon = item.icon;
            const active = currentTheme === item.value;
            return (
              <button
                key={item.value}
                type="button"
                onClick={() => handleThemeChange(item.value)}
                aria-label={item.label}
                aria-pressed={active}
                className={cn(
                  'h-7 w-7 inline-flex items-center justify-center rounded-md transition-colors',
                  active
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground',
                )}
              >
                <Icon size={14} />
              </button>
            );
          })}
        </div>
      </div>



      <MobileBottomNav items={menuItems} activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 p-4 pb-28 md:p-8 md:pb-8 overflow-y-auto w-full max-w-[1600px] mx-auto min-h-[calc(100dvh-60px)]">
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">{children}</div>
        <footer className="mt-8 pt-6 border-t border-border text-xs text-muted-foreground text-center">
          {copyrightText}
        </footer>
      </main>
    </div>
  );
};
