import { afterEach, describe, expect, it } from 'vitest';
import {
  getSavedTransactionsMonthFilter,
  isValidTransactionsMonthFilter,
  resolveTransactionsMonthFilter,
  saveTransactionsMonthFilter,
} from './transactionMonthPreference';

const STORAGE_KEY = 'findash:transactions:activeMonth';

const createWindowMock = () => {
  const store = new Map<string, string>();
  return {
    localStorage: {
      getItem: (key: string) => store.get(key) ?? null,
      setItem: (key: string, value: string) => {
        store.set(key, value);
      },
      removeItem: (key: string) => {
        store.delete(key);
      },
    },
  };
};

afterEach(() => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  delete (globalThis as any).window;
});

describe('transactionMonthPreference', () => {
  it('valida filtros aceitos', () => {
    expect(isValidTransactionsMonthFilter('todos')).toBe(true);
    expect(isValidTransactionsMonthFilter('2026-05')).toBe(true);
    expect(isValidTransactionsMonthFilter('2026-13')).toBe(false);
    expect(isValidTransactionsMonthFilter('abc')).toBe(false);
  });

  it('retorna mes atual como fallback quando nao ha valor salvo', () => {
    expect(resolveTransactionsMonthFilter(null, new Date('2026-05-02T10:00:00.000Z'))).toBe('2026-05');
  });

  it('salva e recupera valor valido no localStorage', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (globalThis as any).window = createWindowMock();

    saveTransactionsMonthFilter('2026-04');
    expect(getSavedTransactionsMonthFilter()).toBe('2026-04');
  });

  it('ignora valor invalido salvo e devolve null na leitura', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (globalThis as any).window = createWindowMock();
    window.localStorage.setItem(STORAGE_KEY, 'mes-invalido');

    expect(getSavedTransactionsMonthFilter()).toBeNull();
  });
});

