import {
  endOfMonth,
  format,
  isSameMonth,
  parseISO,
  startOfMonth,
  subMonths,
} from 'date-fns';
import type {
  AnomalyAlert,
  CategoryComparison,
  InsightAlert,
  InsightHistoryEntry,
  ProjectionSummary,
  Transaction,
} from '../types';

const ONE_DAY_MS = 24 * 60 * 60 * 1000;
const INCREASE_THRESHOLD_PERCENT = 20;
const DECREASE_THRESHOLD_PERCENT = -20;
const MIN_HISTORY_FOR_ANOMALY = 3;
const ANOMALY_FACTOR = 1.8;

const createStableId = (prefix: string, parts: Array<string | number>) =>
  `${prefix}_${parts.join('_').toLowerCase().replace(/\s+/g, '-')}`;

export const normalizeCategoryKey = (value: string) =>
  value.trim().toLowerCase().replace(/\s+/g, ' ');

const getTransactionDate = (transaction: Transaction) => {
  const parsed = parseISO(transaction.data);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const getDaysInMonth = (monthRef: Date) =>
  Math.floor((endOfMonth(monthRef).getTime() - startOfMonth(monthRef).getTime()) / ONE_DAY_MS) + 1;

const buildCategoryLabelMap = (transactions: Transaction[]) => {
  const labelMap = new Map<string, string>();
  transactions.forEach((transaction) => {
    const key = normalizeCategoryKey(transaction.categoria);
    if (!labelMap.has(key)) {
      labelMap.set(key, transaction.categoria);
    }
  });
  return labelMap;
};

export const aggregateMonthlyExpensesByCategory = (
  transactions: Transaction[],
  monthRef: Date,
) => {
  const totals = new Map<string, number>();

  transactions.forEach((transaction) => {
    if (transaction.tipo !== 'despesa') return;

    const txDate = getTransactionDate(transaction);
    if (!txDate || !isSameMonth(txDate, monthRef)) return;

    const key = normalizeCategoryKey(transaction.categoria);
    totals.set(key, (totals.get(key) || 0) + Number(transaction.valor));
  });

  return totals;
};

export const calculateMonthEndProjection = (
  transactions: Transaction[],
  referenceDate = new Date(),
): ProjectionSummary => {
  const currentMonthStart = startOfMonth(referenceDate);
  const totalDaysInMonth = getDaysInMonth(referenceDate);
  const observedDays = Math.min(referenceDate.getDate(), totalDaysInMonth);

  let incomeToDate = 0;
  let expenseToDate = 0;

  transactions.forEach((transaction) => {
    if (transaction.tipo === 'transferencia') return;

    const txDate = getTransactionDate(transaction);
    if (!txDate || !isSameMonth(txDate, currentMonthStart)) return;

    const value = Number(transaction.valor);
    if (transaction.tipo === 'receita') incomeToDate += value;
    if (transaction.tipo === 'despesa') expenseToDate += value;
  });

  const averageDailyIncome = observedDays > 0 ? incomeToDate / observedDays : 0;
  const averageDailyExpense = observedDays > 0 ? expenseToDate / observedDays : 0;

  const projectedIncome = averageDailyIncome * totalDaysInMonth;
  const projectedExpense = averageDailyExpense * totalDaysInMonth;
  const projectedBalance = projectedIncome - projectedExpense;

  const observedRatio = observedDays / totalDaysInMonth;
  let confidence: ProjectionSummary['confidence'] = 'baixa';
  if (observedRatio >= 0.7) confidence = 'alta';
  else if (observedRatio >= 0.35) confidence = 'media';

  return {
    projectedIncome,
    projectedExpense,
    projectedBalance,
    incomeToDate,
    expenseToDate,
    observedDays,
    totalDaysInMonth,
    averageDailyIncome,
    averageDailyExpense,
    confidence,
  };
};

export const calculateCategoryMonthComparison = (
  transactions: Transaction[],
  referenceDate = new Date(),
): CategoryComparison[] => {
  const currentMonthTotals = aggregateMonthlyExpensesByCategory(transactions, referenceDate);
  const previousMonthTotals = aggregateMonthlyExpensesByCategory(
    transactions,
    subMonths(referenceDate, 1),
  );
  const labelMap = buildCategoryLabelMap(transactions);

  const allKeys = new Set<string>([...currentMonthTotals.keys(), ...previousMonthTotals.keys()]);

  return [...allKeys]
    .map((categoryKey) => {
      const currentMonthTotal = currentMonthTotals.get(categoryKey) || 0;
      const previousMonthTotal = previousMonthTotals.get(categoryKey) || 0;
      const absoluteChange = currentMonthTotal - previousMonthTotal;
      const percentageChange =
        previousMonthTotal > 0 ? (absoluteChange / previousMonthTotal) * 100 : null;

      return {
        categoryKey,
        categoryName: labelMap.get(categoryKey) || categoryKey,
        currentMonthTotal,
        previousMonthTotal,
        absoluteChange,
        percentageChange,
      };
    })
    .sort((a, b) => Math.abs(b.absoluteChange) - Math.abs(a.absoluteChange));
};

const getInsightSeverity = (absPercent: number): InsightAlert['severity'] => {
  if (absPercent >= 60) return 'critical';
  if (absPercent >= 35) return 'warning';
  return 'info';
};

export const generateSpendingInsights = (
  comparisons: CategoryComparison[],
  referenceDate = new Date(),
): InsightAlert[] => {
  const stamp = format(referenceDate, "yyyy-MM-dd'T'HH:mm:ss");

  const alerts: InsightAlert[] = [];

  comparisons
    .filter((comparison) => comparison.percentageChange !== null)
    .forEach((comparison) => {
      const percentageChange = comparison.percentageChange as number;
      const absolutePercent = Math.abs(percentageChange);
      const absoluteChange = comparison.absoluteChange;

      if (percentageChange >= INCREASE_THRESHOLD_PERCENT) {
        const summary = `${comparison.categoryName}: aumento de ${absolutePercent.toFixed(1)}% (${Math.abs(absoluteChange).toFixed(2)}) em relação ao mês anterior.`;
        alerts.push({
          id: createStableId('insight_inc', [comparison.categoryKey, stamp]),
          kind: 'increase',
          categoryKey: comparison.categoryKey,
          categoryName: comparison.categoryName,
          summary,
          absoluteChange,
          percentageChange,
          generatedAt: stamp,
          severity: getInsightSeverity(absolutePercent),
        });
        return;
      }

      if (percentageChange <= DECREASE_THRESHOLD_PERCENT) {
        const summary = `${comparison.categoryName}: redução de ${absolutePercent.toFixed(1)}% (${Math.abs(absoluteChange).toFixed(2)}) em relação ao mês anterior.`;
        alerts.push({
          id: createStableId('insight_dec', [comparison.categoryKey, stamp]),
          kind: 'decrease',
          categoryKey: comparison.categoryKey,
          categoryName: comparison.categoryName,
          summary,
          absoluteChange,
          percentageChange,
          generatedAt: stamp,
          severity: getInsightSeverity(absolutePercent),
        });
      }
    });

  return alerts.sort((a, b) => Math.abs(b.percentageChange) - Math.abs(a.percentageChange));
};

export const detectExpenseAnomalies = (
  transactions: Transaction[],
  referenceDate = new Date(),
): AnomalyAlert[] => {
  const monthStart = startOfMonth(referenceDate);
  const stamp = format(referenceDate, "yyyy-MM-dd'T'HH:mm:ss");
  const expensesByCategoryHistory = new Map<string, number[]>();
  const currentMonthExpenses = new Map<string, Transaction[]>();
  const labelMap = buildCategoryLabelMap(transactions);

  transactions.forEach((transaction) => {
    if (transaction.tipo !== 'despesa') return;

    const txDate = getTransactionDate(transaction);
    if (!txDate) return;

    const key = normalizeCategoryKey(transaction.categoria);
    const amount = Number(transaction.valor);

    if (isSameMonth(txDate, monthStart)) {
      const currentList = currentMonthExpenses.get(key) || [];
      currentList.push(transaction);
      currentMonthExpenses.set(key, currentList);
      return;
    }

    if (txDate < monthStart) {
      const historyList = expensesByCategoryHistory.get(key) || [];
      historyList.push(amount);
      expensesByCategoryHistory.set(key, historyList);
    }
  });

  const alerts: AnomalyAlert[] = [];

  currentMonthExpenses.forEach((monthTransactions, categoryKey) => {
    const history = expensesByCategoryHistory.get(categoryKey) || [];
    if (history.length < MIN_HISTORY_FOR_ANOMALY) return;

    const baselineAverage = history.reduce((acc, value) => acc + value, 0) / history.length;
    const threshold = baselineAverage * ANOMALY_FACTOR;

    monthTransactions.forEach((transaction) => {
      const value = Number(transaction.valor);
      if (value <= threshold) return;

      alerts.push({
        id: createStableId('anomaly', [categoryKey, transaction.id]),
        kind: 'anomaly',
        categoryKey,
        categoryName: labelMap.get(categoryKey) || categoryKey,
        summary: `${transaction.categoria}: despesa de ${value.toFixed(2)} acima do padrão histórico (${baselineAverage.toFixed(2)}).`,
        value,
        baselineAverage,
        threshold,
        generatedAt: transaction.data || stamp,
        severity: value >= threshold * 1.3 ? 'critical' : 'warning',
      });
    });
  });

  return alerts.sort((a, b) => b.value - a.value);
};

export const buildInsightsHistory = (
  transactions: Transaction[],
  referenceDate = new Date(),
): InsightHistoryEntry[] => {
  const comparisons = calculateCategoryMonthComparison(transactions, referenceDate);
  const spendingInsights = generateSpendingInsights(comparisons, referenceDate);
  const anomalies = detectExpenseAnomalies(transactions, referenceDate);

  return [...spendingInsights, ...anomalies].sort((a, b) =>
    b.generatedAt.localeCompare(a.generatedAt),
  );
};
