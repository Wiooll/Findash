import { describe, expect, it } from 'vitest';
import type { Transaction } from '../types';
import { calculateDashboardTotals } from './financialCalculations';

const tx = (partial: Partial<Transaction>): Transaction => ({
  id: partial.id || 'tx-default',
  data: partial.data || '2026-04-01',
  descricao: partial.descricao || 'movimento',
  categoria: partial.categoria || 'Geral',
  tipo: partial.tipo || 'despesa',
  valor: partial.valor ?? 0,
  formaPagamento: partial.formaPagamento || 'PIX',
});

describe('financialCalculations', () => {
  it('calcula totais e economia do mes ignorando transferencias', () => {
    const transactions: Transaction[] = [
      tx({ id: 'r1', tipo: 'receita', valor: 2500, data: '2026-04-02' }),
      tx({ id: 'd1', tipo: 'despesa', valor: 700, data: '2026-04-04' }),
      tx({ id: 'old', tipo: 'despesa', valor: 300, data: '2026-03-25' }),
      tx({
        id: 'trf',
        tipo: 'transferencia',
        valor: 500,
        data: '2026-04-06',
        isTransferenciaOrigem: true,
      }),
    ];

    const totals = calculateDashboardTotals(transactions, new Date('2026-04-10T10:00:00'));

    expect(totals.receitas).toBe(2500);
    expect(totals.despesas).toBe(1000);
    expect(totals.saldo).toBe(1500);
    expect(totals.mesAtualReceitas).toBe(2500);
    expect(totals.mesAtualDespesas).toBe(700);
    expect(totals.economiaMes).toBe(1800);
  });

  it('retorna zero quando nao ha transacoes validas no periodo', () => {
    const transactions: Transaction[] = [
      tx({ id: 'invalid-date', data: 'data-invalida', tipo: 'receita', valor: 1000 }),
      tx({ id: 'invalid-value', data: '2026-04-03', tipo: 'despesa', valor: Number.NaN }),
    ];

    const totals = calculateDashboardTotals(transactions, new Date('2026-04-10T10:00:00'));

    expect(totals.receitas).toBe(0);
    expect(totals.despesas).toBe(0);
    expect(totals.saldo).toBe(0);
    expect(totals.economiaMes).toBe(0);
  });
});

