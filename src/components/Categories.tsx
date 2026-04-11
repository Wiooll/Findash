import { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import type { Categoria, TransactionType } from '../types';
import { Plus, Edit2, Trash2, Check, X, Tag } from 'lucide-react';

export const Categories = () => {
  const { categories, addCategory, updateCategory, deleteCategory } = useFinance();
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Categoria>>({});

  const [isAdding, setIsAdding] = useState(false);
  const [addForm, setAddForm] = useState<Partial<Categoria>>({
    nome: '',
    tipo: 'despesa'
  });

  const handleEditClick = (c: Categoria) => {
    setEditingId(c.id);
    setEditForm(c);
  };

  const handleEditSave = () => {
    if (editingId && editForm) {
      updateCategory(editingId, editForm);
      setEditingId(null);
    }
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleAddSave = () => {
    if (addForm.nome) {
      addCategory(addForm as Omit<Categoria, 'id'>);
      setIsAdding(false);
      setAddForm({ nome: '', tipo: 'despesa' });
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
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
                <th className="px-6 py-4 font-medium w-1/3">Tipo</th>
                <th className="px-6 py-4 font-medium text-right w-32">Ações</th>
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
                      onChange={e => setAddForm({...addForm, nome: e.target.value})} 
                      className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-ring" 
                      autoFocus
                    />
                  </td>
                  <td className="px-6 py-3">
                    <select 
                      value={addForm.tipo} 
                      onChange={e => setAddForm({...addForm, tipo: e.target.value as TransactionType | 'ambos'})} 
                      className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-ring"
                    >
                      <option value="despesa">Despesa</option>
                      <option value="receita">Receita</option>
                      <option value="ambos">Ambos</option>
                    </select>
                  </td>
                  <td className="px-6 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={handleAddSave} className="p-2 text-success hover:bg-success/10 rounded-md transition-colors shadow-sm bg-background border border-border" title="Salvar"><Check size={16} /></button>
                      <button onClick={() => setIsAdding(false)} className="p-2 text-danger hover:bg-danger/10 rounded-md transition-colors shadow-sm bg-background border border-border" title="Cancelar"><X size={16} /></button>
                    </div>
                  </td>
                </tr>
              )}

              {categories.map((c) => (
                <tr key={c.id} className="border-b border-border hover:bg-secondary/30 transition-colors group">
                  {editingId === c.id ? (
                    <>
                      <td className="px-6 py-3">
                        <input 
                          type="text" 
                          value={editForm.nome} 
                          onChange={e => setEditForm({...editForm, nome: e.target.value})} 
                          className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-ring" 
                        />
                      </td>
                      <td className="px-6 py-3">
                        <select 
                          value={editForm.tipo} 
                          onChange={e => setEditForm({...editForm, tipo: e.target.value as TransactionType | 'ambos'})} 
                          className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-ring"
                        >
                          <option value="despesa">Despesa</option>
                          <option value="receita">Receita</option>
                          <option value="ambos">Ambos</option>
                        </select>
                      </td>
                      <td className="px-6 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={handleEditSave} className="p-2 text-success hover:bg-success/10 rounded-md transition-colors shadow-sm bg-background border border-border" title="Salvar"><Check size={16} /></button>
                          <button onClick={handleEditCancel} className="p-2 text-danger hover:bg-danger/10 rounded-md transition-colors shadow-sm bg-background border border-border" title="Cancelar"><X size={16} /></button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-6 py-4 font-medium text-foreground">{c.nome}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold capitalize
                          ${c.tipo === 'receita' ? 'bg-success/10 text-success border border-success/20' : 
                            c.tipo === 'despesa' ? 'bg-danger/10 text-danger border border-danger/20' : 
                            'bg-info/10 text-info border border-info/20'}`}>
                          {c.tipo}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => handleEditClick(c)} className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-md transition-colors" title="Editar"><Edit2 size={16} /></button>
                          <button onClick={() => deleteCategory(c.id)} className="p-2 text-muted-foreground hover:text-danger hover:bg-danger/10 rounded-md transition-colors" title="Excluir"><Trash2 size={16} /></button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
