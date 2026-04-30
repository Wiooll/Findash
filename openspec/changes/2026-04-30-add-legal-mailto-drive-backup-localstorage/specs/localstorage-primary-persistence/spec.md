## ADDED Requirements

### Requirement: Persistir Dados Financeiros no localStorage
O sistema SHALL usar `localStorage` como fonte principal para persistencia de dados financeiros do usuario no navegador.

#### Scenario: Carregar estado ao abrir a aplicacao
- **WHEN** o usuario abrir a aplicacao com dados validos previamente salvos
- **THEN** o sistema deve carregar os dados do `localStorage`

#### Scenario: Salvar alteracao de dados
- **WHEN** o usuario criar, editar ou remover registros financeiros
- **THEN** o sistema deve persistir a alteracao no `localStorage`

#### Scenario: Tratar dado local invalido
- **WHEN** o sistema detectar JSON malformado ou schema invalido no `localStorage`
- **THEN** o sistema deve ignorar o dado invalido e usar estado padrao seguro
- **AND** deve informar erro de forma clara ao usuario
