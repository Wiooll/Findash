## 1. Foundation and Data Contracts

- [x] 1.1 Mapear pontos de extensão no dashboard atual para projeção, comparativo e insights
- [x] 1.2 Criar/ajustar tipos para ProjectionSummary, CategoryComparison, InsightAlert e AnomalyAlert
- [x] 1.3 Implementar utilitários base para agregação mensal por categoria e normalização de chaves

## 2. Month-end Projection

- [x] 2.1 Implementar cálculo de projeção de fim de mês (receita, despesa e saldo previstos)
- [x] 2.2 Expor metadados da projeção (período observado e média diária usada)
- [x] 2.3 Integrar card/área de projeção no dashboard com tratamento de estados vazios

## 3. Month-over-Month Category Comparison

- [x] 3.1 Implementar comparativo de gasto por categoria entre mês atual e mês anterior
- [x] 3.2 Calcular variação absoluta e percentual por categoria com tratamento de divisão por zero
- [x] 3.3 Exibir tabela/listagem de comparativo com ordenação útil para leitura

## 4. Automated Insights and Anomaly Rules

- [x] 4.1 Implementar regras de insight de aumento/redução com limiares configuráveis em código
- [x] 4.2 Implementar regra determinística de anomalia por categoria com mínimo histórico obrigatório
- [x] 4.3 Gerar mensagens de insight/anomalia com categoria, variação e contexto numérico

## 5. Insights Tab and Alert History

- [x] 5.1 Criar aba "Insights" na navegação preservando padrão visual do projeto
- [x] 5.2 Implementar histórico cronológico de alertas com tipo, categoria, timestamp e resumo
- [x] 5.3 Garantir integração entre geração de insights e renderização do histórico

## 6. Validation and Regression Safety

- [x] 6.1 Criar testes unitários para funções de projeção, comparativo e regras de insight/anomalia
- [x] 6.2 Validar cenários limites (início de mês, categorias sem histórico, meses sem dados)
- [x] 6.3 Executar suíte existente e corrigir regressão antes de concluir a change
