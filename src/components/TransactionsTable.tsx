import { useState, useMemo } from 'react';
import { useFinance } from '../context/FinanceContext';
import type { Transaction, TransactionType, PaymentMethod } from '../types';
import { Plus, Edit2, Trash2, Check, X, Search, Filter } from 'lucide-react';
import { format, parseISO } from 'date-fns';

export const TransactionsTable = () => {
  const { transactions, categories, addTransaction, updateTransaction, deleteTransaction } = useFinance();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTipo, setFilterTipo] = useState<string>('todos');
  const [filterMes, setFilterMes] = useState<string>('todos');
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Transaction>>({});

  const [isAdding, setIsAdding] = useState(false);
  const [addForm, setAddForm] = useState<Partial<Transaction>>({
    data: new Date().toISOString().split('T')[0],
    tipo: 'despesa',
    formaPagamento: 'PIX',
    valor: 0,
    descricao: '',
    categoria: categories.length > 0 ? categories[0].nome : ''
  });

  const mesesOptions = useMemo(() => {
    const meses = new Set<string>();
    transactions.forEach(t => {
      const data = parseISO(t.data);
      if (!isNaN(data.getTime())) {
        meses.add(t.data.substring(0, 7)); // YYYY-MM
      }
    });
    return Array.from(meses).sort().reverse();
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const matchSearch = t.descricao.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          t.categoria.toLowerCase().includes(searchTerm.toLowerCase());
      const matchTipo = filterTipo === 'todos' || t.tipo === filterTipo;
      const matchMes = filterMes === 'todos' || t.data.startsWith(filterMes);
      
      return matchSearch && matchTipo && matchMes;
    }).sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());
  }, [transactions, searchTerm, filterTipo, filterMes]);

  const handleEditClick = (t: Transaction) => {
    setEditingId(t.id);
    setEditForm(t);
  };

  const handleEditSave = () => {
    if (editingId && editForm) {
      updateTransaction(editingId, editForm);
      setEditingId(null);
    }
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleAddSave = () => {
    if (addForm.descricao && addForm.data && addForm.categoria && addForm.valor !== undefined) {
      addTransaction(addForm as Omit<Transaction, 'id'>);
      setIsAdding(false);
      setAddForm({
        data: new Date().toISOString().split('T')[0],
        tipo: 'despesa',
        formaPagamento: 'PIX',
        valor: 0,
        descricao: '',
        categoria: categories.length > 0 ? categories[0].nome : ''
      });
    } else {
      alert("Por favor, preencha todos os campos.");
    }
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold tracking-tight">Transações</h2>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors"
        >
          <Plus size={16} /> Nova Transação
        </button>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden flex flex-col">
        {/* Filters Top Bar */}
        <div className="p-4 border-b border-border bg-secondary/30 flex flex-col md:flex-row gap-4 items-center">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            <input 
              type="text" 
              placeholder="Buscar por descrição..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-background border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
            />
          </div>
          
          <div className="flex w-full md:w-auto gap-4 items-center flex-1 md:justify-end">
            <div className="flex items-center gap-2">
              <Filter size={16} className="text-muted-foreground" />
              <select 
                value={filterMes}
                onChange={e => setFilterMes(e.target.value)}
                className="bg-background border border-input rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="todos">Todos os Meses</option>
                {mesesOptions.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>

            <select 
              value={filterTipo}
              onChange={e => setFilterTipo(e.target.value)}
              className="bg-background border border-input rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="todos">Todos os Tipos</option>
              <option value="receita">Receitas</option>
              <option value="despesa">Despesas</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-secondary/50 text-muted-foreground border-b border-border">
                <th className="px-4 py-3 font-medium">Data</th>
                <th className="px-4 py-3 font-medium">Descrição</th>
                <th className="px-4 py-3 font-medium">Categoria</th>
                <th className="px-4 py-3 font-medium">Tipo</th>
                <th className="px-4 py-3 font-medium">Pagamento</th>
                <th className="px-4 py-3 font-medium">Valor</th>
                <th className="px-4 py-3 font-medium text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {isAdding && (
                <tr className="border-b border-border bg-primary/5 animate-in fade-in">
                  <td className="px-4 py-3">
                    <input type="date" value={addForm.data} onChange={e => setAddForm({...addForm, data: e.target.value})} className="w-full bg-background border border-input rounded-md px-2 py-1 text-sm focus:ring-1 focus:ring-ring" />
                  </td>
                  <td className="px-4 py-3">
                    <input type="text" placeholder="Descrição" value={addForm.descricao} onChange={e => setAddForm({...addForm, descricao: e.target.value})} className="w-full bg-background border border-input rounded-md px-2 py-1 text-sm focus:ring-1 focus:ring-ring" />
                  </td>
                  <td className="px-4 py-3">
                    <select value={addForm.categoria} onChange={e => setAddForm({...addForm, categoria: e.target.value})} className="w-full bg-background border border-input rounded-md px-2 py-1 text-sm focus:ring-1 focus:ring-ring">
                      {categories.map(c => <option key={c.id} value={c.nome}>{c.nome}</option>)}
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <select value={addForm.tipo} onChange={e => setAddForm({...addForm, tipo: e.target.value as TransactionType})} className="w-full bg-background border border-input rounded-md px-2 py-1 text-sm focus:ring-1 focus:ring-ring">
                      <option value="despesa">Despesa</option>
                      <option value="receita">Receita</option>
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <select value={addForm.formaPagamento} onChange={e => setAddForm({...addForm, formaPagamento: e.target.value as PaymentMethod})} className="w-full bg-background border border-input rounded-md px-2 py-1 text-sm focus:ring-1 focus:ring-ring">
                      <option value="Dinheiro">Dinheiro</option>
                      <option value="Cartão de crédito">Cartão de Crédito</option>
                      <option value="Débito">Débito</option>
                      <option value="PIX">PIX</option>
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <input type="number" step="0.01" placeholder="0.00" value={addForm.valor || ''} onChange={e => setAddForm({...addForm, valor: parseFloat(e.target.value)})} className="w-full bg-background border border-input rounded-md px-2 py-1 text-sm focus:ring-1 focus:ring-ring" />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={handleAddSave} className="p-1.5 text-success hover:bg-success/10 rounded-md transition-colors" title="Salvar"><Check size={16} /></button>
                      <button onClick={() => setIsAdding(false)} className="p-1.5 text-danger hover:bg-danger/10 rounded-md transition-colors" title="Cancelar"><X size={16} /></button>
                    </div>
                  </td>
                </tr>
              )}

              {filteredTransactions.length === 0 && !isAdding ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">Nenhuma transação encontrada.</td>
                </tr>
              ) : (
                filteredTransactions.map((t) => (
                  <tr key={t.id} className="border-b border-border hover:bg-secondary/30 transition-colors group">
                    {editingId === t.id ? (
                      <>
                        <td className="px-4 py-3"><input type="date" value={editForm.data} onChange={e => setEditForm({...editForm, data: e.target.value})} className="w-full bg-background border border-input rounded-md px-2 py-1 text-sm focus:ring-1 focus:ring-ring" /></td>
                        <td className="px-4 py-3"><input type="text" value={editForm.descricao} onChange={e => setEditForm({...editForm, descricao: e.target.value})} className="w-full bg-background border border-input rounded-md px-2 py-1 text-sm focus:ring-1 focus:ring-ring" /></td>
                        <td className="px-4 py-3">
                          <select value={editForm.categoria} onChange={e => setEditForm({...editForm, categoria: e.target.value})} className="w-full bg-background border border-input rounded-md px-2 py-1 text-sm focus:ring-1 focus:ring-ring">
                            {categories.map(c => <option key={c.id} value={c.nome}>{c.nome}</option>)}
                          </select>
                        </td>
                        <td className="px-4 py-3">
                          <select value={editForm.tipo} onChange={e => setEditForm({...editForm, tipo: e.target.value as TransactionType})} className="w-full bg-background border border-input rounded-md px-2 py-1 text-sm focus:ring-1 focus:ring-ring">
                            <option value="despesa">Despesa</option>
                            <option value="receita">Receita</option>
                          </select>
                        </td>
                        <td className="px-4 py-3">
                          <select value={editForm.formaPagamento} onChange={e => setEditForm({...editForm, formaPagamento: e.target.value as PaymentMethod})} className="w-full bg-background border border-input rounded-md px-2 py-1 text-sm focus:ring-1 focus:ring-ring">
                            <option value="Dinheiro">Dinheiro</option>
                            <option value="Cartão de crédito">Cartão de Crédito</option>
                            <option value="Débito">Débito</option>
                            <option value="PIX">PIX</option>
                          </select>
                        </td>
                        <td className="px-4 py-3"><input type="number" step="0.01" value={editForm.valor} onChange={e => setEditForm({...editForm, valor: parseFloat(e.target.value)})} className="w-full bg-background border border-input rounded-md px-2 py-1 text-sm focus:ring-1 focus:ring-ring" /></td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={handleEditSave} className="p-1.5 text-success hover:bg-success/10 rounded-md transition-colors" title="Salvar"><Check size={16} /></button>
                            <button onClick={handleEditCancel} className="p-1.5 text-danger hover:bg-danger/10 rounded-md transition-colors" title="Cancelar"><X size={16} /></button>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-4 py-3 text-muted-foreground font-medium">
                          {(() => {
                            try { return format(parseISO(t.data), 'dd/MM/yyyy'); }
                            catch (e) { return t.data; }
                          })()}
                        </td>
                        <td className="px-4 py-3 font-medium text-foreground">{t.descricao}</td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground border border-border">
                            {t.categoria}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${t.tipo === 'receita' ? 'bg-success/10 text-success border border-success/20' : 'bg-danger/10 text-danger border border-danger/20'}`}>
                            {t.tipo === 'receita' ? 'Receita' : 'Despesa'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground text-xs">{t.formaPagamento}</td>
                        <td className={`px-4 py-3 font-bold ${t.tipo === 'receita' ? 'text-success' : 'text-danger'}`}>
                          {t.tipo === 'receita' ? '+ ' : '- '}
                          {formatCurrency(t.valor)}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => handleEditClick(t)} className="p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-md transition-colors" title="Editar"><Edit2 size={16} /></button>
                            <button onClick={() => deleteTransaction(t.id)} className="p-1.5 text-muted-foreground hover:text-danger hover:bg-danger/10 rounded-md transition-colors" title="Excluir"><Trash2 size={16} /></button>
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
