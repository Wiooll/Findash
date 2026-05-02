## Why

A tela de transacoes ja possui seletor de data, porem o periodo escolhido se perde ao sair e voltar para a aba. Persistir a data ativa melhora a continuidade de uso e evita que o usuario precise refazer a selecao repetidamente.

## What Changes

- Persistir o mes/ano selecionado no seletor ja existente da tela de transacoes.
- Atualizar a listagem e os totais da tela para refletirem somente o mes selecionado.
- Restaurar automaticamente o ultimo mes ativo ao retornar para a aba de transacoes.
- Definir fallback para mes atual quando nao houver valor persistido ou quando o valor salvo for invalido.
- Exibir estado de interface para ausencia de transacoes no mes ativo, sem quebrar o fluxo do usuario.

## Capabilities

### New Capabilities
- `transaction-active-month-persistence`: Permite persistir e restaurar o mes/ano ativo na tela de transacoes usando o seletor de data ja existente.

### Modified Capabilities
Nenhuma.

## Impact

- Frontend da tela de transacoes (estado de mes ativo, restauracao de contexto e renderizacao da lista).
- Camada de consulta/filtragem de transacoes por periodo mensal.
- Testes da tela de transacoes para cobrirem persistencia/restauracao de periodo e estado sem resultados.
