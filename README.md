# ðŸ’³ FinDash | Seu Dashboard Financeiro

O **FinDash** Ã© um dashboard moderno, interativo e totalmente responsivo para controle anual de despesas e finanÃ§as pessoais. Desenvolvido para transformar planilhas cansativas em uma experiÃªncia de usuÃ¡rio visualmente agradÃ¡vel, Ã¡gil e que segue padrÃµes de design de grandes aplicativos do mercado financeiro.

![FinDash Preview](https://via.placeholder.com/1200x600.png?text=FinDash+Dashboard) *(IlustraÃ§Ã£o do layout principal)*

---

## âœ¨ Funcionalidades Principais

ðŸš€ **Interface Ãgil e EdiÃ§Ã£o Inline**
Diga adeus a dezenas de modais e formulÃ¡rios pesados! Todas as transaÃ§Ãµes e categorias podem ser adicionadas ou editadas diretamente na interface da tabela de forma fluida.

ðŸ“Š **Dashboard de Analytics em Tempo Real**
- Resumo automÃ¡tico de **Saldo Total, Receitas, Despesas e Economia Mensal**.
- GrÃ¡fico dinÃ¢mico dos **Ãºltimos 12 meses** de fluxo de caixa (Barras).
- DistribuiÃ§Ã£o de gastos por **Categoria no mÃªs atual** (Donut interactivo).

ðŸŽ¯ **Controle de Metas e Alertas Inteligentes**
- Defina uma meta estrita de economia mensal.
- Acompanhe o seu progresso atravÃ©s de uma barra dinÃ¢mica visual.
- **Insights Preditivos:** O sistema te avisarÃ¡ se os gastos de uma categoria especÃ­fica (como *AlimentaÃ§Ã£o*) ultrapassarem a faixa segura de 40% das suas despesas do mÃªs e alertarÃ¡ caso a economia nÃ£o atinja os conformes previstos.

ðŸ§¾ **Gestor de TransaÃ§Ãµes Completo**
- Multi-Filtros: Filtre em tempo real por **mÃªs**, **tipo** (receita/despesa/transferÃªncia) ou faÃ§a **buscas inteiras por descriÃ§Ã£o e categorias**.
- SeparaÃ§Ã£o granular do seu dinheiro atravÃ©s de campos automÃ¡ticos de **Forma de Pagamento** (Dinheiro, CartÃ£o de CrÃ©dito, DÃ©bito e PIX).
- Suporte a **compras parceladas**: gere N transaÃ§Ãµes automaticamente com badge de parcela (ex: `2/6`), distribuÃ­das nos meses corretos.
- VinculaÃ§Ã£o de transaÃ§Ãµes a **contas** ou **cartÃµes de crÃ©dito** especÃ­ficos.

ðŸ¦ **MÃ³dulo de Contas e Carteiras** *(Sprint 2)*
- Cadastre contas do tipo **Corrente, PoupanÃ§a, Dinheiro e Investimento**.
- Acompanhe o **saldo em tempo real** de cada conta, calculado a partir do saldo inicial e das transaÃ§Ãµes vinculadas.
- Visualize o **extrato de movimentaÃ§Ãµes** por conta diretamente na tela.
- **TransferÃªncia entre contas** com registro automÃ¡tico de entrada e saÃ­da sem distorcer os totais de receita/despesa.

ðŸ’³ **CartÃ£o de CrÃ©dito e Faturas** *(Sprint 2)*
- Cadastre cartÃµes com **limite, dia de fechamento e dia de vencimento**.
- Navegue entre perÃ­odos de fatura com controle de mÃªs e veja todos os lanÃ§amentos do perÃ­odo.
- Acompanhe **limite utilizado vs. disponÃ­vel** com barra visual no card de cada cartÃ£o.
- **Parcelamento de compras** distribui automaticamente cada parcela pelo mÃªs correto de competÃªncia.
- **Pagar Fatura** marca o status e registra a saÃ­da na conta de dÃ©bito vinculada.

ðŸŽ¨ **UI/UX Profissional (Design System)**
- Paleta visual consistente (Verde para sucesso, Vermelho vivo para despesas, tons escuros e azuis para informaÃ§Ãµes).
- **Modo Escuro (Dark Mode) Nativo:** Trabalhamos de forma elegante para conforto dos olhos Ã  noite, tudo integrado Ã  preferÃªncia e editÃ¡vel com um clique no menu.

---

## ðŸ› ï¸ Tecnologias Utilizadas

Este projeto foi forjado utilizando o que hÃ¡ de melhor em ecossistema web moderno:
- **[React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)** â€” Para construir UIs rÃ¡pidas e completamente resilientes contra falhas.
- **[Vite](https://vitejs.dev/)** â€” Dev server extremamente rÃ¡pido.
- **[Tailwind CSS (v3)](https://tailwindcss.com/)** â€” Para uma paleta sofisticada em seu design system nativo de modo claro e escuro.
- **[Recharts](https://recharts.org/)** â€” Componentes de grÃ¡ficos interativos incrÃ­veis.
- **[Lucide React](https://lucide.dev/)** â€” Ãcones perfeitos e fluÃ­dos.
- **[Date-fns](https://date-fns.org/)** â€” ManipulaÃ§Ã£o leve de datas para relatÃ³rios concisos.

---

## â˜ï¸ PersistÃªncia de Dados e Firebase

Os dados da aplicaÃ§Ã£o (TransaÃ§Ãµes, Categorias e ConfiguraÃ§Ãµes de tema) agora sÃ£o persistidos e sincronizados em tempo real utilizando o **Firebase Firestore**. 

> **ConfiguraÃ§Ã£o:** Todo o funcionamento do backend exige que vocÃª preencha as suas credenciais no arquivo local `.env.local` criado durante o setup (veja o `.env.example`). O Contexto (`FinanceContext.tsx`) gerencia a atualizaÃ§Ã£o em tempo real (`onSnapshot`) entÃ£o caso abra o dashboard em mÃºltiplos computadores, todos exibirÃ£o lanÃ§amentos novos automaticamente garantindo que nÃ£o perca nada quando formatar seu PC!

---

## âš™ï¸ Como Executar o Projeto Localmente

**PrÃ©-requisitos:** VocÃª precisarÃ¡ ter o [Node.js](https://nodejs.org/) instalado em seu computador (Recomendado v18+).

1. Clone o repositÃ³rio ou navegue atÃ© a pasta instanciada:
```bash
cd dash_gastos
```

2. Instale todas as dependÃªncias do projeto contidas no manifest, usando NPM:
```bash
npm install
```

3. Gire o servidor de desenvolvimento na sua mÃ¡quina e inicie sua mÃ¡gica visual:
```bash
npm run dev
```

4. Abra o seu navegador preferido em: `http://localhost:5173`

---

*Desenvolvido com carinho visual para uma experiÃªncia Premium. Aproveite seu Dashboard!* ðŸ’¡
## AtualizaÃ§Ãµes Recentes
- CorreÃ§Ã£o no cÃ¡lculo de limite de cartÃ£o para compras parceladas: o limite disponÃ­vel agora considera o total ainda nÃ£o quitado (incluindo parcelas futuras) e deixa de considerar parcelas de faturas jÃ¡ pagas.
- Sprint 3 - InteligÃªncia e Planejamento:
  - ProjeÃ§Ã£o de fim de mÃªs com receita, despesa e saldo previstos.
  - ComparaÃ§Ã£o do mÃªs atual vs mÃªs anterior por categoria, com variaÃ§Ã£o absoluta e percentual.
  - Insights automÃ¡ticos de aumento/reduÃ§Ã£o de gastos por categoria.
  - DetecÃ§Ã£o de despesa fora do padrÃ£o com regra simples e explicÃ¡vel.
  - Nova aba "Insights" com histÃ³rico cronolÃ³gico de alertas.

## Sprint 4 - Produtividade, Seguranca e Qualidade (v4.2.0)

- Autenticacao com Firebase Auth via Google.
- Isolamento de dados por usuario no Firestore em `users/{uid}/...`.
- SincronizaÃ§Ã£o de Dados Antigos: UsuÃ¡rios com dados locais ou legados agora podem migrar seus dados para a nuvem da sua conta Google logada com apenas um clique.
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

## Sprint 4.2.1 - Landing de Entrada

- A tela pÃºblica de autenticaÃ§Ã£o foi evoluÃ­da para uma landing page completa com proposta de valor, recursos, fluxo de uso e FAQ.
- CTA primÃ¡rio mantido em `Entrar com Google`, preservando o fluxo atual sem criar novas rotas.
- ExibiÃ§Ã£o de versÃ£o na experiÃªncia pÃºblica para reforÃ§ar rastreabilidade de release.

## Sprint 4.2.2 - Acessibilidade e UX da Landing

- Melhorias de acessibilidade na landing de entrada: status semÃ¢ntico de carregamento, `aria-busy` e feedback de erro com `role="alert"`.
- InclusÃ£o de `main` como landmark principal e reforÃ§o de foco visÃ­vel para navegaÃ§Ã£o por teclado.
- Ajustes de responsividade no cabeÃ§alho e refinamento da copy dos CTAs para reduzir ambiguidade de aÃ§Ã£o.
- OtimizaÃ§Ã£o leve: dados estÃ¡ticos de benefÃ­cios e FAQ movidos para fora do componente.
