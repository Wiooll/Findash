import { useMemo, useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import type { RecurrenceFrequency, RecurringTransaction, TransactionType } from '../types';
import { Plus, Edit2, Trash2, Check, X, Repeat, PauseCircle, PlayCircle } from 'lucide-react';

const frequencyLabels: Record<RecurrenceFrequency, string> = {
  diaria: 'Diária',
  semanal: 'Semanal',
  mensal: 'Mensal',
  anual: 'Anual',
};

const initialRecurringForm: Omit<RecurringTransaction, 'id' | 'createdAt' | 'updatedAt'> = {
  descricao: '',
  categoria: '',
  tipo: 'despesa',
  valor: 0,
  formaPagamento: 'PIX',
  frequency: 'mensal',
  startDate: new Date().toISOString().split('T')[0],
  endDate: '',
  active: true,
};

export const RecurringTransactions = () => {
  const {
    recurringTransactions,
    categories,
    addRecurringTransaction,
    updateRecurringTransaction,
    deleteRecurringTransaction,
    toggleRecurringTransaction,
  } = useFinance();

  const [isAdding, setIsAdding] = useState(false);
  const [addForm, setAddForm] = useState<Omit<RecurringTransaction, 'id' | 'createdAt' | 'updatedAt'>>({
    ...initialRecurringForm,
    categoria: categories[0]?.nome || '',
  });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<RecurringTransaction>>({});

  const orderedRecurring = useMemo(
    () => [...recurringTransactions].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)),
    [recurringTransactions],
  );

  const categoryOptions = useMemo(
    () =>
      categories.filter(
        (category) => category.tipo === addForm.tipo || category.tipo === 'ambos',
      ),
    [categories, addForm.tipo],
  );

  const editCategoryOptions = useMemo(
    () =>
      categories.filter(
        (category) => category.tipo === editForm.tipo || category.tipo === 'ambos',
      ),
    [categories, editForm.tipo],
  );

  const ensureCategory = (type: TransactionType, fallback: string) => {
    const validCategory = categories.find((category) => category.nome === fallback && (category.tipo === type || category.tipo === 'ambos'));
    if (validCategory) return fallback;

    const firstCompatible = categories.find((category) => category.tipo === type || category.tipo === 'ambos');
    return firstCompatible?.nome || '';
  };

  const handleAddSave = async () => {
    if (!addForm.descricao || !addForm.categoria || !addForm.startDate || !addForm.valor) {
      alert('Preencha os campos obrigatórios da recorrência.');
      return;
    }

    await addRecurringTransaction({
      ...addForm,
      valor: Number(addForm.valor),
      endDate: addForm.endDate || undefined,
    });

    setIsAdding(false);
    setAddForm({
      ...initialRecurringForm,
      categoria: ensureCategory(initialRecurringForm.tipo, ''),
    });
  };

  const handleEditClick = (rule: RecurringTransaction) => {
    setEditingId(rule.id);
    setEditForm(rule);
  };

  const handleEditSave = async () => {
    if (!editingId || !editForm.descricao || !editForm.categoria || !editForm.startDate || !editForm.valor) {
      alert('Preencha os campos obrigatórios da recorrência.');
      return;
    }

    await updateRecurringTransaction(editingId, {
      ...editForm,
      valor: Number(editForm.valor),
      endDate: editForm.endDate || undefined,
    });

    setEditingId(null);
    setEditForm({});
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleToggleActive = async (rule: RecurringTransaction) => {
    await toggleRecurringTransaction(rule.id, !rule.active);
  };

  const handleTypeChangeInAdd = (value: TransactionType) => {
    setAddForm((current) => ({
      ...current,
      tipo: value,
      categoria: ensureCategory(value, current.categoria),
    }));
  };

  const handleTypeChangeInEdit = (value: TransactionType) => {
    setEditForm((current) => ({
      ...current,
      tipo: value,
      categoria: ensureCategory(value, current.categoria || ''),
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Repeat size={24} /> Recorrências
        </h2>
        <button
          onClick={() => setIsAdding(true)}
          className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors"
        >
          <Plus size={16} /> Nova Recorrência
        </button>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-secondary/50 text-muted-foreground border-b border-border">
                <th className="px-4 py-3 font-medium">Descrição</th>
                <th className="px-4 py-3 font-medium">Categoria</th>
                <th className="px-4 py-3 font-medium">Tipo</th>
                <th className="px-4 py-3 font-medium">Frequência</th>
                <th className="px-4 py-3 font-medium">Início</th>
                <th className="px-4 py-3 font-medium">Fim</th>
                <th className="px-4 py-3 font-medium">Valor</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {isAdding && (
                <tr className="border-b border-border bg-primary/5 animate-in fade-in">
                  <td className="px-4 py-3">
                    <input
                      type="text"
                      value={addForm.descricao}
                      onChange={(e) => setAddForm({ ...addForm, descricao: e.target.value })}
                      className="w-full bg-background border border-input rounded-md px-2 py-1 text-sm"
                      placeholder="Descrição"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={addForm.categoria}
                      onChange={(e) => setAddForm({ ...addForm, categoria: e.target.value })}
                      className="w-full bg-background border border-input rounded-md px-2 py-1 text-sm"
                    >
                      {categoryOptions.map((category) => (
                        <option key={category.id} value={category.nome}>
                          {category.nome}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={addForm.tipo}
                      onChange={(e) => handleTypeChangeInAdd(e.target.value as TransactionType)}
                      className="w-full bg-background border border-input rounded-md px-2 py-1 text-sm"
                    >
                      <option value="despesa">Despesa</option>
                      <option value="receita">Receita</option>
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={addForm.frequency}
                      onChange={(e) => setAddForm({ ...addForm, frequency: e.target.value as RecurrenceFrequency })}
                      className="w-full bg-background border border-input rounded-md px-2 py-1 text-sm"
                    >
                      {Object.entries(frequencyLabels).map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="date"
                      value={addForm.startDate}
                      onChange={(e) => setAddForm({ ...addForm, startDate: e.target.value })}
                      className="w-full bg-background border border-input rounded-md px-2 py-1 text-sm"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="date"
                      value={addForm.endDate}
                      onChange={(e) => setAddForm({ ...addForm, endDate: e.target.value })}
                      className="w-full bg-background border border-input rounded-md px-2 py-1 text-sm"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      step="0.01"
                      value={addForm.valor || ''}
                      onChange={(e) => setAddForm({ ...addForm, valor: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-background border border-input rounded-md px-2 py-1 text-sm"
                    />
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">Ativa</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={handleAddSave} className="p-1.5 text-success hover:bg-success/10 rounded-md" title="Salvar">
                        <Check size={16} />
                      </button>
                      <button onClick={() => setIsAdding(false)} className="p-1.5 text-danger hover:bg-danger/10 rounded-md" title="Cancelar">
                        <X size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              )}

              {orderedRecurring.length === 0 && !isAdding ? (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-muted-foreground">
                    Nenhuma recorrência cadastrada.
                  </td>
                </tr>
              ) : (
                orderedRecurring.map((rule) => (
                  <tr key={rule.id} className="border-b border-border hover:bg-secondary/30 transition-colors group">
                    {editingId === rule.id ? (
                      <>
                        <td className="px-4 py-3">
                          <input
                            type="text"
                            value={editForm.descricao || ''}
                            onChange={(e) => setEditForm({ ...editForm, descricao: e.target.value })}
                            className="w-full bg-background border border-input rounded-md px-2 py-1 text-sm"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <select
                            value={editForm.categoria || ''}
                            onChange={(e) => setEditForm({ ...editForm, categoria: e.target.value })}
                            className="w-full bg-background border border-input rounded-md px-2 py-1 text-sm"
                          >
                            {editCategoryOptions.map((category) => (
                              <option key={category.id} value={category.nome}>
                                {category.nome}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-4 py-3">
                          <select
                            value={editForm.tipo || 'despesa'}
                            onChange={(e) => handleTypeChangeInEdit(e.target.value as TransactionType)}
                            className="w-full bg-background border border-input rounded-md px-2 py-1 text-sm"
                          >
                            <option value="despesa">Despesa</option>
                            <option value="receita">Receita</option>
                          </select>
                        </td>
                        <td className="px-4 py-3">
                          <select
                            value={editForm.frequency || 'mensal'}
                            onChange={(e) => setEditForm({ ...editForm, frequency: e.target.value as RecurrenceFrequency })}
                            className="w-full bg-background border border-input rounded-md px-2 py-1 text-sm"
                          >
                            {Object.entries(frequencyLabels).map(([value, label]) => (
                              <option key={value} value={value}>
                                {label}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="date"
                            value={editForm.startDate || ''}
                            onChange={(e) => setEditForm({ ...editForm, startDate: e.target.value })}
                            className="w-full bg-background border border-input rounded-md px-2 py-1 text-sm"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="date"
                            value={editForm.endDate || ''}
                            onChange={(e) => setEditForm({ ...editForm, endDate: e.target.value })}
                            className="w-full bg-background border border-input rounded-md px-2 py-1 text-sm"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="number"
                            step="0.01"
                            value={editForm.valor || ''}
                            onChange={(e) => setEditForm({ ...editForm, valor: parseFloat(e.target.value) || 0 })}
                            className="w-full bg-background border border-input rounded-md px-2 py-1 text-sm"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-muted-foreground text-xs">{editForm.active ? 'Ativa' : 'Pausada'}</span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={handleEditSave} className="p-1.5 text-success hover:bg-success/10 rounded-md" title="Salvar">
                              <Check size={16} />
                            </button>
                            <button onClick={handleEditCancel} className="p-1.5 text-danger hover:bg-danger/10 rounded-md" title="Cancelar">
                              <X size={16} />
                            </button>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-4 py-3 font-medium text-foreground">{rule.descricao}</td>
                        <td className="px-4 py-3 text-muted-foreground">{rule.categoria}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${rule.tipo === 'receita' ? 'bg-success/10 text-success border border-success/20' : 'bg-danger/10 text-danger border border-danger/20'}`}>
                            {rule.tipo === 'receita' ? 'Receita' : 'Despesa'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">{frequencyLabels[rule.frequency]}</td>
                        <td className="px-4 py-3 text-muted-foreground">{rule.startDate}</td>
                        <td className="px-4 py-3 text-muted-foreground">{rule.endDate || '-'}</td>
                        <td className={`px-4 py-3 font-semibold ${rule.tipo === 'receita' ? 'text-success' : 'text-danger'}`}>
                          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(rule.valor)}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${rule.active ? 'bg-success/10 text-success border border-success/20' : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'}`}>
                            {rule.active ? 'Ativa' : 'Pausada'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => handleToggleActive(rule)}
                              className="p-1.5 text-muted-foreground hover:text-info hover:bg-info/10 rounded-md transition-colors"
                              title={rule.active ? 'Pausar' : 'Ativar'}
                            >
                              {rule.active ? <PauseCircle size={16} /> : <PlayCircle size={16} />}
                            </button>
                            <button onClick={() => handleEditClick(rule)} className="p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-md transition-colors" title="Editar">
                              <Edit2 size={16} />
                            </button>
                            <button onClick={() => deleteRecurringTransaction(rule.id)} className="p-1.5 text-muted-foreground hover:text-danger hover:bg-danger/10 rounded-md transition-colors" title="Excluir">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
