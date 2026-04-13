import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Transaction, Categoria, AppConfig } from '../types';
import { collection, doc, setDoc, updateDoc, deleteDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../services/firebase';
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
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Categoria[]>(defaultCategories);
  const [config, setConfig] = useState<AppConfig>({ metaEconomiaMensal: 1000, isDarkMode: false });

  // Sync Transactions
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'transactions'), (snapshot) => {
      const data: Transaction[] = [];
      snapshot.forEach(docSnap => data.push(docSnap.data() as Transaction));
      setTransactions(data);
    });
    return () => unsubscribe();
  }, []);

  // Sync Categories
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'categories'), (snapshot) => {
      if (snapshot.empty) {
        // Inicializa com as defaults no banco pela primeira vez se o banco estiver vazio
        defaultCategories.forEach(cat => {
          setDoc(doc(db, 'categories', cat.id), cat);
        });
      } else {
        const data: Categoria[] = [];
        snapshot.forEach(docSnap => data.push(docSnap.data() as Categoria));
        setCategories(data);
      }
    });
    return () => unsubscribe();
  }, []);

  // Sync Config
  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'config', 'main'), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data() as AppConfig;
        setConfig(data);
        if (data.isDarkMode) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      } else {
        // Salva a config inicial
        setDoc(doc(db, 'config', 'main'), { metaEconomiaMensal: 1000, isDarkMode: false });
      }
    });
    return () => unsubscribe();
  }, []);

  const addTransaction = async (t: Omit<Transaction, 'id'>) => {
    const newId = uuid();
    const newTx = { ...t, id: newId };
    await setDoc(doc(db, 'transactions', newId), newTx);
  };

  const updateTransaction = async (id: string, t: Partial<Transaction>) => {
    await updateDoc(doc(db, 'transactions', id), t);
  };

  const deleteTransaction = async (id: string) => {
    await deleteDoc(doc(db, 'transactions', id));
  };

  const addCategory = async (c: Omit<Categoria, 'id'>) => {
    const newId = uuid();
    const newCat = { ...c, id: newId };
    await setDoc(doc(db, 'categories', newId), newCat);
  };

  const updateCategory = async (id: string, c: Partial<Categoria>) => {
    await updateDoc(doc(db, 'categories', id), c);
  };

  const deleteCategory = async (id: string) => {
    await deleteDoc(doc(db, 'categories', id));
  };

  const updateConfig = async (c: Partial<AppConfig>) => {
    await setDoc(doc(db, 'config', 'main'), c, { merge: true });
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
