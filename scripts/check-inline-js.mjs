import { readFileSync } from 'node:fs';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const scripts = [...html.matchAll(/<script(?:\\s[^>]*)?>([\\s\\S]*?)<\\/script>/gi)];
if (!scripts.length) throw new Error('No inline application script found.');
const appScript = scripts.at(-1)[1];
new Function(appScript);
console.log('Inline player JavaScript syntax: OK');
