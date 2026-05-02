## 1. Preparacao e seguranca de migracao
- [ ] 1.1 Inventariar todos os pontos de uso de Firestore no cliente.
- [ ] 1.2 Definir feature flag/config para habilitar sync automatico Drive sem bloquear release local.
- [ ] 1.3 Criar plano de rollback (voltar para somente local sem sync automatico).

## 2. Persistencia local como fonte unica
- [ ] 2.1 Remover listeners e operacoes Firestore do `FinanceContext`.
- [ ] 2.2 Garantir que todos os CRUDs operem em estado local e snapshot local por `uid`.
- [ ] 2.3 Preservar validacoes, regras de negocio e mensagens de erro existentes.

## 3. Manter autenticacao e desacoplar banco
- [ ] 3.1 Manter fluxo de login/logout Google no `AuthContext`.
- [ ] 3.2 Remover imports/servicos exclusivamente ligados ao Firestore.
- [ ] 3.3 Remover arquivos e configuracoes de regras Firestore nao utilizados.

## 4. Backup e sincronizacao automatica no Google Drive
- [ ] 4.1 Implementar servico de Drive para localizar/criar arquivo de backup do usuario.
- [ ] 4.2 Implementar upload automatico com debounce e retry leve.
- [ ] 4.3 Implementar restauracao automatica opcional no login com regra "mais recente vence".
- [ ] 4.4 Exibir status objetivo: sincronizado, pendente, erro e ultima sincronizacao.

## 5. Qualidade e regressao
- [ ] 5.1 Criar/atualizar testes unitarios de persistencia local e validacao de snapshot.
- [ ] 5.2 Criar/atualizar testes de integracao para CRUD sem Firestore.
- [ ] 5.3 Validar manualmente fluxo completo: login, CRUD, refresh, sync Drive, logout/login.

## 6. Documentacao, versao e comunicacao
- [ ] 6.1 Atualizar `README.md` para remover Firestore e documentar arquitetura local + Drive automatico.
- [ ] 6.2 Atualizar versao da aplicacao visivel ao usuario e notas de release.
- [ ] 6.3 Atualizar `CHANGELOG.md` com migracao e impactos.
