## ADDED Requirements

### Requirement: Registrar Emprestimos com Campos Essenciais
O sistema SHALL permitir cadastrar empréstimos com, no mínimo, descrição, valor, tipo (emprestado ou recebido), data e status.

#### Scenario: Cadastro valido de emprestimo
- **WHEN** o usuário preencher os campos obrigatórios e confirmar o cadastro
- **THEN** o empréstimo deve ser salvo e exibido na sessão de empréstimos

#### Scenario: Falha por campo obrigatório ausente
- **WHEN** o usuário tentar salvar um empréstimo sem preencher campo obrigatório
- **THEN** o sistema deve bloquear o salvamento e exibir mensagem de validação em pt-BR

### Requirement: Acompanhar Status de Emprestimos
O sistema SHALL exibir listagem de empréstimos com status e permitir atualização de status para acompanhamento.

#### Scenario: Atualizacao de status
- **WHEN** o usuário alterar o status de um empréstimo existente
- **THEN** o novo status deve ser persistido e refletido imediatamente na listagem
