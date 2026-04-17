## 1. Fundacao de seguranca e modelo de dados

- [x] 1.1 Configurar Firebase Auth no app (inicializacao, provider e estado de sessao)
- [x] 1.2 Implementar guardas de acesso para rotas e operacoes protegidas
- [x] 1.3 Ajustar modelo de persistencia para escopo por `uid` em transacoes e categorias
- [x] 1.4 Publicar e validar regras do Firestore para bloquear acesso cruzado entre usuarios

## 2. Importacao CSV de transacoes

- [x] 2.1 Implementar parser e normalizacao de CSV com mapeamento de cabecalho esperado
- [x] 2.2 Implementar validacao por linha (campos obrigatorios, tipos, datas e valores)
- [x] 2.3 Implementar fluxo de persistencia apenas para linhas validas no escopo do usuario autenticado
- [x] 2.4 Exibir feedback de importacao com total importado e relatorio de erros por linha

## 3. Exportacao CSV, Excel e PDF

- [x] 3.1 Criar camada comum de selecao/transformacao de dados para exportacao (resumo e detalhado)
- [x] 3.2 Implementar exportacao em CSV com filtros e periodo ativos
- [x] 3.3 Implementar exportacao em Excel com colunas consistentes ao modo selecionado
- [x] 3.4 Implementar exportacao em PDF para visao de resumo e detalhamento
- [x] 3.5 Integrar controles de exportacao na interface com tratamento de erro amigavel

## 4. Qualidade de formularios e mensagens

- [x] 4.1 Revisar validacoes de formularios de transacoes e categorias com regras consistentes
- [x] 4.2 Padronizar mensagens de erro em pt-BR com linguagem clara e acionavel
- [x] 4.3 Garantir tratamento seguro de erros de backend sem exposicao de detalhes sensiveis

## 5. Testes automatizados

- [x] 5.1 Criar testes unitarios para calculos financeiros criticos (totais, saldo, agregacoes e bordas)
- [x] 5.2 Criar testes de integracao para CRUD completo de transacoes no escopo autenticado
- [x] 5.3 Criar testes de integracao para CRUD completo de categorias e vinculo transacao-categoria
- [x] 5.4 Adicionar validacoes automatizadas para regras de isolamento por usuario

## 6. Fechamento da sprint

- [x] 6.1 Atualizar README.md com novos fluxos (auth, importacao e exportacao)
- [x] 6.2 Atualizar versao do projeto e numero de versao visivel ao usuario
- [x] 6.3 Executar verificacoes objetivas (lint, testes unitarios e testes de integracao)
- [x] 6.4 Consolidar resumo final de alteracoes para descricao de commit em pt-BR
