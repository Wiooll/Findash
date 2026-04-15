## Why

Existem erros de ortografia, acentuação e concordância em textos do projeto (documentação, OpenSpec e mensagens visíveis ao usuário), o que reduz a clareza e a percepção de qualidade. Corrigir esses textos agora diminui ruído em revisões futuras e melhora comunicação com usuários e time.

## What Changes

- Revisar textos em português do repositório e corrigir ortografia, acentuação e gramática.
- Padronizar termos recorrentes em português (por exemplo, "projeção", "histórico", "variação").
- Manter significado original dos textos, sem alterar regras de negócio, APIs ou comportamento técnico.
- Registrar validação por diff para garantir que mudanças fiquem restritas a conteúdo textual.

## Capabilities

### New Capabilities
- `pt-br-text-quality`: Processo para revisão e correção sistemática de textos em português no repositório.

### Modified Capabilities
- Nenhuma.

## Impact

- Arquivos de documentação (`README`, `CHANGELOG`, `openspec/**`) e possíveis textos de interface em `src/**`.
- Sem impacto em dependências, modelos de dados, contratos de API ou fluxos funcionais.
