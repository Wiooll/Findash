## ADDED Requirements

### Requirement: Notificar Recursos de Nova Versão
O sistema SHALL notificar o usuário quando a versão atual do app possuir novidades ainda não visualizadas por ele.

#### Scenario: Primeira abertura após atualização
- **WHEN** `APP_VERSION` for diferente da última versão visualizada registrada localmente
- **THEN** o sistema deve exibir uma notificação de novidades da versão atual
- **AND** a notificação deve conter ação para abrir a página de atualizações.

### Requirement: Exibir Página de Atualizações
O sistema SHALL disponibilizar uma página/aba de atualizações com os recursos implementados por versão.

#### Scenario: Acesso pela notificação
- **WHEN** o usuário clicar na notificação de novidades
- **THEN** o sistema deve direcionar para a página/aba "Atualizações"
- **AND** a versão atual deve ser marcada como visualizada.

#### Scenario: Consulta manual do histórico
- **WHEN** o usuário abrir manualmente a página/aba "Atualizações"
- **THEN** deve visualizar lista de versões com data e descrição dos recursos.
