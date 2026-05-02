## Why

O produto precisa manter a autenticacao de usuario, mas remover totalmente o armazenamento de dados no Firebase/Firestore.
Tambem precisamos reduzir risco de perda de dados locais com backup/sincronizacao automatica no Google Drive da propria conta do usuario.

## What Changes

- Manter login com Google para controle de sessao e identificacao de usuario.
- Remover dependencias de persistencia em Firestore no cliente.
- Definir persistencia primaria local por usuario autenticado (localStorage no navegador).
- Adicionar sincronizacao automatica de backup JSON no Google Drive do usuario autenticado.
- Adicionar restauracao automatica opcional ao entrar na conta, com regra de conflito simples e previsivel.
- Atualizar documentacao e mensagens de interface para refletir arquitetura sem Firestore.

## Capabilities

### Modified Capabilities
- `firebase-user-auth`: manter autenticacao Google, removendo acoplamento com Firestore.

### Deprecated Capabilities
- `firestore-user-data-isolation`: deixar de ser aplicavel apos remocao do Firestore.

### New Capabilities
- `local-user-data-persistence`: persistencia local por usuario autenticado sem backend de banco.
- `google-drive-automatic-backup`: backup/sincronizacao automatica de snapshot no Google Drive.

## Impact

- Dados: leitura/escrita financeira deixa de usar colecoes remotas e passa a usar snapshot local por `uid`.
- Integracao: manter OAuth Google para login e adicionar fluxo OAuth/Drive para arquivo de backup.
- UX: incluir status de sincronizacao automatica, ultima sincronizacao e erros recuperaveis.
- Qualidade: novos testes para persistencia local, sincronizacao automatica e resolucao de conflito.
