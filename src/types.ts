export type TransactionType = 'receita' | 'despesa';
export type PaymentMethod = 'Dinheiro' | 'Cartão de crédito' | 'Débito' | 'PIX';
export type RecurrenceFrequency = 'diaria' | 'semanal' | 'mensal' | 'anual';

export interface Transaction {
  id: string;
  data: string; // YYYY-MM-DD
  descricao: string;
  categoria: string;
  tipo: TransactionType;
  valor: number;
  formaPagamento: PaymentMethod;
  recurringRuleId?: string;
  generatedByRecurrence?: boolean;
}

export interface Categoria {
  id: string;
  nome: string;
  tipo: TransactionType | 'ambos';
}

export interface RecurringTransaction {
  id: string;
  descricao: string;
  categoria: string;
  tipo: TransactionType;
  valor: number;
  formaPagamento: PaymentMethod;
  frequency: RecurrenceFrequency;
  startDate: string; // YYYY-MM-DD
  endDate?: string; // YYYY-MM-DD
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryBudget {
  id: string;
  categoryId: string;
  monthlyLimit: number;
  createdAt: string;
  updatedAt: string;
}

export interface AppConfig {
  metaEconomiaMensal: number;
  isDarkMode: boolean;
}
