## Context

A aplicação já possui uma barra de navegação inferior para mobile, mas o comportamento atual de gesto não garante acesso confiável a todos os itens quando a lista excede a largura da tela.

Também já existe exibição de versão em pontos da interface, porém sem um fluxo de descoberta orientado a novidades.

## Goals / Non-Goals

**Goals:**
- Garantir arraste horizontal funcional no menu mobile com boa ergonomia de toque.
- Exibir notificação de novidades quando o usuário abrir uma versão ainda não visualizada.
- Disponibilizar uma página/aba "Atualizações" com resumo de recursos por versão.
- Marcar a versão como visualizada após o usuário acessar a página de atualizações.

**Non-Goals:**
- Implementar sistema remoto de changelog via backend.
- Criar push notifications ou dependências externas.
- Refatorar componentes fora do escopo de navegação mobile e atualização por versão.

## Decisions

- Fonte de dados das novidades será local e versionada no projeto (ex.: constante tipada).
- Critério de exibição da notificação: `lastSeenVersion !== APP_VERSION`.
- Persistência de leitura no `localStorage`, com chave estável e sem dados sensíveis.
- Notificação terá CTA para abrir a aba/página de atualizações.
- O menu mobile deve priorizar gesto horizontal sem perder acessibilidade de toque.

## Data Model (alto nível)

- `ReleaseNote`
  - `version: string`
  - `date: string`
  - `highlights: string[]`
  - `details?: string[]`

- `ReleaseSeenState`
  - `lastSeenVersion: string | null`

## Risks / Trade-offs

- Se a versão for alterada sem adicionar conteúdo correspondente no changelog, o usuário pode ver notificação vazia.
  - Mitigação: validação em runtime com fallback de mensagem padrão.
- Em telas muito pequenas, área de toque da navegação pode conflitar com gesto de scroll.
  - Mitigação: ajustes de layout/gesto e testes manuais em breakpoints móveis.

## Validation Plan

- Validar manualmente que todas as abas do menu mobile podem ser alcançadas por arraste.
- Validar que a notificação aparece na primeira abertura de uma nova versão.
- Validar que, após abrir "Atualizações", a notificação deixa de aparecer para a mesma versão.
- Executar testes automatizados existentes e incluir testes unitários para utilitários de versão/leitura.
