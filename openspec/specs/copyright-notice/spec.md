## ADDED Requirements

### Requirement: Exibir Direitos Autorais no Rodape Global
O sistema SHALL exibir um bloco de direitos autorais em pt-BR no rodapé global, visível em telas autenticadas da aplicação.

#### Scenario: Rodape exibido em tela principal
- **WHEN** o usuário acessar qualquer página principal da aplicação autenticada
- **THEN** o rodapé deve exibir texto de direitos autorais padronizado e consistente

#### Scenario: Ano atualizado dinamicamente
- **WHEN** o ano-calendário mudar
- **THEN** o texto de direitos autorais deve refletir o ano atual sem edição manual de código
