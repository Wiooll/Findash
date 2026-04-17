## ADDED Requirements

### Requirement: Testes de integração para CRUD de transações
O projeto MUST possuir testes de integração cobrindo criação, leitura, atualização e remoção de transações no fluxo completo de aplicação.

#### Scenario: Ciclo completo de transação
- **WHEN** a suíte de integração executa o fluxo de CRUD de transações
- **THEN** cada operação conclui com persistência e leitura consistentes no escopo do usuário autenticado

### Requirement: Testes de integração para CRUD de categorias
O projeto SHALL possuir testes de integração cobrindo criação, leitura, atualização e remoção de categorias.

#### Scenario: Ciclo completo de categoria
- **WHEN** a suíte de integração executa o fluxo de CRUD de categorias
- **THEN** a categoria é manipulada corretamente e refletida nas consultas subsequentes

### Requirement: Validação de relacionamento transação-categoria
Os testes MUST validar que transações respeitam a existência e a propriedade da categoria associada.

#### Scenario: Associação inválida de categoria
- **WHEN** o fluxo tenta criar transação com categoria inexistente ou pertencente a outro usuário
- **THEN** a operação falha com erro de validação sem persistir a transação
