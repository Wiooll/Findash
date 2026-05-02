## Contexto

Hoje o app usa:
- AuthContext com Firebase Auth (Google).
- FinanceContext com Firestore em tempo real (`onSnapshot` + CRUD remoto).
- Snapshot local como apoio (backup/restauracao).

Objetivo desta change:
- preservar autenticacao;
- remover armazenamento Firestore;
- tornar dados locais por usuario;
- adicionar backup/sincronizacao automatica no Google Drive.

## Objetivos de Design

1. Nao perder o fluxo de login atual.
2. Manter API publica do `FinanceContext` com o menor numero de mudancas possivel.
3. Garantir persistencia local imediata e confiavel.
4. Incluir sincronizacao automatica no Drive com comportamento previsivel.
5. Manter implementacao incremental e reversivel por etapa.

## Arquitetura Alvo

### 1) Auth permanece
- `AuthContext` continua com Google Sign-In.
- `user.uid` continua sendo a chave de isolamento dos dados locais.

### 2) Persistencia local primaria
- `FinanceContext` deixa de usar Firestore.
- CRUD opera em estado local + persistencia em `localStorage` por chave do usuario.
- O snapshot local continua com schema versionado.

### 3) Sincronizacao automatica com Drive
- Novo servico de backup Drive:
  - localizar/criar arquivo de backup do usuario;
  - enviar snapshot atualizado (debounce);
  - baixar snapshot remoto para restauracao automatica opcional.
- Estrategia de conflito:
  - comparar `exportedAt` local vs remoto;
  - vencer o mais recente;
  - em empate, manter local.

## Fluxo de Dados

1. Usuario autentica com Google.
2. App carrega snapshot local por `uid`.
3. App tenta ler backup remoto (se permissao Drive ativa).
4. App aplica regra de conflito (mais recente vence).
5. Mudancas de dados gravam local imediatamente.
6. Mudancas acionam sync remoto com debounce e tolerancia a falhas.

## Decisoes

1. **Local-first obrigatorio**
- Justificativa: desempenho, simplicidade e funcionamento offline.

2. **Conflito por timestamp**
- Justificativa: regra simples para MVP, sem merge de entidades nesta fase.

3. **Falha de sync nao bloqueia uso**
- Justificativa: app deve continuar operando localmente mesmo sem Drive.

## Riscos e Mitigacoes

1. Escopo OAuth Drive aumentar complexidade
- Mitigacao: encapsular em servico unico e ativar por feature flag/config.

2. Conflito entre dispositivos
- Mitigacao: regra explicita de "mais recente vence" + mensagem de status.

3. Regressao em CRUD existente
- Mitigacao: manter contratos de funcoes atuais e cobrir com testes de integracao.

## Plano de Migracao

1. Etapa A: remover Firestore do `FinanceContext` mantendo comportamento funcional local.
2. Etapa B: remover `src/services/firebase.ts` (parte Firestore) e dependencia `firebase/firestore`.
3. Etapa C: adicionar servico de sync Drive automatico.
4. Etapa D: atualizar UI/README/CHANGELOG/especificacoes e validar regressao.

## Fora de Escopo

- Merge inteligente de itens conflitantes por entidade.
- Historico de versoes no Drive alem do arquivo principal.
- Sincronizacao em tempo real multi-dispositivo.
