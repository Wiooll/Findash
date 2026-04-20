## 1. Configuração Visual Orgânica
- [x] 1.1 Atualizar `index.css` e/ou variáveis do Tailwind (caso existam temas de contêineres customizados) para favorecer as bordas curvilíneas macias (estilo orgânico `rounded-[X]`).
- [x] 1.2 Revisar o root layout/encapsulamento primário das páginas para adicionar utilitários de margens seguros para as áreas de toque do mobile.

## 2. Core Bottom Navigation Menu
- [x] 2.1 Criar e estilizar novo componente `<MobileBottomNav />` isolado, estético e aderente no `bottom-0`.
- [x] 2.2 Inserir este componente dentro da árvore principal (`App.tsx` ou componente Layout equivalente) com regra responsiva de visibilidade apenas no `md:hidden`.

## 3. Adequação de Layout Existente
- [x] 3.1 Localizar o(s) componente(s) Header ou Sidebar e ocultá-los em monitores móveis com utilitários como `hidden md:flex` ou equivalentes lógicos.
- [x] 3.2 Adicionar preenchimento mestre contido à base da tag `<main>` ou root flex para adicionar suporte ao `<BottomNav />` (como  um `pb-20`), de forma que uma lista de transações não se esconda fatalmente atrás da nova barra de botões inferiores.

## 4. Tela de Login Otimizada Mobile
- [x] 4.1 Refatorar componentes do fluxo de Entrada (Login) para possuírem `rounded-2xl`/`3xl`.
- [x] 4.2 Assegurar que os botões ali presentes possuam espaçamento interno (`padding`) para garantirem um bloco táctil mínimo ergonômico seguro contra erros de toque na tela minúscula.
- [x] 4.3 Garantir que o container de Login rola livremente sem prender seus componentes críticos abaixo da nova Bottom Navigation.

## 5. Mobile Auditing
- [x] 5.1 Testar transições e simular aberturas de teclado de dispositivo móvel (`Focus` state on input fields) para auditar se o Bottom Nav reage adequadamente (por exemplo ocultando-se temporariamente ou acompanhando graciosamente a tela por `dvh`).
