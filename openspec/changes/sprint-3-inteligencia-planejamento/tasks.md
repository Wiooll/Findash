## 1. Foundation and Data Contracts

- [ ] 1.1 Mapear pontos de extensao no dashboard atual para projecao, comparativo e insights
- [ ] 1.2 Criar/ajustar tipos para ProjectionSummary, CategoryComparison, InsightAlert e AnomalyAlert
- [ ] 1.3 Implementar utilitarios base para agregacao mensal por categoria e normalizacao de chaves

## 2. Month-end Projection

- [ ] 2.1 Implementar calculo de projecao de fim de mes (receita, despesa e saldo previstos)
- [ ] 2.2 Expor metadados da projecao (periodo observado e media diaria usada)
- [ ] 2.3 Integrar card/area de projecao no dashboard com tratamento de estados vazios

## 3. Month-over-Month Category Comparison

- [ ] 3.1 Implementar comparativo de gasto por categoria entre mes atual e mes anterior
- [ ] 3.2 Calcular variacao absoluta e percentual por categoria com tratamento de divisao por zero
- [ ] 3.3 Exibir tabela/listagem de comparativo com ordenacao util para leitura

## 4. Automated Insights and Anomaly Rules

- [ ] 4.1 Implementar regras de insight de aumento/reducao com limiares configuraveis em codigo
- [ ] 4.2 Implementar regra deterministica de anomalia por categoria com minimo historico obrigatorio
- [ ] 4.3 Gerar mensagens de insight/anomalia com categoria, variacao e contexto numerico

## 5. Insights Tab and Alert History

- [ ] 5.1 Criar aba "Insights" na navegacao preservando padrao visual do projeto
- [ ] 5.2 Implementar historico cronologico de alertas com tipo, categoria, timestamp e resumo
- [ ] 5.3 Garantir integracao entre geracao de insights e renderizacao do historico

## 6. Validation and Regression Safety

- [ ] 6.1 Criar testes unitarios para funcoes de projecao, comparativo e regras de insight/anomalia
- [ ] 6.2 Validar cenarios limites (inicio de mes, categorias sem historico, meses sem dados)
- [ ] 6.3 Executar suite existente e corrigir regressao antes de concluir a change
