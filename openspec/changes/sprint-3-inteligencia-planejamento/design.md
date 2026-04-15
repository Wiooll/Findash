## Context

O dashboard atual consolida transacoes e apresenta visao historica, mas nao calcula previsoes nem gera explicacoes automaticas sobre mudancas relevantes. A Sprint 3 adiciona uma camada de inteligencia orientada por regras simples e explicaveis, sem introduzir dependencias externas de machine learning.

## Goals / Non-Goals

**Goals:**
- Entregar projecao de fim de mes com receita, despesa e saldo previstos.
- Comparar mes atual versus mes anterior por categoria com variacao absoluta e percentual.
- Gerar insights automaticos de aumento/reducao de gastos por categoria.
- Detectar anomalias simples de despesa por categoria com regra deterministica.
- Persistir e exibir historico de alertas na aba Insights.

**Non-Goals:**
- Nao implementar modelos preditivos avancados, IA generativa ou servicos externos.
- Nao alterar o fluxo de cadastro/edicao de transacoes.
- Nao criar notificacoes push ou envio por email nesta sprint.

## Decisions

1. Camada de calculo derivado no frontend, reaproveitando os dados ja carregados
- Rationale: reduz risco de mudanca arquitetural e acelera entrega.
- Alternative considered: mover calculos para backend; descartado por aumentar escopo e acoplamento.

2. Projecao de fim de mes baseada em media diaria observada no mes corrente
- Rationale: abordagem simples, explicavel e suficiente para primeira versao.
- Alternative considered: usar media movel de varios meses; descartado por complexidade maior nesta sprint.

3. Comparativo mensal por categoria usando chave normalizada de categoria
- Rationale: permite pareamento consistente entre meses e facilita testes.
- Alternative considered: comparar por descricao de transacao; descartado por alta chance de ruido.

4. Insights e anomalias via regras de limiar configuraveis em codigo
- Rationale: comportamento previsivel e facil manutencao sem dependencia externa.
- Alternative considered: heuristica com pesos dinamicos; descartado por dificultar explicabilidade.

5. Historico de alertas centralizado em estrutura tipada dedicada
- Rationale: separa dados de apresentacao e simplifica evolucao da aba Insights.
- Alternative considered: recalcular sempre em tempo real sem historico; descartado por perda de rastreabilidade.

## Risks / Trade-offs

- [Risco] Projecao oscilar muito no inicio do mes por pouca amostra -> Mitigacao: exibir nivel de confianca basico por dias observados.
- [Risco] Falsos positivos de anomalia em categorias com baixa recorrencia -> Mitigacao: aplicar regra minima de quantidade historica antes de alertar.
- [Risco] Regras muito rigidas perderem sinais relevantes -> Mitigacao: centralizar limiares para ajuste rapido e cobrir com testes de regressao.
- [Risco] Impacto de performance em agregacoes grandes -> Mitigacao: memoizacao e processamento em estruturas agregadas por mes/categoria.

## Migration Plan

1. Introduzir tipos e funcoes de agregacao/projecao sem alterar telas existentes.
2. Integrar cards/indicadores de projecao e comparativo no dashboard atual.
3. Adicionar motor de insights e anomalia com testes unitarios de regras.
4. Criar aba Insights com historico de alertas e validar navegacao.
5. Publicar com feature habilitada por padrao e monitorar comportamento.
6. Rollback: remover renderizacao da aba e dos blocos novos, mantendo dados base intactos.

## Open Questions

- Qual limiar inicial de variacao percentual deve disparar insight de aumento/reducao?
- O historico de alertas deve ser somente da sessao atual ou persistido entre recargas?
- A aba Insights precisa filtros por periodo nesta primeira entrega ou apenas listagem cronologica?
