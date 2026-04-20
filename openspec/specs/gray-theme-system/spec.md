## ADDED Requirements

### Requirement: Disponibilizar Tema Cinza Como Terceira Opcao
O sistema SHALL disponibilizar o tema cinza como terceira opção selecionável, coexistindo com os temas preto e branco já disponíveis.

#### Scenario: Lista de temas disponiveis
- **WHEN** o usuário abrir as opções de tema da aplicação
- **THEN** o sistema deve exibir exatamente as opções preto, branco e cinza

#### Scenario: Seleção do tema cinza
- **WHEN** o usuário selecionar o tema cinza
- **THEN** a interface deve aplicar a paleta cinza nos componentes principais

### Requirement: Preservar Legibilidade e Contraste
O sistema SHALL manter contraste suficiente entre texto, fundo e estados interativos nos temas preto, branco e cinza.

#### Scenario: Estado de leitura e interação
- **WHEN** botões, links e campos forem exibidos nos estados normal, foco e desabilitado
- **THEN** os elementos devem permanecer legíveis e distinguíveis visualmente
