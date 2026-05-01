# Padrão de Commits

Este projeto usa padrão de commits em português com validação automática.

## Formato obrigatório

```txt
<tipo>: <resumo curto>

- <mudança 1>
- <mudança 2>
- <mudança 3>
- <impacto técnico>
- <validação executada>
```

## Tipos aceitos

- `feat`: nova funcionalidade
- `fix`: correção de bug
- `chore`: manutenção
- `refactor`: refatoração sem mudança de comportamento
- `test`: testes
- `docs`: documentação
- `build`: build/deps
- `ci`: integração contínua
- `perf`: melhoria de performance
- `revert`: reversão

## Regras

- Título com no máximo 72 caracteres.
- Mensagens em pt-BR.
- Liste os principais impactos em bullets.
- Sempre inclua como a mudança foi validada (`npm run build`, `npm test`, etc).

## Configuração local recomendada

Para abrir o template automaticamente ao commitar:

```bash
git config commit.template .gitmessage.txt
```
