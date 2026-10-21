import { copyFileSync } from 'node:fs';
// Keep the upstream notice beside the published build as well as the source.
copyFileSync('LICENSE', '../../portfolio-3d/LICENSE');
