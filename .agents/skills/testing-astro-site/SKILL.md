# Testing the Astro SSG Site

## Quick Start

```bash
npm install
npm run dev  # Starts on port 4321 (or next available)
```

The dev server runs on `http://localhost:4321` by default. If port 4321 is in use, Astro will auto-increment to 4322, 4323, etc.

## Build Verification

```bash
npm run build  # Builds 14 static pages to dist/
```

All 14 pages should build without errors. Check the build output for the full list of generated pages.

## Key Pages to Test

| Page | URL | What to verify |
|------|-----|----------------|
| Homepage | `/` | Particle canvas animating, typing effect, stats grid, Deepcomet AI content |
| About | `/about/` | Hero with particle canvas, role cards (4), FAQ accordion, sidebar with tech stack |
| Projects | `/projects/` | Scroll-reveal animations on section headers and card grids |
| GeminiChat | `/projects/geminichat/` | Tab switching between Nuxt+Tauri and .NET+Avalonia |
| Ecosystem | `/ecosystem/` | Architecture stack diagram, 4 technology sections, FAQ accordions |
| Blog | `/blog/` | 3 blog post cards with proper styling |
| Docs | `/docs/` | Sidebar navigation, code block component, internal links |
| Community | `/community/` | Social cards with stagger animations |

## Interactive Components

### Accordion (`<details>` based)
- Used on: About page (FAQ), Ecosystem page (4 FAQ sections)
- First item is open by default
- Click to expand/collapse, "+" icon rotates to "x" when open

### Tabs (JS click handler)
- Used on: GeminiChat page (`/projects/geminichat/`)
- First tab active by default with cyan bottom border
- Clicking a tab switches content and active styling

### Scroll-Reveal Animations
- IntersectionObserver in BaseLayout.astro adds `.visible` class at threshold 0.1
- Classes: `.reveal`, `.reveal-left`, `.reveal-right`, `.reveal-scale`, `.stagger-children`
- Verify by scrolling down — elements should fade in as they enter viewport

### Particle Canvas
- Canvas-based particle system in HeroSection component
- Particles connected by lines when within 120px of each other
- Used on pages with `<HeroSection particles={true}>` — homepage, about, ecosystem

## Known Quirks

- The `google-chrome` wrapper connects via CDP on port 29229. If Chrome isn't already running via CDP, you need to launch Chrome directly from `/opt/.devin/chrome/` with `--remote-debugging-port=29229`.
- The particle canvas runs continuously via `requestAnimationFrame` — no visibility-based pause, so it may consume resources in background tabs.
- Blog post dates and stats numbers are placeholder/hardcoded values.
- No custom 404 page exists — GitHub Pages uses its default.

## Deployment

- GitHub Actions workflow builds with `npx astro build`
- Output directory: `dist/`
- Configured for GitHub Pages static deployment

## Devin Secrets Needed

No secrets are required for local testing.
