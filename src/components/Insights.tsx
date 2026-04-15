import { useMemo, useState } from 'react';
import { AlertTriangle, ArrowDownCircle, ArrowUpCircle, Filter, TrendingUp } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { useFinance } from '../context/FinanceContext';
import { buildInsightsHistory } from '../utils/financialInsights';
import type { InsightHistoryEntry } from '../types';

type InsightFilter = 'all' | 'increase' | 'decrease' | 'anomaly';

const formatCurrency = (val: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

const badgeByType: Record<InsightFilter, string> = {
  all: 'bg-secondary text-secondary-foreground',
  increase: 'bg-danger/10 text-danger',
  decrease: 'bg-success/10 text-success',
  anomaly: 'bg-amber-500/10 text-amber-700 dark:text-amber-400',
};

const iconByType = (kind: InsightHistoryEntry['kind']) => {
  if (kind === 'increase') return <ArrowUpCircle size={15} className="text-danger" />;
  if (kind === 'decrease') return <ArrowDownCircle size={15} className="text-success" />;
  return <AlertTriangle size={15} className="text-amber-600 dark:text-amber-400" />;
};

export const Insights = () => {
  const { transactions } = useFinance();
  const [filter, setFilter] = useState<InsightFilter>('all');
  const history = useMemo(() => buildInsightsHistory(transactions, new Date()), [transactions]);

  const filteredHistory = useMemo(() => {
    if (filter === 'all') return history;
    return history.filter((entry) => entry.kind === filter);
  }, [history, filter]);

  const totals = useMemo(
    () => ({
      all: history.length,
      increase: history.filter((item) => item.kind === 'increase').length,
      decrease: history.filter((item) => item.kind === 'decrease').length,
      anomaly: history.filter((item) => item.kind === 'anomaly').length,
    }),
    [history],
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Insights</h2>
          <p className="text-sm text-muted-foreground">
            Historico de alertas automaticos de variacao e anomalia.
          </p>
        </div>
        <div className="bg-card border border-border rounded-lg px-3 py-2 text-sm flex items-center gap-2">
          <TrendingUp size={16} className="text-primary" />
          <span>Total de alertas:</span>
          <strong>{totals.all}</strong>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {(Object.keys(totals) as InsightFilter[]).map((key) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`p-3 rounded-xl border transition-colors text-left ${
              filter === key
                ? 'border-primary bg-primary/5'
                : 'border-border bg-card hover:bg-secondary/40'
            }`}
          >
            <p className="text-xs uppercase text-muted-foreground">{key === 'all' ? 'todos' : key}</p>
            <p className="text-xl font-semibold mt-1">{totals[key]}</p>
          </button>
        ))}
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-secondary/20">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Filter size={15} />
            <span>Filtro atual: {filter === 'all' ? 'todos' : filter}</span>
          </div>
          <span className="text-xs text-muted-foreground">{filteredHistory.length} itens</span>
        </div>

        {filteredHistory.length === 0 ? (
          <div className="px-4 py-8 text-center text-muted-foreground text-sm">
            Nenhum insight encontrado para o filtro selecionado.
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filteredHistory.map((entry) => {
              const typeLabel =
                entry.kind === 'increase'
                  ? 'aumento'
                  : entry.kind === 'decrease'
                    ? 'reducao'
                    : 'anomalia';

              const generatedAt = (() => {
                try {
                  return format(parseISO(entry.generatedAt), 'dd/MM/yyyy HH:mm');
                } catch {
                  return entry.generatedAt;
                }
              })();

              return (
                <div key={entry.id} className="px-4 py-3 flex items-start gap-3">
                  <div className="mt-0.5">{iconByType(entry.kind)}</div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          badgeByType[entry.kind]
                        }`}
                      >
                        {typeLabel}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {generatedAt}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Categoria: <strong>{entry.categoryName}</strong>
                      </span>
                    </div>
                    <p className="text-sm">{entry.summary}</p>

                    {entry.kind === 'anomaly' ? (
                      <p className="text-xs text-muted-foreground mt-1">
                        Valor: {formatCurrency(entry.value)} | Base: {formatCurrency(entry.baselineAverage)} | Limiar: {formatCurrency(entry.threshold)}
                      </p>
                    ) : (
                      <p className="text-xs text-muted-foreground mt-1">
                        Variacao: {entry.percentageChange.toFixed(1)}% | Delta: {formatCurrency(entry.absoluteChange)}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
