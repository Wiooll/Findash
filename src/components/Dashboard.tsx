import { useMemo } from 'react';
import { useFinance } from '../context/FinanceContext';
import {
  ArrowUpCircle,
  ArrowDownCircle,
  DollarSign,
  PiggyBank,
  AlertTriangle,
  ShieldAlert,
  CreditCard,
  Calendar,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { parseISO, format, isSameMonth, subMonths, startOfMonth, isAfter } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#E23670', '#26A69A', '#9C27B0'];

const formatCurrency = (val: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

export const Dashboard = () => {
  const { transactions, config, categoryBudgets, categories, cartoesCredito, getFaturasInfo } =
    useFinance();

  const currentMonth = startOfMonth(new Date());
  const anoMesAtual = format(new Date(), 'yyyy-MM');
  const anoMesProximo = format(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1), 'yyyy-MM');

  // ── Totais do mês ──────────────────────────────────────────────────────────
  const stats = useMemo(() => {
    let receitas = 0;
    let despesas = 0;
    let mesAtualReceitas = 0;
    let mesAtualDespesas = 0;

    transactions.forEach((t) => {
      if (t.tipo === 'transferencia') return; // ignora transferências nos totais
      const val = Number(t.valor);
      const isCurrentMonth = isSameMonth(parseISO(t.data), currentMonth);

      if (t.tipo === 'receita') {
        receitas += val;
        if (isCurrentMonth) mesAtualReceitas += val;
      } else {
        despesas += val;
        if (isCurrentMonth) mesAtualDespesas += val;
      }
    });

    const saldo = receitas - despesas;
    const economiaMes = mesAtualReceitas - mesAtualDespesas;

    return { saldo, receitas, despesas, mesAtualReceitas, mesAtualDespesas, economiaMes };
  }, [transactions, currentMonth]);

  // ── Faturas ────────────────────────────────────────────────────────────────
  const faturasAtuais = useMemo(() => getFaturasInfo(anoMesAtual), [getFaturasInfo, anoMesAtual]);
  const faturasProximas = useMemo(
    () => getFaturasInfo(anoMesProximo),
    [getFaturasInfo, anoMesProximo],
  );

  const totalFaturasAbertas = useMemo(
    () =>
      faturasAtuais
        .filter((f) => f.status !== 'paga')
        .reduce((acc, f) => acc + f.total, 0),
    [faturasAtuais],
  );

  const totalFaturasProximas = useMemo(
    () => faturasProximas.reduce((acc, f) => acc + f.total, 0),
    [faturasProximas],
  );

  // Próximo vencimento mais urgente (faturas não pagas)
  const proximoVencimento = useMemo(() => {
    const hoje = new Date();
    const pendentes = faturasAtuais
      .filter((f) => f.status !== 'paga' && f.total > 0)
      .map((f) => ({ ...f, vencDate: parseISO(f.dataVencimento) }))
      .filter((f) => isAfter(f.vencDate, hoje));

    if (pendentes.length === 0) return null;
    return pendentes.sort((a, b) => a.vencDate.getTime() - b.vencDate.getTime())[0];
  }, [faturasAtuais]);

  // ── Saldo real (descontando faturas em aberto) ─────────────────────────────
  const saldoAjustado = stats.saldo - totalFaturasAbertas;

  // ── Dados de categorias ────────────────────────────────────────────────────
  const categoryData = useMemo(() => {
    const data: Record<string, number> = {};
    transactions.forEach((t) => {
      if (t.tipo === 'despesa' && isSameMonth(parseISO(t.data), currentMonth)) {
        data[t.categoria] = (data[t.categoria] || 0) + Number(t.valor);
      }
    });
    return Object.entries(data)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [transactions, currentMonth]);

  const flowData = useMemo(() => {
    const data = [];
    for (let i = 11; i >= 0; i--) {
      const month = subMonths(currentMonth, i);
      let r = 0;
      let d = 0;
      transactions.forEach((t) => {
        if (t.tipo === 'transferencia') return;
        if (isSameMonth(parseISO(t.data), month)) {
          if (t.tipo === 'receita') r += Number(t.valor);
          else d += Number(t.valor);
        }
      });
      data.push({
        name: format(month, 'MMM', { locale: ptBR }),
        Receitas: r,
        Despesas: d,
      });
    }
    return data;
  }, [transactions, currentMonth]);

  const budgetRisks = useMemo(() => {
    const categoryById = new Map(categories.map((category) => [category.id, category]));
    const monthExpenses = new Map<string, number>();

    transactions.forEach((t) => {
      if (t.tipo !== 'despesa') return;
      if (!isSameMonth(parseISO(t.data), currentMonth)) return;
      monthExpenses.set(t.categoria, (monthExpenses.get(t.categoria) || 0) + Number(t.valor));
    });

    return categoryBudgets
      .map((budget) => {
        const category = categoryById.get(budget.categoryId);
        if (!category) return null;

        const spent = monthExpenses.get(category.nome) || 0;
        const limit = Number(budget.monthlyLimit);
        if (limit <= 0) return null;

        const percent = Math.round((spent / limit) * 100);

        return {
          categoryId: category.id,
          categoryName: category.nome,
          spent,
          limit,
          percent,
          status: percent >= 100 ? 'danger' : percent >= 80 ? 'warning' : 'safe',
        };
      })
      .filter((item): item is NonNullable<typeof item> => Boolean(item))
      .sort((a, b) => b.percent - a.percent);
  }, [categories, categoryBudgets, transactions, currentMonth]);

  const isEconomiaPositiva = stats.economiaMes >= 0;
  const isMetaAtingida = stats.economiaMes >= config.metaEconomiaMensal;

  const warningBudgets = budgetRisks.filter((item) => item.status === 'warning');
  const exceededBudgets = budgetRisks.filter((item) => item.status === 'danger');
  const riskCount = warningBudgets.length + exceededBudgets.length;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tight">Visão Geral</h2>

      {/* ── KPI Cards ─────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Saldo Total */}
        <div className="xl:col-span-1 bg-card p-5 rounded-xl border border-border shadow-sm flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute right-0 top-0 w-20 h-20 bg-primary/5 rounded-bl-[80px] -z-0 transition-transform group-hover:scale-110" />
          <div className="flex justify-between items-center z-10 mb-3">
            <p className="text-sm font-medium text-muted-foreground">Saldo Total</p>
            <DollarSign className="text-primary" size={18} />
          </div>
          <div className="z-10">
            <h3 className={`text-2xl font-bold ${stats.saldo >= 0 ? 'text-foreground' : 'text-danger'}`}>
              {formatCurrency(stats.saldo)}
            </h3>
            {totalFaturasAbertas > 0 && (
              <p className="text-xs text-muted-foreground mt-1">
                Real: <span className={`font-medium ${saldoAjustado >= 0 ? 'text-success' : 'text-danger'}`}>
                  {formatCurrency(saldoAjustado)}
                </span>
              </p>
            )}
          </div>
        </div>

        {/* Receitas do mês */}
        <div className="bg-card p-5 rounded-xl border border-border shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-center mb-3">
            <p className="text-sm font-medium text-muted-foreground">Receitas (Mês)</p>
            <ArrowUpCircle className="text-success" size={18} />
          </div>
          <h3 className="text-2xl font-bold text-foreground">{formatCurrency(stats.mesAtualReceitas)}</h3>
        </div>

        {/* Despesas do mês */}
        <div className="bg-card p-5 rounded-xl border border-border shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-center mb-3">
            <p className="text-sm font-medium text-muted-foreground">Despesas (Mês)</p>
            <ArrowDownCircle className="text-danger" size={18} />
          </div>
          <h3 className="text-2xl font-bold text-foreground">{formatCurrency(stats.mesAtualDespesas)}</h3>
        </div>

        {/* Economia do mês */}
        <div className={`bg-card p-5 rounded-xl border ${isMetaAtingida ? 'border-success/50' : 'border-border'} shadow-sm flex flex-col justify-between`}>
          <div className="flex justify-between items-center mb-3">
            <p className="text-sm font-medium text-muted-foreground">Economia (Mês)</p>
            <PiggyBank className={isEconomiaPositiva ? 'text-success' : 'text-danger'} size={18} />
          </div>
          <div>
            <h3 className={`text-2xl font-bold ${isEconomiaPositiva ? 'text-success' : 'text-danger'}`}>
              {formatCurrency(stats.economiaMes)}
            </h3>
            <p className="text-xs text-muted-foreground mt-1">Meta: {formatCurrency(config.metaEconomiaMensal)}</p>
          </div>
        </div>

        {/* Faturas em aberto */}
        {cartoesCredito.length > 0 && (
          <div className={`bg-card p-5 rounded-xl border ${totalFaturasAbertas > 0 ? 'border-orange-400/40' : 'border-border'} shadow-sm flex flex-col justify-between`}>
            <div className="flex justify-between items-center mb-3">
              <p className="text-sm font-medium text-muted-foreground">Faturas em Aberto</p>
              <CreditCard className={totalFaturasAbertas > 0 ? 'text-orange-500' : 'text-muted-foreground'} size={18} />
            </div>
            <div>
              <h3 className={`text-2xl font-bold ${totalFaturasAbertas > 0 ? 'text-orange-600 dark:text-orange-400' : 'text-foreground'}`}>
                {formatCurrency(totalFaturasAbertas)}
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                Próx. fatura: {formatCurrency(totalFaturasProximas)}
              </p>
            </div>
          </div>
        )}

        {/* Categorias em risco */}
        <div className={`bg-card p-5 rounded-xl border ${riskCount > 0 ? 'border-amber-500/40' : 'border-border'} shadow-sm flex flex-col justify-between`}>
          <div className="flex justify-between items-center mb-3">
            <p className="text-sm font-medium text-muted-foreground">Categorias em Risco</p>
            <ShieldAlert className={riskCount > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-muted-foreground'} size={18} />
          </div>
          <div>
            <h3 className={`text-2xl font-bold ${riskCount > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-foreground'}`}>
              {riskCount}
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              {riskCount > 0 ? 'Acima de 80% do orçamento' : 'Nenhum em risco'}
            </p>
          </div>
        </div>
      </div>

      {/* ── Alertas ────────────────────────────────────────────────────────── */}
      {proximoVencimento && (
        <div className="bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400 p-4 rounded-lg flex items-center gap-3">
          <Calendar size={18} />
          <p className="text-sm font-medium">
            Próximo vencimento: <strong>{proximoVencimento.cartaoNome}</strong> —{' '}
            {formatCurrency(proximoVencimento.total)} em{' '}
            {format(parseISO(proximoVencimento.dataVencimento), "dd/MM/yyyy")}
          </p>
        </div>
      )}

      {!isMetaAtingida && stats.mesAtualDespesas > 0 && (
        <div className="bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 p-4 rounded-lg flex items-center gap-3">
          <AlertTriangle size={18} />
          <p className="text-sm font-medium">
            Atenção: sua economia deste mês está abaixo da meta de{' '}
            {formatCurrency(config.metaEconomiaMensal)}.
          </p>
        </div>
      )}

      {categoryData.length > 0 && categoryData[0].value > stats.mesAtualDespesas * 0.4 && (
        <div className="bg-danger/10 border border-danger/20 text-danger p-4 rounded-lg flex items-center gap-3">
          <AlertTriangle size={18} />
          <p className="text-sm font-medium">
            Alerta: a categoria <strong>{categoryData[0].name}</strong> representa{' '}
            {Math.round((categoryData[0].value / stats.mesAtualDespesas) * 100)}% dos seus gastos.
          </p>
        </div>
      )}

      {exceededBudgets.slice(0, 2).map((item) => (
        <div key={item.categoryId} className="bg-danger/10 border border-danger/20 text-danger p-4 rounded-lg flex items-center gap-3">
          <AlertTriangle size={18} />
          <p className="text-sm font-medium">
            Orçamento estourado em <strong>{item.categoryName}</strong>: {formatCurrency(item.spent)} de{' '}
            {formatCurrency(item.limit)} ({item.percent}%).
          </p>
        </div>
      ))}

      {warningBudgets.slice(0, 2).map((item) => (
        <div key={item.categoryId} className="bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 p-4 rounded-lg flex items-center gap-3">
          <AlertTriangle size={18} />
          <p className="text-sm font-medium">
            Atenção em <strong>{item.categoryName}</strong>: {item.percent}% do orçamento consumido.
          </p>
        </div>
      ))}

      {/* ── Resumo de faturas por cartão ───────────────────────────────────── */}
      {cartoesCredito.length > 0 && faturasAtuais.some((f) => f.total > 0) && (
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <CreditCard size={16} className="text-primary" />
            Faturas de Cartão — {format(new Date(), "MMMM 'de' yyyy", { locale: ptBR })}
          </h3>
          <div className="space-y-3">
            {faturasAtuais
              .filter((f) => f.total > 0)
              .map((fatura) => {
                const cartao = cartoesCredito.find((c) => c.id === fatura.cartaoId);
                const maxTotal = Math.max(...faturasAtuais.map((f) => f.total), 1);
                const pct = Math.min((fatura.total / maxTotal) * 100, 100);
                const statusColors: Record<string, string> = {
                  aberta: 'bg-orange-400',
                  fechada: 'bg-blue-400',
                  paga: 'bg-success',
                };
                return (
                  <div key={fatura.cartaoId} className="flex items-center gap-3">
                    <div
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: cartao?.cor || '#888' }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-medium truncate">{fatura.cartaoNome}</span>
                        <span className={`font-semibold ${fatura.status === 'paga' ? 'text-success' : 'text-foreground'}`}>
                          {formatCurrency(fatura.total)}
                        </span>
                      </div>
                      <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${statusColors[fatura.status] || 'bg-primary'}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <div className="flex justify-between mt-0.5 text-xs text-muted-foreground">
                        <span>Vence: {format(parseISO(fatura.dataVencimento), 'dd/MM')}</span>
                        <span>
                          {fatura.status === 'paga' ? '✓ Paga' : fatura.status === 'fechada' ? 'Fechada' : 'Em aberto'}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* ── Gráficos ───────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card p-6 rounded-xl border border-border flex flex-col shadow-sm">
          <h3 className="font-semibold mb-6">Fluxo de Caixa — Últimos 12 meses</h3>
          <div className="flex-1 min-h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={flowData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `R$${v}`} />
                <Tooltip
                  cursor={{ fill: 'hsl(var(--muted))', opacity: 0.2 }}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    borderColor: 'hsl(var(--border))',
                    color: 'hsl(var(--foreground))',
                    borderRadius: '8px',
                  }}
                  itemStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar dataKey="Receitas" fill="hsl(var(--success))" radius={[4, 4, 0, 0]} maxBarSize={40} />
                <Bar dataKey="Despesas" fill="hsl(var(--danger))" radius={[4, 4, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-card p-6 rounded-xl border border-border flex flex-col shadow-sm">
          <h3 className="font-semibold mb-6">Despesas por Categoria</h3>
          <div className="flex-1 min-h-[280px] flex items-center justify-center">
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={95}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {categoryData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: unknown) => {
                      const v = Array.isArray(value) ? Number(value[0] || 0) : Number(value || 0);
                      return formatCurrency(v);
                    }}
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      borderColor: 'hsl(var(--border))',
                      color: 'hsl(var(--foreground))',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend layout="horizontal" verticalAlign="bottom" align="center" iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-muted-foreground text-sm">Nenhuma despesa registrada neste mês.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
