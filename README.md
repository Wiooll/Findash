# 💳 Nexus Finance | Seu Dashboard Financeiro

O **Nexus Finance** é um dashboard moderno, interativo e totalmente responsivo para controle anual de despesas e finanças pessoais. Desenvolvido para transformar planilhas cansativas em uma experiência de usuário visualmente agradável, ágil e que segue padrões de design de grandes aplicativos do mercado financeiro.

![Nexus Finance Preview](https://via.placeholder.com/1200x600.png?text=Nexus+Finance+Dashboard) *(Ilustração do layout principal)*

---

## ✨ Funcionalidades Principais

🚀 **Interface Ágil e Edição Inline**
Diga adeus a dezenas de modais e formulários pesados! Todas as transações e categorias podem ser adicionadas ou editadas diretamente na interface da tabela de forma fluida.

📊 **Dashboard de Analytics em Tempo Real**
- Resumo automático de **Saldo Total, Receitas, Despesas e Economia Mensal**.
- Gráfico dinâmico dos **últimos 12 meses** de fluxo de caixa (Barras).
- Distribuição de gastos por **Categoria no mês atual** (Donut interactivo).

🎯 **Controle de Metas e Alertas Inteligentes**
- Defina uma meta estrita de economia mensal.
- Acompanhe o seu progresso através de uma barra dinâmica visual.
- **Insights Preditivos:** O sistema te avisará se os gastos de uma categoria específica (como *Alimentação*) ultrapassarem a faixa segura de 40% das suas despesas do mês e alertará caso a economia não atinja os conformes previstos.

🧾 **Gestor de Transações Completo**
- Multi-Filtros: Filtre em tempo real por **mês**, **tipo** (receita/despesa) ou faça **buscas inteiras por descrição e categorias**.
- Separação granular do seu dinheiro através de campos automáticos de **Forma de Pagamento** (Dinheiro, Cartão de Crédito, Débito e PIX).

🎨 **UI/UX Profissional (Design System)**
- Paleta visual consistente (Verde para sucesso, Vermelho vivo para despesas, tons escuros e azuis para informações).
- **Modo Escuro (Dark Mode) Nativo:** Trabalhamos de forma elegante para conforto dos olhos à noite, tudo integrado à preferência e editável com um clique no menu.

---

## 🛠️ Tecnologias Utilizadas

Este projeto foi forjado utilizando o que há de melhor em ecossistema web moderno:
- **[React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)** — Para construir UIs rápidas e completamente resilientes contra falhas.
- **[Vite](https://vitejs.dev/)** — Dev server extremamente rápido.
- **[Tailwind CSS (v3)](https://tailwindcss.com/)** — Para uma paleta sofisticada em seu design system nativo de modo claro e escuro.
- **[Recharts](https://recharts.org/)** — Componentes de gráficos interativos incríveis.
- **[Lucide React](https://lucide.dev/)** — Ícones perfeitos e fluídos.
- **[Date-fns](https://date-fns.org/)** — Manipulação leve de datas para relatórios concisos.

---

## 💾 Persistência de Dados

Sua privacidade entra em jogo: Por padrão o Nexus Finance está programado para usar a funcionalidade de **LocalStorage**. Toda entrada gravada persistirá confinado diretamente em seu navegador (sem passar por nenhum banco de dados público). Feche e abra na hora que quiser e seus dados ainda piscarão na tela no mesmo centísegundo.

> **Extensibilidade Pronta:** Caso queira escalar a aplicação usando **Firebase, Supabase ou PostgreSQL**, a arquitetura inteira centraliza o estado via Context API (`FinanceContext.tsx`). Basta alterar os gatilhos dos métodos no contexto por suas *Promises* do servidor para uma alteração "Plug & Play" com backend!

---

## ⚙️ Como Executar o Projeto Localmente

**Pré-requisitos:** Você precisará ter o [Node.js](https://nodejs.org/) instalado em seu computador (Recomendado v18+).

1. Clone o repositório ou navegue até a pasta instanciada:
```bash
cd dash_gastos
```

2. Instale todas as dependências do projeto contidas no manifest, usando NPM:
```bash
npm install
```

3. Gire o servidor de desenvolvimento na sua máquina e inicie sua mágica visual:
```bash
npm run dev
```

4. Abra o seu navegador preferido em: `http://localhost:5173`

---

*Desenvolvido com carinho visual para uma experiência Premium. Aproveite seu Dashboard!* 💡
