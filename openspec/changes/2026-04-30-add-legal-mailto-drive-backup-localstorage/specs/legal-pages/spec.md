## ADDED Requirements

### Requirement: Publicar Paginas Legais Obrigatorias
O sistema SHALL disponibilizar Termos de Uso, Politica de Privacidade e Politica de Cookies acessiveis por links no rodape institucional.

#### Scenario: Acesso aos Termos de Uso
- **WHEN** o usuario clicar no link "Termos de Uso"
- **THEN** o sistema deve exibir a pagina de Termos de Uso com data de ultima atualizacao

#### Scenario: Acesso a Politica de Privacidade
- **WHEN** o usuario clicar no link "Politica de Privacidade"
- **THEN** o sistema deve exibir a pagina de Politica de Privacidade com informacoes de coleta e uso de dados

#### Scenario: Acesso a Politica de Cookies
- **WHEN** o usuario clicar no link "Politica de Cookies"
- **THEN** o sistema deve exibir a pagina de Politica de Cookies com os tipos de cookies utilizados
