## ADDED Requirements

### Requirement: Persistencia local por usuario autenticado
O sistema SHALL persistir dados financeiros localmente no navegador, isolados por identificador do usuario autenticado.

#### Scenario: Carregar dados locais do usuario
- **WHEN** o usuario autenticado acessa o app
- **THEN** o sistema carrega o snapshot local associado ao seu `uid`
- **AND** nao deve carregar dados de outro usuario no mesmo dispositivo

#### Scenario: Salvar alteracoes locais
- **WHEN** o usuario cria, edita ou remove dados financeiros
- **THEN** o sistema persiste as alteracoes localmente sem dependencia de banco remoto

### Requirement: Resiliencia offline
O sistema MUST continuar funcional para leitura e escrita de dados mesmo sem conectividade de rede.

#### Scenario: Uso sem internet
- **WHEN** o usuario estiver sem conexao
- **THEN** operacoes de CRUD locais devem continuar funcionando
- **AND** eventual sincronizacao remota deve ser adiada sem bloquear o uso
