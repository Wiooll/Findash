## Context

A tela de transacoes exibe dados por periodo e ja possui seletor de data, mas o mes ativo nao e mantido quando o usuario sai e volta para a aba. Isso gera retrabalho e quebra de contexto. A mudanca precisa preservar o padrao visual existente, manter baixo acoplamento e garantir consistencia entre valor persistido, filtro aplicado e totais exibidos.

## Goals / Non-Goals

**Goals:**
- Persistir o mes/ano selecionado no controle ja existente da tela de transacoes.
- Restaurar automaticamente o ultimo periodo ativo ao retornar para a aba.
- Garantir que lista e indicadores da tela reflitam apenas o periodo selecionado.
- Definir fallback previsivel para o mes atual quando nao houver persistencia valida.
- Manter a implementacao simples, com baixo impacto em componentes nao relacionados.

**Non-Goals:**
- Nao alterar regras de categorizacao ou importacao de transacoes.
- Nao introduzir filtros adicionais (ex.: por categoria, valor ou conta) neste escopo.
- Nao redesenhar a arquitetura global de estado da aplicacao.
- Nao substituir o seletor de data atual por outro componente.

## Decisions

1. Persistencia local do mes ativo por contexto de tela
- Decisao: manter `activeMonth`/`activeYear` no estado da tela e persistir em armazenamento local do cliente (ex.: `localStorage`) com chave especifica da feature.
- Racional: implementacao simples, restauracao rapida de contexto e baixo impacto arquitetural.
- Alternativa considerada: estado global compartilhado entre modulos. Rejeitada por ampliar escopo sem necessidade.

2. Filtragem por intervalo mensal fechado
- Decisao: filtrar transacoes por inicio e fim do mes selecionado, incluindo limites.
- Racional: comportamento deterministico e facil de testar.
- Alternativa considerada: filtrar por string de competencia. Rejeitada por depender de formatos e aumentar fragilidade.

3. Reuso integral do seletor existente
- Decisao: nao alterar o componente visual de selecao; apenas conectar eventos de mudanca ao fluxo de persistencia.
- Racional: preserva UX atual e reduz risco de regressao visual e funcional.
- Alternativa considerada: criar novo seletor. Rejeitada por duplicacao e fora do escopo.

4. Estado vazio explicito para mes sem transacoes
- Decisao: exibir mensagem clara quando nao houver itens no mes ativo.
- Racional: evita percepcao de falha e melhora entendimento.
- Alternativa considerada: lista vazia sem feedback textual. Rejeitada por baixa usabilidade.

## Risks / Trade-offs

- [Risco] Valor persistido invalido ou corrompido causar tela inconsistente -> Mitigacao: validar formato do mes/ano salvo e aplicar fallback para mes atual.
- [Risco] Divergencia entre mes exibido no seletor e dados renderizados por atualizacao assincrona -> Mitigacao: atualizar estado, persistencia e consulta na mesma transicao e cobrir com teste de integracao.
- [Risco] Regressao em calculos de totais ao aplicar filtro mensal -> Mitigacao: adicionar casos de teste para totais com troca de mes.
- [Trade-off] Persistencia local simplifica escopo, mas nao sincroniza entre dispositivos -> Mitigacao: manter decisao documentada e reavaliar apenas se surgir requisito multi-dispositivo.
