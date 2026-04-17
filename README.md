# 💳 FinDash | Seu Dashboard Financeiro

O **FinDash** é um dashboard moderno, interativo e totalmente responsivo para controle anual de despesas e finanças pessoais. Desenvolvido para transformar planilhas cansativas em uma experiência de usuário visualmente agradável, ágil e que segue padrões de design de grandes aplicativos do mercado financeiro.

![FinDash Preview](https://via.placeholder.com/1200x600.png?text=FinDash+Dashboard) *(Ilustração do layout principal)*

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
- Multi-Filtros: Filtre em tempo real por **mês**, **tipo** (receita/despesa/transferência) ou faça **buscas inteiras por descrição e categorias**.
- Separação granular do seu dinheiro através de campos automáticos de **Forma de Pagamento** (Dinheiro, Cartão de Crédito, Débito e PIX).
- Suporte a **compras parceladas**: gere N transações automaticamente com badge de parcela (ex: `2/6`), distribuídas nos meses corretos.
- Vinculação de transações a **contas** ou **cartões de crédito** específicos.

🏦 **Módulo de Contas e Carteiras** *(Sprint 2)*
- Cadastre contas do tipo **Corrente, Poupança, Dinheiro e Investimento**.
- Acompanhe o **saldo em tempo real** de cada conta, calculado a partir do saldo inicial e das transações vinculadas.
- Visualize o **extrato de movimentações** por conta diretamente na tela.
- **Transferência entre contas** com registro automático de entrada e saída sem distorcer os totais de receita/despesa.

💳 **Cartão de Crédito e Faturas** *(Sprint 2)*
- Cadastre cartões com **limite, dia de fechamento e dia de vencimento**.
- Navegue entre períodos de fatura com controle de mês e veja todos os lançamentos do período.
- Acompanhe **limite utilizado vs. disponível** com barra visual no card de cada cartão.
- **Parcelamento de compras** distribui automaticamente cada parcela pelo mês correto de competência.
- **Pagar Fatura** marca o status e registra a saída na conta de débito vinculada.

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

## ☁️ Persistência de Dados e Firebase

Os dados da aplicação (Transações, Categorias e Configurações de tema) agora são persistidos e sincronizados em tempo real utilizando o **Firebase Firestore**. 

> **Configuração:** Todo o funcionamento do backend exige que você preencha as suas credenciais no arquivo local `.env.local` criado durante o setup (veja o `.env.example`). O Contexto (`FinanceContext.tsx`) gerencia a atualização em tempo real (`onSnapshot`) então caso abra o dashboard em múltiplos computadores, todos exibirão lançamentos novos automaticamente garantindo que não perca nada quando formatar seu PC!

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
## Atualizações Recentes
- Correção no cálculo de limite de cartão para compras parceladas: o limite disponível agora considera o total ainda não quitado (incluindo parcelas futuras) e deixa de considerar parcelas de faturas já pagas.
- Sprint 3 - Inteligência e Planejamento:
  - Projeção de fim de mês com receita, despesa e saldo previstos.
  - Comparação do mês atual vs mês anterior por categoria, com variação absoluta e percentual.
  - Insights automáticos de aumento/redução de gastos por categoria.
  - Detecção de despesa fora do padrão com regra simples e explicável.
  - Nova aba "Insights" com histórico cronológico de alertas.

## Sprint 4 - Produtividade, Seguranca e Qualidade (v4.1.0)

- Autenticacao com Firebase Auth via Google.
- Isolamento de dados por usuario no Firestore em `users/{uid}/...`.
- Importacao de transacoes por CSV com validacao por linha e relatorio de erros.
- Exportacao de transacoes em CSV, Excel (`.xls`) e PDF (resumo e detalhado).
- Reforco de validacoes de formularios e mensagens de erro em pt-BR.
- Testes unitarios para calculos financeiros criticos.
- Testes de integracao para CRUD de transacoes/categorias e isolamento por usuario.
- Versao visivel no layout da aplicacao.

## Firestore Rules

- Arquivo adicionado: `firestore.rules`.
- Estrategia: apenas o usuario autenticado pode ler/escrever seus dados em `users/{uid}`.
- Publicacao recomendada:
  - `firebase deploy --only firestore:rules --project <seu-projeto>`

## Configuracao do Login Google no Firebase

- No Firebase Console, acesse `Authentication > Sign-in method`.
- Habilite o provedor `Google`.
- Em ambiente local, valide o dominio de desenvolvimento (`localhost`) em `Authentication > Settings > Authorized domains`.
