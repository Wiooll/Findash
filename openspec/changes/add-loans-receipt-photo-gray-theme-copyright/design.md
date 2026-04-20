## Context

O projeto já possui base para controle de gastos e melhorias recentes de layout mobile. Esta mudança amplia o produto em quatro frentes: conformidade visual (direitos autorais), novo domínio funcional (empréstimos), entrada de gastos por foto de nota fiscal e ampliação do sistema de temas com a opção cinza (junto de preto e branco). O escopo impacta UI, modelo de dados e fluxo de cadastro de gastos, exigindo decisões para manter simplicidade, segurança de dados e compatibilidade com a arquitetura atual.

## Goals / Non-Goals

**Goals:**
- Adicionar exibição de direitos autorais em local consistente da interface.
- Disponibilizar sessão de empréstimos com operações básicas de cadastro e acompanhamento.
- Permitir criação de gasto com apoio de extração de dados a partir de foto da nota fiscal.
- Disponibilizar o tema cinza como terceira opção de tema, preservando os temas preto e branco já existentes.

**Non-Goals:**
- Automatizar reconhecimento perfeito de todos os campos da nota fiscal sem revisão humana.
- Introduzir contabilidade avançada de juros compostos ou parcelamento complexo de empréstimos.
- Reestruturar toda a arquitetura de design system além do necessário para inclusão da terceira opção de tema.

## Decisions

1. Direitos autorais no layout global
- Decisão: adicionar um bloco de direitos autorais no rodapé global da aplicação.
- Racional: reduz duplicação de texto entre telas e garante consistência.
- Alternativa considerada: texto em cada página individual. Rejeitada por maior custo de manutenção.

2. Empréstimos como módulo isolado no domínio financeiro
- Decisão: criar sessão de empréstimos com entidade própria e campos essenciais (descrição, valor, tipo, data, status).
- Racional: evita misturar semânticas com transações comuns e facilita evolução futura.
- Alternativa considerada: representar empréstimos como categoria de gasto/receita comum. Rejeitada por limitar regras específicas.

3. Entrada por foto com validação humana obrigatória
- Decisão: o sistema sugere campos extraídos da foto, mas o usuário deve confirmar/editar antes de salvar.
- Racional: OCR/extração pode conter erro; validação humana evita dados incorretos.
- Alternativa considerada: gravação automática sem confirmação. Rejeitada por alto risco de inconsistência.

4. Tema cinza como terceira opção orientada por tokens de cor
- Decisão: ajustar variáveis/tokens visuais centrais para suportar seleção entre preto, branco e cinza, aplicando a paleta cinza quando selecionada.
- Racional: preserva comportamento atual de temas e adiciona nova opção com baixo risco de regressão.
- Alternativa considerada: sobrescrita pontual por componente. Rejeitada por fragmentação do padrão visual.

## Risks / Trade-offs

- [Risk] Extração de nota fiscal falhar em fotos de baixa qualidade.
  - Mitigação: mensagens claras de erro, fallback para preenchimento manual e validação de campos obrigatórios.
- [Risk] Troca entre três temas gerar inconsistência visual em componentes secundários.
  - Mitigação: checklist de contraste e revisão dos estados de foco/hover/desabilitado em preto, branco e cinza.
- [Risk] Crescimento de complexidade no módulo de empréstimos.
  - Mitigação: iniciar com campos mínimos e regras objetivas, sem cálculos financeiros avançados neste ciclo.

## Migration Plan

1. Publicar alterações de tema e layout global com direitos autorais, incluindo a nova opção cinza no seletor.
2. Publicar módulo de empréstimos com persistência e navegação.
3. Publicar fluxo de gasto por foto em rollout controlado, mantendo formulário manual existente.
4. Monitorar erros de extração e regressões visuais; rollback via desativação do fluxo por foto e retorno aos tokens anteriores.

## Open Questions

- O texto legal de direitos autorais terá nome comercial fixo ou virá de configuração?
- O fluxo de foto da nota fiscal usará serviço já existente no projeto ou novo provedor?
- Em empréstimos, o status inicial padrão será “em aberto” para todos os registros?
