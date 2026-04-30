## MODIFIED Requirements

### Requirement: Exibir Navegação Inferior
O sistema SHALL permitir navegação horizontal por arraste no menu inferior em dispositivos móveis quando a quantidade de itens exceder a largura disponível.

#### Scenario: Arraste horizontal no menu mobile
- **WHEN** o usuário interagir com o menu inferior em viewport `< md` e houver itens fora da área visível
- **THEN** o menu deve aceitar arraste horizontal fluido
- **AND** os itens ocultos devem ficar acessíveis sem quebra de layout.

#### Scenario: Toque em item após arraste
- **WHEN** o usuário terminar o arraste e tocar em um item do menu
- **THEN** a aba correspondente deve ser aberta normalmente.
