## Why

O layout atual da interface do aplicativo não está respondendo adequadamente em dispositivos móveis. Alguns elementos cruciais e botões essenciais, como o botão de login, não ficam visíveis no formato mobile. Adicionalmente, a navegação com o menu clássico dificulta a usabilidade com uma mão. Inserir uma navegação inferior fixa (bottom menu) e atualizar o design system para um estilo mais "orgânico" (com toques macios, curvos e touch targets aprimorados) irá solucionar os gargalos na UX mobile de uma vez por todas.

## What Changes

- Implementação de um **menu de navegação inferior** (Bottom Navigation) no mobile, substituindo ou coexistindo condicionalmente com o sidebar/header tradicional em pequenos *viewports*.
- Remoção do "corte" na tela ou *overflow* escondido que vitimiza o botão de Login e demais botões primários nas interações com formulários.
- Conversão da geometria visual com a regra estrita de design *Soft/Rounded*: migração das bordas, modais estruturais e botões para bordas curvilíneas (ex: `rounded-2xl` a `rounded-full`) e adoção de espaçamentos (paddings) maiores visando tornar os botões de ação ergonômicos e orgânicos.
- Otimização do design-system/Tailwind para dar sensação de "app nativo", com transição fluída e responsiva.

## Capabilities

### New Capabilities
- `mobile-bottom-navigation`: Implementação da barra de navegação principal estilo mobile, ancorada na parte inferior da página, roteando as abas de trabalho vitais do app.
- `organic-layout-standards`: Otimização puramente visual orientada a um estilo orgânico (macio) em botões, campos e limites de layout da tela.

### Modified Capabilities


## Impact

A camada visual (arquivos de interface de usuário, arquivos root CSS com padrões Tailwind) será altamente impactada, sem, contudo, interferir nas funções back-end da aplicação. Componentes como `Header.tsx`, `Layout.tsx` (ou equivalentes), `Login.tsx` e botões de chamada primários receberão ajustes consideráveis, enquanto novas lógicas para esconder/exibir o Bottom Menu serão implementadas.
