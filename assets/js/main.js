class BlogManager {
    constructor() {
        this.articleGrid = document.getElementById('articleGrid');
        this.themeButtons = document.querySelectorAll('.theme-btn');
        this.currentPage = 1;
        this.articlesPerPage = 20;
        this.articles = [];
        this.loading = false;
        this.loadedArticles = new Set();

        this.initTheme();
        this.bindEvents();

        if (!this.articleGrid) {
            return;
        }

        // Sentinel element
        this.sentinel = document.createElement('div');
        this.sentinel.className = 'sentinel';
        this.articleGrid.after(this.sentinel);

        // Intersection Observer
        this.observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.loading && this.hasMoreArticles()) {
                    this.loadMoreArticles();
                }
            });
        }, {
            root: null,
            rootMargin: '150px',
            threshold: 0
        });

        this.observer.observe(this.sentinel);

        // Scroll event listener
        this.setupScrollListener();

        this.loadArticles();
    }

    setupScrollListener() {
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            if (scrollTimeout) return;

            scrollTimeout = setTimeout(() => {
                this.checkScrollPosition();
                scrollTimeout = null;
            }, 100);
        });
    }

    checkScrollPosition() {
        if (this.loading || !this.hasMoreArticles()) return;

        const scrollPosition = window.innerHeight + window.scrollY;
        const sentinelPosition = this.sentinel.offsetTop;

        if (scrollPosition > sentinelPosition - 150) {
            this.loadMoreArticles();
        }
    }

    hasMoreArticles() {
        return this.loadedArticles.size < this.articles.length;
    }

    initTheme() {
        const savedTheme = localStorage.getItem('blogTheme') || 'dark';
        document.body.dataset.theme = savedTheme;
        this.updateThemeButtons(savedTheme);
    }

    updateThemeButtons(activeTheme) {
        this.themeButtons.forEach(btn => {
            btn.classList.remove('active', 'bg-gray-700');
            if (btn.dataset.theme === activeTheme) {
                btn.classList.add('active', 'bg-gray-700');
            }
        });
    }

    bindEvents() {
        this.themeButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const theme = btn.dataset.theme;
                document.body.dataset.theme = theme;
                localStorage.setItem('blogTheme', theme);
                this.updateThemeButtons(theme);
            });
        });
    }

    async loadArticles() {
        try {
            const response = await fetch('./blog/content/articles.json');
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            this.articles = (await response.json()).articles;
            this.renderArticles();
        } catch (error) {
            console.error('Articles could not be loaded:', error);
            this.showError(`Makaleler yüklenirken bir hata oluştu: ${error.message}`);
        }
    }

    async loadMoreArticles() {
        if (this.loading || !this.hasMoreArticles()) return;

        this.loading = true;
        this.articleGrid.classList.add('loading');

        this.currentPage++;
        this.renderArticles();

        this.articleGrid.classList.remove('loading');
        this.loading = false;

        if (!this.hasMoreArticles()) {
            this.observer.unobserve(this.sentinel);
            this.sentinel.remove();
        }
    }

    renderArticles() {
        if (!this.articles.length) {
            this.showError('Henüz makale bulunmamaktadır.');
            return;
        }

        const start = (this.currentPage - 1) * this.articlesPerPage;
        const end = this.currentPage * this.articlesPerPage;

        const articlesForCurrentPage = this.articles.slice(start, end);

        if (this.currentPage === 1) {
            this.articleGrid.innerHTML = '';
            this.loadedArticles.clear();
        }

        articlesForCurrentPage.forEach(article => {
            if (!this.loadedArticles.has(article.id)) {
                const isFeatured = article.featured;
                this.articleGrid.insertAdjacentHTML('beforeend', this.createArticleCard(article, isFeatured));
                this.loadedArticles.add(article.id);
            }
        });

        if (document.body.scrollHeight <= window.innerHeight && this.hasMoreArticles()) {
            requestAnimationFrame(() => this.checkScrollPosition());
        }
    }



    createArticleCard(article, featured = false) {
        const imageHeight = featured ? 'h-80' : 'h-48';
        const titleSize = featured ? 'text-2xl' : 'text-xl';
        const padding = 'p-6';
        const columnSpan = featured ? 'col-span-full' : '';
        const articleUrl = `blog-post.html?id=${article.id}`;
        const articleHero = article.heroName || `./blog/content/${article.id}/images/hero.jpg`;

        return `
            <a href="${articleUrl}" class="${columnSpan} block article-card">
                <article class="relative rounded-xl overflow-hidden h-full">
                    <div class="relative overflow-hidden">
                        <img src="${articleHero}" 
                             alt="${article.title}" 
                             class="w-full ${imageHeight} object-cover"
                             onerror="this.src='./assets/images/default-hero.jpg'">
                    </div>
                    
                    <div class="${padding} border-t">
                        <div class="flex gap-2 mb-2  text-center">
                            ${article.tags.map(tag => `
                                <span class="text-xs px-2 py-1 bg-blue-600 rounded-full">${tag}</span>
                            `).join('')}
                        </div>
                        <span class="text-sm">${article.date}</span>
                        <h3 class="${titleSize} font-bold mt-2">${article.title}</h3>
                        <p class="mt-2">${article.excerpt}</p>
                        <div class="hover-line"></div>
                    </div>
                </article>
            </a>
        `;
    }

    showError(message) {
        this.articleGrid.innerHTML = `
            <div class="col-span-full text-center py-12">
                <p class="text-xl text-gray-400">${message}</p>
            </div>
        `;
    }
}

document.addEventListener('DOMContentLoaded', () => new BlogManager());