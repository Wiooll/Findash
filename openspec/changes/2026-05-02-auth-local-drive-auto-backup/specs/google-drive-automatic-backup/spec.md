## ADDED Requirements

### Requirement: Backup automatico no Google Drive
O sistema SHALL sincronizar automaticamente o snapshot de dados locais do usuario autenticado para um arquivo de backup no Google Drive da propria conta.

#### Scenario: Sincronizacao apos alteracao de dados
- **WHEN** ocorrer alteracao de dados financeiros locais
- **THEN** o sistema agenda upload automatico do snapshot para o Google Drive
- **AND** aplica debounce para evitar excesso de requisicoes

### Requirement: Restauracao automatica opcional no login
O sistema SHALL permitir restauracao automatica no login com base no backup remoto quando habilitado.

#### Scenario: Backup remoto mais recente
- **WHEN** a restauracao automatica estiver habilitada e o backup remoto for mais recente que o local
- **THEN** o sistema restaura o backup remoto e atualiza o estado local

### Requirement: Resolucao de conflito previsivel
O sistema MUST aplicar regra deterministica de conflito entre snapshot local e remoto.

#### Scenario: Conflito local vs remoto
- **WHEN** houver snapshots local e remoto validos com timestamps diferentes
- **THEN** o sistema deve manter o snapshot mais recente (`exportedAt`)
- **AND** em empate deve manter o snapshot local

### Requirement: Falha de sincronizacao nao bloqueante
O sistema MUST manter operacao local mesmo quando a sincronizacao com Drive falhar.

#### Scenario: Erro no upload automatico
- **WHEN** ocorrer falha de autenticacao, permissao ou rede na sincronizacao
- **THEN** o sistema nao deve perder dados locais
- **AND** deve exibir estado de erro recuperavel ao usuario
