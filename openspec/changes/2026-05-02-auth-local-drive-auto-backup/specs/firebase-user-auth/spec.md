## MODIFIED Requirements

### Requirement: Autenticacao de usuario com Google
O sistema SHALL exigir autenticacao via conta Google para acesso as funcionalidades de dados financeiros do usuario.

#### Scenario: Login bem-sucedido
- **WHEN** o usuario conclui autenticacao Google com sucesso
- **THEN** o sistema inicia sessao autenticada e libera acesso as areas protegidas

### Requirement: Protecao de rotas e sessao
O sistema MUST bloquear acesso nao autenticado a rotas e operacoes protegidas.

#### Scenario: Acesso sem autenticacao
- **WHEN** um visitante nao autenticado tenta acessar uma tela protegida
- **THEN** o sistema redireciona para fluxo de login sem expor dados financeiros

### Requirement: Encerramento de sessao
O sistema SHALL permitir logout explicito e MUST invalidar o contexto de acesso do usuario no cliente.

#### Scenario: Logout efetuado
- **WHEN** o usuario executa logout
- **THEN** o sistema remove o estado de sessao ativa e retorna o usuario ao estado nao autenticado
