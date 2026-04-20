## ADDED Requirements

### Requirement: Padronizar Layout Global com Tres Temas e Rodape Legal
As interfaces da aplicação SHALL suportar os temas preto, branco e cinza no layout base e incluir área de rodapé para direitos autorais sem comprometer responsividade mobile.

#### Scenario: Layout principal em viewport mobile
- **WHEN** o usuário acessar a aplicação em dispositivo móvel e alternar entre os temas
- **THEN** os temas preto, branco e cinza, com rodapé de direitos autorais, devem ser exibidos sem ocultar conteúdo crítico

#### Scenario: Layout principal em viewport desktop
- **WHEN** o usuário acessar a aplicação em dispositivo desktop e alternar entre os temas
- **THEN** os temas preto, branco e cinza, com rodapé de direitos autorais, devem manter alinhamento visual consistente com o restante da interface
