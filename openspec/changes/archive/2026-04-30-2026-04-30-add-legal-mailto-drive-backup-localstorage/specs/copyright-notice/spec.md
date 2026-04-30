## MODIFIED Requirements

### Requirement: Exibir Direitos Autorais no Rodape Global
O sistema SHALL exibir direitos autorais no rodape global com texto padronizado em pt-BR, ano dinamico e coexistencia com links institucionais.

#### Scenario: Rodape institucional completo
- **WHEN** o usuario acessar qualquer tela principal autenticada
- **THEN** o rodape deve exibir direitos autorais e links de contato/legal

#### Scenario: Ano dinamico preservado
- **WHEN** o ano-calendario mudar
- **THEN** o texto de direitos autorais deve refletir o ano atual automaticamente
