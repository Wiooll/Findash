## Why

O produto precisa evoluir a experiência visual e ampliar o controle financeiro com novas frentes de uso real: empréstimos e lançamento de gastos por nota fiscal. Ao mesmo tempo, é necessário ampliar o sistema de temas para incluir a opção cinza junto dos temas preto e branco, além de incluir direitos autorais para reforçar consistência e conformidade.

## What Changes

- Adicionar exibição de direitos autorais no aplicativo, com texto em pt-BR e ano atual.
- Adicionar sessão de empréstimos para registrar operações de empréstimo com status e valores.
- Adicionar fluxo para registrar gastos a partir de foto da nota fiscal, com extração assistida dos campos principais.
- Adicionar tema cinza como terceira opção de tema da aplicação, coexistindo com os temas preto e branco, mantendo legibilidade, contraste e consistência.

## Capabilities

### New Capabilities
- `copyright-notice`: exibe direitos autorais no layout principal com conteúdo padronizado em pt-BR.
- `loan-tracking`: permite criar e acompanhar empréstimos no contexto financeiro do usuário.
- `receipt-photo-expense-entry`: permite criar gasto a partir de foto de nota fiscal com preenchimento assistido.
- `gray-theme-system`: estabelece tema cinza como terceira opção selecionável no sistema de temas (preto, branco e cinza).

### Modified Capabilities
- `organic-layout-standards`: atualiza requisitos visuais para contemplar os três temas (preto, branco e cinza) e rodapé com direitos autorais.

## Impact

- Interface: ajustes em layout global, rodapé, telas e componentes de formulários financeiros.
- Domínio de dados: inclusão de entidade/campos para empréstimos e metadados de nota fiscal.
- Serviços: integração de upload/processamento de imagem para extração de dados da nota fiscal.
- Qualidade: novos cenários de teste para validação visual, fluxo de empréstimos e captura por foto.
