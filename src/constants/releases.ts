export interface ReleaseNote {
  version: string;
  date: string;
  highlights: string[];
  details?: string[];
}

export const RELEASE_NOTES: ReleaseNote[] = [
  {
    version: '4.5.0',
    date: '2026-04-30',
    highlights: [
      'Menu mobile com arraste horizontal mais fluido para acessar todas as abas.',
      'Notificacao de novidades por versao para destacar recursos novos.',
      'Nova aba "Atualizacoes" com historico de releases e melhorias.',
    ],
    details: [
      'Ao clicar na notificacao, o app abre a aba de atualizacoes.',
      'A versao atual e marcada como visualizada apos o acesso a aba.',
    ],
  },
  {
    version: '4.4.1',
    date: '2026-04-30',
    highlights: [
      'Aba Gerenciamento com suporte, documentos legais e backup manual.',
      'Exportacao e importacao de backup JSON com validacao de estrutura.',
    ],
  },
];

export const getReleaseByVersion = (version: string) =>
  RELEASE_NOTES.find((release) => release.version === version);
