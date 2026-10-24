# Tabdeal Video Explorer

A responsive web application for browsing educational videos from Tabdeal's Aparat channel, built as a front-end development challenge.

**Live Demo:** https://tabdeal-challenge-task.netlify.app

## Features

- Browse educational videos from Tabdeal's Aparat channel
- Search videos by title
- Navigate through paginated video results
- View individual video details
- Responsive layout for desktop and mobile devices
- Server-side rendering with Nuxt

## Tech Stack

- **Nuxt** — Vue-based application framework with server-side rendering
- **Vue.js** — Component-based user interface
- **Tailwind CSS** — Utility-first styling
- **TypeScript** — Type-safe development
- **Aparat Public API** — Video data source
- **Netlify** — Deployment

## Getting Started

### Prerequisites

- Node.js
- npm

### Installation

Clone the repository and install the dependencies:

```bash
git clone https://github.com/faanid/code-challenge-tabdeal-org.git
cd code-challenge-tabdeal-org
npm install
```

### Development

Start the development server:

```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

### Production Build

Build the application:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## API Limitations

During development, the public Aparat API endpoint for listing channel videos returned an HTTP 503 response.

As a workaround, the application uses public video search results filtered by the channel username. However, the search endpoint does not guarantee complete coverage of the channel's videos, and attempts to retrieve subsequent search results returned HTTP 400.

Consequently, the displayed video list and search results may be incomplete. The application relies on the data returned by Aparat and does not fabricate missing video information.

Complete channel coverage and reliable pagination depend on the availability of a supported, functioning API endpoint.

## Deployment

The application is deployed on Netlify:

https://tabdeal-challenge-task.netlify.app

## License

This project was created as a front-end development take-home assignment for Tabdeal.
