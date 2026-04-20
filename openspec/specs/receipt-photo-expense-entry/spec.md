## ADDED Requirements

### Requirement: Criar Gasto a Partir de Foto da Nota Fiscal
O sistema SHALL permitir que o usuário envie uma foto da nota fiscal para iniciar o cadastro de um gasto com preenchimento assistido.

#### Scenario: Foto enviada com sucesso
- **WHEN** o usuário selecionar uma foto válida da nota fiscal
- **THEN** o sistema deve processar a imagem e retornar sugestão de campos para o formulário de gasto

### Requirement: Exigir Confirmacao Humana Antes de Salvar
O sistema SHALL exigir confirmação explícita do usuário antes de persistir qualquer gasto gerado a partir da foto.

#### Scenario: Usuario revisa e confirma campos
- **WHEN** o sistema apresentar os campos sugeridos (valor, data e estabelecimento)
- **THEN** o usuário deve poder editar os dados e confirmar o salvamento manualmente

#### Scenario: Erro de extração
- **WHEN** o processamento da imagem falhar ou retornar baixa confiança
- **THEN** o sistema deve informar o erro em pt-BR e disponibilizar preenchimento manual do gasto
