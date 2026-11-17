# AI Health website

Static English website for AI Health by INCAI. No framework, dependencies or build step; deploy the repository root. All links between pages are relative.

## Deployment

- **Cloudflare Pages:** Workers & Pages → Create → Pages → Connect to Git → select this repository. Framework preset **None**, leave the build command empty, output directory `/`. Add the domain under Custom domains.
- **Vercel:** Add New → Project → import this repository. Framework **Other**, no build command, output directory `.`. Add the domain under Settings → Domains.
- **app-ads.txt** must be reachable at `https://<domain>/app-ads.txt`, and that domain must match the developer website declared in the store.
- **Privacy Policy URL** for the store: `https://<domain>/policies.html`.

Current site URL (Vercel): `https://myhealthcare-web.vercel.app` — Privacy Policy `https://myhealthcare-web.vercel.app/policies.html`, app-ads.txt `https://myhealthcare-web.vercel.app/app-ads.txt`.

## Content

- `site.json` holds the metadata the site was generated from, plus image credits (`images`).
- Images use a 9:16 portrait format: `assets/img/screen-*.svg` are original 1080×1920 app-preview illustrations shown in CSS phone frames; replace them with real AI Health screenshots (same 9:16 size) once the app's own store listing is available.
- Photos in `assets/img/*.jpg` are CC0 images from Wikimedia Commons, displayed cropped to 9:16; feature icons (`assets/img/*.svg`) and `assets/icon.svg` are original drawings.
