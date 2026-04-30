## Context

O sistema ja possui autenticacao Google e persistencia em nuvem, mas a diretriz atual e operar com dados principais no `localStorage` do navegador, mantendo backup manual no Google Drive da conta do usuario. Tambem existe necessidade de ampliar conformidade institucional com documentos legais e canal formal de contato.

## Goals / Non-Goals

**Goals:**
- Expor canal de sugestoes e bugs por `mailto` para `suporte.listae@gmail.com`.
- Publicar Termos de Uso, Politica de Privacidade e Politica de Cookies acessiveis pelo rodape.
- Consolidar `localStorage` como origem principal dos dados financeiros no cliente.
- Permitir backup manual no Google Drive com exportacao/importacao de JSON validado.
- Preservar direitos autorais no rodape institucional.

**Non-Goals:**
- Sincronizacao automatica bidirecional com Google Drive.
- Controle de versao de multiplos backups em nuvem nesta fase.
- Migracao silenciosa e irrestrita de dados sem validacao.

## Decisions

1. Rodape institucional unico
- Decisao: centralizar direitos autorais, contato e links legais no rodape global.
- Racional: reduz duplicacao e garante acesso constante a documentos obrigatorios.

2. Persistencia principal em `localStorage`
- Decisao: leitura/escrita do estado financeiro sera feita em chaves versionadas no navegador.
- Racional: atende requisito de operacao local e simplifica uso offline.
- Alternativa rejeitada: manter Firestore como fonte principal, por divergencia com o escopo aprovado.

3. Backup manual no Google Drive por arquivo JSON
- Decisao: gerar snapshot JSON unico, com upload manual para Drive e restauracao manual por selecao do arquivo.
- Racional: menor risco operacional que sync automatica; implementacao incremental e auditavel pelo usuario.
- Alternativa rejeitada: sincronizacao automatica continua (complexidade alta e risco de conflito/perda).

4. Validacao estrita no restore
- Decisao: restauracao so acontece com schema minimo valido e confirmacao explicita do usuario.
- Racional: evita corrupcao da base local por arquivo invalido ou incompleto.

## Data Model

Estrutura de backup (JSON):

```json
{
  "version": "5.0.0",
  "exportedAt": "2026-04-30T12:00:00.000Z",
  "app": "FinDash",
  "data": {
    "transactions": [],
    "categories": [],
    "recurringTransactions": [],
    "categoryBudgets": [],
    "config": {},
    "contas": [],
    "cartoesCredito": [],
    "faturaStatuses": [],
    "loans": []
  }
}
```

Notas:
- `version` identifica compatibilidade de formato do backup.
- `exportedAt` apoia rastreabilidade de restauracao.
- `data` contem apenas entidades de dominio esperadas.

## Error Handling

- `mailto`: se o cliente de email nao abrir, exibir orientacao para envio manual ao endereco oficial.
- Exportacao: bloquear acao quando nao houver dados validos serializaveis.
- Importacao: rejeitar arquivo invalido, vazio, com JSON malformado ou schema nao suportado.
- Restore: exigir confirmacao antes de sobrescrever dados locais.

## Migration Plan

1. Introduzir camada de persistencia local com adaptador isolado.
2. Migrar leitura inicial para `localStorage` com fallback seguro para estado padrao.
3. Introduzir export/import local de backup JSON.
4. Integrar upload/download manual com Google Drive na conta autenticada.
5. Publicar links legais e `mailto` no rodape institucional.

## Risks / Trade-offs

- [Risk] Limite de armazenamento do navegador.
  - Mitigacao: validacao de tamanho, mensagens claras e incentivo de backup periodico.
- [Risk] Arquivo de backup manipulado externamente.
  - Mitigacao: validacao de estrutura, tipos e campos obrigatorios antes de restaurar.
- [Risk] Regressao por troca de origem de dados.
  - Mitigacao: testes de carga/salvamento locais e testes de restauracao ponta a ponta.

## Open Questions

- Onde posicionar a UI de backup manual (configuracoes gerais ou secao dedicada)?
- O app deve manter uma copia local do ultimo backup exportado para download rapido?
