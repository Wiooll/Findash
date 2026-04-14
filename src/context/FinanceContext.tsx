import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import type { ReactNode } from 'react';
import type {
  AppConfig,
  Categoria,
  CategoryBudget,
  RecurrenceFrequency,
  RecurringTransaction,
  Transaction,
} from '../types';
import { collection, doc, setDoc, updateDoc, deleteDoc, onSnapshot } from 'firebase/firestore';
import { addDays, addMonths, addWeeks, addYears, format, isAfter, parseISO, startOfDay } from 'date-fns';
import { db } from '../services/firebase';
import { v4 as uuid } from 'uuid';

interface FinanceContextType {
  transactions: Transaction[];
  categories: Categoria[];
  recurringTransactions: RecurringTransaction[];
  categoryBudgets: CategoryBudget[];
  config: AppConfig;
  addTransaction: (t: Omit<Transaction, 'id'>) => Promise<void>;
  updateTransaction: (id: string, t: Partial<Transaction>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  addCategory: (c: Omit<Categoria, 'id'>) => Promise<void>;
  updateCategory: (id: string, c: Partial<Categoria>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  addRecurringTransaction: (r: Omit<RecurringTransaction, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateRecurringTransaction: (id: string, r: Partial<RecurringTransaction>) => Promise<void>;
  deleteRecurringTransaction: (id: string) => Promise<void>;
  toggleRecurringTransaction: (id: string, active: boolean) => Promise<void>;
  upsertCategoryBudget: (categoryId: string, monthlyLimit: number) => Promise<void>;
  deleteCategoryBudget: (id: string) => Promise<void>;
  updateConfig: (c: Partial<AppConfig>) => Promise<void>;
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

const nextDateByFrequency = (date: Date, frequency: RecurrenceFrequency) => {
  if (frequency === 'diaria') return addDays(date, 1);
  if (frequency === 'semanal') return addWeeks(date, 1);
  if (frequency === 'mensal') return addMonths(date, 1);
  return addYears(date, 1);
};

const createRecurringTransactionId = (ruleId: string, date: string) => {
  const compactDate = date.replace(/-/g, '');
  return `rec_${ruleId}_${compactDate}`;
};

export const FinanceProvider = ({ children }: { children: ReactNode }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Categoria[]>(defaultCategories);
  const [recurringTransactions, setRecurringTransactions] = useState<RecurringTransaction[]>([]);
  const [categoryBudgets, setCategoryBudgets] = useState<CategoryBudget[]>([]);
  const [config, setConfig] = useState<AppConfig>({ metaEconomiaMensal: 1000, isDarkMode: false });

  const transactionsIdSet = useMemo(() => new Set(transactions.map((t) => t.id)), [transactions]);

  // Sync Transactions
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'transactions'), (snapshot) => {
      const data: Transaction[] = [];
      snapshot.forEach((docSnap) => data.push(docSnap.data() as Transaction));
      setTransactions(data);
    });
    return () => unsubscribe();
  }, []);

