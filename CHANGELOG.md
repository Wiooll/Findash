# Changelog

Todas as mudancas relevantes de versao deste projeto serao documentadas neste arquivo.

O formato segue uma adaptacao de [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/) e [SemVer](https://semver.org/lang/pt-BR/).

## [2.1.0] - 2026-04-15

### Adicionado
- Projecao de fim de mes no Dashboard com receita prevista, despesa prevista, saldo previsto, media diaria e nivel de confianca.
- Comparacao do mes atual vs mes anterior por categoria com variacao absoluta e percentual.
- Motor de insights automaticos para aumento e reducao de gastos por categoria.
- Deteccao simples de anomalias de despesa por categoria com historico minimo e limiar deterministico.
- Nova aba `Insights` com historico cronologico de alertas, resumo por tipo e filtro.
- Tipos e utilitarios dedicados para analise financeira em `src/types.ts` e `src/utils/financialInsights.ts`.
- Testes unitarios para projecao, comparativo, insights e anomalias com `vitest`.

### Alterado
- Navegacao principal expandida para incluir a aba `Insights`.
- Dashboard atualizado para exibir preview de insights recentes e tabela de comparacao entre meses.

## [2.0.1] - 2026-04-14

### Corrigido
- Limite do cartao em compras parceladas agora considera todo o valor ainda nao quitado, inclusive parcelas futuras.
- Parcelas pertencentes a competencias de fatura marcadas como `paga` nao comprometem mais o limite disponivel.

## [2.0.0] - 2026-04-14

### Adicionado
- **Modulo de Contas/Carteiras**: suporte a contas do tipo corrente, poupanca, dinheiro e investimento, com saldo calculado em tempo real a partir das transacoes vinculadas.
- **Transferencia entre Contas**: criacao de duas transacoes do tipo `transferencia` (saida e entrada) que atualizam automaticamente os saldos das contas sem distorcer receitas/despesas.
- **Cartao de Credito**: cadastro de cartoes com limite, dia de fechamento, dia de vencimento e conta de debito vinculada.
- **Sistema de Faturas**: calculo automatico do periodo de competencia de cada fatura com base nas regras do cartao (fechamento e vencimento).
- **Parcelamento de Compras**: suporte a compras parceladas que geram N transacoes individuais agrupadas por `parcelaGrupoId`, distribuidas nos meses seguintes.
- **Resumo de Faturas no Dashboard**: card de "Faturas em Aberto", saldo real (descontando faturas), alerta de proximo vencimento e mini-lista de faturas por cartao com barra de progresso e status.
- **Pagar Fatura**: botao para marcar fatura como paga e registrar a saida na conta de debito vinculada.
- **Colecoes Firestore**: `contas`, `cartoesCredito` e `faturaStatus`.
- **Navegacao expandida**: novas abas "Contas" e "Cartoes" no menu lateral e mobile.

### Alterado
- Transacoes podem agora ser vinculadas a uma conta (`contaId`) ou cartao de credito (`cartaoId`).
- TransactionsTable suporta selecao de conta/cartao por metodo de pagamento e parcelamento inline.
- Dashboard ignora transferencias nos totais de receita/despesa para evitar dupla contagem.
- Filtro de transacoes inclui a opcao "Transferencias".

## [1.0.0] - 2026-04-13

### Adicionado
- Layout responsivo para desktop e mobile.
- Integracao com Firebase/Firestore para persistencia e sincronizacao em tempo real.
- Gerenciamento global de estado financeiro via contexto da aplicacao.
- Ajustes de estrutura para variaveis de ambiente (`.env.example` e `.env.local`).

### Alterado
- Nome do pacote alterado de `dash_gastos` para `findash`.
- Atualizacao da documentacao no `README.md` com recursos e instrucoes do projeto.

## [0.0.0] - 2026-04-11

### Adicionado
- Inicializacao do projeto com React + TypeScript + Vite.
- Configuracao de Tailwind CSS e PostCSS.
- Estrutura inicial do dashboard financeiro com componentes principais.
- Configuracao de build/lint e arquivos base do projeto.

[1.0.0]: https://github.com/Wiooll/Findash/releases/tag/v1.0.0
