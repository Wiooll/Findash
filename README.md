# FinDash | Seu Dashboard Financeiro

O **FinDash** é um dashboard moderno, interativo e responsivo para controle de despesas e finanças pessoais.

## Funcionalidades principais

- Dashboard com resumo de saldo, receitas, despesas e economia mensal.
- Gráficos de fluxo de caixa dos últimos 12 meses e despesas por categoria.
- Gestão de transações com filtros, categorias e recorrências.
- Controle de contas, cartões de crédito e faturas.
- Módulo de empréstimos com acompanhamento de status.
- Tela de gerenciamento com suporte, backup manual e documentos legais.
- Seção de apoio ao projeto com cópia da chave Pix para contribuição opcional.
- Notificações de novidades por versão e aba de **Atualizações**.

## Tecnologias

- React + TypeScript
- Vite
- Tailwind CSS
- Recharts
- Firebase (Auth + Firestore)

## Persistência de dados

Os dados do app são sincronizados com o **Firebase Firestore** por usuário autenticado.

## Como executar localmente

Pré-requisitos: Node.js (recomendado v18+).

1. Acesse a pasta do projeto:

```bash
cd dash_gastos
```

2. Instale as dependências:

```bash
npm install
```

3. Inicie o ambiente de desenvolvimento:

```bash
npm run dev
```

4. Acesse no navegador: `http://localhost:5173`

## Configuração opcional de apoio via Pix

Para habilitar a chave Pix no card de apoio:

1. Configure no `.env.local`:

```bash
VITE_SUPPORT_PIX_KEY=sua-chave-pix-aqui
```

2. Reinicie o app (`npm run dev`) para carregar a variável.

## Atualizações recentes

### Sprint 4.5.1 - Apoio ao Projeto via Pix

- Nova seção **Apoie o FinDash** na aba **Gerenciamento**.
- Botão para copiar a chave Pix com feedback de sucesso/erro.
- Chave Pix configurável por ambiente com `VITE_SUPPORT_PIX_KEY`.

### Sprint 4.5.0 - Atualizações de Versão e Navegação Mobile

- Melhoria no menu inferior mobile com arraste horizontal mais fluido para acessar todas as abas.
- Nova aba **Atualizações** com histórico de versões, destaques e melhorias.
- Notificação de novidades por versão para direcionar o usuário à aba de atualizações.
- Ao abrir a aba de atualizações, a versão atual é marcada como visualizada localmente.

### Sprint 4.4.1 - Gerenciamento, Legal e Backup Manual

- A aba **Gerenciamento** concentra suporte, backup manual e documentos legais.
- Envio de sugestão e reporte de bug via `mailto` com assunto padronizado.
- Exportação e importação de backup em **JSON** com validação de estrutura.

### Sprint 4.4.0 - Página de Gerenciamento

- Nova aba **Gerenciamento** para concentrar recursos de suporte e manutenção.
- Ações rápidas para **Enviar sugestão** e **Reportar bug**.
- Área de **backup manual** com integração de uso junto ao Google Drive.
- Seção de documentos legais (Termos de Uso, Privacidade e Cookies).

## Qualidade de Texto (pt-BR)

Para evitar regressões de encoding (ex.: acentuação corrompida ou símbolos inválidos), execute:

```bash
npm run check:text-encoding
```
