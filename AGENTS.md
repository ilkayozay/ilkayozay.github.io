# AGENTS.md

## Purpose

This repository is a static blog with a single live content pipeline.

## Source Of Truth

- Article index: `blog/content/articles.json`
- Article detail renderer: `blog-post.html`
- Detail logic: `blog/js/blog-post.js`
- Home listing logic: `assets/js/main.js`
- About page: `about.html` using `assets/css/main.css` and `assets/js/main.js`

## Content Rules

- New posts must live under `blog/content/{article-id}/`.
- Each article entry in `articles.json` should use `ishtml: false`.
- Primary body files should be listed in `markdownFiles`.
- Images should live in `blog/content/{article-id}/images/`.
- If a shared image from `assets/images/` is preferred for the card or hero, store it in `heroName`.

## Frontend Rules

- Do not reintroduce `html_articles`-based routing.
- Do not reintroduce the removed Bootstrap/Clean Blog asset pipeline.
- Keep the home page append-only for infinite scroll.
- Avoid inline page scripts when logic already exists in a dedicated JS file.
- Prefer small targeted CSS changes over adding one-off inline styles.

## Maintenance Notes

- If a legacy article is missing original content, keep a migration note in its markdown file instead of reviving a second rendering pipeline.
- Remove dead files and dead branches when a migration is complete.
- Shared theme behavior is intentionally owned by `assets/js/main.js` so non-list pages can reuse it.