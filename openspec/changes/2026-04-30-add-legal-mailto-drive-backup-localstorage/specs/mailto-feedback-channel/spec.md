## ADDED Requirements

### Requirement: Disponibilizar Canal de Sugestoes e Bugs por Email
O sistema SHALL disponibilizar no rodape um canal de contato por `mailto` para `suporte.listae@gmail.com`, com assunto e corpo pre-preenchidos para facilitar o reporte.

#### Scenario: Abertura de email para sugestao
- **WHEN** o usuario clicar em "Enviar sugestao"
- **THEN** o sistema deve abrir o cliente de email com destinatario `suporte.listae@gmail.com`
- **AND** o assunto deve conter `[FinDash] Sugestao`

#### Scenario: Abertura de email para bug
- **WHEN** o usuario clicar em "Reportar bug"
- **THEN** o sistema deve abrir o cliente de email com destinatario `suporte.listae@gmail.com`
- **AND** o assunto deve conter `[FinDash] Bug`
- **AND** o corpo deve orientar o usuario a informar passos para reproducao
