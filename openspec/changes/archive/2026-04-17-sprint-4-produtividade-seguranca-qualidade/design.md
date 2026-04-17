## Context

O produto atual atende gestão financeira pessoal com foco em cadastro e visualização de dados, mas ainda apresenta três lacunas principais: baixa produtividade para carga e extração de dados, ausência de autenticação e segregação por usuário, e cobertura de testes insuficiente para fluxos críticos. A Sprint 4 introduz importação/exportação, autenticação com Firebase Auth, isolamento de dados no Firestore e fortalecimento de qualidade com testes e revisão de validações.

Restrições relevantes:
- Preservar padrão técnico já existente no projeto.
- Evitar refatorações fora de escopo.
- Garantir mensagens claras em pt-BR.
- Não expor dados sensíveis nem permitir acesso entre usuários.

Stakeholders:
- Usuário final: precisa importar/exportar rapidamente e confiar na integridade dos dados.
- Time de desenvolvimento: precisa reduzir regressões em cálculos e CRUD.

## Goals / Non-Goals

**Goals:**
- Permitir importação de transações por CSV com validação segura e feedback de erros.
- Permitir exportação em CSV/Excel/PDF em formatos de resumo e detalhado.
- Proteger acesso com Firebase Auth e restringir dados no Firestore por usuário autenticado.
- Cobrir cálculos financeiros críticos com testes unitários e CRUD de transações/categorias com testes de integração.
- Padronizar validações e mensagens de erro de formulário em pt-BR.

**Non-Goals:**
- Redesenhar interface completa do dashboard.
- Alterar regras de negócio centrais além do necessário para importação/exportação/autenticação.
- Migrar banco para outro provedor fora do Firebase.

## Decisions

1. **Auth centralizada com Firebase Auth**
- Decisão: usar Firebase Auth como origem única de identidade.
- Racional: integra naturalmente com Firestore e reduz implementação manual de segurança de sessão.
- Alternativas consideradas:
- Sessão custom com backend próprio: maior esforço e maior superfície de risco.
- Provedor externo sem integração nativa: mais complexidade operacional para o cenário atual.

2. **Modelo de dados isolado por `uid` no Firestore**
- Decisão: armazenar e consultar documentos sob escopo de usuário autenticado e aplicar regras de segurança negando acesso cruzado.
- Racional: isolamento por construção reduz risco de vazamento entre contas.
- Alternativas consideradas:
- Filtrar apenas no frontend: inseguro, não atende requisito de proteção real.
- Campo de usuário sem regra de segurança: risco de leitura indevida em consultas amplas.

3. **Pipeline de importação CSV em duas etapas (validar -> persistir)**
- Decisão: primeiro validar e normalizar linhas; só depois persistir linhas válidas e reportar falhas.
- Racional: melhora previsibilidade, evita gravação parcial inconsistente e facilita diagnóstico ao usuário.
- Alternativas consideradas:
- Persistir linha a linha sem pré-validação: risco de estado parcialmente inválido e UX pior para correção.

4. **Exportação com camada comum de seleção de dados + renderizadores por formato**
- Decisão: separar coleta/transformação de dados da geração de CSV/Excel/PDF.
- Racional: evita duplicação e mantém coerência entre resumo e detalhado.
- Alternativas consideradas:
- Implementação isolada por formato sem camada comum: aumenta divergência e custo de manutenção.

5. **Estratégia de testes orientada a risco**
- Decisão: priorizar unitários para cálculos críticos e integração para CRUD ponta a ponta.
- Racional: combina velocidade (unitário) com confiança de fluxo real (integração).
- Alternativas consideradas:
- Somente testes de UI: custo maior e baixa precisão para regras de cálculo.
- Somente unitários: não captura falhas de integração entre camadas.

## Risks / Trade-offs

- [Risco] Importações com CSV fora do padrão esperado gerarem erros frequentes. -> Mitigação: validação robusta de cabeçalho, tipos e datas, com relatório por linha.
- [Risco] Regras do Firestore bloquearem operações legítimas após ativação de isolamento. -> Mitigação: suite de testes de integração autenticados e checklist de cenários de permissão.
- [Risco] Divergência de números entre exportação e dashboard. -> Mitigação: reutilizar mesma fonte de agregação e adicionar testes de consistência.
- [Risco] Aumento de tempo de CI com novos testes. -> Mitigação: separar testes por escopo e otimizar dados de fixture.

## Migration Plan

1. Introduzir autenticação e suporte a `uid` nas operações de leitura/escrita.
2. Publicar regras do Firestore com isolamento por usuário.
3. Adaptar consultas e persistência para caminho/escopo de usuário.
4. Liberar importação CSV com validação e persistência segura.
5. Liberar exportação CSV/Excel/PDF (resumo e detalhado).
6. Adicionar testes unitários e de integração cobrindo novos fluxos.
7. Revisar mensagens de erro e validações com foco em pt-BR.

Rollback:
- Feature flags ou desligamento temporário de rotas/botões de import/export.
- Reversão de regras de Firestore para última versão estável validada.
- Reversão de deploy para versão anterior caso autenticação impacte acesso.

## Open Questions

- O login deve suportar somente e-mail/senha nesta sprint ou também provedores sociais?
- A exportação PDF exige layout institucional específico (logo, rodapé e paginação custom)?
- O critério de cobertura mínima de testes será definido por percentual global ou por módulo crítico?
