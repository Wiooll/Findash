import { useState, useMemo } from 'react';
import { useFinance } from '../context/FinanceContext';
import type { CartaoCredito } from '../types';
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Check,
  CreditCard,
  ChevronLeft,
  ChevronRight,
  BadgeCheck,
  Clock,
  AlertCircle,
} from 'lucide-react';
import { format, addMonths, subMonths, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const CORES_PADRAO = [
  '#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f97316',
  '#eab308', '#22c55e', '#14b8a6', '#0ea5e9', '#3b82f6',
];

const formatCurrency = (val: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

const emptyForm = (): Omit<CartaoCredito, 'id' | 'createdAt' | 'updatedAt'> => ({
  nome: '',
  limite: 0,
  diaFechamento: 10,
  diaVencimento: 17,
  cor: CORES_PADRAO[0],
  contaDebitoId: '',
});

const STATUS_CONFIG = {
  aberta: { label: 'Em aberto', icon: Clock, cls: 'text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20' },
  fechada: { label: 'Fechada', icon: AlertCircle, cls: 'text-blue-600 dark:text-blue-400 bg-blue-500/10 border-blue-500/20' },
  paga: { label: 'Paga', icon: BadgeCheck, cls: 'text-success bg-success/10 border-success/20' },
};

export const CreditCards = () => {
  const {
    cartoesCredito,
    contas,
    getFaturasInfo,
    getLimiteDisponivel,
    addCartaoCredito,
    updateCartaoCredito,
    deleteCartaoCredito,
    pagarFatura,
  } = useFinance();

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm());
  const [saving, setSaving] = useState(false);

  // Mês de referência para visualização da fatura
  const [anoMesRef, setAnoMesRef] = useState(format(new Date(), 'yyyy-MM'));

  // Cartão selecionado para ver detalhe da fatura
  const [cartaoSelecionado, setCartaoSelecionado] = useState<string | null>(null);

  const refDate = useMemo(() => {
    const [ano, mes] = anoMesRef.split('-').map(Number);
    return new Date(ano, mes - 1, 1);
  }, [anoMesRef]);

  const faturasAtuais = useMemo(() => getFaturasInfo(anoMesRef), [getFaturasInfo, anoMesRef]);
  const faturaProxima = useMemo(
    () => getFaturasInfo(format(addMonths(refDate, 1), 'yyyy-MM')),
    [getFaturasInfo, refDate],
  );

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm());
    setShowModal(true);
  };

  const openEdit = (cartao: CartaoCredito) => {
    setEditingId(cartao.id);
    setForm({
      nome: cartao.nome,
      limite: cartao.limite,
      diaFechamento: cartao.diaFechamento,
      diaVencimento: cartao.diaVencimento,
      cor: cartao.cor,
      contaDebitoId: cartao.contaDebitoId,
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.nome.trim() || form.limite <= 0) return;
    setSaving(true);
    try {
      if (editingId) {
        await updateCartaoCredito(editingId, form);
      } else {
        await addCartaoCredito(form);
      }
      setShowModal(false);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja excluir este cartão? Transações vinculadas não serão afetadas.')) return;
    await deleteCartaoCredito(id);
    if (cartaoSelecionado === id) setCartaoSelecionado(null);
  };

  const handlePagarFatura = async (cartaoId: string) => {
    const faturaInfo = faturasAtuais.find((f) => f.cartaoId === cartaoId);
    if (!faturaInfo) return;
    if (faturaInfo.status === 'paga') { alert('Esta fatura já foi paga.'); return; }
    if (faturaInfo.total <= 0) { alert('Não há valor a pagar nesta fatura.'); return; }
    if (!confirm(`Confirmar pagamento de ${formatCurrency(faturaInfo.total)} para o cartão ${faturaInfo.cartaoNome}?`)) return;
    await pagarFatura(cartaoId, anoMesRef);
  };

  const cartaoDetalhe = cartoesCredito.find((c) => c.id === cartaoSelecionado);
  const faturaDetalhe = faturasAtuais.find((f) => f.cartaoId === cartaoSelecionado);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Cartões de Crédito</h2>
          <p className="text-muted-foreground text-sm mt-1">
            Gerencie seus cartões, faturas e parcelamentos.
          </p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-medium transition-colors"
        >
          <Plus size={16} /> Novo Cartão
        </button>
      </div>

      {/* Navegação de mês */}
      <div className="flex items-center gap-3 bg-card border border-border rounded-xl px-4 py-3 w-fit">
        <button
          onClick={() => setAnoMesRef(format(subMonths(refDate, 1), 'yyyy-MM'))}
          className="p-1.5 rounded-md hover:bg-secondary transition-colors text-muted-foreground"
        >
          <ChevronLeft size={16} />
        </button>
        <span className="text-sm font-semibold capitalize min-w-[130px] text-center">
          {format(refDate, "MMMM 'de' yyyy", { locale: ptBR })}
        </span>
        <button
          onClick={() => setAnoMesRef(format(addMonths(refDate, 1), 'yyyy-MM'))}
          className="p-1.5 rounded-md hover:bg-secondary transition-colors text-muted-foreground"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {cartoesCredito.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground">
          <CreditCard size={48} className="mb-4 opacity-30" />
          <p className="text-lg font-medium">Nenhum cartão cadastrado</p>
          <p className="text-sm mt-1">Clique em "Novo Cartão" para adicionar.</p>
        </div>
      ) : (
        <>
          {/* Cards dos cartões */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {cartoesCredito.map((cartao) => {
              const faturaAtual = faturasAtuais.find((f) => f.cartaoId === cartao.id);
              const proxFatura = faturaProxima.find((f) => f.cartaoId === cartao.id);
              const limiteDisp = getLimiteDisponivel(cartao.id);
              const usado = cartao.limite - limiteDisp;
              const percentUsado = cartao.limite > 0 ? Math.min((usado / cartao.limite) * 100, 100) : 0;
              const status = faturaAtual?.status ?? 'aberta';
              const StatusIcon = STATUS_CONFIG[status].icon;
              const isSelected = cartaoSelecionado === cartao.id;

              return (
                <div
                  key={cartao.id}
                  className={`bg-card border rounded-xl shadow-sm overflow-hidden transition-all ${
                    isSelected ? 'ring-2 ring-primary border-primary/30' : 'border-border hover:shadow-md'
                  }`}
                >
                  {/* Visual do cartão */}
                  <div
                    className="relative p-5 text-white"
                    style={{
                      background: `linear-gradient(135deg, ${cartao.cor}dd, ${cartao.cor}88)`,
                    }}
                  >
                    <div className="flex justify-between items-start mb-6">
                      <p className="font-bold text-lg drop-shadow">{cartao.nome}</p>
                      <div className="flex gap-1">
                        <button
                          onClick={() => openEdit(cartao)}
                          className="p-1.5 rounded-md bg-white/20 hover:bg-white/30 transition-colors"
                        >
                          <Pencil size={12} />
                        </button>
                        <button
                          onClick={() => handleDelete(cartao.id)}
                          className="p-1.5 rounded-md bg-white/20 hover:bg-white/30 transition-colors"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-xs opacity-75">Limite disponível</p>
                        <p className="text-2xl font-bold">{formatCurrency(limiteDisp)}</p>
                        <p className="text-xs opacity-75">de {formatCurrency(cartao.limite)}</p>
                      </div>
                      <CreditCard size={36} className="opacity-30" />
                    </div>

                    {/* Barra de uso do limite */}
                    <div className="mt-3">
                      <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-white rounded-full transition-all duration-500"
                          style={{ width: `${percentUsado}%` }}
                        />
                      </div>
                      <p className="text-xs opacity-75 mt-1">{percentUsado.toFixed(0)}% utilizado</p>
                    </div>
                  </div>

                  {/* Info da fatura */}
                  <div className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-muted-foreground">Fatura {anoMesRef}</p>
                      <span
                        className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border font-medium ${STATUS_CONFIG[status].cls}`}
                      >
                        <StatusIcon size={10} />
                        {STATUS_CONFIG[status].label}
                      </span>
                    </div>

                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-2xl font-bold text-foreground">
                          {formatCurrency(faturaAtual?.total ?? 0)}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Vence em {faturaAtual?.dataVencimento
                            ? (() => {
                                try { return format(parseISO(faturaAtual.dataVencimento), "dd/MM/yyyy"); }
                                catch { return faturaAtual.dataVencimento; }
                              })()
                            : '--'}
                        </p>
                      </div>
                    </div>

                    {proxFatura && proxFatura.total > 0 && (
                      <div className="bg-secondary/50 rounded-lg p-2.5 text-xs text-muted-foreground">
                        Próxima fatura: <span className="font-semibold text-foreground">{formatCurrency(proxFatura.total)}</span>
                      </div>
                    )}

                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={() => setCartaoSelecionado(isSelected ? null : cartao.id)}
                        className="flex-1 px-3 py-2 border border-border rounded-lg text-xs font-medium hover:bg-secondary transition-colors"
                      >
                        {isSelected ? 'Fechar detalhes' : 'Ver lançamentos'}
                      </button>
                      <button
                        onClick={() => handlePagarFatura(cartao.id)}
                        disabled={status === 'paga' || (faturaAtual?.total ?? 0) === 0}
                        className="flex-1 px-3 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-medium hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        {status === 'paga' ? 'Fatura Paga ✓' : 'Pagar Fatura'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Detalhes da fatura do cartão selecionado */}
          {cartaoDetalhe && faturaDetalhe && (
            <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
              <div className="p-4 border-b border-border bg-secondary/30 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: cartaoDetalhe.cor }}
                  />
                  <h3 className="font-semibold text-sm">
                    Lançamentos — {cartaoDetalhe.nome} · {format(refDate, "MMMM yyyy", { locale: ptBR })}
                  </h3>
                  <span className="text-xs text-muted-foreground">
                    Fechamento: dia {cartaoDetalhe.diaFechamento} · Vencimento: dia {cartaoDetalhe.diaVencimento}
                  </span>
                </div>
                <button
                  onClick={() => setCartaoSelecionado(null)}
                  className="p-1 rounded hover:bg-secondary text-muted-foreground"
                >
                  <X size={14} />
                </button>
              </div>

              {faturaDetalhe.transacoes.length === 0 ? (
                <p className="p-6 text-center text-muted-foreground text-sm">
                  Nenhum lançamento neste período de fatura.
                </p>
              ) : (
                <>
                  <div className="divide-y divide-border">
                    {faturaDetalhe.transacoes.map((tx) => (
                      <div
                        key={tx.id}
                        className="flex items-center justify-between px-4 py-3 text-sm hover:bg-secondary/20 transition-colors"
                      >
                        <div className="flex-1 min-w-0 mr-4">
                          <p className="font-medium text-foreground truncate">{tx.descricao}</p>
                          <p className="text-xs text-muted-foreground">
                            {(() => {
                              try { return format(parseISO(tx.data), "dd 'de' MMM", { locale: ptBR }); }
                              catch { return tx.data; }
                            })()}
                            {' · '}{tx.categoria}
                            {tx.totalParcelas && (
                              <span className="ml-1 bg-primary/10 text-primary rounded px-1 font-mono">
                                {tx.parcelaAtual}/{tx.totalParcelas}
                              </span>
                            )}
                          </p>
                        </div>
                        <span className="font-semibold text-danger whitespace-nowrap">
                          {formatCurrency(tx.valor)}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="p-4 border-t border-border bg-secondary/20 flex justify-between font-semibold">
                    <span>Total da fatura</span>
                    <span className="text-danger">{formatCurrency(faturaDetalhe.total)}</span>
                  </div>
                </>
              )}
            </div>
          )}
        </>
      )}

      {/* Modal Adicionar/Editar Cartão */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold">
                {editingId ? 'Editar Cartão' : 'Novo Cartão de Crédito'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 rounded-lg hover:bg-secondary text-muted-foreground"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground block mb-1.5">
                  Nome do cartão *
                </label>
                <input
                  type="text"
                  placeholder="Ex: Nubank Roxo, Itaú Visa..."
                  value={form.nome}
                  onChange={(e) => setForm({ ...form, nome: e.target.value })}
                  className="w-full bg-background border border-input rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground block mb-1.5">
                  Limite (R$) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0,00"
                  value={form.limite || ''}
                  onChange={(e) => setForm({ ...form, limite: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-background border border-input rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-muted-foreground block mb-1.5">
                    Dia do fechamento
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="28"
                    value={form.diaFechamento}
                    onChange={(e) =>
                      setForm({ ...form, diaFechamento: Math.min(28, Math.max(1, parseInt(e.target.value) || 1)) })
                    }
                    className="w-full bg-background border border-input rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground block mb-1.5">
                    Dia do vencimento
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="28"
                    value={form.diaVencimento}
                    onChange={(e) =>
                      setForm({ ...form, diaVencimento: Math.min(28, Math.max(1, parseInt(e.target.value) || 1)) })
                    }
                    className="w-full bg-background border border-input rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground block mb-1.5">
                  Conta para débito da fatura
                </label>
                <select
                  value={form.contaDebitoId}
                  onChange={(e) => setForm({ ...form, contaDebitoId: e.target.value })}
                  className="w-full bg-background border border-input rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">Nenhuma (pagamento manual)</option>
                  {contas.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nome}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground block mb-1.5">
                  Cor de identificação
                </label>
                <div className="flex gap-2 flex-wrap">
                  {CORES_PADRAO.map((cor) => (
                    <button
                      key={cor}
                      onClick={() => setForm({ ...form, cor })}
                      className={`w-7 h-7 rounded-full transition-transform ${
                        form.cor === cor ? 'ring-2 ring-offset-2 ring-ring scale-110' : 'hover:scale-105'
                      }`}
                      style={{ backgroundColor: cor }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-secondary transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={!form.nome.trim() || form.limite <= 0 || saving}
                className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Check size={16} />
                {saving ? 'Salvando...' : editingId ? 'Salvar Alterações' : 'Criar Cartão'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
