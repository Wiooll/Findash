export interface ReceiptPhotoSuggestion {
  descricao: string;
  valor: number;
  data: string;
  estabelecimento: string;
}

const MAX_RECEIPT_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_RECEIPT_MIME_PREFIX = 'image/';

const toYmd = (date: Date) => date.toISOString().slice(0, 10);

const parseDateFromName = (name: string): string | null => {
  const match = name.match(/(20\d{2})[-_]?([01]\d)[-_]?([0-3]\d)/);
  if (!match) return null;
  const candidate = `${match[1]}-${match[2]}-${match[3]}`;
  const date = new Date(candidate);
  return Number.isNaN(date.getTime()) ? null : candidate;
};

const parseValueFromName = (name: string): number | null => {
  const match = name.match(/(\d+[.,]\d{2})/);
  if (!match) return null;
  const normalized = Number(match[1].replace(',', '.'));
  if (!Number.isFinite(normalized) || normalized <= 0) return null;
  return normalized;
};

const parseStoreFromName = (name: string): string => {
  const clean = name
    .replace(/\.[^.]+$/, '')
    .replace(/[_-]+/g, ' ')
    .replace(/\d+[.,]\d{2}/g, '')
    .replace(/20\d{2}\s?[01]\d\s?[0-3]\d/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  if (!clean) return 'Nota fiscal';
  return clean.slice(0, 80);
};

export const validateReceiptPhotoFile = (file: File): string => {
  if (!file.type.startsWith(ALLOWED_RECEIPT_MIME_PREFIX)) {
    return 'Formato inválido. Por favor, selecione uma imagem.';
  }

  if (file.size > MAX_RECEIPT_SIZE_BYTES) {
    return 'Arquivo acima do limite de 5MB.';
  }

  return '';
};

/**
 * Extração assistida local baseada em metadados mínimos (nome do arquivo).
 * Evita OCR externo neste ciclo e mantém revisão humana obrigatória.
 */
export const suggestExpenseFromReceiptPhoto = async (file: File): Promise<ReceiptPhotoSuggestion> => {
  // Simula um pequeno tempo de processamento para feedback visual
  await new Promise((resolve) => setTimeout(resolve, 800));

  const now = new Date();
  const parsedDate = parseDateFromName(file.name);
  const parsedValue = parseValueFromName(file.name);
  const store = parseStoreFromName(file.name);

  return {
    descricao: `Nota fiscal - ${store}`,
    valor: parsedValue ?? 0,
    data: parsedDate ?? toYmd(now),
    estabelecimento: store,
  };
};