  // Sync Categories
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'categories'), (snapshot) => {
      if (snapshot.empty) {
        defaultCategories.forEach((cat) => {
          setDoc(doc(db, 'categories', cat.id), cat);
        });
      } else {
        const data: Categoria[] = [];
        snapshot.forEach((docSnap) => data.push(docSnap.data() as Categoria));
        setCategories(data);
      }
    });
    return () => unsubscribe();
  }, []);

  // Sync Recurring Transactions
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'recurringTransactions'), (snapshot) => {
      const data: RecurringTransaction[] = [];
      snapshot.forEach((docSnap) => data.push(docSnap.data() as RecurringTransaction));
      setRecurringTransactions(data);
    });
    return () => unsubscribe();
  }, []);

  // Sync Category Budgets
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'categoryBudgets'), (snapshot) => {
      const data: CategoryBudget[] = [];
      snapshot.forEach((docSnap) => data.push(docSnap.data() as CategoryBudget));
      setCategoryBudgets(data);
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
        setDoc(doc(db, 'config', 'main'), { metaEconomiaMensal: 1000, isDarkMode: false });
      }
    });
    return () => unsubscribe();
  }, []);

  // Generate pending recurring entries and prevent duplicates by deterministic ID
  useEffect(() => {
    if (recurringTransactions.length === 0) return;

    const syncRecurringEntries = async () => {
      const today = startOfDay(new Date());
      const existingIds = new Set(transactionsIdSet);

      for (const rule of recurringTransactions) {
        if (!rule.active) continue;

        const start = startOfDay(parseISO(rule.startDate));
        if (Number.isNaN(start.getTime())) continue;

        const rawEnd = rule.endDate ? startOfDay(parseISO(rule.endDate)) : null;
        if (rawEnd && Number.isNaN(rawEnd.getTime())) continue;

        const endDate = rawEnd && isAfter(rawEnd, today) ? today : rawEnd || today;
        if (isAfter(start, endDate)) continue;

        let cursor = start;
        while (!isAfter(cursor, endDate)) {
          const txDate = format(cursor, 'yyyy-MM-dd');
          const txId = createRecurringTransactionId(rule.id, txDate);

          if (!existingIds.has(txId)) {
            const transaction: Transaction = {
              id: txId,
              data: txDate,
              descricao: rule.descricao,
              categoria: rule.categoria,
              tipo: rule.tipo,
              valor: Number(rule.valor),
              formaPagamento: rule.formaPagamento,
              recurringRuleId: rule.id,
              generatedByRecurrence: true,
            };

            await setDoc(doc(db, 'transactions', txId), transaction);
            existingIds.add(txId);
          }

          cursor = nextDateByFrequency(cursor, rule.frequency);
        }
      }
    };

    syncRecurringEntries();
  }, [recurringTransactions, transactionsIdSet]);

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

  const addRecurringTransaction = async (
    r: Omit<RecurringTransaction, 'id' | 'createdAt' | 'updatedAt'>,
  ) => {
    const newId = uuid();
    const now = new Date().toISOString();
    const recurring: RecurringTransaction = {
      ...r,
      id: newId,
      createdAt: now,
      updatedAt: now,
    };

    await setDoc(doc(db, 'recurringTransactions', newId), recurring);
  };

  const updateRecurringTransaction = async (id: string, r: Partial<RecurringTransaction>) => {
    await updateDoc(doc(db, 'recurringTransactions', id), {
      ...r,
      updatedAt: new Date().toISOString(),
    });
  };

  const deleteRecurringTransaction = async (id: string) => {
    await deleteDoc(doc(db, 'recurringTransactions', id));
  };

  const toggleRecurringTransaction = async (id: string, active: boolean) => {
    await updateRecurringTransaction(id, { active });
  };

  const upsertCategoryBudget = async (categoryId: string, monthlyLimit: number) => {
    const normalizedLimit = Number(monthlyLimit);
    const existing = categoryBudgets.find((budget) => budget.categoryId === categoryId);

    if (existing) {
      await updateDoc(doc(db, 'categoryBudgets', existing.id), {
        monthlyLimit: normalizedLimit,
        updatedAt: new Date().toISOString(),
      });
      return;
    }

    const newId = uuid();
    const now = new Date().toISOString();
    const budget: CategoryBudget = {
      id: newId,
      categoryId,
      monthlyLimit: normalizedLimit,
      createdAt: now,
      updatedAt: now,
    };

    await setDoc(doc(db, 'categoryBudgets', newId), budget);
  };

  const deleteCategoryBudget = async (id: string) => {
    await deleteDoc(doc(db, 'categoryBudgets', id));
  };

  const updateConfig = async (c: Partial<AppConfig>) => {
    await setDoc(doc(db, 'config', 'main'), c, { merge: true });
  };

  const toggleDarkMode = () => {
    updateConfig({ isDarkMode: !config.isDarkMode });
  };

  return (
    <FinanceContext.Provider
      value={{
        transactions,
        categories,
        recurringTransactions,
        categoryBudgets,
        config,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        addCategory,
        updateCategory,
        deleteCategory,
        addRecurringTransaction,
        updateRecurringTransaction,
        deleteRecurringTransaction,
        toggleRecurringTransaction,
        upsertCategoryBudget,
        deleteCategoryBudget,
        updateConfig,
        toggleDarkMode,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) throw new Error('useFinance must be used within FinanceProvider');
  return context;
};
