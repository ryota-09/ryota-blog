# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
```bash
npm run dev          # Start development server on port 3006
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Testing
```bash
npm run test         # Run unit tests with Vitest
npm run e2e          # Run E2E tests with Playwright
npm run e2e:dev      # Run E2E tests in development mode
```

### Storybook
```bash
npm run storybook    # Start Storybook on port 6006
npm run build-storybook
```

### Utilities
```bash
npm run analyze      # Analyze bundle size
npm run update-rss   # Update RSS feed data
```

## Architecture Overview

This is a Next.js 14 blog application using App Router, TypeScript, and TailwindCSS. Content is managed through microCMS (headless CMS) with additional integration from Zenn.

### Key Architectural Patterns

1. **Server Components by Default**: Most components are React Server Components. Client components are explicitly marked with 'use client' and typically found in:
   - `ClientLayout` - Manages client-side theme state
   - Interactive UI components (modals, accordions, etc.)
   - Search functionality

2. **Content Rendering Pipeline**: 
   - microCMS API → `lib/microcms.ts` → Server Components → `RichEditor` → Custom UI components
   - Rich content from microCMS is parsed and rendered with custom components for code blocks, images, links, etc.

3. **Data Fetching**: All data fetching happens in server components using the microCMS client in `lib/microcms.ts`. No client-side data fetching.

4. **State Management**: Minimal client state using React Context (theme only). Most state is derived from URL params.

### Environment Setup

Required environment variables:
```
MICROCMS_API_KEY=your_api_key
MICROCMS_SERVICE_DOMAIN=your_domain
```

### Testing Strategy

- **Unit Tests**: Components with complex logic, located in `__tests__` directories
- **E2E Tests**: Full user flows in `/e2e` directory covering navigation, SEO, accessibility, and security
- **Component Tests**: Storybook stories alongside components for visual testing

### Key Directories

- `/src/app/` - Next.js pages and API routes
- `/src/components/` - React components organized by feature
- `/src/lib/microcms.ts` - Core API client and data fetching
- `/src/components/ArticleBody/RichEditor/` - Content rendering system

### Important Considerations

1. **Image Optimization**: All images use Next.js Image component with blur placeholders generated from microCMS
2. **SEO**: Metadata and OpenGraph images are generated per page, JSON-LD structured data included
3. **Performance**: Uses standalone mode for deployment, view transitions API for smooth navigation
4. **Content Features**: Supports code syntax highlighting, Twitter embeds, Amazon link cards, and custom HTML areas