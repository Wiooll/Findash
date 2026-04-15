import { describe, expect, it } from 'vitest';
import type { Transaction } from '../types';
import {
  buildInsightsHistory,
  calculateCategoryMonthComparison,
  calculateMonthEndProjection,
  detectExpenseAnomalies,
  generateSpendingInsights,
  normalizeCategoryKey,
} from './financialInsights';

const baseTransaction = (partial: Partial<Transaction>): Transaction => ({
  id: partial.id || 'tx-default',
  data: partial.data || '2026-04-01',
  descricao: partial.descricao || 'movimento',
  categoria: partial.categoria || 'Alimentacao',
  tipo: partial.tipo || 'despesa',
  valor: partial.valor ?? 0,
  formaPagamento: partial.formaPagamento || 'PIX',
});

describe('financialInsights utils', () => {
  it('normaliza chave de categoria', () => {
    expect(normalizeCategoryKey('  Alimentacao   Fora  ')).toBe('alimentacao fora');
  });

  it('calcula projecao de fim de mes com base em media diaria', () => {
    const transactions: Transaction[] = [
      baseTransaction({ id: 'r1', tipo: 'receita', valor: 2000, data: '2026-04-02' }),
      baseTransaction({ id: 'r2', tipo: 'receita', valor: 1000, data: '2026-04-08' }),
      baseTransaction({ id: 'd1', tipo: 'despesa', valor: 600, data: '2026-04-03' }),
      baseTransaction({ id: 'd2', tipo: 'despesa', valor: 400, data: '2026-04-06' }),
      baseTransaction({ id: 'old', tipo: 'despesa', valor: 999, data: '2026-03-06' }),
    ];

    const projection = calculateMonthEndProjection(transactions, new Date('2026-04-10T10:00:00'));

    expect(projection.incomeToDate).toBe(3000);
    expect(projection.expenseToDate).toBe(1000);
    expect(projection.observedDays).toBe(10);
    expect(projection.totalDaysInMonth).toBe(30);
    expect(projection.projectedIncome).toBeCloseTo(9000, 2);
    expect(projection.projectedExpense).toBeCloseTo(3000, 2);
    expect(projection.projectedBalance).toBeCloseTo(6000, 2);
  });

  it('compara categorias entre mes atual e mes anterior', () => {
    const transactions: Transaction[] = [
      baseTransaction({ id: 'c1', categoria: 'Mercado', valor: 600, data: '2026-04-05' }),
      baseTransaction({ id: 'c2', categoria: 'Mercado', valor: 300, data: '2026-03-05' }),
      baseTransaction({ id: 'c3', categoria: 'Transporte', valor: 200, data: '2026-03-12' }),
    ];

    const comparison = calculateCategoryMonthComparison(transactions, new Date('2026-04-15'));
    const mercado = comparison.find((item) => item.categoryKey === 'mercado');
    const transporte = comparison.find((item) => item.categoryKey === 'transporte');

    expect(mercado?.currentMonthTotal).toBe(600);
    expect(mercado?.previousMonthTotal).toBe(300);
    expect(mercado?.absoluteChange).toBe(300);
    expect(mercado?.percentageChange).toBe(100);

    expect(transporte?.currentMonthTotal).toBe(0);
    expect(transporte?.previousMonthTotal).toBe(200);
    expect(transporte?.absoluteChange).toBe(-200);
    expect(transporte?.percentageChange).toBe(-100);
  });

  it('gera insights automaticos para aumento e reducao relevantes', () => {
    const comparisons = [
      {
        categoryKey: 'mercado',
        categoryName: 'Mercado',
        currentMonthTotal: 600,
        previousMonthTotal: 300,
        absoluteChange: 300,
        percentageChange: 100,
      },
      {
        categoryKey: 'lazer',
        categoryName: 'Lazer',
        currentMonthTotal: 150,
        previousMonthTotal: 300,
        absoluteChange: -150,
        percentageChange: -50,
      },
    ];

    const insights = generateSpendingInsights(comparisons, new Date('2026-04-15T08:00:00'));
    expect(insights).toHaveLength(2);
    expect(insights.some((item) => item.kind === 'increase')).toBe(true);
    expect(insights.some((item) => item.kind === 'decrease')).toBe(true);
  });

  it('detecta anomalia somente com historico minimo e acima do limiar', () => {
    const transactions: Transaction[] = [
      baseTransaction({ id: 'h1', categoria: 'Saude', valor: 100, data: '2026-01-10' }),
      baseTransaction({ id: 'h2', categoria: 'Saude', valor: 120, data: '2026-02-10' }),
      baseTransaction({ id: 'h3', categoria: 'Saude', valor: 110, data: '2026-03-10' }),
      baseTransaction({ id: 'ok', categoria: 'Saude', valor: 130, data: '2026-04-05' }),
      baseTransaction({ id: 'anom', categoria: 'Saude', valor: 260, data: '2026-04-07' }),
      baseTransaction({ id: 'few1', categoria: 'Lazer', valor: 100, data: '2026-03-05' }),
      baseTransaction({ id: 'few2', categoria: 'Lazer', valor: 300, data: '2026-04-06' }),
    ];

    const anomalies = detectExpenseAnomalies(transactions, new Date('2026-04-15'));
    expect(anomalies).toHaveLength(1);
    expect(anomalies[0].categoryKey).toBe('saude');
    expect(anomalies[0].value).toBe(260);
  });

  it('constroi historico ordenado por data de geracao', () => {
    const transactions: Transaction[] = [
      baseTransaction({ id: 'm1', categoria: 'Mercado', valor: 300, data: '2026-03-08' }),
      baseTransaction({ id: 'm2', categoria: 'Mercado', valor: 700, data: '2026-04-08' }),
      baseTransaction({ id: 's1', categoria: 'Saude', valor: 100, data: '2026-01-10' }),
      baseTransaction({ id: 's2', categoria: 'Saude', valor: 100, data: '2026-02-10' }),
      baseTransaction({ id: 's3', categoria: 'Saude', valor: 100, data: '2026-03-10' }),
      baseTransaction({ id: 's4', categoria: 'Saude', valor: 220, data: '2026-04-10' }),
    ];

    const history = buildInsightsHistory(transactions, new Date('2026-04-20T12:00:00'));
    expect(history.length).toBeGreaterThan(0);
    expect(history[0].generatedAt >= history[history.length - 1].generatedAt).toBe(true);
  });
});
