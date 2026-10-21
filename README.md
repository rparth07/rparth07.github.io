# Parth Raiyani portfolios

Two independent portfolios share this GitHub Pages site. The classic portfolio's
layout and root URL remain unchanged.

| Portfolio | Local URL | GitHub Pages URL |
| --- | --- | --- |
| Classic | http://localhost:8000/ | https://rparth07.github.io/ |
| Animated 3D | http://localhost:8000/portfolio-3d/ | https://rparth07.github.io/portfolio-3d/ |

Opening `/portfolio-3d` redirects to the directory URL `/portfolio-3d/` on the static
server. The 3D site's section links use hashes beneath that path, for example
`/portfolio-3d/#work`; no single-page-app rewrite or replacement root page is needed.

Visitors can switch between the two experiences using the always-visible button
at the bottom of either portfolio. Links open in the same tab.

## Preview both sites

From the repository root:

```powershell
python -m http.server 8000 --bind 127.0.0.1
```

The committed `portfolio-3d/` production build works immediately with this command.
No npm installation is needed just to view the checked-in sites.

## Edit content

- Classic: edit `data/portfolio.json` and refresh. See [CONTENT.md](CONTENT.md).
- 3D: edit `sites/portfolio-3d/public/data/portfolio.json`, then rebuild as below.
  See the [3D content guide](sites/portfolio-3d/CONTENT.md) for its separate schema
  and examples. The two JSON formats are independent and do not automatically sync.
- For a content-only published change, `portfolio-3d/data/portfolio.json` is the
  served copy. Prefer updating the source and rebuilding so future builds retain it.

The copied 3D portfolio retains its supplied avatar, animation, content, and design.
Its about/service copy uses the supplied work history and skills. The former resume
link is labeled GitHub because no resume document has been supplied.

## Develop and rebuild the 3D portfolio

Use a current Node.js LTS version and npm. From the repository root:

```powershell
npm --prefix sites/portfolio-3d ci
npm --prefix sites/portfolio-3d run dev -- --host 127.0.0.1
```

Development URL: http://127.0.0.1:5173/portfolio-3d/.

To regenerate the production files:

```powershell
npm run build:3d
```

This type-checks the app, builds it with Vite's `/portfolio-3d/` base path, and copies
its license into the published folder. It replaces only `portfolio-3d/`, never the
classic root site. Commit the source changes **and** regenerated production files.
Do not edit the hashed files in `portfolio-3d/assets/` manually.

The avatar, environment map, Draco decoder, fonts, content requests, images, and
home links are scoped to the 3D path. The approved avatar is preserved byte-for-byte;
unused experimental avatars and `node_modules` are excluded. The avatar is about
26.5 MB, so first visits can take time on slower connections. Vite also reports a
size warning for the existing Three.js/physics chunks; the production build passes.

## Checks

```powershell
npm run test:classic
npm --prefix sites/portfolio-3d run validate:content
npm run test:3d
npm --prefix sites/portfolio-3d run audit:branding
npm run build:3d
npm run test:deployment
```

The deployment checks verify separate entry points and JSON files, path-prefixed
built assets, and the model/decoder files required by the 3D scene. Browser review
also covers the root page, 3D loading and avatar, section navigation, project
carousel, phone layout, and direct loading of `/portfolio-3d`.

## Publish on GitHub Pages

For the existing branch-based setup, publish `main` and `/ (root)` in repository
Settings → Pages. Both static entry points are committed, and `.nojekyll` disables
Jekyll processing. No separate repository or domain is required. Push the commits
to the publishing branch to deploy; creating local commits alone does not publish.
If using a custom Pages Actions workflow instead, its uploaded artifact must contain
the root site's files **and** the generated `portfolio-3d/` directory.

## Layout and credits

```text
index.html                 Classic site
assets/, data/             Classic assets and editable content
portfolio-3d/              Committed static 3D build for GitHub Pages
sites/portfolio-3d/        React/TypeScript 3D source, public assets, tests
sites/portfolio-3d/public/ Source JSON, fonts, images, approved avatar
```

The 3D portfolio was imported from the supplied `AnimatedPortfolio-main` project
and adapted for this subpath. Its original MIT notice remains in
[sites/portfolio-3d/LICENSE](sites/portfolio-3d/LICENSE) and the published build.
Font license notices remain beside the font files. Its React, Three.js, GSAP,
Lenis, and other dependencies retain their respective licenses.


## Reliability review

The 3D loader releases the page if the avatar fails or takes over 30 seconds; a
missing WebGL renderer or failed tech-stack preview does not remove the readable
portfolio. JSON requests fall back after eight seconds. Scene progress timers,
render loops, pointer handlers, and loading transitions have cleanup paths.
Section URLs are restored after loading, offscreen project slides are inert to
keyboard navigation, and motion preferences disable automatic role cycling,
marquee, pointer animation, and continuous character motion. Classic menu labels,
keyboard focus, no-JavaScript visibility, and tablet gutters are retained.

See [REVIEW.md](REVIEW.md) for the verification record and remaining content needs.
