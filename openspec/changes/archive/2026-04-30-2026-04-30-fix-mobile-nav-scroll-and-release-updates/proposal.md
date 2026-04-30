## Why

O menu inferior no mobile não está permitindo arraste horizontal consistente quando há muitas opções, prejudicando o acesso às abas finais.

Além disso, os usuários não têm um canal claro dentro do app para descobrir os recursos entregues em cada versão. Isso reduz adoção de novidades e aumenta dúvidas de suporte.

## What Changes

- Ajustar o comportamento do menu inferior mobile para permitir rolagem/arraste horizontal fluido e previsível.
- Adicionar notificação de novidades por versão quando o usuário ainda não visualizou os recursos da versão atual.
- Adicionar uma página/aba de "Atualizações" com histórico de versões e recursos implementados.
- Direcionar o usuário para a página de atualizações ao clicar na notificação.

## Capabilities

### Modified Capabilities
- `mobile-bottom-navigation`: melhora de usabilidade para arraste horizontal em telas pequenas.

### New Capabilities
- `release-updates-notification`: notificação por versão + página de atualizações com highlights.

## Impact

- UI de navegação mobile (Layout e Bottom Nav).
- Estado de UI para controle de versão visualizada (localStorage).
- Nova superfície de conteúdo para changelog de recursos.
- Documentação do projeto (README) e versionamento visível ao usuário.
