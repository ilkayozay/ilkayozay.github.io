


class BlogPost {
    constructor() {
        this.themeButtons = document.querySelectorAll('.theme-btn');
        this.heroImage = document.getElementById('heroImage');
        this.articleTitle = document.getElementById('articleTitle');
        this.articleExcerpt = document.getElementById('articleExcerpt');
        this.articleDate = document.getElementById('articleDate');
        this.articleContent = document.getElementById('articleContent');
        this.articlesData = null;

        this.initializeThemeButtons();
        this.loadContent();
    }

    initializeThemeButtons() {
        this.themeButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.themeButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                document.body.dataset.theme = button.dataset.theme;
                localStorage.setItem('blogTheme', button.dataset.theme);
            });
        });

        const savedTheme = localStorage.getItem('blogTheme') || 'light';
        document.body.dataset.theme = savedTheme;
        this.themeButtons.forEach(btn => {
            if (btn.dataset.theme === savedTheme) {
                btn.classList.add('active');
            }
        });
    }

    async loadArticlesData() {
        try {
            const response = await fetch('./blog/content/articles.json');
            if (!response.ok) throw new Error('Articles data not found');
            this.articlesData = await response.json();
        } catch (error) {
            console.error('Error loading articles data:', error);
            this.articlesData = { articles: [] };
        }
    }

    async loadContent() {
        const urlParams = new URLSearchParams(window.location.search);
        const contentId = urlParams.get('id');

        try {
            // Önce articles.json'ı yükle
            await this.loadArticlesData();

            if (contentId) {
                const article = this.articlesData.articles.find(a => a.id === contentId);
                if (!article) throw new Error('Article not found');

                // Article meta verilerini ayarla
                this.setPageMetadata({
                    title: article.title,
                    excerpt: article.excerpt,
                    date: article.date,
                    heroImage: article.heroName || `./blog/content/${contentId}/images/hero.jpg`
                });

                await this.loadAllMarkdownFiles(contentId, article.markdownFiles);
            } else {
                this.loadDefaultContent();
            }
        } catch (error) {
            console.error('Error loading content:', error);
            this.loadDefaultContent();
        }
    }

    async loadAllMarkdownFiles(contentId, files) {
        if (!files || files.length === 0) {
            throw new Error('No markdown files specified');
        }

        this.articleContent.innerHTML = '';
        this.articleContent.dataset.articleId = contentId;

        try {
            const markdownContents = await Promise.all(
                files.map(filename =>
                    fetch(`./blog/content/${contentId}/${filename}`)
                        .then(response => {
                            if (!response.ok) throw new Error(`Failed to load ${filename}`);
                            return response.text();
                        })
                )
            );

            markdownContents.forEach(content => {
                const { content: markdownContent } = this.parseFrontMatter(content);
                const isLongformSection = this.isLongformSection(markdownContent, files.length);
                const normalizedContent = this.transformCustomBlocks(markdownContent);
                const processedContent = this.rewriteImagePaths(normalizedContent, contentId);

                const container = document.createElement('div');
                container.className = 'article-container article-rich-content';
                if (isLongformSection) {
                    container.classList.add('article-rich-content--longform');
                }
                container.innerHTML = marked.parse(processedContent, {
                    gfm: true,
                    breaks: true,
                    highlight: function(code, lang) {
                        if (Prism.languages[lang]) {
                            return Prism.highlight(code, Prism.languages[lang], lang);
                        }
                        return code;
                    }
                });
                this.articleContent.appendChild(container);
            });

            Prism.highlightAll();
            this.handleCodeBlocks();

        } catch (error) {
            console.error('Error loading markdown files:', error);
            throw error;
        }
    }

    rewriteImagePaths(markdownContent, contentId) {
        return markdownContent.replace(
            /!\[([^\]]*)\]\(([^)]+)\)|<img[^>]+src=["']([^"']+)["']/g,
            (match, altText, mdSrc, htmlSrc) => {
                const imageSource = mdSrc || htmlSrc;
                if (!imageSource || imageSource.startsWith('http') || imageSource.startsWith('/')) {
                    return match;
                }

                const imageName = imageSource.split('/').pop();
                const newPath = `./blog/content/${contentId}/images/${imageName}`;

                return mdSrc
                    ? `![${altText}](${newPath})`
                    : match.replace(imageSource, newPath);
            }
        );
    }

    isLongformSection(markdownContent, totalFiles) {
        if (totalFiles > 1) {
            return true;
        }

        return /(^:::\s*[\w-]+)|(^#{1,2}\s+.+$)|(<figure|<svg|\|.+\|.+\|)/m.test(markdownContent);
    }

    transformCustomBlocks(markdownContent) {
        const lines = markdownContent.split('\n');
        const transformed = [];
        let index = 0;

        while (index < lines.length) {
            const line = lines[index];
            const directiveMatch = line.match(/^:::\s*([\w-]+)(?:\s*\|\s*(.+))?\s*$/);

            if (!directiveMatch) {
                transformed.push(line);
                index += 1;
                continue;
            }

            const variant = directiveMatch[1].trim();
            const title = directiveMatch[2] ? directiveMatch[2].trim() : '';
            const innerLines = [];
            index += 1;

            while (index < lines.length && !/^:::\s*$/.test(lines[index])) {
                innerLines.push(lines[index]);
                index += 1;
            }

            if (index < lines.length && /^:::\s*$/.test(lines[index])) {
                index += 1;
            }

            const innerMarkdown = innerLines.join('\n').trim();
            const titleHtml = title
                ? `<p class="md-block-title md-block-title--${variant}">${this.escapeHtml(title)}</p>`
                : '';
            transformed.push(
                `<section class="md-block md-block--${variant}">${titleHtml}${marked.parse(innerMarkdown, { gfm: true, breaks: true })}</section>`
            );
        }

        return transformed.join('\n');
    }

    escapeHtml(text) {
        const htmlEscapes = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        };

        return text.replace(/[&<>"']/g, (character) => htmlEscapes[character]);
    }


    loadDefaultContent() {
        const defaultContent = `---
title: Örnek Blog Yazısı
date: March 21, 2024
heroImage: https://source.unsplash.com/random/1920x1080
---

# Hoş Geldiniz

Bu bir örnek blog yazısıdır. Markdown formatında yazılmıştır.

## Özellikler

- Tema desteği
- Markdown desteği
- Kod vurgulama

\`\`\`javascript
// Örnek kod bloğu
function hello() {
    console.log("Merhaba Dünya!");
}
\`\`\`

### Alt Başlık

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`;

        const { metadata, content } = this.parseFrontMatter(defaultContent);
        this.setPageMetadata(metadata);
        this.articleContent.innerHTML = marked.parse(content);
        Prism.highlightAll();
        this.handleCodeBlocks();
    }

    parseFrontMatter(markdown) {
        const frontMatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
        const match = markdown.match(frontMatterRegex);

        if (!match) {
            return {
                metadata: {},
                content: markdown
            };
        }

        const metadata = {};
        const frontMatterContent = match[1];
        const lines = frontMatterContent.split('\n');

        lines.forEach(line => {
            const separatorIndex = line.indexOf(':');
            if (separatorIndex === -1) {
                return;
            }

            const key = line.slice(0, separatorIndex).trim();
            const value = line.slice(separatorIndex + 1).trim();
            if (key && value) {
                metadata[key] = value;
            }
        });

        return {
            metadata,
            content: match[2]
        };
    }

    setPageMetadata(metadata) {
        if (metadata.title) {
            this.articleTitle.textContent = metadata.title;
            document.title = metadata.title;
        }

        if (metadata.excerpt) {
            this.articleExcerpt.textContent = metadata.excerpt;
            this.setMetaDescription(metadata.excerpt);
        }

        if (metadata.date) {
            this.articleDate.textContent = `Posted on ${metadata.date}`;
            this.articleDate.style.display = 'block';
        } else {
            this.articleDate.style.display = 'none';
        }

        if (metadata.heroImage) {
            this.heroImage.style.backgroundImage = `url(${metadata.heroImage})`;
        }
    }

    setMetaDescription(excerpt) {
        let descriptionTag = document.querySelector('meta[name="description"]');
        if (!descriptionTag) {
            descriptionTag = document.createElement('meta');
            descriptionTag.name = 'description';
            document.head.appendChild(descriptionTag);
        }

        descriptionTag.content = excerpt;
    }

    handleCodeBlocks() {
        const copyButtonLabel = "Copy";
        const blocks = document.querySelectorAll('pre > code[class*="language-"]');

        blocks.forEach((codeBlock) => {
            if (navigator.clipboard) {
                const block = codeBlock.parentElement;
                if (!block || block.querySelector('.code-copy-button')) {
                    return;
                }

                const button = document.createElement('button');
                const label = document.createElement('span');
                button.className = 'code-copy-button';
                button.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
            `;
                label.className = 'code-copy-button-label';
                label.textContent = copyButtonLabel;
                button.appendChild(label);

                block.style.position = 'relative';
                block.appendChild(button);

                button.addEventListener("click", async () => {
                    await copyCode(codeBlock, button, label);
                });
            }
        });

        async function copyCode(codeBlock, button, label) {
            const text = codeBlock.innerText;

            try {
                await navigator.clipboard.writeText(text);
                button.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
            `;
                label.textContent = 'Copied!';
                label.className = 'code-copy-button-label';
                button.appendChild(label);

                setTimeout(() => {
                    button.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                    </svg>
                `;
                    label.textContent = copyButtonLabel;
                    label.className = 'code-copy-button-label';
                    button.appendChild(label);
                }, 700);

            } catch (err) {
                console.error('Kopyalama başarısız:', err);
                button.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            `;
                label.textContent = 'Error!';
                label.className = 'code-copy-button-label';
                button.appendChild(label);
            }
        }
    }
}

// Script yükleme kontrolü ve başlatma
document.addEventListener('DOMContentLoaded', () => {
    if (typeof marked === 'undefined') {
        console.error('Marked library not loaded!');
        return;
    }

    marked.setOptions({
        gfm: true,
        breaks: true
    });

    new BlogPost();
});
