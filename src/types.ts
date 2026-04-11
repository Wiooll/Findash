export type TransactionType = 'receita' | 'despesa';
export type PaymentMethod = 'Dinheiro' | 'Cartão de crédito' | 'Débito' | 'PIX';

export interface Transaction {
  id: string;
  data: string; // YYYY-MM-DD
  descricao: string;
  categoria: string;
  tipo: TransactionType;
  valor: number;
  formaPagamento: PaymentMethod;
}

export interface Categoria {
  id: string;
  nome: string;
  tipo: TransactionType | 'ambos';
}

export interface AppConfig {
  metaEconomiaMensal: number;
  isDarkMode: boolean;
}
