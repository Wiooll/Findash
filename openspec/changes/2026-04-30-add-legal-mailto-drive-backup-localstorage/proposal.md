## Why

O produto precisa oferecer um canal simples de contato para suporte, formalizar documentos legais obrigatorios e permitir que o usuario mantenha copia de seguranca dos dados na propria conta Google Drive. Alem disso, o direcionamento atual do produto define o `localStorage` como fonte principal de persistencia local, com backup manual externo.

## What Changes

- Adicionar links institucionais no rodape para:
  - Sugestoes e reporte de bugs via `mailto` para `suporte.listae@gmail.com`.
  - Termos de Uso.
  - Politica de Privacidade.
  - Politica de Cookies.
- Manter e padronizar exibicao de direitos autorais no rodape global.
- Definir `localStorage` como persistencia principal no cliente para os dados financeiros.
- Adicionar fluxo de backup manual no Google Drive da conta do usuario:
  - Exportar snapshot local em arquivo JSON.
  - Importar snapshot JSON validado para restauracao.

## Capabilities

### New Capabilities
- `mailto-feedback-channel`: canal de contato por email com assunto/corpo pre-preenchidos para sugestoes e bugs.
- `legal-pages`: publicacao de Termos de Uso, Politica de Privacidade e Politica de Cookies com acesso pelo rodape.
- `localstorage-primary-persistence`: persistencia principal dos dados financeiros no navegador do usuario.
- `google-drive-manual-backup`: backup manual para Google Drive com exportacao e restauracao por arquivo.

### Modified Capabilities
- `copyright-notice`: atualizar padrao do rodape institucional mantendo direitos autorais junto dos novos links legais.

## Impact

- Interface: novos links no rodape, telas/secoes legais e area de backup/restauracao.
- Dados: leitura/escrita principal em `localStorage` com validacao de estrutura.
- Integracoes: autenticacao Google e fluxo manual com Google Drive API para upload/download de arquivo de backup.
- Qualidade: novos testes para persistencia local, importacao/exportacao, validacao de arquivo e links institucionais.
