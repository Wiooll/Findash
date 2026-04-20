import { useMemo, useState } from 'react';
import { Check, Plus, Trash2 } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import type { Loan, LoanStatus, LoanType } from '../types';
import { useFinance } from '../context/FinanceContext';
import { validateLoanInput } from '../utils/loanValidation';

const LOAN_TYPES: LoanType[] = ['emprestado', 'recebido'];
const LOAN_STATUS: LoanStatus[] = ['em_aberto', 'quitado', 'atrasado'];

const emptyLoanForm = (): Omit<Loan, 'id' | 'createdAt' | 'updatedAt'> => ({
  descricao: '',
  valor: 0,
  tipo: 'emprestado',
  data: new Date().toISOString().slice(0, 10),
  status: 'em_aberto',
});

const labelsStatus: Record<LoanStatus, string> = {
  em_aberto: 'Em aberto',
  quitado: 'Quitado',
  atrasado: 'Atrasado',
};

const labelsTipo: Record<LoanType, string> = {
  emprestado: 'Emprestado',
  recebido: 'Recebido',
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

export const Loans = () => {
  const { loans, addLoan, updateLoanStatus, deleteLoan } = useFinance();
  const [isAdding, setIsAdding] = useState(false);
  const [loanForm, setLoanForm] = useState(emptyLoanForm());
  const [error, setError] = useState('');

  const sortedLoans = useMemo(
    () =>
      [...loans].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()),
    [loans],
  );

  const handleSave = async () => {
    const validationError = validateLoanInput(loanForm);
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      await addLoan({
        ...loanForm,
        descricao: loanForm.descricao.trim(),
        valor: Number(loanForm.valor),
      });
      setLoanForm(emptyLoanForm());
      setIsAdding(false);
      setError('');
    } catch {
      setError('Não foi possível salvar o empréstimo agora. Tente novamente.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold tracking-tight">Empréstimos</h2>
        <button
          onClick={() => {
            setIsAdding(true);
            setError('');
          }}
          className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors"
        >
          <Plus size={16} /> Novo empréstimo
        </button>
      </div>

      {error && (
        <div className="px-4 py-3 rounded-lg border border-danger/40 bg-danger/10 text-sm text-danger">
          {error}
        </div>
      )}

      {isAdding && (
        <div className="bg-card border border-border rounded-xl p-4 shadow-sm space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            <input
              value={loanForm.descricao}
              onChange={(event) => setLoanForm({ ...loanForm, descricao: event.target.value })}
              className="md:col-span-2 w-full bg-background border border-input rounded-md px-3 py-2 text-sm"
              placeholder="Descrição"
            />
            <input
              type="number"
              min="0"
              step="0.01"
              value={loanForm.valor || ''}
              onChange={(event) =>
                setLoanForm({ ...loanForm, valor: Number(event.target.value || 0) })
              }
              className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm"
              placeholder="Valor"
            />
            <input
              type="date"
              value={loanForm.data}
              onChange={(event) => setLoanForm({ ...loanForm, data: event.target.value })}
              className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm"
            />
            <select
              value={loanForm.tipo}
              onChange={(event) =>
                setLoanForm({ ...loanForm, tipo: event.target.value as LoanType })
              }
              className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm"
            >
              {LOAN_TYPES.map((type) => (
                <option value={type} key={type}>
                  {labelsTipo[type]}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-end gap-2">
            <button
              onClick={() => {
                setIsAdding(false);
                setLoanForm(emptyLoanForm());
              }}
              className="px-3 py-2 rounded-md border border-border text-sm hover:bg-secondary transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={() => void handleSave()}
              className="px-3 py-2 rounded-md bg-primary text-primary-foreground text-sm hover:bg-primary/90 transition-colors flex items-center gap-2"
            >
              <Check size={14} /> Salvar
            </button>
          </div>
        </div>
      )}

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-secondary/50 text-muted-foreground border-b border-border">
                <th className="px-4 py-3 font-medium">Data</th>
                <th className="px-4 py-3 font-medium">Descrição</th>
                <th className="px-4 py-3 font-medium">Tipo</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Valor</th>
                <th className="px-4 py-3 font-medium text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {sortedLoans.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                    Nenhum empréstimo cadastrado.
                  </td>
                </tr>
              ) : (
                sortedLoans.map((loan) => (
                  <tr key={loan.id} className="border-b border-border hover:bg-secondary/30 transition-colors">
                    <td className="px-4 py-3 text-muted-foreground">
                      {format(parseISO(loan.data), 'dd/MM/yyyy')}
                    </td>
                    <td className="px-4 py-3 font-medium">{loan.descricao}</td>
                    <td className="px-4 py-3">{labelsTipo[loan.tipo]}</td>
                    <td className="px-4 py-3">
                      <select
                        value={loan.status}
                        onChange={(event) =>
                          void updateLoanStatus(loan.id, event.target.value as LoanStatus)
                        }
                        className="bg-background border border-input rounded-md px-2 py-1 text-xs"
                      >
                        {LOAN_STATUS.map((status) => (
                          <option key={status} value={status}>
                            {labelsStatus[status]}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td
                      className={`px-4 py-3 font-semibold ${
                        loan.tipo === 'recebido' ? 'text-success' : 'text-danger'
                      }`}
                    >
                      {loan.tipo === 'recebido' ? '+ ' : '- '}
                      {formatCurrency(loan.valor)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => void deleteLoan(loan.id)}
                        className="p-1.5 text-muted-foreground hover:text-danger hover:bg-danger/10 rounded-md transition-colors"
                        title="Excluir empréstimo"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
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
