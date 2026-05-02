import { format } from 'date-fns';

const TRANSACTIONS_ACTIVE_MONTH_KEY = 'findash:transactions:activeMonth';
const MONTH_FILTER_ALL = 'todos';

const isValidMonthReference = (value: string) => {
  if (!/^\d{4}-\d{2}$/.test(value)) return false;
  const [, monthText] = value.split('-');
  const month = Number(monthText);
  return Number.isInteger(month) && month >= 1 && month <= 12;
};

export const isValidTransactionsMonthFilter = (value: string) =>
  value === MONTH_FILTER_ALL || isValidMonthReference(value);

export const getSavedTransactionsMonthFilter = (): string | null => {
  if (typeof window === 'undefined') return null;
  const saved = window.localStorage.getItem(TRANSACTIONS_ACTIVE_MONTH_KEY);
  if (!saved || !isValidTransactionsMonthFilter(saved)) return null;
  return saved;
};

export const resolveTransactionsMonthFilter = (saved: string | null, now: Date = new Date()) => {
  if (saved && isValidTransactionsMonthFilter(saved)) return saved;
  return format(now, 'yyyy-MM');
};

export const saveTransactionsMonthFilter = (value: string) => {
  if (typeof window === 'undefined') return;
  if (!isValidTransactionsMonthFilter(value)) return;
  window.localStorage.setItem(TRANSACTIONS_ACTIVE_MONTH_KEY, value);
};

