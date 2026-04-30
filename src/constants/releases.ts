export interface ReleaseNote {
  version: string;
  date: string;
  highlights: string[];
  details?: string[];
}

export const RELEASE_NOTES: ReleaseNote[] = [
  {
    version: '4.5.1',
    date: '2026-04-30',
    highlights: [
      'Nova secao "Apoie o FinDash" na aba Gerenciamento para colaboracoes via Pix.',
      'Botao para copiar chave Pix com mensagem de sucesso e fallback de erro.',
    ],
    details: [
      'A chave Pix agora e lida por variavel de ambiente para facilitar configuracao por ambiente.',
      'Quando a chave nao estiver configurada, o app informa sem quebrar a interface.',
    ],
  },
  {
    version: '4.5.0',
    date: '2026-04-30',
    highlights: [
      'Menu mobile com arraste horizontal mais fluido para acessar todas as abas.',
      'Notificação de novidades por versão para destacar recursos novos.',
      'Nova aba "Atualizações" com histórico de releases e melhorias.',
    ],
    details: [
      'Ao clicar na notificação, o app abre a aba de atualizações.',
      'A versão atual é marcada como visualizada após o acesso à aba.',
    ],
  },
  {
    version: '4.4.1',
    date: '2026-04-30',
    highlights: [
      'Aba Gerenciamento com suporte, documentos legais e backup manual.',
      'Exportação e importação de backup JSON com validação de estrutura.',
    ],
  },
];

export const getReleaseByVersion = (version: string) =>
  RELEASE_NOTES.find((release) => release.version === version);
