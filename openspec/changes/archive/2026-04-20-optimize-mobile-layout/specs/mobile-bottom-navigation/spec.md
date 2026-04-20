## ADDED Requirements

### Requirement: Exibir Navegação Inferior
O sistema SHALL renderizar um menu de navegação inferior estilo "Bottom Action Bar" sempre que a largura da janela for de dispositivo móvel.

#### Scenario: Visualizando o aplicativo em resoluções mobile
- **WHEN** o usuário abre a aplicação num smartphone (ou viewport com quebra `< md` no Tailwind)
- **THEN** a barra inferior deve emergir e estar fixada à base da tela (bottom-0), oferecendo botões principais do app.

### Requirement: Esconder Componentes de Navegação Desktop
O sistema SHALL esconder o tradicional Header ou Sidebar superior/lateral em dispositivos móveis caso exista na nova arquitetura, priorizando apenas o espaço útil e o Bottom Navigation.

#### Scenario: Limpeza do Layout Desktop
- **WHEN** a tela é comprimida a níveis móveis ou carrega primariamente no modo xs/sm
- **THEN** a navegação desktop é removida para dar foco à interação inferior.
