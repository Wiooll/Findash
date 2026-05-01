export interface ReleaseNote {
  version: string;
  date: string;
  highlights: string[];
  details?: string[];
}

export const RELEASE_NOTES: ReleaseNote[] = [
  {
    version: '4.6.0',
    date: '2026-04-30',
    highlights: [
      'Nova seção "App Parceiro" na aba Gerenciamento com exibição configurável por ambiente.',
      'Validação de URL para exibir apenas links seguros (http/https) no card parceiro.',
    ],
    details: [
      'A seção só aparece quando nome e URL do parceiro estão configurados corretamente.',
      'Também foram adicionados fallbacks de descrição/CTA e testes para renderização condicional.',
    ],
  },
  {
    version: '4.5.2',
    date: '2026-04-30',
    highlights: [
      'Correções de ortografia em pt-BR nos textos da interface.',
      'Nova validação automática para bloquear textos com erro de acentuação/encoding.',
    ],
    details: [
      'A validação agora verifica strings da interface e acusa termos com ortografia inválida comum.',
      'Também foi corrigida a qualidade textual nas mensagens de Gerenciamento e Atualizações.',
    ],
  },
  {
    version: '4.5.1',
    date: '2026-04-30',
    highlights: [
      'Nova seção "Apoie o FinDash" na aba Gerenciamento para colaborações via Pix.',
      'Botão para copiar chave Pix com mensagem de sucesso e fallback de erro.',
    ],
    details: [
      'A chave Pix agora é lida por variável de ambiente para facilitar configuração por ambiente.',
      'Quando a chave não estiver configurada, o app informa sem quebrar a interface.',
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
