import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const targets = ['src/components', 'src/constants'];

const disallowedTerms = [
  { wrong: 'nao', correct: 'não' },
  { wrong: 'Nao', correct: 'Não' },
  { wrong: 'usuario', correct: 'usuário' },
  { wrong: 'Usuario', correct: 'Usuário' },
  { wrong: 'configuracao', correct: 'configuração' },
  { wrong: 'Configuracao', correct: 'Configuração' },
  { wrong: 'versao', correct: 'versão' },
  { wrong: 'Versao', correct: 'Versão' },
  { wrong: 'secao', correct: 'seção' },
  { wrong: 'Secao', correct: 'Seção' },
  { wrong: 'sugestao', correct: 'sugestão' },
  { wrong: 'Sugestao', correct: 'Sugestão' },
  { wrong: 'atualizacao', correct: 'atualização' },
  { wrong: 'Atualizacao', correct: 'Atualização' },
  { wrong: 'contribuicao', correct: 'contribuição' },
  { wrong: 'Contribuicao', correct: 'Contribuição' },
  { wrong: 'correcoes', correct: 'correções' },
  { wrong: 'Correcoes', correct: 'Correções' },
  { wrong: 'politicas', correct: 'políticas' },
  { wrong: 'Politicas', correct: 'Políticas' },
  { wrong: 'informacao', correct: 'informação' },
  { wrong: 'Informacao', correct: 'Informação' },
];

const suspiciousMojibakeRegex = /Ã.|�/;
const stringLiteralRegex = /(['"`])(?:\\.|(?!\1)[\s\S])*\1/g;

const filesToCheck = [];

const walk = (path) => {
  if (!existsSync(path)) return;
  const stats = statSync(path);
  if (stats.isFile()) {
    filesToCheck.push(path);
    return;
  }

  for (const entry of readdirSync(path)) {
    walk(join(path, entry));
  }
};

targets.forEach(walk);

const issues = [];

for (const filePath of filesToCheck) {
  if (!filePath.endsWith('.ts') && !filePath.endsWith('.tsx')) continue;

  const content = readFileSync(filePath, 'utf8');
  const literals = content.match(stringLiteralRegex) ?? [];

  literals.forEach((literal, index) => {
    const normalized = literal.slice(1, -1);

    if (suspiciousMojibakeRegex.test(normalized)) {
      issues.push({
        filePath,
        reason: 'Texto com possível encoding corrompido (mojibake).',
        sample: normalized,
      });
      return;
    }

    for (const term of disallowedTerms) {
      const regex = new RegExp(`\\b${term.wrong}\\b`);
      if (regex.test(normalized)) {
        issues.push({
          filePath,
          reason: `Encontrado termo "${term.wrong}". Use "${term.correct}".`,
          sample: normalized,
        });
        break;
      }
    }
  });
}

if (issues.length > 0) {
  console.error('Falha na validação de textos pt-BR da interface:');
  issues.slice(0, 20).forEach((issue) => {
    console.error(`- ${issue.filePath}: ${issue.reason}`);
    console.error(`  Trecho: ${issue.sample.slice(0, 120)}`);
  });

  if (issues.length > 20) {
    console.error(`... e mais ${issues.length - 20} ocorrência(s).`);
  }

  process.exit(1);
}

console.log('Validação de textos pt-BR da interface concluída sem erros.');
