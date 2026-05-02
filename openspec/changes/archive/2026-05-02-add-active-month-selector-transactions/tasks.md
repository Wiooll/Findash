## 1. Persistencia do periodo selecionado

- [x] 1.1 Identificar o estado atual do seletor de data na tela de transacoes.
- [x] 1.2 Conectar a alteracao de mes/ano do seletor existente ao salvamento do periodo ativo.
- [x] 1.3 Implementar chave de persistencia estavel para restauracao segura do contexto da aba.

## 2. Restauracao e coerencia de exibicao

- [x] 2.1 Restaurar o ultimo periodo persistido ao retornar para a aba de transacoes.
- [x] 2.2 Aplicar fallback para mes atual quando nao houver valor salvo valido.
- [x] 2.3 Garantir que lista e totais usem sempre o mesmo periodo ativo restaurado/selecionado.
- [x] 2.4 Exibir estado vazio com mensagem em pt-BR quando nao houver transacoes no periodo ativo.

## 3. Validacao e cobertura

- [x] 3.1 Criar/ajustar testes para validar persistencia do periodo ao trocar o mes/ano.
- [x] 3.2 Criar/ajustar testes para validar restauracao ao sair e voltar para a aba.
- [x] 3.3 Criar/ajustar testes para validar fallback e coerencia de totais/lista com periodo restaurado.
- [x] 3.4 Executar verificacoes objetivas (testes e/ou build) para confirmar ausencia de regressao.
