import { describe, expect, it } from 'vitest';
import type { Loan } from '../types';
import { validateLoanInput } from './loanValidation';

const baseLoanInput = (
  partial: Partial<Omit<Loan, 'id' | 'createdAt' | 'updatedAt'>> = {},
): Omit<Loan, 'id' | 'createdAt' | 'updatedAt'> => ({
  descricao: partial.descricao || 'Emprestimo para reforma',
  valor: partial.valor ?? 300,
  tipo: partial.tipo || 'emprestado',
  data: partial.data || '2026-04-20',
  status: partial.status || 'em_aberto',
});

describe('loanValidation', () => {
  it('valida campos obrigatorios do emprestimo', () => {
    expect(validateLoanInput(baseLoanInput())).toBe('');
    expect(validateLoanInput(baseLoanInput({ descricao: 'a' }))).toContain('descrição');
    expect(validateLoanInput(baseLoanInput({ valor: 0 }))).toContain('maior que zero');
    expect(validateLoanInput(baseLoanInput({ data: '20/04/2026' }))).toContain('YYYY-MM-DD');
  });
});

