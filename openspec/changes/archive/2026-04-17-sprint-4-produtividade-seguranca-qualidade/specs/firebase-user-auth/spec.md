## ADDED Requirements

### Requirement: Autenticação de usuário com Firebase Auth
O sistema SHALL exigir autenticação via Firebase Auth para acesso às funcionalidades de dados financeiros.

#### Scenario: Login bem-sucedido
- **WHEN** o usuário informa credenciais válidas de autenticação
- **THEN** o sistema inicia sessão autenticada e libera acesso às áreas protegidas

### Requirement: Proteção de rotas e sessão
O sistema MUST bloquear acesso não autenticado a rotas e operações protegidas.

#### Scenario: Acesso sem autenticação
- **WHEN** um visitante não autenticado tenta acessar uma tela protegida
- **THEN** o sistema redireciona para fluxo de login sem expor dados financeiros

### Requirement: Encerramento de sessão
O sistema SHALL permitir logout explícito e MUST invalidar o contexto de acesso do usuário no cliente.

#### Scenario: Logout efetuado
- **WHEN** o usuário executa logout
- **THEN** o sistema remove o estado de sessão ativa e retorna o usuário ao estado não autenticado
