import type { Categoria, Transaction } from '../types';

interface StoreData {
  categories: Map<string, Categoria[]>;
  transactions: Map<string, Transaction[]>;
}

export const createFinanceCrudHarness = () => {
  const store: StoreData = {
    categories: new Map(),
    transactions: new Map(),
  };

  const getUserCategories = (userId: string) => store.categories.get(userId) || [];
  const getUserTransactions = (userId: string) => store.transactions.get(userId) || [];

  const upsertCategories = (userId: string, categories: Categoria[]) => {
    store.categories.set(userId, categories);
  };

  const upsertTransactions = (userId: string, transactions: Transaction[]) => {
    store.transactions.set(userId, transactions);
  };

  const createCategory = (userId: string, category: Categoria) => {
    const categories = getUserCategories(userId);
    if (categories.some((current) => current.nome.toLowerCase() === category.nome.toLowerCase())) {
      throw new Error('Categoria já existe para o usuário.');
    }
    upsertCategories(userId, [...categories, { ...category, userId }]);
  };

  const updateCategory = (userId: string, categoryId: string, patch: Partial<Categoria>) => {
    const categories = getUserCategories(userId);
    const next = categories.map((category) =>
      category.id === categoryId ? { ...category, ...patch, userId } : category,
    );
    upsertCategories(userId, next);
  };

  const deleteCategory = (userId: string, categoryId: string) => {
    const categories = getUserCategories(userId).filter((category) => category.id !== categoryId);
    const transactions = getUserTransactions(userId).filter(
      (transaction) => transaction.categoria !== categoryId,
    );
    upsertCategories(userId, categories);
    upsertTransactions(userId, transactions);
  };

  const createTransaction = (userId: string, transaction: Transaction) => {
    const categories = getUserCategories(userId);
    if (!categories.some((category) => category.id === transaction.categoria)) {
      throw new Error('Categoria inválida para o usuário.');
    }

    const transactions = getUserTransactions(userId);
    upsertTransactions(userId, [...transactions, { ...transaction, userId }]);
  };

  const updateTransaction = (userId: string, transactionId: string, patch: Partial<Transaction>) => {
    const next = getUserTransactions(userId).map((transaction) =>
      transaction.id === transactionId ? { ...transaction, ...patch, userId } : transaction,
    );
    upsertTransactions(userId, next);
  };

  const deleteTransaction = (userId: string, transactionId: string) => {
    const next = getUserTransactions(userId).filter((transaction) => transaction.id !== transactionId);
    upsertTransactions(userId, next);
  };

  return {
    createCategory,
    updateCategory,
    deleteCategory,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    getUserCategories,
    getUserTransactions,
  };
};

