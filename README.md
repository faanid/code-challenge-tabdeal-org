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

## Deployment

The project is configured for Netlify using the Nuxt build command:

```bash
npm run build
```

Live deployment: https://tabdeal-challenge-task.netlify.app

## Notes

This repository was created as a front-end development take-home assignment for Tabdeal.
