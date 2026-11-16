# Tabdeal Video Explorer

A responsive Persian-language video explorer for educational content published on Tabdeal's Aparat channel. Built as a front-end take-home challenge with Nuxt 4, Vue 3 and TypeScript.

**Live demo:** https://tabdeal-challenge-task.netlify.app

## Features

- Browse public videos attributed to Tabdeal's Aparat channel
- Search videos by title
- Paginated video cards
- Individual video detail pages with embedded playback when an embed URL is available
- Responsive RTL interface
- Server-rendered Nuxt application
- Server-side API routes to keep upstream requests out of the browser

## Tech stack

- Nuxt 4
- Vue 3
- TypeScript
- Tailwind CSS
- Aparat public endpoints
- Netlify

## Requirements

- Node.js 22 or newer
- npm

## Local development

```bash
git clone https://github.com/faanid/code-challenge-tabdeal-org.git
cd code-challenge-tabdeal-org
npm ci
npm run dev
```

Open http://localhost:3000.

## Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the local development server |
| `npm run build` | Build the production application |
| `npm run preview` | Preview the production build |
| `npm run generate` | Generate a static version where supported by the configured routes |

## Application structure

```text
app/
  app.vue
  pages/
    index.vue
    videos/
      [uid].vue
server/
  api/
    videos.get.ts
    videos/
      [uid].get.ts
types/
  video.ts
```

- `app/pages/index.vue`: video listing, search controls and client-side pagination of the returned results.
- `app/pages/videos/[uid].vue`: video detail and playback view.
- `server/api/videos.get.ts`: server-side Aparat search and channel filtering.
- `server/api/videos/[uid].get.ts`: server-side video detail lookup.
- `types/video.ts`: shared response and video contracts.

## Data source limitations

The channel-list endpoint returned HTTP 503 during the original challenge implementation. The listing therefore uses Aparat's public search endpoint as a best-effort fallback and filters results by the channel username.

This fallback has important limitations:

- Search results are not a complete or authoritative channel feed.
- The upstream search endpoint may return incomplete data or become unavailable.
- Pagination is currently performed over the results returned by the fallback, not over the complete channel catalogue.
- A successful empty search is different from an upstream outage; the API reports an upstream error only when every attempted upstream request fails.

The application does not invent video records. Reliable full-channel coverage and server-side pagination require a supported channel-list endpoint or another stable data source.

## Continuous integration (GitHub Actions)

A GitHub Actions workflow is defined at `.github/workflows/ci.yml`.

It runs on pull requests targeting `master`, pushes to `master`, and manual workflow dispatches. The workflow:

1. Checks out the repository.
2. Sets up Node.js 22 with npm dependency caching.
3. Installs the exact dependency versions from `package-lock.json` using `npm ci`.
4. Runs `npm run build` to verify that the Nuxt application builds.

The workflow is CI only: it does not publish the site.

## Continuous deployment (Netlify)

Netlify remains responsible for production deployment. Keep the existing Netlify Git integration enabled and configure its production branch as `master`, with `npm run build` as the build command.

Recommended flow:

- A pull request targeting `master` must pass the GitHub Actions CI check before it is merged.
- After merge, Netlify builds and deploys the updated `master` branch.
- Netlify Deploy Previews can remain enabled for pull requests if they are already configured.

GitHub Actions and Netlify have separate responsibilities here, so the CI workflow does not create a second production deployment or conflict with Netlify.

To enforce the CI check before merging, enable branch protection (or a ruleset) for `master` in GitHub and require the `Install and build` status check. The exact check name appears after the first successful workflow run.

## Deployment

The project is configured for Netlify using the Nuxt build command:

```bash
npm run build
```

Live deployment: https://tabdeal-challenge-task.netlify.app

## Notes

This repository was created as a front-end development take-home assignment for Tabdeal.
