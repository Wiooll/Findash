## Why

A Sprint 3 precisa transformar os dados financeiros já coletados em apoio prático para decisão. Hoje o usuário vê o histórico, mas ainda não recebe projeções e alertas que antecipem risco de saldo negativo, aumento de gastos e comportamentos atípicos.

## What Changes

- Implementar projeção de fim de mês com receita prevista, despesa prevista e saldo previsto.
- Criar comparação do mês atual versus mês anterior por categoria, com variação absoluta e percentual.
- Exibir insights automáticos de aumento e redução de gastos por categoria.
- Detectar despesa fora do padrão com uma regra simples de anomalia por histórico recente.
- Criar aba de Insights com histórico de alertas e sinais gerados para consulta posterior.

## Capabilities

### New Capabilities

- `month-end-projection`: calcula e apresenta projeção de receita, despesa e saldo até o fim do mês com base nos lançamentos atuais.
- `category-monthly-comparison`: compara gastos por categoria entre mês atual e mês anterior, destacando variação em valor e percentual.
- `automated-spending-insights`: gera mensagens automáticas sobre aumento e redução relevantes de gastos por categoria.
- `simple-expense-anomaly-detection`: identifica despesas fora do padrão esperado por categoria usando critério estatístico simples e explicável.
- `insights-alert-history`: disponibiliza uma aba dedicada para visualizar o histórico de insights e alertas gerados.

### Modified Capabilities

- Nenhuma.

## Impact

- Componentes de dashboard e visualização de dados financeiros.
- Camada de processamento/agregação para métricas mensais e geração de insights.
- Estrutura de navegação/UI para nova aba de Insights.
- Possível ajuste em tipos e contratos internos para representar projeções, comparativos, alertas e anomalias.
