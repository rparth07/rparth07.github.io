# Parth Raiyani — Portfolio

- [Classic portfolio](https://rparth07.github.io/)
- [3D portfolio](https://rparth07.github.io/portfolio-3d/)

## Run locally

From the repository root:

```sh
python -m http.server 8000 --bind 127.0.0.1
```

Open [Classic](http://localhost:8000/) or [3D](http://localhost:8000/portfolio-3d/).

## Update content

- Classic: edit `data/portfolio.json` and refresh. [Content guide](CONTENT.md).
- 3D: edit `sites/portfolio-3d/public/data/portfolio.json`, then rebuild:

```sh
npm --prefix sites/portfolio-3d ci
npm run build:3d
```

Commit the 3D source changes and regenerated `portfolio-3d/` folder.
See the [3D guide](sites/portfolio-3d/README.md) for development details.

## Deploy

GitHub Pages serves `main` from `/ (root)`. Push changes to publish both portfolios.

The 3D portfolio retains its original [MIT license](sites/portfolio-3d/LICENSE).
