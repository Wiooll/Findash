# transaction-import-csv Specification

## Purpose
TBD - created by archiving change sprint-4-produtividade-seguranca-qualidade. Update Purpose after archive.
## Requirements
### Requirement: Importação de transações por CSV
O sistema SHALL permitir que o usuário importe transações por arquivo CSV com mapeamento de campos obrigatórios (`data`, `descricao`, `valor`, `tipo` e `categoria`).

#### Scenario: Importação com arquivo válido
- **WHEN** o usuário envia um CSV com cabeçalho suportado e linhas válidas
- **THEN** o sistema importa as transações e exibe confirmação com total de registros importados

### Requirement: Validação e tratamento de erros na importação
O sistema MUST validar cada linha do CSV antes da persistência e MUST reportar erros por linha sem interromper a análise do arquivo inteiro.

#### Scenario: Arquivo com linhas inválidas
- **WHEN** o usuário envia um CSV contendo linhas com data inválida ou valor não numérico
- **THEN** o sistema informa as linhas rejeitadas com motivo de erro e importa apenas as linhas válidas

### Requirement: Segurança de escopo na importação
O sistema SHALL associar toda transação importada ao usuário autenticado ativo no momento da operação.

#### Scenario: Importação por usuário autenticado
- **WHEN** um usuário autenticado conclui uma importação CSV
- **THEN** as transações importadas ficam disponíveis somente no escopo de dados desse usuário

