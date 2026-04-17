## ADDED Requirements

### Requirement: Validação consistente de formulários
O sistema MUST validar campos obrigatórios, formato e limites de entrada antes de submeter dados de transações e categorias.

#### Scenario: Campo obrigatório ausente
- **WHEN** o usuário tenta submeter formulário sem preencher um campo obrigatório
- **THEN** o sistema bloqueia o envio e destaca os campos inválidos

### Requirement: Mensagens de erro claras em pt-BR
O sistema SHALL apresentar mensagens de erro em português do Brasil com linguagem objetiva e orientada à ação.

#### Scenario: Erro de validação exibido ao usuário
- **WHEN** uma validação falha no formulário
- **THEN** a interface exibe mensagem em pt-BR explicando o problema e como corrigir

### Requirement: Tratamento de erro de integração com backend
O sistema MUST capturar falhas de persistência e MUST apresentar feedback amigável sem expor detalhes sensíveis de infraestrutura.

#### Scenario: Falha ao salvar dados
- **WHEN** ocorre erro ao salvar transação ou categoria no backend
- **THEN** o sistema exibe mensagem genérica segura para o usuário e registra detalhe técnico apenas em canal apropriado de diagnóstico
