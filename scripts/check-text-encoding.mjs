import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const targets = ['src', 'README.md'];

const suspiciousPatterns = [
  'ÃƒÂ¡',
  'ÃƒÂ£',
  'ÃƒÂ¢',
  'ÃƒÂ§',
  'ÃƒÂ©',
  'ÃƒÂª',
  'ÃƒÂ­',
  'ÃƒÂ³',
  'ÃƒÂ´',
  'ÃƒÂµ',
  'ÃƒÂº',
  'Ãƒâ€°',
  'Ãƒâ€œ',
  'Ã¢â‚¬â€',
  'Ã¢â‚¬â€œ',
  'Ã¢â‚¬',
  'Ã°Å¸',
  'ï¿½',
];

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

const textExtensions = new Set([
  '.ts',
  '.tsx',
  '.js',
  '.jsx',
  '.json',
  '.css',
  '.md',
  '.html',
  '.yml',
  '.yaml',
  '.txt',
]);

const hasTextExtension = (filePath) => {
  const idx = filePath.lastIndexOf('.');
  if (idx < 0) return false;
  return textExtensions.has(filePath.slice(idx).toLowerCase());
};

const issues = [];

for (const filePath of filesToCheck) {
  if (!hasTextExtension(filePath)) continue;
  const content = readFileSync(filePath, 'utf8');
  for (const pattern of suspiciousPatterns) {
    if (content.includes(pattern)) {
      issues.push({ filePath, pattern });
      break;
    }
  }
}

if (issues.length > 0) {
  console.error('Foram encontrados possíveis problemas de encoding em:');
  for (const issue of issues) {
    console.error(`- ${issue.filePath} (padrão: ${issue.pattern})`);
  }
  process.exit(1);
}

console.log('Sem indícios de texto corrompido por encoding.');
