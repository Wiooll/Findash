import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Transaction, Categoria, AppConfig } from '../types';
import { v4 as uuid } from 'uuid';

interface FinanceContextType {
  transactions: Transaction[];
  categories: Categoria[];
  config: AppConfig;
  addTransaction: (t: Omit<Transaction, 'id'>) => void;
  updateTransaction: (id: string, t: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  addCategory: (c: Omit<Categoria, 'id'>) => void;
  updateCategory: (id: string, c: Partial<Categoria>) => void;
  deleteCategory: (id: string) => void;
  updateConfig: (c: Partial<AppConfig>) => void;
  toggleDarkMode: () => void;
}

const defaultCategories: Categoria[] = [
  { id: '1', nome: 'Alimentação', tipo: 'despesa' },
  { id: '2', nome: 'Transporte', tipo: 'despesa' },
  { id: '3', nome: 'Moradia', tipo: 'despesa' },
  { id: '4', nome: 'Lazer', tipo: 'despesa' },
  { id: '5', nome: 'Saúde', tipo: 'despesa' },
  { id: '6', nome: 'Salário', tipo: 'receita' },
  { id: '7', nome: 'Investimentos', tipo: 'ambos' },
];

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const FinanceProvider = ({ children }: {children: ReactNode}) => {
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('@dash_gastos_transactions');
    return saved ? JSON.parse(saved) : [];
  });

  const [categories, setCategories] = useState<Categoria[]>(() => {
    const saved = localStorage.getItem('@dash_gastos_categories');
    return saved ? JSON.parse(saved) : defaultCategories;
  });

  const [config, setConfig] = useState<AppConfig>(() => {
    const saved = localStorage.getItem('@dash_gastos_config');
    return saved ? JSON.parse(saved) : { metaEconomiaMensal: 1000, isDarkMode: false };
  });

  useEffect(() => {
    localStorage.setItem('@dash_gastos_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('@dash_gastos_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('@dash_gastos_config', JSON.stringify(config));
    if (config.isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [config]);

  const addTransaction = (t: Omit<Transaction, 'id'>) => {
    setTransactions(prev => [...prev, { ...t, id: uuid() }]);
  };

  const updateTransaction = (id: string, t: Partial<Transaction>) => {
    setTransactions(prev => prev.map(item => item.id === id ? { ...item, ...t } : item));
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(item => item.id !== id));
  };

  const addCategory = (c: Omit<Categoria, 'id'>) => {
    setCategories(prev => [...prev, { ...c, id: uuid() }]);
  };

  const updateCategory = (id: string, c: Partial<Categoria>) => {
    setCategories(prev => prev.map(item => item.id === id ? { ...item, ...c } : item));
  };

  const deleteCategory = (id: string) => {
    setCategories(prev => prev.filter(item => item.id !== id));
  };

  const updateConfig = (c: Partial<AppConfig>) => {
    setConfig(prev => ({ ...prev, ...c }));
  };

  const toggleDarkMode = () => {
    updateConfig({ isDarkMode: !config.isDarkMode });
  };

  return (
    <FinanceContext.Provider value={{
      transactions, categories, config,
      addTransaction, updateTransaction, deleteTransaction,
      addCategory, updateCategory, deleteCategory,
      updateConfig, toggleDarkMode
    }}>
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) throw new Error('useFinance must be used within FinanceProvider');
  return context;
};
