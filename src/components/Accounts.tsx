import { useState, useMemo } from 'react';
import { useFinance } from '../context/FinanceContext';
import type { Conta, TipoConta } from '../types';
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Check,
  ArrowLeftRight,
  Landmark,
  Wallet,
  PiggyBank,
  TrendingUp,
  Banknote,
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const TIPO_LABELS: Record<TipoConta, string> = {
  corrente: 'Conta Corrente',
  poupanca: 'Poupança',
  dinheiro: 'Dinheiro',
  investimento: 'Investimento',
};

const CORES_PADRAO = [
  '#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f97316',
  '#eab308', '#22c55e', '#14b8a6', '#0ea5e9', '#3b82f6',
];

const TipoIcon = ({ tipo, size = 20 }: { tipo: TipoConta; size?: number }) => {
  const cls = `w-[${size}px] h-[${size}px]`;
  if (tipo === 'corrente') return <Landmark size={size} className={cls} />;
  if (tipo === 'poupanca') return <PiggyBank size={size} className={cls} />;
  if (tipo === 'investimento') return <TrendingUp size={size} className={cls} />;
  return <Banknote size={size} className={cls} />;
};

const formatCurrency = (val: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

const emptyForm = (): Omit<Conta, 'id' | 'createdAt' | 'updatedAt'> => ({
  nome: '',
  tipo: 'corrente',
  saldoInicial: 0,
  cor: CORES_PADRAO[0],
  icone: 'landmark',
});

interface TransferenciaForm {
  contaOrigemId: string;
  contaDestinoId: string;
  valor: string;
  data: string;
  descricao: string;
}

export const Accounts = () => {
  const { contas, transactions, getSaldoConta, addConta, updateConta, deleteConta, transferir } =
    useFinance();

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm());

  const [showTransferModal, setShowTransferModal] = useState(false);
  const [transferForm, setTransferForm] = useState<TransferenciaForm>({
    contaOrigemId: '',
    contaDestinoId: '',
    valor: '',
    data: new Date().toISOString().split('T')[0],
    descricao: 'Transferência',
  });
  const [transferError, setTransferError] = useState('');
  const [savingTransfer, setSavingTransfer] = useState(false);

  const [contaSelecionada, setContaSelecionada] = useState<string | null>(null);

  // Saldos calculados
  const saldos = useMemo(() => {
    const map: Record<string, number> = {};
    contas.forEach((c) => { map[c.id] = getSaldoConta(c.id); });
    return map;
  }, [contas, getSaldoConta]);

  const saldoTotal = useMemo(
    () => Object.values(saldos).reduce((acc, v) => acc + v, 0),
    [saldos],
  );

  // Transações da conta selecionada
  const txsDaConta = useMemo(() => {
    if (!contaSelecionada) return [];
    return transactions
      .filter((t) => t.contaId === contaSelecionada)
      .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
      .slice(0, 20);
  }, [transactions, contaSelecionada]);

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm());
    setShowModal(true);
  };

  const openEdit = (conta: Conta) => {
    setEditingId(conta.id);
    setForm({
      nome: conta.nome,
      tipo: conta.tipo,
      saldoInicial: conta.saldoInicial,
      cor: conta.cor,
      icone: conta.icone,
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.nome.trim()) return;
    if (editingId) {
      await updateConta(editingId, form);
    } else {
      await addConta(form);
    }
    setShowModal(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja excluir esta conta? As transações vinculadas não serão afetadas.')) return;
    await deleteConta(id);
    if (contaSelecionada === id) setContaSelecionada(null);
  };

  const handleTransferir = async () => {
    setTransferError('');
    const valor = parseFloat(transferForm.valor);
    if (!transferForm.contaOrigemId || !transferForm.contaDestinoId) {
      setTransferError('Selecione as contas de origem e destino.');
      return;
    }
    if (transferForm.contaOrigemId === transferForm.contaDestinoId) {
      setTransferError('Origem e destino não podem ser a mesma conta.');
      return;
    }
    if (!valor || valor <= 0) {
      setTransferError('Informe um valor válido maior que zero.');
      return;
    }
    if (!transferForm.data) {
      setTransferError('Informe a data da transferência.');
      return;
    }

    setSavingTransfer(true);
    try {
      await transferir({
        contaOrigemId: transferForm.contaOrigemId,
        contaDestinoId: transferForm.contaDestinoId,
        valor,
        data: transferForm.data,
        descricao: transferForm.descricao || 'Transferência',
      });
      setShowTransferModal(false);
      setTransferForm({
        contaOrigemId: '',
        contaDestinoId: '',
        valor: '',
        data: new Date().toISOString().split('T')[0],
        descricao: 'Transferência',
      });
    } catch (err) {
      setTransferError('Erro ao registrar transferência. Tente novamente.');
    } finally {
      setSavingTransfer(false);
    }
  };

  const contaSel = contas.find((c) => c.id === contaSelecionada);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Contas e Carteiras</h2>
          <p className="text-muted-foreground text-sm mt-1">
            Saldo total:{' '}
            <span className={`font-semibold ${saldoTotal >= 0 ? 'text-success' : 'text-danger'}`}>
              {formatCurrency(saldoTotal)}
            </span>
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => { setShowTransferModal(true); setTransferError(''); }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-secondary text-secondary-foreground hover:bg-secondary/80 text-sm font-medium transition-colors"
          >
            <ArrowLeftRight size={16} /> Transferir
          </button>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-medium transition-colors"
          >
            <Plus size={16} /> Nova Conta
          </button>
        </div>
      </div>

      {/* Cards de contas */}
      {contas.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground">
          <Wallet size={48} className="mb-4 opacity-30" />
          <p className="text-lg font-medium">Nenhuma conta cadastrada</p>
          <p className="text-sm mt-1">Clique em "Nova Conta" para começar.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {contas.map((conta) => {
            const saldo = saldos[conta.id] ?? 0;
            const isSelected = contaSelecionada === conta.id;
            return (
              <button
                key={conta.id}
                onClick={() => setContaSelecionada(isSelected ? null : conta.id)}
                className={`text-left p-5 rounded-xl border transition-all shadow-sm relative overflow-hidden group ${
                  isSelected
                    ? 'ring-2 ring-primary border-primary/30 bg-primary/5'
                    : 'border-border bg-card hover:shadow-md hover:-translate-y-0.5'
                }`}
              >
                {/* Gradiente decorativo */}
                <div
                  className="absolute top-0 right-0 w-20 h-20 rounded-bl-full opacity-10 transition-opacity group-hover:opacity-20"
                  style={{ backgroundColor: conta.cor }}
                />

                <div className="flex items-start justify-between mb-4 relative">
                  <div
                    className="p-2.5 rounded-lg text-white"
                    style={{ backgroundColor: conta.cor }}
                  >
                    <TipoIcon tipo={conta.tipo} size={18} />
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => { e.stopPropagation(); openEdit(conta); }}
                      className="p-1.5 rounded-md hover:bg-secondary transition-colors text-muted-foreground hover:text-primary"
                    >
                      <Pencil size={13} />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(conta.id); }}
                      className="p-1.5 rounded-md hover:bg-danger/10 transition-colors text-muted-foreground hover:text-danger"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground mb-0.5">{TIPO_LABELS[conta.tipo]}</p>
                <p className="font-semibold text-foreground truncate">{conta.nome}</p>
                <p
                  className={`text-2xl font-bold mt-2 ${saldo >= 0 ? 'text-foreground' : 'text-danger'}`}
                >
                  {formatCurrency(saldo)}
                </p>
              </button>
            );
          })}
        </div>
      )}

      {/* Extrato da conta selecionada */}
      {contaSel && (
        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-border bg-secondary/30 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-md text-white" style={{ backgroundColor: contaSel.cor }}>
                <TipoIcon tipo={contaSel.tipo} size={14} />
              </div>
              <h3 className="font-semibold text-sm">
                Últimas transações — {contaSel.nome}
              </h3>
            </div>
            <button
              onClick={() => setContaSelecionada(null)}
              className="p-1 rounded hover:bg-secondary text-muted-foreground"
            >
              <X size={14} />
            </button>
          </div>

          {txsDaConta.length === 0 ? (
            <p className="p-6 text-center text-muted-foreground text-sm">
              Nenhuma transação vinculada a esta conta.
            </p>
          ) : (
            <div className="divide-y divide-border">
              {txsDaConta.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between px-4 py-3 text-sm">
                  <div>
                    <p className="font-medium text-foreground">{tx.descricao}</p>
                    <p className="text-xs text-muted-foreground">
                      {(() => {
                        try {
                          return format(parseISO(tx.data), "dd 'de' MMM yyyy", { locale: ptBR });
                        } catch {
                          return tx.data;
                        }
                      })()}
                      {' · '}{tx.categoria}
                    </p>
                  </div>
                  <span
                    className={`font-semibold ${
                      tx.tipo === 'receita' || (tx.tipo === 'transferencia' && !tx.isTransferenciaOrigem)
                        ? 'text-success'
                        : 'text-danger'
                    }`}
                  >
                    {tx.tipo === 'receita' || (tx.tipo === 'transferencia' && !tx.isTransferenciaOrigem)
                      ? '+'
                      : '-'}
                    {formatCurrency(tx.valor)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modal Adicionar/Editar conta */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold">{editingId ? 'Editar Conta' : 'Nova Conta'}</h3>
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
                  Nome da conta *
                </label>
                <input
                  type="text"
                  placeholder="Ex: Nubank, Caixa, Carteira..."
                  value={form.nome}
                  onChange={(e) => setForm({ ...form, nome: e.target.value })}
                  className="w-full bg-background border border-input rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground block mb-1.5">
                  Tipo de conta
                </label>
                <select
                  value={form.tipo}
                  onChange={(e) => setForm({ ...form, tipo: e.target.value as TipoConta })}
                  className="w-full bg-background border border-input rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {Object.entries(TIPO_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground block mb-1.5">
                  Saldo inicial (R$)
                </label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0,00"
                  value={form.saldoInicial}
                  onChange={(e) => setForm({ ...form, saldoInicial: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-background border border-input rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
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
                disabled={!form.nome.trim()}
                className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Check size={16} />
                {editingId ? 'Salvar Alterações' : 'Criar Conta'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Transferência */}
      {showTransferModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <ArrowLeftRight size={18} className="text-primary" />
                <h3 className="text-lg font-bold">Transferência entre Contas</h3>
              </div>
              <button
                onClick={() => setShowTransferModal(false)}
                className="p-2 rounded-lg hover:bg-secondary text-muted-foreground"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground block mb-1.5">
                  Conta de origem *
                </label>
                <select
                  value={transferForm.contaOrigemId}
                  onChange={(e) => setTransferForm({ ...transferForm, contaOrigemId: e.target.value })}
                  className="w-full bg-background border border-input rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">Selecionar conta...</option>
                  {contas.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nome} ({formatCurrency(saldos[c.id] ?? 0)})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground block mb-1.5">
                  Conta de destino *
                </label>
                <select
                  value={transferForm.contaDestinoId}
                  onChange={(e) =>
                    setTransferForm({ ...transferForm, contaDestinoId: e.target.value })
                  }
                  className="w-full bg-background border border-input rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">Selecionar conta...</option>
                  {contas.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nome}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-muted-foreground block mb-1.5">
                    Valor *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0,00"
                    value={transferForm.valor}
                    onChange={(e) => setTransferForm({ ...transferForm, valor: e.target.value })}
                    className="w-full bg-background border border-input rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground block mb-1.5">
                    Data *
                  </label>
                  <input
                    type="date"
                    value={transferForm.data}
                    onChange={(e) => setTransferForm({ ...transferForm, data: e.target.value })}
                    className="w-full bg-background border border-input rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground block mb-1.5">
                  Descrição
                </label>
                <input
                  type="text"
                  value={transferForm.descricao}
                  onChange={(e) => setTransferForm({ ...transferForm, descricao: e.target.value })}
                  className="w-full bg-background border border-input rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              {transferError && (
                <p className="text-sm text-danger bg-danger/10 border border-danger/20 px-3 py-2 rounded-lg">
                  {transferError}
                </p>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowTransferModal(false)}
                className="flex-1 px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-secondary transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleTransferir}
                disabled={savingTransfer}
                className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <ArrowLeftRight size={16} />
                {savingTransfer ? 'Transferindo...' : 'Confirmar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
