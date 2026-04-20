## Context

Atualmente, o Findash apresenta problemas de ergonomia e acessibilidade em telas pequenas (mobile). O menu principal e os contêineres de conteúdo, como formulários de login, não são encapsulados de maneira otimizada provocando o desaparecimento de botões e causando frustração aos usuários móveis (que constituem grande parte do acesso). Uma migração visual para uma arquitetura híbrida com barras fixas (Bottom Navigation) se faz urgente.

## Goals / Non-Goals

**Goals:**
- Mudar a experiência base mobile pela introdução de uma **Bottom Navigation Menu**.
- Eliminar qualquer possível quebra ou invisibilidade do formulário principal de **Login**.
- Redesenhar elementos gerais focando no eixo "Soft/Rounded", para um layout mais "orgânico" e premium.

**Non-Goals:**
- Reestruturação de states do React ou banco de dados.
- Modificar o fluxo transacional (criação de items) ou lógica. O foco é 100% UI UX.
- Uso forçado de libs de UI mastigadas (múltiplos *shadcn* defaults não devem ser forçados), vamos focar primordialmente em Tailwind com CSS utilitário para seguir guidelines.

## Decisions

- **Layout Mobile:** Introduzir componente nativo de Bottom Navigation (com as views de Dashboard, Extrato, etc). Este componente ficará fixo usando `md:hidden flex fixed bottom-0 w-full`.
- **Áreas de Segurança (Safe touch targets):** Refatorar paddings para botões de Login / Call-to-action garantindo um alvo mínimo de tap de ~44x44px. Remover ou aliviar atributos de sobreposição em telas P e XS.
- **Geometria / Estética:** Em vez da tradicional fronteira afiada, adotaremos `rounded-2xl` e `rounded-3xl` dependendo da área da tela (Card vs Wrapper principal), transmitindo fluidez, organicidade e um design altamente moderno.

## Risks / Trade-offs

- **[Risk] Viewport dinâmico (Virtual Keyboard):** Quando o usuário toca num campo, navegadores móveis sobem o teclado virtual. Uma barra `bottom-0` estática pode tapar o input ou saltar em cima do teclado bizarramente.
  - *Mitigação:* Usar `dvh` (Dynamic view-port) ou lógicas de input focus (esconder/ofuscar a bottom bar quando o teclado estiver ativo).
