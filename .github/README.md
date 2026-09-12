# jamesthomasonjr.com
## Personal Website

An [Eleventy](https://www.11ty.dev/) site deployed to GitHub Pages by
`.github/workflows/build-eleventy.yaml` on every push to `main`.

```sh
npm ci
npm run serve      # http://localhost:8080
npm run build      # _site/
```

## Résumé

`/resume/` and `/resume.pdf` publish the **base** résumé from
[`jamesthomasonjr/resume`](https://github.com/jamesthomasonjr/resume), which
stays the single source of truth for résumé content and rendering. Nothing
generated is committed here: the deploy checks that repository out, builds it,
and assembles the artifacts into `_site/`.

`scripts/build-resume.mjs` does the assembling. It renders nothing of its own —
it loads the résumé app that project's own `npm run build` produced, lets that
app resolve and render the document with its own theme, and snapshots the
result as a standalone static page. So `/resume/` is plain indexable HTML
rather than a client-rendered app, and it links to `/resume.pdf`, which is the
file that project's `npm run export` wrote from the same resolved document and
theme.

Only the one requested document is published. The built app bundles every
document under `data/` — tailored overlays such as `platform` and
`platform-ai` included — so the bundle is never copied into the site; only the
markup of the single rendered document is.

A change to `data/base.json` over there reaches the site on the next deploy
here, with no content copied by hand. Run this workflow from the Actions tab
(`workflow_dispatch`) to publish a résumé change without touching the site.

### Deploy access

The résumé repository is private, so the workflow needs the
`RESUME_REPO_TOKEN` repository secret: a fine-grained personal access token
scoped to `jamesthomasonjr/resume` with **read-only Contents** permission. The
workflow fails with an explicit message when it is missing, and the token is
not persisted in the checkout.

### Building it locally

With a checkout of the résumé repository alongside this one:

```sh
cd ../resume
npm ci
npx playwright install chromium
npm run build
npm run export -- --resume base --format pdf --out out

cd ../jamesthomasonjr.github.io
npm run build
npm run build:resume -- --resume-dir ../resume
```

`npm run build` alone is enough for everything else; `/resume/` is simply
absent from `_site/` without the step above.
