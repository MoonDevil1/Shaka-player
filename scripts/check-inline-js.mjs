import { readFileSync } from 'node:fs';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const start = html.lastIndexOf('<script>');
const end = html.lastIndexOf('</script>');
if (start < 0 || end <= start) throw new Error('Inline application script not found.');
const appScript = html.slice(start + '<script>'.length, end);
new Function(appScript);
console.log('Inline player JavaScript syntax: OK');
