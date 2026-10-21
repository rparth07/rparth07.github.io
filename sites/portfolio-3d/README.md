# Parth Raiyani — 3D Portfolio

Parth Raiyani's personal portfolio, featuring the approved Parth Coder Avatar v1.0, interactive 3D scenes, scroll animations, projects, experience, education, and skills.

## Run locally

```sh
npm install
npm run dev -- --host 127.0.0.1
```

Open http://127.0.0.1:5173/.

## Update content

Edit `public/data/portfolio.json` and refresh the page. See [CONTENT.md](CONTENT.md) for field descriptions and examples. About and service descriptions are intentional placeholders awaiting final copy. The resume currently links to Parth's GitHub profile.

## Checks and production build

```sh
npm run validate:content
npm run test:content
npm run audit:branding
npm run build
npm run preview
```

## Project structure

- `src/components/`: page sections, animation behavior, and 3D scene.
- `src/content/portfolio.ts`: JSON loading and validation.
- `src/components/styles/`: layout and typography.
- `public/data/`: editable portfolio content, schema, and examples.
- `public/assets/img/`: profile, project, and skill images.
- `public/models/parth-coder-avatar-v1.0.glb`: approved, locked avatar.
- `public/fonts/`: locally hosted fonts and their licenses.
- `tests/` and `scripts/`: content checks and branding audit.

Built with React, TypeScript, Vite, Three.js, GSAP, and Lenis. The current customization retains code and design derived from an MIT-licensed portfolio; it is not a from-scratch implementation. The original copyright and permission notice remains in [LICENSE](LICENSE). Font licenses remain beside their files. Dependency license notices remain with their respective packages.
