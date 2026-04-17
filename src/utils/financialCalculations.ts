import { isSameMonth, parseISO, startOfMonth } from 'date-fns';
import type { Transaction } from '../types';

export interface DashboardTotals {
  saldo: number;
  receitas: number;
  despesas: number;
  mesAtualReceitas: number;
  mesAtualDespesas: number;
  economiaMes: number;
}

export const calculateDashboardTotals = (
  transactions: Transaction[],
  referenceDate = new Date(),
): DashboardTotals => {
  const currentMonth = startOfMonth(referenceDate);
  let receitas = 0;
  let despesas = 0;
  let mesAtualReceitas = 0;
  let mesAtualDespesas = 0;

  transactions.forEach((transaction) => {
    if (transaction.tipo === 'transferencia') return;

    const value = Number(transaction.valor);
    if (!Number.isFinite(value)) return;

    const date = parseISO(transaction.data);
    if (Number.isNaN(date.getTime())) return;

    const isCurrent = isSameMonth(date, currentMonth);

    if (transaction.tipo === 'receita') {
      receitas += value;
      if (isCurrent) mesAtualReceitas += value;
      return;
    }

    despesas += value;
    if (isCurrent) mesAtualDespesas += value;
  });

  return {
    saldo: receitas - despesas,
    receitas,
    despesas,
    mesAtualReceitas,
    mesAtualDespesas,
    economiaMes: mesAtualReceitas - mesAtualDespesas,
  };
};

