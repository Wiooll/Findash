import type { ReactNode } from 'react';
import {
  BrainCircuit,
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
import { useFinance } from '../context/FinanceContext';
import { useAuth } from '../context/AuthContext';
import { APP_NAME, APP_VERSION } from '../constants/app';
import { cn } from '../utils/lib';

interface LayoutProps {
  children: ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Layout = ({ children, activeTab, setActiveTab }: LayoutProps) => {
  const { config, toggleDarkMode } = useFinance();
  const { user, logout } = useAuth();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'transactions', label: 'Transações', icon: ReceiptText },
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
          <button
            onClick={toggleDarkMode}
            className="w-full flex items-center justify-between px-4 py-2 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-all"
          >
            <span className="text-sm font-medium">Tema Escuro</span>
            {config.isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
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
        <button onClick={toggleDarkMode} className="p-2 bg-secondary rounded-full">
          {config.isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </div>

      <div className="md:hidden flex overflow-x-auto bg-card border-b border-border no-scrollbar sticky top-[60px] z-10">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              'flex-shrink-0 px-4 py-3 text-sm font-medium whitespace-nowrap transition-all border-b-2',
              activeTab === item.id
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground',
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      <main className="flex-1 p-4 md:p-8 overflow-y-auto w-full max-w-[1600px] mx-auto">
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">{children}</div>
      </main>
    </div>
  );
};
