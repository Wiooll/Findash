import { useFinance } from '../context/FinanceContext';
import { Target, TrendingUp, AlertTriangle } from 'lucide-react';
import { parseISO, isSameMonth, startOfMonth } from 'date-fns';

export const Goals = () => {
  const { config, updateConfig, transactions } = useFinance();

  const currentMonth = startOfMonth(new Date());

  let mesAtualReceitas = 0;
  let mesAtualDespesas = 0;

  transactions.forEach(t => {
    const isCurrentMonth = isSameMonth(parseISO(t.data), currentMonth);
    if (isCurrentMonth) {
      if (t.tipo === 'receita') mesAtualReceitas += Number(t.valor);
      else mesAtualDespesas += Number(t.valor);
    }
  });

  const economiaMes = mesAtualReceitas - mesAtualDespesas;
  
  // Calculate percentage
  let progress = 0;
  if (config.metaEconomiaMensal > 0) {
    if (economiaMes <= 0) progress = 0;
    else {
      progress = Math.min(100, Math.round((economiaMes / config.metaEconomiaMensal) * 100));
    }
  }

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  const isMetaAtingida = economiaMes >= config.metaEconomiaMensal;
  const isNegativo = economiaMes < 0;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-2">
        <Target size={24} />
        <h2 className="text-2xl font-bold tracking-tight">Metas Financeiras</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-card border border-border p-6 rounded-xl shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-semibold text-lg flex items-center gap-2 mb-4">
              <TrendingUp size={20} className="text-primary" />
              Progresso da Meta Mensal
            </h3>
            
            <div className="mb-2 flex justify-between items-end">
              <div>
                <span className="text-3xl font-bold">{formatCurrency(economiaMes)}</span>
                <span className="text-muted-foreground ml-2 text-sm">economizados</span>
              </div>
              <div className="text-right">
                <span className="text-sm text-muted-foreground">Meta:</span>
                <span className="font-medium ml-1">{formatCurrency(config.metaEconomiaMensal)}</span>
              </div>
            </div>

            <div className="h-4 w-full bg-secondary rounded-full overflow-hidden mb-2 border border-border">
              <div 
                className={`h-full transition-all duration-1000 ease-in-out ${isMetaAtingida ? 'bg-success' : 'bg-primary'}`} 
                style={{ width: `${progress}%` }}
              />
            </div>
            
            <div className="flex justify-between items-center text-xs">
              <span className="text-muted-foreground">0%</span>
              <span className="font-bold">{progress}%</span>
              <span className="text-muted-foreground">100%</span>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-border">
            {isMetaAtingida ? (
              <div className="flex items-center gap-2 text-success bg-success/10 p-3 rounded-lg border border-success/20">
                <Target size={18} />
                <span className="font-medium">Parabéns! Você atingiu sua meta de economia este mês.</span>
              </div>
            ) : isNegativo ? (
              <div className="flex items-center gap-2 text-danger bg-danger/10 p-3 rounded-lg border border-danger/20">
                <AlertTriangle size={18} />
                <span className="font-medium">Atenção! Suas despesas superaram suas receitas neste mês.</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-info bg-info/10 p-3 rounded-lg border border-info/20">
                <TrendingUp size={18} />
                <span className="font-medium">Você está no caminho! Faltam {formatCurrency(config.metaEconomiaMensal - economiaMes)} para atingir sua meta.</span>
              </div>
            )}
          </div>
        </div>

        <div className="bg-card border border-border p-6 rounded-xl shadow-sm h-fit">
          <h3 className="font-semibold text-lg mb-4">Configurar Meta</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                Meta de Economia Mensal
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">R$</span>
                <input 
                  type="number" 
                  value={config.metaEconomiaMensal} 
                  onChange={(e) => updateConfig({ metaEconomiaMensal: parseFloat(e.target.value) || 0 })}
                  className="w-full pl-9 pr-4 py-2 bg-background border border-input rounded-lg text-sm focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                  step="100"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Defina o valor mínimo que você deseja guardar ou investir todos os meses.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
