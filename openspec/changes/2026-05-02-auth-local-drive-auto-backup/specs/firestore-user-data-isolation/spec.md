## REMOVED Requirements

### Requirement: Isolamento de dados por usuario no Firestore
Motivo: o Firestore deixa de ser mecanismo de persistencia de dados financeiros do app.

### Requirement: Bloqueio de acesso cruzado
Motivo: regras de seguranca do Firestore deixam de se aplicar apos remocao do armazenamento no Firestore.

### Requirement: Integridade de associacao de propriedade
Motivo: associacao de propriedade sera mantida no modelo local por `uid`, sem documentos Firestore.
