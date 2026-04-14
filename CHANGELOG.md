# Changelog

Todas as mudanças relevantes de versão deste projeto serão documentadas neste arquivo.

O formato segue uma adaptação de [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/) e [SemVer](https://semver.org/lang/pt-BR/).

## [2.0.0] - 2026-04-14

### Adicionado
- **Módulo de Contas/Carteiras**: suporte a contas do tipo corrente, poupança, dinheiro e investimento, com saldo calculado em tempo real a partir das transações vinculadas.
- **Transferência entre Contas**: criação de duas transações do tipo `transferencia` (saída e entrada) que atualizam automaticamente os saldos das contas sem distorcer receitas/despesas.
- **Cartão de Crédito**: cadastro de cartões com limite, dia de fechamento, dia de vencimento e conta de débito vinculada.
- **Sistema de Faturas**: cálculo automático do período de competência de cada fatura com base nas regras do cartão (fechamento e vencimento).
- **Parcelamento de Compras**: suporte a compras parceladas que geram N transações individuais agrupadas por `parcelaGrupoId`, distribuídas nos meses seguintes.
- **Resumo de Faturas no Dashboard**: card de "Faturas em Aberto", saldo real (descontando faturas), alerta de próximo vencimento e mini-lista de faturas por cartão com barra de progresso e status.
- **Pagar Fatura**: botão para marcar fatura como paga e registrar a saída na conta de débito vinculada.
- **Coleções Firestore**: `contas`, `cartoesCredito` e `faturaStatus`.
- **Navegação expandida**: novas abas "Contas" e "Cartões" no menu lateral e mobile.

### Alterado
- Transações podem agora ser vinculadas a uma conta (`contaId`) ou cartão de crédito (`cartaoId`).
- TransactionsTable suporta seleção de conta/cartão por método de pagamento e parcelamento inline.
- Dashboard ignora transferências nos totais de receita/despesa para evitar dupla contagem.
- Filtro de transações inclui a opção "Transferências".

## [1.0.0] - 2026-04-13

### Adicionado
- Layout responsivo para desktop e mobile.
- Integração com Firebase/Firestore para persistência e sincronização em tempo real.
- Gerenciamento global de estado financeiro via contexto da aplicação.
- Ajustes de estrutura para variáveis de ambiente (`.env.example` e `.env.local`).

### Alterado
- Nome do pacote alterado de `dash_gastos` para `findash`.
- Atualização da documentação no `README.md` com recursos e instruções do projeto.

## [0.0.0] - 2026-04-11

### Adicionado
- Inicialização do projeto com React + TypeScript + Vite.
- Configuração de Tailwind CSS e PostCSS.
- Estrutura inicial do dashboard financeiro com componentes principais.
- Configuração de build/lint e arquivos base do projeto.

[1.0.0]: https://github.com/Wiooll/Findash/releases/tag/v1.0.0
