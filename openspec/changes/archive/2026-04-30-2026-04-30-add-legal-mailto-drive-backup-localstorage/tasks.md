## 1. Pagina de Gerenciamento e Contato

- [x] 1.1 Criar aba/pagina de Gerenciamento no menu principal (desktop e mobile) para concentrar os novos recursos.
- [x] 1.2 Implementar acoes de Sugestao e Reporte de Bug via `mailto` para `suporte.listae@gmail.com`.
- [x] 1.3 Conectar acoes legais (Termos, Privacidade e Cookies) para paginas funcionais definitivas.
- [x] 1.4 Validar ortografia pt-BR e responsividade geral da pagina de Gerenciamento.

## 2. Paginas Legais

- [x] 2.1 Criar pagina de Termos de Uso com data de ultima atualizacao.
- [x] 2.2 Criar pagina de Politica de Privacidade com secoes de coleta, uso e retencao.
- [x] 2.3 Criar pagina de Politica de Cookies com classificacao e finalidade dos cookies locais.
- [x] 2.4 Integrar navegacao para as paginas legais a partir da pagina de Gerenciamento sem quebrar fluxo autenticado atual.

## 3. Persistencia Principal em localStorage

- [x] 3.1 Criar adaptador de persistencia local versionado para entidades financeiras.
- [x] 3.2 Migrar ciclo de leitura/escrita principal para `localStorage`.
- [x] 3.3 Implementar validacao de schema e fallback seguro para estado padrao.
- [x] 3.4 Garantir tratamento de erro para indisponibilidade de armazenamento local.

## 4. Backup Manual Google Drive

- [x] 4.1 Implementar exportacao de snapshot local para JSON com metadados de versao e data.
- [x] 4.2 Implementar importacao de JSON com validacao antes da restauracao.
- [x] 4.3 Integrar fluxo manual com Google Drive da conta autenticada para upload/download de backup.
- [x] 4.4 Exibir mensagens claras de sucesso, erro e confirmacao de sobrescrita.

## 5. Qualidade, Documentacao e Versao

- [x] 5.1 Adicionar/atualizar testes para persistencia local, import/export e links legais.
- [x] 5.2 Atualizar README.md com a nova pagina de Gerenciamento.
- [x] 5.3 Atualizar versao do projeto (codigo e exibicao para usuario) para `4.4.1`.
- [x] 5.4 Atualizar CHANGELOG.md com resumo objetivo em pt-BR da nova pagina.
