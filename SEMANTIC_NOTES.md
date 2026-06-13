# Semantic Notes

## Current Architecture

- The blog is now markdown-first.
- `articles.json` is the canonical article registry.
- `index.html` renders cards from `assets/js/main.js`.
- `blog-post.html` renders markdown articles via `blog/js/blog-post.js`.
- `about.html` uses the same theme system and shared visual language as the home page.

## Routing Semantics

- List page URL pattern: `blog-post.html?id={article-id}`
- Article IDs map directly to folders under `blog/content/`.
- Markdown image references are normalized to `blog/content/{id}/images/{file}` at render time.

## Content Semantics

- `title`, `excerpt`, `date`, and `heroName` belong in `articles.json`.
- `markdownFiles` controls article composition order.
- Multiple markdown files mean a single article assembled from ordered sections.

## Migration Semantics

- Legacy HTML article flow was removed.
- Legacy Bootstrap/Clean Blog support files were removed after `about.html` was migrated.
- If original HTML content is lost, the markdown file should explicitly say it is a migration placeholder.
- Shared visual assets may stay in `assets/images`, but article-specific assets should move into each article's `images` folder.

## Optimization Decisions

- Infinite scroll appends cards instead of repainting the grid.
- Copy-code behavior is owned only by `blog/js/blog-post.js`.
- Meta description is synced from article excerpts when available.