const renderer = {
    code(code, language) {
        // Belirtilen dili kullan, belirtilmemişse text olarak işle
        const validLanguage = language || 'text';
        
        const highlighted = Prism.highlight(
            code,
            Prism.languages[validLanguage] || Prism.languages.text,
            validLanguage
        );

        return `
            <div class="code-container">
                <span class="language-label">${validLanguage.toUpperCase()}</span>
                <button class="copy-button" onclick="copyCode(this)">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                    </svg>
                    <span>Kopyala</span>
                </button>
                <pre><code class="language-${validLanguage}">${highlighted}</code></pre>
            </div>`;
    }
};

marked.use({ renderer });

async function copyCode(button) {
    const codeBlock = button.closest('.code-container').querySelector('code');
    const text = codeBlock.textContent;

    try {
        await navigator.clipboard.writeText(text);
        const originalHTML = button.innerHTML;
        button.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <span>Kopyalandı!</span>`;

        setTimeout(() => {
            button.innerHTML = originalHTML;
        }, 2000);
    } catch (err) {
        console.error('Kopyalama hatası:', err);
    }
}

// Markdown dosyasını yükleme
async function loadMarkdownFile(filename) {
    try {
        const response = await fetch(filename);
        if (!response.ok) throw new Error(`${filename} yüklenemedi`);
        return await response.text();
    } catch (error) {
        console.error('Yükleme hatası:', error);
        return `# Hata\nDosya yüklenemedi: ${error.message}`;
    }
}

// Markdown içeriğini görüntüleme
async function loadAllMarkdownFiles(files) {
    const wrapper = document.getElementById('markdown-wrapper');
    wrapper.innerHTML = '';
    
    try {
        const results = await Promise.allSettled(
            files.map(file => loadMarkdownFile(file))
        );
        
        results.forEach(result => {
            if (result.status === 'fulfilled') {
                const container = document.createElement('div');
                container.className = 'markdown-container';
                container.innerHTML = marked.parse(result.value);
                wrapper.appendChild(container);
            }
        });
    } catch (error) {
        console.error('Dosya yükleme hatası:', error);
    }
}

// Sayfa yüklendiğinde
document.addEventListener('DOMContentLoaded', () => {
    const markdownFiles = ['llm-blog.md', 'llm-nedir.md', 'mson.md'];
    loadAllMarkdownFiles(markdownFiles);
});