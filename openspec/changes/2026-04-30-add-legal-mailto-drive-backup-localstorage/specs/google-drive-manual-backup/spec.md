## ADDED Requirements

### Requirement: Realizar Backup Manual no Google Drive
O sistema SHALL permitir que o usuario exporte e restaure manualmente os dados locais por arquivo JSON no Google Drive da propria conta autenticada.

#### Scenario: Exportar backup manual
- **WHEN** o usuario solicitar exportacao de backup
- **THEN** o sistema deve gerar um arquivo JSON com metadados de versao e data de exportacao

#### Scenario: Enviar backup para Google Drive
- **WHEN** o usuario selecionar a acao de envio ao Google Drive
- **THEN** o sistema deve permitir upload manual do arquivo de backup na conta Google autenticada

#### Scenario: Restaurar backup valido
- **WHEN** o usuario importar um arquivo JSON valido de backup
- **THEN** o sistema deve validar o schema antes de restaurar
- **AND** deve solicitar confirmacao antes de sobrescrever os dados atuais

#### Scenario: Rejeitar backup invalido
- **WHEN** o usuario importar arquivo invalido ou nao compativel
- **THEN** o sistema nao deve sobrescrever os dados locais
- **AND** deve exibir mensagem de erro explicando o motivo
