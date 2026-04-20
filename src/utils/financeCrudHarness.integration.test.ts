import { describe, expect, it } from 'vitest';
import type { Categoria, Loan, Transaction } from '../types';
import { createFinanceCrudHarness } from './financeCrudHarness';

const baseCategory = (partial: Partial<Categoria>): Categoria => ({
  id: partial.id || 'cat-default',
  nome: partial.nome || 'Categoria',
  tipo: partial.tipo || 'despesa',
  userId: partial.userId,
});

const baseTransaction = (partial: Partial<Transaction>): Transaction => ({
  id: partial.id || 'tx-default',
  userId: partial.userId,
  data: partial.data || '2026-04-01',
  descricao: partial.descricao || 'Movimento',
  categoria: partial.categoria || 'cat-default',
  tipo: partial.tipo || 'despesa',
  valor: partial.valor ?? 10,
  formaPagamento: partial.formaPagamento || 'PIX',
});

const baseLoan = (partial: Partial<Loan>): Loan => ({
  id: partial.id || 'loan-default',
  userId: partial.userId,
  descricao: partial.descricao || 'Emprestimo',
  valor: partial.valor ?? 100,
  tipo: partial.tipo || 'emprestado',
  data: partial.data || '2026-04-01',
  status: partial.status || 'em_aberto',
  createdAt: partial.createdAt || '2026-04-01T10:00:00.000Z',
  updatedAt: partial.updatedAt || '2026-04-01T10:00:00.000Z',
});

describe('financeCrudHarness integration', () => {
  it('executa CRUD completo de categorias por usuario', () => {
    const harness = createFinanceCrudHarness();
    const userId = 'user-A';

    harness.createCategory(userId, baseCategory({ id: 'cat-1', nome: 'Mercado' }));
    expect(harness.getUserCategories(userId)).toHaveLength(1);

    harness.updateCategory(userId, 'cat-1', { nome: 'Mercado Casa' });
    expect(harness.getUserCategories(userId)[0].nome).toBe('Mercado Casa');

    harness.deleteCategory(userId, 'cat-1');
    expect(harness.getUserCategories(userId)).toHaveLength(0);
  });

  it('executa CRUD completo de transacoes no escopo autenticado', () => {
    const harness = createFinanceCrudHarness();
    const userId = 'user-A';
    harness.createCategory(userId, baseCategory({ id: 'cat-1', nome: 'Transporte' }));

    harness.createTransaction(
      userId,
      baseTransaction({ id: 'tx-1', categoria: 'cat-1', descricao: 'Uber' }),
    );
    expect(harness.getUserTransactions(userId)).toHaveLength(1);

    harness.updateTransaction(userId, 'tx-1', { valor: 55 });
    expect(harness.getUserTransactions(userId)[0].valor).toBe(55);

    harness.deleteTransaction(userId, 'tx-1');
    expect(harness.getUserTransactions(userId)).toHaveLength(0);
  });

  it('bloqueia categoria inexistente e impede vazamento entre usuarios', () => {
    const harness = createFinanceCrudHarness();
    const userA = 'user-A';
    const userB = 'user-B';

    harness.createCategory(userA, baseCategory({ id: 'cat-a', nome: 'Saude' }));
    harness.createCategory(userB, baseCategory({ id: 'cat-b', nome: 'Lazer' }));

    expect(() =>
      harness.createTransaction(
        userA,
        baseTransaction({ id: 'tx-invalid', categoria: 'cat-b', descricao: 'Tentativa cruzada' }),
      ),
    ).toThrow('Categoria inválida para o usuário.');

    harness.createTransaction(
      userB,
      baseTransaction({ id: 'tx-b', categoria: 'cat-b', descricao: 'Cinema' }),
    );

    expect(harness.getUserTransactions(userA)).toHaveLength(0);
    expect(harness.getUserTransactions(userB)).toHaveLength(1);
  });

  it('executa CRUD e atualizacao de status de emprestimos por usuario', () => {
    const harness = createFinanceCrudHarness();
    const userId = 'user-A';

    harness.createLoan(userId, baseLoan({ id: 'loan-1', descricao: 'Joao', valor: 350 }));
    expect(harness.getUserLoans(userId)).toHaveLength(1);

    harness.updateLoanStatus(userId, 'loan-1', 'quitado');
    expect(harness.getUserLoans(userId)[0].status).toBe('quitado');

    harness.updateLoan(userId, 'loan-1', { descricao: 'Joao Silva', valor: 450 });
    expect(harness.getUserLoans(userId)[0].descricao).toBe('Joao Silva');
    expect(harness.getUserLoans(userId)[0].valor).toBe(450);

    harness.deleteLoan(userId, 'loan-1');
    expect(harness.getUserLoans(userId)).toHaveLength(0);
  });
});

