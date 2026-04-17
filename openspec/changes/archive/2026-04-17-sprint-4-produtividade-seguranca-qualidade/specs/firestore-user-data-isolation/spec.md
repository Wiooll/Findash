## ADDED Requirements

### Requirement: Isolamento de dados por usuário no Firestore
O sistema MUST garantir que cada leitura e escrita de transações e categorias ocorra somente no escopo do usuário autenticado.

#### Scenario: Consulta de dados do usuário logado
- **WHEN** o usuário autenticado consulta transações e categorias
- **THEN** o sistema retorna apenas documentos pertencentes ao seu identificador de usuário

### Requirement: Bloqueio de acesso cruzado
As regras de segurança do Firestore SHALL negar tentativas de leitura ou escrita em dados de outro usuário.

#### Scenario: Tentativa de acesso a documento de outro usuário
- **WHEN** uma requisição autenticada tenta acessar um documento associado a outro identificador de usuário
- **THEN** o Firestore rejeita a operação por regra de segurança

### Requirement: Integridade de associação de propriedade
O sistema MUST persistir documentos com referência explícita ao usuário proprietário e MUST impedir alteração indevida dessa associação.

#### Scenario: Criação de transação com proprietário
- **WHEN** o usuário cria ou importa uma transação
- **THEN** o documento salvo contém associação ao usuário autenticado e não pode ser transferido para outro usuário por atualização comum
