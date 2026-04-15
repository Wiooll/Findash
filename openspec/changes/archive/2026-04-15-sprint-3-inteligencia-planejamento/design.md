## Context

O dashboard atual consolida transações e apresenta visão histórica, mas não calcula previsões nem gera explicações automáticas sobre mudanças relevantes. A Sprint 3 adiciona uma camada de inteligência orientada por regras simples e explicáveis, sem introduzir dependências externas de machine learning.

## Goals / Non-Goals

**Goals:**
- Entregar projeção de fim de mês com receita, despesa e saldo previstos.
- Comparar mês atual versus mês anterior por categoria com variação absoluta e percentual.
- Gerar insights automáticos de aumento/redução de gastos por categoria.
- Detectar anomalias simples de despesa por categoria com regra determinística.
- Persistir e exibir histórico de alertas na aba Insights.

**Non-Goals:**
- Não implementar modelos preditivos avançados, IA generativa ou serviços externos.
- Não alterar o fluxo de cadastro/edição de transações.
- Não criar notificações push ou envio por email nesta sprint.

## Decisions

1. Camada de cálculo derivado no frontend, reaproveitando os dados já carregados
- Rationale: reduz risco de mudança arquitetural e acelera entrega.
- Alternative considered: mover cálculos para backend; descartado por aumentar escopo e acoplamento.

2. Projeção de fim de mês baseada em média diária observada no mês corrente
- Rationale: abordagem simples, explicável e suficiente para primeira versão.
- Alternative considered: usar média móvel de vários meses; descartado por complexidade maior nesta sprint.

3. Comparativo mensal por categoria usando chave normalizada de categoria
- Rationale: permite pareamento consistente entre meses e facilita testes.
- Alternative considered: comparar por descrição de transação; descartado por alta chance de ruído.

4. Insights e anomalias via regras de limiar configuráveis em código
- Rationale: comportamento previsível e fácil manutenção sem dependência externa.
- Alternative considered: heurística com pesos dinâmicos; descartado por dificultar explicabilidade.

5. Histórico de alertas centralizado em estrutura tipada dedicada
- Rationale: separa dados de apresentação e simplifica evolução da aba Insights.
- Alternative considered: recalcular sempre em tempo real sem histórico; descartado por perda de rastreabilidade.

## Risks / Trade-offs

- [Risco] Projeção oscilar muito no início do mês por pouca amostra -> Mitigação: exibir nível de confiança básico por dias observados.
- [Risco] Falsos positivos de anomalia em categorias com baixa recorrência -> Mitigação: aplicar regra mínima de quantidade histórica antes de alertar.
- [Risco] Regras muito rígidas perderem sinais relevantes -> Mitigação: centralizar limiares para ajuste rápido e cobrir com testes de regressão.
- [Risco] Impacto de performance em agregações grandes -> Mitigação: memoização e processamento em estruturas agregadas por mês/categoria.

## Migration Plan

1. Introduzir tipos e funções de agregação/projeção sem alterar telas existentes.
2. Integrar cards/indicadores de projeção e comparativo no dashboard atual.
3. Adicionar motor de insights e anomalia com testes unitários de regras.
4. Criar aba Insights com histórico de alertas e validar navegação.
5. Publicar com feature habilitada por padrão e monitorar comportamento.
6. Rollback: remover renderização da aba e dos blocos novos, mantendo dados base intactos.

## Open Questions

- Qual limiar inicial de variação percentual deve disparar insight de aumento/redução?
- O histórico de alertas deve ser somente da sessão atual ou persistido entre recargas?
- A aba Insights precisa filtros por período nesta primeira entrega ou apenas listagem cronológica?
