# Animated 3D portfolio source

This is the imported React/TypeScript source for `/portfolio-3d/`. The classic site
lives at the repository root. See [the repository README](../../README.md) for
preview, deployment, checks, and build instructions.

From this directory:

```powershell
npm ci
npm run dev -- --host 127.0.0.1
npm run build
```

Development URL: http://127.0.0.1:5173/portfolio-3d/.
Production output: `../../portfolio-3d/`. Building replaces only that directory.
The `postbuild` step includes the original license in the published output.

Edit `public/data/portfolio.json` and see [CONTENT.md](CONTENT.md) for its schema.
Rebuild and commit the production output when publishing content or code changes.
About/service descriptions remain supplied placeholders; the resume links to GitHub.

The source retains the supplied avatar and design derived from an MIT-licensed
portfolio. The original copyright and permission notice remains in [LICENSE](LICENSE),
with font notices beside their files. The approved avatar and required environment
map are included; experimental avatar variants and installed packages are excluded.
