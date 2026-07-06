# CLAUDE.md
This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Guidelines

### Code Style and Conventions
1. **Comments**: All code comments MUST be written in Japanese (日本語でコメントを記述)
2. **TypeScript Types**: Use `type` instead of `interface` except where `interface` is absolutely required (e.g., declaration merging, extending interfaces)
   ```typescript
   // ✅ Good - type を使用
   type User = {
     id: string;
     name: string;
   };
   
   // ❌ Avoid - interface は必要な場合のみ
   interface User {
     id: string;
     name: string;
   }
   ```

### Development Process
1. **Task Validation**: After completing each task, verify that the previously established approach remains correct
2. **Build Verification**: Always run a build at the end of development work and fix any errors before completion
   ```bash
   npm run build  # 必ずビルドを実行してエラーを確認
   ```

## Commands
### Development
```bash
npm run dev          # Start development server on port 3006 (Velite watch + Next.js dev並走)
npm run build        # Build for production (prebuildでVelite buildを実行)
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Content (記事)
```bash
npm run new-post -- <slug>  # 新規記事の雛形を生成(content/blogs/{slug}/index.{ja,en}.mdx)。書き方は docs/writing.md 参照
npm run lint:content         # 記事ファイルの品質ゲート(内部リンク/画像パスチェック・textlint・markdownlint・frontmatterスキーマ検証)
npm run optimize-images      # content/blogs配下の画像を圧縮(画像追加時に実行する運用)
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
This is a Next.js 16 blog application using App Router, TypeScript, and TailwindCSS. Content(記事)is managed as MDX files in the repository (`content/blogs/`), parsed and validated at build time by [Velite](https://velite.js.org/). See [docs/adr/0001-content-layer.md](./docs/adr/0001-content-layer.md) for the migration background from microCMS, and [docs/writing.md](./docs/writing.md) for the article authoring guide.

### Key Architectural Patterns
1. **Server Components by Default**: Most components are React Server Components. Client components are explicitly marked with 'use client' and typically found in:
   - `ClientLayout` - Manages client-side theme state
   - Interactive UI components (modals, accordions, etc.)
   - Search functionality

2. **Content Rendering Pipeline**:
   - `content/blogs/{slug}/index.{ja,en}.mdx`(frontmatter + MDX本文)→ Velite(ビルド時にZodスキーマ検証・画像処理・`.velite/`へJSON+型を出力)→ `src/lib/content.ts` → Server Components → `MdxContent`(`new Function`評価によるMDXレンダリング)→ 埋め込みコンポーネント(Tweet/LinkCard/AmazonLink/MoshimoAffiliate/Copyable)
   - MDXの `components` マップ(`src/components/ArticleBody/MdxContent/makeMdxComponents.tsx`)が見出し・コードブロック・埋め込み要素をReactコンポーネントにマッピングする

3. **Data Fetching**: 記事データの取得は `src/lib/content.ts` の関数群(`getBlogList`/`getAllBlogListByLocale`/`getBlogBySlugByLocale`等)経由で行う。データソースは `#content/index`(Veliteが生成する型付きJSON)。No client-side data fetching.

4. **Draft運用**: frontmatterの `draft: true` は開発環境(`npm run dev`)でのみプレビューされ、本番ビルドの全経路(一覧・詳細・sitemap・RSS・llms.txt・検索・前後記事)から除外される。実装は `velite.config.ts` の `prepare` フック(`NODE_ENV=production` で判定)。詳細は docs/writing.md 参照

5. **State Management**: Minimal client state using React Context (theme only). Most state is derived from URL params.

### Environment Setup
`microcms.ts` は管理画面(`/admin`)・AIアクセス解析ページでのみ残存しており(削除予定はIssue #243)、通常の記事取得には使用しない。管理画面を使う場合のみ以下の環境変数が必要:
```
MICROCMS_API_KEY=your_api_key
MICROCMS_SERVICE_DOMAIN=your_domain
```

### Testing Strategy
- **Unit Tests**: Components with complex logic, located in `__tests__` directories
- **E2E Tests**: Full user flows in `/e2e` directory covering navigation, SEO, accessibility, and security
- **Component Tests**: Storybook stories alongside components for visual testing
- **Content Tests**: `npm run lint:content` for article files (internal link/image path check, textlint, markdownlint, frontmatter schema)

### Key Directories
- `/content/blogs/` - 記事本体(MDX)。`{slug}/index.{ja,en}.mdx` + `{slug}/images/`(画像コロケーション)
- `/content/categories.json` - カテゴリマスタ
- `/velite.config.ts` - Velite設定(frontmatterスキーマ・draft除外・見出しid復元等)
- `/src/app/` - Next.js pages and API routes
- `/src/components/` - React components organized by feature
- `/src/lib/content.ts` - 記事データ取得層(Velite出力を情報源とする)
- `/src/lib/microcms.ts` - microCMS APIクライアント(管理画面・AIアクセス解析でのみ使用。削除予定は#243)
- `/src/components/ArticleBody/MdxContent/` - MDXレンダリングシステム
- `/src/components/ArticleBody/Embeds/` - 埋め込みコンポーネント(Tweet/LinkCard/AmazonLink/MoshimoAffiliate/Copyable)
- `/docs/writing.md` - 記事の書き方ガイド
- `/scripts/new-post.mjs` - 記事雛形生成スクリプト
- `/scripts/check-internal-links.mjs` - 内部リンク・画像パスの整合性チェック

### Important Considerations
1. **Image Optimization**: 記事画像は `content/blogs/{slug}/images/` にコロケーションし、VeliteがNext.js Imageのblurプレースホルダー用メタデータ(width/height/blurDataURL)を自動生成する。画像追加時は `npm run optimize-images` で圧縮すること(docs/writing.md参照)
2. **SEO**: Metadata and OpenGraph images are generated per page, JSON-LD structured data included
3. **Performance**: Uses standalone mode for deployment, view transitions API for smooth navigation
4. **Content Features**: Supports code syntax highlighting, Twitter embeds, Amazon link cards, もしもアフィリエイト埋め込み, and custom HTML areas

## Development Workflow
1. Make changes following the code style guidelines above
2. Validate your approach after each significant change
3. Test your changes locally: `npm run dev`
4. Run linter: `npm run lint`
5. Run tests: `npm run test`
6. **Final step**: type check
   ```bash
   tsc --noEmit
   ```
   # エラーがあれば修正してから完了
   ```