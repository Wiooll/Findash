## Context

O projeto possui textos em português distribuídos entre OpenSpec, documentação e partes da interface. Há inconsistências de acentuação e ortografia que não afetam execução, mas afetam entendimento e manutenção.

## Goals / Non-Goals

**Goals:**
- Corrigir erros de português em textos do repositório com mudanças pequenas e seguras.
- Preservar intenção original de cada mensagem/documento.
- Evitar alterações funcionais no código.

**Non-Goals:**
- Refatorar componentes ou lógica de negócio.
- Alterar contratos, APIs, tipos ou comportamento de features.
- Reescrever conteúdos além do necessário para correção linguística.

## Decisions

1. Correção orientada por diff, arquivo a arquivo
- Rationale: reduz risco de mudanças acidentais.
- Alternative considered: revisão em massa automatizada; descartada por maior chance de falso positivo.

2. Priorizar textos de usuário e documentação de produto
- Rationale: maior impacto imediato de qualidade.
- Alternative considered: incluir logs internos e identificadores; descartada por baixo valor e maior risco.

3. Manter termos técnicos e identificadores inalterados
- Rationale: preserva compatibilidade e rastreabilidade.
- Alternative considered: traduzir termos técnicos; descartada por risco de ambiguidade.

## Risks / Trade-offs

- [Risco] Correção linguística alterar sentido de uma frase -> Mitigação: manter mudanças mínimas e revisar contexto no diff.
- [Risco] Alterar texto usado em asserções de teste -> Mitigação: validar testes e ajustar apenas se necessário.
- [Risco] Mudanças excessivas em arquivo com trabalho em andamento -> Mitigação: limitar escopo a erros objetivos de português.

## Migration Plan

1. Criar inventário de arquivos com texto em português.
2. Aplicar correções ortográficas/gramaticais em pequenos lotes.
3. Revisar diffs para garantir ausência de alteração funcional.
4. Executar validação mínima (status/diff e testes disponíveis, quando aplicável).
5. Entregar resumo das alterações com sugestão de descrição de commit.

## Open Questions

- Há preferência por Acordo Ortográfico estrito em todo o repositório?
- Devemos incluir mensagens internas não visíveis ao usuário nesta revisão?
