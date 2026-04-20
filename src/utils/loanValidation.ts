import { parseISO } from 'date-fns';
import type { Loan } from '../types';

export const validateLoanInput = (loan: Omit<Loan, 'id' | 'createdAt' | 'updatedAt'>): string => {
  if (!loan.descricao || loan.descricao.trim().length < 3) {
    return 'Informe uma descrição com pelo menos 3 caracteres.';
  }
  if (!loan.data || Number.isNaN(parseISO(loan.data).getTime())) {
    return 'Informe uma data válida no formato YYYY-MM-DD.';
  }
  if (!Number.isFinite(Number(loan.valor)) || Number(loan.valor) <= 0) {
    return 'Informe um valor maior que zero.';
  }
  return '';
};

