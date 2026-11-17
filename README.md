# Health Care website

Static English website for Health Care by INCAI. Upload the repository root; no framework, dependencies, JavaScript, or build step is required. All website links are relative.

## Deployment

- **Cloudflare Pages:** Workers & Pages → Create → Pages → Connect to Git → select this repository. Choose framework preset **None**, leave the build command empty, and set output directory to `/`. Add the domain under Custom domains.
- **Vercel:** Add New → Project → import this repository. Choose framework **Other**, disable the build command, and set output directory to `.`. Add the domain under Settings → Domains.
- Confirm `https://<domain>/app-ads.txt` is accessible. The domain must match the developer website declared in the store.
- Store Privacy Policy URL: `https://<domain>/policies.html`.
- Verify the hosting provider serves `404.html` for an unknown URL.

## Content maintenance

`site.json` preserves the supplied metadata, including its original description. Public copy removes duplicated text, spreadsheet artifacts, and the alternate product name in that description, using Health Care consistently.

No store URL or site URL was supplied, so no store download link, canonical URL, or sitemap is generated. No tagline or separate feature list was supplied; the introduction and feature summaries come from the description. The accent is a locally selected green. Empty effective date uses the task execution date, November 17, 2026; no separate task creation date was supplied.

The supplied contact email ends with a period. It is preserved exactly in displayed text and mailto links; confirm the store metadata before publishing. No collection details or third-party services were supplied. The privacy text follows the task skill's fallback; confirm it against actual app behavior before publishing. No advertising or subscription sections are included.

## Validation

Run `node --test tests/site.test.cjs`. There is no build step. See `REPORT.md` for execution results and screenshot paths.
