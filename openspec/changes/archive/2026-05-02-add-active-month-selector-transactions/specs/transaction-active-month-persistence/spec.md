## ADDED Requirements

### Requirement: Persistir mes ativo na tela de transacoes
A tela de transacoes MUST persistir o mes e o ano selecionados no seletor de data ja existente.

#### Scenario: Persistencia ao alterar periodo
- **WHEN** o usuario selecionar um mes/ano diferente no seletor de data
- **THEN** o sistema MUST salvar o periodo ativo para restauracao futura na mesma tela

### Requirement: Restaurar periodo ao retornar para a aba
A tela de transacoes MUST restaurar o ultimo mes/ano persistido quando o usuario sair e voltar para a aba.

#### Scenario: Retorno com valor persistido valido
- **WHEN** o usuario reabrir a aba de transacoes e existir periodo persistido valido
- **THEN** o sistema MUST carregar esse periodo como ativo antes de renderizar os dados

#### Scenario: Fallback para mes atual
- **WHEN** nao existir periodo persistido ou o valor salvo estiver invalido
- **THEN** o sistema MUST definir o mes/ano atual como periodo ativo padrao

### Requirement: Exibir dados coerentes com periodo restaurado
A tela de transacoes MUST renderizar lista e totais com base exclusivamente no periodo mensal ativo restaurado ou selecionado.

#### Scenario: Lista filtrada por periodo ativo
- **WHEN** existir um periodo ativo definido
- **THEN** o sistema MUST exibir apenas transacoes com data dentro do inicio e fim desse mes

#### Scenario: Totais coerentes com filtro
- **WHEN** o periodo ativo for restaurado ou alterado
- **THEN** o sistema MUST recalcular e exibir totais considerando somente as transacoes do periodo ativo
