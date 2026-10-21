import { readFile } from 'node:fs/promises';
import { createServer } from 'vite';
const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' });
try {
 const { validateContent } = await server.ssrLoadModule('/src/content/portfolio.ts');
 const data = JSON.parse(await readFile(process.argv[2] || 'public/data/portfolio.json', 'utf8'));
 const errors = validateContent(data);
 if (errors.length) { console.error(errors.join('\n')); process.exitCode = 1; }
 else console.log('Portfolio JSON is valid.');
} catch (error) { console.error(error.message); process.exitCode = 1; }
finally { await server.close(); }
