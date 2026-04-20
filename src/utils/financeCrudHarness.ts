import type { Categoria, Loan, LoanStatus, Transaction } from '../types';

interface StoreData {
  categories: Map<string, Categoria[]>;
  transactions: Map<string, Transaction[]>;
  loans: Map<string, Loan[]>;
}

export const createFinanceCrudHarness = () => {
  const store: StoreData = {
    categories: new Map(),
    transactions: new Map(),
    loans: new Map(),
  };

  const getUserCategories = (userId: string) => store.categories.get(userId) || [];
  const getUserTransactions = (userId: string) => store.transactions.get(userId) || [];
  const getUserLoans = (userId: string) => store.loans.get(userId) || [];

  const upsertCategories = (userId: string, categories: Categoria[]) => {
    store.categories.set(userId, categories);
  };

  const upsertTransactions = (userId: string, transactions: Transaction[]) => {
    store.transactions.set(userId, transactions);
  };

  const upsertLoans = (userId: string, loans: Loan[]) => {
    store.loans.set(userId, loans);
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

  const createLoan = (userId: string, loan: Loan) => {
    const loans = getUserLoans(userId);
    upsertLoans(userId, [...loans, { ...loan, userId }]);
  };

  const updateLoan = (userId: string, loanId: string, patch: Partial<Loan>) => {
    const next = getUserLoans(userId).map((loan) =>
      loan.id === loanId ? { ...loan, ...patch, userId } : loan,
    );
    upsertLoans(userId, next);
  };

  const updateLoanStatus = (userId: string, loanId: string, status: LoanStatus) => {
    updateLoan(userId, loanId, { status });
  };

  const deleteLoan = (userId: string, loanId: string) => {
    const next = getUserLoans(userId).filter((loan) => loan.id !== loanId);
    upsertLoans(userId, next);
  };

  return {
    createCategory,
    updateCategory,
    deleteCategory,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    createLoan,
    updateLoan,
    updateLoanStatus,
    deleteLoan,
    getUserCategories,
    getUserTransactions,
    getUserLoans,
  };
};

