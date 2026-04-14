import { useEffect, useMemo, useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import type { Categoria, TransactionType } from '../types';
import { Plus, Edit2, Trash2, Check, X, Tag, Wallet, AlertTriangle } from 'lucide-react';
import { isSameMonth, parseISO, startOfMonth } from 'date-fns';

export const Categories = () => {
  const {
    categories,
    transactions,
    categoryBudgets,
    addCategory,
    updateCategory,
    deleteCategory,
    upsertCategoryBudget,
    deleteCategoryBudget,
  } = useFinance();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Categoria>>({});

  const [isAdding, setIsAdding] = useState(false);
  const [addForm, setAddForm] = useState<Partial<Categoria>>({
    nome: '',
    tipo: 'despesa',
  });

  const [budgetDrafts, setBudgetDrafts] = useState<Record<string, string>>({});

  const currentMonth = startOfMonth(new Date());

  const expenseByCategory = useMemo(() => {
    const map = new Map<string, number>();

    transactions.forEach((transaction) => {
      if (transaction.tipo !== 'despesa') return;
      if (!isSameMonth(parseISO(transaction.data), currentMonth)) return;

      map.set(transaction.categoria, (map.get(transaction.categoria) || 0) + Number(transaction.valor));
    });

    return map;
  }, [transactions, currentMonth]);

  const budgetByCategoryId = useMemo(() => {
    const map = new Map<string, { id: string; monthlyLimit: number }>();
    categoryBudgets.forEach((budget) => {
      map.set(budget.categoryId, { id: budget.id, monthlyLimit: budget.monthlyLimit });
    });
    return map;
  }, [categoryBudgets]);

  useEffect(() => {
    const nextDrafts: Record<string, string> = {};
    categories.forEach((category) => {
      const budget = budgetByCategoryId.get(category.id);
      nextDrafts[category.id] = budget ? String(budget.monthlyLimit) : '';
    });
    setBudgetDrafts(nextDrafts);
  }, [categories, budgetByCategoryId]);

  const handleEditClick = (category: Categoria) => {
    setEditingId(category.id);
    setEditForm(category);
  };

  const handleEditSave = async () => {
    if (editingId && editForm) {
      await updateCategory(editingId, editForm);
      setEditingId(null);
    }
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleAddSave = async () => {
    if (addForm.nome) {
      await addCategory(addForm as Omit<Categoria, 'id'>);
      setIsAdding(false);
      setAddForm({ nome: '', tipo: 'despesa' });
    }
  };

  const handleBudgetSave = async (categoryId: string) => {
    const draft = budgetDrafts[categoryId] || '';
    const value = Number(draft);
    const existingBudget = budgetByCategoryId.get(categoryId);

    if (!draft || Number.isNaN(value) || value <= 0) {
      if (existingBudget) {
        await deleteCategoryBudget(existingBudget.id);
      }
      return;
    }

    await upsertCategoryBudget(categoryId, value);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Tag size={24} /> Categorias
        </h2>
        <button
          onClick={() => setIsAdding(true)}
          className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors"
        >
          <Plus size={16} /> Nova Categoria
        </button>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-secondary/50 text-muted-foreground border-b border-border">
                <th className="px-6 py-4 font-medium">Nome da Categoria</th>
                <th className="px-6 py-4 font-medium">Tipo</th>
                <th className="px-6 py-4 font-medium">Orçamento Mensal</th>
                <th className="px-6 py-4 font-medium">Uso no Mês</th>
                <th className="px-6 py-4 font-medium text-right w-36">Ações</th>
              </tr>
            </thead>
            <tbody>
              {isAdding && (
                <tr className="border-b border-border bg-primary/5 animate-in fade-in">
                  <td className="px-6 py-3">
                    <input
                      type="text"
                      placeholder="Nome da categoria"
                      value={addForm.nome}
                      onChange={(e) => setAddForm({ ...addForm, nome: e.target.value })}
                      className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-ring"
                      autoFocus
                    />
                  </td>
                  <td className="px-6 py-3">
                    <select
                      value={addForm.tipo}
                      onChange={(e) => setAddForm({ ...addForm, tipo: e.target.value as TransactionType | 'ambos' })}
                      className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-ring"
                    >
                      <option value="despesa">Despesa</option>
                      <option value="receita">Receita</option>
                      <option value="ambos">Ambos</option>
                    </select>
                  </td>
                  <td className="px-6 py-3 text-muted-foreground" colSpan={2}>
                    Defina o orçamento após criar a categoria.
                  </td>
                  <td className="px-6 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={handleAddSave} className="p-2 text-success hover:bg-success/10 rounded-md transition-colors shadow-sm bg-background border border-border" title="Salvar">
                        <Check size={16} />
                      </button>
                      <button onClick={() => setIsAdding(false)} className="p-2 text-danger hover:bg-danger/10 rounded-md transition-colors shadow-sm bg-background border border-border" title="Cancelar">
                        <X size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              )}

              {categories.map((category) => {
                const budget = budgetByCategoryId.get(category.id);
                const spent = expenseByCategory.get(category.nome) || 0;
                const limit = budget?.monthlyLimit || 0;
                const percent = limit > 0 ? Math.round((spent / limit) * 100) : 0;
                const isWarning = percent >= 80 && percent < 100;
                const isExceeded = percent >= 100;

                return (
                  <tr key={category.id} className="border-b border-border hover:bg-secondary/30 transition-colors group">
                    {editingId === category.id ? (
                      <>
                        <td className="px-6 py-3">
                          <input
                            type="text"
                            value={editForm.nome}
                            onChange={(e) => setEditForm({ ...editForm, nome: e.target.value })}
                            className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-ring"
                          />
                        </td>
                        <td className="px-6 py-3">
                          <select
                            value={editForm.tipo}
                            onChange={(e) => setEditForm({ ...editForm, tipo: e.target.value as TransactionType | 'ambos' })}
                            className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-ring"
                          >
                            <option value="despesa">Despesa</option>
                            <option value="receita">Receita</option>
                            <option value="ambos">Ambos</option>
                          </select>
                        </td>
                        <td className="px-6 py-3 text-muted-foreground" colSpan={2}>
                          Salve a edição para atualizar o orçamento.
                        </td>
                        <td className="px-6 py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={handleEditSave} className="p-2 text-success hover:bg-success/10 rounded-md transition-colors shadow-sm bg-background border border-border" title="Salvar">
                              <Check size={16} />
                            </button>
                            <button onClick={handleEditCancel} className="p-2 text-danger hover:bg-danger/10 rounded-md transition-colors shadow-sm bg-background border border-border" title="Cancelar">
                              <X size={16} />
                            </button>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-6 py-4 font-medium text-foreground">{category.nome}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold capitalize
                          ${category.tipo === 'receita' ? 'bg-success/10 text-success border border-success/20' : category.tipo === 'despesa' ? 'bg-danger/10 text-danger border border-danger/20' : 'bg-info/10 text-info border border-info/20'}`}
                          >
                            {category.tipo}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {category.tipo === 'receita' ? (
                            <span className="text-muted-foreground text-xs">Não aplicável</span>
                          ) : (
                            <div className="flex items-center gap-2">
                              <div className="relative w-36">
                                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">R$</span>
                                <input
                                  type="number"
                                  step="0.01"
                                  value={budgetDrafts[category.id] || ''}
                                  onChange={(e) => setBudgetDrafts((current) => ({ ...current, [category.id]: e.target.value }))}
                                  className="w-full pl-8 pr-3 py-1.5 bg-background border border-input rounded-md text-sm"
                                  placeholder="0,00"
                                />
                              </div>
                              <button
                                onClick={() => handleBudgetSave(category.id)}
                                className="px-2.5 py-1.5 rounded-md border border-border text-xs font-medium hover:bg-secondary transition-colors inline-flex items-center gap-1"
                                title="Salvar orçamento"
                              >
                                <Wallet size={14} /> Salvar
                              </button>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {category.tipo === 'receita' || !limit ? (
                            <span className="text-muted-foreground text-xs">Sem orçamento definido</span>
                          ) : (
                            <div className="space-y-1.5 min-w-[220px]">
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-muted-foreground">{formatCurrency(spent)} de {formatCurrency(limit)}</span>
                                <span className={`font-semibold ${isExceeded ? 'text-danger' : isWarning ? 'text-amber-600 dark:text-amber-400' : 'text-muted-foreground'}`}>
                                  {percent}%
                                </span>
                              </div>
                              <div className="h-2 bg-secondary rounded-full overflow-hidden border border-border">
                                <div
                                  className={`h-full ${isExceeded ? 'bg-danger' : isWarning ? 'bg-amber-500' : 'bg-success'}`}
                                  style={{ width: `${Math.min(percent, 100)}%` }}
                                />
                              </div>
                              {(isWarning || isExceeded) && (
                                <p className={`text-xs inline-flex items-center gap-1 ${isExceeded ? 'text-danger' : 'text-amber-600 dark:text-amber-400'}`}>
                                  <AlertTriangle size={12} />
                                  {isExceeded ? 'Orçamento estourado' : 'Próximo do limite'}
                                </p>
                              )}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => handleEditClick(category)} className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-md transition-colors" title="Editar">
                              <Edit2 size={16} />
                            </button>
                            <button onClick={() => deleteCategory(category.id)} className="p-2 text-muted-foreground hover:text-danger hover:bg-danger/10 rounded-md transition-colors" title="Excluir">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
