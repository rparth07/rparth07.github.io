import { copyFileSync, readFileSync, writeFileSync } from 'node:fs';
// Keep the upstream notice beside the published build as well as the source.
copyFileSync('LICENSE', '../../portfolio-3d/LICENSE');

// Vite can combine LF-generated tags with CRLF-authored markup on Windows.
const htmlPath = '../../portfolio-3d/index.html';
writeFileSync(htmlPath, readFileSync(htmlPath, 'utf8').replace(/\r\n/g, '\n'));
